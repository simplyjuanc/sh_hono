import { testClient } from "hono/testing";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { createOpenAPIApp } from "@/utils/app-utils.js";

import router from "./collection.index.js";
import { getRecordById, getUserRecords } from "@/data/collection.js";
import type { Release } from "@/models/release.js";

vi.mock('@/data/collection.js', () => ({
  getRecordById: vi.fn((id:string) => Promise<Release>),
  getUserRecords: vi.fn((id:string) => Promise<Release[]>),
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

  const mockRecord = {
    id: "4651e634-a530-4484-9b09-9616a28f35e3",
    title: "The Dark Side of the Moon",
    masterId: "4637",
    releaseDate: "1973-03-01",
    artistIds: ["4d9f9b8f-7e3d-4f7a-bd4f-1e8f2f3e3b0b"],
    trackIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  };

  it("should return the correct release from the dal", async () => {
    (getRecordById as Mock).mockResolvedValue(mockRecord)

    const response = await client.collection[":id"].$get({
      param: {
        id: "4651e634-a530-4484-9b09-9616a28f35e3",
      },
    });
    const result = await response.json();

    expect(getRecordById).toHaveBeenCalledTimes(1);
    expect(getRecordById).toHaveBeenCalledWith("4651e634-a530-4484-9b09-9616a28f35e3");
    expect(result).toEqual(mockRecord);
    }
  )

  it("should return the user record collection", async () => {
    (getUserRecords as Mock).mockResolvedValue([mockRecord]);

    const response = await client.collection.$get()
    const result = await response.json();    
    
    expect(getUserRecords).toHaveBeenCalledTimes(1);
    expect(getUserRecords).toHaveBeenCalledWith(userId);
    expect(result).toEqual([mockRecord]);  
    });
  
  it("should call the dal with the user id", async () => {


    (getUserRecords as Mock).mockResolvedValue([mockRecord]);

    const response = await client.collection.$get()
    const result = await response.json();    
    
    expect(getUserRecords).toHaveBeenCalledTimes(1);
    expect(getUserRecords).toHaveBeenCalledWith(userId);
    expect(result).toEqual([mockRecord]);    
  });
  });
