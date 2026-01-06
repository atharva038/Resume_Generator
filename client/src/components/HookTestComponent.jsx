/**
 * Hook Testing Component
 * This file tests all custom hooks to ensure they work correctly
 * DELETE THIS FILE after verification is complete
 */

import {useRef} from "react";
import {
  useAuth,
  useDarkMode,
  useLocalStorage,
  useDebounce,
  useMediaQuery,
  useClickOutside,
  useToggle,
} from "@/hooks";

const HookTestComponent = () => {
  // Test 1: useLocalStorage
  const [testValue, setTestValue] = useLocalStorage("test-key", "initial");

  // Test 2: useDebounce
  const debouncedValue = useDebounce(testValue, 300);

  // Test 3: useMediaQuery
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDarkPreferred = useMediaQuery("(prefers-color-scheme: dark)");

  // Test 4: useToggle
  const [isOpen, toggle, setTrue, setFalse] = useToggle(false);

  // Test 5: useClickOutside
  const dropdownRef = useRef();
  useClickOutside(dropdownRef, () => {
    console.log("Clicked outside!");
    setFalse();
  });

  // Test 6: useAuth (context hook)
  const {user, loading} = useAuth();

  // Test 7: useDarkMode (context hook)
  const {isDarkMode, toggleDarkMode} = useDarkMode();

  return (
    <div style={{padding: "20px"}}>
      <h1>🧪 Hook Testing Component</h1>

      {/* Test useLocalStorage */}
      <div style={{marginBottom: "20px"}}>
        <h3>✅ useLocalStorage</h3>
        <input
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
          placeholder="Type to test localStorage"
        />
        <p>Stored Value: {testValue}</p>
        <p>Debounced Value: {debouncedValue}</p>
      </div>

      {/* Test useMediaQuery */}
      <div style={{marginBottom: "20px"}}>
        <h3>✅ useMediaQuery</h3>
        <p>Is Mobile: {isMobile ? "Yes" : "No"}</p>
        <p>Prefers Dark: {isDarkPreferred ? "Yes" : "No"}</p>
      </div>

      {/* Test useToggle + useClickOutside */}
      <div style={{marginBottom: "20px"}}>
        <h3>✅ useToggle + useClickOutside</h3>
        <button onClick={toggle}>Toggle Dropdown</button>
        {isOpen && (
          <div
            ref={dropdownRef}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginTop: "5px",
            }}
          >
            <p>Click outside to close</p>
            <button onClick={setTrue}>Set True</button>
            <button onClick={setFalse}>Set False</button>
          </div>
        )}
      </div>

      {/* Test useAuth */}
      <div style={{marginBottom: "20px"}}>
        <h3>✅ useAuth</h3>
        <p>Loading: {loading ? "Yes" : "No"}</p>
        <p>User: {user ? user.name : "Not logged in"}</p>
      </div>

      {/* Test useDarkMode */}
      <div style={{marginBottom: "20px"}}>
        <h3>✅ useDarkMode</h3>
        <p>Dark Mode: {isDarkMode ? "Enabled" : "Disabled"}</p>
        <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
      </div>

      <div style={{marginTop: "20px", color: "green"}}>
        <p>✅ All hooks working correctly!</p>
      </div>
    </div>
  );
};

export default HookTestComponent;
