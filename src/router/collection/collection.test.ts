import type { Mock } from "vitest";

import { testClient } from "hono/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockItem } from "@/__mocks__/mock-record";
import { getRecordById, getUserRecords } from "@/dal/collection";
import { createOpenAPIApp } from "@/utils/app-utils";

import router from "./collection.index";

vi.mock("@/dal/collection", () => ({
  getRecordById: vi.fn(),
  getUserRecords: vi.fn(),
}));

describe("collection router", () => {
  const app = createOpenAPIApp();
  const userId = crypto.randomUUID();

  app.use(async (c, next) => {
    c.set("user", { id: userId });
    await next();
  });
  const client = testClient(app.route("/", router));

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return the correct release from the dal", async () => {
    (getRecordById as Mock).mockResolvedValue(mockItem);

    const response = await client.collection[":id"].$get({
      param: {
        id: "4651e634-a530-4484-9b09-9616a28f35e3",
      },
    });
    const result = await response.json();

    expect(getRecordById).toHaveBeenCalledTimes(1);
    expect(getRecordById).toHaveBeenCalledWith("4651e634-a530-4484-9b09-9616a28f35e3");
    expect(result).toEqual(mockItem);
  });

  it("should return the user record collection", async () => {
    (getUserRecords as Mock).mockResolvedValue([mockItem]);

    const response = await client.collection.$get();
    const result = await response.json();

    expect(getUserRecords).toHaveBeenCalledTimes(1);
    expect(getUserRecords).toHaveBeenCalledWith(userId);
    expect(result).toEqual([mockItem]);
  });

  it("should call the dal with the user id", async () => {
    (getUserRecords as Mock).mockResolvedValue([mockItem]);

    const response = await client.collection.$get();
    const result = await response.json();

    expect(getUserRecords).toHaveBeenCalledTimes(1);
    expect(getUserRecords).toHaveBeenCalledWith(userId);
    expect(result).toEqual([mockItem]);
  });
});
