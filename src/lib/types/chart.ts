export interface ChartDataPoint {
  timestamp: string;
  total: number;
  DEBUG: number;
  INFO: number;
  WARNING: number;
  ERROR: number;
  CRITICAL: number;
}

export interface ChartDataResponse {
  data: ChartDataPoint[];
  groupBy: string;
  startDate: Date | null;
  endDate: Date | null;
  filters: {
    severity: string | null;
    source: string | null;
  };
}
