import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { logs } from "../src/server/db/schema";

const SEVERITIES = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] as const;
const SOURCES = ["api-server", "web-app", "worker", "ingest", "cron", "auth"];
const MESSAGES = [
  "Request completed",
  "Cache miss",
  "Background job finished",
  "User authentication",
  "Rate limit hit",
  "Database query executed",
  "Log ingestion",
  "Service restart",
  "Error reported",
  "Warning threshold reached",
];

const TOTAL = 1000;
const CHUNK_SIZE = 200;
const FORTY_FIVE_DAYS_MS = 45 * 24 * 60 * 60 * 1000;

const randomItem = <T>(list: readonly T[]) =>
  list[Math.floor(Math.random() * list.length)];

const buildRecord = (index: number) => {
  const timestamp = new Date(
    Date.now() - Math.floor(Math.random() * FORTY_FIVE_DAYS_MS),
  );

  return {
    message: `${randomItem(MESSAGES)} #${index + 1}`,
    severity: randomItem(SEVERITIES),
    source: randomItem(SOURCES),
    timestamp,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  const shouldReset = process.argv.includes("--reset");

  if (shouldReset) {
    await db.delete(logs);
    console.log("Cleared existing log entries");
  }

  const payload = Array.from({ length: TOTAL }, (_, idx) => buildRecord(idx));

  for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
    const slice = payload.slice(i, i + CHUNK_SIZE);
    await db.insert(logs).values(slice);
    console.log(
      `Inserted ${Math.min(i + CHUNK_SIZE, payload.length)} / ${payload.length}`,
    );
  }

  console.log(`Seeded ${payload.length} log entries`);
  await client.end();
}

main().catch((error) => {
  console.error("Seed failed", error);
  process.exitCode = 1;
});
