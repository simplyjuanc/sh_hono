import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import type { User, UserCreationRequest, UserCredentials } from "@/models/user";

import db from "@/db";
import { users } from "@/db/schema";
import { EntityNotFoundError } from "@/models/errors/dal-errors";
import { mockInsertIntoDb, mockQueryFailureFromDb, mockQuerySuccessFromDb } from "@/utils/test-utils";

import { createUser, getUserCredentialsFromEmail } from "./users";

describe("users dal", () => {
  const userCredentials: UserCreationRequest = {
    email: "super-cool-email@email.com",
    password: "pas5235sw@road102y9j",
  };

  const mockUser: User = {
    id: crypto.randomUUID(),
    email: "super-cool-email@email.com",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create user", () => {
    it("should call the drizzle with the appropriate parameters", async () => {
      mockInsertIntoDb(db, mockUser);
      vi.spyOn(db.insert(users), "values");

      await createUser(userCredentials);

      expect(db.insert(users).values).toHaveBeenCalledExactlyOnceWith({
        ...userCredentials,
        firstName: "",
        lastName: "",
      });
    });

    it("should return a complete user interface in the response", async () => {
      mockInsertIntoDb(db, mockUser);

      const response = await createUser(userCredentials);

      expectTypeOf(response).toMatchObjectType<User>();
      expect(response.email).toBe(userCredentials.email);
      expect(response.firstName).toBe(userCredentials.firstName);
      expect(response.lastName).toBe(userCredentials.lastName);
    });
  });

  describe("get user id from email", () => {
    it("should return the user id", async () => {
      mockQuerySuccessFromDb(db, mockUser.id);

      const response = await getUserCredentialsFromEmail(userCredentials.email);

      expect(response).toBe(mockUser.id);
    });

    it("should throw if the user is not found", async () => {
      mockQueryFailureFromDb(db, new EntityNotFoundError("User credentials", userCredentials.email));

      await expect(getUserCredentialsFromEmail(userCredentials.email)).rejects.toThrow(EntityNotFoundError);
    });
  });
});
