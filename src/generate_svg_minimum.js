const fs = require('fs');
const { JSDOM } = require('jsdom');
const { createAllotaxChart } = require('./AllotaxChart.js');

(async () => {
  // Dynamically import d3
  const d3 = await import('d3');

  // Create a new JSDOM instance (this is the headless window)
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const { document } = dom.window;
  global.document = document;  // Make document globally available

  // Define the HTML structure
  const structure = `
    <div class="chart-container">
        <div id="diamondplot" class="chart-section"></div>
        <div id="wordshift" class="chart-section"></div>
        <div id="legend" class="chart-section"></div>
        <div id="balance" class="chart-section"></div>
    </div>
  `;


  // Append the HTML structure to the document body
  document.body.innerHTML = structure;

  // Accept the path to the temporary file from the command line arguments
  const tempFilePath = process.argv[2];

  // Use require to load the JavaScript module
  const { data1, data2, alpha } = require(tempFilePath);

  // Define dimensions and margins
  // const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  // const width = 1000 - margin.left - margin.right;  // Adjusted width for individual SVGs
  // const height = 1000 - margin.top - margin.bottom; // Adjusted height for individual SVGs

  // Create a D3.js SVG visualization for each plot

  const diamond_svg = d3.select("#diamondplot")
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg') // Include the XML namespace
    // .style("display", "flex")
    // .style("gap", "28em")
    // .style("margin-top", "-70px")
    // .style("margin-left", "-35px")
    // .style("justify-content", "left");
    ;

  const wordshift_svg = d3.select("#wordshift")
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg') // Include the XML namespace
    // .style("display", "flex")
    // .style("gap", "28em")
    // .style("margin-left", "-300px")
    // .style("justify-content", "center")
    // .style("margin-top", "110px");
    ;

  const legend_svg = d3.select("#legend")
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg'); // Include the XML namespace
    // .style("display", "flex")
    // .style("align-items", "center")
    // .style("gap", "28em")
    // .style("margin-left", "-95px")
    // .style("justify-content", "center")
    // .style("margin-top", "-300px");

  const balance_svg = d3.select("#balance")
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg'); // Include the XML namespace
    // .style("display", "flex")
    // .style("align-items", "center")
    // .style("gap", "28em")
    // .style("margin-left", "-95px")
    // .style("justify-content", "center")
    // .style("margin-top", "-300px");


  // Create the allotaxChart instance with the provided data and arguments
  await createAllotaxChart(data1, data2, alpha, { diamond_svg, wordshift_svg, legend_svg, balance_svg });

  // Serialize the SVG to a string
  const svgString = document.body.innerHTML;

  // Print the SVG string to the console
  console.log(svgString);
})();