#!/usr/bin/env python3
"""Render branded 1200x630 share-card PNGs for each investigation (EN + PT).

One-off asset generator, not part of the site's runtime — output PNGs are
committed to images/og/ and referenced directly by og:image/twitter:image
meta tags. Rasterizes an HTML template with headless Chrome (no npm/build
tooling, consistent with the rest of this static site).

Usage: scripts/generate-og-cards.py
"""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "images" / "og"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

TEMPLATE = """<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=IBM+Plex+Sans:wght@500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: #10243E;
    font-family: 'IBM Plex Sans', sans-serif;
    position: relative;
  }
  .frame { position: absolute; inset: 28px; border: 1px solid #63708A; }
  .kicker {
    position: absolute; top: 78px; left: 78px;
    font-size: 16px; font-weight: 600; letter-spacing: .2em;
    text-transform: uppercase; color: #2E5A8C;
  }
  .title {
    position: absolute; top: 128px; left: 78px; width: 660px;
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: __TITLE_SIZE__px; line-height: 1.14; color: #FAFAF9;
  }
  .icon-box {
    position: absolute; top: 150px; right: 92px;
    width: 300px; height: 300px;
    border: 1px solid #63708A;
    display: flex; align-items: center; justify-content: center;
  }
  .icon-box svg { width: 66%; height: 66%; }
  .icon-stroke {
    fill: none; stroke: #DDE5EE; stroke-width: 6;
    stroke-linecap: round; stroke-linejoin: round;
  }
  .icon-stroke-thin { stroke-width: 3.5; }
  .icon-dot { fill: #5B8FC7; }
  .icon-fill-a { fill: #1B3A5C; }
  .icon-fill-b { fill: #0B1A2C; }
  .icon-solid { fill: #DDE5EE; }
  .icon-muted { fill: none; stroke: #4E6A8C; stroke-width: 3; }
  .byline {
    position: absolute; bottom: 68px; left: 78px;
    display: flex; align-items: center; gap: 12px;
    font-size: 17px; color: #DDE5EE;
  }
  .byline b { color: #FAFAF9; font-weight: 600; }
  .byline svg { width: 30px; height: 30px; }
  .mark-stroke {
    fill: none; stroke: #FAFAF9; stroke-width: 7;
    stroke-linecap: round; stroke-linejoin: round;
  }
  .mark-dot { fill: #2E5A8C; }
</style></head>
<body>
  <div class="frame"></div>
  <div class="kicker">__KICKER__</div>
  <div class="title">__TITLE__</div>
  <div class="icon-box"><svg viewBox="0 0 120 120">__ICON__</svg></div>
  <div class="byline">
    <svg viewBox="0 0 120 120">
      <path class="mark-stroke" d="M16 98 L37 24 L58 98 M24 70 H50"/>
      <path class="mark-stroke" d="M72 98 V24 H89 a16 16 0 0 1 0 32 H72 M87 56 L104 98"/>
      <circle class="mark-dot" cx="37" cy="54" r="5.5"/>
    </svg>
    <span><b>Afonso Rodrigues</b> &mdash; __CITY__</span>
  </div>
</body></html>
"""

ICONS = {
    "house": (
        '<path class="icon-stroke" d="M52 113 Q46 118 49 120"/>'
        '<path class="icon-stroke" d="M68 113 Q74 118 71 120"/>'
        '<circle class="icon-fill-b icon-stroke" cx="60" cy="102" r="10"/>'
        '<circle class="icon-solid" cx="56" cy="100" r="1.6"/>'
        '<circle class="icon-solid" cx="64" cy="100" r="1.6"/>'
        '<path class="icon-stroke icon-stroke-thin" d="M55 106 L58 104 L60 106 L62 104 L65 106"/>'
        '<path class="icon-stroke" d="M48 90 Q34 82 16 73"/>'
        '<path class="icon-stroke" d="M72 90 Q86 82 104 73"/>'
        '<circle class="icon-solid" cx="16" cy="73" r="4.5"/>'
        '<circle class="icon-solid" cx="104" cy="73" r="4.5"/>'
        '<path class="icon-fill-a icon-stroke" d="M8 46 L60 16 L112 46 Z"/>'
        '<path class="icon-fill-b icon-stroke" d="M20 46 H100 V70 H20 Z"/>'
        '<path class="icon-solid" d="M84 24 H92 V46 H84 Z"/>'
        '<path class="icon-muted" d="M86 22 Q90 16 86 10 Q82 6 86 3"/>'
        '<circle class="icon-dot" cx="86" cy="3" r="2.5"/>'
    ),
    "prices": (
        '<path class="icon-muted" d="M14 112 H106"/>'
        '<path class="icon-stroke" d="M32 112 V52"/>'
        '<path class="icon-stroke" d="M24 112 H40"/>'
        '<path class="icon-stroke" d="M32 52 H76"/>'
        '<path class="icon-stroke icon-stroke-thin" d="M76 52 V64"/>'
        '<path class="icon-fill-a icon-stroke icon-stroke-thin" d="M70 64 H82 V74 H70 Z"/>'
        '<path class="icon-muted" d="M88 50 Q94 70 86 92 Q82 104 86 108"/>'
        '<circle class="icon-fill-b icon-stroke" cx="88" cy="28" r="17"/>'
        '<path class="icon-solid" d="M88 45 L84 51 L92 51 Z"/>'
        '<circle class="icon-solid" cx="83" cy="24" r="2.4"/>'
        '<circle class="icon-solid" cx="93" cy="24" r="2.4"/>'
        '<path class="icon-stroke icon-stroke-thin" d="M81 32 Q88 39 95 32"/>'
        '<circle class="icon-dot" cx="81" cy="19" r="3.5"/>'
    ),
    "bulb": (
        '<ellipse class="icon-fill-a icon-stroke" cx="58" cy="97" rx="28" ry="17"/>'
        '<circle class="icon-dot" cx="28" cy="87" r="3"/>'
        '<circle class="icon-dot" cx="89" cy="90" r="3"/>'
        '<g transform="rotate(9 60 60)">'
        '<path class="icon-fill-b icon-stroke" d="M60 22 Q71 22 71 39 L71 76 L49 76 L49 39 Q49 22 60 22 Z"/>'
        '<path class="icon-solid" d="M49 66 L36 82 L49 77 Z"/>'
        '<path class="icon-solid" d="M71 66 L84 82 L71 77 Z"/>'
        '<circle class="icon-fill-a icon-stroke icon-stroke-thin" cx="60" cy="44" r="9"/>'
        '</g>'
    ),
    "monogram": (
        '<path class="icon-stroke" d="M16 98 L37 24 L58 98 M24 70 H50"/>'
        '<path class="icon-stroke" d="M72 98 V24 H89 a16 16 0 0 1 0 32 H72 M87 56 L104 98"/>'
        '<circle class="icon-dot" cx="37" cy="54" r="5.5"/>'
    ),
}

CARDS = [
    dict(slug="housing-crisis", lang="en", icon="house", title_size=50,
         kicker="Investigation · Interactive Map",
         title="Portugal’s housing crisis reaches new extremes"),
    dict(slug="housing-crisis", lang="pt", icon="house", title_size=46,
         kicker="Investigação · Mapa Interativo",
         title="A crise habitacional em Portugal atinge novos extremos"),
    dict(slug="house-prices-vs-construction-costs", lang="en", icon="prices", title_size=42,
         kicker="Investigation · Data Report",
         title="Portugal’s house prices are rising far faster than the cost to build them"),
    dict(slug="house-prices-vs-construction-costs", lang="pt", icon="prices", title_size=36,
         kicker="Investigação · Relatório de Dados",
         title="Os preços da habitação em Portugal sobem muito mais depressa do que o custo de construir"),
    dict(slug="innovation-boom", lang="en", icon="bulb", title_size=48,
         kicker="Investigation · Data Report",
         title="Portugal’s innovation boom wasn’t built to last"),
    dict(slug="innovation-boom", lang="pt", icon="bulb", title_size=44,
         kicker="Investigação · Relatório de Dados",
         title="O boom da inovação em Portugal não foi feito para durar"),
    dict(slug="investigations-index", lang="en", icon="monogram", title_size=44,
         kicker="Section · Investigations",
         title="Data journalism on Portugal’s housing crisis and economy"),
    dict(slug="investigations-index", lang="pt", icon="monogram", title_size=40,
         kicker="Secção · Investigações",
         title="Jornalismo de dados sobre a crise habitacional e a economia portuguesa"),
]


def render(card, tmp_dir):
    html = (
        TEMPLATE
        .replace("__KICKER__", card["kicker"])
        .replace("__TITLE__", card["title"])
        .replace("__ICON__", ICONS[card["icon"]])
        .replace("__TITLE_SIZE__", str(card["title_size"]))
        .replace("__CITY__", "Lisboa" if card["lang"] == "pt" else "Lisbon")
    )
    name = f"{card['slug']}-{card['lang']}"
    html_path = tmp_dir / f"{name}.html"
    png_path = OUT_DIR / f"{name}.png"
    html_path.write_text(html, encoding="utf-8")

    subprocess.run(
        [
            CHROME, "--headless", "--disable-gpu",
            "--hide-scrollbars",
            "--virtual-time-budget=2000",
            f"--screenshot={png_path}",
            "--window-size=1200,630",
            f"file://{html_path}",
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(f"wrote {png_path.relative_to(ROOT)}")


def main():
    import tempfile
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        for card in CARDS:
            render(card, tmp_dir)


if __name__ == "__main__":
    sys.exit(main())
