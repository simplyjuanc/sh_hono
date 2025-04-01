import { pinoLogger } from "hono-pino";
import { pino } from "pino";
import pretty from "pino-pretty";

import env from "@/env";

export default function logger() {
  return pinoLogger({
    pino: pino(getLoggerConfig()),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
};

function getLoggerConfig() {
  return env.NODE_ENV === "production"
    ? {
        level: env.LOG_LEVEL,
        transport: {
          target: "pino-sentry-transport",
          options: {
            dsn: env.SENTRY_DSN,
          },
        },
      }
    : pretty();
}
