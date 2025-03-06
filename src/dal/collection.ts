import { eq } from "drizzle-orm";

import type { Item } from "@/models/item";

import { mockItem } from "@/__mocks__/mock-record";
import drizzleDb from "@/db";
import { items } from "@/db/schema";

export async function getRecordById(id: string, db = drizzleDb): Promise<Item> {
  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, id));

  const firstItem = item[0];
  const result: Item = {
    ...firstItem,
    ownerId: "me",
    tracks: [],
    price: 0,
    condition: firstItem.condition ?? undefined,
  };
  return result;
}

export async function getUserRecords(userId: string): Promise<Item[]> {
  console.warn("getUserRecords", userId);
  return [mockItem];
}
