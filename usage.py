import subprocess
import json

# Data to be passed to JavaScript
data = [
    { 'label': 'A', 'value': 30 },
    { 'label': 'B', 'value': 50 },
    { 'label': 'C', 'value': 20 }
]

# Convert data to a JSON string
data_json = json.dumps(data)

# Run the JavaScript file and capture its output
result = subprocess.run(['node', 'generate_svg_d3_class.js', data_json], text=True,
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
