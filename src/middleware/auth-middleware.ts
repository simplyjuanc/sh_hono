import type { MiddlewareHandler } from "hono";

import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { StatusCodes } from "http-status-codes";

import type { AppBindings } from "@/types";

import env from "@/env";
import { IllegalArgumentError } from "@/models/errors/core-errors";

export const authMiddleware: MiddlewareHandler<AppBindings> = async (c, next) => {
  try {
    const token = getCookie(c, "jwt");

    if (!token) {
      return c.json({ message: "Token not found" }, StatusCodes.NOT_FOUND);
    }

    const secretKey = env.JWT_SECRET;
    const payload = await cleanJwtTokenFromCookie(token, secretKey);
    c.set("jwtPayload", payload);
    next();
  }
  catch (error) {
    c.var.logger.error(error);
    return c.json({ message: "Unauthorised" }, StatusCodes.UNAUTHORIZED);
  }
};

async function cleanJwtTokenFromCookie(token: string, secretKey: string) {
  const tokenParts = token.split(".");
  if (tokenParts.length === 3) {
    return await verify(token, secretKey);
  }

  if (tokenParts.length > 3) {
    const cleanToken = tokenParts.slice(0, 3).join(".");
    return await verify(cleanToken, secretKey);
  }

  throw new IllegalArgumentError(`JWT  '${token}' is malformed.`);
}
