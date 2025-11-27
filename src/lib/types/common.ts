export interface HealthResponse {
  status: string;
  message: string;
  version: string;
}

export interface MetadataResponse {
  severityLevels: string[];
  sources: string[];
  dateRange: {
    earliest: string | null;
    latest: string | null;
  };
  severityStats: Record<string, number>;
  totalLogs: number;
  sortFields: string[];
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}
