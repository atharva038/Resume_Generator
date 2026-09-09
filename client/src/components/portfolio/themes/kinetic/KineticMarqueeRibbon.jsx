import { motion } from "framer-motion";

/**
 * KineticMarqueeRibbon
 * High-fashion / digital art installation continuous kinetic marquee ribbon.
 * Features dual-speed parallax motion, kinetic stroke-fill typography, and precision coordinates.
 */
export default function KineticMarqueeRibbon({
  text = "SCROLL × TRANSFORMATION × SPATIAL MOTION × 2026",
  reverse = false,
  className = "",
}) {
  const items = Array(8).fill(text);

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-[var(--kn-border)] bg-[var(--kn-bg-subtle)]/40 py-3.5 select-none backdrop-blur-sm ${className}`}
      aria-hidden="true"
    >
      <motion.div
        animate={{ x: reverse ? [0, -1000] : [-1000, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap items-center gap-8 text-xs font-mono font-bold tracking-[0.3em] uppercase text-[var(--kn-text-secondary)]"
      >
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className={idx % 2 === 0 ? "text-[var(--kn-text-primary)]" : "text-[var(--kn-accent)]"}>
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--kn-accent)] opacity-60" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
