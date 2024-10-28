"""Convert data files from csv or js format to json.

Note:
- CSV file must be in the final format you would use in the allotax webapp
with columns of these names and ordering: ['types', 'counts', 'total_unique', 'probs']
"""
import json
import os

import pandas as pd
from pyhtml2pdf import converter


def convert_html_to_pdf(tool: str, html_file_path: str, output_file_path: str) -> None:
    """Convert HTML to PDF using the specified tool."""
    path = os.path.abspath(html_file_path)
    match tool:
        case 'pyhtml2pdf':
            converter.convert(
                f'file:///{path}', output_file_path,
                print_options={"landscape": True, "scale": 0.8, "marginLeft": 0}
            )
            print("PDF conversion complete using pyhtml2pdf.")
        # case: implement other method for HTML conversion
        case _:
            print("Invalid tool selected.")


### Helper functions to convert data files among 3 formats: csv, json, js


def strip_export_statement(js_content):
    """Strip the 'export const data =' part from the JS content."""
    return js_content.replace('export const data =', '').strip()


def convert_csv_data(desired_format: str, path1: str, path2: str) -> None:
    """Convert 2 data files from .csv format to .json or .js format.
    Args:
        desired_format: The format to convert to ('json' or 'js').
        path1: Path to the first CSV file (with extension).
        path2: Path to the second CSV file (with extension).
    """
    extensions = {'json': '.json', 'js': '.js'}  # Supported formats

    for path in [path1, path2]:
        # Load the data
        df = pd.read_csv(f'{path}')
        # change col name total_unique to totalunique
        df.rename(columns={'total_unique': 'totalunique'}, inplace=True)
        df['probs'] = df['probs'].round(4)
        # re-order cols to types, counts, totalunique, probs
        df = df[['types', 'counts', 'totalunique', 'probs']]

        # Convert the data to a dictionary
        data = df.to_dict(orient='records')

        # Save both datasets as variables to a json file
        f_type = extensions[desired_format]
        # Re-use filename without extension (strip .csv)
        f_name = os.path.basename(path).rsplit('.', 1)[0]
        with open(f'data/{f_name}{f_type}', 'w', encoding='utf-8') as f:
            if desired_format == 'js':
                f.write(f'export const data = {json.dumps(data)};')
            else:
                json.dump(data, f, ensure_ascii=False, indent=4)


def convert_js_data(desired_format: str, path1: str, path2: str) -> None:
    """Convert 2 data files from .js format to .csv or .json format.
    Args:
        desired_format: The format to convert to ('csv' or 'json').
        path1: Path to the first .js file (with extension).
        path2: Path to the second .js file (with extension).
    """
    for path in [path1, path2]:
        # Re-use filename without extension (strip .js)
        f_name = os.path.basename(path).rsplit('.', 1)[0]

        # Load the data
        with open(f'{path}', 'r') as f:
            js_content = f.read()
            data = json.loads(strip_export_statement(js_content))
            if desired_format == 'csv':
                df = pd.DataFrame(data)
                df.to_csv(f'data/{f_name}.csv', index=False)
            else:
                with open(f'data/{f_name}.json', 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=4)
