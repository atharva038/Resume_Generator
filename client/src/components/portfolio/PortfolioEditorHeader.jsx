import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Save,
  Globe2,
  Send,
  RefreshCw,
} from "lucide-react";
import { DarkModeToggle } from "@/components/common";

export default function PortfolioEditorHeader({
  onGoBack,
  hasUnsavedChanges,
  saving,
  onSave,
  onPreview,
  onPublishToggle,
  isPublished,
  publicUrl,
  slug,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/[0.08] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-all">
      {/* Left branding & back */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
          title="Back to portfolios"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Portfolios</span>
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
          <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 sm:px-2.5 py-0.5 rounded-lg whitespace-nowrap">
            Portfolio Editor
          </span>
        </Link>

        {hasUnsavedChanges && (
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            ● Unsaved
          </span>
        )}
      </div>

      {/* Right action controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <DarkModeToggle />

        <button
          type="button"
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
        </button>

        <button
          type="button"
          onClick={onPublishToggle}
          className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
            isPublished
              ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/20"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20"
          }`}
        >
          {isPublished ? (
            <>
              <Globe2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unpublish</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publish</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
