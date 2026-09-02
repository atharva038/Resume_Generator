import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

export default function FinalCTABanner() {
  const { isDarkMode } = useDarkMode();

  return (
    <section
      id="cta"
      className={`relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-[#07080c] text-zinc-100" : "bg-[#f8f8f6] text-slate-900"
        }`}
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] rounded-full blur-[140px] bg-indigo-500/10 dark:bg-indigo-500/15" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[120px] bg-blue-500/5 dark:bg-blue-500/10" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Linear-Style Frosted Glass Hero Card */}
        <div
          className={`relative overflow-hidden rounded-3xl sm:rounded-[36px] p-8 sm:p-14 lg:p-16 backdrop-blur-2xl border transition-all duration-300 text-center space-y-8 ${isDarkMode
              ? "bg-gradient-to-b from-zinc-900/90 via-[#0e1017]/90 to-zinc-950/90 border-white/10 shadow-2xl shadow-indigo-950/40 ring-1 ring-white/5"
              : "bg-gradient-to-b from-white/95 via-slate-50/90 to-white/95 border-slate-200/80 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-900/5"
            }`}
        >
          {/* Internal ambient card glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500/15 dark:bg-blue-500/20 blur-3xl" />

          {/* Subtle Grid texture */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] dark:opacity-[0.1]" />

          {/* Pill Tag */}
          

          {/* Headline & Subtitle */}
          <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] ${isDarkMode ? "text-white" : "text-slate-900"
                }`}
            >
              Your next offer is one<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500">
                resume away.
              </span>
            </h2>

            <p
              className={`text-xs sm:text-sm md:text-base font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"
                }`}
            >
              Join 12,000+ candidates who built ATS-optimized resumes and landed interviews at top tech companies.
            </p>
          </div>

          {/* Key Spec Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 relative z-10">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold border backdrop-blur-md ${isDarkMode
                  ? "bg-white/[0.04] border-white/10 text-zinc-300"
                  : "bg-slate-100/80 border-slate-200 text-slate-700"
                }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              <span>ATS Parser Verified</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold border backdrop-blur-md ${isDarkMode
                  ? "bg-white/[0.04] border-white/10 text-zinc-300"
                  : "bg-slate-100/80 border-slate-200 text-slate-700"
                }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              <span>Instant Vector PDF</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold border backdrop-blur-md ${isDarkMode
                  ? "bg-white/[0.04] border-white/10 text-zinc-300"
                  : "bg-slate-100/80 border-slate-200 text-slate-700"
                }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              <span>1 Live Web Portfolio</span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all active:scale-95"
            >
              <span>Build Your Resume Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all active:scale-95 ${isDarkMode
                  ? "border-white/10 text-zinc-300 hover:bg-white/5"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100/70"
                }`}
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>

          {/* Trust line */}
          <div className="relative z-10 pt-1">
            <p
              className={`text-xs font-normal ${isDarkMode ? "text-zinc-500" : "text-slate-400"
                }`}
            >
              Free forever · No credit card required · Instant download
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
