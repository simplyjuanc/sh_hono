import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import { jsonContent } from "@/helpers/json-validation";

const releaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  masterId: z.string(),
  releaseDate: z.date().optional(),
  artistIds: z.array(z.string()),
  trackIds: z.array(z.string()),
});

export const list = createRoute({
  tags: ["Collection"],
  method: "get",
  path: `/collection`,
  parameters: [],
  responses: {
    [StatusCodes.OK.valueOf()]: jsonContent(z.array(releaseSchema), "Returns a collection of records for the authenticated user."),
  },
});

export const get = createRoute({
  tags: ["Collection"],
  method: "get",
  path: `/collection/:id`,
  parameters: [
    {
      name: "id",
      in: "path",
      allowEmptyValue: false,
      required: true,
      schema: {
        type: "string",
        format: "uuid",
      },
      example: "4651e634-a530-4484-9b09-9616a28f35e3",
    },
  ],
  responses: {
    [StatusCodes.OK.valueOf()]: jsonContent(releaseSchema, "Returns a record for the authenticated user."),
    [StatusCodes.BAD_REQUEST.valueOf()]: jsonContent(z.object({ message: z.string() }), "Record ID is required."),
  },
});

export type ListRoute = typeof list;
export type GetRoute = typeof get;
