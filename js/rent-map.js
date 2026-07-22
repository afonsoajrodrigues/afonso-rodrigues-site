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
  const amber = cssVar('--amber', '#D98A3D');
  const rust = cssVar('--rust', '#B5551F');

  // #EAD9C4 is the palette's designated light data tone (see CLAUDE.md) — chosen
  // over --paper/--ivory because those are too close to the card background to
  // read as a colour once the cheapest municipalities are filled with it.
  // Stretched through amber and rust to a dark mahogany, so the lightness step
  // alone reads clearly as "cheap → expensive", with far more contrast between
  // bins than a cream→rust span alone.
  const colorRange = d3.quantize(d3.interpolateRgbBasis(['#EAD9C4', amber, rust, '#5C2A11']), 6);

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
