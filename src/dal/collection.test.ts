import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Item } from "@/models/item";

import db from "@/db";
import { items } from "@/db/schema";
import { mockInsertIntoDb, mockQueryFromDb } from "@/utils/test-utils";

import { createItem, getRecordById, getUserRecords } from "./collection";

describe("collection dal", () => {
  const itemId = crypto.randomUUID();

  const mockItemBase: Item = {
    id: itemId,
    ownerId: crypto.randomUUID(),
    price: 0,
    condition: "FAIR",
    format: "VINYL",
    title: "Test Item",
    artists: ["Test Artist", "Test Artist 2"],
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getRecordById", () => {
    it("should call the collection table with the correct if", async () => {
      mockQueryFromDb(db, mockItemBase);

      vi.spyOn(db.select().from(items), "where");

      await getRecordById(itemId);

      // expect(db.select).toHaveBeenCalledWith();
      expect(db.select().from(items).where).toHaveBeenCalledWith(eq(items.id, itemId));
    });

    it("should return the correct record from the dal", async () => {
      mockQueryFromDb(db, mockItemBase);

      const result = await getRecordById(itemId);

      expect(result).toEqual(mockItemBase);
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
      const userId = crypto.randomUUID();

      mockQueryFromDb(db);
      vi.spyOn(db.select().from(items), "where");

      await getUserRecords(userId);

      expect(db.select().from(items).where).toHaveBeenCalledWith(eq(items.ownerId, userId));
    });

    it("should return the correct records from the dal", async () => {
      const userId = crypto.randomUUID();

      mockQueryFromDb(db, mockItemBase);

      const result = await getUserRecords(userId);

      expect(result).toEqual([mockItemBase]);
    });

    it("should return an empty array if no records are found", async () => {
      const userId = crypto.randomUUID();

      mockQueryFromDb(db);

      const result = await getUserRecords(userId);

      expect(result).toEqual([]);
    });
  });

  const mockItemInsertAttributes = {
    ...mockItemBase,
    price: mockItemBase.price.toString(),
  };

  describe("createItem", () => {
    it("should call the collection table with the correct data", async () => {
      const expectedCallArg = {
        ...mockItemBase,
        price: mockItemBase.price.toString(),
      };

      mockInsertIntoDb(db, mockItemBase);
      vi.spyOn(db.insert(items), "values");

      await createItem(mockItemInsertAttributes);

      expect(db.insert(items).values).toHaveBeenCalledWith(expectedCallArg);
    });

    it("should return the correct record from the dal", async () => {
      mockInsertIntoDb(db, mockItemBase);
      const result = await createItem(mockItemInsertAttributes);

      expect(result).toEqual(mockItemBase);
    });
  });
});
