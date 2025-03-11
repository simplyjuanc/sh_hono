import { ReasonPhrases, StatusCodes } from "http-status-codes";

import type { UserCreationRequest, UserCredentials } from "@/models/user";
import type { AppRouteHandler } from "@/types";

import { createUser, getUserCredentialsFromEmail, getUserCredentialsFromUsername } from "@/dal/users";
import { EntityNotFoundError } from "@/models/errors/dal-errors";
import { hashUserPassword } from "@/utils/auth-utils";

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
  const { email, username } = await c.req.json<UserCredentials>();

  if (!email && !username) {
    return c.json({
      message: ReasonPhrases.BAD_REQUEST,
    }, StatusCodes.BAD_REQUEST);
  }
  try {
    const userCredentials = email
      ? await getUserCredentialsFromEmail(email)
      : await getUserCredentialsFromUsername(username!);
    // username assumed to exist due to previous check

    if (!userCredentials) {
      return c.json({ message: ReasonPhrases.BAD_REQUEST }, StatusCodes.BAD_REQUEST);
    }

    return c.json(StatusCodes.NO_CONTENT);
  }
  catch (e) {
    if (e instanceof EntityNotFoundError) {
      return c.json({ message: ReasonPhrases.BAD_REQUEST }, StatusCodes.BAD_REQUEST);
    }
    return c.json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR }, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
