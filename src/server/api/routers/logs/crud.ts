import type { Prisma, SeverityLevel } from "@prisma-generated";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { logCreateSchema, logFiltersSchema, logUpdateSchema } from "./schemas";

export const crudRouter = createTRPCRouter({
  // Create a new log entry
  create: publicProcedure
    .input(logCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const log = await ctx.db.logEntry.create({
          data: {
            message: input.message,
            severity: input.severity as SeverityLevel,
            source: input.source,
            timestamp: input.timestamp ?? new Date(),
          },
        });
        return log;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create log entry",
          cause: error,
        });
      }
    }),

  // Get logs with filtering, sorting, and pagination
  getAll: publicProcedure
    .input(logFiltersSchema)
    .query(async ({ ctx, input }) => {
      try {
        const {
          page,
          pageSize,
          severity,
          source,
          startDate,
          endDate,
          search,
          sortBy,
          sortOrder,
        } = input;

        const where: Prisma.LogEntryWhereInput = {};

        if (severity) {
          where.severity = severity;
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

        const total = await ctx.db.logEntry.count({ where });

        const logs = await ctx.db.logEntry.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { [sortBy]: sortOrder },
        });

        const totalPages = Math.ceil(total / pageSize);

        return {
          logs,
          total,
          page,
          pageSize,
          totalPages,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch logs",
          cause: error,
        });
      }
    }),

  // Get a single log by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const log = await ctx.db.logEntry.findUnique({
        where: { id: input.id },
      });

      if (!log) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Log with ID ${input.id} not found`,
        });
      }

      return log;
    }),

  // Update a log entry
  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: logUpdateSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingLog = await ctx.db.logEntry.findUnique({
          where: { id: input.id },
        });

        if (!existingLog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Log with ID ${input.id} not found`,
          });
        }

        const log = await ctx.db.logEntry.update({
          where: { id: input.id },
          data: {
            ...(input.data.message && { message: input.data.message }),
            ...(input.data.severity && {
              severity: input.data.severity as SeverityLevel,
            }),
            ...(input.data.source && { source: input.data.source }),
            ...(input.data.timestamp && { timestamp: input.data.timestamp }),
          },
        });

        return log;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update log entry",
          cause: error,
        });
      }
    }),

  // Delete a log entry
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const existingLog = await ctx.db.logEntry.findUnique({
          where: { id: input.id },
        });

        if (!existingLog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Log with ID ${input.id} not found`,
          });
        }

        await ctx.db.logEntry.delete({
          where: { id: input.id },
        });

        return { success: true, message: "Log entry deleted successfully" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete log entry",
          cause: error,
        });
      }
    }),
});
