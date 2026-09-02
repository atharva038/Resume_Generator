import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

// Magnetic Card with cursor physics, 3D tilt, and smooth return spring
function MagneticCard({ children, className = "", style = {} }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState(
    "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)"
  );

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (-y / (rect.height / 2)) * 4.5;
    const rotateY = (x / (rect.width / 2)) * 4.5;
    const translateX = (x / (rect.width / 2)) * 6;
    const translateY = (y / (rect.height / 2)) * 6;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0) scale3d(1.015, 1.015, 1.015)`
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)"
    );
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease",
        willChange: "transform",
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export default function PlayfulColorfulBento() {
  const { isDarkMode } = useDarkMode();

  return (
    <section className={`relative py-24 px-4 sm:px-8 lg:px-14 overflow-hidden transition-colors duration-300 ${
      isDarkMode ? "bg-[#07080c] text-zinc-100" : "bg-[#faf9f6] text-slate-900"
    }`}>
      {/* Scoped CSS Keyframe Line & Particle Animations */}
      <style>{`
        @keyframes bentoDashFlow {
          to { stroke-dashoffset: -32; }
        }
        @keyframes bentoScanLaser {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(52px); opacity: 0.95; }
        }
        @keyframes bentoFloatGentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(1.5deg); }
        }
        @keyframes bentoWaveform {
          0%, 100% { height: 6px; }
          50% { height: 26px; }
        }
        @keyframes bentoPulseGlow {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 3px rgba(56, 189, 248, 0.4)); }
          50% { opacity: 1; filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.9)); }
        }
        .anim-dash-flow {
          stroke-dasharray: 6 6;
          animation: bentoDashFlow 1.2s linear infinite;
        }
        .anim-dash-slow {
          stroke-dasharray: 5 5;
          animation: bentoDashFlow 2.2s linear infinite;
        }
        .anim-scan-laser {
          animation: bentoScanLaser 2.4s ease-in-out infinite;
        }
        .anim-float {
          animation: bentoFloatGentle 3s ease-in-out infinite;
        }
        .anim-glow {
          animation: bentoPulseGlow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[160px] bg-purple-500/10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] rounded-full blur-[160px] bg-blue-500/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Designed for clarity, engineered for offers.
          </h2>
          <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>
            Every step of landing top-tier engineering offers made visual, intelligent, and seamless.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* ROW 1: Card 1 (Lavender / STAR Builder) & Card 2 (Sky Blue / Tailor to JD) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
          {/* Card 1: Lavender / Turn rough experience into offer-winning bullets (5 Cols) */}
          <MagneticCard className={`lg:col-span-5 rounded-[32px] border p-7 sm:p-8 flex flex-col justify-between cursor-pointer hover:shadow-2xl text-left ${
            isDarkMode
              ? "bg-[#181324] border-purple-900/40 shadow-purple-950/20"
              : "bg-[#f6f1ff] border-purple-200/70 shadow-purple-100"
          }`}>
            {/* Top SVG Illustration: Animated Mascot + Flowing Dotted Arc + Illustrated Document */}
            <div className="relative w-full h-48 flex items-center justify-between overflow-hidden px-2">
              {/* Animated Cute Mascot */}
              <div className="relative flex flex-col items-center anim-float">
                <svg className="w-22 h-22" viewBox="0 0 100 100" fill="none">
                  {/* Decorative Sparkle Stars */}
                  <path d="M16 20 L18 13 L23 15 L18 20 L20 26 L15 22 L10 26 L12 20 L7 15 L13 13 Z" fill="#c084fc" />
                  <path d="M84 18 L86 12 L90 14 L86 18 L88 23 L84 20 L80 23 L82 18 L78 14 L83 12 Z" fill="#c084fc" />

                  {/* Body with Soft Gradient */}
                  <defs>
                    <linearGradient id="purpleMascotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="50" cy="55" rx="33" ry="29" fill="url(#purpleMascotGrad)" />

                  {/* Animated Blinking Eyes */}
                  <ellipse cx="41" cy="52" rx="3.5" ry="4" fill="#1e1b4b" />
                  <ellipse cx="59" cy="52" rx="3.5" ry="4" fill="#1e1b4b" />
                  <circle cx="42.5" cy="50" r="1.3" fill="white" />
                  <circle cx="60.5" cy="50" r="1.3" fill="white" />

                  {/* Rosy Blush */}
                  <ellipse cx="34" cy="58" rx="3.5" ry="2.2" fill="#f472b6" opacity="0.6" />
                  <ellipse cx="66" cy="58" rx="3.5" ry="2.2" fill="#f472b6" opacity="0.6" />

                  {/* Smiling Mouth */}
                  <path d="M45 58 Q50 63 55 58" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                  {/* Playful Feet */}
                  <path d="M41 84 Q39 91 35 91" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
                  <path d="M59 84 Q61 91 65 91" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
                </svg>

                <div className="mt-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold text-purple-700 dark:text-purple-300 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  AI STAR Generator
                </div>
              </div>

              {/* Animated Looping Doodle Connector Arrow with Clean Open Stroke Tip */}
              <div className="flex items-center justify-center shrink-0 z-20 px-1">
                <svg className="w-18 h-14 text-purple-500 dark:text-purple-400 overflow-visible" viewBox="0 0 80 50" fill="none">
                  <path
                    d="M 6 34 C 20 46, 36 38, 46 22 C 52 14, 60 13, 67 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="anim-dash-flow"
                  />
                  <path
                    d="M 57 11 L 68 18 L 58 26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Actual Polished Resume Document with Real Image Preview */}
              <div className="relative w-44 sm:w-52 h-48 rounded-2xl bg-white dark:bg-[#110e1c] border border-purple-200/90 dark:border-purple-800/80 p-1.5 shadow-xl text-left z-10 flex flex-col justify-between overflow-hidden group">
                {/* Floating Top Badge */}
                <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white font-mono text-[9px] font-semibold shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  98% ATS
                </div>

                {/* Real Resume Image with Smooth Zoom on Hover */}
                <div className="relative w-full h-full overflow-hidden rounded-xl bg-white">
                  <img
                    src="/images/sample-resume.png"
                    alt="Polished ATS Resume Preview"
                    className="w-full h-full object-cover object-top filter contrast-[1.02] transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle Bottom Fade Vignette with STAR Formatted pill */}
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/95 dark:from-[#110e1c]/95 to-transparent pointer-events-none flex items-end justify-center pb-1.5">
                    <span className="text-[9px] font-mono font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-800/60 shadow-xs">
                      STAR Formatted
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Headline & Copy */}
            <div className="space-y-2 mt-4">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
                <span className="text-purple-600 dark:text-purple-400 block">Turn raw experience</span>
                <span className={isDarkMode ? "text-white" : "text-slate-900"}>into high-impact bullets.</span>
              </h3>
              <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>
                Paste your rough draft bullets or unstructured project notes. SmartNShine structures them into quantified STAR achievements packed with proven recruiter metrics.
              </p>
            </div>
          </MagneticCard>

          {/* Card 2: Sky Blue / Tailor resume to any Job Description (7 Cols) */}
          <MagneticCard className={`lg:col-span-7 rounded-[32px] border p-7 sm:p-8 flex flex-col justify-between cursor-pointer hover:shadow-2xl text-left ${
            isDarkMode
              ? "bg-[#0e1c2b] border-blue-900/40 shadow-blue-950/20"
              : "bg-[#f0f8ff] border-blue-200/70 shadow-blue-100"
          }`}>
            {/* Top SVG Illustration: Looped Curve Arrow & 3 Burst Rays */}
            <div className="relative w-full h-48 flex items-center justify-between gap-2 overflow-hidden px-1">
              {/* Background Animated Dot Grid Matrix */}
              <div className="absolute top-2 left-6 opacity-30 pointer-events-none">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                  {[...Array(24)].map((_, i) => (
                    <circle key={i} cx={(i % 8) * 14 + 6} cy={Math.floor(i / 8) * 14 + 6} r="1.5" fill="#38bdf8" />
                  ))}
                </svg>
              </div>

              {/* LEFT: Stylized Job Description Document with Animated Laser Scanner */}
              <div className="relative w-[44%] rounded-2xl bg-white dark:bg-[#111a28] border border-blue-200/90 dark:border-blue-800/80 p-3.5 shadow-lg space-y-2 z-10 overflow-hidden">
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_8px_#3b82f6] anim-scan-laser pointer-events-none" />

                <div className="flex items-center justify-between pb-1.5 border-b border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="4" y="2" width="16" height="20" rx="3" />
                      <line x1="8" y1="7" x2="16" y2="7" />
                      <line x1="8" y1="12" x2="14" y2="12" />
                    </svg>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Job Description</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/90 text-blue-600 dark:text-blue-300 font-mono font-bold">
                    LinkedIn
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-100 leading-tight">
                  Staff Backend Engineer
                </div>

                {/* Extracted Hard Skill Badges with Custom Dots */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-mono font-medium border border-blue-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PostgreSQL
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-mono font-medium border border-blue-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Kubernetes
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-mono font-medium border border-blue-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Go
                  </span>
                </div>
              </div>

              {/* CENTER: Exact Looped Doodle Arrow with Radiating Accent Rays */}
              <div className="flex items-center justify-center shrink-0 z-20 px-1">
                <svg
                  className="w-22 h-16 text-slate-500 dark:text-zinc-400 overflow-visible"
                  viewBox="0 0 110 65"
                  fill="none"
                >
                  <path
                    d="M 12 48 C 22 28, 38 24, 48 30 C 58 36, 56 52, 46 51 C 36 50, 36 34, 48 26 C 60 18, 76 22, 86 38"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 84 27 L 86 38 L 74 34"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M 88 16 L 93 9" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 94 22 L 104 18" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 96 30 L 106 32" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* RIGHT: Tailored High-Score Resume with Holographic Badge */}
              <div className="relative w-[44%] rounded-2xl bg-white dark:bg-[#111a28] border border-emerald-400/90 dark:border-emerald-800/80 p-3.5 shadow-lg space-y-2.5 z-10">
                <div className="flex items-center justify-between pb-1.5 border-b border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Tailored Resume</span>
                  </div>
                  <span className="text-[9px] font-mono font-extrabold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-300/60 dark:border-emerald-700/60 px-2 py-0.5 rounded-full shadow-xs">
                    98% Match
                  </span>
                </div>

                <div className="space-y-1.5 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>All Keywords Injected</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                    <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>STAR Bullets Quantified</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full w-[98%] shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Headline & Copy */}
            <div className="space-y-2 mt-4">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
                <span className="text-blue-600 dark:text-blue-400 block">Zero keyword gaps,</span>
                <span className={isDarkMode ? "text-white" : "text-slate-900"}>tailored for each job post.</span>
              </h3>
              <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>
                Drop in any job posting from LinkedIn or Greenhouse. Our engine cross-references required skills against your experience and injects missing keywords in seconds.
              </p>
            </div>
          </MagneticCard>
        </div>

        {/* ========================================================================= */}
        {/* ROW 2: Card 3 (Orange / Career Q&A), Card 4 (Mint / ATS), Card 5 (Lilac)  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Card 3: Orange / Career Q&A Studio (Rehearse Tough Questions) */}
          <MagneticCard className={`rounded-[32px] border p-7 flex flex-col justify-between cursor-pointer hover:shadow-2xl text-left ${
            isDarkMode
              ? "bg-[#251810] border-orange-900/40 shadow-orange-950/20"
              : "bg-[#fff8f2] border-orange-200/70 shadow-orange-100"
          }`}>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight leading-tight">
                <span className="text-orange-600 dark:text-orange-400 block">Career Q&A Studio,</span>
                <span className={isDarkMode ? "text-white" : "text-slate-900"}>rehearse tough questions.</span>
              </h3>
              <p className={`text-xs font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>
                Stumped by tricky situational or salary negotiation prompts? Generate polished, authentic responses calibrated to your actual career achievements.
              </p>
            </div>

            {/* Career Q&A Interactive Animated Voice Wave & Framework Pills */}
            <div className="relative w-full h-48 flex flex-col justify-center space-y-3 mt-4">
              <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-orange-200 dark:border-orange-800/80 p-3.5 shadow-md space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">Behavioral Q&A</span>
                  </div>

                  <div className="flex items-center gap-0.5 h-4">
                    <div className="w-1 bg-orange-500 rounded-full" style={{ animation: "bentoWaveform 1.1s ease-in-out infinite" }} />
                    <div className="w-1 bg-orange-400 rounded-full" style={{ animation: "bentoWaveform 0.8s ease-in-out infinite 0.2s" }} />
                    <div className="w-1 bg-orange-600 rounded-full" style={{ animation: "bentoWaveform 1.4s ease-in-out infinite 0.4s" }} />
                    <div className="w-1 bg-orange-500 rounded-full" style={{ animation: "bentoWaveform 0.9s ease-in-out infinite 0.1s" }} />
                  </div>
                </div>

                <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 leading-tight">
                  "Tell me about a high-stakes outage you resolved."
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
                <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200/80 dark:border-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center gap-1.5 font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> S: 45K rps spike
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200/80 dark:border-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center gap-1.5 font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> T: Prevent cascade
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200/80 dark:border-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center gap-1.5 font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> A: Shed queue traffic
                </div>
                <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-orange-200/80 dark:border-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center gap-1.5 font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> R: 99.99% uptime
                </div>
              </div>
            </div>
          </MagneticCard>

          {/* Card 4: Mint Green / Engineered to Pass ATS, Built to Impress Recruiters */}
          <MagneticCard className={`rounded-[32px] border p-7 flex flex-col justify-between cursor-pointer hover:shadow-2xl text-left ${
            isDarkMode
              ? "bg-[#0e2417] border-emerald-900/40 shadow-emerald-950/20"
              : "bg-[#f1fbf5] border-emerald-200/70 shadow-emerald-100"
          }`}>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight leading-tight">
                <span className="text-emerald-600 dark:text-emerald-400 block">Tested against Workday,</span>
                <span className={isDarkMode ? "text-white" : "text-slate-900"}>built to reach human eyes.</span>
              </h3>
              <p className={`text-xs font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>
                75% of resumes get silently rejected by ATS bots before human review. Our templates maintain strict parser-compliant single-column hierarchies.
              </p>
            </div>

            {/* Growth Bar Chart & Cheering Green Monster */}
            <div className="relative w-full h-48 flex items-end justify-between px-2 pt-4">
              <div className="relative anim-float">
                <svg className="w-18 h-18" viewBox="0 0 100 100" fill="none">
                  <path d="M35 30 L30 14" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="28" cy="12" r="4" fill="#059669" />
                  <path d="M65 30 L70 14" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="72" cy="12" r="4" fill="#059669" />

                  <ellipse cx="50" cy="60" rx="35" ry="32" fill="#10b981" />
                  <ellipse cx="50" cy="60" rx="30" ry="28" fill="#34d399" />

                  <circle cx="40" cy="54" r="5.5" fill="#064e3b" />
                  <circle cx="60" cy="54" r="5.5" fill="#064e3b" />
                  <circle cx="42" cy="52" r="2" fill="white" />
                  <circle cx="62" cy="52" r="2" fill="white" />

                  <ellipse cx="50" cy="69" rx="7.5" ry="5.5" fill="#064e3b" />
                  <path d="M46 69 Q50 73 54 69" fill="#f87171" />
                </svg>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block text-center mt-1">
                  98% Match
                </span>
              </div>

              {/* Illustrated Conversion Growth Bar Chart with Trending SVG Line */}
              <div className="w-44 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-800 p-3.5 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-400">Response Rate</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300/40">
                    ↗ +42%
                  </span>
                </div>
                <div className="h-16 flex items-end justify-between gap-1.5 pt-2">
                  <div className="w-5 bg-emerald-200 dark:bg-emerald-900/60 rounded-t h-[35%]" />
                  <div className="w-5 bg-emerald-300 dark:bg-emerald-800/70 rounded-t h-[50%]" />
                  <div className="w-5 bg-emerald-400 dark:bg-emerald-700/80 rounded-t h-[65%]" />
                  <div className="w-5 bg-emerald-500 rounded-t h-[80%]" />
                  <div className="w-5 bg-emerald-600 rounded-t h-[100%] shadow-sm" />
                </div>
              </div>
            </div>
          </MagneticCard>

          {/* Card 5: Lilac / One Master Profile, Unlimited Job Targets */}
          <MagneticCard className={`rounded-[32px] border p-7 flex flex-col justify-between cursor-pointer hover:shadow-2xl text-left ${
            isDarkMode
              ? "bg-[#1b152d] border-indigo-900/40 shadow-indigo-950/20"
              : "bg-[#f8f4ff] border-indigo-200/70 shadow-indigo-100"
          }`}>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight leading-tight">
                <span className="text-indigo-600 dark:text-indigo-400 block">One master profile,</span>
                <span className={isDarkMode ? "text-white" : "text-slate-900"}>unlimited job targets.</span>
              </h3>
              <p className={`text-xs font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>
                Stop juggling dozens of mismatched resume files. Store your verified work history in one central profile and generate role-specific versions with one click.
              </p>
            </div>

            {/* Central Master Career Hub with Radiating Connectors to Different Jobs */}
            <div className="relative w-full h-48 flex items-center justify-between px-1 mt-4">
              <div className="w-[45%] rounded-2xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 p-3 shadow-md space-y-1.5 z-10 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Master Profile
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 truncate">
                  Alex Morgan
                </div>
                <div className="h-1.5 w-full bg-indigo-100 dark:bg-indigo-950 rounded" />
                <div className="text-[8px] font-mono font-bold text-emerald-500 flex items-center gap-1 pt-1">
                  <span>● Single Source of Truth</span>
                </div>
              </div>

              <svg className="w-8 h-24 text-indigo-400 dark:text-indigo-600" viewBox="0 0 30 100" fill="none">
                <path d="M2 50 C15 50, 15 15, 28 15" stroke="currentColor" strokeWidth="1.5" className="anim-dash-slow" />
                <path d="M2 50 L28 50" stroke="currentColor" strokeWidth="1.5" className="anim-dash-slow" />
                <path d="M2 50 C15 50, 15 85, 28 85" stroke="currentColor" strokeWidth="1.5" className="anim-dash-slow" />
              </svg>

              <div className="space-y-1.5 w-[42%] z-10">
                <div className="px-2 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200/80 dark:border-indigo-800/80 text-[9px] font-bold text-indigo-600 dark:text-indigo-300 shadow-sm flex items-center justify-between gap-1">
                  <span className="truncate">Full Stack @ Stripe</span>
                  <span className="text-[8px] text-emerald-500 font-mono">98%</span>
                </div>
                <div className="px-2 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200/80 dark:border-indigo-800/80 text-[9px] font-bold text-indigo-600 dark:text-indigo-300 shadow-sm flex items-center justify-between gap-1">
                  <span className="truncate">Cloud SRE @ AWS</span>
                  <span className="text-[8px] text-emerald-500 font-mono">99%</span>
                </div>
                <div className="px-2 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200/80 dark:border-indigo-800/80 text-[9px] font-bold text-indigo-600 dark:text-indigo-300 shadow-sm flex items-center justify-between gap-1">
                  <span className="truncate">AI Eng @ OpenAI</span>
                  <span className="text-[8px] text-emerald-500 font-mono">96%</span>
                </div>
              </div>
            </div>
          </MagneticCard>
        </div>

        {/* ========================================================================= */}
        {/* ROW 3: Card 6 (Cyan / Portfolios & PDF) & Card 7 (Lime / Interview Confidence) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
          {/* Card 6: Cyan / Deploy live portfolios & export vector PDFs (8 Cols) */}
          <MagneticCard className={`lg:col-span-8 rounded-[32px] border p-7 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer hover:shadow-2xl text-left ${
            isDarkMode
              ? "bg-[#0d1e2e] border-cyan-900/40 shadow-cyan-950/20"
              : "bg-[#f0f9ff] border-cyan-200/70 shadow-cyan-100"
          }`}>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
                <span className="text-cyan-600 dark:text-cyan-400 block">Deploy web portfolios</span>
                <span className={isDarkMode ? "text-white" : "text-slate-900"}>& vector PDF resumes.</span>
              </h3>
              <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-600"}`}>
                Launch an interactive developer portfolio on your custom subdomain, or export pixel-perfect, machine-readable vector PDFs ready for immediate submission.
              </p>
            </div>
            {/* Right Side Illustration: Unified Continuous Flow into Flying Paper Airplane */}
            <div className="relative w-full md:w-auto flex items-center justify-between gap-1 overflow-visible">
              {/* Left Pills */}
              <div className="space-y-2 z-10 shrink-0">
                <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-cyan-200 dark:border-cyan-800 text-xs font-bold text-cyan-600 dark:text-cyan-300 shadow-sm flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
                  </svg>
                  <span>Live preview</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-cyan-200 dark:border-cyan-800 text-xs font-bold text-cyan-600 dark:text-cyan-300 shadow-sm flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>Share link</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-cyan-200 dark:border-cyan-800 text-xs font-bold text-cyan-600 dark:text-cyan-300 shadow-sm flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Export PDF</span>
                </div>
              </div>

              {/* Single Unified Continuous SVG Canvas: Lines -> Dot -> Flight Stream -> Hand-Drawn Paper Plane */}
              <svg className="w-56 sm:w-64 h-36 text-cyan-400 dark:text-cyan-600 overflow-visible shrink-0" viewBox="0 0 210 95" fill="none">
                {/* 3 Converging Dashed Paths from Left Pills */}
                <path d="M 0 20 C 26 20, 38 46, 52 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="anim-dash-flow" />
                <path d="M 0 46 L 52 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="anim-dash-flow" />
                <path d="M 0 72 C 26 72, 38 46, 52 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="anim-dash-flow" />

                {/* The Central Merging Node Dot */}
                <circle cx="52" cy="46" r="4.5" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                <circle cx="52" cy="46" r="2.5" fill="#06b6d4" />

                {/* Trajectory Flight Stream Connecting Dot into Airplane Tail */}
                <line x1="56" y1="46" x2="86" y2="46" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="3 3" className="anim-dash-flow" strokeLinecap="round" />

                {/* Flying Hand-Drawn Paper Airplane Vector (Static & Perfectly Anchored) */}
                <g>
                  {/* Soft Horizontal Speed / Motion Blur Lines */}
                  <line x1="72" y1="58" x2="102" y2="58" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                  <line x1="58" y1="67" x2="94" y2="67" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
                  <line x1="74" y1="76" x2="104" y2="76" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

                  {/* Top Wing (Crisp white with clean ink outline) */}
                  <polygon
                    points="88,44 154,26 104,54"
                    fill={isDarkMode ? "#1e293b" : "#ffffff"}
                    stroke={isDarkMode ? "#e2e8f0" : "#0f172a"}
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* Center Fold / Left Wing Fold (Vibrant Blue Fill) */}
                  <polygon
                    points="104,54 154,26 126,78"
                    fill="#2563eb"
                    stroke={isDarkMode ? "#e2e8f0" : "#0f172a"}
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* Right Wing Crease (Crisp White with clean ink outline) */}
                  <polygon
                    points="126,78 154,26 138,52"
                    fill={isDarkMode ? "#334155" : "#f8fafc"}
                    stroke={isDarkMode ? "#e2e8f0" : "#0f172a"}
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* Keel / Rudder Triangle Underbody */}
                  <polygon
                    points="104,54 105,72 114,62"
                    fill={isDarkMode ? "#0f172a" : "#ffffff"}
                    stroke={isDarkMode ? "#e2e8f0" : "#0f172a"}
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* Playful Floating Vector Accents (Matching Reference) */}
                  {/* Purple 4-Point Sparkle Star */}
                  <path
                    d="M 170 12 L 173 17 L 178 20 L 173 23 L 170 28 L 167 23 L 162 20 L 167 17 Z"
                    fill="#a855f7"
                  />

                  {/* Vibrant Solid Blue Accent Dot */}
                  <circle cx="182" cy="40" r="4.5" fill="#2563eb" />

                  {/* Green Hollow Accent Triangle with rounded corners */}
                  <polygon
                    points="168,64 179,70 169,78"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
          </MagneticCard>

          {/* Card 7: Lime Sage / Apply with Total Career Confidence (4 Cols) */}
          <MagneticCard className={`lg:col-span-4 rounded-[32px] border p-7 sm:p-8 flex flex-col justify-between cursor-pointer hover:shadow-2xl text-left ${
            isDarkMode
              ? "bg-[#1e290f] border-lime-900/40 shadow-lime-950/20"
              : "bg-[#f5fce8] border-lime-200/70 shadow-lime-100"
          }`}>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/20 text-lime-800 dark:text-lime-300 text-xs font-semibold font-mono">
                10X FASTER WORKFLOW
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight text-lime-900 dark:text-lime-200">
                Apply with total <br /> career confidence.
              </h3>
              <p className={`text-xs sm:text-sm font-normal leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-slate-700"}`}>
                From initial resume drafting to web portfolios and live AI mock interviews, land your dream offer without the application burnout.
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-lime-600 hover:bg-lime-700 text-white font-bold text-xs shadow-md shadow-lime-600/20 transition-all active:scale-95"
              >
                <span>Explore All Templates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </MagneticCard>
        </div>
      </div>
    </section>
  );
}
