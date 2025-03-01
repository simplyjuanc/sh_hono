import { createRoute, z } from "@hono/zod-openapi";

import { createRouter } from "@/utils/app-utils.js";
import { jsonContent } from "@/utils/json-validation/index.js";

const router = createRouter()
  .openapi(createRoute({
    method: "get",
    path: "/",
    parameters: [],
    responses: {
      200: jsonContent(z.object({
        message: z.string(),
      }), "Hello, World!"),
    },
  }), (c) => {
    return c.json({ message: "Hello, World!" });
  });

export default router;
