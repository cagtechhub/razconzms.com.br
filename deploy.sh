#!/usr/bin/env bash
# Build e sobe os containers (Docker Compose + Traefik).
# O GitHub Actions faz git pull antes de chamar este script.
set -euo pipefail

cd "$(dirname "$0")"

docker compose build
docker compose up -d --remove-orphans
docker compose ps
