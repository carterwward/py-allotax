import subprocess
import json

file_name = "./data/elem_girls@2.json"
# Data to be passed to JavaScript
# data = [
#     { 'label': 'A', 'value': 30 },
#     { 'label': 'B', 'value': 50 },
#     { 'label': 'C', 'value': 20 }
# ]
with open(file_name, "r") as f:
    test_data = json.load(f)

# Convert data to a JSON string
data_json1 = json.dumps(test_data["1880-girls.tsv"])
data_json2 = json.dumps(test_data["1885-girls.tsv"])

# Run the JavaScript file and capture its output
result = subprocess.run(['node', 'src/generate_svg_from_d3.js', data_json1, data_json2], text=True,
                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)

if result.returncode == 0:
    svg_string = result.stdout
    # Save the SVG to a file
    with open('output.svg', 'w') as svg_file:
        svg_file.write(svg_string)
    print("SVG saved as 'output.svg'")
else:
    print("Error:")
    print(result.stderr)
