# Allotax through Python: proof of concept

## Installation steps

1. If environment install is needed (never used or installed `npm`, `nvm`, `node`):
    - Here are the recommended [steps to install `nvm`](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating). `nvm` is a node version manager that streamlines installing the other 2.
    - If you have `nvm`, you can do:
        ```shell
        nvm install --lts
        ```
    to install the latest of both.
    - Otherwise: [steps to install `node` and `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
1. One package depends on having Chrome (brower) or Chromium (browser driver) installed. If you have Chrome installed, you can skip this step. Otherwise, install Chrome or Chromium.
Here is the link for the [Chromium download](https://www.chromium.org/getting-involved/download-chromium/).

1. Install the following:
    ```shell
    git clone https://github.com/carterwward/py-allotax.git &&
    cd py-allotax &&
    npm install d3 jsdom jstonge/allotaxonometer#py-allotax-experimental &&
    pip install pandas pyhtml2pdf
    ```
(*note: we are in the process of replacing the HTML->PDF generation method to remove `pyhtml2pdf` dependency*)

## Usage instructions
1. Verify your data is in the required format by seeing the example in `data/test_data`.
    - See helper functions in `utils` to convert among `csv`, `json`, and `js` formats.
1. Add your 2 system's files to the `data` folder. You need 2 `data.js` files, one for each system.
1. Run the following to test that the library works for you. Note `alpha` needs to be passed as a string. If using`infinity`, pass `"inf"`.
    ```shell
    cd src &&
    python3 generate_svg.py convert/boys_2022.json convert/boys_2023.json output_charts/test.pdf "0.17"
    ```
Verify this test against `data/sample.pdf`.
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
