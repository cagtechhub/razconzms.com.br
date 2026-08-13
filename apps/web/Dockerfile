# syntax=docker/dockerfile:1
# Nuxt 4 + Nitro, mesmo modelo do gutierres-recomenda-ai:
# a imagem de runtime mantém o monorepo + node_modules da raiz. O Node resolve
# deps hoisted (entities, hookable, …) subindo a árvore. Não copiamos pacote a
# pacote para dentro do `.output`.
#
# Build:  docker build -f apps/web/Dockerfile -t razconms-web .
# Run:    docker run --rm -e NUXT_PUBLIC_SITE_URL=https://razconms.com.br razconms-web

ARG NODE_VERSION=24.16

FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat wget \
  && corepack enable \
  && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

RUN yarn install --frozen-lockfile --non-interactive

FROM deps AS runtime

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
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Nitro + yarn: o trace às vezes deixa vue/@vue incompletos (sem index.mjs) e
# esses copies quebrados sombreiam o node_modules da raiz. Só isso é substituído.
RUN yarn workspace @razconms/shared build \
  && yarn workspace @razconms/web build \
  && mkdir -p apps/web/.output/server/node_modules \
  && rm -rf apps/web/.output/server/node_modules/vue \
            apps/web/.output/server/node_modules/@vue \
            apps/web/.output/server/node_modules/.nitro \
  && cp -a node_modules/vue apps/web/.output/server/node_modules/vue \
  && cp -a node_modules/@vue apps/web/.output/server/node_modules/@vue \
  && test -f apps/web/.output/server/node_modules/vue/package.json

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health | grep -q ok || exit 1

CMD ["node", "apps/web/.output/server/index.mjs"]
