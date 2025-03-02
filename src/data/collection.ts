import type { Release } from "@/models/release.js";


export async function getRecordById(id: string): Promise<Release> {
  // Mock database query
  console.warn("getCollectionById", id);
  return {
    id: "4651e634-a530-4484-9b09-9616a28f35e3",
    title: "The Dark Side of the Moon",
    masterId: "4637",
    releaseDate: new Date(),
    artistIds: ["4d9f9b8f-7e3d-4f7a-bd4f-1e8f2f3e3b0b"],
    trackIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  };
}
