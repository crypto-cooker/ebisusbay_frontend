#! /bin/bash

# Run docker compose
docker compose --env-file ./apps/web/.env --progress=plain -f docker-compose.yml up --build