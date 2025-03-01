import { createRoute, z } from "@hono/zod-openapi";

import { createRouter } from "@/utils/app-utils.js";

const router = createRouter()
  .openapi(createRoute({
    method: "get",
    path: "/",
    parameters: [],
    responses: {
      200: {
        description: "Hello, World!",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }), (c) => {
    return c.json({ message: "Hello, World!" });
  });

export default router;
