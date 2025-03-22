import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import type { JwtVariables } from "hono/jwt";

import type { JwtPayload } from "./helpers/rest-helpers/types";

export interface AppBindings {
  Variables: JwtVariables<JwtPayload> & {
    logger: PinoLogger;
  };
}

export type OpenApiApp = OpenAPIHono<AppBindings>;

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, AppBindings>;
