import { describe, expect, it } from "bun:test";
import { buildAggregationParams, extractDataFromSettledResponse } from "@/lib/utils/api-helpers";

describe("api-helpers", () => {
  it("extracts data from fulfilled responses without errors", () => {
    const response: PromiseSettledResult<{
      data?: string;
      error?: string;
      status: number;
    }> = {
      status: "fulfilled",
      value: { data: "ok", status: 200 },
    };

    expect(extractDataFromSettledResponse(response)).toBe("ok");
  });

  it("returns undefined on rejected or errored responses", () => {
    const rejected: PromiseSettledResult<{
      data?: string;
      error?: string;
      status: number;
    }> = {
      status: "rejected",
      reason: new Error("fail"),
    };
    const errored: PromiseSettledResult<{
      data?: string;
      error?: string;
      status: number;
    }> = {
      status: "fulfilled",
      value: { status: 400, error: "bad" },
    };

    expect(extractDataFromSettledResponse(rejected)).toBeUndefined();
    expect(extractDataFromSettledResponse(errored)).toBeUndefined();
  });

  it("builds aggregation params filtering out 'all'", () => {
    const params = buildAggregationParams({
      start_date: "2024-01-01",
      end_date: "2024-01-02",
      severity: "all",
      source: "all",
    });

    expect(params).toEqual({
      start_date: "2024-01-01",
      end_date: "2024-01-02",
    });

    const paramsWithFilters = buildAggregationParams({
      start_date: "2024-01-01",
      end_date: "2024-01-02",
      severity: "ERROR",
      source: "api",
    });

    expect(paramsWithFilters).toEqual({
      start_date: "2024-01-01",
      end_date: "2024-01-02",
      severity: "ERROR",
      source: "api",
    });
  });
});
