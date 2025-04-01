import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Item } from "@/models/item";

import db from "@/db";
import { items } from "@/db/schema";
import { EntityNotFoundError } from "@/models/errors/dal-errors";
import { mockDeleteFromDb, mockInsertIntoDb, mockQueryFailureFromDb, mockQuerySuccessFromDb } from "@/utils/test-utils";

import { createItem, deleteItem, getRecordById, getUserRecords } from "./collection";

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
    it("should call the collection table with the correct id", async () => {
      mockQuerySuccessFromDb(db, mockItemBase);

      vi.spyOn(db.select().from(items), "where");

      await getRecordById(itemId);

      expect(db.select().from(items).where).toHaveBeenCalledWith(eq(items.id, itemId));
    });

    it("should return the correct record from the dal", async () => {
      mockQuerySuccessFromDb(db, mockItemBase);

      const result = await getRecordById(itemId);

      expect(result).toEqual(mockItemBase);
    });

    it("should throw an error if record is not found", async () => {
      mockQueryFailureFromDb(db, new EntityNotFoundError("Record", itemId));

      await expect(getRecordById(itemId)).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe("getUserRecords", () => {
    it("should call the collection table with the correct user id", async () => {
      const userId = crypto.randomUUID();

      mockQuerySuccessFromDb(db);
      vi.spyOn(db.select().from(items), "where");

      await getUserRecords(userId);

      expect(db.select().from(items).where).toHaveBeenCalledWith(eq(items.ownerId, userId));
    });

    it("should return the correct records from the dal", async () => {
      const userId = crypto.randomUUID();

      mockQuerySuccessFromDb(db, mockItemBase);

      const result = await getUserRecords(userId);

      expect(result).toEqual([mockItemBase]);
    });

    it("should return an empty array if no records are found", async () => {
      const userId = crypto.randomUUID();

      mockQuerySuccessFromDb(db);

      const result = await getUserRecords(userId);

      expect(result).toEqual([]);
    });
  });

  describe("createItem", () => {
    const mockItemInsertAttributes = {
      ...mockItemBase,
      price: mockItemBase.price.toString(),
    };

    it("should call the collection table with the correct data", async () => {
      mockInsertIntoDb(db, mockItemBase);
      vi.spyOn(db.insert(items), "values");

      await createItem(mockItemInsertAttributes);

      expect(db.insert(items).values).toHaveBeenCalledWith(mockItemInsertAttributes);
    });

    it("should return the correct record from the dal", async () => {
      mockInsertIntoDb(db, mockItemBase);
      const result = await createItem(mockItemInsertAttributes);

      expect(result).toEqual(mockItemBase);
    });
  });

  describe("delete record", () => {
    it("should delete an existing record from the db", async () => {
      mockDeleteFromDb(db, mockItemBase);
      vi.spyOn(db.delete(items), "where");

      const result = await deleteItem(itemId);

      expect(result).toEqual(mockItemBase);
      expect(db.delete(items).where).toHaveBeenCalledExactlyOnceWith(eq(items.id, itemId));
    });
  });
});
