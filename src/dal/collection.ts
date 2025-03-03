import type { Release } from "@/models/release.js";
import { mockRecord } from "@/__mocks__/mockRecord.js";


export async function getRecordById(id: string): Promise<Release> {
  // TODO
  // Mock database query
  console.warn("getCollectionById", id);
  return {...mockRecord, releaseDate: new Date()};
}

export async function getUserRecords(userId:string): Promise<Release[]> {
  // TODO
  // Mock database query
  console.warn("getUserRecords", userId);
  return [{...mockRecord, releaseDate: new Date() }];
}