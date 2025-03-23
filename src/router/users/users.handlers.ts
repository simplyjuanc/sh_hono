import { setSignedCookie } from "hono/cookie";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { UserCreationRequest, UserCredentials } from "@/models/user";
import type { AppRouteHandler } from "@/types";

import { createUser, getUserCredentialsFromEmail } from "@/dal/users";
import env from "@/env";
import { errorHandler } from "@/middleware";
import { EntityNotFoundError } from "@/models/errors/dal-errors";
import { hashUserPassword, ONE_HOUR_IN_SECONDS, signJwtToken, verifyUserPassword } from "@/utils/auth-utils";

import type { UserLoginRoute, UserLogoutRoute, UserSignupRoute } from "./users.routes";

export const userSignupHandler: AppRouteHandler<UserSignupRoute> = async (c) => {
  const userCredentials = await c.req.json<UserCreationRequest>();
  const hashedPassword = await hashUserPassword(userCredentials.password);

  const result = await createUser({
    ...userCredentials,
    password: hashedPassword,
  });
  c.var.logger.info(`User with id '${result}' has been created.`);
  return c.json(null, StatusCodes.CREATED);
};

export const userLoginHandler: AppRouteHandler<UserLoginRoute> = async (c) => {
  const { email, password } = await c.req.json<UserCredentials>();
  if (!email) {
    return c.json({
      message: ReasonPhrases.BAD_REQUEST,
    }, StatusCodes.BAD_REQUEST);
  }

  try {
    const user = await getUserCredentialsFromEmail(email);
    if (!user) {
      return c.json({ message: ReasonPhrases.BAD_REQUEST }, StatusCodes.BAD_REQUEST);
    }

    const isVerified = await verifyUserPassword(password, user.password);
    if (!isVerified) {
      return c.json({ message: ReasonPhrases.BAD_REQUEST }, StatusCodes.BAD_REQUEST);
    }

    const jwt = await signJwtToken(user.id);

    await setSignedCookie(c, "jwt", jwt, env.SESSION_SECRET, {
      httpOnly: true,
      maxAge: ONE_HOUR_IN_SECONDS,
      sameSite: "strict",
    });

    return c.json(undefined, StatusCodes.OK);
  }
  catch (e) {
    if (e instanceof EntityNotFoundError) {
      return c.json({ message: ReasonPhrases.BAD_REQUEST, cause: e }, StatusCodes.BAD_REQUEST);
    }
    if (e instanceof Error) {
      return errorHandler(e, c);
    }
    return c.json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR, cause: e }, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
