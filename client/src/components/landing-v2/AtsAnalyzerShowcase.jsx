import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, TrendingUp, Sparkles } from "lucide-react";

export default function AtsAnalyzerShowcase() {
  const [activeJob, setActiveJob] = useState("fullstack");

  const jobs = {
    fullstack: {
      role: "Senior Full Stack Engineer",
      score: 96,
      matched: ["React", "TypeScript", "Node.js", "PostgreSQL", "System Design", "AWS", "Docker"],
      missing: ["GraphQL"],
      advice: "Inject 1 mention of GraphQL or REST API design into the second project bullet to reach 100% score.",
    },
    devops: {
      role: "Lead DevOps / SRE Engineer",
      score: 98,
      matched: ["Kubernetes", "Terraform", "CI/CD Pipelines", "Prometheus", "Linux Kernel", "Go", "AWS ECS"],
      missing: [],
      advice: "Perfect match! Your keywords directly mirror Senior SRE job requirements across Workday and Taleo.",
    },
    product: {
      role: "Staff Product Manager",
      score: 94,
      matched: ["Product Strategy", "A/B Testing", "SQL Analytics", "B2B SaaS", "Roadmapping", "Cross-Functional"],
      missing: ["PLG Monetization"],
      advice: "Add quantifiable revenue metric (e.g. $1.5M ARR) to strengthen executive recruiter appeal.",
    },
  };

  const current = jobs[activeJob];

  return (
    <section id="analyzer" className="scroll-mt-12 space-y-6 pt-10">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              [ 03 // ATS SCANNER HUD ]
            </span>
            <span className="text-xs text-zinc-400">• Real-Time Keyword Parser</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            Real-Time Keyword & Match Gap Engine
          </h2>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setActiveJob("fullstack")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeJob === "fullstack"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Full Stack
          </button>
          <button
            onClick={() => setActiveJob("devops")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeJob === "devops"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            DevOps / SRE
          </button>
          <button
            onClick={() => setActiveJob("product")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              activeJob === "product"
                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Product Lead
          </button>
        </div>
      </div>

      {/* Analyzer Live Canvas */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11141a] p-6 shadow-sm space-y-6">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          {/* Gauge / Score */}
          <div className="md:col-span-4 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 text-center space-y-2">
            <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              ATS MATCH CONFIDENCE
            </div>
            <div className="text-5xl font-extrabold text-zinc-900 dark:text-white font-mono">
              {current.score}
              <span className="text-xl text-zinc-400 font-normal">/100</span>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Workday & Taleo Ready</span>
            </div>
          </div>

          {/* Keywords Extracted */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-2">
                Matched Target Keywords ({current.matched.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {current.matched.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700/60"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{kw}</span>
                  </span>
                ))}
                {current.missing.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900/60"
                  >
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                    <span>Missing: {kw}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="p-3.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Optimization Tip:</strong> {current.advice}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
          <span className="text-xs text-zinc-500">Upload your own resume to scan in real-time</span>
          <Link
            to="/ats-analyzer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Run Free Full ATS Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
