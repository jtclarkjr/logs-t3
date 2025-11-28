/// <reference lib="dom" />

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import { subDays } from "date-fns";
import type { GroupBy } from "@/lib/types/filters";
import DashboardPage from "../page";

// Mock the dashboard client component to inspect props
const mockDashboardClient = mock(
  ({ initialFilters }: { initialFilters: unknown }) => (
    <div data-testid="dashboard-client">
      <div data-testid="initial-filters">{JSON.stringify(initialFilters)}</div>
    </div>
  ),
);

mock.module("../dashboard-client", () => ({
  DashboardClient: mockDashboardClient,
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    mockDashboardClient.mockClear();
  });

  afterEach(() => {
    mock.restore();
    cleanup();
  });

  describe("Default behavior", () => {
    it("renders with default parameters when no search params provided", async () => {
      const searchParams = Promise.resolve({});
      const { container } = render(await DashboardPage({ searchParams }));

      const clientComponent = container.querySelector(
        '[data-testid="dashboard-client"]',
      );
      expect(clientComponent).toBeTruthy();

      const initialFilters = JSON.parse(
        container.querySelector('[data-testid="initial-filters"]')
          ?.textContent || "{}",
      );

      expect(initialFilters.selectedSeverity).toBe("all");
      expect(initialFilters.selectedSource).toBe("all");
      expect(initialFilters.timeGrouping).toBe("day");
      expect(initialFilters.dateRange).toBeTruthy();
      expect(new Date(initialFilters.dateRange.from)).toBeInstanceOf(Date);
      expect(new Date(initialFilters.dateRange.to)).toBeInstanceOf(Date);
    });

    it("uses 7-day default date range", async () => {
      const searchParams = Promise.resolve({});
      const { container } = render(await DashboardPage({ searchParams }));

      const initialFilters = JSON.parse(
        container.querySelector('[data-testid="initial-filters"]')
          ?.textContent || "{}",
      );
      const fromDate = new Date(initialFilters.dateRange.from);
      const toDate = new Date(initialFilters.dateRange.to);

      const expectedFromDate = subDays(new Date(), 7);
      const daysDifference =
        Math.abs(fromDate.getTime() - expectedFromDate.getTime()) /
        (1000 * 60 * 60 * 24);

      expect(daysDifference).toBeLessThan(1);
      expect(toDate.getDate()).toBe(new Date().getDate());
    });
  });

  describe("URL parameter parsing", () => {
    it("parses date range from search params", async () => {
      const startDate = "2024-01-01T00:00:00Z";
      const endDate = "2024-01-08T00:00:00Z";

      const searchParams = Promise.resolve({
        startDate,
        endDate,
      });

      const { container } = render(await DashboardPage({ searchParams }));

      const initialFilters = JSON.parse(
        container.querySelector('[data-testid="initial-filters"]')
          ?.textContent || "{}",
      );

      expect(new Date(initialFilters.dateRange.from).toISOString()).toBe(
        "2024-01-01T00:00:00.000Z",
      );
      expect(new Date(initialFilters.dateRange.to).toISOString()).toBe(
        "2024-01-08T00:00:00.000Z",
      );
    });

    it("parses severity filter from search params", async () => {
      const searchParams = Promise.resolve({
        severity: "error",
      });

      const { container } = render(await DashboardPage({ searchParams }));

      const initialFilters = JSON.parse(
        container.querySelector('[data-testid="initial-filters"]')
          ?.textContent || "{}",
      );
      expect(initialFilters.selectedSeverity).toBe("error");
    });

    it("parses source filter from search params", async () => {
      const searchParams = Promise.resolve({
        source: "web-server",
      });

      const { container } = render(await DashboardPage({ searchParams }));

      const initialFilters = JSON.parse(
        container.querySelector('[data-testid="initial-filters"]')
          ?.textContent || "{}",
      );
      expect(initialFilters.selectedSource).toBe("web-server");
    });

    it("parses time grouping from search params", async () => {
      const searchParams = Promise.resolve({
        groupBy: "hour" as GroupBy,
      });

      const { container } = render(await DashboardPage({ searchParams }));

      const initialFilters = JSON.parse(
        container.querySelector('[data-testid="initial-filters"]')
          ?.textContent || "{}",
      );
      expect(initialFilters.timeGrouping).toBe("hour");
    });

    it("handles multiple parameters correctly", async () => {
      const searchParams = Promise.resolve({
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-01-08T00:00:00Z",
        severity: "error",
        source: "database",
        groupBy: "hour" as GroupBy,
      });

      const { container } = render(await DashboardPage({ searchParams }));

      const initialFilters = JSON.parse(
        container.querySelector('[data-testid="initial-filters"]')
          ?.textContent || "{}",
      );

      expect(initialFilters.selectedSeverity).toBe("error");
      expect(initialFilters.selectedSource).toBe("database");
      expect(initialFilters.timeGrouping).toBe("hour");
      expect(new Date(initialFilters.dateRange.from).toISOString()).toBe(
        "2024-01-01T00:00:00.000Z",
      );
      expect(new Date(initialFilters.dateRange.to).toISOString()).toBe(
        "2024-01-08T00:00:00.000Z",
      );
    });
  });

  describe("Component integration", () => {
    it("renders DashboardClient with correct props", async () => {
      const searchParams = Promise.resolve({
        severity: "warn",
        source: "database",
      });

      const { container } = render(await DashboardPage({ searchParams }));

      const clientComponent = container.querySelector(
        '[data-testid="dashboard-client"]',
      );
      expect(clientComponent).toBeTruthy();

      const initialFilters = JSON.parse(
        container.querySelector('[data-testid="initial-filters"]')
          ?.textContent || "{}",
      );

      expect(initialFilters.selectedSeverity).toBe("warn");
      expect(initialFilters.selectedSource).toBe("database");
    });
  });
});
