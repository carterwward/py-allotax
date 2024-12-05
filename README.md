# Allotaxonometer through Python

The `py-allotax` implements a python interface to the `allotaxonometer` library. The tool here provides a way for users to input data and arguments and receive back a saved plot! The tool is designed to be used in a command line or in a python notebook in a few lines of code (see usage instructions at the bottom).

## Installation steps

1. If JavaScript tool installs are needed (never used or installed `npm`, `nvm`, `node`):
    1. Here are the recommended [steps to install `nvm`](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating). `nvm` is a node version manager that streamlines installing the other

    2. Once you have `nvm`, you can run this line to install the latest of both:
        ```shell
        nvm install --lts
        ```
    - Otherwise (not recommended): [steps to install individually install `node` and `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
1. One package depends on having Chrome (brower) or Chromium (browser driver) installed. **If you have Chrome installed, you can skip this step**. Otherwise, install Chrome or Chromium.
Here is the link for the [Chromium download](https://www.chromium.org/getting-involved/download-chromium/).

1. Clone this repo and install the requirements:
    ```shell
    git clone https://github.com/carterwward/py-allotax.git &&
    cd py-allotax &&
    npm install @ungap/structured-clone d3 jsdom jstonge/allotaxonometer#py-allotax-experimental &&
    pip install pandas pyhtml2pdf
    ```
(*note: we will eventually package this repo and streamline installation. See `raw_requirements.txt` for versions and notes if trouble abounds.*)

## Structure
- inside `src`:
    - <u>`generate_svg.py` is the main script to generate the pdf. You can run this from command line or in a notebook.</u>
    - `AllotaxChart.js` and `generate_svg_minimum.js` are the JavaScript files calculating the data and generating the plot in HTML before piping when `generate_svg.py` is run.
    - `utils.py` contains helper functions to convert your data files between `csv`, `json`, and `js` formats if needed.
    - `convert/`: test data
    - `data/`: where you can place your data
    - `output_charts/`: where the output html and pdf will be saved (see output examples here)
- `allo_diagram.drawio` is a diagram of the allotaxonometer ecosystem.
- `raw_requirements.txt` contains the raw requirements for the project which will eventually be used for packaging.
- Once you set up your ecosystem, you will see `node_modules/`, which will contain the `npm` packages.

## Usage instructions
*(also see examples.ipynb)*
1. Verify your data is in the required format (`.json`) by seeing json examples in `convert/`.
    - See helper functions in `utils` to convert among `csv`, `json`, and `js` formats.
1. Add your 2 system's files. You need 2 `data.json` files, one for each system.
1. Run the following to test that the library works for you. Note `alpha` needs to be passed as a string. If using`infinity`, pass `"inf"`.
    ```shell
    cd src &&
    python3 generate_svg.py convert/boys_2022.json convert/boys_2023.json output_charts/test.pdf "0.17"
    ```
Verify this test against `output_charts/sample.pdf`.
1. If working in a python notebook or scripting, you can import the function and use it directly:
    ```python
    from generate_svg import generate_svg
    generate_svg("convert/boys_2022.json", "convert/boys_2023.json", "output_charts/test.pdf", "0.17")
    ```


To get help, you can run the following `python generate_svg.py --help`. This is going to show the following:
```sh
usage: generate_svg.py [-h] [--desired_format {pdf,html}] json_file_1 json_file_2 output_file alpha title1 title2 
                                                                                                                  
Generate allotaxonometer plot.                                                                                    
                                                                                                                  
positional arguments:                                                                                             
  json_file_1           Path to the first json data file.                                                         
  json_file_2           Path to the second json data file.                                                        
  output_file           Path to save the output pdf file.                                                         
  alpha                 Alpha value.                                                                              
  title1                Title system 1                                                                            
  title2                Title system 2.                                                                           
                                                                                                                  
options:                                                                                                          
  -h, --help            show this help message and exit                                                           
  --desired_format {pdf,html}                                                                                     
                        Desired output format (default: pdf).
````
=======
## Resources
- [Allotaxonometer](https://github.com/jstonge/allotaxonometer)
- [Allotaxonometer web app](https://allotaxp.vercel.app/)
- The work and paper leading to these tools is [here](https://doi.org/10.1140/epjds/s13688-023-00400-x).
