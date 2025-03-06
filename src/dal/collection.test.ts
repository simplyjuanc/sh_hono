import { describe, expect, it, vi } from "vitest";

import type { Item } from "@/models/item";

import db from "@/db";

import { getRecordById } from "./collection";

describe("collection dal", () => {
  const itemId = "4651e634-a530-4484-9b09-9616a28f35e3";

  const mockItem: Item = {
    id: itemId,
    ownerId: "me",
    tracks: [],
    price: 0,
    condition: "FAIR",
    format: "VINYL",
    title: "Test Item",
    artists: ["Test Artist", "Test Artist 2"],
  };

  it("should return the correct record from the dal", async () => {
    db.select = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([mockItem]),
      }),
    });
    const result = await getRecordById(itemId);

    expect(result).toEqual(mockItem);
  });

  it("should return the user record collection", async () => {
    // Add your test implementation here
  });
});
