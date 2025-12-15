import {useState, useEffect} from "react";

/**
 * Custom hook for debouncing a value
 * Delays updating the value until after the specified delay has passed since the last change
 *
 * @param {*} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 500ms)
 * @returns {*} The debounced value
 *
 * @example
 * // Debounce search input to reduce API calls
 * function SearchBar() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // Only makes API call 500ms after user stops typing
 *       fetchSearchResults(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
 * }
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
