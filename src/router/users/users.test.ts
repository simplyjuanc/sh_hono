import type { Mock } from "vitest";

import { hash } from "bcrypt";
import { testClient } from "hono/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { User, UserCreationRequest } from "@/models/user";

import { createUser, getUserCredentialsFromEmail, getUserCredentialsFromUsername } from "@/dal/users";
import { EntityNotFoundError } from "@/models/errors/dal-errors";
import { createOpenAPIApp } from "@/utils/app-utils";

import router from "./users.index";

vi.mock("@/dal/users", () => ({
  createUser: vi.fn(),
  getUserCredentialsFromEmail: vi.fn(),
  getUserCredentialsFromUsername: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  hash: vi.fn(),
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
        json: { password: "any-password" },
      });

      expect(response.ok).toBeFalsy();
      expect(response.status).toBe(400);
    });

    it("should return a successful response if the email and password combination exist", async () => {
      (getUserCredentialsFromEmail as Mock).mockResolvedValue({
        email: "test",
        password: "pass",
      });

      const response = await client.users["log-in"].$post({
        json: { email: "user@user.com", password: "any-password" },
      });

      expect(response.ok).toBeTruthy();
      expect(response.status).toBe(200);
    });

    it("should return a successful response if the username and password combination exist", async () => {
      (getUserCredentialsFromUsername as Mock).mockResolvedValue({
        email: "test",
        username: "user",
        password: "pass",
      });

      const response = await client.users["log-in"].$post({
        json: { username: "user", password: "any-password" },
      });

      expect(response.ok).toBeTruthy();
      expect(response.status).toBe(200);
    });

    it("should throw the same error whether it cannot find the email or the password is wrong", async () => {
      (getUserCredentialsFromEmail as Mock).mockRejectedValue(new EntityNotFoundError("user", "any"));

      const response = await client.users["log-in"].$post({
        json: { email: "user@user.io", password: "any-password" },
      });

      expect(response.ok).toBeFalsy();
      expect(response.status).toBe(400);
    });

    it("should throw the same error whether it cannot find the username or the password is wrong", async () => {
      (getUserCredentialsFromUsername as Mock).mockRejectedValue(new EntityNotFoundError("user", "any"));

      const response = await client.users["log-in"].$post({
        json: { username: "user", password: "any-password" },
      });

      expect(response.ok).toBeFalsy();
      expect(response.status).toBe(400);
    });
  });
});
