import { and, eq, isNotNull } from "drizzle-orm";

import type { InferItemInsert } from "@/db/schema/items.table";
import type { Item } from "@/models/item";

import drizzleDb from "@/db";
import { items } from "@/db/schema";
import { DatabaseError, EntityNotFoundError } from "@/models/errors/dal-errors";
import { itemSchema } from "@/models/item";

export async function getRecordById(id: string, db = drizzleDb): Promise<Item> {
  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, id))
    .then(([result]) => result);

  if (!item) {
    throw new EntityNotFoundError("Item", id);
  }
  return itemSchema.parse(item);
}

export async function getUserRecords(userId: string, db = drizzleDb): Promise<Item[]> {
  try {
    const userCollection = await db
      .select()
      .from(items)
      .where(
        and(
          eq(items.ownerId, userId),
          isNotNull(items.deletedAt),
        ),
      );

    return userCollection.map(record => itemSchema.parse(record));
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
  return itemSchema.parse(createdItem);
}

export async function deleteItem(id: string, db = drizzleDb): Promise<Item> {
  const [deletedItem] = await db
    .update(items)
    .set({ deletedAt: new Date() })
    .where(eq(items.id, id))
    .returning();

  return itemSchema.parse(deletedItem);
}
