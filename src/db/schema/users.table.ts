import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { relations } from "drizzle-orm";
import { text, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "@/utils/create-table";

import items from "./items.table";

const users = createTable("users", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  middleName: text("middle_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .$onUpdate(() => new Date().toISOString()),
  deletedAt: timestamp("deleted_at"),
});

export const userRelations = relations(users, ({ many }) => ({
  ownedItems: many(items),
}));

export type InferUserSelect = InferSelectModel<typeof users>;
export type InferUserInsert = InferInsertModel<typeof users>;

export default users;
