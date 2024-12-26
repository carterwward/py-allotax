FROM nikolaik/python-nodejs:python3.11-nodejs22-slim
# Project Setup
RUN apt-get update && apt-get install -y curl build-essential
WORKDIR app
COPY ./pyproject.toml ./pdm.lock ./README.md ./
COPY  ./src ./src

# # Install Python Deps
RUN pip install pdm
RUN pdm sync

# Install JS Deps in src
RUN cd src/py_allotax && npm install allotaxonometer
# Build package and move to local
RUN pdm build

CMD ["bash"]
