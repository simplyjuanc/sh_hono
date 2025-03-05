import { numeric, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "@/utils/create-table";

import { ConditionEnum, FormatEnum } from "./pg-enums";

const releases = createTable("releases", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  title: text("title").notNull(),
  artists: text("artists").array().notNull(),
  releaseDate: text("release_date"),
  masterId: text("master_id").notNull(),
  price: numeric("price", { precision: 2 }).notNull(),
  condition: ConditionEnum("condition"),
  format: FormatEnum("format").notNull(),
  createdAt: timestamp("created_at", {mode: "string"}).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", {mode: "string"})
    .notNull()
    .$onUpdate(() => new Date().toISOString()),
  deletedAt: timestamp("deleted_at"),
});

export default releases;
