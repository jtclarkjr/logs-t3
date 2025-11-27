import { describe, expect, it } from "bun:test";
import { ApiError } from "@/lib/clients/errors";

describe("ApiError", () => {
  it("returns base message when no validation details", () => {
    const error = new ApiError("Something went wrong", 500);
    expect(error.getDetailedMessage()).toBe("Something went wrong");
    expect(error.isServerError()).toBe(true);
    expect(error.isValidationError()).toBe(false);
    expect(error.isNotFoundError()).toBe(false);
  });

  it("formats array validation details", () => {
    const error = new ApiError("Invalid payload", 422, [
      { field: "email", message: "Required" },
      { field: "password", message: "Too short", reason: "Min 8 chars" },
    ]);

    expect(error.isValidationError()).toBe(true);
    expect(error.getDetailedMessage()).toBe(
      "Invalid payload. Validation errors: email: Required; password: Min 8 chars",
    );
  });

  it("formats nested validation_errors structure", () => {
    const error = new ApiError("Validation failed", 422, {
      error: {
        details: {
          validation_errors: [{ field: "name", message: "Invalid format" }],
        },
      },
    });

    expect(error.isValidationError()).toBe(true);
    expect(error.getDetailedMessage()).toContain("name: Invalid format");
  });

  it("includes extra metadata in toJSON", () => {
    const error = new ApiError("Not found", 404, undefined, {
      code: 1004,
      requestId: "req-123",
    });

    expect(error.isNotFoundError()).toBe(true);
    expect(error.toJSON()).toMatchObject({
      message: "Not found",
      status: 404,
      code: 1004,
      requestId: "req-123",
    });
  });
});
