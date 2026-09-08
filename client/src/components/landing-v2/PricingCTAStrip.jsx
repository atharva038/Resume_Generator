import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

const freeFeatures = [
  "3 ATS resume templates",
  "AI STAR bullet generator",
  "ATS keyword score",
  "1 live portfolio",
  "PDF export",
];

const proFeatures = [
  "All 12+ premium templates",
  "Unlimited tailored resumes",
  "Priority AI processing",
  "Custom portfolio domain",
  "Instant ATS keyword gap scans",
  "Career Q&A studio",
];

export default function PricingCTAStrip() {
  const { isDarkMode } = useDarkMode();

  return (
    <section className={"relative py-24 px-6 sm:px-10 lg:px-16 overflow-hidden transition-colors duration-300 " + (isDarkMode ? "bg-[#09090f] text-zinc-100" : "bg-white text-slate-900")}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full blur-[100px] bg-blue-500/5" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] rounded-full blur-[100px] bg-emerald-500/5" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <div className={"inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold tracking-wider uppercase " + (isDarkMode ? "bg-zinc-800/80 border-zinc-700/80 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-600")}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Simple Pricing
          </div>
          <h2 className={"text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight " + (isDarkMode ? "text-white" : "text-slate-900")}>
            Start free. Upgrade when you're ready.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <div className={"rounded-3xl border p-8 flex flex-col gap-6 " + (isDarkMode ? "bg-[#0f0f1a] border-zinc-800" : "bg-zinc-50 border-zinc-200")}>
            <div>
              <div className={"text-xs font-mono font-semibold uppercase tracking-wider mb-1 " + (isDarkMode ? "text-zinc-400" : "text-zinc-500")}>Free</div>
              <div className={"text-4xl font-bold tracking-tight " + (isDarkMode ? "text-white" : "text-slate-900")}>$0<span className={"text-base font-normal ml-1 " + (isDarkMode ? "text-zinc-400" : "text-slate-500")}>/month</span></div>
              <p className={"text-sm mt-1 " + (isDarkMode ? "text-zinc-400" : "text-slate-500")}>Everything you need to get started.</p>
            </div>
            <ul className="space-y-2.5 flex-1">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className={"w-4 h-4 shrink-0 " + (isDarkMode ? "text-zinc-500" : "text-zinc-400")} />
                  <span className={isDarkMode ? "text-zinc-300" : "text-slate-600"}>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/templates" className={"inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl border text-sm font-semibold transition-all active:scale-95 " + (isDarkMode ? "border-zinc-700 text-white hover:bg-zinc-800" : "border-zinc-200 text-slate-900 hover:bg-zinc-100")}>
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-3xl border border-blue-500/30 bg-blue-600 p-8 flex flex-col gap-6 shadow-2xl shadow-blue-600/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] bg-white/10 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-200">Pro</div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                  <Zap className="w-2.5 h-2.5" /> Most Popular
                </span>
              </div>
              <div className="text-4xl font-bold tracking-tight text-white">$12<span className="text-base font-normal ml-1 text-blue-200">/month</span></div>
              <p className="text-sm mt-1 text-blue-200">The full career intelligence stack.</p>
            </div>
            <ul className="space-y-2.5 flex-1 relative z-10">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-200" />
                  <span className="text-white">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="relative z-10 inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white text-blue-600 text-sm font-bold transition-all active:scale-95 hover:bg-blue-50 shadow-lg">
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
