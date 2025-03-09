import { hash } from "bcrypt";

const SALT_ROUNDS = 14;

export async function hashUserPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}
