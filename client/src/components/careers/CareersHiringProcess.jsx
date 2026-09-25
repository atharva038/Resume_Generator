import React from "react";
import { motion } from "framer-motion";
import { Compass, Clock, CheckCircle2, ShieldCheck, Sparkles, Rocket } from "lucide-react";
import { HIRING_STEPS } from "./careersData";

export default function CareersHiringProcess() {
  return (
    <section className="py-20 sm:py-28 relative bg-zinc-50/50 dark:bg-black/30 border-t border-zinc-200/80 dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-500/20">
            <Rocket className="w-3.5 h-3.5" />
            <span>How We Partner</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-950 dark:text-white">
            Founding Team{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              Alignment Flow
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            No corporate interviews or robotic tests. Just honest conversations, a casual brainstorm session, and a risk-free trial sprint to see if we click.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HIRING_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-white/10 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 backdrop-blur-md shadow-xs flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-500">
                    {step.step}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </span>
                </div>

                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Transparent & Friendly</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
