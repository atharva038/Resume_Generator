import {useState, useEffect} from "react";
import {Moon, Sun} from "lucide-react";
import adaptPortfolioData from "./themes/adaptPortfolioData";
import {getPortfolioTheme} from "./themes/themeRegistry";

const PortfolioThemeRenderer = ({
  portfolio,
  resume,
  projects,
  mode = "public",
  onContactClick,
  onProjectClick,
  onResumeClick,
  resumeDownloadUrl,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial preference or localStorage
    const savedTheme = localStorage.getItem("portfolio-theme");
    const systemPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((current) => {
      const next = !current;

      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("portfolio-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("portfolio-theme", "light");
      }

      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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
    resumeDownloadUrl,
  });

  // Inject themeAccent as an inline CSS variable override so the live
  // accent customizer works without re-rendering the full theme.
  const accentStyle = portfolio?.themeAccent
    ? {
        "--pt-accent": portfolio.themeAccent,
        "--pt-accent-dim": `${portfolio.themeAccent}30`,
      }
    : undefined;

  return (
    <>
      <div
        data-portfolio-theme={portfolio?.themeId || "minimalDeveloper"}
        data-color-mode={isDarkMode ? "dark" : "light"}
        style={accentStyle}
        className={`relative min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50 ${
          isDarkMode ? "dark portfolio-dark" : "portfolio-light"
        }`}
      >
        <style>{`
          [data-portfolio-theme].portfolio-dark main,
          [data-portfolio-theme].portfolio-dark section,
          [data-portfolio-theme].portfolio-dark article,
          [data-portfolio-theme].portfolio-dark aside {
            background-color: #09090b !important;
            border-color: #27272a !important;
            color: #f4f4f5 !important;
          }

          [data-portfolio-theme].portfolio-dark h1,
          [data-portfolio-theme].portfolio-dark h2,
          [data-portfolio-theme].portfolio-dark h3,
          [data-portfolio-theme].portfolio-dark p,
          [data-portfolio-theme].portfolio-dark li,
          [data-portfolio-theme].portfolio-dark span {
            color: inherit;
          }

          [data-portfolio-theme].portfolio-dark a,
          [data-portfolio-theme].portfolio-dark button {
            border-color: #3f3f46 !important;
          }
        `}</style>
        <ThemeComponent data={data} />

        {mode === "public" &&
          portfolio?.settings?.showSmartNShineBranding !== false && (
            <footer className="border-t border-gray-200 bg-white px-5 py-4 text-center text-sm text-gray-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              Built with{" "}
              <a
                href="https://www.smartnshine.app"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-gray-950 underline-offset-4 hover:underline dark:text-white"
              >
                SmartNShine
              </a>
            </footer>
          )}

        {/* Floating Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full shadow-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-transform hover:scale-110 active:scale-95 border border-white/10 dark:border-black/10"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default PortfolioThemeRenderer;
