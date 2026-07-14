# Razcon Soluções Contábeis

Monorepo com landing page Nuxt 4 + Tailwind v4 e API Express + Effect (clean architecture).

## Estrutura

```
.
├── apps/
│   ├── web/          # @razconms/web — Nuxt 4 (landing page)
│   └── backend/      # @razconms/backend — Express + Effect + Prisma
├── packages/
│   └── shared/       # @razconms/shared — schemas Zod compartilhados
├── package.json
├── Dockerfile        # imagem da web
└── docker-compose.yml
```

## Backend (clean architecture)

```
apps/backend/src/
├── domain/           # erros e entidades de domínio
├── application/      # ports, contexts Effect, use cases
├── infrastructure/   # Prisma, adapters, layers
└── presentation/     # Express (HTTP)
```

## Desenvolvimento

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
yarn install
yarn db:generate
yarn db:migrate
yarn dev          # web + backend em paralelo
yarn dev:web
yarn dev:backend
yarn build
```

## Qualidade

```bash
yarn format          # Prettier (check)
yarn format:write    # Prettier (write)
yarn lint            # ESLint (shared + backend + web)
yarn lint:fix
yarn test            # Vitest (shared + backend)
yarn test:watch
```

## Docker (produção)

```bash
docker compose up --build -d
```

## API

- `GET /health` — health check (API + banco)
- `POST /contacts` — cadastro de lead/contato
