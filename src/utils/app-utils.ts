import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings, OpenApiApp } from "@/types.js";

import { errorHandler, logger, notFoundHandler, serveFavicon } from "@/middleware/index.js";

export function createOpenAPIApp() {
  const app = new OpenAPIHono<AppBindings>();

  app.use(serveFavicon("🚀"));
  app.use(logger());
  app.notFound(notFoundHandler);
  app.onError(errorHandler);
  return app;
}

export function createRoute() {
  return new OpenAPIHono<AppBindings>();
}

export function configureOpenAPI(app: OpenApiApp) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Sound Harbour API",
      version: "1.0.0",
    },
  });
}
