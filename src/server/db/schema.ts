import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const severityEnum = pgEnum("severity_level", [
  "DEBUG",
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL",
]);

// Logs schema
export const logs = pgTable(
  "logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
    message: text("message").notNull(),
    severity: severityEnum("severity").notNull(),
    source: text("source").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("logs_timestamp_idx").on(table.timestamp),
    index("logs_severity_idx").on(table.severity),
    index("logs_source_idx").on(table.source),
  ],
);

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
