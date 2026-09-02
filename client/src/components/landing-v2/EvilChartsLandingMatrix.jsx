import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  FileText,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useAuth } from "../../context/AuthContext";
import GlidingMotionCanvas from "./GlidingMotionCanvas";

export default function EvilChartsLandingMatrix() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState("resumes"); // 'resumes' | 'portfolios'
  const [isAutoCycle, setIsAutoCycle] = useState(true);

  // Mouse position state for Specular Light Shader Text
  const [mousePos, setMousePos] = useState({ x: 180, y: 120 });
  const headlineRef = useRef(null);

  // Automated Smooth Gliding Cycle from Resumes -> Portfolios every 10 seconds
  useEffect(() => {
    if (!isAutoCycle) return;
    const interval = setInterval(() => {
      setActiveMode((prev) => (prev === "resumes" ? "portfolios" : "resumes"));
    }, 10000);
    return () => clearInterval(interval);
  }, [isAutoCycle]);

  // Track mouse coordinates for interactive specular light shader
  const handleMouseMove = (e) => {
    if (headlineRef.current) {
      const rect = headlineRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Specular Shader Gradient calculation based on mouse light source
  const specularShaderStyle = {
    backgroundImage: isDarkMode
      ? `radial-gradient(circle 240px at ${mousePos.x}px ${mousePos.y}px, #ffffff 0%, #cbd5e1 35%, #94a3b8 65%, #64748b 100%)`
      : `radial-gradient(circle 240px at ${mousePos.x}px ${mousePos.y}px, #1e293b 0%, #475569 35%, #64748b 65%, #94a3b8 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    transition: "background-position 0.05s ease-out",
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className={`relative w-full min-h-screen font-scoutie overflow-hidden selection:bg-blue-600 selection:text-white transition-colors duration-300 ${
        isDarkMode ? "bg-[#07080c] text-zinc-100" : "bg-[#fbfbfa] text-zinc-900"
      }`}
    >
      {/* 1. Micro Film-Grade Noise Texture Overlay (Tactile Luxury Surface) */}
      <div
        className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Ambient Atmosphere Glows (Subtle, Atmospheric Depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-40 transition-colors duration-500 ${
            isDarkMode ? "bg-blue-600/15" : "bg-blue-400/20"
          }`}
        />
        <div
          className={`absolute bottom-[-10%] right-[10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-35 transition-colors duration-500 ${
            isDarkMode ? "bg-indigo-600/15" : "bg-indigo-300/25"
          }`}
        />
        <div
          className={`absolute top-[40%] right-[35%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-25 transition-colors duration-500 ${
            isDarkMode ? "bg-emerald-600/10" : "bg-emerald-200/40"
          }`}
        />
      </div>

      {/* 3. Left Directional Gradient Fade Mask (Absolute inside Hero) */}
      <div
        className={`absolute inset-y-0 left-0 w-full lg:w-[50%] xl:w-[46%] z-20 pointer-events-none transition-colors duration-300 ${
          isDarkMode
            ? "bg-gradient-to-r from-[#07080c] via-[#07080c] via-80% to-transparent"
            : "bg-gradient-to-r from-[#fbfbfa] via-[#fbfbfa] via-80% to-transparent"
        }`}
      />

      {/* 4. Left Hero Overlay (Natural Absolute Positioning within Hero) */}
      <div className="lg:absolute lg:top-0 lg:left-0 lg:bottom-0 w-full lg:w-[470px] xl:w-[520px] z-30 flex flex-col justify-between p-6 sm:p-10 lg:p-12 pointer-events-none">
        {/* Top: Theme & Prominent Logo Bar */}
        <div className="pointer-events-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <img
              src="/orb-logo.png"
              alt="SmartNShine Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain group-hover:scale-105 transition-transform drop-shadow-md"
            />
            <div className="flex flex-col text-left">
              <span
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-none ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Smart<span className="text-blue-500">N</span>Shine
              </span>
              <span
                className={`text-[11px] font-bold tracking-wider uppercase mt-1 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Career Intelligence OS
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex text-xs font-bold px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-colors"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className={`p-2.5 rounded-2xl border transition-all shadow-xs ${
                isDarkMode
                  ? "bg-zinc-900/90 border-zinc-800 text-amber-400 hover:bg-zinc-800"
                  : "bg-white border-zinc-200 text-amber-500 hover:bg-zinc-100 shadow-sm"
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Center: Punchy Copy & Mode Motion Switcher */}
        <div className="pointer-events-auto my-auto py-8 space-y-6 max-w-md text-left">
          {/* Live Status Pill & Mode Selector */}
          <div className="space-y-2.5">
            <div
              className={`inline-flex items-center p-1.5 rounded-2xl border text-xs shadow-xs transition-colors ${
                isDarkMode
                  ? "bg-zinc-900/90 border-zinc-800"
                  : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              <button
                onClick={() => {
                  setActiveMode("resumes");
                  setIsAutoCycle(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                  activeMode === "resumes"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>ATS Resumes (12+)</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode("portfolios");
                  setIsAutoCycle(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                  activeMode === "portfolios"
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Globe className="w-4 h-4" />
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
            className={`text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight leading-[1.18] ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Resumes & Portfolios. <br />
            <span
              style={specularShaderStyle}
              className="font-extrabold cursor-default transition-all duration-75 select-none"
            >
              Engineered for offers.
            </span>
          </h1>

          {/* Value Proposition Paragraph - Single Clean Color */}
          <p
            className={`text-sm sm:text-base leading-relaxed font-normal ${
              isDarkMode ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            The complete career toolkit for engineers. Build ATS-proof resumes, deploy live developer portfolios, run keyword gap audits, and practice with AI mock interviews.
          </p>

          {/* Action CTAs with Vibrant Color Styling */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={activeMode === "resumes" ? "/templates" : "/portfolio/create"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/25 active:scale-95"
            >
              <span>{activeMode === "resumes" ? "Browse Templates" : "Launch Portfolio"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ats-analyzer"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${
                isDarkMode
                  ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-400 hover:bg-emerald-950/60"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/80 shadow-sm"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Check ATS Score</span>
            </Link>
          </div>
        </div>

        {/* Bottom Footer Link */}
        <div
          className={`pointer-events-auto pt-4 border-t text-xs flex items-center justify-between ${
            isDarkMode
              ? "border-zinc-800/60 text-zinc-500"
              : "border-zinc-200 text-slate-500"
          }`}
        >
          <span>© 2026 SmartNShine</span>
          {user ? (
            <Link
              to="/dashboard"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign In →
            </Link>
          )}
        </div>
      </div>

      {/* 5. Right Side: Physical Continuous Gliding Canvas */}
      <div className="relative z-10 lg:pl-[470px] xl:pl-[520px] p-4 sm:p-6 lg:p-8 flex items-center min-h-screen">
        <div className="w-full max-w-5xl mx-auto">
          <GlidingMotionCanvas activeMode={activeMode} isDarkMode={isDarkMode} />
        </div>
      </div>
    </section>
  );
}
