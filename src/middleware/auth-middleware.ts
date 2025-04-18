import type { MiddlewareHandler } from "hono";

import { getSignedCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { AppBindings } from "@/types";

import env from "@/env";
import { logError } from "@/utils/log-utils";

export const authMiddleware: MiddlewareHandler<AppBindings> = async (c, next) => {
  try {
    const token = await getSignedCookie(c, env.SESSION_SECRET, "jwt");
    if (!token) {
      return c.json({ message: "Token not found" }, StatusCodes.UNAUTHORIZED);
    }
    const payload = await verify(token, env.JWT_SECRET);
    c.set("jwtPayload", payload);
    await next();
  }
  catch (error) {
    logError(c, error);
    return c.json({ message: ReasonPhrases.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
  }
};
