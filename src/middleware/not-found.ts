import type { NotFoundHandler } from "hono";

import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { AppBindings } from "@/types.js";

const notFoundHandler: NotFoundHandler<AppBindings> = (c) => {
  return c.json({
    message: `${ReasonPhrases.NOT_FOUND} - ${c.req.path}`,
  }, StatusCodes.NOT_FOUND);
};

export default notFoundHandler;
