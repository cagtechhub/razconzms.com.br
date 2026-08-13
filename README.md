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
├── docker-compose.yml
├── deploy.sh
└── .github/workflows/deploy.yml
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

## Docker + Traefik (produção)

Padrão da OS Up2tech: Compose **sem** Postgres local e **sem** `ports:` no host. O Traefik alcança os containers pela rede bridge `web`. Banco = Postgres do Supabase (`DATABASE_URL`).

### Pré-requisitos na VPS

1. Traefik em modo bridge (não `network_mode: host`), com entrypoints `web`/`websecure` e certresolver `letsencrypt`.
2. Rede externa: `docker network create web`
3. DNS de `DOMAIN` (site) e `API_DOMAIN` (API) apontando para a OS — **domínios distintos**.
4. `.env` de produção **só na VPS** (copie de `.env.example`). Não commitar segredos.
5. Uma vez contra o Supabase: `yarn db:push` (ou `yarn db:migrate`) — **não** rodar em todo deploy.

`TRAEFIK_NETWORK` deve ser `web`. **Nunca** `host` (a rede built-in não aceita aliases e quebra o Compose).

### Variáveis Nuxt

| Variável                        | Onde                       | Valor                          |
| ------------------------------- | -------------------------- | ------------------------------ |
| `NUXT_API_BASE`                 | runtime SSR (Compose)      | `http://razconms-backend:3001` |
| `NUXT_PUBLIC_API_BASE`          | browser + CSP no **build** | `https://api.razconms.com.br`  |
| `NUXT_PUBLIC_SITE_URL`          | SEO / runtime              | `https://razconms.com.br`      |
| `NUXT_PUBLIC_SUPABASE_URL`      | Auth no browser            | `https://xxxx.supabase.co`     |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Auth no browser            | anon/publishable key           |

Em produção, `NUXT_PUBLIC_*` devem ser `https://` dos domínios reais — **não** `localhost`.

### Subir

```bash
./deploy.sh
# equivalente: docker compose build && docker compose up -d
```

Se a imagem antiga persistir: `docker compose build --no-cache web` (ou `backend`) e `up -d`.

Erro SSR `Cannot find package 'hookable'` / `Cannot find module 'entities/decode'`: o Dockerfile da web precisa copiar `vue`/`@vue`/`unhead` e as deps hoisted (`hookable`, `entities`, `@babel/*`) para `.output/server/node_modules`. Rebuild com `--no-cache web`.

### GitHub Actions

Workflow: `.github/workflows/deploy.yml` (SSH + `git pull` + `./deploy.sh`).

Secrets: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`.  
Vars opcionais: `APP_DIR` (default `/opt/razconms.com.br`), `DOMAIN`.

O usuário `deploy` deve estar no grupo `docker`. Build acontece na VPS (a web precisa dos build args do `.env`).

## Admin (Supabase Auth)

Painel em `/admin` (noindex). Login com e-mail/senha do Supabase Auth. O backend valida o JWT e a allowlist `ADMIN_ALLOWED_EMAILS`.

Onboarding:

1. Criar usuário no Supabase Auth.
2. Incluir o e-mail em `ADMIN_ALLOWED_EMAILS` (CSV).
3. Criar bucket público `SUPABASE_STORAGE_BUCKET` (ex.: `razconms-media`) para fotos da equipe.
4. Acessar `/admin/login`.

O portal `/area-do-cliente` permanece separado (não usa a allowlist de staff).

## API

- `GET /health` — health check (API + banco)
- `POST /contacts` — contato público (cria Contact + Lead `WEBSITE`)
- `GET /settings` — configurações públicas do site
- `GET /team` — equipe ativa
- `GET /admin/dashboard` — totais (JWT admin)
- `GET|POST /admin/leads`, `PUT|DELETE /admin/leads/:id`
- `GET|PUT /admin/settings`
- `GET|POST /admin/team`, `PUT|DELETE /admin/team/:id`
- `POST /admin/uploads` — upload de imagem (Storage)
