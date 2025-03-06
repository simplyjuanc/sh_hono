import { defineConfig } from "drizzle-kit";

import env from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/db/schema",
  dbCredentials: {
    url: env.DB_URL,
  },
  verbose: true,
  strict: true,
});
