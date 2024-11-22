import argparse
import json
import subprocess
import tempfile
import os
from utils import convert_html_to_pdf


def generate_svg(json_file_1, json_file_2, output_file, alpha, title1, title2):
    with open(json_file_1, 'r') as file:
        data1_json = json.load(file)
    with open(json_file_2, 'r') as file:
        data2_json = json.load(file)

    with tempfile.NamedTemporaryFile(suffix='.js', delete=False) as temp_file:
        temp_file.write(f'const data1 = {json.dumps(data1_json)};\n'.encode())
        temp_file.write(f'const data2 = {json.dumps(data2_json)};\n'.encode())
        temp_file.write(f'const alpha = {float(alpha)};\n'.encode())
        temp_file.write(f'const title1 = "{title1}";\n'.encode())
        temp_file.write(f'const title2 = "{title2}";\n'.encode())
        temp_file.write('module.exports = { data1, data2, alpha, title1, title2 };'.encode())
        temp_file_path = temp_file.name

    command = ['node', 'generate_svg_minimum.js', temp_file_path]
    result = subprocess.run(command, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error running Node.js script: {result.stderr}")
        return

    html_content = result.stdout.strip()
    if not html_content:
        print("Error: No HTML content was generated.")
        return

    file_name = output_file.rsplit('.', 1)[0]
    html_file_path = f'{file_name}.html'
    with open(html_file_path, 'w') as file:
        file.write(html_content)

    if not os.path.exists(html_file_path) or os.path.getsize(html_file_path) == 0:
        print(f"Error: HTML file {html_file_path} is empty or does not exist.")
        return

    convert_html_to_pdf('pyhtml2pdf', html_file_path, output_file)
    print(f"PDF saved to {output_file}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate allotaxonometer SVG using D3.js.')
    parser.add_argument('json_file_1', type=str, help='Path to the first json data file.')
    parser.add_argument('json_file_2', type=str, help='Path to the second json data file.')
    parser.add_argument('output_file', type=str, help='Path to save the output pdf file.')
    parser.add_argument('alpha', type=str, help='Alpha value for allotaxChart.')
    parser.add_argument('title1', type=str, help='Title for System 1')
    parser.add_argument('title2', type=str, help='Title for System 2')

    args = parser.parse_args()
    generate_svg(args.json_file_1, args.json_file_2, args.output_file, args.alpha, args.title1, args.title2)
