import { pinoLogger } from "hono-pino";
import { pino } from "pino";
import pretty from "pino-pretty";

import env from "@/env.js";

export default function logger() {
  return pinoLogger({
    pino: pino({
      level: env.LOG_LEVEL,
    }, applyPrettier()),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
};

function applyPrettier() {
  return env.NODE_ENV === "production" ? undefined : pretty();
}
