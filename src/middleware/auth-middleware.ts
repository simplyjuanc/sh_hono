import type { MiddlewareHandler } from "hono";

import { getSentry } from "@hono/sentry";
import { getSignedCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { AppBindings } from "@/types";

import env from "@/env";

export const authMiddleware: MiddlewareHandler<AppBindings> = async (c, next) => {
  try {
    const token = await getSignedCookie(c, env.SESSION_SECRET, "jwt");
    if (!token) {
      return c.json({ message: "Token not found" }, StatusCodes.NOT_FOUND);
    }
    const payload = await verify(token, env.JWT_SECRET);
    c.set("jwtPayload", payload);
    await next();
  }
  catch (error) {
    getSentry(c).captureException(error);
    c.var.logger.error(error);
    return c.json({ message: ReasonPhrases.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
  }
};
