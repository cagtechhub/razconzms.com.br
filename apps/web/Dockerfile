# syntax=docker/dockerfile:1
# Nuxt 4 + Nitro (preset node-server): monorepo Yarn workspaces, runtime só com `.output/`.
#
# Build:  docker build -f apps/web/Dockerfile -t razconms-web .
# Run:    docker run --rm -e NUXT_PUBLIC_SITE_URL=https://razconms.com.br razconms-web

# >=22.13 por engines de dependências transitivas (ex.: eslint-plugin-jsdoc)
ARG NODE_VERSION=24.16

# -----------------------------------------------------------------------------
# Dependências (cacheável)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

RUN yarn install --frozen-lockfile --non-interactive

# -----------------------------------------------------------------------------
# Build da aplicação
# -----------------------------------------------------------------------------
FROM deps AS build

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

ARG NUXT_PUBLIC_API_BASE
ARG NUXT_PUBLIC_SITE_URL
ARG NUXT_PUBLIC_SITE_NAME
ARG NUXT_PUBLIC_NO_INDEX
ARG NUXT_PUBLIC_SUPABASE_URL
ARG NUXT_PUBLIC_SUPABASE_ANON_KEY

ENV NODE_ENV=production
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_SITE_NAME=$NUXT_PUBLIC_SITE_NAME
ENV NUXT_PUBLIC_NO_INDEX=$NUXT_PUBLIC_NO_INDEX
ENV NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_ANON_KEY=$NUXT_PUBLIC_SUPABASE_ANON_KEY

# Nitro + yarn workspaces com Vue hoisted pode deixar `.output/server/node_modules/vue`
# incompleto (sem `index.mjs`). Copiamos os pacotes reais da instalação raiz.
# O trace do Nitro também pode deixar `unhead` sem `dist/server.mjs` e sem `hookable`
# (dependência hoisted: ERR_MODULE_NOT_FOUND em runtime).
RUN yarn workspace @razconms/shared build \
  && yarn workspace @razconms/web build \
  && mkdir -p apps/web/.output/server/node_modules \
  && rm -rf apps/web/.output/server/node_modules/vue \
            apps/web/.output/server/node_modules/@vue \
            apps/web/.output/server/node_modules/.nitro \
            apps/web/.output/server/node_modules/unhead \
            apps/web/.output/server/node_modules/@unhead \
            apps/web/.output/server/node_modules/hookable \
  && cp -a node_modules/vue apps/web/.output/server/node_modules/vue \
  && cp -a node_modules/@vue apps/web/.output/server/node_modules/@vue \
  && cp -a node_modules/unhead apps/web/.output/server/node_modules/unhead \
  && cp -a node_modules/@unhead apps/web/.output/server/node_modules/@unhead \
  && cp -a node_modules/hookable apps/web/.output/server/node_modules/hookable \
  && test -f apps/web/.output/server/node_modules/unhead/package.json \
  && test -f apps/web/.output/server/node_modules/hookable/package.json

# -----------------------------------------------------------------------------
# Imagem final (apenas artefacto Nitro)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

RUN apk add --no-cache libc6-compat wget \
  && addgroup -g 1001 -S nodejs \
  && adduser -S nuxt -u 1001 -G nodejs

COPY --from=build --chown=nuxt:nodejs /app/apps/web/.output ./.output

USER nuxt

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health | grep -q ok || exit 1

CMD ["node", ".output/server/index.mjs"]
