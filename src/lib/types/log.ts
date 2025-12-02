import type { SeverityLevel } from "@/lib/enums/severity";

export interface BaseLogProperties {
  timestamp: Date | string;
  severity: SeverityLevel;
  source: string;
  message: string;
}

export interface LogEntry extends BaseLogProperties {
  id: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export type LogResponse = LogEntry;

export interface LogListResponse {
  logs: LogResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LogCreate extends Omit<BaseLogProperties, "timestamp"> {
  timestamp?: Date;
}

export type LogUpdate = Partial<BaseLogProperties>;

export interface LogCountByDate {
  date: string;
  count: number;
}

export interface LogCountBySeverity {
  severity: SeverityLevel;
  count: number;
}

export interface LogCountBySource {
  source: string;
  count: number;
}

export interface LogAggregationResponse {
  totalLogs: number;
  dateRangeStart: Date | null;
  dateRangeEnd: Date | null;
  bySeverity: LogCountBySeverity[];
  bySource: LogCountBySource[];
  byDate: LogCountByDate[];
}
