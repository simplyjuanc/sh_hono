import type { Item } from "@/models/item";

import { Format, ItemCondition } from "@/models/item";

export const mockItem: Item = {
  id: "4651e634-a530-4484-9b09-9616a28f35e3",
  title: "The Dark Side of the Moon",
  artists: ["Pink Floyd"],
  tracks: [
    "Speak to Me", 
    "Breathe", 
    "On the Run", 
    "Time", 
    "The Great Gig in the Sky", 
    "Money", 
    "Us and Them", 
    "Any Colour You Like", 
    "Brain Damage", 
    "Eclipse"
  ],
  price: 19.99,
  ownerId: "4d9f9b8f-7e3d-4f7a-bd4f-1e8f2f3e3b0b",
  format: "VINYL",
  condition: "MINT",
  notes: "This is a great album!",
};
