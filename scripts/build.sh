#!/bin/bash

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
# Build package
docker build --no-cache -t allotax .
docker rm allotax
docker run --name allotax allotax
docker cp allotax:/app/dist ./dist
docker stop allotax
