import { StatusCodes } from "http-status-codes";

import type { AppRouteHandler } from "@/types";

import { createItem, getRecordById, getUserRecords } from "@/dal/collection";

import type { GetRoute, ListRoute, PostRoute } from "./collection.routes";

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

export const postHandler: AppRouteHandler<PostRoute> = async (c) => {
  const userId = c.var.user.id;
  const newRecord = c.req.body;
  const result = await createItem(userId, newRecord);

  c.var.logger.info(`New record created with id '${result.id}'.`);
  return c.json(result, StatusCodes.OK);
};
