import { OpenAPIHono } from "@hono/zod-openapi";

import notFoundHandler from "@/not-found.js";
import onError from "@/on-error.js";

import logger from "./pino-logger.js";

const app = new OpenAPIHono();

app.use(logger);
app.notFound(notFoundHandler);
app.onError(onError);

export default app;
