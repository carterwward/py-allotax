# Allotax svg proof of concept

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
    git clone https://github.com/jstonge/mini_allotax.git &&
    cd mini_allotax &&
    npm install allotaxonometer@1.1.9 d3 jsdom
    ```

## Usage instructions
1. Verify your data is in the required format by seeing the example in `data/test_data`.
1. Add your 2 system's files to the `data` folder. You need 2 `data.js` files, one for each system.
1. Run the following. Note `alpha` needs to be passed as a string. If using`infinity`, pass `"inf"`.
    ```shell
    python3 generate_svg.py data/data1.js data/data2.js output.svg "alpha_as_str"
    ```
1. If working in a notebook or scripting, you can import the function and use it directly:
    ```python
    from generate_svg import generate_svg
    generate_svg("data/data1.js", "data/data2.js", "output_charts/output.svg", "alpha_as_str")
    ```