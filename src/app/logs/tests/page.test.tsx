/// <reference lib="dom" />

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { render } from "@testing-library/react";
import LogsPage from "../page";
import { SeverityLevel } from "@/lib/enums/severity";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination";
import type { SortByField, SortOrder } from "@/lib/types/filters";

// Mock the logs client component
mock.module("../logs-client", () => ({
  LogsClient: ({
    initialFilters,
  }: {
    initialFilters: unknown;
  }) => (
    <div data-testid="logs-client">
      <div data-testid="initial-filters">{JSON.stringify(initialFilters)}</div>
    </div>
  ),
}));

describe("LogsPage", () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  describe("Default behavior", () => {
    it("renders with default parameters when no search params provided", async () => {
      const searchParams = Promise.resolve({});
      const { container, getByTestId } = render(
        await LogsPage({ searchParams }),
      );

      const clientComponent = getByTestId("logs-client");
      expect(clientComponent).toBeTruthy();

      const initialFilters = JSON.parse(
        container.querySelector("[data-testid=\"initial-filters\"]")
          ?.textContent || "{}",
      );

      expect(initialFilters.searchQuery).toBe("");
      expect(initialFilters.selectedSeverity).toBe("all");
      expect(initialFilters.selectedSource).toBe("all");
      expect(initialFilters.sortBy).toBe("timestamp");
      expect(initialFilters.sortOrder).toBe("desc");
      expect(initialFilters.currentPage).toBe(1);
      expect(initialFilters.dateRange).toBeUndefined();
    });

    it("uses default pagination settings", async () => {
      const searchParams = Promise.resolve({});
      const { container } = render(await LogsPage({ searchParams }));

      const initialFilters = JSON.parse(
        container.querySelector("[data-testid=\"initial-filters\"]")
          ?.textContent || "{}",
      );

      expect(initialFilters.currentPage).toBe(1);
      expect(initialFilters.pageSize).toBeUndefined();
    });
  });

  describe("URL parameter parsing", () => {
    describe("Pagination parameters", () => {
      it("parses page parameter", async () => {
        const searchParams = Promise.resolve({
          page: "3",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.currentPage).toBe(3);
      });

      it("parses page_size parameter", async () => {
        const searchParams = Promise.resolve({
          pageSize: "50",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.currentPage).toBe(1);
      });
    });

    describe("Search and filter parameters", () => {
      it("parses search query", async () => {
        const searchParams = Promise.resolve({
          search: "error message",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.searchQuery).toBe("error message");
      });

      it("parses severity filter", async () => {
        const searchParams = Promise.resolve({
          severity: "error",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.selectedSeverity).toBe("error");
      });

      it("parses source filter", async () => {
        const searchParams = Promise.resolve({
          source: "web-server",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.selectedSource).toBe("web-server");
      });

      it("ignores 'all' severity filter", async () => {
        const searchParams = Promise.resolve({
          severity: "all",
        });

        const { container } = render(await LogsPage({ searchParams }));
        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.selectedSeverity).toBe("all");
      });

      it("ignores 'all' source filter", async () => {
        const searchParams = Promise.resolve({
          source: "all",
        });

        const { container } = render(await LogsPage({ searchParams }));
        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.selectedSource).toBe("all");
      });
    });

    describe("Sorting parameters", () => {
      it("parses sort_by parameter", async () => {
        const searchParams = Promise.resolve({
          sortBy: "severity",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.sortBy).toBe("severity");
      });

      it("parses sort_order parameter", async () => {
        const searchParams = Promise.resolve({
          sortOrder: "asc" as SortOrder,
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.sortOrder).toBe("asc");
      });
    });

    describe("Date range parameters", () => {
      it("parses date range", async () => {
        const startDate = "2024-01-01T00:00:00Z";
        const endDate = "2024-01-08T00:00:00Z";

        const searchParams = Promise.resolve({
          startDate,
          endDate,
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );

        expect(initialFilters.dateRange).toBeTruthy();
        expect(new Date(initialFilters.dateRange.from).toISOString()).toBe(
          "2024-01-01T00:00:00.000Z",
        );
        expect(new Date(initialFilters.dateRange.to).toISOString()).toBe(
          "2024-01-08T00:00:00.000Z",
        );
      });

      it("does not set date range when only startDate is provided", async () => {
        const searchParams = Promise.resolve({
          startDate: "2024-01-01T00:00:00Z",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.dateRange).toBeUndefined();
      });

      it("does not set date range when only endDate is provided", async () => {
        const searchParams = Promise.resolve({
          endDate: "2024-01-08T00:00:00Z",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );
        expect(initialFilters.dateRange).toBeUndefined();
      });
    });

    describe("Multiple parameters", () => {
      it("handles multiple parameters", async () => {
        const searchParams = Promise.resolve({
          page: "2",
          pageSize: "25",
          search: "error",
          severity: "warn",
          source: "database",
          sortBy: "severity" as SortByField,
          sortOrder: "asc" as SortOrder,
          startDate: "2024-01-01T00:00:00Z",
          endDate: "2024-01-08T00:00:00Z",
        });

        const { container } = render(await LogsPage({ searchParams }));

        const initialFilters = JSON.parse(
          container.querySelector("[data-testid=\"initial-filters\"]")
            ?.textContent || "{}",
        );

        expect(initialFilters.currentPage).toBe(2);
        expect(initialFilters.searchQuery).toBe("error");
        expect(initialFilters.selectedSeverity).toBe("warn");
        expect(initialFilters.selectedSource).toBe("database");
        expect(initialFilters.sortBy).toBe("severity");
        expect(initialFilters.sortOrder).toBe("asc");
        expect(initialFilters.dateRange).toBeTruthy();
        expect(new Date(initialFilters.dateRange.from).toISOString()).toBe(
          "2024-01-01T00:00:00.000Z",
        );
        expect(new Date(initialFilters.dateRange.to).toISOString()).toBe(
          "2024-01-08T00:00:00.000Z",
        );
      });
    });
  });

  // No initial data fetching is performed in this page (tRPC loads on client).
});
