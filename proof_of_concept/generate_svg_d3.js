// const d3 = require('d3');
import * as fs from 'fs';
import * as jsdom from 'jsdom';
import * as d3 from 'd3';

const { JSDOM } = jsdom;
const { document } = new JSDOM().window;

// Create a D3.js SVG visualization
const svg = d3.select(document.body)
  .append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg') // Include the XML namespace
  .attr('width', 400)
  .attr('height', 300);

svg.append('circle')
  .attr('cx', 100)
  .attr('cy', 100)
  .attr('r', 50)
  .style('fill', 'red');

// Serialize the SVG to a string
const svgString = d3.select(document.body).html();

// Save the SVG string to an SVG file
fs.writeFileSync('visualization.svg', svgString);
