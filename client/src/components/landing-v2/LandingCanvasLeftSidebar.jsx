import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Layers, ShieldCheck, Globe, Bot, UploadCloud, Sun, Moon } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

export default function LandingCanvasLeftSidebar({ activeSection, scrollToSection }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const sections = [
    { id: "templates", label: "01. Resume Templates", icon: Layers },
    { id: "journey", label: "02. From No to Pro Journey", icon: Sparkles },
    { id: "analyzer", label: "03. Real-Time ATS Analyzer", icon: ShieldCheck },
    { id: "portfolio", label: "04. 1-Click Web Portfolio", icon: Globe },
    { id: "interview", label: "05. AI Voice Mock Studio", icon: Bot },
  ];

  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-20 font-scoutie">
      <div className="space-y-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/orb-logo.png"
              alt="SmartNShine Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
                Smart<span className="text-blue-600 dark:text-blue-400">N</span>Shine
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase mt-1">
                Career Intelligence OS
              </span>
            </div>
          </Link>

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>

        {/* Small, Punchy Copy (Evil Charts Style) */}
        <div className="space-y-4 max-w-md">
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            The end-to-end career suite for engineers and ambitious professionals. Build ATS-compliant resumes, deploy live developer portfolios, audit keyword gaps, and ace AI mock interviews.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-sm active:scale-95"
            >
              <span>Browse Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ats-analyzer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>ATS Score</span>
            </Link>
          </div>
        </div>

        {/* Interactive Quick-Jump Navigation Tabs */}
        <nav className="space-y-1.5 pt-4 hidden sm:block">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            Explore Engine Canvas
          </div>
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{sec.label}</span>
                </div>
                {isActive && <span className="text-[10px] font-mono">LIVE</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
        <span>© 2026 SmartNShine</span>
        <Link to="/login" className="font-semibold text-zinc-800 dark:text-zinc-200 hover:underline">
          Sign In →
        </Link>
      </div>
    </aside>
  );
}
