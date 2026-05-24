import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import adaptPortfolioData from "./themes/adaptPortfolioData";
import { getPortfolioTheme } from "./themes/themeRegistry";

const PortfolioThemeRenderer = ({
  portfolio,
  resume,
  projects,
  mode = "public",
  onContactClick,
  onProjectClick,
  onResumeClick,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial preference or localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('portfolio-theme', 'light');
    }
  };

  const theme = getPortfolioTheme(portfolio?.themeId);
  const ThemeComponent = theme.component;
  const data = adaptPortfolioData({
    portfolio,
    resume,
    projects,
    mode,
    onContactClick,
    onProjectClick,
    onResumeClick,
  });

  // Inject themeAccent as an inline CSS variable override so the live
  // accent customizer works without re-rendering the full theme.
  const accentStyle = portfolio?.themeAccent
    ? { "--pt-accent": portfolio.themeAccent, "--pt-accent-dim": `${portfolio.themeAccent}30` }
    : undefined;

  return (
    <>
      <div
        data-portfolio-theme={portfolio?.themeId || "minimalDeveloper"}
        style={accentStyle}
        className="relative bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 min-h-screen transition-colors duration-300"
      >
        <ThemeComponent data={data} />
        
        {/* Floating Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full shadow-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-transform hover:scale-110 active:scale-95 border border-white/10 dark:border-black/10"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
};

export default PortfolioThemeRenderer;
