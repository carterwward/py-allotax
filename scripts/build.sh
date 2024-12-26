#!/bin/bash
docker build --no-cache -t allotax .
docker rm allotax
docker run --name allotax allotax
docker cp allotax:/app/dist ./dist
docker stop allotax
