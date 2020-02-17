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

  // y block with inner x axes
  function yAxis() {
    console.log('right y');
    const axis = d3
      .axisLeft()
      .ticks(6)
      .tickSize(-size * columns.length);

    //https://observablehq.com/@d3/selection-join

    return g =>
      g
        .selectAll('g.yblock')
        .data(y)
        .join('g') // similar to d3 data join
        .attr('transform', (d, i) => `translate(0,${i * size})`)
        .attr('class', 'yblock')
        // @ts-ignore // generate x axis for each y block
        .each(function(d) {
          // @ts-ignore
          const node = this;
          // the scale is the data
          return d3.select(node).call(axis.scale(d));
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
          // @ts-ignore
          const node = this;
          return d3.select(node).call(axis.scale(d));
        })
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').attr('stroke', '#ddd'));
  }

  // build the charts
  const svg = d3.create('svg').attr('viewBox', [-padding, 0, width, width]);

  svg.append('style').text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);

  svg.append('g').call(xAxis());

  svg.append('g').call(yAxis());

  // we do a cross product of the columns, each cell will match one element of the resulting array
  // this array gives which x and y columsn in the column array we are going to use for that
  // particulat cell

  const cell = svg
    .append('g')
    .selectAll('g')
    .data(d3.cross(d3.range(columns.length), d3.range(columns.length))) // d3.cross([0,2], [0,2]) => [0, 0] [1,0] [0,1] [1,1])
    .join('g')
    .attr('transform', ([i, j]) => `translate(${i * size},${j * size})`); // size includes padding

  cell
    .append('rect')
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('x', padding / 2 + 0.5) // each cell take size - half of the padding
    .attr('y', padding / 2 + 0.5)
    .attr('width', size - padding) // we need to remove the padding, as it's included in the transform of the cell
    .attr('height', size - padding);

  // now for each cell, we look at the index of the corresponding columns
  // we need to grab the corresponding scale for x and y, and apply the good value to them
  cell.each(function([i, j]) {
    // @ts-ignore// i and j are the  coordinates of the cell
    d3.select(this)
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => x[i](d[columns[i]]))
      .attr('cy', d => y[j](d[columns[j]]));
  });

  // we do a final pass to upadte the circle
  const circle = cell
    .selectAll('circle')
    .attr('r', 3.5)
    .attr('fill-opacity', 0.7)
    .attr('fill', d => z(d[cardinalColumn]));

  cell.call(brush, circle);

  // append the diagonal text
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
