// Charts for the housing-cost story — shared drawing engine, mounted directly on the
// page (no iframe), following the same pattern as innovation-charts.js. Colours come
// from the site's CSS variables; labels come from whichever localized data file
// (housing-cost-data-en.js / -pt.js) loads first. Sizing helpers
// (chartContainerWidth/observeChartResize/wrapAxisLabel/appendLineLegend) live in
// chart-responsive.js, loaded before this file.
function initHousingCostCharts(data) {
  if (!window.d3) return;

  const css = getComputedStyle(document.documentElement);
  const cssVar = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const data1 = cssVar('--data-1', '#25588F');
  const data3 = cssVar('--data-3', '#A66D00');

  function drawPriceVsCostChart() {
    const { years, housePriceIndex, constructionCostIndex, seriesNames } = data.priceVsCost;
    const container = document.getElementById('chart-price-vs-cost');

    observeChartResize(container, () => {
      container.innerHTML = '';
      const width = chartContainerWidth(container);
      const narrow = width < 560;
      const height = narrow ? 300 : 340;
      const margin = { top: 20, right: narrow ? 24 : 160, bottom: 30, left: narrow ? 36 : 45 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(container).append('svg').attr('viewBox', `0 0 ${width} ${height}`);
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scalePoint().domain(years).range([0, innerWidth]).padding(0.5);
      const allValues = housePriceIndex.concat(constructionCostIndex);
      const yMin = Math.floor(d3.min(allValues) / 10) * 10;
      const yMax = Math.ceil(d3.max(allValues) / 10) * 10;
      const y = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

      g.append('g').attr('class', 'axis').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(x));
      g.append('g').attr('class', 'axis').call(d3.axisLeft(y).tickValues(niceTickValues(y, narrow ? 4 : 5)));

      const series = [
        { name: seriesNames.price, values: housePriceIndex, color: data3 },
        { name: seriesNames.cost, values: constructionCostIndex, color: data1 }
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

        // On wide screens the series name sits right at its line's end; on
        // narrow ones there isn't room for that without crushing the chart
        // itself, so it moves into a legend below instead of being dropped.
        if (!narrow) {
          const lastValue = s.values[s.values.length - 1];
          g.append('text')
            .attr('class', 'line-label')
            .attr('x', innerWidth + 8)
            .attr('y', y(lastValue))
            .attr('dy', '0.35em')
            .text(s.name);
        }
      });

      if (narrow) appendLineLegend(container, series);
    });
  }

  function drawGrowthChart() {
    const rows = data.growthByCountry;
    const container = document.getElementById('chart-growth');

    observeChartResize(container, () => {
      container.innerHTML = '';
      const width = chartContainerWidth(container);
      const compact = width < 420;
      const narrow = width < 640;
      const svg = d3.select(container).append('svg');
      // Measured, not guessed — see innovation-charts.js's drawBarChart for
      // why: a breakpoint-constant right margin either wastes space on short
      // labels or clips the widest one as soon as the dataset changes.
      const rightMargin = Math.ceil(measureLabelWidth(svg, rows.map(d => '+' + d.value + '%'), 'bar-label')) + 16;
      const margin = {
        top: 20,
        right: rightMargin,
        bottom: 10,
        left: compact ? 92 : narrow ? 110 : 150
      };
      const rowHeight = compact ? 48 : narrow ? 44 : 40;
      const height = rows.length * rowHeight;
      const innerWidth = width - margin.left - margin.right;

      svg.attr('viewBox', `0 0 ${width} ${height + margin.top + margin.bottom}`);
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const maxValue = d3.max(rows, d => d.value);
      const x = d3.scaleLinear().domain([0, maxValue]).nice().range([0, innerWidth]);
      const y = d3.scaleBand().domain(rows.map(d => d.label)).range([0, height]).padding(0.3);

      g.append('g').attr('class', 'axis').call(d3.axisTop(x).tickValues(niceTickValues(x, compact ? 3 : narrow ? 4 : 5)).tickFormat(d => d + '%'));
      const leftAxis = g.append('g').attr('class', 'axis').call(d3.axisLeft(y).tickSize(0)).call(axis => axis.select('.domain').remove());
      if (narrow) wrapAxisLabel(leftAxis.selectAll('.tick text'), margin.left - 16);

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
    });
  }

  drawPriceVsCostChart();
  drawGrowthChart();
}
