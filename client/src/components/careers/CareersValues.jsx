import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  HeartHandshake,
  ShieldCheck,
  Globe,
  GraduationCap,
  Layers,
  ArrowUpRight,
  Rocket,
} from "lucide-react";
import { COMPANY_VALUES } from "./careersData";

const ICON_MAP = {
  Sparkles: Sparkles,
  Zap: Zap,
  HeartHandshake: HeartHandshake,
  ShieldCheck: ShieldCheck,
  Globe: Globe,
  GraduationCap: GraduationCap,
};

export default function CareersValues() {
  return (
    <section id="culture" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/20">
            <Rocket className="w-3.5 h-3.5" />
            <span>Founding Team Culture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-950 dark:text-white">
            Built by Builders,{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
              For High-Agency Hustlers
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            We are not a corporate bureaucracy. We are a hungry, early-stage squad of creators building an indispensable career tool. Here is how we operate together.
          </p>
        </div>

        {/* 6-Card Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {COMPANY_VALUES.map((val, idx) => {
            const IconComponent = ICON_MAP[val.icon] || Sparkles;

            return (
              <motion.div
                key={val.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative p-7 sm:p-8 rounded-3xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 hover:border-blue-500/40 dark:hover:border-blue-500/40 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Glowing subtle top accent gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-blue-500/20 transition-all duration-500" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-black transition-all duration-300 shadow-xs">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
                      {val.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                    {val.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 transition-colors">
                  <span>Pillar #{idx + 1}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
