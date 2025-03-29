import type { Context } from "hono";

import { getSentry } from "@hono/sentry";

import type { AppBindings } from "@/types";

export function logError(c: Context, error: unknown) {
  c.var.logger.error(error);
}

export function logAndReportError(c: Context<AppBindings>, error: unknown) {
  c.var.logger.error(error);
  getSentry(c).captureException(error);
}
