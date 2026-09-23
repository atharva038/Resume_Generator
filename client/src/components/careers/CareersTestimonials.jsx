import React from "react";
import { motion } from "framer-motion";
import { MessageSquareQuote, MapPin, Star } from "lucide-react";
import { TEAM_TESTIMONIALS } from "./careersData";

export default function CareersTestimonials() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-zinc-200 dark:border-zinc-700">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Founding Stories</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-950 dark:text-white">
            Life at{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
              SmartNShine
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            Hear directly from the builders creating the next-generation AI career operating system.
          </p>
        </div>

        {/* 2-Card Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {TEAM_TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-400 dark:hover:border-zinc-600 backdrop-blur-md shadow-2xs flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-zinc-700 dark:fill-zinc-300" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-light italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-zinc-100 dark:border-white/5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-white/10"
                />
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    {t.role}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-light">
                    <MapPin className="w-3 h-3" />
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
