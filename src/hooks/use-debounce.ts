import { useState, useEffect } from "react";

/**
 * @param value The raw value you normally want to debounce
 * @param delay In ms
 * @param enabled If false, the returned value updates immediately (skips debounce)
 */
export function useDebounce<T>({
  value,
  delay = 250,
  enabled = true,
}: {
  value: T;
  delay?: number;
  enabled?: boolean;
}): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (!enabled) {
      setDebouncedValue(value);
      return;
    }

    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay, enabled]);

  return debouncedValue;
}
