# syntax=docker/dockerfile:1
# Nuxt 4 + Nitro (preset node-server): monorepo Yarn workspaces, runtime só com `.output/`.
#
# Build:  docker build -t razconms-web .
# Run:    docker run --rm -p 3000:3000 -e NUXT_PUBLIC_SITE_URL=https://exemplo.com razconms-web

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

COPY apps/web ./apps/web

ENV NODE_ENV=production
# O trace de dependências do Nitro pode deixar `unhead` em `.output/server/node_modules`
# incompleto (sem `dist/server.mjs`). Copiamos o pacote completo da instalação raiz.
RUN yarn workspace @razconms/web build \
  && rm -rf /app/apps/web/.output/server/node_modules/unhead \
  && cp -a /app/node_modules/unhead /app/apps/web/.output/server/node_modules/unhead

# -----------------------------------------------------------------------------
# Imagem final (apenas artefacto Nitro)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
# Nitro / Node escutam em todas as interfaces dentro do container
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
