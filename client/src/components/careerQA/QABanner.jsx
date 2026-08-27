import { Sparkles, Star, Flame, Briefcase, Plus } from "lucide-react";

export default function QABanner({
  totalSaved,
  onOpenJobModal,
  onOpenProjectModal,
  onOpenCustomModal,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 shadow-sm dark:shadow-2xl">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Grounded Studio</span>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5 shadow-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{totalSaved} Saved Answers</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Personalized Career Q&A Bank
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            Tailored interview responses automatically crafted from your verified projects, skills, and background. Zero hallucination.
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenJobModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-semibold transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Prepare for a Job</span>
          </button>

          <button
            onClick={onOpenProjectModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-xs font-semibold transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span>Project Architecture Q&A</span>
          </button>

          <button
            onClick={onOpenCustomModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-500" />
            <span>Add Question</span>
          </button>
        </div>
      </div>
    </div>
  );
}
