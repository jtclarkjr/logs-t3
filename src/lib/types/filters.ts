import type { SeverityLevel } from "@/lib/enums/severity";

export type SortOrder = "asc" | "desc";
export type GroupBy = "hour" | "day" | "week" | "month";
export type FilterAllOption = "all";
export type SeverityFilter = SeverityLevel | FilterAllOption;
export type SourceFilter = string;
export type SortByField = "timestamp" | "severity" | "source";

export interface LogFilters {
  page?: number;
  pageSize?: number;
  severity?: SeverityLevel;
  source?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  sortBy?: SortByField;
  sortOrder?: SortOrder;
}

export interface ChartFilters {
  startDate?: Date;
  endDate?: Date;
  severity?: SeverityLevel;
  source?: string;
  groupBy?: GroupBy;
}

export interface ExportFilters {
  severity?: SeverityLevel;
  source?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface LogAggregationFilters {
  startDate?: Date;
  endDate?: Date;
  severity?: SeverityLevel;
  source?: string;
}

export interface DateFilters {
  startDate: Date;
  endDate: Date;
}
