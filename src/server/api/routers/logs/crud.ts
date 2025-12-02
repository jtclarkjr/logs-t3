import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { authEnabled } from "@/lib/config/auth";
import type { SeverityLevel } from "@/lib/enums/severity";
import type { SortByField } from "@/lib/types/filters";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { logs } from "@/server/db/schema";
import { buildLogWhere, buildSort } from "./query-helpers";
import { logCreateSchema, logFiltersSchema, logUpdateSchema } from "./schemas";

export const crudRouter = createTRPCRouter({
  // Create a new log entry
  create: publicProcedure
    .input(logCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (authEnabled && !ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required to create logs",
          });
        }

        const userId = ctx.user?.id ?? null;

        const [log] = await ctx.db
          .insert(logs)
          .values({
            message: input.message,
            severity: input.severity as SeverityLevel,
            source: input.source,
            timestamp: input.timestamp ?? new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            updatedBy: userId,
          })
          .returning();
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

        const where = buildLogWhere({
          severity,
          source,
          startDate,
          endDate,
          search,
        });

        const totalValue =
          (await ctx.db.select({ value: count() }).from(logs).where(where))[0]
            ?.value ?? 0;

        const sortableFields = ["timestamp", "severity", "source"] as const;
        const sortField = sortableFields.includes(sortBy as SortByField)
          ? (sortBy as SortByField)
          : "timestamp";

        const results = await ctx.db
          .select()
          .from(logs)
          .where(where)
          .orderBy(buildSort(sortField, sortOrder))
          .limit(pageSize)
          .offset((page - 1) * pageSize);

        const total = Number(totalValue ?? 0);
        const totalPages = Math.ceil(total / pageSize);

        return {
          logs: results,
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
      const log = await ctx.db.query.logs.findFirst({
        where: eq(logs.id, input.id),
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
        if (authEnabled && !ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required to update logs",
          });
        }

        const userId = ctx.user?.id ?? null;

        const existingLog = await ctx.db.query.logs.findFirst({
          where: eq(logs.id, input.id),
        });

        if (!existingLog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Log with ID ${input.id} not found`,
          });
        }

        const [log] = await ctx.db
          .update(logs)
          .set({
            ...(input.data.message && { message: input.data.message }),
            ...(input.data.severity && {
              severity: input.data.severity as SeverityLevel,
            }),
            ...(input.data.source && { source: input.data.source }),
            ...(input.data.timestamp && { timestamp: input.data.timestamp }),
            updatedAt: new Date(),
            updatedBy: userId,
          })
          .where(eq(logs.id, input.id))
          .returning();

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
        if (authEnabled && !ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required to delete logs",
          });
        }

        const existingLog = await ctx.db.query.logs.findFirst({
          where: eq(logs.id, input.id),
        });

        if (!existingLog) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Log with ID ${input.id} not found`,
          });
        }

        await ctx.db.delete(logs).where(eq(logs.id, input.id));

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
