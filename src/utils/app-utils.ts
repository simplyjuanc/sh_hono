/* eslint-disable perfectionist/sort-imports */
// eslint-disable-next-line unused-imports/no-unused-imports
import sentry from "./sentry";

import type { Hook } from "@hono/zod-openapi";

import { OpenAPIHono } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import type { AppBindings, OpenApiApp } from "@/types";

import { authMiddleware } from "@/middleware/auth-middleware";
import { errorHandler, logger, notFoundHandler, serveFavicon } from "@/middleware/index";

export const API_VERSION = "v1";
const basePath = `/api/${API_VERSION}`;

export function createOpenAPIApp() {
  const app = new OpenAPIHono<AppBindings>();
  app.use(serveFavicon("🚀"));
  app.use(logger());
  app.notFound(notFoundHandler);
  app.onError(errorHandler);
  return app;
}

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: result.error,
      },
      StatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
};

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    defaultHook,
  });
}

export function registerApiRoutes(app: OpenApiApp, routes: OpenApiApp[]) {
  routes.forEach((route) => {
    app.route(basePath, route);
  });
}

export function registerProtectedApiRoutes(app: OpenApiApp, routes: OpenApiApp[]) {
  app.use(`${basePath}/*`, authMiddleware);
  registerApiRoutes(app, routes);
}
