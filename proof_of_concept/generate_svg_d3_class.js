import * as fs from 'fs';
import *  as jsdom from 'jsdom';
import * as d3 from 'd3';
const { JSDOM } = jsdom;

import DoughnutChart from './DoughnutChart.js';

const { document } = new JSDOM().window;

// Accept data from the command line arguments
const data = JSON.parse(process.argv[2]);
// const data = [
//     { 'label': 'A', 'value': 30 },
//     { 'label': 'B', 'value': 50 },
//     { 'label': 'C', 'value': 20 }
// ]

// Create a D3.js SVG visualization
const svg = d3.select(document.body)
  .append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg') // Include the XML namespace
  .attr('width', 400)
  .attr('height', 300);

// Create a Doughnut Chart by calling the class with your data
const doughnutChart = new DoughnutChart(svg, data);

// Serialize the SVG to a string
const svgString = d3.select(document.body).html();

// Print the SVG string to the console
console.log(svgString);
