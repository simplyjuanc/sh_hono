import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import { jsonContent } from "@/helpers/json-validation";
import { createErrorSchema } from "@/helpers/rest-helpers";
import { userCreationRequestSchema, userCreationResponseSchema, userSchema } from "@/models/user";

const USERS_TAGS = ["Users"];

export const post = createRoute({
  tags: USERS_TAGS,
  method: "post",
  path: `/users`,
  request: {
    body: jsonContent(userCreationRequestSchema, "The user to create."),
  },
  responses: {
    [StatusCodes.CREATED.valueOf()]: jsonContent(userCreationResponseSchema, "Returns the newly created user id."),
    [StatusCodes.BAD_REQUEST.valueOf()]: jsonContent(
      createErrorSchema(userSchema),
      "The request body is invalid.",
    ),
  },
});

export type PostRoute = typeof post;
