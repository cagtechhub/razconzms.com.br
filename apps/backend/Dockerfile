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

RUN yarn workspace @razconms/shared build \
  && yarn workspace @razconms/backend db:generate \
  && yarn workspace @razconms/backend build

EXPOSE 3001

CMD ["yarn", "workspace", "@razconms/backend", "start"]
