import { apiReference } from "@scalar/hono-api-reference";

import type { OpenApiApp } from "@/types";

export function configureOpenAPI(app: OpenApiApp) {
  app.doc("/docs", {
    openapi: "3.0.0",
    info: {
      title: "Sound Harbour API",
      version: "1.0.0",
    },
  });

  app.get("/reference", apiReference({
    defaultHttpClient: {
      targetKey: "javascript",
      clientKey: "fetch",
    },
    spec: {
      url: "/docs",
    },
  }));
}
