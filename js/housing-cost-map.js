// Choropleth of house-price growth by European country — shared engine, mounted
// directly on the page (no iframe), following the same pattern as rent-map.js.
// Adds zoom/pan and country-code labels on top of the base choropleth, so the
// map carries the same interactivity as the standalone report it's drawn from.
function initHousingCostMap(rootId, config) {
  const root = document.getElementById(rootId);
  if (!root || !window.d3) return;

  const svg = d3.select(root.querySelector('.databox-svg'));
  const legend = d3.select(root.querySelector('.databox-legend'));
  const tooltip = d3.select(document.getElementById(config.tooltipId));
  const strings = config.strings;

  const css = getComputedStyle(document.documentElement);
  const cssVar = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const light = cssVar('--map-light', '#99acc8');
  const accent = cssVar('--accent-fill', '#1c4b8a');
  const deep = cssVar('--map-deep', '#10243E');
  const hair = cssVar('--rule', '#C9C6BF');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // See js/rent-map.js for why this ramp branches by theme and reads
  // --map-light instead of --card: reusing the panel colour made the
  // lowest-growth countries disappear into the panel, and in dark mode the
  // fixed navy/near-black stops that read as a clean light→dark descent in
  // light mode would go non-monotonic on top of a dark low anchor — use
  // --accent (already lightened for dark-mode readability) as the bright end
  // so the top of the scale stays legible against the dark panel.
  const colorRange = isDark
    ? d3.quantize(d3.interpolateRgbBasis([light, accent, cssVar('--accent', '#6ea2e0')]), 5)
    : d3.quantize(d3.interpolateRgbBasis([light, accent, deep, '#081527']), 5);
  const width = 640, height = 600;

  const zoomLayer = svg.append('g').attr('class', 'zoom-layer');
  const noDataLayer = zoomLayer.append('g').attr('class', 'no-data-layer');
  const dataLayer = zoomLayer.append('g').attr('class', 'data-layer');
  // The label layer sits outside zoom-layer and is repositioned by hand on
  // every zoom event, so country codes pan with the map but don't balloon in
  // size as it's scaled up — a plain nested transform would grow the text.
  const labelLayer = svg.append('g').attr('class', 'label-layer');

  // Plain scroll and single-finger touch are left alone so the page keeps
  // scrolling normally over the map; only a modifier-held wheel, a pinch, or
  // a mouse drag actually move the map.
  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [width, height]])
    .filter(event => {
      if (event.type === 'wheel') return event.ctrlKey || event.metaKey;
      if (event.type.startsWith('touch')) return event.touches.length > 1;
      return !event.ctrlKey && !event.button;
    })
    .on('zoom', event => {
      zoomLayer.attr('transform', event.transform);
      labelLayer.selectAll('text').attr('transform', d => {
        const [x, y] = event.transform.apply([d._cx, d._cy]);
        return `translate(${x},${y})`;
      });
    });

  svg.call(zoom);

  Promise.all([
    d3.json(config.dataUrls.geojson),
    d3.csv(config.dataUrls.csv)
  ]).then(([geo, data]) => {
    const byCode = new Map();
    data.forEach(d => {
      d.growth_pct = +d.growth_pct;
      d.cagr_pct = +d.cagr_pct;
      byCode.set(d.code, d);
    });

    geo.features.forEach(f => { f.data = byCode.get(f.properties.code); });

    const path = d3.geoPath(d3.geoMercator().fitSize([width, height], geo));
    const withData = geo.features.filter(f => f.data);
    const withoutData = geo.features.filter(f => !f.data);
    const values = withData.map(f => f.data.growth_pct);
    const colour = d3.scaleQuantize().domain([d3.min(values), d3.max(values)]).range(colorRange);

    noDataLayer.selectAll('path')
      .data(withoutData)
      .join('path')
        .attr('class', 'country no-data')
        .attr('d', path)
        .attr('fill', hair)
        .on('mousemove', showTooltip)
        .on('click', showTooltip)
        .on('mouseleave', hideTooltip);

    dataLayer.selectAll('path')
      .data(withData)
      .join('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('fill', f => colour(f.data.growth_pct))
        .on('mousemove', showTooltip)
        .on('click', showTooltip)
        .on('mouseleave', hideTooltip);

    withData.forEach(f => { [f._cx, f._cy] = path.centroid(f); });

    labelLayer.selectAll('text')
      .data(withData)
      .join('text')
        .attr('class', 'country-label')
        .attr('transform', f => `translate(${f._cx},${f._cy})`)
        .text(f => f.properties.code);

    colour.range().forEach(c => {
      const [a, b] = colour.invertExtent(c);
      legend.append('div')
        .attr('class', 'databox-legend-item')
        .html(`<span class="databox-legend-swatch" style="background:${c}"></span>+${Math.round(a)}–${Math.round(b)}%`);
    });

    function showTooltip(event, f) {
      const name = strings.countryNames[f.properties.code] || f.properties.name;
      if (!f.data) {
        tooltip.html(`<b>${name}</b><div class="meta">${strings.noData}</div>`)
          .style('opacity', 1)
          .style('left', (event.clientX + 14) + 'px')
          .style('top', (event.clientY + 14) + 'px');
        return;
      }
      tooltip.html(`<b>${name}</b>
         <div class="price">+${f.data.growth_pct.toFixed(1)}%</div>
         <div class="meta">${strings.cagr(f.data.cagr_pct.toFixed(1))}</div>`)
        .style('opacity', 1)
        .style('left', (event.clientX + 14) + 'px')
        .style('top', (event.clientY + 14) + 'px');
    }

    function hideTooltip() { tooltip.style('opacity', 0); }
  });

  // Toolbar toggles for the labels / no-data layers — independent on/off
  // buttons, unlike the exclusive metric buttons on the rent map.
  root.querySelectorAll('[data-toggle-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const layer = btn.getAttribute('data-toggle-btn') === 'labels' ? labelLayer : noDataLayer;
      const isActive = btn.classList.toggle('is-active');
      layer.style('display', isActive ? null : 'none');
    });
  });

  // Zoom buttons drive the same d3.zoom behaviour as scroll/drag, so button
  // clicks and gestures stay in sync.
  root.querySelectorAll('[data-zoom]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-zoom');
      if (action === 'in') svg.transition().duration(200).call(zoom.scaleBy, 1.5);
      else if (action === 'out') svg.transition().duration(200).call(zoom.scaleBy, 1 / 1.5);
      else svg.transition().duration(200).call(zoom.transform, d3.zoomIdentity);
    });
  });
}
