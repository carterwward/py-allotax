FROM python:3.11-slim-buster
RUN apt-get update && apt-get install -y curl build-essential
USER root
# NVM Setup
ENV NVM_DIR /usr/local/nvm
RUN apt-get update && apt-get install -y curl build-essential
ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN . $NVM_DIR/nvm.sh && \
    nvm install --lts
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Project Setup
WORKDIR py-allotax
COPY ./pyproject.toml ./pdm.lock ./README.md ./

# Install required Python Deps
RUN pip install pdm
RUN pdm sync
