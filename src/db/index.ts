import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env";

import * as schema from "./schema/index";

/**
 * Cache the database connection in development.
 * This avoids creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  connection: postgres.Sql;
};

const connection = postgres(env.DB_URL, {
  max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
  onnotice: env.DB_SEEDING ? () => { } : undefined,
});

if (env.NODE_ENV !== "production") {
  globalForDb.connection = connection;
}

const drizzleDb = drizzle(connection, { schema, logger: true });

export type Database = typeof drizzleDb;
export default drizzleDb;
