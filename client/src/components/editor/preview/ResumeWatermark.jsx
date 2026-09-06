/**
 * ResumeWatermark - AI-Resistant Anti-Screenshot Protection Layer
 * 
 * Features:
 * - 3 Staggered diagonal watermarks (Top, Center, Bottom) covering all resume sections
 * - Multiply blend mode that merges with text strokes to prevent AI inpainting/removal
 * - Security micro-lattice pattern with angled watermark lines
 * - Strictly hidden on exported PDF (.no-print)
 */
export default function ResumeWatermark({ isMobile = false }) {
  return (
    <div
      className="pointer-events-none select-none absolute inset-0 z-30 overflow-hidden no-print"
      aria-hidden="true"
      style={{ mixBlendMode: "multiply" }}
    >
      {/* 1. Fine-grained security diagonal micro-lattice pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='120' viewBox='0 0 220 120'><line x1='0' y1='120' x2='220' y2='0' stroke='%230f172a' stroke-opacity='0.035' stroke-width='1'/><text x='15' y='65' fill='%230f172a' fill-opacity='0.06' font-size='10' font-family='sans-serif' font-weight='700' letter-spacing='1.5' transform='rotate(-28 15 65)'>SmartNShine • PREVIEW</text></svg>")`,
          backgroundSize: "220px 120px",
        }}
      />

      {/* 2. Top-Third Large Diagonal Watermark */}
      <div
        className="absolute left-1/2 flex flex-col items-center justify-center pointer-events-none"
        style={{
          top: "22%",
          transform: "translate(-50%, -50%) rotate(-25deg)",
          width: "140%",
        }}
      >
        <span
          className="font-black uppercase tracking-widest text-[#0f172a]"
          style={{
            fontSize: isMobile ? "34px" : "58px",
            letterSpacing: "0.22em",
            opacity: 0.11,
            whiteSpace: "nowrap",
            textShadow: "0 0 1px rgba(15,23,42,0.15)",
          }}
        >
          SmartNShine
        </span>
        <span
          className="font-bold tracking-[0.3em] text-[#0f172a] uppercase text-center"
          style={{
            fontSize: isMobile ? "8px" : "11px",
            opacity: 0.08,
            marginTop: "1px",
          }}
        >
          Preview Mode • SmartNShine.app
        </span>
      </div>

      {/* 3. Center Large Diagonal Watermark */}
      <div
        className="absolute left-1/2 flex flex-col items-center justify-center pointer-events-none"
        style={{
          top: "52%",
          transform: "translate(-50%, -50%) rotate(-25deg)",
          width: "140%",
        }}
      >
        <span
          className="font-black uppercase tracking-widest text-[#0f172a]"
          style={{
            fontSize: isMobile ? "38px" : "66px",
            letterSpacing: "0.22em",
            opacity: 0.12,
            whiteSpace: "nowrap",
            textShadow: "0 0 1px rgba(15,23,42,0.18)",
          }}
        >
          SmartNShine
        </span>
        <span
          className="font-bold tracking-[0.3em] text-[#0f172a] uppercase text-center"
          style={{
            fontSize: isMobile ? "8px" : "11px",
            opacity: 0.08,
            marginTop: "1px",
          }}
        >
          Official Preview • Protected Document
        </span>
      </div>

      {/* 4. Bottom-Third Large Diagonal Watermark */}
      <div
        className="absolute left-1/2 flex flex-col items-center justify-center pointer-events-none"
        style={{
          top: "82%",
          transform: "translate(-50%, -50%) rotate(-25deg)",
          width: "140%",
        }}
      >
        <span
          className="font-black uppercase tracking-widest text-[#0f172a]"
          style={{
            fontSize: isMobile ? "34px" : "58px",
            letterSpacing: "0.22em",
            opacity: 0.11,
            whiteSpace: "nowrap",
            textShadow: "0 0 1px rgba(15,23,42,0.15)",
          }}
        >
          SmartNShine
        </span>
        <span
          className="font-bold tracking-[0.3em] text-[#0f172a] uppercase text-center"
          style={{
            fontSize: isMobile ? "8px" : "11px",
            opacity: 0.08,
            marginTop: "1px",
          }}
        >
          Preview Copy • Export Clean PDF To Remove
        </span>
      </div>
    </div>
  );
}
