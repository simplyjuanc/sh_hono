import { eq } from "drizzle-orm";

import type { InferItemInsert, InferItemSelect } from "@/db/schema/items.table";
import type { Item } from "@/models/item";

import drizzleDb from "@/db";
import { items } from "@/db/schema";
import { DatabaseError, EntityNotFoundError } from "@/models/errors/dal-errors";

const DEFAULT_CONDITION = "UNKNOWN" as const;

export async function getRecordById(id: string, db = drizzleDb): Promise<Item> {
  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, id))
    .then(([result]) => result);

  if (!item) {
    throw new EntityNotFoundError("Item", id);
  }
  return mapToItemDto(item);
}

export async function getUserRecords(userId: string, db = drizzleDb): Promise<Item[]> {
  try {
    const userCollection = await db
      .select()
      .from(items)
      .where(eq(items.ownerId, userId));

    return userCollection.map(mapToItemDto);
  }
  catch {
    throw new DatabaseError(`Failed to fetch records for user ${userId}`);
  }
}

export async function createItem(newItem: InferItemInsert, db = drizzleDb): Promise<Item> {
  const createdItem = await db
    .insert(items)
    .values({
      ...newItem,
      price: newItem.price.toString(),
    })
    .returning()
    .then(([result]) => result);

  if (!createdItem) {
    throw new DatabaseError(`Could not create item '${newItem.title}'`);
  }
  return mapToItemDto(createdItem);
}

export async function deleteItem(id: string, db = drizzleDb): Promise<Item> {
  const deletedItem = await db
    .delete(items)
    .where(eq(items.id, id))
    .returning()
    .then(([result]) => result);

  return mapToItemDto(deletedItem);
}

function mapToItemDto(item: InferItemSelect): Item {
  return {
    ...item,
    price: Number(item.price),
    condition: item.condition ?? DEFAULT_CONDITION,
  };
}
