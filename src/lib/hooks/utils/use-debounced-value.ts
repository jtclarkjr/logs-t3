import { useEffect, useState } from "react";

interface UseDebouncedValueOptions {
  delay?: number;
}

export function useDebouncedValue<T>(
  value: T,
  { delay = 300 }: UseDebouncedValueOptions = {},
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // For falsy values (clears, toggles), update immediately to match UX expectations
    if (!value) {
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
