import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";

import notFoundHandler from "@/not-found.js";
import onError from "@/on-error.js";

const app = new OpenAPIHono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.notFound(notFoundHandler);
app.onError(onError);

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${info.port}`);
});
