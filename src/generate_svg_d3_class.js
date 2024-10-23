const fs = require('fs');
const { JSDOM } = require('jsdom');
const { createAllotaxChart } = require('./AllotaxChart.js');  // Use require for CommonJS


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
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = 1200 - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;

  // const passed_svg = d3.select(document.body)
  //   .append('svg')
  //   .attr('xmlns', 'http://www.w3.org/2000/svg') // Include the XML namespace
  //   .attr('width', 400)
  //   .attr('height', 300);
  const passed_svg = d3.select(document.body)
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg') // Include the XML namespace
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);



  // Create the allotaxChart instance with the provided data and arguments
  await createAllotaxChart(data1, data2, alpha, passed_svg);

  // Serialize the SVG to a string
  const svgString = d3.select(document.body).html();

  // Print the SVG string to the console
  console.log(svgString);
})();