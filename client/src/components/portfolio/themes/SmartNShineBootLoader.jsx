import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { SmartNShineSymbol } from "./SmartNShineBrandMark";

/**
 * SmartNShineBootLoader
 * Short, branded initialization sequence for the Retro-Futuristic system.
 * Ultra-fast, skippable, and communicates the fictional OS technology layer.
 */
export default function SmartNShineBootLoader({
  onComplete,
  sfx = null,
  duration = 1200,
}) {
  const [progress, setProgress] = useState(0);
  const [statusStage, setStatusStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const stages = [
    "INITIALIZING SMARTNSHINE OS...",
    "LOADING PORTFOLIO ENGINE...",
    "VERIFYING RETRO KERNEL MODULES...",
    "SYSTEM READY",
  ];

  const handleSkip = useCallback(() => {
    if (sfx) sfx.click();
    setProgress(100);
    setStatusStage(3);
    setIsVisible(false);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 200);
  }, [sfx, onComplete]);

  // Handle ESC or Space to skip instantly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  useEffect(() => {
    const intervalTime = duration / 20;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next === 30) setStatusStage(1);
        if (next === 70) setStatusStage(2);
        if (next >= 100) {
          clearInterval(timer);
          setStatusStage(3);
          if (sfx) sfx.beep(880, "sine", 0.08, 0.03);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 250);
          }, 300);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, onComplete, sfx]);

  // Build segmented ASCII bar
  const blockCount = Math.floor(progress / 10);
  const asciiBar = "█".repeat(blockCount) + "░".repeat(10 - blockCount);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={handleSkip}
          className="rf-boot-overlay cursor-pointer"
          title="Click or press ESC to skip"
        >
          {/* Subtle CRT Scanline effect over boot overlay */}
          <div className="rf-scanlines" />

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rf-boot-box text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner Rivets */}
            <div className="rf-rivet-tl">+</div>
            <div className="rf-rivet-tr">+</div>
            <div className="rf-rivet-bl">+</div>
            <div className="rf-rivet-br">+</div>

            {/* Header / Brand Mark */}
            <div className="flex flex-col items-center justify-center gap-1.5 pb-2 border-b border-[var(--rf-border-subtle)]">
              <div className="flex items-center gap-2">
                <SmartNShineSymbol size={18} className="text-[var(--rf-accent-gold)]" />
                <span className="text-base font-bold tracking-widest text-[var(--rf-text-primary)]">
                  SMARTNSHINE
                </span>
                <span className="rf-led rf-led-gold" />
              </div>
              <span className="text-[10px] text-[var(--rf-text-muted)] tracking-widest uppercase">
                PORTFOLIO SYSTEM // BUILD 026.09
              </span>
            </div>

            {/* Current Diagnostic Status */}
            <div className="py-2 space-y-1">
              <div className="text-xs text-[var(--rf-accent-primary)] font-bold tracking-wide">
                &gt; {stages[statusStage]}
              </div>
              <div className="text-[11px] text-[var(--rf-text-secondary)] font-mono">
                [{asciiBar}] {progress}%
              </div>
            </div>

            {/* Progress Hardware Bar */}
            <div className="rf-boot-progress-track">
              <div
                className="rf-boot-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* System Metadata & Skip Tip */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--rf-border-subtle)] text-[10px] text-[var(--rf-text-muted)]">
              <span className="text-[var(--rf-accent-gold)] font-medium">SN // 026</span>
              <button
                type="button"
                onClick={handleSkip}
                className="hover:text-[var(--rf-accent-primary)] transition-colors underline cursor-pointer"
              >
                [ESC / CLICK TO SKIP]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

SmartNShineBootLoader.propTypes = {
  onComplete: PropTypes.func,
  sfx: PropTypes.object,
  duration: PropTypes.number,
};
