import { z } from "zod";

export type ItemCondition =
  | "MINT"
  | "NEAR_MINT"
  | "VERY_GOOD_PLUS"
  | "VERY_GOOD"
  | "GOOD_PLUS"
  | "GOOD"
  | "FAIR"
  | "POOR";

export type Format =
  | "VINYL"
  | "CD"
  | "CASSETTE"
  | "DIGITAL"
  | "OTHER";

export interface Item {
  id: string;
  title: string;
  artists: string[];
  tracks: string[];
  price: number;
  format: Format;
  ownerId: string;
  condition?: ItemCondition;
  notes?: string;
}

export const itemSchema = z.object({
  id: z.string(),
  title: z.string(),
  artists: z.array(z.string()),
  tracks: z.array(z.string()),
  price: z.number(),
  format: z.string(),
  ownerId: z.string(),
  condition: z.string().optional(),
  notes: z.string().optional(),
});

export const insertItemSchema = itemSchema.omit({ id: true });
