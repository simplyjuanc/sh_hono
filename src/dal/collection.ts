import { eq } from "drizzle-orm";

import type { InferItemSelect } from "@/db/schema/items.table";
import type { Item } from "@/models/item";

import { mockItem } from "@/__mocks__/mock-record";
import drizzleDb from "@/db";
import { items } from "@/db/schema";

export async function getRecordById(id: string, db = drizzleDb): Promise<Item> {
  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, id));

  if (item.length === 0) {
    throw new Error("Record not found");
  }

  return mapToItemDto(item[0]);
}

export async function getUserRecords(userId: string, db = drizzleDb): Promise<Item[]> {
  console.warn("getUserRecords", userId);
  const collection = await db
    .select()
    .from(items)
    .where(eq(items.ownerId, userId));

  return collection.map(mapToItemDto);
}

function mapToItemDto(item: InferItemSelect): Item {
  // TODO finish mapping once the schema is complete
  const result: Item = {
    ...item,
    tracks: [],
    price: Number(item.price),
    condition: item.condition ?? undefined,
  };
  return result;
}
