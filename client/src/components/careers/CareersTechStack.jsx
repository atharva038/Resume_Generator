import React from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Zap, Code2, Database, Shield, Layers } from "lucide-react";
import { TECH_STACK_ITEMS } from "./careersData";

export default function CareersTechStack() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-purple-500/20">
            <Terminal className="w-3.5 h-3.5" />
            <span>Engineering Craft</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-950 dark:text-white">
            Built with Modern,{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500">
              High-Velocity Technologies
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            We avoid legacy bloat. Our tech stack is chosen for developer delight, instantaneous performance, and sub-100ms parser latency.
          </p>
        </div>

        {/* Stack Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {TECH_STACK_ITEMS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-white/10 hover:border-purple-500/40 dark:hover:border-purple-500/40 backdrop-blur-md shadow-xs transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-2">
                  {item.category}
                </span>
                <h4 className="text-lg font-medium text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {item.name}
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                <Code2 className="w-3.5 h-3.5 text-purple-500" />
                <span>Production Standard</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
