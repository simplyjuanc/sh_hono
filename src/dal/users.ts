import type { InferUserSelect } from "@/db/schema/users.table";
import type { User, UserCreationRequest } from "@/models/user";

import drizzleDb from "@/db";
import { users } from "@/db/schema";

export async function createUser(credentials: UserCreationRequest, db = drizzleDb): Promise<User> {
  const { email, username, password, firstName, middleName, lastName } = credentials;
  const createdUser = await db.insert(users).values({
    email,
    username,
    password,
    firstName,
    middleName,
    lastName,
  }).returning().then(([result]) => result);

  return mapToUserDto(createdUser);
}

function mapToUserDto(item: InferUserSelect): User {
  return {
    email: item.email,
    id: item.id,
    username: item.username,
    firstName: item.firstName ?? undefined,
    middleName: item.middleName ?? undefined,
    lastName: item.lastName ?? undefined,
  };
}
