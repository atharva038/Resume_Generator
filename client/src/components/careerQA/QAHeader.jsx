import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DarkModeToggle } from "@/components/common";

export default function QAHeader({ onGoBack }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shadow-xs active:scale-95"
          title="Go back to site"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Back to site</span>
        </button>

        <div className="h-5 w-[1px] bg-gray-200 dark:bg-white/10" />

        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/orb-logo.png"
            alt="SmartNShine"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-all duration-300 -mr-1 dark:brightness-100 dark:saturate-100 brightness-50 contrast-125 saturate-200"
          />
          <span className="font-bold text-base tracking-tight bg-gradient-to-r from-[#5d8ff0] via-[#6f7fe4] to-[#8b67df] dark:from-[#6aa0ff] dark:via-[#7f8ce7] dark:to-[#9b78ea] bg-clip-text text-transparent hidden sm:inline">
            SmartNShine
          </span>
          <span className="text-gray-300 dark:text-zinc-700 text-xs hidden sm:inline">/</span>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/60 px-2.5 py-1 rounded-lg">
            Career Q&A Bank
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <DarkModeToggle />
      </div>
    </header>
  );
}
