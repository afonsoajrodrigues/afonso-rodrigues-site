#!/usr/bin/env python3
"""Export an investigation as a Substack-ready package: PNG charts/maps + article.md.

Substack's editor only accepts raster images (PNG/JPG), not the inline SVG/D3
charts and maps this site uses. This renders the live page in headless Chrome
(via a throwaway local server, since the site uses root-relative paths),
forces the scroll-reveal animation open, waits for any D3 map to finish
fetching/drawing its geojson, then walks the article's DOM top to bottom so
output order always matches the page regardless of how a given investigation
mixes text blocks, charts, maps and a sources list. For each element it:
  - screenshots the stat grid and each chart/map figure (incl. caption) as an
    individually cropped, retina-resolution PNG
  - reconstructs the full article text as Markdown (title, byline, body,
    stat values, chart intros/captions, sources), preserving inline
    links/italics, interleaved with image references in reading order

Output goes to investigations/<slug>/article-<lang>.md and images-<lang>/, so
each investigation's EN+PT publishing material sits together in one place.
This folder is gitignored (investigations/*/) — a publishing draft, not a
site asset; the live pages stay directly in investigations/*.html.

Usage: scripts/export-for-substack.py <slug> <en|pt>
  e.g. scripts/export-for-substack.py innovation-boom en
"""
import http.server
import socketserver
import sys
import threading
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PORT = 8934

LABELS = {
    "en": {
        "key_numbers": "## Key numbers",
        "sources": "## Sources",
        "original": "Original",
        "note": "Note: consider linking back to the canonical URL above in the Substack post to avoid duplicate-content SEO issues.",
    },
    "pt": {
        "key_numbers": "## Números-chave",
        "sources": "## Fontes",
        "original": "Original",
        "note": "Nota: considera colocar um link para o URL canónico acima no post do Substack, para evitar problemas de SEO por conteúdo duplicado.",
    },
}

# Flattens an element's inline content (text + <em>/<i>/<a>) into Markdown,
# so citations, emphasis and links inside paragraphs/sources survive the
# export instead of being collapsed to plain text.
FLATTEN_JS = """
el => {
  function walk(node) {
    let out = '';
    node.childNodes.forEach(n => {
      if (n.nodeType === 3) { out += n.textContent; }
      else if (n.tagName === 'EM' || n.tagName === 'I') { out += '_' + walk(n) + '_'; }
      else if (n.tagName === 'STRONG' || n.tagName === 'B') { out += '**' + walk(n) + '**'; }
      else if (n.tagName === 'A') { out += '[' + walk(n) + '](' + n.href + ')'; }
      else { out += walk(n); }
    });
    return out;
  }
  return walk(el).replace(/\\s+/g, ' ').trim();
}
"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def log_message(self, *a):
        pass


def serve():
    # allow_reuse_address: without it, back-to-back runs of this script can hit
    # "Address already in use" while the previous run's socket sits in TIME_WAIT.
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        httpd.serve_forever()


def main():
    if len(sys.argv) != 3 or sys.argv[2] not in ("en", "pt"):
        sys.exit("Usage: scripts/export-for-substack.py <slug> <en|pt>")
    slug, lang = sys.argv[1], sys.argv[2]

    html_path = ROOT / "investigations" / f"{slug}.html" if lang == "en" else ROOT / "pt" / "investigations" / f"{slug}.html"
    if not html_path.exists():
        sys.exit(f"Not found: {html_path}")
    url_path = html_path.relative_to(ROOT).as_posix()

    out_dir = ROOT / "investigations" / slug
    img_dir = out_dir / f"images-{lang}"
    img_dir.mkdir(parents=True, exist_ok=True)
    L = LABELS[lang]

    threading.Thread(target=serve, daemon=True).start()
    time.sleep(0.5)

    md = []

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1000, "height": 1200}, device_scale_factor=2)
        page.goto(f"http://127.0.0.1:{PORT}/{url_path}", wait_until="networkidle")
        page.wait_for_selector(".article-title")

        if page.locator(".databox--map").count():
            page.wait_for_function(
                "document.querySelectorAll('.databox-svg .municipality, .databox-svg .country').length > 0",
                timeout=20000,
            )
        page.evaluate("document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'))")
        time.sleep(0.3)

        def flat(locator):
            return locator.evaluate(FLATTEN_JS)

        header = page.locator(".article-header").first
        canonical = page.locator('link[rel="canonical"]').get_attribute("href")
        chart_idx = 0

        md.append(f"# {flat(header.locator('.article-title'))}\n")
        if header.locator(".kicker").count():
            md.append(f"*{flat(header.locator('.kicker'))}*\n")
        meta_rows = header.locator(".meta-list li")
        meta = {}
        for j in range(meta_rows.count()):
            row = meta_rows.nth(j)
            spans = row.locator("span")
            meta[flat(spans.nth(0))] = flat(spans.nth(1))
        byline = meta.get("Reporting & graphics") or meta.get("Reportagem & gráficos", "")
        date = meta.get("Published") or meta.get("Publicado", "")
        if byline or date:
            md.append(f"*{byline} — {date}*\n")

        # Prose is a flat, mixed sequence (paragraphs, h2 section headers, the
        # stat grid, chart/map figures, an illustrative bar list, sources and
        # credits) — walking it top to bottom keeps export order identical to
        # the page regardless of how a given investigation mixes these.
        prose = page.locator(".prose").first
        children = prose.locator(":scope > *")
        for i in range(children.count()):
            child = children.nth(i)
            cls = child.get_attribute("class") or ""
            tag = child.evaluate("e => e.tagName.toLowerCase()")

            if tag == "h2":
                md.append(f"## {flat(child)}\n")

            elif tag == "p":
                md.append(flat(child) + "\n")

            elif "stat-grid" in cls:
                md.append(f"{L['key_numbers']}\n")
                boxes = child.locator(":scope > div")
                for j in range(boxes.count()):
                    box = boxes.nth(j)
                    md.append(f"- **{flat(box.locator('.stat-value--sm'))}** — {flat(box.locator('.stat-label'))}")
                md.append("")
                child.screenshot(path=str(img_dir / "00-stat-grid.png"))
                md.append(f"![stat grid](images-{lang}/00-stat-grid.png)\n")

            elif "chart-figure" in cls or "map-figure" in cls or "databox--map" in cls:
                chart_idx += 1
                kind = "map" if "databox--map" in cls or "map-figure" in cls else "chart"
                fname = f"{chart_idx:02d}-{kind}.png"
                child.scroll_into_view_if_needed()
                # .chart-figure .databox-frame scrolls horizontally on screen (the
                # chart's min-width, e.g. 860px, is wider than the 64ch prose
                # column) — fine for an interactive page, but screenshotting the
                # outer <figure> only captures its own (column-width) box, silently
                # cropping the scrolled-off right edge: the final data point, the
                # line-end labels. Maps don't have this (they zoom/pan inside a
                # fixed viewBox instead of scrolling), so this only fires for
                # line/bar charts. Fix: widen the frame to its full content width,
                # then screenshot the frame itself rather than the figure — an
                # element's own screenshot is its own box, not clipped by a
                # non-overflowing ancestor the way a child screenshot would be.
                target = child
                widened = child.evaluate("""
                  el => {
                    const frame = el.querySelector('.databox-frame');
                    if (!frame || getComputedStyle(frame).overflowX !== 'auto') return false;
                    // scrollWidth (measured before touching overflow/width) is the
                    // frame's true content width, incl. the scrolled-off part.
                    const fullWidth = frame.scrollWidth + 24;
                    frame.dataset.exportOverflow = frame.style.overflow;
                    frame.dataset.exportWidth = frame.style.width;
                    frame.style.overflow = 'visible';
                    frame.style.width = fullWidth + 'px';
                    // <svg> defaults to overflow: hidden itself, independent of
                    // the frame around it — widening the frame reveals the full
                    // viewBox, but a line-end label whose glyphs run a few px past
                    // that viewBox (e.g. "Construction-cost index") was still
                    // getting clipped by the svg's own box. Open that up too.
                    const svg = frame.querySelector('svg');
                    if (svg) {
                      svg.dataset.exportOverflow = svg.style.overflow;
                      svg.style.overflow = 'visible';
                    }
                    return true;
                  }
                """)
                if widened:
                    target = child.locator(".databox-frame")
                target.screenshot(path=str(img_dir / fname))
                if widened:
                    child.evaluate("""
                      el => {
                        const frame = el.querySelector('.databox-frame');
                        frame.style.overflow = frame.dataset.exportOverflow;
                        frame.style.width = frame.dataset.exportWidth;
                        delete frame.dataset.exportOverflow;
                        delete frame.dataset.exportWidth;
                        const svg = frame.querySelector('svg');
                        if (svg) {
                          svg.style.overflow = svg.dataset.exportOverflow;
                          delete svg.dataset.exportOverflow;
                        }
                      }
                    """)
                md.append(f"![{kind} {chart_idx}](images-{lang}/{fname})")
                caption = child.locator("figcaption")
                if caption.count():
                    md.append(f"*{flat(caption)}*\n")
                print("saved", fname)

            elif "article-sources" in cls:
                md.append(f"{L['sources']}\n")
                items = child.locator("li")
                for j in range(items.count()):
                    md.append(f"{j + 1}. {flat(items.nth(j))}")
                md.append("")

            elif "credits-box" in cls:
                for j in range(child.locator(".credits-row").count()):
                    md.append(f"*{flat(child.locator('.credits-row').nth(j))}*\n")

            # .article-bar-list (the illustrative rent-by-area bars) and the
            # hidden .databox-tooltip are decorative/redundant with the map
            # and stat grid above, so they're intentionally skipped here.

        browser.close()

    md.append("---")
    md.append(f"{L['original']}: {canonical}")
    md.append(L["note"])

    (out_dir / f"article-{lang}.md").write_text("\n".join(md), encoding="utf-8")
    print("done ->", out_dir)


if __name__ == "__main__":
    main()
