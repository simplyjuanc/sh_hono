# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-alpine AS base
LABEL fly_launch_runtime="Node.js"

WORKDIR /app
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache \
    build-base \
    python3 \
    make \
    g++ \
    jq \
    ca-certificates && \
    rm -rf /var/cache/apk/*

ARG PNPM_VERSION=9.12.2
RUN npm install -g pnpm@$PNPM_VERSION
RUN pnpm config set store-dir /root/.local/share/pnpm/store/v3 --global

COPY package.json pnpm-lock.yaml ./

FROM base AS dev
ENV NODE_ENV=dev
RUN pnpm install --frozen-lockfile --prod=false
COPY . . 


FROM dev AS builder
ENV NODE_ENV="production"
RUN pnpm build


FROM base AS prod
RUN pnpm install --prod=true
COPY --from=builder /app/dist /app/dist
CMD [ "node", "dist/index.js" ]