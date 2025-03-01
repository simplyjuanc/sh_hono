import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import { jsonContent } from "@/helpers/json-validation/index.js";
import { createRouter } from "@/utils/app-utils.js";

const router = createRouter()
  .openapi(createRoute({
    tags: ["Health"],
    method: "get",
    path: "/health",
    parameters: [],
    responses: {
      [StatusCodes.OK.valueOf()]: jsonContent(z.object({
        message: z.string(),
      }), "Check if the application is online."),
    },
  }), (c) => {
    return c.json({ message: "System healthy." }, StatusCodes.OK);
  });

export default router;
