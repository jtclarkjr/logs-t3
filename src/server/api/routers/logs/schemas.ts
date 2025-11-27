import { z } from "zod";

export const severityLevelSchema = z.enum([
  "DEBUG",
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL",
]);

export const logCreateSchema = z.object({
  message: z.string().min(1).max(1000),
  severity: severityLevelSchema,
  source: z.string().min(1).max(100),
  timestamp: z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = new Date(val);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return val;
  }, z.date().optional()),
});

export const logUpdateSchema = z.object({
  message: z.string().min(1).max(1000).optional(),
  severity: severityLevelSchema.optional(),
  source: z.string().min(1).max(100).optional(),
  timestamp: z.preprocess((val) => {
    if (typeof val === "string") {
      const parsed = new Date(val);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return val;
  }, z.date().optional()),
});

export const logFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  severity: severityLevelSchema.optional(),
  source: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().optional(),
  sortBy: z.string().default("timestamp"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
