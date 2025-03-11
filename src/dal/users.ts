import type { InferUserSelect } from "@/db/schema/users.table";
import type { User, UserCreationRequest, UserCredentials } from "@/models/user";

import drizzleDb from "@/db";
import { users } from "@/db/schema";

export async function createUser(credentials: UserCreationRequest, db = drizzleDb): Promise<User> {
  const { email, password, firstName, lastName } = credentials;
  const createdUser = await db.insert(users).values({
    email,
    password,
    firstName: firstName ?? "",
    lastName: lastName ?? "",
  }).returning().then(([result]) => result);

  return mapToUserDto(createdUser);
}

export async function getUserCredentialsFromEmail(email: string): Promise<UserCredentials | undefined> {
  return {
    email,
    password: "ss",
  };
}

function mapToUserDto(item: InferUserSelect): User {
  return {
    email: item.email,
    id: item.id,
    firstName: item.firstName ?? undefined,
    lastName: item.lastName ?? undefined,
  };
}
