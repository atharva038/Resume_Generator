import { Flame, X, Plus, RefreshCw } from "lucide-react";
import { useBodyScrollLock } from "@/hooks";

export default function JobPrepModal({
  isOpen,
  onClose,
  jobDescriptionInput,
  setJobDescriptionInput,
  analyzingJob,
  onAnalyzeJob,
  jobAnalysisResult,
  onAddJobQuestionToBank,
}) {
  useBodyScrollLock(isOpen);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white dark:bg-zinc-950 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="shrink-0 px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/70 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Prepare Answers for a Target Job
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cross-reference JD with your profile to generate high-probability questions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 px-6 py-5 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800">
          <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block">
            Job Description / Requirements
          </label>
          <textarea
            rows={6}
            value={jobDescriptionInput}
            onChange={(e) => setJobDescriptionInput(e.target.value)}
            placeholder="Paste the job description or role requirements here..."
            className="w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-sans leading-relaxed"
          />

          {jobAnalysisResult && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Target Role: {jobAnalysisResult.targetRole || "Position"}
              </div>
              <div className="space-y-2.5">
                {(jobAnalysisResult.questions || []).map((qObj, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 dark:bg-zinc-900/60 rounded-2xl border border-gray-200/80 dark:border-white/[0.08] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                        "{qObj.question}"
                      </span>
                      <button
                        onClick={() => onAddJobQuestionToBank(qObj)}
                        className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add to Bank
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed">
                      <span className="font-semibold text-gray-700 dark:text-zinc-300">Why this matters:</span> {qObj.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onAnalyzeJob}
            disabled={analyzingJob || !jobDescriptionInput.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {analyzingJob ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5" />}
            <span>{analyzingJob ? "Analyzing..." : "Identify Interview Questions"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
