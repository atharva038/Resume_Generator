import {useState, useCallback} from "react";

/**
 * Custom hook for managing boolean state with toggle functionality
 *
 * @param {boolean} initialValue - The initial boolean value (default: false)
 * @returns {[boolean, function, function, function]} Tuple containing:
 *   - value: Current boolean state
 *   - toggle: Function to toggle the state
 *   - setTrue: Function to set state to true
 *   - setFalse: Function to set state to false
 *
 * @example
 * // Basic usage for modal visibility
 * const [isOpen, toggleOpen, openModal, closeModal] = useToggle(false);
 *
 * @example
 * // Usage in component
 * function Sidebar() {
 *   const [isExpanded, toggleExpanded, expand, collapse] = useToggle(true);
 *   return (
 *     <div>
 *       <button onClick={toggleExpanded}>Toggle Sidebar</button>
 *       {isExpanded && <div>Sidebar Content</div>}
 *     </div>
 *   );
 * }
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
