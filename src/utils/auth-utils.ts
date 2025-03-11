import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 14;

export async function hashUserPassword(password: string) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyUserPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, storedHash);
}
