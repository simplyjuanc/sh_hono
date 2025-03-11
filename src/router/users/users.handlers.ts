import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { UserCreationRequest, UserCredentials } from "@/models/user";
import type { AppRouteHandler } from "@/types";

import { createUser, getUserCredentialsFromEmail } from "@/dal/users";
import { EntityNotFoundError } from "@/models/errors/dal-errors";
import { hashUserPassword, verifyUserPassword } from "@/utils/auth-utils";

import type { UserLoginRoute, UserSignUpRoute } from "./users.routes";

export const userSignupHandler: AppRouteHandler<UserSignUpRoute> = async (c) => {
  const userCredentials = await c.req.json<UserCreationRequest>();
  const hashedPassword = await hashUserPassword(userCredentials.password);

  const result = await createUser({
    ...userCredentials,
    password: hashedPassword,
  });

  c.var.logger.info(`User with id '${result}' has been created.`);
  return c.json({}, StatusCodes.CREATED);
};

export const userLoginHandler: AppRouteHandler<UserLoginRoute> = async (c) => {
  const { email, password } = await c.req.json<UserCredentials>();
  if (!email) {
    return c.json({
      message: ReasonPhrases.BAD_REQUEST,
    }, StatusCodes.BAD_REQUEST);
  }

  try {
    const userCredentials = await getUserCredentialsFromEmail(email);
    if (!userCredentials) {
      return c.json({ message: ReasonPhrases.BAD_REQUEST }, StatusCodes.BAD_REQUEST);
    }
    c.var.logger.info({ userCredentials });

    const isVerified = await verifyUserPassword(password, userCredentials.password);
    if (isVerified) {
      return c.json(StatusCodes.NO_CONTENT);
    }
    else {
      return c.json({ message: ReasonPhrases.BAD_REQUEST }, StatusCodes.BAD_REQUEST);
    }
  }
  catch (e) {
    if (e instanceof EntityNotFoundError) {
      return c.json({ message: ReasonPhrases.BAD_REQUEST }, StatusCodes.BAD_REQUEST);
    }
    return c.json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR }, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
