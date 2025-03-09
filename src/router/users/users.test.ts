import type { Mock } from "vitest";

import { hash } from "bcrypt";
import { testClient } from "hono/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { User, UserCreationRequest } from "@/models/user";

import { createUser } from "@/dal/users";
import { createOpenAPIApp } from "@/utils/app-utils";

import router from "./users.index";

vi.mock("@/dal/users", () => ({
  createUser: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  hash: vi.fn(),
}));

const app = createOpenAPIApp();
// @ts-expect-error deeply nested client
// this comment can be deleted during software writing to enable type-sense
const client: ReturnType<typeof testClient> = testClient(app.route("/", router));

describe("users router", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("post new user", () => {
    const credentials: UserCreationRequest = {
      email: "john.doe@acme.io",
      password: crypto.randomUUID(),
      username: "super-cool-username",
    };

    const user: User = {
      id: crypto.randomUUID(),
      username: "super-cool-username",
      email: "john.doe@acme.io",
    };

    it("should return 200 if successful", async () => {
      const response = await client.users.$post({
        json: credentials,
      });

      expect(response.ok).toBeTruthy();
    });

    it("should call the dal method with the user data", async () => {
      (createUser as Mock).mockResolvedValueOnce(user);
      (hash as Mock).mockResolvedValueOnce("hashed-password");

      await client.users.$post({
        json: credentials,
      });

      expect(createUser).toHaveBeenCalledWith({ ...credentials, password: "hashed-password" });
    });

    it("should return the user created in the database", async () => {
      (createUser as Mock).mockResolvedValueOnce(user);

      const response = await client.users.$post({
        json: credentials,
      });
      const result = await response.json();

      expect(result).toStrictEqual({ userId: user.id });
    });

    it("should hash the password before creating the user", async () => {
      (createUser as Mock).mockResolvedValueOnce(user);
      (hash as Mock).mockResolvedValueOnce("hashed-password");

      await client.users.$post({
        json: credentials,
      });

      expect(createUser).toHaveBeenCalledExactlyOnceWith({
        ...credentials,
        password: "hashed-password",
      });
    });
  });
});
