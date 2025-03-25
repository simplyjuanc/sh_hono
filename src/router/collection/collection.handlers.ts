import { getSignedCookie } from "hono/cookie";
import { StatusCodes } from "http-status-codes";

import type { InferItemInsert } from "@/db/schema/items.table";
import type { AppRouteHandler } from "@/types";

import { createItem, getRecordById, getUserRecords } from "@/dal/collection";
import env from "@/env";
import { decodeToken } from "@/utils/auth-utils";

import type { GetRoute, ListRoute, PostRoute } from "./collection.routes";

export const listHandler: AppRouteHandler<ListRoute> = async (c) => {
  const token = await getSignedCookie(c, env.SESSION_SECRET, "jwt");
  if (!token) {
    return c.redirect("/login", StatusCodes.MOVED_TEMPORARILY);
  }

  const payload = decodeToken(token);
  const userId = payload?.sub;
  if (!userId) {
    return c.redirect("/login", StatusCodes.MOVED_TEMPORARILY);
  }

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
  const newRecord = await c.req.json<InferItemInsert>();
  const result = await createItem(newRecord);

  c.var.logger.info(`New record created with id '${result.id}'.`);
  return c.json(result, StatusCodes.OK);
};
