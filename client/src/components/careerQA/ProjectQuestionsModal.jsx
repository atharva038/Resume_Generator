import { Briefcase, X, Check, RefreshCw, Sparkles } from "lucide-react";
import { useBodyScrollLock } from "@/hooks";

export default function ProjectQuestionsModal({
  isOpen,
  onClose,
  userProfile,
  selectedProjectId,
  setSelectedProjectId,
  generatingProjectQ,
  onGenerateProjectQuestions,
  projectQuestionsResult,
  onAddProjectQuestionToBank,
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Project Deep-Dive Questions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Generate architectural and tech-choice questions for your projects.
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
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2 block">
              Select Project
            </label>

            {/* Interactive Project Cards List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800">
              {(userProfile?.projects || []).map((p) => {
                const isSelected = selectedProjectId === p._id;
                return (
                  <div
                    key={p._id}
                    onClick={() => setSelectedProjectId(p._id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-xs ring-1 ring-indigo-500"
                        : "bg-gray-50 dark:bg-zinc-900/60 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {p.name}
                      </div>
                      {p.technologies && p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.technologies.slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-200/80 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                            >
                              {tech}
                            </span>
                          ))}
                          {p.technologies.length > 4 && (
                            <span className="text-[10px] font-medium text-gray-400">
                              +{p.technologies.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-gray-300 dark:border-zinc-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
              {(!userProfile?.projects || userProfile.projects.length === 0) && (
                <div className="text-center py-6 text-xs text-gray-400">
                  No projects found in your Career Profile. Add projects to your profile first.
                </div>
              )}
            </div>
          </div>

          {projectQuestionsResult && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Questions for: {projectQuestionsResult.projectName}
              </div>
              <div className="space-y-2.5">
                {(projectQuestionsResult.questions || []).map((qObj, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 dark:bg-zinc-900/60 rounded-2xl border border-gray-200/80 dark:border-white/[0.08] space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-bold text-gray-900 dark:text-white leading-snug">
                        "{qObj.question}"
                      </span>
                      <button
                        onClick={() => onAddProjectQuestionToBank(qObj)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold shrink-0 cursor-pointer"
                      >
                        + Add to Bank
                      </button>
                    </div>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md font-semibold inline-block">
                      Focus: {qObj.focusArea}
                    </span>
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
            onClick={onGenerateProjectQuestions}
            disabled={generatingProjectQ || !selectedProjectId}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
          >
            {generatingProjectQ ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{generatingProjectQ ? "Generating..." : "Generate Questions"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
