import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { DarkModeToggle } from "@/components/common";

export default function PortfolioHeader({
  onGoBack,
  actionButton = null,
  badgeText = "Portfolios",
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3 sm:gap-4">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Back</span>
          </button>
        )}

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
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg">
            {badgeText}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <DarkModeToggle />
        {actionButton}
      </div>
    </header>
  );
}
