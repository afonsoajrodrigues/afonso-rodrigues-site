// Choropleth of median rent by municipality — shared engine, mounted directly on the
// page (no iframe). Drawing logic only; each page supplies its own translated strings
// via `strings`, following the site's "static page per language" convention.
function initRentMap(rootId, config) {
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
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Sequential single-hue blue ramp (Névoa Azulada → Cobalto Suave → Azul Tinta),
  // stretched past --ink to a near-black navy so the lightness step alone still
  // reads clearly as "cheap → expensive" across all 6 bins. --map-light (not
  // --card — reusing the panel colour made the lowest-value municipalities
  // disappear into it) is a dedicated pale/dark tint of the same blue per
  // theme, so light mode reads light → accent → map-deep → near-black, a
  // monotonic descent. In dark mode the same navy/near-black stops would
  // bounce non-monotonically off a dark low anchor and the top of the scale
  // would sit at ~1:1 contrast against the panel — invisible. Use --accent
  // instead, the same accent-fill already lightened for dark-mode readability
  // by js/chrome.js, as the bright end, so the top of the scale reads as
  // clearly in the dark as the bottom does in the light.
  const colorRange = isDark
    ? d3.quantize(d3.interpolateRgbBasis([light, accent, cssVar('--accent', '#6ea2e0')]), 6)
    : d3.quantize(d3.interpolateRgbBasis([light, accent, deep, '#081527']), 6);

  let metric = 'price_m2';

  const clean = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

  Promise.all([
    d3.json(config.dataUrls.geojson),
    d3.csv(config.dataUrls.csv)
  ]).then(([geo, data]) => {
    const byMunicipality = new Map(), byNuts3 = new Map(), byNuts2 = new Map();
    data.forEach(d => {
      d.price_m2 = +d.price_m2;
      d.rent_t1_45m2 = +d.rent_t1_45m2;
      if (d.level === 'municipality') byMunicipality.set(clean(d.zone), d);
      else if (d.level === 'nuts3') byNuts3.set(clean(d.zone), d);
      else if (d.level === 'nuts2') byNuts2.set(clean(d.zone), d);
    });

    geo.features.forEach(f => {
      const p = f.properties;
      const own = byMunicipality.get(clean(p.municipality));
      f.data = own || byNuts3.get(clean(p.nuts3)) || byNuts2.get(clean(p.nuts2));
      f.ownFigure = Boolean(own);
    });

    const path = d3.geoPath(d3.geoMercator().fitSize([640, 760], geo));
    let colour;

    function draw() {
      const values = geo.features.map(f => f.data[metric]);
      colour = d3.scaleQuantize().domain([d3.min(values), d3.max(values)]).range(colorRange);

      svg.selectAll('path')
        .data(geo.features)
        .join('path')
          .attr('class', 'municipality')
          .attr('d', path)
          .attr('fill', f => colour(f.data[metric]))
          .on('mousemove', showTooltip)
          .on('mouseleave', () => tooltip.style('opacity', 0));

      drawLegend();
    }

    function drawLegend() {
      const suffix = strings.unit[metric];
      legend.html('');
      colour.range().forEach(c => {
        const [a, b] = colour.invertExtent(c);
        legend.append('div')
          .attr('class', 'databox-legend-item')
          .html(`<span class="databox-legend-swatch" style="background:${c}"></span>${Math.round(a)}–${Math.round(b)}${suffix}`);
      });
    }

    function showTooltip(event, f) {
      const value = f.data[metric];
      const text = metric === 'price_m2'
        ? '€' + value.toFixed(2) + strings.perSqm
        : '€' + Math.round(value) + strings.perMonth;
      const note = f.ownFigure ? strings.ownFigure : strings.estimatedFrom(f.data.zone);
      tooltip.html(`<b>${f.properties.municipality}</b>
         <div class="price">${text}</div>
         <div class="meta">${note}<br>${strings.districtOf(f.properties.district)}</div>`)
        .style('opacity', 1)
        .style('left', (event.clientX + 14) + 'px')
        .style('top', (event.clientY + 14) + 'px');
    }

    root.querySelectorAll('[data-metric-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        metric = btn.getAttribute('data-metric-btn');
        root.querySelectorAll('[data-metric-btn]').forEach(b => b.classList.toggle('is-active', b === btn));
        draw();
      });
    });

    draw();
  });
}
