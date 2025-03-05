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
  format: FormatEnum("format"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export default releases;
