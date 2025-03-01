import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { StatusCodes } from "http-status-codes";

import env from "@/env.js";

const errorHandler: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;

  const statusCode = currentStatus !== StatusCodes.OK
    ? (currentStatus as StatusCode)
    : StatusCodes.INTERNAL_SERVER_ERROR;

  return c.json(
    {
      message: err.message,
      stack: env.NODE_ENV === "production"
        ? undefined
        : err.stack,
      cause: env.NODE_ENV === "production"
        ? undefined
        : err.cause,
      statusCode,
    },
  );
};

export default errorHandler;
