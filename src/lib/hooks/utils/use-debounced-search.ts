import { useCallback, useEffect, useState } from "react";
import { useDebouncedValue } from "./use-debounced-value";

interface UseDebouncedSearchOptions {
  delay?: number;
}

export function useDebouncedSearch(
  initialValue: string,
  onDebouncedChange: (value: string) => void,
  { delay = 300 }: UseDebouncedSearchOptions = {},
) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebouncedValue(searchValue, { delay });

  // Keep local state in sync when the external value changes (e.g., reset filters)
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  // Create a setter for user input
  const handleSetSearchValue = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // Notify when the debounced value changes
  useEffect(() => {
    onDebouncedChange(debouncedSearchValue);
  }, [debouncedSearchValue, onDebouncedChange]);

  return {
    searchValue,
    setSearchValue: handleSetSearchValue,
  };
}
