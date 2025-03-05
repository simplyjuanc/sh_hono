import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import { jsonContent } from "@/helpers/json-validation";

const releaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  artists: z.array(z.string()),
  tracks: z.array(z.string()),
  price: z.number(),
  format: z.string(),
  ownerId: z.string(),
  condition: z.string().optional(),
  notes: z.string().optional(),
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
    [StatusCodes.OK.valueOf()]: jsonContent(releaseSchema, "Returns a record in the user's collection."),
  },
});

export type ListRoute = typeof list;
export type GetRoute = typeof get;
