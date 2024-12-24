FROM nikolaik/python-nodejs:python3.11-nodejs22-slim
# Install necessary dependencies
RUN apt-get update && apt-get install -y curl build-essential
WORKDIR py-allotax
# Install JS Deps
RUN npm install allotaxonometer

# Project Setup
COPY ./pyproject.toml ./pdm.lock ./README.md ./src ./

# # Install Python Deps
RUN pip install pdm
RUN pdm sync

# Build package and move to local
RUN pdm build
