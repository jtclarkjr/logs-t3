import type {
  FilterAllOption,
  SeverityFilter,
  SortByField,
  SortOrder,
  SourceFilter,
} from "@/lib/types/filters";
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

  return <LogsClient initialFilters={initialFilters} />;
}
