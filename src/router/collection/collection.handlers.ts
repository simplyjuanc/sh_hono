import { StatusCodes } from "http-status-codes";

import type { AppRouteHandler } from "@/types.js";

import { getRecordById, getUserRecords } from "@/dal/collection.js";

import type { GetRoute, ListRoute } from "./collection.routes.js";

// function formatRestResponse(payload: ZodMediaTypeObject) {
//   return async (c) => {
//     return c.json(payload, StatusCodes.OK);
//   };
// }

export const listHandler: AppRouteHandler<ListRoute> = async (c) => {
  const userId = c.var.user.id;
  const result = await getUserRecords(userId);
  c.var.logger.info(`User "${userId}" records returned.`);
  return c.json(result, StatusCodes.OK);
};

// TODO: CHange this to query param (first in Route)
export const getHandler: AppRouteHandler<GetRoute> = async (c) => {
  const recordId = c.req.param().id;
  const result = await getRecordById(recordId);

  c.var.logger.debug(`Record '${recordId}' returned.`);
  return c.json(result, StatusCodes.OK);
};
