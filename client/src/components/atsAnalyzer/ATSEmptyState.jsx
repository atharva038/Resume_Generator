import { Target, Zap, Brain, Award, Sparkles, CheckCircle2 } from "lucide-react";

export function ATSEmptyState() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900/90 rounded-3xl p-8 sm:p-12 text-center border border-gray-200/90 dark:border-white/[0.08] shadow-sm">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 space-y-6 max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-md">
          <Target className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Ready to Analyze
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
            Provide a target job description on the left and select your resume to run our AI-powered ATS diagnostic engine.
          </p>
        </div>

        <div className="space-y-3 pt-2 text-left bg-gray-50/60 dark:bg-zinc-950/60 p-4 rounded-2xl border border-gray-200/60 dark:border-white/5">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Instant keyword match percentage</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
            <Brain className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Semantic skills & qualifications scoring</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
            <Award className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Actionable ATS pass/fail recommendation list</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ATSLoadingState() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900/90 rounded-3xl p-10 sm:p-14 text-center border border-gray-200/90 dark:border-white/[0.08] shadow-sm">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl animate-pulse" />

      <div className="relative z-10 space-y-5 max-w-sm mx-auto">
        <div className="w-16 h-16 mx-auto border-3 border-blue-500/30 border-t-blue-600 rounded-full animate-spin flex items-center justify-center shadow-lg" />

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Scanning Resume Against ATS...
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Comparing keywords, experience density, and skill alignment with AI.
          </p>
        </div>
      </div>
    </div>
  );
}
