FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
RUN apk update

WORKDIR /app
COPY . . 

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm 
RUN pnpm install 

RUN  pnpm run build


FROM base AS runner

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000

CMD ["node", "dist/index.js"]
