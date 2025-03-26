#!/bin/bash

cd /app
pnpm uninstall bcrypt
pnpm install bcrypt
if [ "$NODE_ENV" == "dev" ]; then
  pnpm dev
else
  node index.js
fi