import { useDarkMode } from "@/context/DarkModeContext";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      type="button"
      className={`relative inline-flex items-center justify-center w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full
        bg-white/90 dark:bg-zinc-900/90
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        border border-zinc-200/90 dark:border-white/10
        shadow-xs hover:shadow-sm
        transition-all duration-300 ease-out
        active:scale-90 cursor-pointer group ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Subtle hover backlight glow */}
      <span
        className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isDarkMode
            ? "bg-amber-400/15 blur-xs"
            : "bg-indigo-500/10 blur-xs"
        }`}
      />

      {isDarkMode ? (
        <Sun className="relative w-4 h-4 text-amber-400 fill-amber-400/20 stroke-[1.8] group-hover:rotate-90 group-hover:scale-110 transition-all duration-500 ease-out" />
      ) : (
        <Moon className="relative w-4 h-4 text-zinc-700 dark:text-zinc-300 fill-zinc-700/15 dark:fill-zinc-300/15 stroke-[1.8] group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500 ease-out" />
      )}
    </button>
  );
};

export default DarkModeToggle;
