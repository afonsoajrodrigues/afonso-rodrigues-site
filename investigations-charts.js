// Charts for the "Portugal's innovation boom" investigation.
// Data transcribed from INE / DGEEC, "Inquérito Comunitário à Inovação 2022-2024"
// (Community Innovation Survey, Portugal), published 10 July 2026.
// Figures are % of companies with 10+ employees, unless noted otherwise.
// Source repo: https://github.com/afonsoajrodrigues/portugal-innovation-2024

(function () {
  if (typeof d3 === 'undefined') return;

  const PALETTE = {
    gold:   '#E0A867',
    rust:   '#B6471F',
    sand:   '#EAD9B8',
    maroon: '#7E2912',
    copper: '#D07A3C',
    ink:    '#1B1813',
    muted:  '#6E665A',
    hair:   '#D8CFBC',
  };

  const FONT_MONO = "'Space Mono', monospace";

  const trend = {
    periods: ['2016–18', '2018–20', '2020–22', '2022–24'],
    series: [
      { name: 'Any innovation', values: [32.4, 48.0, 44.7, 42.5], color: PALETTE.maroon },
      { name: 'Process',        values: [28.0, 42.7, 40.4, 37.6], color: PALETTE.rust },
      { name: 'Product',        values: [23.0, 22.3, 22.6, 24.3], color: PALETTE.copper },
    ],
  };

  const segments = [
    { label: 'All companies',              value: 42.5, color: PALETTE.sand },
    { label: 'Large companies (250+)',     value: 78.7, color: PALETTE.rust },
    { label: 'Info & communication',       value: 68.9, color: PALETTE.copper },
    { label: 'Financial & insurance',      value: 59.7, color: PALETTE.gold },
  ];

  const spending = [
    { label: 'Greater Lisbon',  value: 1950.8, color: PALETTE.rust },
    { label: 'North',           value: 1713.5, color: PALETTE.copper },
    { label: 'Other regions',   value: 1200.8, color: PALETTE.gold },
  ];

  function styleAxis(sel) {
    sel.selectAll('text')
      .attr('font-family', FONT_MONO)
      .attr('font-size', 10)
      .attr('fill', PALETTE.muted);
    sel.selectAll('line').attr('stroke', PALETTE.hair);
    sel.selectAll('.domain').remove();
  }

  function drawTrendChart(selector) {
    const el = document.querySelector(selector);
    if (!el) return;

    const width = 480, height = 250;
    const margin = { top: 14, right: 100, bottom: 24, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(el).append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Line chart: share of companies reporting innovation activity, by type, 2016 to 2024');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint().domain(trend.periods).range([0, innerWidth]).padding(0.5);
    const y = d3.scaleLinear().domain([0, 50]).range([innerHeight, 0]);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(styleAxis);

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%').tickSize(0))
      .call(styleAxis);

    const line = d3.line()
      .x((d, i) => x(trend.periods[i]))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    trend.series.forEach(series => {
      g.append('path')
        .datum(series.values)
        .attr('fill', 'none')
        .attr('stroke', series.color)
        .attr('stroke-width', 2)
        .attr('d', line);

      g.selectAll(null)
        .data(series.values)
        .join('circle')
        .attr('cx', (d, i) => x(trend.periods[i]))
        .attr('cy', d => y(d))
        .attr('r', 3)
        .attr('fill', series.color);

      const last = series.values[series.values.length - 1];
      g.append('text')
        .attr('x', innerWidth + 10)
        .attr('y', y(last))
        .attr('dy', '0.32em')
        .attr('font-family', FONT_MONO)
        .attr('font-size', 10.5)
        .attr('fill', series.color)
        .text(series.name);
    });
  }

  function drawBarChart(selector, data, opts) {
    const el = document.querySelector(selector);
    if (!el) return;

    const width = 480;
    const margin = { top: 6, right: 60, bottom: 4, left: opts.leftMargin || 150 };
    const rowHeight = 40;
    const height = data.length * rowHeight;
    const innerWidth = width - margin.left - margin.right;

    const svg = d3.select(el).append('svg')
      .attr('viewBox', `0 0 ${width} ${height + margin.top + margin.bottom}`)
      .attr('role', 'img')
      .attr('aria-label', opts.ariaLabel || '');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).nice().range([0, innerWidth]);
    const y = d3.scaleBand().domain(data.map(d => d.label)).range([0, height]).padding(0.35);

    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call(styleAxis);

    g.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('y', d => y(d.label))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', d => x(d.value))
      .attr('fill', d => d.color);

    g.selectAll('.bar-label')
      .data(data)
      .join('text')
      .attr('x', d => x(d.value) + 8)
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '0.32em')
      .attr('font-family', FONT_MONO)
      .attr('font-size', 11)
      .attr('fill', PALETTE.ink)
      .text(d => opts.format(d.value));
  }

  function drawAll() {
    drawTrendChart('#chart-innovation-trend');
    drawBarChart('#chart-innovation-segments', segments, {
      ariaLabel: 'Bar chart: share of companies reporting innovation activity, by group, 2022 to 2024',
      format: d => d + '%',
    });
    drawBarChart('#chart-innovation-spending', spending, {
      ariaLabel: 'Bar chart: innovation spending by region, 2024, in millions of euros',
      format: d => '€' + d.toLocaleString('en-US') + 'M',
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawAll);
  } else {
    drawAll();
  }
})();
