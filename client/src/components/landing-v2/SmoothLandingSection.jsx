import React, { useState, useEffect, Suspense } from "react";
import { useDarkMode } from "../../context/DarkModeContext";

/**
 * SectionFadeIn:
 * Smooth frame-synchronized dissolve entrance for lazy-loaded landing page sections.
 * Guarantees zero visual pop-in or sudden layout jumps when chunks resolve.
 */
function SectionFadeIn({ children }) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Schedule on next animation frame to ensure the initial state is committed to DOM
    const rafId = requestAnimationFrame(() => {
      setIsRendered(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      style={{
        opacity: isRendered ? 1 : 0,
        transform: isRendered ? "translate3d(0, 0, 0)" : "translate3d(0, 8px, 0)",
        transition:
          "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "opacity, transform",
      }}
      className="w-full"
    >
      {children}
    </div>
  );
}

/**
 * SectionPlaceholder:
 * Subtle ambient placeholder that reserves layout space to eliminate scrollbar jitter
 * and provides a buttery loading transition.
 */
function SectionPlaceholder({ minHeight = 500, isDarkMode }) {
  return (
    <div
      style={{ minHeight: `${minHeight}px` }}
      className={`w-full flex items-center justify-center py-20 px-4 transition-colors duration-300 ${
        isDarkMode ? "bg-[#07080c]" : "bg-[#f8f9fc]"
      }`}
    >
      <div className="w-full max-w-6xl mx-auto space-y-8 animate-pulse opacity-25 pointer-events-none">
        <div className="flex flex-col items-center space-y-3">
          <div
            className={`h-3.5 w-28 rounded-full ${
              isDarkMode ? "bg-zinc-800" : "bg-slate-200"
            }`}
          />
          <div
            className={`h-7 w-64 sm:w-80 rounded-xl ${
              isDarkMode ? "bg-zinc-800/80" : "bg-slate-200/80"
            }`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-60 rounded-3xl border ${
                isDarkMode
                  ? "bg-zinc-900/40 border-zinc-800/40"
                  : "bg-white/60 border-slate-200/60 shadow-xs"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SmoothLandingSection({
  children,
  id,
  minHeight = 500,
}) {
  const { isDarkMode } = useDarkMode();

  return (
    <div id={id} className="w-full relative overflow-visible">
      <Suspense
        fallback={
          <SectionPlaceholder
            minHeight={minHeight}
            isDarkMode={isDarkMode}
          />
        }
      >
        <SectionFadeIn>{children}</SectionFadeIn>
      </Suspense>
    </div>
  );
}
