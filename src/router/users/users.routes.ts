import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import { jsonContent } from "@/helpers/json-validation";
import { createErrorSchema } from "@/helpers/rest-helpers";
import { userCredentialsSchema, userSchema } from "@/models/user";

const USERS_TAGS = ["Users"];

export const post = createRoute({
  tags: USERS_TAGS,
  method: "post",
  path: `/users`,
  request: {
    body: jsonContent(userCredentialsSchema, "The user to create."),
  },
  responses: {
    [StatusCodes.OK.valueOf()]: jsonContent(userSchema, "Returns the newly created user."),
    [StatusCodes.BAD_REQUEST.valueOf()]: jsonContent(
      createErrorSchema(userCredentialsSchema),
      "The request body is invalid.",
    ),
  },
});

export type PostRoute = typeof post;
