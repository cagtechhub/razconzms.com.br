#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "Arquivo .env não encontrado. Em produção o .env fica só na VPS."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [[ -z "${TRAEFIK_NETWORK:-}" ]]; then
  echo "TRAEFIK_NETWORK não definido no .env (use web, nunca host)."
  exit 1
fi

if [[ "${TRAEFIK_NETWORK}" == "host" ]]; then
  echo "TRAEFIK_NETWORK=host não é suportado. Use a rede bridge web."
  exit 1
fi

docker network inspect "${TRAEFIK_NETWORK}" >/dev/null 2>&1 \
  || docker network create "${TRAEFIK_NETWORK}"

docker compose build
docker compose up -d --remove-orphans
