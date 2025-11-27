import type { DateRange } from "react-day-picker";

export function createMockDateRange(): DateRange {
  const from = new Date("2024-01-01T00:00:00Z");
  const to = new Date("2024-01-07T00:00:00Z");
  return { from, to };
}
