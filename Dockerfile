FROM docker.io/nikolaik/python-nodejs:python3.11-nodejs22
# Project Setup
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config
WORKDIR app
COPY ./pyproject.toml ./pdm.lock ./README.md ./
COPY  ./src ./src

# # Install Python Deps
RUN pip install pdm
RUN pdm sync

# Install JS Deps in src
RUN cd src/py_allotax && npm install
# Build package and move to local
RUN pdm build

CMD ["bash"]
