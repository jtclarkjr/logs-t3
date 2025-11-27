import { describe, expect, it } from "bun:test";
import { ApiError } from "@/lib/clients/errors";
import { SeverityLevel } from "@/lib/enums/severity";
import {
  useChartData,
  useCreateLog,
  useDeleteLog,
  useExportLogs,
  useFormattedChartData,
  useLog,
  useLogAggregation,
  useLogs,
  useMetadata,
  useUpdateLog,
} from "@/lib/hooks/query/use-logs";

describe("ApiError", () => {
  it("formats validation details when provided", () => {
    const apiError = new ApiError("Validation failed", 422, {
      error: {
        message: "Validation failed",
        details: {
          validation_errors: [
            { field: "email", message: "Invalid format" },
            { field: "password", reason: "Too short" },
          ],
        },
      },
    });

    expect(apiError.getDetailedMessage()).toContain(
      "Validation failed. Validation errors: email: Invalid format; password: Too short",
    );
  });

  it("returns base message when no details exist", () => {
    const apiError = new ApiError("Something went wrong", 500);
    expect(apiError.getDetailedMessage()).toBe("Something went wrong");
  });
});

describe("hook exports", () => {
  it("exposes all query/mutation hooks as functions", () => {
    const hooks = [
      useLogs,
      useLogAggregation,
      useChartData,
      useFormattedChartData,
      useMetadata,
      useLog,
      useDeleteLog,
      useExportLogs,
      useCreateLog,
      useUpdateLog,
    ];

    hooks.forEach((hook) => expect(typeof hook).toBe("function"));
  });
});
