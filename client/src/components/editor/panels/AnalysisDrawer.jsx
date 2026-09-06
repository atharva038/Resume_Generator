import { BarChart3, X, Lightbulb } from "lucide-react";
import { ScoreCard } from "@/components/common/cards";
import JobSpecificScoreCard from "@/components/common/cards/JobSpecificScoreCard";
import RecommendationsPanel from "./RecommendationsPanel";

export default function AnalysisDrawer({
  isOpen,
  onClose,
  resumeData,
  updateField,
  handleApplyAiSuggestion,
  aiSuggestions,
  setAiSuggestions,
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      {/* Slide-in panel from right */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-zinc-950 z-50 shadow-2xl flex flex-col overflow-hidden border-l border-gray-200 dark:border-zinc-800">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Resume Analysis & Scoring
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gray-50 dark:bg-zinc-900/50">
          {/* ATS Score + Job Match side by side */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
              <ScoreCard resumeData={resumeData} expanded={false} />
            </div>
            <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
              <JobSpecificScoreCard
                resumeData={resumeData}
                onUpdateField={updateField}
              />
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-xs">
            <div className="p-4 sm:p-5">
              <details>
                <summary className="list-none cursor-pointer">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Improvement Recommendations
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      View
                    </span>
                  </div>
                </summary>
                <div className="mt-3">
                  <RecommendationsPanel
                    resumeData={resumeData}
                    onApplySuggestion={handleApplyAiSuggestion}
                    aiSuggestions={aiSuggestions}
                    onSuggestionsChange={setAiSuggestions}
                    compact={true}
                  />
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
