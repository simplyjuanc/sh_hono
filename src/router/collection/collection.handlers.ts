import { StatusCodes } from "http-status-codes";

import type { AppRouteHandler } from "@/types";

import { getRecordById, getUserRecords } from "@/dal/collection";

import type { GetRoute, ListRoute } from "./collection.routes";

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

export const getHandler: AppRouteHandler<GetRoute> = async (c) => {
  const recordId = c.req.param().id;
  const result = await getRecordById(recordId);

  c.var.logger.debug(`Record '${recordId}' returned.`);
  return c.json(result, StatusCodes.OK);
};
