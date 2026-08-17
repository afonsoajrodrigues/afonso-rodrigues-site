// Shared responsive helpers for the D3 line/bar charts (innovation-charts.js,
// housing-cost-charts.js). These charts used to render at a fixed 860px
// canvas and lean on .databox-frame's overflow-x:auto to let people scroll
// sideways to see the rest of it — but the frame is narrower than 860px on
// every screen this site supports, including a full-width desktop .prose
// column (~700-800px), so the chart never actually fit its own box: it was
// always partly cut off, on desktop as much as on mobile. These helpers
// measure the frame's real width and let each draw function render at that
// exact size instead, redrawing live on resize/orientation change.

// Content width available inside a .databox-frame (excludes its own padding,
// which differs by breakpoint — see the 560px rule in style.css).
function chartContainerWidth(container) {
  const style = getComputedStyle(container);
  const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  return Math.max(240, Math.round(container.clientWidth - padding));
}

// Runs `draw` now, then again whenever the container's width actually
// changes (debounced via rAF) — not on every pixel of a drag-resize, and
// not just because mobile browser chrome showing/hiding changed the height.
function observeChartResize(container, draw) {
  draw();
  let lastWidth = container.clientWidth;
  let raf = null;
  const ro = new ResizeObserver(entries => {
    const width = entries[0].contentRect.width;
    if (Math.abs(width - lastWidth) < 2) return;
    lastWidth = width;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  });
  ro.observe(container);
}

// d3's scale.ticks(n)/axis.ticks(n) is only a hint — to land on "nice" round
// numbers it can return noticeably more values than asked for (e.g. a hint
// of 3 over a 0-2000 domain can come back as five: 0/500/1000/1500/2000).
// That's fine for a bare "500" but these axes suffix every tick with a unit
// (" M€", " p.p.", "%"), so the extra values were overlapping into an
// unreadable smear on narrow charts. This thins the real tick array down to
// at most maxCount entries — evenly, keeping first/last — for use with
// axis.tickValues() instead of axis.ticks().
function niceTickValues(scale, maxCount) {
  const values = scale.ticks(maxCount);
  let step = 1;
  while (Math.ceil(values.length / step) > maxCount) step++;
  return values.filter((d, i) => i % step === 0);
}

// Breaks a y-axis tick label into as many tspans as it needs to fit inside
// maxWidth, centred as a block on the tick's original single-line baseline.
// Used instead of truncating: on these charts the label is the only thing
// identifying which row is which.
function wrapAxisLabel(selection, maxWidth) {
  selection.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).filter(Boolean);
    if (words.length < 2) return;
    const x = text.attr('x');

    const probe = text.append('tspan');
    const lines = [];
    let line = [];
    words.forEach(word => {
      line.push(word);
      probe.text(line.join(' '));
      if (probe.node().getComputedTextLength() > maxWidth && line.length > 1) {
        line.pop();
        lines.push(line.join(' '));
        line = [word];
      }
    });
    lines.push(line.join(' '));
    probe.remove();
    if (lines.length < 2) { text.text(lines[0]); return; }

    text.text(null);
    const lineHeight = 1.05;
    const startDy = 0.32 - (lines.length - 1) * lineHeight / 2;
    // An SVG tspan's dy is relative to the PREVIOUS tspan's baseline, not an
    // absolute offset from the text element's own baseline — every line
    // after the first needs just the per-line increment, not
    // startDy + i*lineHeight (which under-spaced every line after the
    // second, and visibly overlapped by the third on labels long enough to
    // wrap three ways, e.g. the Portuguese copy's "Grandes empresas (250+
    // trabalhadores)").
    lines.forEach((l, i) => {
      const dy = i === 0 ? startDy : lineHeight;
      text.append('tspan').attr('x', x).attr('dy', dy + 'em').text(l);
    });
  });
}

// Measures the widest of a set of label strings as they'll actually render
// (font/weight/size come from the CSS class applied) — sizes a chart's right
// margin exactly instead of a breakpoint-guessed constant, which either
// wasted space on short labels or clipped the widest one whenever the
// dataset's longest value/unit combination changed.
function measureLabelWidth(svg, texts, className) {
  const probe = svg.append('text').attr('class', className).style('visibility', 'hidden');
  let max = 0;
  texts.forEach(t => {
    probe.text(t);
    max = Math.max(max, probe.node().getComputedTextLength());
  });
  probe.remove();
  return max;
}

// Builds a below-chart legend using the same markup/CSS as the map legends
// (.databox-legend / .databox-legend-item / .databox-legend-swatch), for
// line charts that drop their inline end-of-line labels on narrow screens.
function appendLineLegend(container, series) {
  const legend = d3.select(container).append('div').attr('class', 'databox-legend');
  series.forEach(s => {
    legend.append('div').attr('class', 'databox-legend-item')
      .html(`<span class="databox-legend-swatch" style="background:${s.color}"></span>${s.name}`);
  });
}
