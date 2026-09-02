import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

export default function LandingNavbar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none font-scoutie">
      <header className="pointer-events-auto w-full max-w-5xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#0f141e]/85 backdrop-blur-xl shadow-lg shadow-zinc-900/5 dark:shadow-black/40 transition-all duration-300">
        <div className="px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Brand Logo with official orb-logo.png */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/orb-logo.png"
              alt="SmartNShine Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
                Smart<span className="text-blue-600 dark:text-blue-400">N</span>Shine
              </span>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase mt-0.5">
                Career Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link
              to="/templates"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link
              to="/ats-analyzer"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              ATS Scanner
            </Link>
            <Link
              to="/ai-interview"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              AI Interview
            </Link>
            <Link
              to="/pricing"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Right CTA / Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            <Link
              to="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xs active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

