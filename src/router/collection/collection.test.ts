import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";

import { createOpenAPIApp } from "@/utils/app-utils.js";

import router from "./collection.index.js";

const app = createOpenAPIApp();
const client = testClient(app.route("/", router));

describe("collection Router", () => {
  it("should return a specific item in a collection", async () => {
    // const response = await app.request("/collection");

    const response = await client.collection[":id"].$get({
      param: {
        id: "4651e634-a530-4484-9b09-9616a28f35e3",
      },
    });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      id: "4651e634-a530-4484-9b09-9616a28f35e3",
      title: "The Dark Side of the Moon",
      masterId: "4637",
      releaseDate: "1973-03-01",
      artistIds: ["4d9f9b8f-7e3d-4f7a-bd4f-1e8f2f3e3b0b"],
      trackIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    });
  });
});
