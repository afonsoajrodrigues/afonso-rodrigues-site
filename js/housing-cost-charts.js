// Charts for the housing-cost story — shared drawing engine, mounted directly on the
// page (no iframe), following the same pattern as innovation-charts.js. Colours come
// from the site's CSS variables; labels come from whichever localized data file
// (housing-cost-data-en.js / -pt.js) loads first.
function initHousingCostCharts(data) {
  if (!window.d3) return;

  const css = getComputedStyle(document.documentElement);
  const cssVar = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const accent = cssVar('--accent', '#1F4E8C');
  const rust = cssVar('--rust', '#B5551F');

  function drawPriceVsCostChart() {
    const { years, housePriceIndex, constructionCostIndex, seriesNames } = data.priceVsCost;
    const width = 860;
    const height = 340;
    const margin = { top: 20, right: 160, bottom: 30, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select('#chart-price-vs-cost').append('svg').attr('viewBox', `0 0 ${width} ${height}`);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint().domain(years).range([0, innerWidth]).padding(0.5);
    const allValues = housePriceIndex.concat(constructionCostIndex);
    const yMin = Math.floor(d3.min(allValues) / 10) * 10;
    const yMax = Math.ceil(d3.max(allValues) / 10) * 10;
    const y = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

    g.append('g').attr('class', 'axis').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(5));

    const series = [
      { name: seriesNames.price, values: housePriceIndex, color: rust },
      { name: seriesNames.cost, values: constructionCostIndex, color: accent }
    ];
    const line = d3.line().x((d, i) => x(years[i])).y(d => y(d));

    series.forEach(s => {
      g.append('path').datum(s.values).attr('class', 'line').attr('stroke', s.color).attr('d', line);

      g.selectAll(null)
        .data(s.values)
        .join('circle')
        .attr('class', 'dot')
        .attr('fill', s.color)
        .attr('cx', (d, i) => x(years[i]))
        .attr('cy', d => y(d))
        .attr('r', 3.5);

      const lastValue = s.values[s.values.length - 1];
      g.append('text')
        .attr('class', 'line-label')
        .attr('fill', s.color)
        .attr('x', innerWidth + 8)
        .attr('y', y(lastValue))
        .attr('dy', '0.35em')
        .text(s.name);
    });
  }

  function drawGrowthChart() {
    const rows = data.growthByCountry;
    const width = 860;
    const margin = { top: 20, right: 70, bottom: 10, left: 150 };
    const rowHeight = 40;
    const height = rows.length * rowHeight;
    const innerWidth = width - margin.left - margin.right;

    const svg = d3.select('#chart-growth').append('svg').attr('viewBox', `0 0 ${width} ${height + margin.top + margin.bottom}`);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxValue = d3.max(rows, d => d.value);
    const x = d3.scaleLinear().domain([0, maxValue]).nice().range([0, innerWidth]);
    const y = d3.scaleBand().domain(rows.map(d => d.label)).range([0, height]).padding(0.3);

    g.append('g').attr('class', 'axis').call(d3.axisTop(x).ticks(5).tickFormat(d => d + '%'));
    g.append('g').attr('class', 'axis').call(d3.axisLeft(y).tickSize(0)).call(axis => axis.select('.domain').remove());

    g.selectAll('rect')
      .data(rows)
      .join('rect')
      .attr('class', d => (d.label === data.highlight ? 'bar highlight' : 'bar'))
      .attr('y', d => y(d.label))
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', d => x(d.value));

    g.selectAll('.bar-label')
      .data(rows)
      .join('text')
      .attr('class', 'bar-label')
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('x', d => x(d.value) + 6)
      .text(d => '+' + d.value + '%');
  }

  drawPriceVsCostChart();
  drawGrowthChart();
}
