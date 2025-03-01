import { OpenAPIHono } from "@hono/zod-openapi";

import notFoundHandler from "@/not-found.js";
import onError from "@/on-error.js";

const app = new OpenAPIHono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.notFound(notFoundHandler);
app.onError(onError);

export default app;