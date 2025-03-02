import type { ZodMediaTypeObject } from "@asteasolutions/zod-to-openapi";

import { StatusCodes } from "http-status-codes";

import type { AppRouteHandler } from "@/types.js";

import type { GetRoute, ListRoute } from "./collection.routes.js";

// function formatRestResponse(payload: ZodMediaTypeObject) {
//   return async (c) => {
//     return c.json(payload, StatusCodes.OK);
//   };
// }

export const listHandler: AppRouteHandler<ListRoute> = async (c) => {
  return c.json([{
    id: "4651e634-a530-4484-9b09-9616a28f35e3",
    title: "The Dark Side of the Moon",
    masterId: "4637",
    releaseDate: "1973-03-01",
    artistIds: ["4d9f9b8f-7e3d-4f7a-bd4f-1e8f2f3e3b0b"],
    trackIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  }], StatusCodes.OK);
};

export const getHandler: AppRouteHandler<GetRoute> = async (c) => {
  return c.json(
    {
      id: "4651e634-a530-4484-9b09-9616a28f35e3",
      title: "The Dark Side of the Moon",
      masterId: "4637",
      releaseDate: "1973-03-01",
      artistIds: ["4d9f9b8f-7e3d-4f7a-bd4f-1e8f2f3e3b0b"],
      trackIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    },
    StatusCodes.OK,
  );
};
