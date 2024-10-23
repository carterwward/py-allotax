"""Convert data files from the csv format to the js format.

Note: CSV file must be in the final format you would use in the allotax webapp
with columns of these names and ordering: ['types', 'counts', 'total_unique', 'probs']
"""

import argparse
import json

import pandas as pd


# TODO: make obselete after full implementation
# TODO: add function converting from any of csv, json, or js to JSON (?)
def strip_export_statement(js_content):
    """Strip the 'export const data =' part from the JS content."""
    return js_content.replace('export const data =', '').strip()


# TODO change this to hold 2 datafiles in a 'convert' folder, then just run the script on the folder and save both outputs to the same .js file
def convert_csv_data(desired_name: str, path1: str, path2: str) -> None:
    """Convert 2 data files from the csv format to the js format."""

    for path in [path1, path2]:
        # Load the data
        df = pd.read_csv(f'{path}.csv')
        # change col name total_unique to totalunique
        df.rename(columns={'total_unique': 'totalunique'}, inplace=True)
        df['probs'] = df['probs'].round(4)
        # re-order cols to types, counts, totalunique, probs
        df = df[['types', 'counts', 'totalunique', 'probs']]

        # Convert the data to a dictionary
        data = df.to_dict(orient='records')

        # Save both datasets as variables to a js file
        with open(f'data/{desired_name}.js', 'w', encoding='utf-8') as f:
            f.write(f'export const data = {json.dumps(data)};')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Convert CSV to JS.')
    parser.add_argument('desired_name', type=str, help='The desired name for the output JS file')
    parser.add_argument('path1', type=str, help='The path to the CSV for system 1')
    parser.add_argument('path2', type=str, help='The path to the CSV for system 2')

    args = parser.parse_args()

    convert_csv_data(args.desired_name, args.path1, args.path2)

    # RUN USING THIS IN TERMINAL:
    # python convert_data.py output_name input_file1.csv input_file2.csv
