/**
 * tRPC-based hooks for logs operations
 * This file replaces the REST API hooks with tRPC equivalents while maintaining the same API
 */

import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import type { GroupBy } from "@/lib/types/filters";
import type { RouterInputs } from "@/trpc/react";
import { api } from "@/trpc/react";

// Type aliases matching the old API
type LogFilters = RouterInputs["logs"]["getAll"];
type LogAggregationFilters = RouterInputs["logs"]["getAggregation"];
type ChartFilters = RouterInputs["logs"]["getChartData"];
type LogCreate = RouterInputs["logs"]["create"];
type LogUpdate = RouterInputs["logs"]["update"]["data"];

/**
 * Hook to fetch paginated logs with filters
 */
export function useLogs(filters?: LogFilters) {
  return api.logs.getAll.useQuery(filters ?? { page: 1, pageSize: 20 }, {
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch aggregation data
 */
export function useLogAggregation(filters?: LogAggregationFilters) {
  return api.logs.getAggregation.useQuery(filters ?? {}, {
    enabled: Boolean(filters?.startDate && filters?.endDate),
  });
}

/**
 * Hook to fetch chart data for analytics
 */
export function useChartData(filters?: ChartFilters) {
  return api.logs.getChartData.useQuery(filters ?? { groupBy: "day" }, {
    enabled: Boolean(filters?.startDate && filters?.endDate),
  });
}

/**
 * Hook to fetch metadata (sources, severity levels, etc.)
 */
export function useMetadata() {
  return api.logs.getMetadata.useQuery(undefined, {
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes since metadata is relatively static
  });
}

/**
 * Hook to fetch a single log by ID
 */
export function useLog(id: string) {
  return api.logs.getById.useQuery(
    { id },
    {
      enabled: Boolean(id),
    },
  );
}

/**
 * Hook to delete a log entry
 */
export function useDeleteLog() {
  const utils = api.useUtils();

  return api.logs.delete.useMutation({
    onSuccess: () => {
      // Invalidate all logs queries
      utils.logs.getAll.invalidate();
      utils.logs.getAggregation.invalidate();
      utils.logs.getChartData.invalidate();
      utils.logs.getMetadata.invalidate();

      toast.success("Log deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete log");
    },
  });
}

/**
 * Hook to create a new log entry
 */
export function useCreateLog() {
  const utils = api.useUtils();

  return api.logs.create.useMutation({
    onSuccess: () => {
      // Invalidate logs queries to refetch
      utils.logs.getAll.invalidate();
      utils.logs.getAggregation.invalidate();
      utils.logs.getChartData.invalidate();
      utils.logs.getMetadata.invalidate();
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create log");
    },
  });
}

/**
 * Hook to update an existing log entry
 */
export function useUpdateLog() {
  const utils = api.useUtils();

  return api.logs.update.useMutation({
    onSuccess: (_, variables) => {
      // Invalidate specific log and list queries
      utils.logs.getById.invalidate({ id: variables.id });
      utils.logs.getAll.invalidate();
      utils.logs.getAggregation.invalidate();
      utils.logs.getChartData.invalidate();

      toast.success("Log updated successfully");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update log");
    },
  });
}

/**
 * Formatted Chart Data Hook
 * Formats timestamps for display in charts
 */
export function useFormattedChartData(
  filters?: ChartFilters,
  timeGrouping?: GroupBy,
) {
  return api.logs.getChartData.useQuery(
    filters ?? { groupBy: timeGrouping ?? "day" },
    {
      enabled: Boolean(filters?.startDate && filters?.endDate),
      select: (data) => {
        if (!data?.data || !timeGrouping) return [];

        return data.data.map((item) => ({
          ...item,
          date: format(
            new Date(item.timestamp),
            timeGrouping === "hour" ? "MMM dd HH:mm" : "MMM dd",
          ),
        }));
      },
    },
  );
}

/**
 * Export logs hook (placeholder - implement CSV export via tRPC if needed)
 */
export type ExportLogsHook = {
  exportLogs: (filters: LogFilters, filename?: string) => Promise<void>;
  mutate: (args: { filters: LogFilters; filename?: string }) => void;
  mutateAsync: (args: {
    filters: LogFilters;
    filename?: string;
  }) => Promise<void>;
  isPending: boolean;
};

export function useExportLogs(): ExportLogsHook {
  const [isPending, setIsPending] = useState(false);

  const runExport = async (
    filters: LogFilters,
    filename?: string,
  ): Promise<void> => {
    try {
      setIsPending(true);
      const params = new URLSearchParams();

      if (filters.page) params.set("page", String(filters.page));
      if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
      if (filters.search) params.set("search", filters.search);
      if (filters.severity) params.set("severity", filters.severity);
      if (filters.source) params.set("source", filters.source);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters.startDate)
        params.set("startDate", filters.startDate.toISOString());
      if (filters.endDate) params.set("endDate", filters.endDate.toISOString());

      const response = await fetch(`/api/logs/export?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to export logs");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const now = new Date().toISOString().split("T")[0];
      link.download = `${filename ?? `logs-export-${now}`}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Export started");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to export logs";
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return {
    exportLogs: (filters: LogFilters, filename?: string) =>
      runExport(filters, filename),
    mutate: (args: { filters: LogFilters; filename?: string }) =>
      void runExport(args.filters, args.filename),
    mutateAsync: (args: { filters: LogFilters; filename?: string }) =>
      runExport(args.filters, args.filename),
    isPending,
  };
}

// Export types for use in components
export type {
  LogFilters,
  ChartFilters,
  LogAggregationFilters,
  LogCreate,
  LogUpdate,
};
