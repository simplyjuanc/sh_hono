FROM node:20-slim AS base
RUN apt-get update
RUN npm install -g pnpm 

WORKDIR /app
COPY package.json  ./
COPY pnpm-lock.yaml  ./


FROM base AS dev
RUN pnpm install 
COPY . . 
ENV NODE_ENV=dev


FROM dev AS builder
RUN pnpm run build


FROM base AS prod
# It's necessary to run pnpm install again 
# because bcrypt uses image-specific binaries at build time
RUN pnpm install 
COPY --from=builder /app/dist /app
ENV NODE_ENV=production
