#!/bin/sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
docker system prune --force