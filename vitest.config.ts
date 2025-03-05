import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const DEV_ENV_PATH = ".env.dev";

export default defineConfig({
  test: {
    globals: true,
    env: {
      ...config({ path: resolve(__dirname, DEV_ENV_PATH) }).parsed,
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
