"""Functions to generate allotaxonometer SVG using D3.js.

Notes:
As a test, run in terminal:
python3 generate_svg.py data/boys_2022.js data/boys_2023.js output_charts/test2.html "0.17"
"""

import argparse
import json
import subprocess
import tempfile

from utils import strip_export_statement


def generate_svg(js_file_1: str, js_file_2: str, output_file: str, alpha: str):
    """Generate allotaxonometer SVG using D3.js.

    Args:
        js_file_1: Path to the first JS data file.
        js_file_2: Path to the second JS data file.
        output_file: Path to save the output SVG file.
        alpha: Alpha value for allotaxChart.
    """
    # Read in .js data files as text
    with open(js_file_1, 'r') as file:
        data1_text = file.read()
    with open(js_file_2, 'r') as file:
        data2_text = file.read()

    # TODO: make everything just JSON. The library seemed to need .js files/was written to use them,
    # but this version of the npm lib seems to only work with JSON anyway.
    # Strip the 'export const data =' part and parse the remaining content as JSON
    data1_json = json.loads(strip_export_statement(data1_text))
    data2_json = json.loads(strip_export_statement(data2_text))

    # Write the js data to a temporary file
    temp_file_path = tempfile.mktemp(suffix='.js')
    with open(temp_file_path, 'w') as file:
        file.write(f'const data1 = {json.dumps(data1_json)};\n')
        file.write(f'const data2 = {json.dumps(data2_json)};\n')
        file.write(f'const alpha = {alpha};\n')
        file.write('module.exports = { data1, data2, alpha };')

    # Command to run the JavaScript file using Node.js
    command = ['node', 'generate_svg_minimum.js', temp_file_path]

    # Run the JS file and capture the output
    result = subprocess.run(command, capture_output=True, text=True)

    # Check if the command was successful
    if result.returncode == 0:
        # Save the HTML output to a file
        with open(output_file, 'w') as file:
            file.write(result.stdout)
        print(f"HTML saved to {output_file}")
    else:
        print(f"Error: {result.stderr}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate allotaxonometer SVG using D3.js.')
    parser.add_argument('js_file_1', type=str, help='Path to the first js data file.')
    parser.add_argument('js_file_2', type=str, help='Path to the second js data file.')
    parser.add_argument('output_file', type=str, help='Path to save the output SVG file.')
    parser.add_argument('alpha', type=str, help='Alpha value for allotaxChart.')

    args = parser.parse_args()

    generate_svg(args.js_file_1, args.js_file_2, args.output_file, args.alpha)
