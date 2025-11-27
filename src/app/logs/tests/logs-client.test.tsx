/// <reference lib="dom" />

import { describe, expect, it, mock } from "bun:test";
import { render } from "@testing-library/react";
import { SeverityLevel } from "@/lib/enums/severity";
import type { LogListResponse } from "@/lib/types/log";

const mockLogList: LogListResponse = {
  logs: [
    {
      id: "1",
      timestamp: new Date("2024-01-01T00:00:00Z"),
      severity: SeverityLevel.INFO,
      source: "api",
      message: "hello",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

describe("LogsClient", () => {
  it("renders table and pagination with initial data", async () => {
    mock.restore(); // ensure no previous mocks bleed in
    mock.module("@/lib/hooks/query/use-logs", () => ({
      useLogs: () => ({ data: mockLogList, isLoading: false, error: null }),
      useDeleteLog: () => ({ mutate: () => {}, isPending: false }),
      useExportLogs: () => ({ exportLogs: () => {}, isPending: false }),
    }));

    const { LogsClient } = await import("../logs-client");
    const { container } = render(
      <LogsClient
        initialData={mockLogList}
        initialFilters={{ searchQuery: "test" }}
      />,
    );

    expect(container.firstChild).toBeTruthy();
  });
});
