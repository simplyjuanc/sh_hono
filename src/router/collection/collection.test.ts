import { testClient } from "hono/testing";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { createOpenAPIApp } from "@/utils/app-utils.js";

import router from "./collection.index.js";
import { getRecordById } from "@/data/collection.js";

const app = createOpenAPIApp();
const client = testClient(app.route("/", router));

vi.mock('@/data/collection.js', () => ({
  getRecordById: vi.fn(),
}));

describe("collection router", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return the correct release from the dal", async () => {
    (getRecordById as Mock).mockResolvedValue({
      id: "4651e634-a530-4484-9b09-9616a28f35e3",
      title: "The Dark Side of the Moon",
      masterId: "4637",
      releaseDate: "1973-03-01",
      artistIds: ["4d9f9b8f-7e3d-4f7a-bd4f-1e8f2f3e3b0b"],
      trackIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    })

    await client.collection[":id"].$get({
      param: {
        id: "4651e634-a530-4484-9b09-9616a28f35e3",
      },
    });

    expect(getRecordById).toHaveBeenCalledTimes(1);
    expect(getRecordById).toHaveBeenCalledWith("4651e634-a530-4484-9b09-9616a28f35e3");
    }
  )
})
