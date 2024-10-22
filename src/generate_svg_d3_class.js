const fs = require('fs');
const { JSDOM } = require('jsdom');
const { createAllotaxChart } = require('AllotaxChart.js');  // Use require for CommonJS

(async () => {
  // Dynamically import d3
  const d3 = await import('d3');

  // Create a new JSDOM instance (this is the headless window)
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const { document } = dom.window;
  global.document = document;  // Make document globally available

  // Accept the path to the temporary file from the command line arguments
  const tempFilePath = process.argv[2];

  // Use require to load the JavaScript module
  const { data1, data2, alpha } = require(tempFilePath);

  // Create a D3.js SVG visualization
  // add in the transformations from the plotting modules to here(?)
    // utility function in the package? We'd still need to change the way its called in our 1.1.9 version
  // there may be some issue with the headless browser rotating weirdly--is it the same as Chrome?
    //might be bigger rabbit hole... Can we specify the type of headless browser? mock Firefox?
      // may be another dependency if we mock the browser type.
  const svg = d3.select(document.body)
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg') // Include the XML namespace
    .attr('width', 400)
    .attr('height', 300);

  // Create the allotaxChart instance with the provided data and arguments
  await createAllotaxChart(data1, data2, alpha, svg);

  // Serialize the SVG to a string
  const svgString = d3.select(document.body).html();

  // Print the SVG string to the console
  console.log(svgString);
})();