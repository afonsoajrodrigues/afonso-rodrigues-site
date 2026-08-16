// Charts for the innovation story — shared drawing engine, mounted directly on the
// page (no iframe). Colours come from the site's CSS variables; the numbers and
// labels come from whichever localized data file (data-en.js / data-pt.js) loads first.
function initInnovationCharts(data) {
  if (!window.d3) return;

  const css = getComputedStyle(document.documentElement);
  const cssVar = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const data1 = cssVar('--data-1', '#25588F');
  const data2 = cssVar('--data-2', '#0F8C73');
  const data3 = cssVar('--data-3', '#A66D00');
  const ink = cssVar('--ink', '#10243E');
  const muted = cssVar('--muted', '#63708A');
  const hair = cssVar('--rule', '#C9C6BF');
  const paper = cssVar('--paper', '#FAFAF9');

  function drawTrendChart() {
    const { trend } = data;
    const width = 860;
    const height = 340;
    const margin = { top: 20, right: 190, bottom: 30, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select('#chart-trend').append('svg').attr('viewBox', `0 0 ${width} ${height}`);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint().domain(trend.periods).range([0, innerWidth]).padding(0.5);

    // A fixed 0–50 domain left the bottom third of the chart empty, since every
    // series sits between ~22 and ~48. Fit the domain to the data instead, so the
    // lines fill the frame rather than floating in its upper half.
    const allValues = trend.series.flatMap(s => s.values);
    const yMin = Math.max(0, Math.floor((d3.min(allValues) - 5) / 5) * 5);
    const yMax = Math.ceil((d3.max(allValues) + 2) / 5) * 5;
    const y = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

    g.append('g').attr('class', 'axis').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
    g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%'));

    const lineColors = [data1, data2, data3];
    const line = d3.line().x((d, i) => x(trend.periods[i])).y(d => y(d));

    trend.series.forEach((series, i) => {
      const color = lineColors[i % lineColors.length];

      g.append('path').datum(series.values).attr('class', 'line').attr('stroke', color).attr('d', line);

      g.selectAll(null)
        .data(series.values)
        .join('circle')
        .attr('class', 'dot')
        .attr('fill', color)
        .attr('cx', (d, j) => x(trend.periods[j]))
        .attr('cy', d => y(d))
        .attr('r', 3.5);

      const lastValue = series.values[series.values.length - 1];
      g.append('text')
        .attr('class', 'line-label')
        .attr('x', innerWidth + 8)
        .attr('y', y(lastValue))
        .attr('dy', '0.35em')
        .text(series.name);
    });
  }

  function drawBarChart(selector, rows, unit, highlightLabel) {
    const width = 860;
    const margin = { top: 20, right: 70, bottom: 10, left: 260 };
    const rowHeight = 52;
    const height = rows.length * rowHeight;
    const innerWidth = width - margin.left - margin.right;

    const svg = d3.select(selector).append('svg').attr('viewBox', `0 0 ${width} ${height + margin.top + margin.bottom}`);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxValue = d3.max(rows, d => d.value);
    const x = d3.scaleLinear().domain([0, maxValue]).nice().range([0, innerWidth]);
    const y = d3.scaleBand().domain(rows.map(d => d.label)).range([0, height]).padding(0.3);

    g.append('g').attr('class', 'axis').call(d3.axisTop(x).ticks(5).tickFormat(d => d + unit));
    g.append('g').attr('class', 'axis').call(d3.axisLeft(y).tickSize(0)).call(axis => axis.select('.domain').remove());

    g.selectAll('rect')
      .data(rows)
      .join('rect')
      .attr('class', d => (d.label === highlightLabel ? 'bar highlight' : 'bar'))
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
      .text(d => d.value + unit);
  }

  function drawChangeChart() {
    const { sectorChange } = data;
    const width = 860;
    const margin = { top: 20, right: 70, bottom: 10, left: 260 };
    const rowHeight = 52;
    const height = sectorChange.length * rowHeight;
    const innerWidth = width - margin.left - margin.right;

    const svg = d3.select('#chart-change').append('svg').attr('viewBox', `0 0 ${width} ${height + margin.top + margin.bottom}`);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-10, 4]).range([0, innerWidth]);
    const zeroX = x(0);
    const y = d3.scaleBand().domain(sectorChange.map(d => d.label)).range([0, height]).padding(0.3);

    g.append('g').attr('class', 'axis').call(d3.axisTop(x).ticks(7).tickFormat(d => d + ' p.p.'));
    g.append('g').attr('class', 'axis').call(d3.axisLeft(y).tickSize(0)).call(axis => axis.select('.domain').remove());

    g.selectAll('rect')
      .data(sectorChange)
      .join('rect')
      .attr('class', d => (d.value < 0 ? 'bar negative' : 'bar'))
      .attr('y', d => y(d.label))
      .attr('height', y.bandwidth())
      .attr('x', d => (d.value < 0 ? x(d.value) : zeroX))
      .attr('width', d => Math.abs(x(d.value) - zeroX));

    g.selectAll('.bar-label')
      .data(sectorChange)
      .join('text')
      .attr('class', d => (d.value < 0 ? 'bar-label bar-label-inside' : 'bar-label'))
      .attr('y', d => y(d.label) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('x', d => (d.value < 0 ? x(d.value) + 8 : x(d.value) + 6))
      .attr('text-anchor', 'start')
      .text(d => (d.value > 0 ? '+' : '') + d.value + ' p.p.');
  }

  drawTrendChart();
  drawBarChart('#chart-segments', data.whoInnovates, '%', data.highlights.segments);
  drawChangeChart();
  drawBarChart('#chart-spending', data.spendingByRegion, ' M€', data.highlights.spending);
  drawBarChart('#chart-ip', data.ipInstruments, '%', data.highlights.ip);
}
