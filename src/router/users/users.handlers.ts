import { StatusCodes } from "http-status-codes";

import type { UserCredentials } from "@/models/user";
import type { AppRouteHandler } from "@/types";

import { createUser } from "@/dal/users";

import type { PostRoute } from "./users.routes";

export const postHandler: AppRouteHandler<PostRoute> = async (c) => {
  const userCredentials: UserCredentials = await c.req.json();
  const result = await createUser(userCredentials);
  c.var.logger.info(`User with id '${result.id}' has been created.`);
  return c.json(result, StatusCodes.OK);
};
