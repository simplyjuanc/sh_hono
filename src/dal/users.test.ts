import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import type { User, UserCreationRequest } from "@/models/user";

import db from "@/db";
import { users } from "@/db/schema";
import { mockInsertIntoDb } from "@/utils/test-utils";

import { createUser } from "./users";

describe("users dal", () => {
  const userCredentials: UserCreationRequest = {
    email: "super-cool-email@email.com",
    password: "pas5235sw@road102y9j",
    username: "curious-agitator",
  };

  const mockUser: User = {
    id: crypto.randomUUID(),
    username: "curious-agitator",
    email: "super-cool-email@email.com",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("create user", () => {
    it("should correctly call the drizzle with the appropriate parameters", async () => {
      mockInsertIntoDb(db, mockUser);
      vi.spyOn(db.insert(users), "values");

      await createUser(userCredentials);

      expect(db.insert(users).values).toHaveBeenCalledWith(userCredentials);
    });

    it("should return a complete user interface in the response", async () => {
      mockInsertIntoDb(db, mockUser);

      const response = await createUser(userCredentials);
      expectTypeOf(response).toMatchObjectType<User>();

      expect(response.email).toBe(userCredentials.email);
      expect(response.firstName).toBe(userCredentials.firstName);
      expect(response.middleName).toBe(userCredentials.middleName);
      expect(response.lastName).toBe(userCredentials.lastName);
      expect(response.username).toBe(userCredentials.username);
    });

    it("should throw if the password or email validation fail", async () => {
      db.insert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      });
    });

    it("should throw when the username is already taken", () => {
    });

    it("should hash the password on update or creation", () => {
    });
  });
});
