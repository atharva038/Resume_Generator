import {useState, useEffect} from "react";

/**
 * Custom hook for debouncing a value
 * @param {*} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 500ms)
 * @returns {*} - The debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if value or delay changes before timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
