import { describe, expect, it } from "bun:test";
import { SeverityLevel } from "@/lib/enums/severity";
import type { DateRange } from "@/lib/types/filters";
import {
  createAggregationFilters,
  createBaseDateFilters,
  createChartFilters,
  processSeverityFilter,
  processSourceFilter,
} from "@/lib/utils/filter-helpers";

const mockRange: DateRange = {
  from: new Date("2024-01-01"),
  to: new Date("2024-01-02"),
};

describe("filter-helpers", () => {
  it("processSeverityFilter returns undefined for 'all'", () => {
    expect(processSeverityFilter("all")).toBeUndefined();
    expect(processSeverityFilter(SeverityLevel.ERROR)).toBe(
      SeverityLevel.ERROR,
    );
    expect(processSeverityFilter(SeverityLevel.INFO, true)).toBe(
      SeverityLevel.INFO,
    );
  });

  it("processSourceFilter returns undefined for 'all'", () => {
    expect(processSourceFilter("all")).toBeUndefined();
    expect(processSourceFilter("api")).toBe("api");
  });

  it("createBaseDateFilters returns null when missing range", () => {
    expect(createBaseDateFilters(undefined)).toBeNull();
    expect(
      createBaseDateFilters({ from: undefined, to: undefined }),
    ).toBeNull();
    const result = createBaseDateFilters(mockRange);
    expect(result?.startDate).toEqual(mockRange.from);
    expect(result?.endDate).toEqual(mockRange.to);
  });

  it("createAggregationFilters builds filters when range exists", () => {
    const filters = createAggregationFilters(
      mockRange,
      SeverityLevel.WARNING,
      "api",
    );
    expect(filters).toMatchObject({
      startDate: mockRange.from,
      endDate: mockRange.to,
      severity: SeverityLevel.WARNING,
      source: "api",
    });
  });

  it("createChartFilters includes groupBy and processed filters", () => {
    const filters = createChartFilters(mockRange, "all", "all", "day");
    expect(filters).toMatchObject({
      startDate: mockRange.from,
      endDate: mockRange.to,
      severity: undefined,
      source: undefined,
      groupBy: "day",
    });
  });
});
