import type { InferUserSelect } from "@/db/schema/users.table";
import type { User, UserCreationRequest, UserCredentials } from "@/models/user";

import drizzleDb from "@/db";
import { users } from "@/db/schema";

export async function createUser(credentials: UserCreationRequest, db = drizzleDb): Promise<User> {
  const { email, username, password, firstName, lastName } = credentials;
  const createdUser = await db.insert(users).values({
    email,
    password,
    username: username ?? "",
    firstName: firstName ?? "",
    lastName: lastName ?? "",
  }).returning().then(([result]) => result);

  return mapToUserDto(createdUser);
}

export async function getUserCredentialsFromEmail(email: string): Promise<UserCredentials | undefined> {
  return {
    email,
    password: "ss",
    username: "username",
  };
}
export async function getUserCredentialsFromUsername(username: string): Promise<UserCredentials | undefined> {
  return {
    email: "t",
    password: "ss",
    username,
  };
}

function mapToUserDto(item: InferUserSelect): User {
  return {
    email: item.email,
    id: item.id,
    username: item.username,
    firstName: item.firstName ?? undefined,
    lastName: item.lastName ?? undefined,
  };
}
