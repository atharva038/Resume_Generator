"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const SPRING_MOUSE = {
  stiffness: 260,
  damping: 18,
  mass: 0.25,
};

export function cn(...inputs) {
  return inputs
    .flatMap((c) => {
      if (!c) return [];
      if (typeof c === "string") return [c];
      if (Array.isArray(c)) return [cn(...c)];
      if (typeof c === "object") return Object.keys(c).filter((k) => c[k]);
      return [];
    })
    .join(" ");
}

export function TiltCard({
  children,
  max = 16,
  glare = true,
  className,
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const enabled = !reduce;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const srx = useSpring(rx, SPRING_MOUSE);
  const sry = useSpring(ry, SPRING_MOUSE);
  const sGlareOpacity = useSpring(glareOpacity, { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el || !enabled) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    ry.set((px - 0.5) * max);
    rx.set((0.5 - py) * max);
    gx.set(px * 100);
    gy.set(py * 100);
    glareOpacity.set(1);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    glareOpacity.set(0);
  };

  const glareBg = useMotionTemplate`radial-gradient(circle 240px at ${gx}% ${gy}%, rgba(255,255,255,0.3), transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative overflow-hidden rounded-3xl transition-shadow duration-300 will-change-transform cursor-pointer select-none",
        className
      )}
    >
      <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>

      {glare && enabled && (
        <motion.div
          aria-hidden
          style={{ background: glareBg, opacity: sGlareOpacity }}
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
        />
      )}
    </motion.div>
  );
}

export default TiltCard;
