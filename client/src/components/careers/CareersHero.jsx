import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  ChevronRight,
  Rocket,
  Layers,
  ArrowRight,
} from "lucide-react";
import { CAREERS_STATS } from "./careersData";

export default function CareersHero({ totalOpenings = 5, onExploreRoles }) {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
      {/* Subtle Background Lighting - Clean & Non-Aggressive */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-zinc-500/5 blur-[120px] rounded-full opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Minimalist Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium backdrop-blur-md mb-6 shadow-2xs"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Day-0 Founding Circle</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>Core Team Track</span>
          <Rocket className="w-3.5 h-3.5 text-zinc-500" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-zinc-950 dark:text-white max-w-4xl mx-auto leading-[1.12]"
        >
          Build from Zero to One:{" "}
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
            Join Our Founding Team
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed"
        >
          We are developer-founders who have built a live, functional AI ATS and portfolio platform. Now, we are assembling our <strong>founding circle in Growth, Marketing, and Business Development</strong> to launch to tens of thousands of job seekers.
        </motion.p>

        {/* Sleek Modern Action Buttons (No heavy yellow buttons) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          <button
            onClick={onExploreRoles}
            className="px-6 sm:px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-medium text-sm sm:text-base shadow-sm active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Explore Open Roles ({totalOpenings})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <a
            href="#culture"
            className="px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 font-medium text-sm sm:text-base transition-all active:scale-95 shadow-2xs"
          >
            Why Join at Day 0?
          </a>
        </motion.div>

        {/* 4 Clean, Well-Spaced Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto"
        >
          {CAREERS_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                    {stat.change}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                  {stat.value}
                </div>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
