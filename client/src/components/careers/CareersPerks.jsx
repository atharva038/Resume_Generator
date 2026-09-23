import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Laptop,
  HeartPulse,
  Plane,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";
import { COMPANY_PERKS } from "./careersData";

const PERK_ICON_MAP = {
  DollarSign: DollarSign,
  Laptop: Laptop,
  HeartPulse: HeartPulse,
  Plane: Plane,
  BookOpen: BookOpen,
  Sparkles: Sparkles,
};

export default function CareersPerks() {
  return (
    <section className="py-20 sm:py-28 relative bg-zinc-50/70 dark:bg-black/40 border-y border-zinc-200/80 dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-zinc-200 dark:border-zinc-700">
            <Award className="w-3.5 h-3.5" />
            <span>Why Join at Day 0?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-950 dark:text-white">
            Leadership, Creative Freedom, &{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
              Zero-to-One Experience
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            At this stage, you build the foundation. We offer leadership status, complete creative autonomy, and priority for permanent roles when the company scales.
          </p>
        </div>

        {/* 6 Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {COMPANY_PERKS.map((perk, idx) => {
            const IconComponent = PERK_ICON_MAP[perk.icon] || Sparkles;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group p-7 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-400 dark:hover:border-zinc-600 backdrop-blur-md shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-200 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {perk.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-white mb-3">
                    {perk.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    {perk.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-white/5 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Founding Team Experience</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
