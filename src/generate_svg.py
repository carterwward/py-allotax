"""Functions to generate allotaxonometer through Python.

Notes:
As a test, run in terminal:
python3 generate_svg.py convert/boys_2022.json convert/boys_2023.json output_charts/test.pdf "0.17"

If you only want the html file, not the pdf, run:
python3 generate_svg.py convert/boys_2022.json convert/boys_2023.json output_charts/test.pdf "0.17" --desired_format "html"
"""

import argparse
import json
import subprocess
import tempfile

from utils import convert_html_to_pdf


def generate_svg(
    json_file_1: str,
    json_file_2: str,
    output_file: str,
    alpha: str,
    desired_format: str = "pdf",
) -> None:
    """Generate static allotaxonometer plot using d3.js.

    Args:
        json_file_1: Path to the first json data file.
        json_file_1: Path to the second json data file.
        output_file: Path to save the output pdf file.
        alpha: Alpha value for allotaxChart.
        desired_format (optional): Desired output format (default: pdf). Provide
        "html" to exit once html file is saved.
    Notes:
        See utils.py for helpers to convert .csv or .js to .json.
    """
    # Read in .json data files as text
    with open(json_file_1, "r") as file:
        data1_json = json.loads(file.read())
    with open(json_file_2, "r") as file:
        data2_json = json.loads(file.read())

    # Write the json data to a temporary file
    temp_file_path = tempfile.mktemp(suffix=".js")
    with open(temp_file_path, "w") as file:
        file.write(f"const data1 = {json.dumps(data1_json)};\n")
        file.write(f"const data2 = {json.dumps(data2_json)};\n")
        file.write(f"const alpha = {alpha};\n")
        file.write("module.exports = { data1, data2, alpha };")

    # Command to run the JavaScript file using Node.js
    command = ["node", "generate_svg_minimum.js", temp_file_path]

    # Run the JS file and capture the output
    result = subprocess.run(command, capture_output=True, text=True)

    # Check if the command was successful
    if result.returncode == 0:
        # strip .pdf from output_file name
        file_name = output_file.rsplit(".", 1)[0]
        # Save the HTML output to a file
        with open(f"{file_name}.html", "w") as file:
            file.write(result.stdout)
        if desired_format == "html":  # quit if html is desired
            print(f"HTML saved to {file_name}.html")
            return
        print(f"HTML saved to {output_file}")
        # Convert the HTML to PDF
        convert_html_to_pdf("pyhtml2pdf", f"{file_name}.html", output_file)
    else:
        print(f"Error: {result.stderr}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate allotaxonometer plot."
    )
    parser.add_argument(
        "json_file_1", type=str, help="Path to the first json data file."
    )
    parser.add_argument(
        "json_file_2", type=str, help="Path to the second json data file."
    )
    parser.add_argument(
        "output_file", type=str, help="Path to save the output pdf file."
    )
    parser.add_argument("alpha", type=str, help="Alpha value.")

    # Optional argument
    parser.add_argument(
        "--desired_format",
        type=str,
        default="pdf",
        choices=["pdf", "html"],
        help="Desired output format (default: pdf).",
    )

    args = parser.parse_args()

    generate_svg(
        args.json_file_1,
        args.json_file_2,
        args.output_file,
        args.alpha,
        args.desired_format,
    )
