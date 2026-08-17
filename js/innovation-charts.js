// Charts for the innovation story — shared drawing engine, mounted directly on the
// page (no iframe). Colours come from the site's CSS variables; the numbers and
// labels come from whichever localized data file (data-en.js / data-pt.js) loads first.
// Sizing helpers (chartContainerWidth/observeChartResize/wrapAxisLabel/appendLineLegend)
// live in chart-responsive.js, loaded before this file.
function initInnovationCharts(data) {
  if (!window.d3) return;

  const css = getComputedStyle(document.documentElement);
  const cssVar = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const data1 = cssVar('--data-1', '#25588F');
  const data2 = cssVar('--data-2', '#0F8C73');
  const data3 = cssVar('--data-3', '#A66D00');

  function drawTrendChart() {
    const { trend } = data;
    const container = document.getElementById('chart-trend');

    observeChartResize(container, () => {
      container.innerHTML = '';
      const width = chartContainerWidth(container);
      const narrow = width < 560;
      const height = narrow ? 300 : 340;
      const margin = { top: 20, right: narrow ? 24 : 190, bottom: 30, left: narrow ? 36 : 45 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(container).append('svg').attr('viewBox', `0 0 ${width} ${height}`);
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
      g.append('g').attr('class', 'axis').call(d3.axisLeft(y).tickValues(niceTickValues(y, narrow ? 4 : 5)).tickFormat(d => d + '%'));

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

        // On wide screens the series name sits right at its line's end; on
        // narrow ones there isn't room for that without crushing the chart
        // itself, so it moves into a legend below (appendLineLegend, after
        // this loop) instead of being dropped.
        if (!narrow) {
          const lastValue = series.values[series.values.length - 1];
          g.append('text')
            .attr('class', 'line-label')
            .attr('x', innerWidth + 8)
            .attr('y', y(lastValue))
            .attr('dy', '0.35em')
            .text(series.name);
        }
      });

      if (narrow) {
        appendLineLegend(container, trend.series.map((s, i) => ({ name: s.name, color: lineColors[i % lineColors.length] })));
      }
    });
  }

  function drawBarChart(selector, rows, unit, highlightLabel) {
    const container = document.querySelector(selector);

    observeChartResize(container, () => {
      container.innerHTML = '';
      const width = chartContainerWidth(container);
      const compact = width < 420;
      const narrow = width < 640;
      const svg = d3.select(container).append('svg');
      // Measured, not guessed: a breakpoint-constant right margin either
      // wasted space on short labels or clipped the widest one (e.g.
      // "1950.8 M€" lost its unit at a margin sized for "42.5%").
      const rightMargin = Math.ceil(measureLabelWidth(svg, rows.map(d => d.value + unit), 'bar-label')) + 16;
      const margin = {
        top: 20,
        right: rightMargin,
        bottom: 10,
        left: compact ? Math.max(120, Math.round(width * 0.42)) : narrow ? 180 : 260
      };
      const rowHeight = compact ? 64 : narrow ? 56 : 52;
      const height = rows.length * rowHeight;
      const innerWidth = width - margin.left - margin.right;

      svg.attr('viewBox', `0 0 ${width} ${height + margin.top + margin.bottom}`);
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const maxValue = d3.max(rows, d => d.value);
      const x = d3.scaleLinear().domain([0, maxValue]).nice().range([0, innerWidth]);
      const y = d3.scaleBand().domain(rows.map(d => d.label)).range([0, height]).padding(0.3);

      g.append('g').attr('class', 'axis').call(d3.axisTop(x).tickValues(niceTickValues(x, compact ? 3 : narrow ? 4 : 5)).tickFormat(d => d + unit));
      const leftAxis = g.append('g').attr('class', 'axis').call(d3.axisLeft(y).tickSize(0)).call(axis => axis.select('.domain').remove());
      if (narrow) wrapAxisLabel(leftAxis.selectAll('.tick text'), margin.left - 16);

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
    });
  }

  function drawChangeChart() {
    const { sectorChange } = data;
    const container = document.getElementById('chart-change');

    observeChartResize(container, () => {
      container.innerHTML = '';
      const width = chartContainerWidth(container);
      const compact = width < 420;
      const narrow = width < 640;
      const svg = d3.select(container).append('svg');
      // Measured, not guessed — see drawBarChart above. A negative label
      // that doesn't fit inside its bar (below) also renders past zero using
      // this same margin, so the probe set covers both signs.
      const rightMargin = Math.ceil(measureLabelWidth(svg, sectorChange.map(d => (d.value > 0 ? '+' : '') + d.value + ' p.p.'), 'bar-label')) + 16;
      const margin = {
        top: 20,
        right: rightMargin,
        bottom: 10,
        left: compact ? Math.max(120, Math.round(width * 0.42)) : narrow ? 180 : 260
      };
      const rowHeight = compact ? 64 : narrow ? 56 : 52;
      const height = sectorChange.length * rowHeight;
      const innerWidth = width - margin.left - margin.right;

      svg.attr('viewBox', `0 0 ${width} ${height + margin.top + margin.bottom}`);
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().domain([-10, 4]).range([0, innerWidth]);
      const zeroX = x(0);
      const y = d3.scaleBand().domain(sectorChange.map(d => d.label)).range([0, height]).padding(0.3);

      // This axis's own labels ("-10 p.p.") are wider than the ones on the
      // %/M€ bar charts, and its fixed [-10,4] domain means the compact tier
      // has less room per tick to begin with — 4 ticks measured out to less
      // than 50px apart against ~53px-wide labels, so they overlapped. 2
      // ticks (domain min + zero) always resolves to comfortably-spaced,
      // meaningful reference points.
      g.append('g').attr('class', 'axis').call(d3.axisTop(x).tickValues(niceTickValues(x, compact ? 2 : narrow ? 4 : 7)).tickFormat(d => d + ' p.p.'));
      const leftAxis = g.append('g').attr('class', 'axis').call(d3.axisLeft(y).tickSize(0)).call(axis => axis.select('.domain').remove());
      if (narrow) wrapAxisLabel(leftAxis.selectAll('.tick text'), margin.left - 16);

      g.selectAll('rect')
        .data(sectorChange)
        .join('rect')
        .attr('class', d => (d.value < 0 ? 'bar negative' : 'bar'))
        .attr('y', d => y(d.label))
        .attr('height', y.bandwidth())
        .attr('x', d => (d.value < 0 ? x(d.value) : zeroX))
        .attr('width', d => Math.abs(x(d.value) - zeroX));

      // Negative bars label themselves in white *inside* the bar rather than
      // outside past its far (left) end, so the label never has to compete
      // for space with the row labels sitting right at the domain edge. But
      // that only works while the bar is wide enough to hold the text — on
      // a narrow chart a small change (e.g. -2.2 p.p.) draws a bar a few px
      // wide, and white text spilling past it onto the panel background
      // (also pale) was landing at ~1:1 contrast, unreadable. Below, each
      // negative label is measured against its own bar and, if it doesn't
      // fit, moved past the zero line instead — the one stretch of this row
      // that's always empty space when the bar itself is negative.
      g.selectAll('.bar-label')
        .data(sectorChange)
        .join('text')
        .attr('y', d => y(d.label) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'start')
        .text(d => (d.value > 0 ? '+' : '') + d.value + ' p.p.')
        .each(function (d) {
          const el = d3.select(this);
          if (d.value >= 0) {
            el.attr('class', 'bar-label').attr('x', x(d.value) + 6);
            return;
          }
          const barWidth = zeroX - x(d.value);
          const fits = this.getComputedTextLength() <= barWidth - 12;
          if (fits) {
            el.attr('class', 'bar-label bar-label-inside').attr('x', x(d.value) + 8);
          } else {
            el.attr('class', 'bar-label').attr('x', zeroX + 6);
          }
        });
    });
  }

  drawTrendChart();
  drawBarChart('#chart-segments', data.whoInnovates, '%', data.highlights.segments);
  drawChangeChart();
  drawBarChart('#chart-spending', data.spendingByRegion, ' M€', data.highlights.spending);
  drawBarChart('#chart-ip', data.ipInstruments, '%', data.highlights.ip);
}
