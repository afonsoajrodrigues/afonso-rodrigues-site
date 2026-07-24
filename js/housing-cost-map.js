// Choropleth of house-price growth by European country — shared engine, mounted
// directly on the page (no iframe), following the same pattern as rent-map.js.
function initHousingCostMap(rootId, config) {
  const root = document.getElementById(rootId);
  if (!root || !window.d3) return;

  const svg = d3.select(root.querySelector('.databox-svg'));
  const legend = d3.select(root.querySelector('.databox-legend'));
  const tooltip = d3.select(document.getElementById(config.tooltipId));
  const strings = config.strings;

  const css = getComputedStyle(document.documentElement);
  const cssVar = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const amber = cssVar('--amber', '#D98A3D');
  const rust = cssVar('--rust', '#B5551F');
  const hair = cssVar('--hair', '#D9D2BE');

  const colorRange = d3.quantize(d3.interpolateRgbBasis(['#EAD9C4', amber, rust, '#5C2A11']), 5);

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

    const path = d3.geoPath(d3.geoMercator().fitSize([640, 600], geo));
    const values = geo.features.filter(f => f.data).map(f => f.data.growth_pct);
    const colour = d3.scaleQuantize().domain([d3.min(values), d3.max(values)]).range(colorRange);

    svg.selectAll('path')
      .data(geo.features)
      .join('path')
        .attr('class', f => (f.data ? 'country' : 'country no-data'))
        .attr('d', path)
        .attr('fill', f => (f.data ? colour(f.data.growth_pct) : hair))
        .on('mousemove', showTooltip)
        .on('mouseleave', () => tooltip.style('opacity', 0));

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
  });
}
