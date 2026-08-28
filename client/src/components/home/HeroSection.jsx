import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import CareerOSControlCenter from "../ui/career-os-control-center";

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Fluid Wavy Cosmic Shader Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Ambient Multi-Layer Radial Glows */}
        <div className="absolute -top-20 left-1/4 w-[600px] h-[500px] rounded-full bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-3xl dark:from-blue-600/25 dark:via-cyan-500/15" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[450px] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute -bottom-10 left-1/3 w-[450px] h-[350px] rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15" />

        {/* High-Tech Grid Matrix Overlay with Soft Mask */}
        <svg className="absolute inset-0 w-full h-full opacity-25 dark:opacity-20 text-blue-500/30 dark:text-cyan-500/30">
          <defs>
            <pattern id="hero-shader-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-shader-grid)" />
        </svg>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Product Badge */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-bold tracking-wide shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>All-in-One AI Career Platform</span>
          </motion.div>

          {/* Main Headline with Refined Editorial Typography */}
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold font-outfit tracking-tight leading-[1.15] sm:leading-[1.12] text-gray-900 dark:text-white"
          >
            From Raw Experience <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 dark:from-[#60a5fa] dark:via-[#818cf8] dark:to-[#22d3ee]">
              to Offer Letter.
            </span>
            <span className="block text-xl sm:text-3xl lg:text-4xl font-semibold text-gray-500 dark:text-zinc-400 font-sans mt-1.5 sm:mt-2">
              Orchestrated seamlessly by AI.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm sm:text-lg text-gray-600 dark:text-zinc-300 max-w-lg font-normal leading-relaxed"
          >
            Build ATS-passing resumes, deploy hosted portfolio websites, and sync your master career profile — in one unified workspace.
          </motion.p>

          {/* Single High-Impact CTA */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-1 sm:pt-2"
          >
            <Link
              to="/upload"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span>Get Started For Free</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Glassmorphic OS Control Center Window */}
        <div className="lg:col-span-6">
          <CareerOSControlCenter />
        </div>
      </div>
    </section>
  );
}
