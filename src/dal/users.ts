import { eq } from "drizzle-orm";

import type { InferUserSelect } from "@/db/schema/users.table";
import type { User, UserCreationRequest, UserCredentials } from "@/models/user";

import drizzleDb from "@/db";
import { users } from "@/db/schema";
import { EntityNotFoundError } from "@/models/errors/dal-errors";

export async function createUser(credentials: UserCreationRequest, db = drizzleDb): Promise<User> {
  const { email, password, firstName, lastName } = credentials;
  return await db.insert(users).values({
    email,
    password,
    firstName: firstName ?? "",
    lastName: lastName ?? "",
  }).returning().then(([result]) => mapToUserDto(result));
}

export async function getUserCredentialsFromEmail(email: string, db = drizzleDb): Promise<UserCredentials> {
  const userCredentials = await db
    .select({
      email: users.email,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, email))
    .then(([result]) => result);

  if (!userCredentials) {
    throw new EntityNotFoundError("User credentials", email);
  }

  return userCredentials;
}

function mapToUserDto(item: InferUserSelect): User {
  return {
    email: item.email,
    id: item.id,
    firstName: item.firstName ?? undefined,
    lastName: item.lastName ?? undefined,
  };
}
