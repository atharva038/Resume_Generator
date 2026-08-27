import { Link } from "react-router-dom";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { DarkModeToggle } from "@/components/common";

export default function ProfileHeader({ onGoBack, onSave, saving }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/[0.08] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
          title="Back to site"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="h-4 sm:h-5 w-[1px] bg-gray-200 dark:bg-white/10 hidden xs:block" />

        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
          <img
            src="/orb-logo.png"
            alt="SmartNShine"
            className="h-7 sm:h-8 w-auto object-contain group-hover:scale-105 transition-all duration-300 dark:brightness-100 dark:saturate-100 brightness-50 contrast-125 saturate-200 shrink-0"
          />
          <span className="font-bold text-sm sm:text-base tracking-tight bg-gradient-to-r from-[#5d8ff0] via-[#6f7fe4] to-[#8b67df] dark:from-[#6aa0ff] dark:via-[#7f8ce7] dark:to-[#9b78ea] bg-clip-text text-transparent hidden md:inline">
            SmartNShine
          </span>
          <span className="text-gray-300 dark:text-zinc-700 text-xs hidden md:inline">/</span>
          <span className="text-[11px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-2 sm:px-2.5 py-0.5 rounded-lg whitespace-nowrap">
            Career Profile
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <DarkModeToggle />

        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all duration-200 disabled:opacity-50 active:scale-95 cursor-pointer"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{saving ? "Saving..." : "Save Profile"}</span>
          <span className="sm:hidden">{saving ? "..." : "Save"}</span>
        </button>
      </div>
    </header>
  );
}
