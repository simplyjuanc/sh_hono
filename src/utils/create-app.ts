import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings } from "@/types.js";

import { errorHandler, logger, notFoundHandler, serveFavicon } from "@/middleware/index.js";

export default function createOpenAPIApp() {
  const app = new OpenAPIHono<AppBindings>();

  app.use(serveFavicon("🚀"));
  app.use(logger());
  app.notFound(notFoundHandler);
  app.onError(errorHandler);
  return app;
}
