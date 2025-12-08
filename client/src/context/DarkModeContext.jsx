import {createContext, useContext, useEffect, useState} from "react";

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

const getInitialDarkMode = () => {
  try {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return savedMode === "true";
    }
  } catch (error) {
    console.error("Error reading darkMode from localStorage:", error);
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
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

    try {
      localStorage.setItem("darkMode", String(isDarkMode));
    } catch (error) {
      console.error("Error saving darkMode to localStorage:", error);
    }
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
