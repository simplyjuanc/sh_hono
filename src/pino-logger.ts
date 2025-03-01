import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";

const logger = pinoLogger({
  pino: pino.default(pretty()),
  http: {
    reqId: () => crypto.randomUUID(),
  },
});

export default logger;
