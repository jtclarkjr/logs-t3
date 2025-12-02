import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination";
import type { SeverityLevel } from "@/lib/enums/severity";
import type {
  FilterAllOption,
  SeverityFilter,
  SortByField,
  SortOrder,
  SourceFilter,
  UserFilter,
} from "@/lib/types/filters";
import type { RouterInputs } from "@/trpc/react";

interface LogsFiltersState {
  searchQuery: string;
  selectedSeverity: SeverityFilter;
  selectedSource: SourceFilter;
  sortBy: SortByField;
  sortOrder: SortOrder;
  currentPage: number;
  pageSize: number;
  dateRange: DateRange | undefined;
  createdByFilter: UserFilter;
  updatedByFilter: UserFilter;
}

interface InitialLogsFilters {
  searchQuery?: string;
  selectedSeverity?: SeverityFilter;
  selectedSource?: SourceFilter;
  sortBy?: SortByField;
  sortOrder?: SortOrder;
  currentPage?: number;
  pageSize?: number;
  dateRange?: DateRange;
  createdByFilter?: UserFilter;
  updatedByFilter?: UserFilter;
}

export function useLogsFilters(
  initialFilters: InitialLogsFilters = {},
  currentUserId?: string,
) {
  // State management
  const [searchQuery, setSearchQuery] = useState(
    initialFilters.searchQuery || "",
  );
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityFilter>(
    initialFilters.selectedSeverity || ("all" as FilterAllOption),
  );
  const [selectedSource, setSelectedSource] = useState<SourceFilter>(
    initialFilters.selectedSource || ("all" as FilterAllOption),
  );
  const [sortBy, setSortBy] = useState<SortByField>(
    initialFilters.sortBy || ("timestamp" as SortByField),
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialFilters.sortOrder || "desc",
  );
  const [currentPage, setCurrentPage] = useState(
    initialFilters.currentPage || 1,
  );
  const [pageSize, setPageSize] = useState(
    initialFilters.pageSize || DEFAULT_PAGE_SIZE,
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialFilters.dateRange,
  );
  const [createdByFilter, setCreatedByFilter] = useState<UserFilter>(
    initialFilters.createdByFilter || ("all" as UserFilter),
  );
  const [updatedByFilter, setUpdatedByFilter] = useState<UserFilter>(
    initialFilters.updatedByFilter || ("all" as UserFilter),
  );

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSeverity("all" as FilterAllOption);
    setSelectedSource("all" as FilterAllOption);
    setSortBy("timestamp" as SortByField);
    setSortOrder("desc" as SortOrder);
    setCurrentPage(1);
    setDateRange(undefined);
    setCreatedByFilter("all");
    setUpdatedByFilter("all");
  };

  // Handle page changes with reset to page 1 when filters change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (filterSetter: () => void) => {
    filterSetter();
  };

  // Safe filter setters that reset pagination
  const setSearchQueryWithReset = (query: string) => {
    handleFilterChange(() => setSearchQuery(query));
  };

  const setSelectedSeverityWithReset = (severity: SeverityFilter) => {
    handleFilterChange(() => setSelectedSeverity(severity));
  };

  const setSelectedSourceWithReset = (source: SourceFilter) => {
    handleFilterChange(() => setSelectedSource(source));
  };

  const setDateRangeWithReset = (range: DateRange | undefined) => {
    handleFilterChange(() => setDateRange(range));
  };

  const setCreatedByFilterWithReset = (filter: UserFilter) => {
    handleFilterChange(() => setCreatedByFilter(filter));
  };

  const setUpdatedByFilterWithReset = (filter: UserFilter) => {
    handleFilterChange(() => setUpdatedByFilter(filter));
  };

  const setPageSizeWithReset = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleSortChange = (field: SortByField, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // Generate API filters object
  const getAPIFilters = (): RouterInputs["logs"]["getAll"] => ({
    page: currentPage,
    pageSize,
    sortBy,
    sortOrder,
    ...(searchQuery && { search: searchQuery }),
    ...(selectedSeverity !== ("all" as FilterAllOption) && {
      severity: selectedSeverity as SeverityLevel,
    }),
    ...(selectedSource !== ("all" as FilterAllOption) && {
      source: selectedSource,
    }),
    ...(dateRange?.from && { startDate: dateRange.from }),
    ...(dateRange?.to && { endDate: dateRange.to }),
    ...(createdByFilter === "me" &&
      currentUserId && {
        createdBy: currentUserId,
      }),
    ...(updatedByFilter === "me" &&
      currentUserId && {
        updatedBy: currentUserId,
      }),
  });

  // Return state and actions
  return {
    // State
    searchQuery,
    selectedSeverity,
    selectedSource,
    sortBy,
    sortOrder,
    currentPage,
    pageSize,
    dateRange,
    createdByFilter,
    updatedByFilter,

    // Basic actions (use these for direct UI updates)
    setSearchQuery: setSearchQueryWithReset,
    setSelectedSeverity: setSelectedSeverityWithReset,
    setSelectedSource: setSelectedSourceWithReset,
    setDateRange: setDateRangeWithReset,
    setSortBy,
    setSortOrder,
    setCurrentPage: handlePageChange,
    setPageSize: setPageSizeWithReset,
    setCreatedByFilter: setCreatedByFilterWithReset,
    setUpdatedByFilter: setUpdatedByFilterWithReset,

    // Compound actions
    handleSortChange,
    resetFilters,

    // Computed helpers
    getAPIFilters,

    // Derived state
    hasActiveFilters: Boolean(
      searchQuery ||
        selectedSeverity !== ("all" as FilterAllOption) ||
        selectedSource !== ("all" as FilterAllOption) ||
        dateRange?.from ||
        dateRange?.to ||
        createdByFilter === "me" ||
        updatedByFilter === "me",
    ),
  };
}

export type { LogsFiltersState, InitialLogsFilters };
