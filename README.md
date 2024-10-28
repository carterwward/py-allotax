# Allotax through Python: proof of concept

## Installation steps

1. If environment install is needed (never used or installed `npm`, `nvm`, `node`):
    - [steps to install `nvm`](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating). `nvm` is a node version manager that streamlines installing the other 2.
    - If you have `nvm`, you can do:
        ```shell
        nvm install --lts
        ```
    to install the latest of both.
    - Otherwise: [steps to install `node` and `npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).


1. Install the following packages:
    ```shell
    git clone https://github.com/carterwward/py-allotax.git &&
    cd py-allotax &&
    npm install jstonge/allotaxonometer#py-allotax-experimental
    ```

## Usage instructions
1. Verify your data is in the required format by seeing the example in `data/test_data`.
    - See helper functions in `utils` to convert among `csv`, `json`, and `js` formats.
1. Add your 2 system's files to the `data` folder. You need 2 `data.js` files, one for each system.
1. Run the following to test that the library works for you. Note `alpha` needs to be passed as a string. If using`infinity`, pass `"inf"`.
    ```shell
    python3 generate_svg.py convert/boys_2022.json convert/boys_2023.json output_charts/test.pdf "0.17"
    ```
Verify this test against `data/sample.pdf`.
1. If working in a python notebook or scripting, you can import the function and use it directly:
    ```python
    from generate_svg import generate_svg
    generate_svg("convert/boys_2022.json", "convert/boys_2023.json", "output_charts/test.pdf", "0.17")
    ```