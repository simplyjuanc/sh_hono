import { z } from "zod";

export const itemConditionSchema = z.union([
  z.literal("MINT"),
  z.literal("NEAR_MINT"),
  z.literal("VERY_GOOD_PLUS"),
  z.literal("VERY_GOOD"),
  z.literal("GOOD_PLUS"),
  z.literal("GOOD"),
  z.literal("FAIR"),
  z.literal("POOR"),
  z.literal("UNKNOWN"),
]);

export const formatSchema = z.union([
  z.literal("VINYL"),
  z.literal("CD"),
  z.literal("CASSETTE"),
  z.literal("DIGITAL"),
  z.literal("OTHER"),
]);

export const itemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  artists: z.array(z.string()),
  price: z.number(),
  format: formatSchema,
  ownerId: z.string(),
  condition: itemConditionSchema,
  notes: z.string().optional(),
}).openapi({
  type: "object",
  title: "Item",
  description: "A physical or digital item in a user's collection",
});

export const insertItemSchema = itemSchema.omit({ id: true });

export type ItemCondition = z.infer<typeof itemConditionSchema>;
export type Format = z.infer<typeof formatSchema>;
export type Item = z.infer<typeof itemSchema>;
