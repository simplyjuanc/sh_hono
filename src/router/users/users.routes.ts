import { createRoute } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import { jsonContent } from "@/helpers/json-validation";
import { createErrorSchema } from "@/helpers/rest-helpers";
import { userCreationRequestSchema, userCredentialsSchema, userSchema } from "@/models/user";

const USERS_TAGS = ["Users"];

export const userSignUpRoute = createRoute({
  tags: USERS_TAGS,
  description: "Create a new user.",
  method: "post",
  path: `/users`,
  request: {
    body: jsonContent(userCreationRequestSchema, "The user to create."),
  },
  responses: {
    [StatusCodes.NO_CONTENT.valueOf()]: { description: "User has been created." },
    [StatusCodes.BAD_REQUEST.valueOf()]: jsonContent(
      createErrorSchema(userSchema),
      "The request body is invalid.",
    ),
  },
});

export const userLoginRoute = createRoute({
  tags: USERS_TAGS,
  description: "User log-in",
  method: "post",
  path: "/users/log-in",
  request: {
    body: jsonContent(userCredentialsSchema, "Email and password."),
  },
  responses: {
    [StatusCodes.OK.valueOf()]: { description: "Log-in success." },
    [StatusCodes.BAD_REQUEST.valueOf()]: jsonContent(createErrorSchema(userCredentialsSchema), "Missing credential."),
  },
});

export type UserSignupRoute = typeof userSignUpRoute;
export type UserLoginRoute = typeof userLoginRoute;
