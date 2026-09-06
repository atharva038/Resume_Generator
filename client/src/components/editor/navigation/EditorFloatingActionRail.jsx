import { Eye, EyeOff, Save, Download, ArrowUp, Loader2, Check } from "lucide-react";

export default function EditorFloatingActionRail({
  showPreview,
  togglePreview,
  guardedHandleSave,
  saving,
  autoSaving,
  hasUnsavedChanges,
  handleDownloadPDF,
  isSubscriptionExpired,
  showScrollTop,
}) {
  return (
    <div className="hidden lg:block fixed right-5 top-1/2 -translate-y-1/2 z-50 no-print">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-lg p-1.5 flex flex-col gap-0.5">
        {/* Preview Toggle */}
        <button
          onClick={togglePreview}
          className={`group relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
            showPreview
              ? "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
          }`}
          title={showPreview ? "Hide preview" : "Show preview"}
        >
          {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {showPreview ? "Hide preview" : "Show preview"}
          </span>
        </button>

        <div className="h-px bg-gray-200 dark:bg-zinc-700 mx-1.5 my-0.5" />

        {/* Save */}
        <button
          onClick={guardedHandleSave}
          disabled={saving || autoSaving}
          className={`group relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
            saving || autoSaving
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : hasUnsavedChanges
                ? "text-orange-500 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
          }`}
        >
          {hasUnsavedChanges && !saving && !autoSaving && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          )}
          {saving || autoSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : hasUnsavedChanges ? (
            <Save className="w-4 h-4" />
          ) : (
            <Check className="w-4 h-4 text-emerald-500" />
          )}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {saving || autoSaving
              ? "Saving…"
              : hasUnsavedChanges
                ? "Save changes"
                : "All changes saved"}
          </span>
        </button>

        {/* Export PDF */}
        <button
          onClick={handleDownloadPDF}
          disabled={isSubscriptionExpired}
          className={`group relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
            isSubscriptionExpired
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:text-green-400"
          }`}
        >
          <Download className="w-4 h-4" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {isSubscriptionExpired ? "Subscription required" : "Export as PDF"}
          </span>
        </button>

        {/* Scroll to Top */}
        {showScrollTop && (
          <>
            <div className="h-px bg-gray-200 dark:bg-zinc-700 mx-1.5 my-0.5" />
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Back to top
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
