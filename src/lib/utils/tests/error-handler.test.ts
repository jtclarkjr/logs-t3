import { describe, expect, it, mock } from "bun:test";
import { ApiError } from "@/lib/clients/errors";
import {
  formatValidationErrors,
  getErrorDisplayInfo,
  getErrorMessage,
  getErrorCode,
  getRequestId,
  isRetryableError,
  logError,
  logWarning,
} from "@/lib/utils/error-handler";

describe("error-handler", () => {
  it("handles ApiError with validation details", () => {
    const apiError = new ApiError("Validation failed", 422, [
      { field: "email", message: "Invalid", reason: "Invalid format" },
    ]);

    const info = getErrorDisplayInfo(apiError);
    expect(info.title).toBe("Validation Error");
    expect(info.canRetry).toBe(false);
    expect(info.details?.[0]).toContain("email");
    expect(getErrorMessage(apiError)).toContain("Validation failed");
    expect(isRetryableError(apiError)).toBe(false);
  });

  it("handles generic Error and strings", () => {
    const error = new Error("Oops");
    expect(getErrorDisplayInfo(error).message).toBe("Oops");
    expect(getErrorMessage("string error")).toBe("string error");
    expect(isRetryableError(error)).toBe(true);
  });

  it("formats validation errors", () => {
    const formatted = formatValidationErrors([
      { field: "email", message: "Invalid", reason: "Bad" },
    ]);
    expect(formatted[0]).toBe("email: Bad");
  });

  it("returns metadata when present", () => {
    const apiError = new ApiError("Server down", 500, undefined, {
      code: 99,
      requestId: "req-1",
    });
    expect(getErrorCode(apiError)).toBe(99);
    expect(getRequestId(apiError)).toBe("req-1");
    expect(isRetryableError(apiError)).toBe(true);
  });

  it("logs errors and warnings without throwing", () => {
    const consoleError = mock(() => {});
    const consoleWarn = mock(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (console as any).error = consoleError;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (console as any).warn = consoleWarn;

    const apiError = new ApiError("Not found", 404);
    logError("message", apiError);
    logWarning("warn", apiError);

    expect(consoleError).toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalled();
  });
});
