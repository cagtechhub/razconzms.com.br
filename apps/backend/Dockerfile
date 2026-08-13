FROM node:24-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN yarn install --frozen-lockfile --non-interactive

COPY . .

# Prisma 7 (`prisma-client`) gera TypeScript em src/.../output; o tsc emite client.js.
# O script de build copia wasm/runtime que o tsc não emite. Reforço + fail-fast:
RUN yarn workspace @razconms/backend db:generate \
  && yarn workspace @razconms/backend build \
  && mkdir -p apps/backend/dist/infrastructure/prisma/output \
  && cp -a apps/backend/src/infrastructure/prisma/output/. \
         apps/backend/dist/infrastructure/prisma/output/ \
  && test -f apps/backend/dist/infrastructure/prisma/output/client.js

EXPOSE 3001

CMD ["yarn", "workspace", "@razconms/backend", "start"]
