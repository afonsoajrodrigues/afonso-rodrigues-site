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

  // Clamps the tooltip inside the viewport — near the right/bottom edge of a
  // narrow phone screen, the default clientX/clientY + 14px offset pushes a
  // 230px-wide tooltip half off-screen. Reads the box only after .html() has
  // set its final content, so the measured size is accurate.
  function positionTooltip(tip, event) {
    const margin = 8;
    const rect = tip.node().getBoundingClientRect();
    const left = Math.max(margin, Math.min(event.clientX + 14, window.innerWidth - rect.width - margin));
    const top = Math.max(margin, Math.min(event.clientY + 14, window.innerHeight - rect.height - margin));
    tip.style('left', left + 'px').style('top', top + 'px');
  }

  // Sequential single-hue ramp read fresh from the theme tokens, so a theme
  // switch (chrome.js fires 'themechange') can recolour without a reload.
  // Light: --map-light → --accent-fill → --map-deep (monotonic descent).
  // Dark: the deep end would vanish into the panel, so the bright end is
  // --accent (the dark-theme ink) instead.
  function mapRamp(n) {
    const cs = getComputedStyle(document.documentElement);
    const v = (k, f) => cs.getPropertyValue(k).trim() || f;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const stops = dark
      ? [v('--map-light', '#4a6555'), v('--accent-fill', '#3d7f65'), v('--map-top', '#a9d4bd')]
      : [v('--map-light', '#8aa392'), v('--accent-fill', '#24503f'), v('--map-deep', '#143027')];
    return d3.quantize(d3.interpolateRgbBasis(stops), n);
  }

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
      colour = d3.scaleQuantize().domain([d3.min(values), d3.max(values)]).range(mapRamp(6));

      svg.selectAll('path')
        .data(geo.features)
        .join('path')
          .attr('class', 'municipality')
          .attr('d', path)
          .attr('fill', f => colour(f.data[metric]))
          .on('mousemove', showTooltip)
          .on('click', showTooltip) // tap support: touch devices never fire mousemove
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
        .style('opacity', 1);
      positionTooltip(tooltip, event);
    }

    root.querySelectorAll('[data-metric-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        metric = btn.getAttribute('data-metric-btn');
        root.querySelectorAll('[data-metric-btn]').forEach(b => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
        draw();
      });
    });

    root.querySelectorAll('[data-metric-btn]').forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('is-active'))));
    document.addEventListener('themechange', draw);
    // Touch: a tapped tooltip would otherwise float over the text while scrolling.
    window.addEventListener('scroll', () => tooltip.style('opacity', 0), { passive: true });
    draw();
  }).catch(() => {
    root.querySelector('.databox-frame').insertAdjacentHTML('beforeend', `<p class="fine-print">${strings.loadError || 'The map could not load. The data is available as a CSV:'} <a href="${config.dataUrls.csv}">${config.dataUrls.csv.split('/').pop()}</a></p>`);
  });
}
