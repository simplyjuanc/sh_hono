import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type OpenApiApp = OpenAPIHono<AppBindings>;

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBindings>;
