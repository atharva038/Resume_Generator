import {createContext, useContext, useEffect, useState} from "react";
import {themeStorage} from "@/utils/storage";

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

/**
 * Determine the initial dark-mode state from localStorage ONLY.
 * We never follow the OS preference — the mode only changes when the
 * user explicitly clicks the toggle.
 *
 * Storage values:
 *   "true"  / true  → user has chosen dark
 *   "false" / false → user has chosen light  (stored after first explicit toggle)
 *   null / missing  → first visit → default to dark, save it
 */
const getInitialDarkMode = () => {
  try {
    const raw = localStorage.getItem("darkMode");
    if (raw === null) {
      // First visit — default to dark and persist so we never read OS again
      localStorage.setItem("darkMode", "true");
      return true;
    }
    // Treat any saved truthy string as dark, otherwise light
    return raw === "true" || raw === true;
  } catch {
    return true; // safe default if localStorage is unavailable
  }
};

export const DarkModeProvider = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Persist the explicit user choice (never use matchMedia again)
    try {
      localStorage.setItem("darkMode", String(isDarkMode));
    } catch {}
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{isDarkMode, toggleDarkMode}}>
      {children}
    </DarkModeContext.Provider>
  );
};
