import { defineConfig } from "drizzle-kit";

import env from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  out: "./src/db/migrations",
  schema: "./src/db/schema",
  dbCredentials: {
    url: env.DB_URL,
    port: env.DB_PORT,
    ssl: true,
  },
  verbose: true,
  strict: true,
});
