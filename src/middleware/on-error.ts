import type { ErrorHandler } from "hono";
import type { HTTPResponseError } from "hono/types";
import type { StatusCode } from "hono/utils/http-status";

import { StatusCodes } from "http-status-codes";

import env from "@/env";

const errorHandler: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err
    ? err.status
    : c.newResponse(null).status;

  const statusCode = currentStatus !== StatusCodes.OK
    ? (currentStatus as StatusCode)
    : StatusCodes.INTERNAL_SERVER_ERROR;

  return c.json(
    {
      statusCode,
      message: err.message,
      stack: getErrorStack(err),
      cause: getErrorCause(err),
    },
  );
};

function getErrorStack(error: Error | HTTPResponseError) {
  return env.NODE_ENV === "production"
    ? undefined
    : error.stack;
}

function getErrorCause(error: Error | HTTPResponseError) {
  return env.NODE_ENV === "production"
    ? undefined
    : "cause" in error
      ? error.cause as string
      : undefined;
}

export default errorHandler;
