import { StatusCodes } from "http-status-codes";

import type { AppRouteHandler } from "@/types.js";

import type { GetRoute, ListRoute } from "./collection.routes.js";

export const listHandler: AppRouteHandler<ListRoute> = async (c) => {
  return c.json({
    message: "List of records",
  }, StatusCodes.OK);
};

export const getHandler: AppRouteHandler<GetRoute> = async (c) => {
  return c.json({
    message: "Record details",
  }, StatusCodes.OK);
};
