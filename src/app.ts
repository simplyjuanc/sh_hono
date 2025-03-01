import type { PinoLogger } from "hono-pino";

import { OpenAPIHono } from "@hono/zod-openapi";

import { errorHandler, logger, notFoundHandler, serveFavicon } from "@/middleware/index.js";

interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

const app = new OpenAPIHono<AppBindings>();

app.use(serveFavicon("🚀"));
app.use(logger());
app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
