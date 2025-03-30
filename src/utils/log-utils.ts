import type { Context } from "hono";

import { captureException } from "@sentry/node";

import type { AppBindings } from "@/types";

export function logError(c: Context, error: unknown) {
  c.var.logger.error(error);
}

export function logAndReportError(c: Context<AppBindings>, error: unknown) {
  c.var.logger.error(error);
  captureException(error);
}
