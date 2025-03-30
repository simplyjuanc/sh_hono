# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base
LABEL fly_launch_runtime="Node.js"

WORKDIR /app

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python-is-python3 \
    jq \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

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
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
COPY .sentryclirc /app/.sentryclirc
RUN pnpm build


FROM base AS prod
RUN pnpm install --prod=true
COPY --from=builder /app/dist /app
