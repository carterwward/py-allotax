import * as d3 from 'd3';

class DoughnutChart {
  constructor(svg, data) {
    this.svg = svg; // Pass the svg selection directly
    this.data = data;

    this.width = 400;
    this.height = 300;
    this.radius = Math.min(this.width, this.height) / 2;

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    // Use the passed 'svg' selection directly, no need to create a new one
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);

    this.chartGroup = this.svg
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    this.arc = d3.arc()
      .innerRadius(this.radius * 0.6)
      .outerRadius(this.radius);

    this.pie = d3.pie()
      .value(d => d.value);

    this.update();
  }

  update() {
    const arcs = this.chartGroup.selectAll('.arc')
      .data(this.pie(this.data));

    arcs.enter()
      .append('path')
      .attr('class', 'arc')
      .attr('d', this.arc)
      .attr('fill', (d, i) => this.color(i));

    arcs.exit().remove();
  }
}

export default DoughnutChart;
