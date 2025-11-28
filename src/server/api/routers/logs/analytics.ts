import { count, max, min, sql } from "drizzle-orm";
import { z } from "zod";
import type { SeverityLevel } from "@/lib/enums/severity";
import type { ChartDataPoint } from "@/lib/types/chart";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { logs } from "@/server/db/schema";

import { buildLogWhere } from "./query-helpers";
import { severityLevelSchema } from "./schemas";

export const analyticsRouter = createTRPCRouter({
  // Get aggregation data for analytics
  getAggregation: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        severity: severityLevelSchema.optional(),
        source: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = buildLogWhere({
        severity: input.severity,
        source: input.source,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      // Get total logs
      const totalLogs = Number(
        (await ctx.db.select({ value: count() }).from(logs).where(where))[0]
          ?.value ?? 0,
      );

      const bySeverity = await ctx.db
        .select({
          severity: logs.severity,
          count: count().as("count"),
        })
        .from(logs)
        .where(where)
        .groupBy(logs.severity);

      const bySource = await ctx.db
        .select({
          source: logs.source,
          count: count().as("count"),
        })
        .from(logs)
        .where(where)
        .groupBy(logs.source);

      const dateExpr = sql<Date>`date(${logs.timestamp})`.as("date");
      const byDate = await ctx.db
        .select({
          date: dateExpr,
          count: count().as("count"),
        })
        .from(logs)
        .where(where)
        .groupBy(dateExpr)
        .orderBy(dateExpr);

      return {
        totalLogs,
        dateRangeStart: input.startDate ?? null,
        dateRangeEnd: input.endDate ?? null,
        bySeverity: bySeverity.map((item) => ({
          severity: item.severity as SeverityLevel,
          count: Number(item.count ?? 0),
        })),
        bySource: bySource.map((item) => ({
          source: item.source,
          count: Number(item.count ?? 0),
        })),
        byDate: byDate.map((item) => {
          const dateValue =
            item.date instanceof Date
              ? item.date
              : new Date(item.date as unknown as string);
          return {
            date: dateValue.toISOString().split("T")[0],
            count: Number(item.count ?? 0),
          };
        }),
      };
    }),

  // Get chart data for time series
  getChartData: publicProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        severity: severityLevelSchema.optional(),
        source: z.string().optional(),
        groupBy: z.enum(["hour", "day", "week", "month"]).default("day"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { startDate, endDate, severity, source, groupBy } = input;

      const where = buildLogWhere({
        severity,
        source,
        startDate,
        endDate,
      });

      const timeGroupMap = {
        hour: sql<Date>`date_trunc('hour', ${logs.timestamp})`,
        day: sql<Date>`date_trunc('day', ${logs.timestamp})`,
        week: sql<Date>`date_trunc('week', ${logs.timestamp})`,
        month: sql<Date>`date_trunc('month', ${logs.timestamp})`,
      } as const;

      const timeGroupExpression = timeGroupMap[groupBy].as("time_period");

      const rawData = await ctx.db
        .select({
          timePeriod: timeGroupExpression,
          severity: logs.severity,
          count: count().as("count"),
        })
        .from(logs)
        .where(where)
        .groupBy(timeGroupExpression, logs.severity)
        .orderBy(timeGroupExpression);

      const chartData: Record<string, ChartDataPoint> = {};

      rawData.forEach((row) => {
        const timeValue =
          row.timePeriod instanceof Date
            ? row.timePeriod
            : new Date(row.timePeriod as unknown as string);
        const timestamp = timeValue.toISOString();
        if (!chartData[timestamp]) {
          chartData[timestamp] = {
            timestamp,
            total: 0,
            DEBUG: 0,
            INFO: 0,
            WARNING: 0,
            ERROR: 0,
            CRITICAL: 0,
          };
        }
        const value = Number(row.count ?? 0);
        chartData[timestamp][row.severity] = value;
        chartData[timestamp].total += value;
      });

      return {
        data: Object.values(chartData),
        groupBy,
        startDate,
        endDate,
        filters: {
          severity,
          source,
        },
      };
    }),

  // Get metadata
  getMetadata: publicProcedure.query(async ({ ctx }) => {
    const sources = await ctx.db
      .selectDistinct({ source: logs.source })
      .from(logs);

    const [{ earliest, latest } = { earliest: null, latest: null }] =
      await ctx.db
        .select({
          earliest: min(logs.timestamp),
          latest: max(logs.timestamp),
        })
        .from(logs);

    const severityStats = await ctx.db
      .select({
        severity: logs.severity,
        count: count().as("count"),
      })
      .from(logs)
      .groupBy(logs.severity);

    const totalLogs = Number(
      (await ctx.db.select({ value: count() }).from(logs))[0]?.value ?? 0,
    );

    return {
      severityLevels: ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
      sources: sources.map((s) => s.source),
      dateRange: {
        earliest: earliest?.toISOString() ?? null,
        latest: latest?.toISOString() ?? null,
      },
      severityStats: Object.fromEntries(
        severityStats.map((stat) => [stat.severity, Number(stat.count ?? 0)]),
      ),
      totalLogs,
      sortFields: ["timestamp", "severity", "source", "message"],
      pagination: {
        defaultPageSize: 20,
        maxPageSize: 100,
      },
    };
  }),
});
