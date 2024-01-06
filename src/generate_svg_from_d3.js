import  {JSDOM} from 'jsdom';
import {select} from 'd3';
import { combElems } from "./combine_distributions.js";

const { document } = new JSDOM().window;

// Accept data from the command line arguments
const system1 = JSON.parse(process.argv[2]);
const system2 = JSON.parse(process.argv[3]);

// Create a D3.js SVG visualization
const svg = select(document.body)
  .append('svg')
  .attr('xmlns', 'http://www.w3.org/2000/svg') // Include the XML namespace
  .attr('width', 400)
  .attr('height', 300);


const me = combElems(system1, system2);
console.log(me)

// Serialize the SVG to a string
// const svgString = d3.select(document.body).html();

// Print the SVG string to the console
// console.log(svgString);
