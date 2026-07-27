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

        section = page.locator(".article-section").first
        canonical = page.locator('link[rel="canonical"]').get_attribute("href")
        chart_idx = 0

        children = section.locator(":scope > *")
        for i in range(children.count()):
            child = children.nth(i)
            cls = child.get_attribute("class") or ""
            tag = child.evaluate("e => e.tagName.toLowerCase()")

            if "article-body" in cls:
                md.append(f"# {flat(child.locator('.article-title'))}\n")
                if child.locator(".article-label").count():
                    md.append(f"*{flat(child.locator('.article-label'))}*\n")
                byline = flat(child.locator(".byline-name"))
                date = flat(child.locator(".article-date"))
                md.append(f"*{byline} — {date}*\n")
                for j in range(child.locator(".article-text p").count()):
                    md.append(flat(child.locator(".article-text p").nth(j)) + "\n")
                if child.locator(".stat-grid").count():
                    md.append(f"{L['key_numbers']}\n")
                    boxes = child.locator(".stat-box")
                    for j in range(boxes.count()):
                        box = boxes.nth(j)
                        md.append(f"- **{flat(box.locator('.stat-value'))}** — {flat(box.locator('.stat-label'))}")
                    md.append("")
                    child.locator(".stat-grid").screenshot(path=str(img_dir / "00-stat-grid.png"))
                    md.append(f"![stat grid](images-{lang}/00-stat-grid.png)\n")

            elif tag == "p" and "chart-intro" in cls:
                md.append(flat(child) + "\n")

            elif "chart-figure" in cls or "databox--map" in cls:
                chart_idx += 1
                kind = "map" if "databox--map" in cls else "chart"
                fname = f"{chart_idx:02d}-{kind}.png"
                child.scroll_into_view_if_needed()
                child.screenshot(path=str(img_dir / fname))
                md.append(f"![{kind} {chart_idx}](images-{lang}/{fname})")
                caption = child.locator("figcaption")
                if caption.count():
                    md.append(f"*{flat(caption)}*\n")
                print("saved", fname)

            elif "article-text" in cls:
                for j in range(child.locator("p").count()):
                    md.append(flat(child.locator("p").nth(j)) + "\n")

            elif "article-sources" in cls:
                md.append(f"{L['sources']}\n")
                items = child.locator("li")
                for j in range(items.count()):
                    md.append(f"{j + 1}. {flat(items.nth(j))}")
                md.append("")

        browser.close()

    md.append("---")
    md.append(f"{L['original']}: {canonical}")
    md.append(L["note"])

    (out_dir / f"article-{lang}.md").write_text("\n".join(md), encoding="utf-8")
    print("done ->", out_dir)


if __name__ == "__main__":
    main()
