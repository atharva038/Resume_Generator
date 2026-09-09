import { motion } from "framer-motion";

/**
 * KineticSpatialAtmosphere
 * Replaces generic square grid lines with an artistic, multi-layered spatial installation environment:
 * - Dynamic luminous radial auroras that react to the theme
 * - Concentric kinetic dimensional rings rotating with spatial perspective
 * - Subtle floating coordinate telemetry and crosshair anchors
 * - Soft tactile depth and atmospheric void
 */
export default function KineticSpatialAtmosphere({ isDark = false, accentColor = "#2563eb" }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Generative Ambient Aurora Glows */}
      <div
        className="absolute -top-[20%] -left-[10%] h-[70vw] w-[70vw] max-w-[900px] max-h-[900px] rounded-full blur-[140px] opacity-35 transition-colors duration-1000"
        style={{
          background: isDark
            ? `radial-gradient(circle, ${accentColor}33 0%, rgba(99, 102, 241, 0.15) 50%, transparent 70%)`
            : `radial-gradient(circle, ${accentColor}20 0%, rgba(218, 214, 202, 0.4) 60%, transparent 80%)`,
        }}
      />
      <div
        className="absolute top-[45%] -right-[15%] h-[65vw] w-[65vw] max-w-[800px] max-h-[800px] rounded-full blur-[160px] opacity-30 transition-colors duration-1000"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(168, 85, 247, 0.12) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(228, 225, 215, 0.5) 60%, transparent 80%)",
        }}
      />
      <div
        className="absolute -bottom-[20%] left-[20%] h-[60vw] w-[60vw] max-w-[750px] max-h-[750px] rounded-full blur-[150px] opacity-25 transition-colors duration-1000"
        style={{
          background: isDark
            ? `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)`,
        }}
      />

      {/* 2. Concentric Kinetic Dimensional Orbit Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] sm:h-[1200px] sm:w-[1200px] opacity-20 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-[var(--kn-text-primary)] opacity-40"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[15%] rounded-full border border-[var(--kn-accent)] opacity-25"
          style={{ borderStyle: "dotted", borderWidth: "1.5px" }}
        />
        <div className="absolute inset-[32%] rounded-full border border-[var(--kn-border-strong)] opacity-30" />
      </div>

      {/* 3. Spatial Crosshair Markers & Telemetry Elements */}
    
     
      {/* Subtle Golden Ratio Crosshairs */}
      <div className="absolute top-1/3 left-8 w-4 h-4 text-[var(--kn-accent)] opacity-25 flex items-center justify-center font-mono text-[10px]">
        +
      </div>
      <div className="absolute top-2/3 right-10 w-4 h-4 text-[var(--kn-accent)] opacity-25 flex items-center justify-center font-mono text-[10px]">
        +
      </div>
      <div className="absolute top-1/4 right-1/4 w-3 h-3 text-[var(--kn-text-muted)] opacity-20 flex items-center justify-center font-mono text-[9px]">
        ×
      </div>
      <div className="absolute bottom-1/4 left-1/4 w-3 h-3 text-[var(--kn-text-muted)] opacity-20 flex items-center justify-center font-mono text-[9px]">
        ×
      </div>
    </div>
  );
}
