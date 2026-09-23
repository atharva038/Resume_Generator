import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { CAREER_FAQS } from "./careersData";

export default function CareersFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="py-20 sm:py-28 relative bg-zinc-50/50 dark:bg-black/30 border-t border-zinc-200/80 dark:border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Candidate FAQs</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-950 dark:text-white">
            Frequently Asked{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
              Questions
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            Everything you need to know about our remote setup, interview process, and compensation structure.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {CAREER_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/10 overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-medium text-zinc-900 dark:text-white text-base sm:text-lg transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-blue-500" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed border-t border-zinc-100 dark:border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
