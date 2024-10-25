const fs = require('fs');
const { JSDOM } = require('jsdom');
const { createAllotaxChart } = require('./AllotaxChart.js');

(async () => {
  // Dynamically import d3
  const d3 = await import('d3');

  // Create a new JSDOM instance (this is the headless window, no browser UI)
  const dom = new JSDOM();
  // Load your HTML file
  //index and index2 are the same, index2 is just cleaner.
  const htmlContent = fs.readFileSync('index.html', 'utf8');
  dom.window.document.body.innerHTML = htmlContent;
  const { document } = dom.window;
  global.document = document;  // Make document globally available

  // Accept the path to the temporary file from the command line arguments
  const tempFilePath = process.argv[2];
  // Use require to load the JavaScript module
  const { data1, data2, alpha } = require(tempFilePath);

  // Create a D3.js SVG visualization for each plot
  const diamond_svg = d3.select(".diamond_wordshift #diamondplot svg");
  const wordshift_svg = d3.select(".diamond_wordshift #wordshift svg");
  const legend_svg = d3.select(".legend_balance #legend svg");
  const balance_svg = d3.select(".legend_balance #balance svg");

  // Create the allotaxChart instance with the provided data and arguments
  await createAllotaxChart(data1, data2, alpha, { diamond_svg, wordshift_svg, legend_svg, balance_svg });

  // Serialize the SVG to a string (other methods don't provide full HTML)
  const svgString = dom.serialize();
  // save the HTML as a svg after converting it to a canvas (html2canvas)


  // Print the SVG string to the console
  console.log(svgString);
  dom.window.close(); // Close the JSDOM window
})();