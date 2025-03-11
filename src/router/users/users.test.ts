import type { Mock } from "vitest";

import { compare, hash } from "bcrypt";
import { testClient } from "hono/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { User, UserCreationRequest } from "@/models/user";

import { createUser, getUserCredentialsFromEmail } from "@/dal/users";
import { EntityNotFoundError } from "@/models/errors/dal-errors";
import { createOpenAPIApp } from "@/utils/app-utils";

import router from "./users.index";

vi.mock("@/dal/users", () => ({
  createUser: vi.fn(),
  getUserCredentialsFromEmail: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

const app = createOpenAPIApp();
const client = testClient(app.route("/", router));

describe("users router", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("post new user", () => {
    const credentials: UserCreationRequest = {
      email: "john.doe@acme.io",
      password: crypto.randomUUID(),
    };

    const user: User = {
      id: crypto.randomUUID(),
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

      expect(result).toStrictEqual({});
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

  describe("log in ", () => {
    it("should return a BAD_REQUEST error if it has neither username nor email", async () => {
      const response = await client.users["log-in"].$post({
        json: { email: "", password: "any-password" },
      });

      expect(response.ok).toBeFalsy();
    });

    it("should throw if it cannot find the email or the password is wrong", async () => {
      (getUserCredentialsFromEmail as Mock).mockRejectedValue(new EntityNotFoundError("user", "any"));

      const response = await client.users["log-in"].$post({
        json: { email: "user@user.io", password: "any-password" },
      });

      expect(response.ok).toBeFalsy();
      expect(response.status).toBe(400);
    });

    it("should return successful response if verifies the username/password combination cryptographically", async () => {
      const password = "any-password";

      (getUserCredentialsFromEmail as Mock).mockResolvedValue({
        email: "test@test.com",
        password,
      });
      (compare as Mock).mockResolvedValue(true);

      const response = await client.users["log-in"].$post({
        json: { email: "test@test.com", password },
      });

      expect(compare).toHaveBeenCalledExactlyOnceWith(password, password);
      expect(response.ok).toBeTruthy();
      expect(response.status).toBe(200);
    });

    it("should throw if it fails to verify the password cryptographically", async () => {
      const password = "any-password";

      (getUserCredentialsFromEmail as Mock).mockResolvedValue({
        email: "test@test.com",
        password,
      });
      (compare as Mock).mockResolvedValue(false);

      const response = await client.users["log-in"].$post({
        json: { email: "test@test.com", password },
      });

      expect(compare).toHaveBeenCalledExactlyOnceWith(password, password);
      expect(response.ok).toBeFalsy();
      expect(response.status).toBe(400);
    });
  });
});
