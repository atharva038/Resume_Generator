import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

/**
 * KineticHeroObject
 * Two-Column High-End Studio Stage Layout:
 * - Left Column: Monumental Name typography, title, bio tagline, and dynamic actions.
 * - Right Column: Spatial stage placeholder for the 3D Persistent Companion.
 */
export default function KineticHeroObject({
  name = "",
  role = "",
  bio = "",
  availabilityStatus = "",
  onExploreClick,
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    restDelta: 0.001,
  });

  const heroCopyOpacity = useTransform(smoothProgress, [0, 0.45], [1, 0.1]);
  const heroCopyY = useTransform(smoothProgress, [0, 0.45], [0, 40]);

  const displayName = name || "PORTFOLIO";

  return (
    <section
      ref={containerRef}
      id="hero-kinetic-zone"
      className="relative min-h-[92vh] w-full flex items-center justify-center px-6 sm:px-12 pt-28 pb-16 overflow-hidden"
    >
      <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center my-auto">
        
        {/* LEFT COLUMN: Name, Role & Status (Span 4) */}
        <motion.div
          style={{ opacity: heroCopyOpacity, y: heroCopyY }}
          className="lg:col-span-4 flex flex-col justify-center text-left space-y-4 select-none"
        >
        
          {/* Monumental Dual-Tone Kinetic Name */}
          <div className="space-y-1">
            <h1 className="kn-headline text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black tracking-[-0.04em] text-[var(--kn-text-primary)] leading-[0.92] uppercase">
              {displayName.split(" ").map((word, idx) => (
                <span key={idx} className={idx > 0 ? "kn-stroke-text block" : "block"}>
                  {word}{" "}
                </span>
              ))}
            </h1>
          </div>

          {/* Role */}
          {role && (
            <p className="kn-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-[var(--kn-accent)] font-bold pt-1">
              {role}
            </p>
          )}
        </motion.div>

        {/* CENTER COLUMN: Spatial Clearance Area for the 3D Traveling Card (Span 4) */}
        {/* No dashed placeholder - the 3D card floats freely in the center */}
        <div className="lg:col-span-4 flex items-center justify-center min-h-[300px] sm:min-h-[360px] pointer-events-none" />

        {/* RIGHT COLUMN: Description, Narrative & Action Cues (Span 4) */}
        <motion.div
          style={{ opacity: heroCopyOpacity, y: heroCopyY }}
          className="lg:col-span-4 flex flex-col justify-center text-left space-y-5 select-none"
        >
          {bio && (
            <>
              <span className="kn-meta-tag tracking-[0.25em] text-[var(--kn-text-muted)] text-[10px] uppercase font-semibold">
                ABOUT
              </span>

              <p className="text-sm sm:text-base text-[var(--kn-text-secondary)] font-normal leading-relaxed">
                {bio}
              </p>
            </>
          )}

          {/* Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const workEl = document.getElementById("kinetic-work-section");
                if (workEl) workEl.scrollIntoView({ behavior: "smooth" });
                if (onExploreClick) onExploreClick();
              }}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-[var(--kn-text-primary)] px-5 py-3 text-xs font-mono font-semibold text-[var(--kn-bg)] shadow-xl transition-all hover:bg-[var(--kn-accent)] hover:text-white cursor-pointer"
            >
              <span>EXPLORE WORK</span>
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
