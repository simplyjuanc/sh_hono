import { StatusCodes } from "http-status-codes";

import type { UserCreationRequest } from "@/models/user";
import type { AppRouteHandler } from "@/types";

import { createUser } from "@/dal/users";
import { hashUserPassword } from "@/utils/auth-utils";

import type { PostRoute } from "./users.routes";

export const postHandler: AppRouteHandler<PostRoute> = async (c) => {
  const userCredentials = await c.req.json<UserCreationRequest>();
  const hashedPassword = await hashUserPassword(userCredentials.password);

  const result = await createUser({
    ...userCredentials,
    password: hashedPassword,
  });

  c.var.logger.info(`User with id '${result}' has been created.`);
  return c.json({ userId: result.id }, StatusCodes.CREATED);
};
