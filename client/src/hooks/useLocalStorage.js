import {useState, useEffect} from "react";

/**
 * Custom hook for syncing state with localStorage
 * Automatically persists state to localStorage and retrieves it on mount
 *
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if key doesn't exist in localStorage
 * @returns {[*, function]} Tuple containing the current value and a setter function
 *
 * @example
 * // Persist user preferences
 * function Settings() {
 *   const [theme, setTheme] = useLocalStorage('app-theme', 'light');
 *   const [fontSize, setFontSize] = useLocalStorage('font-size', 14);
 *
 *   return (
 *     <div>
 *       <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *         Toggle Theme (Current: {theme})
 *       </button>
 *       <input
 *         type="number"
 *         value={fontSize}
 *         onChange={(e) => setFontSize(parseInt(e.target.value))}
 *       />
 *     </div>
 *   );
 * }
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
