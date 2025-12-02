import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination";
import type {
  FilterAllOption,
  SeverityFilter,
  SortByField,
  SortOrder,
  SourceFilter,
} from "@/lib/types/filters";
import type { LogListResponse } from "@/lib/types/log";
import { api } from "@/trpc/server";
import { LogsClient } from "./logs-client";

interface LogsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    severity?: string;
    source?: string;
    sortBy?: string;
    sortOrder?: SortOrder;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function LogsPage({ searchParams }: LogsPageProps) {
  const params = await searchParams;

  const initialFilters = {
    searchQuery: params.search || "",
    selectedSeverity:
      (params.severity as SeverityFilter) || ("all" as FilterAllOption),
    selectedSource:
      (params.source as SourceFilter) || ("all" as FilterAllOption),
    sortBy: (params.sortBy as SortByField) || ("timestamp" as SortByField),
    sortOrder: params.sortOrder || ("desc" as SortOrder),
    currentPage: params.page ? parseInt(params.page, 10) : 1,
    dateRange:
      params.startDate && params.endDate
        ? {
            from: new Date(params.startDate),
            to: new Date(params.endDate),
          }
        : undefined,
  };

  let initialData: LogListResponse | undefined;

  try {
    const severityFilter =
      initialFilters.selectedSeverity &&
      initialFilters.selectedSeverity !== ("all" as FilterAllOption)
        ? initialFilters.selectedSeverity
        : undefined;

    const sourceFilter =
      initialFilters.selectedSource &&
      initialFilters.selectedSource !== ("all" as FilterAllOption)
        ? initialFilters.selectedSource
        : undefined;

    const filters = {
      page: initialFilters.currentPage || 1,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: initialFilters.sortBy || ("timestamp" as SortByField),
      sortOrder: initialFilters.sortOrder || ("desc" as SortOrder),
      ...(initialFilters.searchQuery && { search: initialFilters.searchQuery }),
      ...(severityFilter && { severity: severityFilter }),
      ...(sourceFilter && { source: sourceFilter }),
      ...(initialFilters.dateRange?.from && {
        startDate: initialFilters.dateRange.from,
      }),
      ...(initialFilters.dateRange?.to && {
        endDate: initialFilters.dateRange.to,
      }),
    };

    initialData = await api.logs.getAll(filters);
  } catch (error) {
    console.error("Failed to prefetch logs", error);
  }

  return (
    <LogsClient initialData={initialData} initialFilters={initialFilters} />
  );
}
