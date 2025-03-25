import type { Mock } from "vitest";

import { compare, hash } from "bcrypt";
import { deleteCookie } from "hono/cookie";
import { testClient } from "hono/testing";
import { StatusCodes } from "http-status-codes";
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

vi.mock("hono/cookie", async () => {
  const actual = await vi.importActual<typeof import("hono/cookie")>("hono/cookie");
  return {
    ...actual,
    deleteCookie: vi.fn(),
  };
});

const app = createOpenAPIApp();
const client = testClient(app.route("/", router));

describe("users router", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("user sign up", () => {
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

    it("should return an empty response", async () => {
      (createUser as Mock).mockResolvedValueOnce(user);

      const response = await client.users.$post({
        json: credentials,
      });
      const result = await response.json();

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(result).toBeNull();
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
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should return successful response if verifies the email/password combination cryptographically", async () => {
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
      expect(response.status).toBe(StatusCodes.OK);
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

  describe("logout", () => {
    const userId = crypto.randomUUID();
    app.use(async (c, next) => {
      c.set("jwtPayload", { sub: userId });
      await next();
    });

    it("should unset the jwt from the client", async () => {
      const response = await client.users["log-out"].$post();

      expect(response.status).toBe(StatusCodes.OK);
      expect(deleteCookie).toHaveBeenCalledOnce();
    });
  });
});
