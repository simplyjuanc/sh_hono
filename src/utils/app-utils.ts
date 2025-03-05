import type { Hook } from "@hono/zod-openapi";

import { OpenAPIHono } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";

import type { AppBindings, OpenApiApp } from "@/types";

import { errorHandler, logger, notFoundHandler, serveFavicon } from "@/middleware/index";

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

export const API_VERSION = "v1";
export function registerApiRoutes(app: OpenApiApp, routes: OpenApiApp[]) {
  routes.forEach((route) => {
    app.route(`/${API_VERSION}`, route);
  });
}
