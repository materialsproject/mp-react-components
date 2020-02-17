import * as d3 from 'd3';
import { swatches } from 'd3-color-legend';

//

export function getSVGNode(data: any, cardinalColumn, width, padding) {
  //const data: any = iris;
  //const padding = 10;
  //const width = 1000;
  data.columns = Object.keys(data[0]);
  //

  const columns = data.columns.filter(d => d !== cardinalColumn);

  const size = (width - (columns.length + 1) * padding) / columns.length + padding;

  // x is an array of scale for each attributes oft the domain
  const x = columns.map(c =>
    d3
      .scaleLinear()
      .domain(d3.extent(data, d => d[c]))
      .rangeRound([padding / 2, size - padding / 2])
  );

  // i would expect y to be the same, but dont y start from the bottom to the top, so we need to update the ranges
  const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]));

  const z = d3
    .scaleOrdinal()
    .domain(data.map(d => d[cardinalColumn]))
    .range(d3.schemeCategory10);

  // y axis
  function yAxis() {
    console.log('right y');
    const axis = d3
      .axisLeft()
      .ticks(6)
      .tickSize(-size * columns.length);
    return g =>
      g
        .selectAll('g')
        .data(y)
        .join('g')
        .attr('transform', (d, i) => `translate(0,${i * size})`)
        // @ts-ignore
        .each(function(d) {
          return d3.select(this).call(axis.scale(d));
        })
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'));
  }

  // x axis
  function xAxis() {
    console.log('right x');
    const axis = d3
      .axisBottom()
      .ticks(6)
      .tickSize(size * columns.length);
    return g =>
      g
        .selectAll('g')
        .data(x)
        .join('g')
        .attr('transform', (d, i) => `translate(${i * size},0)`)
        // @ts-ignore
        .each(function(d) {
          return d3.select(this).call(axis.scale(d));
        })
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'));
  }

  // build the charts
  const svg = d3.create('svg').attr('viewBox', [-padding, 0, width, width]);

  svg.append('style').text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

  svg.append('g').call(xAxis());

  svg.append('g').call(yAxis());

  const cell = svg
    .append('g')
    .selectAll('g')
    .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
    .join('g')
    .attr('transform', ([i, j]) => `translate(${i * size},${j * size})`);

  cell
    .append('rect')
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('x', padding / 2 + 0.5)
    .attr('y', padding / 2 + 0.5)
    .attr('width', size - padding)
    .attr('height', size - padding);

  cell.each(function([i, j]) {
    // @ts-ignore
    d3.select(this)
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x[i](d[columns[i]]))
      .attr('cy', d => y[j](d[columns[j]]));
  });

  const circle = cell
    .selectAll('circle')
    .attr('r', 3.5)
    .attr('fill-opacity', 0.7)
    .attr('fill', d => z(d[cardinalColumn]));

  cell.call(brush, circle);

  svg
    .append('g')
    .style('font', 'bold 10px sans-serif')
    .style('pointer-events', 'none')
    .selectAll('text')
    .data(columns)
    .join('text')
    .attr('transform', (d, i) => `translate(${i * size},${i * size})`)
    .attr('x', padding)
    .attr('y', padding)
    .attr('dy', '.71em')
    .text(d => d);

  return svg.node();

  //
  function brush(cell, circle) {
    const brush = d3
      .brush()
      .extent([
        [padding / 2, padding / 2],
        [size - padding / 2, size - padding / 2]
      ])
      .on('start', brushstarted)
      .on('brush', brushed)
      .on('end', brushended);

    cell.call(brush);

    let brushCell;

    // Clear the previously-active brush, if any.
    function brushstarted() {
      // @ts-ignore
      if (brushCell !== this) {
        d3.select(brushCell).call(brush.move, null);
        // @ts-ignore
        brushCell = this;
      }
    }

    // Highlight the selected circles.
    function brushed([i, j]) {
      if (d3.event.selection === null) return;
      const [[x0, y0], [x1, y1]] = d3.event.selection;
      circle.classed('hidden', d => {
        return (
          x0 > x[i](d[columns[i]]) ||
          x1 < x[i](d[columns[i]]) ||
          y0 > y[j](d[columns[j]]) ||
          y1 < y[j](d[columns[j]])
        );
      });
    }

    // If the brush is empty, select all circles.
    function brushended() {
      if (d3.event.selection !== null) return;
      circle.classed('hidden', false);
    }
  }
}
