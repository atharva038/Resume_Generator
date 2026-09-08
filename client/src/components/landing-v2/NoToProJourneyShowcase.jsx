import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export default function NoToProJourneyShowcase() {
  return (
    <section id="journey" className="scroll-mt-12 space-y-6 pt-10">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              [ 02 // EVOLUTION TIMELINE ]
            </span>
            <span className="text-xs text-zinc-400">• From No to Pro</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
            Transforming Weak Resumes into Offer Machines
          </h2>
        </div>
      </div>

      {/* Side-by-Side Comparison: The "No" vs The "Pro" */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* The NO (Rejected Resume) */}
        <div className="rounded-xl border border-rose-200 dark:border-rose-950/80 bg-rose-50/30 dark:bg-rose-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-bold">
              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>THE "NO" — 42% ATS Match</span>
            </span>
            <span className="text-xs font-mono text-rose-500 font-semibold">REJECTED BY BOTS</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-white dark:bg-[#140d0f] border border-rose-200/80 dark:border-rose-900/40 text-zinc-600 dark:text-zinc-400">
              <div className="text-[10px] font-bold text-rose-600 uppercase mb-1">Vague Bullet Point</div>
              "Worked with the team to fix bugs and made sure database was running faster."
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#140d0f] border border-rose-200/80 dark:border-rose-900/40 text-zinc-600 dark:text-zinc-400">
              <div className="text-[10px] font-bold text-rose-600 uppercase mb-1">Formatting Pitfalls</div>
              • Complex tables causing OCR failure <br />
              • Missing critical keywords from Job Description <br />
              • Zero quantifiable ROI or metrics
            </div>
          </div>
        </div>

        {/* The PRO (Offer Winning Resume) */}
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-950/80 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>THE "PRO" — 98% ATS Match</span>
            </span>
            <span className="text-xs font-mono text-emerald-600 font-semibold">INTERVIEW GUARANTEE</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-white dark:bg-[#0c1410] border border-emerald-200/80 dark:border-emerald-900/40 text-zinc-800 dark:text-zinc-200">
              <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1 flex items-center justify-between">
                <span>STAR-Method Bullet</span>
                <span className="text-[10px] font-mono text-emerald-500 font-semibold">+47% Latency Reduction</span>
              </div>
              "Architected PostgreSQL indexing pipeline, reducing p99 latency by <strong>47%</strong> and scaling throughput to <strong>4.2M daily active requests</strong>."
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#0c1410] border border-emerald-200/80 dark:border-emerald-900/40 text-zinc-800 dark:text-zinc-200">
              <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">ATS Optimization Check</div>
              • 100% clean single-column structure <br />
              • 14/15 required hard tech keywords matched <br />
              • Action verbs mapped to Taleo & Workday scoring criteria
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
