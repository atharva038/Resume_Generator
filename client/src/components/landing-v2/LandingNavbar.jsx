import React from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useAuth } from "../../context/AuthContext";
import Logo from "@/components/common/Logo";

export default function LandingNavbar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();

  return (
    <div className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none font-scoutie">
      <header
        className={`pointer-events-auto relative w-full max-w-4xl lg:max-w-5xl rounded-full transition-all duration-300 backdrop-blur-2xl backdrop-saturate-150 ${
          isDarkMode
            ? "bg-black/90 border border-amber-500/20 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(245,158,11,0.2)]"
            : "bg-gradient-to-r from-white/95 via-white/85 to-white/95 border border-black/[0.08] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.85)]"
        }`}
      >
        <div className="px-3 sm:px-5 h-13 sm:h-14 flex items-center justify-between">
          {/* Brand Logo & Title (Clean, no 2.0 badges or extra pills) */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <Logo
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain group-hover:scale-105 transition-transform duration-200"
              alt="SmartNShine Logo"
            />
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-950 dark:text-white leading-none">
              SmartNShine
            </span>
          </Link>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {[
              { label: "Templates", to: "/templates" },
              { label: "ATS Scanner", to: "/ats-analyzer" },
              { label: "Pricing", to: "/pricing" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-all duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Pills (Auth + Theme Toggle) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle Button with Crisp Delicate Outline */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-90 shadow-2xs ${
                isDarkMode
                  ? "bg-white/[0.05] border-white/10 text-amber-400 hover:bg-white/10"
                  : "bg-black/[0.03] border-black/[0.06] text-zinc-700 hover:bg-black/[0.06]"
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>

            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full border border-black/[0.1] dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/12 text-zinc-900 dark:text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all"
                >
                  Sign In
                </Link>

                <Link
                  to="/upload"
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full border border-black/[0.1] dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/12 text-zinc-900 dark:text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
