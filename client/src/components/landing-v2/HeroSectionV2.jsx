import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, UploadCloud, ShieldCheck, Check } from "lucide-react";

export default function HeroSectionV2() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center font-scoutie">
      <div className="relative z-10 space-y-7">
        {/* Clean, Non-AI Editorial Badge */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold tracking-tight border border-zinc-200 dark:border-zinc-700"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          <span>ATS Resume Standard 2026</span>
        </motion.div>

        {/* Solid, Bold Typography - ZERO Gradient Text */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] max-w-4xl mx-auto"
        >
          Resumes built to pass ATS scanners. <br />
          <span className="text-zinc-500 dark:text-zinc-400 font-bold">
            Designed for hiring managers.
          </span>
        </motion.h1>

        {/* Natural, Clear Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Format your experience with proven applicant tracking system standards. Check keyword coverage, optimize bullet points, and export ATS-ready PDFs for free.
        </motion.p>

        {/* Confident, Solid Action Buttons - ZERO Rainbow Gradients */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link
            to="/templates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm sm:text-base transition-colors shadow-sm active:scale-98"
          >
            <span>Create Your Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium text-sm sm:text-base transition-colors active:scale-98"
          >
            <UploadCloud className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <span>Import Existing CV</span>
          </Link>
        </motion.div>

        {/* Simple Trust Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center gap-5 text-xs text-zinc-500 dark:text-zinc-400 font-medium pt-1"
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Free to start
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Workday & Taleo format
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> High-res PDF download
          </span>
        </motion.div>

        {/* Authentic, Clean Document Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="pt-8"
        >
          <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#11141a] p-6 sm:p-8 shadow-lg text-left">
            {/* Top Minimal Status Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
                  ATS Verified Format
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
                Score: 98/100
              </span>
            </div>

            {/* Document Body */}
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Alex Morgan</h3>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Senior Software Engineer • San Francisco, CA • alex@example.com
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Experience
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <span>CloudScale Technologies — Senior Tech Lead</span>
                    <span className="text-zinc-400 font-normal">2022 – Present</span>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-xs text-zinc-600 dark:text-zinc-300 list-disc list-inside leading-relaxed">
                    <li>
                      Architected microservices handling <strong>4.2M daily requests</strong> with 99.99% uptime.
                    </li>
                    <li>
                      Optimized PostgreSQL queries, cutting p99 latency by <strong>47%</strong> across critical endpoints.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Skills
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  TypeScript, React, Node.js, PostgreSQL, Redis, Docker, Kubernetes, AWS
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Summary Bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs font-bold text-zinc-900 dark:text-white">Standard Headers</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">100% parsable by ATS</div>
          </div>
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs font-bold text-zinc-900 dark:text-white">STAR Bullets</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Action-oriented impact</div>
          </div>
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs font-bold text-zinc-900 dark:text-white">12+ Templates</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Clean typography</div>
          </div>
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs font-bold text-zinc-900 dark:text-white">Clean PDF</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Zero formatting errors</div>
          </div>
        </div>
      </div>
    </section>
  );
}
