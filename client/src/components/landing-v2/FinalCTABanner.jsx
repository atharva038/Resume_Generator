import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2, Rocket, Globe } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

export default function FinalCTABanner() {
  const { isDarkMode } = useDarkMode();

  return (
    <section
      id="cta"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-black text-zinc-100" : "bg-[#f8f8f6] text-slate-900"
      }`}
    >
      {/* Ambient background radiant glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[150px] transition-colors duration-500 ${
            isDarkMode ? "bg-amber-500/15" : "bg-amber-400/20"
          }`}
        />
        <div
          className={`absolute bottom-6 right-10 w-96 h-96 rounded-full blur-[140px] transition-colors duration-500 ${
            isDarkMode ? "bg-yellow-600/10" : "bg-amber-300/20"
          }`}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Luxury Obsidian Gold Hero Showcase Card */}
        <div
          className={`relative overflow-hidden rounded-3xl sm:rounded-[36px] p-8 sm:p-14 lg:p-16 backdrop-blur-2xl border transition-all duration-300 text-center space-y-8 sm:space-y-10 ${
            isDarkMode
              ? "bg-gradient-to-b from-zinc-950/95 via-[#09090c]/95 to-black/95 border-amber-500/25 shadow-[0_20px_80px_-15px_rgba(245,158,11,0.18)] ring-1 ring-amber-500/10"
              : "bg-gradient-to-b from-white/95 via-amber-50/30 to-white/95 border-amber-200/80 shadow-2xl shadow-amber-900/10 ring-1 ring-amber-900/5"
          }`}
        >
          {/* Subtle Ambient Card Glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-yellow-500/10 blur-3xl" />

          {/* Brand Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>SmartNShine · AI Resume Builder</span>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2
              className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              The AI Career Platform. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                Built to win offers.
              </span>
            </h2>

            <p
              className={`text-sm sm:text-base md:text-lg font-normal leading-relaxed ${
                isDarkMode ? "text-zinc-400" : "text-slate-600"
              }`}
            >
              Build ATS-proof resumes, deploy live developer portfolios, and land top tech offers. Powered by{" "}
              <span
                className={
                  isDarkMode
                    ? "text-amber-400 font-semibold"
                    : "text-amber-600 font-semibold"
                }
              >
                AI
              </span>
              . Built for you.
            </p>
          </div>

          {/* 3 Iconic Circular Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-3xl mx-auto pt-2">
            {/* 1. AI-Powered */}
            <div
              className={`p-4 rounded-2xl border text-center transition-all ${
                isDarkMode
                  ? "bg-white/[0.03] border-white/[0.08] hover:border-amber-500/30"
                  : "bg-amber-50/50 border-amber-200/60 hover:border-amber-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-400 border border-amber-500/25 mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <h3
                className={`text-sm font-bold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                AI-Powered
              </h3>
              <p
                className={`text-xs leading-relaxed mt-1 ${
                  isDarkMode ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Smart suggestions that make an impact.
              </p>
            </div>

            {/* 2. ATS Optimized */}
            <div
              className={`p-4 rounded-2xl border text-center transition-all ${
                isDarkMode
                  ? "bg-white/[0.03] border-white/[0.08] hover:border-amber-500/30"
                  : "bg-amber-50/50 border-amber-200/60 hover:border-amber-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-400 border border-amber-500/25 mx-auto mb-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
              </div>
              <h3
                className={`text-sm font-bold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                ATS Optimized
              </h3>
              <p
                className={`text-xs leading-relaxed mt-1 ${
                  isDarkMode ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Resumes that pass filters with ease.
              </p>
            </div>

            {/* 3. Career Driven */}
            <div
              className={`p-4 rounded-2xl border text-center transition-all ${
                isDarkMode
                  ? "bg-white/[0.03] border-white/[0.08] hover:border-amber-500/30"
                  : "bg-amber-50/50 border-amber-200/60 hover:border-amber-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-400 border border-amber-500/25 mx-auto mb-3">
                <Rocket className="w-5 h-5 text-amber-400" />
              </div>
              <h3
                className={`text-sm font-bold ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Career Driven
              </h3>
              <p
                className={`text-xs leading-relaxed mt-1 ${
                  isDarkMode ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Designed to open more opportunities.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              to="/templates"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black text-sm font-extrabold shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 transition-all active:scale-95 cursor-pointer"
            >
              <span>Build Your Resume Free</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
            </Link>

            <Link
              to="/pricing"
              className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                isDarkMode
                  ? "border-amber-500/30 text-amber-200 hover:bg-amber-500/10 hover:text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>View Pricing Plans</span>
            </Link>
          </div>

          {/* Brand Footer Line with smartnshine.app */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08] dark:border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300/80">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="tracking-wider">smartnshine.app</span>
            </div>
            <span
              className={`text-xs ${
                isDarkMode ? "text-zinc-500" : "text-slate-400"
              }`}
            >
              Free forever · No credit card required · Instant download
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
