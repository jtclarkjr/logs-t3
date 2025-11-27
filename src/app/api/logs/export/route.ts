import type { Prisma } from "@prisma-generated";
import { NextResponse } from "next/server";
import type { SeverityLevel } from "@/lib/enums/severity";

import { db } from "@/server/db";

// Use a plain Next.js route for CSV download; tRPC endpoints are JSON-centric and awkward for file attachments.
const MAX_EXPORT = 5000;

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseDate = (value: string | null) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const escapeCsv = (value: string | Date) => {
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseNumber(searchParams.get("page"), 1);
  const pageSize = Math.min(
    parseNumber(searchParams.get("pageSize"), 100),
    MAX_EXPORT,
  );
  const search = searchParams.get("search") ?? undefined;
  const severity = searchParams.get("severity") ?? undefined;
  const source = searchParams.get("source") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "timestamp";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const startDate = parseDate(searchParams.get("startDate"));
  const endDate = parseDate(searchParams.get("endDate"));

  const where: Prisma.LogEntryWhereInput = {};

  if (severity) {
    where.severity = severity as SeverityLevel;
  }

  if (source) {
    where.source = { contains: source, mode: "insensitive" };
  }

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = startDate;
    if (endDate) where.timestamp.lte = endDate;
  }

  if (search) {
    where.message = { contains: search, mode: "insensitive" };
  }

  const logs = await db.logEntry.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const header = [
    "id",
    "timestamp",
    "severity",
    "source",
    "message",
    "createdAt",
    "updatedAt",
  ];

  const rows = logs.map((log) => [
    log.id,
    log.timestamp.toISOString(),
    log.severity,
    log.source,
    log.message,
    log.createdAt.toISOString(),
    log.updatedAt.toISOString(),
  ]);

  const csv = [header, ...rows]
    .map((line) => line.map(escapeCsv).join(","))
    .join("\n");

  const now = new Date().toISOString().split("T")[0];
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="logs-export-${now}.csv"`,
    },
  });
}
