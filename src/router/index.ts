import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import { createRouter } from "@/utils/app-utils.js";
import { jsonContent } from "@/helpers/json-validation/index.js";

const router = createRouter()
  .openapi(createRoute({
    method: "get",
    path: "/",
    parameters: [],
    responses: {
      [StatusCodes.OK.valueOf()]: jsonContent(z.object({
        message: z.string(),
      }), "Hello, World!"),
    },
  }), (c) => {
    return c.json({ message: "Hello, World!" }, StatusCodes.OK);
  });

export default router;
