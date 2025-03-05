import type { Item } from "@/models/item";

import { mockItem } from "@/__mocks__/mock-record";

export async function getRecordById(id: string): Promise<Item> {
  console.warn("getCollectionById", id);
  return mockItem;
}

export async function getUserRecords(userId: string): Promise<Item[]> {
  console.warn("getUserRecords", userId);
  return [mockItem];
}
