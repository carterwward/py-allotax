FROM nikolaik/python-nodejs:python3.11-nodejs22-slim
# Project Setup
RUN apt-get update && apt-get install -y curl build-essential
WORKDIR py-allotax
COPY ./pyproject.toml ./pdm.lock ./README.md ./
COPY  ./src ./src

# # Install Python Deps
RUN pip install pdm
RUN pdm sync

# Install JS Deps in src
RUN cd src && npm install allotaxonometer
RUN ls src
RUN ls ./
# Build package and move to local
RUN pdm build
