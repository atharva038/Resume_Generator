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

const getInitialDarkMode = () => {
  const savedMode = themeStorage.getDarkMode();
  if (savedMode !== null && savedMode !== false) {
    return savedMode;
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

<<<<<<< HEAD
    try {
      localStorage.setItem("darkMode", String(isDarkMode));
    } catch (error) {
      console.error("Error saving darkMode to localStorage:", error);
    }
=======
    themeStorage.setDarkMode(isDarkMode);
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
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
