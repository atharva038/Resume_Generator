import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  LayoutTemplate,
  ChevronDown,
  ChevronUp,
  Save,
  Download,
  Eye,
  EyeOff,
  PenSquare,
  RefreshCw,
} from "lucide-react";
import { DarkModeToggle } from "@/components/common";

export default function EditorHeader({
  onGoBack,
  hasUnsavedChanges,
  saving,
  autoSaving,
  isWizardMode,
  onSwitchToFullEditor,
  onImportCareerProfile,
  onResetOrder,
  onShowTemplateSelector,
  colorDropdownRef,
  showColorThemeSelector,
  onToggleColorThemeSelector,
  availableColorThemes = [],
  activeColorTheme,
  onSelectColorTheme,
  onSave,
  onExport,
  isExportLocked,
  showPreview,
  onTogglePreview,
}) {
  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/[0.08] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 transition-all no-print">
      {/* Left branding & back */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
          title="Back to resumes"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Resumes</span>
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
            Resume Studio
          </span>
        </Link>

        {/* Unsaved / Auto-saving badge (Desktop only) */}
        {hasUnsavedChanges && !saving && !autoSaving && (
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            ● Unsaved Changes
          </span>
        )}
        {(saving || autoSaving) && (
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Saving...</span>
          </span>
        )}
      </div>

      {/* Right controls toolbar */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1.5 sm:gap-2 shrink-0">
        <DarkModeToggle />

        {/* Wizard Switch Button */}
        {isWizardMode && (
          <button
            onClick={onSwitchToFullEditor}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-blue-500/30 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer"
            title="Switch to full editor mode"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Full Editor</span>
          </button>
        )}

        {/* Reset Order Button (Desktop only) */}
        {!isWizardMode && (
          <button
            onClick={onResetOrder}
            className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 text-xs font-semibold hover:border-orange-500 hover:text-orange-600 transition-all cursor-pointer"
            title="Reset section order to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Order</span>
          </button>
        )}

        {/* Template Selector Button */}
        <button
          onClick={onShowTemplateSelector}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
          title="Change template design"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden md:inline">Templates</span>
        </button>

        {/* Color Theme Selector Dropdown (Hidden on mobile) */}
        {availableColorThemes.length > 0 && (
          <div ref={colorDropdownRef} className="relative flex-none hidden md:block">
            <button
              onClick={onToggleColorThemeSelector}
              className="h-8 sm:h-9 px-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-xs font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Change color theme"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-zinc-600 shrink-0"
                style={{ backgroundColor: activeColorTheme?.primary || "#374151" }}
              />
              {showColorThemeSelector ? (
                <ChevronUp className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              )}
            </button>

            {showColorThemeSelector && (
              <div className="absolute top-full right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-xl z-50 overflow-hidden p-1.5">
                <div className="max-h-60 overflow-auto space-y-1">
                  {availableColorThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onSelectColorTheme(theme)}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                        activeColorTheme?.id === theme.id
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                          : "hover:bg-gray-50 dark:hover:bg-zinc-800/80 text-gray-800 dark:text-zinc-200"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300 dark:border-zinc-600 shrink-0"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="flex-1 min-w-0 text-xs font-bold truncate">
                        {theme.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Preview Toggle (Desktop only — mobile has MobileActionBar) */}
        <button
          onClick={onTogglePreview}
          className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs ${
            showPreview
              ? "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300"
              : "border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300"
          }`}
          title={showPreview ? "Hide Live Preview" : "Show Live Preview"}
        >
          {showPreview ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showPreview ? "Preview On" : "Preview Off"}</span>
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={saving || autoSaving}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-900 bg-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:focus:ring-offset-zinc-950 sm:text-sm"
        >
          {saving || autoSaving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
        </button>

        {/* Export PDF Button (Desktop only — mobile has MobileActionBar) */}
        <button
          onClick={onExport}
          disabled={isExportLocked}
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-emerald-700 bg-emerald-700 px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:focus:ring-offset-zinc-950 sm:text-sm"
          title="Download PDF resume"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
    </header>
  );
}
