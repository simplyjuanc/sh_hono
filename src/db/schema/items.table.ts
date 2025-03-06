import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { relations } from "drizzle-orm";
import { numeric, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "@/utils/create-table";

import { ConditionEnum, FormatEnum } from "./pg-enums";
import users from "./users.table";

const items = createTable("items", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  title: text("title").notNull(),
  artists: text("artists").array().notNull(),
  releaseDate: text("release_date"),
  price: numeric("price", { precision: 2 }).notNull(),
  condition: ConditionEnum("condition"),
  ownerId: uuid("owner_id").notNull(),
  format: FormatEnum("format").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .$onUpdate(() => new Date().toISOString()),
  deletedAt: timestamp("deleted_at"),
});

export const itemsRelations = relations(items, ({ one }) => ({
  owner: one(users, {
    fields: [items.ownerId],
    references: [users.id],
  }),
}));

export type InferItemSelect = InferSelectModel<typeof items>;
export type InferItemInsert = InferInsertModel<typeof items>;

export default items;
