import { eq } from "drizzle-orm";

import type { InferUserSelect } from "@/db/schema/users.table";
import type { User, UserCreationRequest, UserCredentialsAndId } from "@/models/user";

import drizzleDb from "@/db";
import { users } from "@/db/schema";
import { DatabaseError, EntityNotFoundError } from "@/models/errors/dal-errors";

export async function createUser(credentials: UserCreationRequest, db = drizzleDb): Promise<User> {
  const { email, password, firstName, lastName } = credentials;
  const createdUser = await db.insert(users).values({
    email,
    password,
    firstName: firstName ?? "",
    lastName: lastName ?? "",
  }).returning().then(([result]) => result);

  if (!createdUser) {
    throw new DatabaseError(`Could not create user '${credentials.email}'`);
  }

  return mapToUserDto(createdUser);
}

export async function getUserCredentialsFromEmail(email: string, db = drizzleDb): Promise<UserCredentialsAndId> {
  try {
    const userCredentials = await db
      .select({
        id: users.id,
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
  catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new DatabaseError(`Could not get user credentials for email '${email}'`);
  }
}

function mapToUserDto(item: InferUserSelect): User {
  return {
    email: item.email,
    id: item.id,
    firstName: item.firstName ?? undefined,
    lastName: item.lastName ?? undefined,
  };
}
