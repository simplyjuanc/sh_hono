import { eq } from "drizzle-orm";
import { v4 as uuidV4 } from "uuid";
import { describe, expect, it, vi } from "vitest";

import type { Item } from "@/models/item";

import db from "@/db";
import { items } from "@/db/schema";

import { createItem, getRecordById, getUserRecords } from "./collection";

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

  describe("getRecordById", () => {
    it("should call the collection table with the correct if", async () => {
      mockQueryFromDb(mockItem);

      vi.spyOn(db.select().from(items), "where");

      await getRecordById(itemId);

      // expect(db.select).toHaveBeenCalledWith();
      expect(db.select().from(items).where).toHaveBeenCalledWith(eq(items.id, itemId));
    });

    it("should return the correct record from the dal", async () => {
      mockQueryFromDb(mockItem);

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

  describe("getUserRecords", () => {
    it("should call the collection table with the correct user id", async () => {
      const userId = uuidV4();

      mockQueryFromDb();
      vi.spyOn(db.select().from(items), "where");

      await getUserRecords(userId);

      expect(db.select().from(items).where).toHaveBeenCalledWith(eq(items.ownerId, userId));
    });

    it("should return the correct records from the dal", async () => {
      const userId = uuidV4();

      mockQueryFromDb(mockItem);

      const result = await getUserRecords(userId);

      expect(result).toEqual([mockItem]);
    });

    it("should return an empty array if no records are found", async () => {
      const userId = uuidV4();

      mockQueryFromDb();

      const result = await getUserRecords(userId);

      expect(result).toEqual([]);
    });
  });

  describe("createItem", () => {
    it("should call the collection table with the correct data", async () => {
      const expectedCallArg = {
        ...mockItem,
        price: mockItem.price.toString(),
      };

      mockInsertIntoDb(mockItem);
      vi.spyOn(db.insert(items), "values");

      await createItem(mockItem);

      expect(db.insert(items).values).toHaveBeenCalledWith(expectedCallArg);
    });

    it("should return the correct record from the dal", async () => {
      const result = await createItem(mockItem);

      expect(result).toEqual(mockItem);
    });
  });
});

function mockQueryFromDb(mockResult?: Item) {
  db.select = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(mockResult ? [mockResult] : []),
    }),
  });
}

function mockInsertIntoDb(mockItem: Item) {
  db.insert = vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([mockItem]),
    }),
  });
}
