import { describe, expect, it } from "bun:test";
import { createMockDateRange } from "@/lib/hooks/test-utils";

describe("test-utils", () => {
  it("creates a deterministic date range", () => {
    const range = createMockDateRange();
    expect(range.from).toBeInstanceOf(Date);
    expect(range.to).toBeInstanceOf(Date);
    expect(range.from?.getTime()).toBeLessThan(range.to?.getTime() ?? 0);
  });
});
