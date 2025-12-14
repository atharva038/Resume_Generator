import {useState, useCallback} from "react";

/**
 * Custom hook for managing boolean state with toggle functionality
 * @param {boolean} initialValue - The initial boolean value (default: false)
 * @returns {[boolean, function, function, function]} - [value, toggle, setTrue, setFalse]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
};
