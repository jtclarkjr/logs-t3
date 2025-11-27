import type { Prisma } from "@prisma-generated";
import { z } from "zod";

import type { SeverityLevel } from "@/lib/enums/severity";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { severityLevelSchema } from "./schemas";

type ChartDatum = {
  timestamp: string;
  total: number;
  DEBUG: number;
  INFO: number;
  WARNING: number;
  ERROR: number;
  CRITICAL: number;
};

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
      // Build where clause
      const where: Prisma.LogEntryWhereInput = {};

      if (input.severity) {
        where.severity = input.severity;
      }

      if (input.source) {
        where.source = { contains: input.source, mode: "insensitive" };
      }

      if (input.startDate || input.endDate) {
        where.timestamp = {};
        if (input.startDate) where.timestamp.gte = input.startDate;
        if (input.endDate) where.timestamp.lte = input.endDate;
      }

      // Get total logs
      const totalLogs = await ctx.db.logEntry.count({ where });

      const bySeverity = await ctx.db.logEntry.groupBy({
        by: ["severity"],
        where,
        _count: { severity: true },
      });

      const bySource = await ctx.db.logEntry.groupBy({
        by: ["source"],
        where,
        _count: { source: true },
      });

      // Get count by date (Prisma can't group by DATE(timestamp) directly, so use a raw query with parameters)
      const whereConditions: string[] = [];
      const params: Array<Date | string> = [];
      let paramIndex = 1;

      if (input.startDate) {
        whereConditions.push(`timestamp >= $${paramIndex}`);
        params.push(input.startDate);
        paramIndex++;
      }

      if (input.endDate) {
        whereConditions.push(`timestamp <= $${paramIndex}`);
        params.push(input.endDate);
        paramIndex++;
      }

      if (input.severity) {
        whereConditions.push(`severity = $${paramIndex}`);
        params.push(input.severity);
        paramIndex++;
      }

      if (input.source) {
        whereConditions.push(`source ILIKE $${paramIndex}`);
        params.push(`%${input.source}%`);
        paramIndex++;
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      const byDate = await ctx.db.$queryRawUnsafe<
        Array<{ date: Date; count: bigint }>
      >(
        `
          SELECT
            DATE(timestamp) as date,
            COUNT(*)::int as count
          FROM logs
          ${whereClause}
          GROUP BY DATE(timestamp)
          ORDER BY date
        `,
        ...params,
      );

      return {
        totalLogs,
        dateRangeStart: input.startDate ?? null,
        dateRangeEnd: input.endDate ?? null,
        bySeverity: bySeverity.map((item) => ({
          severity: item.severity as SeverityLevel,
          count: item._count.severity,
        })),
        bySource: bySource.map((item) => ({
          source: item.source,
          count: item._count.source,
        })),
        byDate: byDate.map((item) => ({
          date: item.date.toISOString().split("T")[0],
          count: Number(item.count),
        })),
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

      // Build where conditions (parameterized) for a raw time-series query
      const whereConditions: string[] = [];
      const params: unknown[] = [];
      let paramIndex = 1;

      if (startDate) {
        whereConditions.push(`timestamp >= $${paramIndex}`);
        params.push(startDate);
        paramIndex++;
      }
      if (endDate) {
        whereConditions.push(`timestamp <= $${paramIndex}`);
        params.push(endDate);
        paramIndex++;
      }
      if (severity) {
        whereConditions.push(`severity = $${paramIndex}`);
        params.push(severity);
        paramIndex++;
      }
      if (source) {
        whereConditions.push(`source ILIKE $${paramIndex}`);
        params.push(`%${source}%`);
        paramIndex++;
      }

      const whereClause =
        whereConditions.length > 0
          ? `WHERE ${whereConditions.join(" AND ")}`
          : "";

      // Determine time grouping
      let timeGroupExpression = "";
      switch (groupBy) {
        case "hour":
          timeGroupExpression = "date_trunc('hour', timestamp)";
          break;
        case "day":
          timeGroupExpression = "date_trunc('day', timestamp)";
          break;
        case "week":
          timeGroupExpression = "date_trunc('week', timestamp)";
          break;
        case "month":
          timeGroupExpression = "date_trunc('month', timestamp)";
          break;
      }

      const rawData = await ctx.db.$queryRawUnsafe<
        Array<{ time_period: Date; severity: SeverityLevel; count: bigint }>
      >(
        `
          SELECT
            ${timeGroupExpression} as time_period,
            severity,
            COUNT(*)::int as count
          FROM logs
          ${whereClause}
          GROUP BY time_period, severity
          ORDER BY time_period
        `,
        ...params,
      );

      const chartData: Record<string, ChartDatum> = {};

      rawData.forEach((row) => {
        const timestamp = row.time_period.toISOString();
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
        chartData[timestamp][row.severity] = Number(row.count);
        chartData[timestamp].total += Number(row.count);
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
    // Get all unique sources
    const sources = await ctx.db.logEntry.findMany({
      select: { source: true },
      distinct: ["source"],
    });

    // Get date range
    const dateRange = await ctx.db.logEntry.aggregate({
      _min: { timestamp: true },
      _max: { timestamp: true },
    });

    // Get severity stats
    const severityStats = await ctx.db.logEntry.groupBy({
      by: ["severity"],
      _count: { severity: true },
    });

    // Get total logs
    const totalLogs = await ctx.db.logEntry.count();

    return {
      severityLevels: ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
      sources: sources.map((s) => s.source),
      dateRange: {
        earliest: dateRange._min.timestamp?.toISOString() ?? null,
        latest: dateRange._max.timestamp?.toISOString() ?? null,
      },
      severityStats: Object.fromEntries(
        severityStats.map((stat) => [stat.severity, stat._count.severity]),
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
