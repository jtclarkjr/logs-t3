import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "@/server/db/schema";

const globalForDb = globalThis as unknown as {
  connection: ReturnType<typeof postgres> | undefined;
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

const connection =
  globalForDb.connection ??
  postgres(env.DATABASE_URL, {
    max: 10,
  });

export const db =
  globalForDb.db ?? drizzle(connection, { schema, logger: false });

if (env.NODE_ENV !== "production") {
  globalForDb.connection = connection;
  globalForDb.db = db;
}

export type DB = typeof db;
export { schema };
