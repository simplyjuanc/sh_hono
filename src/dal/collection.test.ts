import { fromPartial } from "@total-typescript/shoehorn";
import { eq } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";

import type { Item } from "@/models/item";

import db from "@/db";
import { items } from "@/db/schema";

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

  it("should call the collection table with the correct if", async () => {
    mockQueryReturnValue(mockItem);

    vi.spyOn(db.select().from(items), "where");

    await getRecordById(itemId);

    // expect(db.select).toHaveBeenCalledWith();
    expect(db.select().from(items).where).toHaveBeenCalledWith(eq(items.id, itemId));
  });

  it("should return the correct record from the dal", async () => {
    mockQueryReturnValue(mockItem);

    const result = await getRecordById(itemId);

    expect(result).toEqual(mockItem);
  });

  it("should throw an error if record is not found", async () => {
    db.select = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockRejectedValue(new Error("Record not found")),
      }),
    });

    await expect(getRecordById(itemId)).rejects.toThrow("Record not found");
  });
});

function mockQueryReturnValue(mockResult?: Item) {
  db.select = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(mockResult ? [mockResult] : []),
    }),
  });
}
