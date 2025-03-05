import { text, timestamp, uuid } from "drizzle-orm/pg-core";

import { createTable } from "@/utils/create-table";

const releases = createTable("releases", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  releaseDate: text("release_date"),
  masterId: text("master_id").notNull(),
});

export default releases;
