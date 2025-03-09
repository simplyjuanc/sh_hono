import { eq } from "drizzle-orm";

import type { InferItemInsert, InferItemSelect } from "@/db/schema/items.table";
import type { Item } from "@/models/item";

import drizzleDb from "@/db";
import { items } from "@/db/schema";

export async function getRecordById(id: string, db = drizzleDb): Promise<Item> {
  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, id))
    .then(([result]) => result);

  return mapToItemDto(item);
}

export async function getUserRecords(userId: string, db = drizzleDb): Promise<Item[]> {
  console.warn("getUserRecords", userId);
  const collection = await db
    .select()
    .from(items)
    .where(eq(items.ownerId, userId));

  return collection.map(mapToItemDto);
}

export async function createItem(newItem: InferItemInsert, db = drizzleDb): Promise<Item> {
  const insertedItem = await db
    .insert(items)
    .values({
      ...newItem,
      price: newItem.price.toString(),
    })
    .returning()
    .then(([result]) => result);

  return mapToItemDto(insertedItem);
}

function mapToItemDto(item: InferItemSelect): Item {
  return {
    ...item,
    price: Number(item.price),
    condition: item.condition ?? "UNKNOWN", // default to "UNKNOWN" if condition is null
  };
}
