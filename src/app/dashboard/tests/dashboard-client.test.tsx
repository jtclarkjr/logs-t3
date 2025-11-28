/// <reference lib="dom" />

import { describe, expect, it, mock } from "bun:test";
import { render } from "@testing-library/react";
import { SeverityLevel } from "@/lib/enums/severity";
import type { ChartDataResponse } from "@/lib/types/chart";
import type { MetadataResponse } from "@/lib/types/common";
import type { LogAggregationResponse } from "@/lib/types/log";

const mockAggregation: LogAggregationResponse = {
  totalLogs: 10,
  dateRangeStart: new Date("2024-01-01"),
  dateRangeEnd: new Date("2024-01-08"),
  bySeverity: [
    { severity: SeverityLevel.ERROR, count: 5 },
    { severity: SeverityLevel.INFO, count: 5 },
  ],
  bySource: [{ source: "api", count: 10 }],
  byDate: [{ date: "2024-01-01", count: 10 }],
};

const mockChartData: ChartDataResponse = {
  data: [
    {
      timestamp: "2024-01-01T00:00:00Z",
      total: 10,
      DEBUG: 0,
      INFO: 5,
      WARNING: 0,
      ERROR: 5,
      CRITICAL: 0,
    },
  ],
  groupBy: "day",
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-02"),
  filters: { severity: null, source: null },
};

const mockMetadata: MetadataResponse = {
  severityLevels: ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
  sources: ["api"],
  dateRange: {
    earliest: "2024-01-01T00:00:00Z",
    latest: "2024-01-08T00:00:00Z",
  },
  severityStats: { ERROR: 5, INFO: 5 },
  totalLogs: 10,
  sortFields: ["timestamp", "severity"],
  pagination: { defaultPageSize: 20, maxPageSize: 100 },
};

describe("DashboardClient", () => {
  it("renders charts and metadata with provided initial data", async () => {
    mock.restore();
    mock.module("@/lib/hooks/query/use-logs", () => ({
      useLogAggregation: () => ({ data: mockAggregation, isLoading: false }),
      useFormattedChartData: () => ({
        data: mockChartData.data,
        isLoading: false,
      }),
      useMetadata: () => ({ data: mockMetadata, isLoading: false }),
      useExportLogs: () => ({ isPending: false, exportLogs: () => {} }),
    }));

    const { DashboardClient } = await import("../dashboard-client");
    const { container } = render(
      <DashboardClient
        initialData={{
          aggregationData: mockAggregation,
          timeSeriesData: mockChartData,
          metadata: mockMetadata,
        }}
      />,
    );

    expect(container.firstChild).toBeTruthy();
  });
});
