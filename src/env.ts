/* eslint-disable node/no-process-env */
/* eslint-disable ts/no-redeclare */

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z, ZodError } from "zod";

const NodeEnv = z.enum(["localhost", "dev", "staging", "production", "test"]);
const LogLevel = z.enum(["trace", "debug", "info", "warn", "error", "fatal"]);

const EnvSchema = z.object({
  NODE_ENV: NodeEnv.default("dev"),
  HOST: z.string().default("127.0.0.1"),
  PORT: z.string().default("3000"),
  LOG_LEVEL: LogLevel.default("info"),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
}));

try {
  EnvSchema.parse(process.env);
}
catch (error) {
  if (error instanceof ZodError) {
    handleEnvError(error);
  }
  else {
    console.error(error);
  }
}

function handleEnvError(error: z.ZodError<any>) {
  let message = "Missing required values in .env:\n";
  error.issues.forEach((issue) => {
    message += `${issue.path[0]}\n`;
  });
  const e = new Error(message);
  e.stack = "";
  throw e;
}

export default EnvSchema.parse(process.env);
