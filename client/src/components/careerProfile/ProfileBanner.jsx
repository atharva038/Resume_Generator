import { Sparkles, Upload, FileText, TrendingUp } from "lucide-react";

export default function ProfileBanner({
  completeness,
  sections,
  onOpenAIModal,
  onOpenImportModal,
  onExportToResumeBuilder,
}) {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Single Source of Truth</span>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{completeness?.totalScore || 0}% Complete</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Master Career Profile
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Your unified professional repository. Enter your career information once and reuse everywhere across resumes, ATS analysis, and interview prep.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAIModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs font-semibold transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
              title="Paste raw notes and let AI structure it"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>✨ AI Fast Import</span>
            </button>

            <button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-blue-500" />
              <span>Import from Resume</span>
            </button>

            <button
              onClick={onExportToResumeBuilder}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Use in Resume Builder</span>
            </button>

            <a
              href="/career-qa"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 text-xs font-semibold transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
            >
              <span>💬 Application Q&A</span>
            </a>
          </div>
        </div>
      </div>

      {/* Completeness & Metrics Grid */}
      <div className="bg-white dark:bg-zinc-950/90 rounded-3xl p-6 border border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
            Profile Completeness
          </p>
          <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
            {completeness?.totalScore || 0}%
          </span>
        </div>

        <div className="w-full bg-gray-100 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${completeness?.totalScore || 0}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {sections
            .filter((s) => s.id !== "additional")
            .map((s) => {
              const score = completeness?.sections?.[s.id] || 0;
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-white/[0.06] text-xs"
                >
                  <span className="text-gray-600 dark:text-zinc-400 truncate font-medium">
                    {s.label}
                  </span>
                  <span
                    className={`font-bold ml-1.5 text-xs ${
                      score >= 80
                        ? "text-emerald-600 dark:text-emerald-400"
                        : score > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-400"
                    }`}
                  >
                    {score >= 80 ? "✓" : `${score}%`}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
