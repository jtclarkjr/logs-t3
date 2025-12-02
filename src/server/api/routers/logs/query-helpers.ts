import type { AnyColumn, SQL } from "drizzle-orm";
import { and, asc, desc, eq, gte, ilike, lte } from "drizzle-orm";

import type { SeverityLevel } from "@/lib/enums/severity";
import type { SortByField, SortOrder } from "@/lib/types/filters";
import { logs } from "@/server/db/schema";

type LogWhereInput = {
  severity?: SeverityLevel;
  source?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  createdBy?: string;
  updatedBy?: string;
};

const sortableColumns: Record<SortByField, AnyColumn> = {
  timestamp: logs.timestamp,
  severity: logs.severity,
  source: logs.source,
};

export function buildLogWhere({
  severity,
  source,
  startDate,
  endDate,
  search,
  createdBy,
  updatedBy,
}: LogWhereInput): SQL<unknown> | undefined {
  const clauses: SQL<unknown>[] = [];

  if (severity) {
    clauses.push(eq(logs.severity, severity));
  }

  if (source) {
    clauses.push(ilike(logs.source, `%${source}%`));
  }

  if (startDate) {
    clauses.push(gte(logs.timestamp, startDate));
  }

  if (endDate) {
    clauses.push(lte(logs.timestamp, endDate));
  }

  if (search) {
    clauses.push(ilike(logs.message, `%${search}%`));
  }

  if (createdBy) {
    clauses.push(eq(logs.createdBy, createdBy));
  }

  if (updatedBy) {
    clauses.push(eq(logs.updatedBy, updatedBy));
  }

  return clauses.length ? and(...clauses) : undefined;
}

export function buildSort(sortBy: SortByField, sortOrder: SortOrder) {
  const column = sortableColumns[sortBy] ?? logs.timestamp;
  return sortOrder === "asc" ? asc(column) : desc(column);
}
