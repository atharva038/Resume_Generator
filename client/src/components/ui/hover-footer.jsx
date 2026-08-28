import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text = "SMARTNSHINE",
  duration,
  className,
}) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 460 70"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer overflow-visible w-full", className)}
    >
      <defs>
        {/* Rich multi-stop gradient revealed on cursor hover */}
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="30%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#5d8ff0" />
              <stop offset="25%" stopColor="#6f7fe4" />
              <stop offset="50%" stopColor="#8b67df" />
              <stop offset="75%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#60a5fa" />
            </>
          )}
        </linearGradient>

        {/* Dynamic smooth mask following the mouse */}
        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="30%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0.15, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Base Visible Outline with High-Tech Contrast */}
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.6"
        className="fill-transparent stroke-gray-300/80 dark:stroke-zinc-700/60 font-black tracking-tight text-[54px] sm:text-[58px]"
        style={{ opacity: hovered ? 0.6 : 0.35 }}
      >
        {text}
      </text>

      {/* Slower, Smooth Animated Stroke with Subtle Ambient Color Shift */}
      <motion.text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.75"
        className="fill-transparent font-black tracking-tight text-[54px] sm:text-[58px]"
        initial={{
          strokeDashoffset: 1000,
          strokeDasharray: 350,
          stroke: "#5d8ff0",
        }}
        animate={{
          strokeDashoffset: [1000, 0, -1000],
          strokeDasharray: [350, 650, 350],
          stroke: [
            "#5d8ff0",
            "#6f7fe4",
            "#8b67df",
            "#38bdf8",
            "#60a5fa",
            "#5d8ff0",
          ],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      {/* Luminous Gradient Mask Fill on Mouse Hover */}
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.8"
        mask="url(#textMask)"
        className="fill-transparent font-black tracking-tight text-[54px] sm:text-[58px]"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none opacity-25 dark:opacity-50 overflow-hidden"
      style={{
        background:
          "radial-gradient(100% 100% at 50% 0%, rgba(93, 143, 240, 0.12) 0%, rgba(15, 23, 42, 0) 100%)",
      }}
    />
  );
};

export default TextHoverEffect;
