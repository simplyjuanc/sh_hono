/* eslint-disable node/no-process-env */
/* eslint-disable ts/no-redeclare */

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z, ZodError } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.union(
    [
      z.literal("localhost"),
      z.literal("dev"),
      z.literal("staging"),
      z.literal("production"),
    ],
  ).default("dev"),
  HOST: z.string().default("127.0.0.1"),
  PORT: z.string().default("3000"),
  LOG_LEVEL: z.union(
    [
      z.literal("silent"),
      z.literal("trace"),
      z.literal("debug"),
      z.literal("info"),
      z.literal("warn"),
      z.literal("error"),
      z.literal("fatal"),
    ],
  ).default("info"),

  SESSION_SECRET: z.string(),
  JWT_SECRET: z.string(),

  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.coerce.number(),
  DB_URL: z.string().url(),

  DB_MIGRATING: z.boolean().default(false),
  DB_SEEDING: z.boolean().default(false),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "dev" ? ".env.dev" : ".env",
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
