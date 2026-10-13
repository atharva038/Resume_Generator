import React, { useState } from "react";
import { Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";

import { row1Faqs, row2Faqs, SYSTEM_FAQS } from "./faqData";
export { row1Faqs, row2Faqs, SYSTEM_FAQS };

function FAQCard({ item, isDarkMode }) {
  const { id, q, a, tag, takeaway, tagColor, indicatorColor } = item;
  return (
    <div
      className={`w-[390px] sm:w-[470px] min-h-[275px] shrink-0 p-7 sm:p-8 rounded-3xl backdrop-blur-xl border transition-colors duration-300 flex flex-col justify-between select-none ${
        isDarkMode
          ? "bg-zinc-900/60 border-white/10 hover:border-white/25 shadow-lg hover:shadow-2xl"
          : "bg-white/85 border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl"
      }`}
    >
      <div className="space-y-3">
        {/* Category Tag & Dot */}
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-medium tracking-wider uppercase backdrop-blur-md ${tagColor}`}
          >
            <span className="opacity-80 font-mono">{id}</span>
            <span className="opacity-40 font-mono">/</span>
            <span>{tag}</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${indicatorColor}`} />
        </div>

        {/* Question */}
        <h3
          className={`text-lg sm:text-xl font-normal tracking-tight leading-snug ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          {q}
        </h3>
      </div>

      {/* Answer & Takeaway */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-white/5 space-y-2.5">
        <p
          className={`text-sm sm:text-[15px] font-light leading-relaxed ${
            isDarkMode ? "text-zinc-400" : "text-slate-600"
          }`}
        >
          {a}
        </p>
        <div className="text-xs sm:text-sm font-mono font-medium text-indigo-600 dark:text-indigo-400 pt-0.5">
          {takeaway}
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { isDarkMode } = useDarkMode();
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate arrays once for seamless infinite loop
  const duplicatedRow1 = [...row1Faqs, ...row1Faqs];
  const duplicatedRow2 = [...row2Faqs, ...row2Faqs];

  return (
    <section
      id="faq"
      className={`relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-[#07080c] text-zinc-100" : "bg-[#f8f8f6] text-slate-900"
      }`}
    >
      {/* Scoped CSS for hardware-accelerated, lightweight, glitch-free keyframes */}
      <style>{`
        @keyframes faqScrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes faqScrollRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .faq-track-left {
          display: flex;
          width: max-content;
          animation: faqScrollLeft 56s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .faq-track-right {
          display: flex;
          width: max-content;
          animation: faqScrollRight 56s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .faq-marquee-container:hover .faq-track-left,
        .faq-marquee-container:hover .faq-track-right {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full blur-[140px] bg-indigo-500/5 dark:bg-indigo-500/10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Everything you need to <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">know</span>.
          </h2>

          <p
            className={`text-base sm:text-lg font-light leading-relaxed ${
              isDarkMode ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            Hover or tap any card to pause the slider. Real answers calibrated to SmartNShine features.
          </p>

          {/* Interactive Pause/Play Toggle Button */}
          <div className="pt-2">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
                isPaused
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : isDarkMode
                  ? "bg-zinc-800/80 hover:bg-zinc-700 border-white/10 text-zinc-300"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs"
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Slider</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Motion</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Dual Marquee Track with Edge Gradient Fade */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden faq-marquee-container py-2 space-y-6"
        >
          {/* Left Gradient Edge Mask */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-20 bg-gradient-to-r ${
              isDarkMode
                ? "from-[#07080c] via-[#07080c]/80 to-transparent"
                : "from-[#f8f8f6] via-[#f8f8f6]/80 to-transparent"
            }`}
          />

          {/* Right Gradient Edge Mask */}
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-20 bg-gradient-to-l ${
              isDarkMode
                ? "from-[#07080c] via-[#07080c]/80 to-transparent"
                : "from-[#f8f8f6] via-[#f8f8f6]/80 to-transparent"
            }`}
          />

          {/* Track 1: Gliding Left */}
          <div
            className="faq-track-left gap-5"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicatedRow1.map((item, idx) => (
              <FAQCard key={`r1-${idx}`} item={item} isDarkMode={isDarkMode} />
            ))}
          </div>

          {/* Track 2: Gliding Right */}
          <div
            className="faq-track-right gap-5"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicatedRow2.map((item, idx) => (
              <FAQCard key={`r2-${idx}`} item={item} isDarkMode={isDarkMode} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
