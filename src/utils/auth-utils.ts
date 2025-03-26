import * as bcrypt from "bcrypt";
import { decode, sign } from "hono/jwt";

import type { JwtPayload } from "@/helpers/rest-helpers/types";

import env from "@/env";
import { jwtPayloadSchema } from "@/helpers/rest-helpers/types";

import { getCurrentUnixTimeInSeconds } from "./time-utils";

const SALT_ROUNDS = 14;

export const ONE_HOUR_IN_SECONDS = 3600;

export async function hashUserPassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyUserPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, storedHash);
}

export async function signJwtToken(userId: string) {
  return await sign(
    {
      sub: userId,
      exp: getCurrentUnixTimeInSeconds() + (ONE_HOUR_IN_SECONDS * 1000),
      iat: getCurrentUnixTimeInSeconds(),
    },
    env.JWT_SECRET,
  );
}

export function decodeToken(token: string): JwtPayload | void {
  const { payload } = decode(token);
  const test = jwtPayloadSchema.safeParse(payload);
  return test.data;
}
