/// <reference lib="dom" />

import { cleanup } from "@testing-library/react";
import { afterEach } from "bun:test";

// Clean up DOM after each test run
afterEach(() => {
  cleanup();
});

// Simple toast mock for components that import sonner
export const mockToast = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
};

// Helper to create a React Query client without retries
export const createQueryClient = async () => {
  const { QueryClient } = await import("@tanstack/react-query");
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
};
