import { Sparkles, ShieldCheck, Zap, Award } from "lucide-react";

export default function PricingBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-zinc-900/90 dark:to-zinc-950/90 p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-2xl mb-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold mx-auto">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Transparent & Risk-Free Plans</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          Accelerate Your Job Search
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 leading-relaxed">
          Select the optimal plan for your career goals. Unlock AI resume rewriting, full ATS diagnostics, 11 executive templates, and recruiter-ready exports.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>7-Day Money-Back Guarantee</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Plan Activation</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
            <Award className="w-3.5 h-3.5 text-blue-500" />
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
