FROM node:20-slim AS base
RUN apt-get update
RUN npm install -g pnpm 

WORKDIR /app
COPY package.json  ./
COPY pnpm-lock.yaml  ./
RUN pnpm install 


FROM base AS dev
COPY . . 
EXPOSE 3000


FROM dev AS builder
RUN pnpm run build


FROM base AS prod
COPY --from=builder /app/dist /app
EXPOSE 3000
