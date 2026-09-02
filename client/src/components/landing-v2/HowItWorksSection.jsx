import React from "react";
import { Link } from "react-router-dom";
import { Upload, Cpu, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Paste your experience",
    description: "Drop in rough bullets, your LinkedIn bio, or GitHub project notes. Zero formatting required.",
    details: ["Raw text or PDF upload", "GitHub import available", "LinkedIn paste supported"],
    iconBg: "bg-purple-100 dark:bg-purple-950/60",
    iconColor: "text-purple-600 dark:text-purple-400",
    glow: "hover:shadow-purple-500/10",
    numberColor: "text-purple-100 dark:text-purple-950",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI builds your resume",
    description: "SmartNShine rewrites every bullet into quantified STAR format, injects ATS keywords, and scores your match.",
    details: ["STAR bullet generation", "ATS keyword injection", "Multi-template rendering"],
    iconBg: "bg-blue-100 dark:bg-blue-950/60",
    iconColor: "text-blue-600 dark:text-blue-400",
    glow: "hover:shadow-blue-500/10",
    numberColor: "text-blue-100 dark:text-blue-950",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Apply & win interviews",
    description: "Export a vector PDF, deploy your portfolio, and walk into interviews prepared with AI mock prep.",
    details: ["Vector PDF export", "Live portfolio deploy", "AI mock interview prep"],
    iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    glow: "hover:shadow-emerald-500/10",
    numberColor: "text-emerald-100 dark:text-emerald-950",
  },
];

export default function HowItWorksSection() {
  const { isDarkMode } = useDarkMode();
  return (
    <section className={"relative py-24 px-6 sm:px-10 lg:px-16 overflow-hidden transition-colors duration-300 " + (isDarkMode ? "bg-[#09090f] text-zinc-100" : "bg-white text-slate-900")}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full blur-[120px] bg-blue-500/5" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className={"inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold tracking-wider uppercase " + (isDarkMode ? "bg-zinc-800/80 border-zinc-700/80 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-600")}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            How It Works
          </div>
          <h2 className={"text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight " + (isDarkMode ? "text-white" : "text-slate-900")}>
            From rough draft to offer letter, in minutes.
          </h2>
          <p className={"text-sm font-normal leading-relaxed " + (isDarkMode ? "text-zinc-400" : "text-slate-500")}>
            Three steps. Zero resume-writing experience required.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(33.33%+16px)] right-[calc(33.33%+16px)] h-px border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 z-0" />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className={"relative rounded-3xl border p-7 flex flex-col gap-5 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl " + step.glow + " " + (isDarkMode ? "bg-[#0f0f1a] border-zinc-800/80" : "bg-white border-zinc-100")}>
                <span className={"absolute top-4 right-6 text-7xl font-black select-none pointer-events-none leading-none " + step.numberColor}>{step.number}</span>
                <div className={"w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 " + step.iconBg}>
                  <Icon className={"w-6 h-6 " + step.iconColor} />
                </div>
                <div className="space-y-1.5 relative z-10">
                  <h3 className={"text-lg font-semibold tracking-tight " + (isDarkMode ? "text-white" : "text-slate-900")}>{step.title}</h3>
                  <p className={"text-sm font-normal leading-relaxed " + (isDarkMode ? "text-zinc-400" : "text-slate-500")}>{step.description}</p>
                </div>
                <ul className="space-y-1.5 relative z-10">
                  {step.details.map((d, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs font-medium">
                      <CheckCircle2 className={"w-3.5 h-3.5 shrink-0 " + step.iconColor} />
                      <span className={isDarkMode ? "text-zinc-300" : "text-slate-600"}>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Link to="/templates" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-100 text-white dark:text-slate-900 text-sm font-semibold shadow-lg transition-all active:scale-95">
            <span>Start Building Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
