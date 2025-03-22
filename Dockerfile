FROM node:20-slim

RUN apt-get update
RUN npm install -g pnpm 

RUN npm install -g pnpm 

WORKDIR /app

COPY package.json  ./
COPY pnpm-lock.yaml  ./

RUN pnpm install 

COPY . . 

RUN pnpm run build

# COPY --from=builder /app/node_modules /app/node_modules
# COPY --from=builder /app/dist /app/dist
# COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000

CMD ["node", "dist/index.js"]
