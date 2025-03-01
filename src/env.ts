/* eslint-disable node/no-process-env */
/* eslint-disable ts/no-redeclare */

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, ZodError } from "zod";

const NodeEnv = z.enum(["localhost", "dev", "staging", "production"]);
const LogLevel = z.enum(["trace", "debug", "info", "warn", "error", "fatal"]);

const EnvSchema = z.object({
  NODE_ENV: NodeEnv.default("dev"),
  HOST: z.string().default("127.0.0.1"),
  PORT: z.string().default("3000"),
  LOG_LEVEL: LogLevel.default("info"),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

expand(config());

try {
  EnvSchema.parse(process.env);
}
catch (error) {
  if (error instanceof ZodError) {
    let message = "Missing required values in .env:\n";
    error.issues.forEach((issue) => {
      message += `${issue.path[0]}\n`;
    });
    const e = new Error(message);
    e.stack = "";
    throw e;
  }
  else {
    console.error(error);
  }
}

export default EnvSchema.parse(process.env);
