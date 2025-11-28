export const SeverityLevel = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",
  CRITICAL: "CRITICAL",
} as const;

export type SeverityLevel = (typeof SeverityLevel)[keyof typeof SeverityLevel];
