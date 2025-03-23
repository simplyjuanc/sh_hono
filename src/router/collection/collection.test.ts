import type { Mock } from "vitest";

import { fromPartial } from "@total-typescript/shoehorn";
import { getSignedCookie } from "hono/cookie";
import { testClient } from "hono/testing";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Item } from "@/models/item";

import { mockItem } from "@/__mocks__/mock-record";
import { createItem, getRecordById, getUserRecords } from "@/dal/collection";
import { createOpenAPIApp } from "@/utils/app-utils";
import { decodeToken } from "@/utils/auth-utils";

import router from "./collection.index";

vi.mock("@/dal/collection", () => ({
  getRecordById: vi.fn(),
  getUserRecords: vi.fn(),
  createItem: vi.fn(),
}));

vi.mock("hono/cookie", () => ({
  getSignedCookie: vi.fn(),
}));

vi.mock("@/utils/auth-utils", () => ({
  decodeToken: vi.fn(),
}));

describe("collection router", () => {
  const app = createOpenAPIApp();
  const userId = crypto.randomUUID();

  app.use(async (c, next) => {
    c.set("jwtPayload", { id: userId });
    await next();
  });

  const client = testClient(app.route("/", router));

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("get record", () => {
    it("should return the correct release from the dal", async () => {
      (getRecordById as Mock).mockResolvedValue(mockItem);

      const itemId = crypto.randomUUID();
      const response = await client.collection[":id"].$get({
        param: {
          id: itemId,
        },
      });
      const result = await response.json();

      expect(getRecordById).toHaveBeenCalledTimes(1);
      expect(getRecordById).toHaveBeenCalledWith(itemId);
      expect(result).toEqual(mockItem);
    });
  });

  describe("get user collection", () => {
    it("should return the user record collection", async () => {
      (getSignedCookie as Mock).mockResolvedValue("jwt-token");
      (decodeToken as Mock).mockReturnValue({ user: userId });
      (getUserRecords as Mock).mockResolvedValue([mockItem]);

      const response = await client.collection.$get();
      const result = await response.json();

      expect(decodeToken).toHaveBeenCalledExactlyOnceWith("jwt-token");
      expect(getUserRecords).toHaveBeenCalledExactlyOnceWith(userId);
      expect(result).toEqual([mockItem]);
    });

    it("should redirect the user if not logged in", async () => {
      (getSignedCookie as Mock).mockResolvedValue("jwt-token");
      (decodeToken as Mock).mockReturnValue(undefined); ;

      const response = await client.collection.$get();

      expect(response.ok).toBeFalsy();
      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
    });
  });

  describe("post a new record", () => {
    const ownerId = crypto.randomUUID();

    it("should return the new record", async () => {
      const creationRequest: Omit<Item, "id"> = {
        title: "Test Record",
        artists: ["Test Artist"],
        price: 157,
        format: "VINYL",
        ownerId,
        condition: "MINT",
        notes: "Superb!",
      };

      const expectedResult: Item = {
        ...creationRequest,
        id: crypto.randomUUID(),
      };

      (createItem as Mock).mockResolvedValue(expectedResult);

      const response = await client.collection.$post({
        json: creationRequest,
      });
      const result = await response.json();

      expect(createItem).toHaveBeenCalledTimes(1);
      expect(createItem).toHaveBeenCalledWith(creationRequest);
      expect(result).toEqual(expectedResult);
    });
  });
});
