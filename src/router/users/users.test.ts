import type { Mock } from "vitest";

import { testClient } from "hono/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { User } from "@/models/user";

import { createUser } from "@/dal/users";
import { createOpenAPIApp } from "@/utils/app-utils";

import router from "./users.index";

vi.mock("@/dal/users", () => ({
  createUser: vi.fn(),
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
    const credentials: User = {
      email: "john.doe@acme.io",
      password: crypto.randomUUID(),
      username: "super-cool-username",
    };

    it("should return 200 if successful", async () => {
      const response = await client.users.$post({
        json: credentials,
      });

      expect(response.ok).toBeTruthy();
    });

    it("should call the dal method with the user data", async () => {
      const user: User = {
        id: crypto.randomUUID(),
        username: "cool-user-name",
      };

      (createUser as Mock).mockResolvedValueOnce(user);

      await client.users.$post({
        json: credentials,
      });

      expect(createUser).toHaveBeenCalledWith(credentials);
    });

    it("should return the user created in the database", async () => {
      const user: User = {
        id: crypto.randomUUID(),
        username: "cool-user-name",
        email: "john.down@acme.io",
      };

      (createUser as Mock).mockResolvedValueOnce(user);

      const response = await client.users.$post({
        json: credentials,
      });
      const result = await response.json();

      expect(result).toStrictEqual({ userId: user.id });
    });
  });
});
