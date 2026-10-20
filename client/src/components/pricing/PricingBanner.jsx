import { Sparkles, ShieldCheck, Zap, Award } from "lucide-react";

export default function PricingBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-5 sm:p-6 lg:py-6 lg:px-8 shadow-sm dark:shadow-2xl mb-6">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Transparent & Risk-Free Plans</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Accelerate Your Job Search
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
          Select the optimal plan for your career goals. Unlock AI resume rewriting, full ATS diagnostics, 11 executive templates, and recruiter-ready exports.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>7-Day Money-Back Guarantee</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Instant Plan Activation</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
            <Award className="w-3 h-3 text-blue-500" />
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
