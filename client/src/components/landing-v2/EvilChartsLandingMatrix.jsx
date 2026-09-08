import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  FileText,
  Sparkles,
  CheckCircle2,
  Rocket
} from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useAuth } from "../../context/AuthContext";
import GlidingMotionCanvas from "./GlidingMotionCanvas";

export default function EvilChartsLandingMatrix() {
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState("resumes"); // 'resumes' | 'portfolios'
  const [isAutoCycle, setIsAutoCycle] = useState(false);

  // Ref for specular text element and animation frame
  const headlineRef = useRef(null);
  const specularSpanRef = useRef(null);
  const rafIdRef = useRef(null);

  // Automated Smooth Gliding Cycle from Resumes -> Portfolios every 10 seconds
  useEffect(() => {
    if (!isAutoCycle) return;
    const interval = setInterval(() => {
      setActiveMode((prev) => (prev === "resumes" ? "portfolios" : "resumes"));
    }, 10000);
    return () => clearInterval(interval);
  }, [isAutoCycle]);

  // Sync initial specular background gradient when dark mode changes
  useEffect(() => {
    if (specularSpanRef.current) {
      specularSpanRef.current.style.backgroundImage = isDarkMode
        ? "radial-gradient(circle 240px at 180px 120px, #ffffff 0%, #fef08a 35%, #f59e0b 65%, #b45309 100%)"
        : "radial-gradient(circle 240px at 180px 120px, #1e293b 0%, #475569 35%, #64748b 65%, #94a3b8 100%)";
    }
  }, [isDarkMode]);

  // Hardware-accelerated mouse tracking without triggering React component re-renders
  const handleMouseMove = (e) => {
    if (!specularSpanRef.current || !headlineRef.current) return;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (!headlineRef.current || !specularSpanRef.current) return;
      const rect = headlineRef.current.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      specularSpanRef.current.style.backgroundImage = isDarkMode
        ? `radial-gradient(circle 240px at ${x}px ${y}px, #ffffff 0%, #fef08a 35%, #f59e0b 65%, #b45309 100%)`
        : `radial-gradient(circle 240px at ${x}px ${y}px, #1e293b 0%, #475569 35%, #64748b 65%, #94a3b8 100%)`;
    });
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <section
      onMouseMove={handleMouseMove}
      className={`relative w-full font-scoutie overflow-hidden selection:bg-amber-500 selection:text-black transition-colors duration-300 ${
        isDarkMode ? "bg-black text-zinc-100" : "bg-[#fbfbfa] text-zinc-900"
      }`}
    >
      {/* 1. Micro Film-Grade Noise Texture Overlay (Tactile Luxury Surface) */}
      <div
        className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Ambient Atmosphere Glows (Warm Gold Radiant Depth like the Doorway Beam) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-40 transition-colors duration-500 ${
            isDarkMode ? "bg-amber-500/15" : "bg-amber-400/20"
          }`}
        />
        <div
          className={`absolute bottom-[-10%] right-[10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-35 transition-colors duration-500 ${
            isDarkMode ? "bg-yellow-600/10" : "bg-amber-300/25"
          }`}
        />
        <div
          className={`absolute top-[40%] right-[35%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-25 transition-colors duration-500 ${
            isDarkMode ? "bg-amber-600/10" : "bg-yellow-200/40"
          }`}
        />
      </div>

      {/* 3. Left Directional Gradient Fade Mask (Desktop only — lg+) */}
      <div
        className={`hidden lg:block absolute inset-y-0 left-0 w-full lg:w-[50%] xl:w-[46%] z-20 pointer-events-none transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-black via-black via-80% to-transparent"
            : "bg-gradient-to-r from-[#fbfbfa] via-[#fbfbfa] via-80% to-transparent"
        }`}
      />

      {/* 4. Left Hero Content — stacked on mobile, overlaid on lg+ */}
      <div className="relative lg:absolute lg:top-0 lg:left-0 lg:bottom-0 w-full lg:w-[470px] xl:w-[520px] z-30 flex flex-col justify-between px-5 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-32 pb-8 lg:pb-0 pointer-events-none">
        <div />

        {/* Center: Punchy Copy & Mode Motion Switcher */}
        <div className="pointer-events-auto mt-2 lg:my-auto py-6 lg:py-8 space-y-5 lg:space-y-6 max-w-md text-left">
          {/* Live Status Pill & Mode Selector */}
          <div className="space-y-2.5">
            <div
              className={`inline-flex items-center p-1 rounded-full text-xs transition-colors ${
                isDarkMode
                  ? "bg-white/[0.06]"
                  : "bg-zinc-200/70"
              }`}
            >
              <button
                onClick={() => {
                  setActiveMode("resumes");
                  setIsAutoCycle(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  activeMode === "resumes"
                    ? isDarkMode
                      ? "bg-zinc-800 text-white shadow-xs"
                      : "bg-white text-zinc-950 shadow-xs"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ATS Resumes (12+)</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode("portfolios");
                  setIsAutoCycle(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  activeMode === "portfolios"
                    ? isDarkMode
                      ? "bg-zinc-800 text-white shadow-xs"
                      : "bg-white text-zinc-950 shadow-xs"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web Portfolios (7+)</span>
              </button>
            </div>

            {isAutoCycle && (
              <div
                className={`flex items-center gap-2 text-xs font-mono font-medium ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-gliding between Resumes ➔ Portfolios</span>
              </div>
            )}
          </div>

          {/* Interactive Specular Light Shader Headline */}
          <h1
            ref={headlineRef}
            className={`text-3xl sm:text-4xl xl:text-[38px] font-extrabold tracking-tight leading-[1.16] ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            The AI Career Platform. <br />
            <span
              ref={specularSpanRef}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transition: "background-position 0.05s ease-out",
              }}
              className="font-extrabold cursor-default transition-all duration-75 select-none"
            >
              Resumes & Portfolios built to win.
            </span>
          </h1>

          {/* Value Proposition Paragraph */}
          <p
            className={`text-sm sm:text-base leading-relaxed font-normal ${
              isDarkMode ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            Build ATS-proof resumes, deploy live developer portfolios, and land top tech offers. Powered by <span className={isDarkMode ? "text-amber-400 font-semibold" : "text-amber-600 font-semibold"}>AI</span>. Built for you.
          </p>

          {/* Action CTAs with Luxury Black & Gold Shade Styling */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 pt-1">
            <Link
              to={activeMode === "resumes" ? "/templates" : "/portfolio/create"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black text-sm font-extrabold transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
            >
              <span>{activeMode === "resumes" ? "Build Your Resume Free" : "Launch Portfolio"}</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[2.5]" />
            </Link>

            <Link
              to="/ats-analyzer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 cursor-pointer border ${
                isDarkMode
                  ? "bg-zinc-900/90 border-amber-500/30 text-amber-200 hover:bg-amber-500/10 hover:text-white shadow-sm"
                  : "bg-zinc-100/90 border-zinc-200 text-zinc-900 hover:bg-zinc-200 hover:text-black shadow-sm"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Check ATS Score</span>
            </Link>
          </div>

          {/* 3 Key Pillars directly from Banner */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.08] dark:border-white/[0.08]">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate font-medium">ATS Optimized</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Rocket className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate font-medium">Career Driven</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Link */}
        <div
          className={`pointer-events-auto pt-4 text-xs flex items-center justify-between ${
            isDarkMode
              ? "text-zinc-500"
              : "text-slate-500"
          }`}
        >
          <span>© 2026 SmartNShine</span>
          {user ? (
            <Link
              to="/dashboard"
              className="font-bold text-zinc-900 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:underline flex items-center gap-1"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="font-bold text-zinc-900 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:underline"
            >
              Sign In →
            </Link>
          )}
        </div>
      </div>

      {/* 5. Right Side: Physical Continuous Gliding Canvas */}
      {/* On mobile: fixed-height preview below the hero text. On lg+: fills the right half behind the text overlay */}
      <div className="relative z-10 lg:pl-[470px] xl:pl-[520px] p-2 sm:p-4 lg:p-6 pt-0 lg:pt-20 flex items-center h-[55vh] sm:h-[60vh] lg:min-h-screen overflow-hidden">
        <div className="w-full max-w-[1700px] mx-auto overflow-hidden">
          <GlidingMotionCanvas activeMode={activeMode} isDarkMode={isDarkMode} />
        </div>
      </div>
    </section>
  );
}
