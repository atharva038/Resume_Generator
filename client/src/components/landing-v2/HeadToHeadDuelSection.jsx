import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  XCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Zap,
  Code2,
  Lock,
  ChevronRight,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";

const DUEL_DATA = {
  canva: {
    id: "canva",
    name: "Canva / Graphic Tools",
    icon: "🎨",
    tagline: "The Graphic Design Trap",
    competitorSubtitle: "Built for social media posts, not ATS hiring algorithms",
    quote:
      "“I spent 4 hours designing a stylish 2-column resume on Canva, applied to 85 jobs, and got 0 callbacks. The recruiter told me their ATS parsed it as blank symbols.”",
    author: "Software Engineer after switching",
    painPoints: [
      {
        title: "Flattens text into unreadable graphic layers",
        desc: "Workday and Taleo scanners parse Canva vector graphics as jumbled text or completely blank documents.",
      },
      {
        title: "Zero Job Description keyword auditing",
        desc: "You have to guess which hard skills and keywords the recruiter's automated filter is searching for.",
      },
      {
        title: "Dead-end static image PDF",
        desc: "Cannot showcase live code repositories, verified project commits, or interactive live web portfolios.",
      },
    ],
    smartnshineWins: [
      {
        title: "100% Machine-Readable LaTeX/HTML",
        desc: "Standardized single-column architecture tested and verified across Workday, Greenhouse, and Lever.",
      },
      {
        title: "Real-Time AI Keyword Match Audit",
        desc: "Instantly paste any target JD to reveal missing high-impact technical keywords and match score.",
      },
      {
        title: "1-Click Live Developer Web Portfolio",
        desc: "Deploys a custom live web portfolio URL with GitHub repository sync to wow hiring managers.",
      },
    ],
  },
  zety: {
    id: "zety",
    name: "Zety / Resume.io",
    icon: "🏢",
    tagline: "The Sneaky Subscription Trap",
    competitorSubtitle: "Legacy builders with aggressive recurring credit card rebilling",
    quote:
      "“They advertised a $2.95 trial to download my resume, and then secretly charged my credit card $29.95 every month without warning.”",
    author: "Job Seeker reviewing legacy builders",
    painPoints: [
      {
        title: "Deceptive $2.95 auto-billing traps",
        desc: "Sneaky 14-day trials that automatically convert to aggressive $29.95+ monthly recurring fees.",
      },
      {
        title: "Rigid table markup drops section headers",
        desc: "Outdated table wrappers often cause modern ATS parsers to misread work history and education.",
      },
      {
        title: "Generic pre-written filler bullet points",
        desc: "Static clichés that look identical to thousands of other applicants without real quantified metrics.",
      },
    ],
    smartnshineWins: [
      {
        title: "100% Transparent, Honest Pricing",
        desc: "Generous free tier + clear straightforward pricing with zero hidden auto-renewal traps.",
      },
      {
        title: "AI Quantified STAR Metric Rewriter",
        desc: "Converts weak task lists into high-impact, outcome-focused accomplishments (Action + Context + Metric).",
      },
      {
        title: "Automated GitHub Repository Import",
        desc: "Syncs your real starred repositories, languages, and contribution activity in one click.",
      },
    ],
  },
  word: {
    id: "word",
    name: "MS Word / Google Docs",
    icon: "📄",
    tagline: "The Fragile Formatting Trap",
    competitorSubtitle: "Traditional word processors with zero hiring intelligence",
    quote:
      "“My resume looked perfect in Word, but when saved as PDF and opened on the recruiter's Mac, the bullet points broke and margins collapsed.”",
    author: "Frontend Candidate after switching",
    painPoints: [
      {
        title: "Fragile formatting shifts across devices",
        desc: "Tabs, tables, and margins easily shift when exported to PDF or opened on different operating systems.",
      },
      {
        title: "Zero ATS score or keyword suggestions",
        desc: "Standard spellcheck provides zero insight into recruiter search criteria or keyword density.",
      },
      {
        title: "Requires paid Office 365 license",
        desc: "Requires active desktop software licenses just to edit and maintain your resume files.",
      },
    ],
    smartnshineWins: [
      {
        title: "Pixel-Perfect Vector PDF Output",
        desc: "High-DPI rendering guaranteed to look identical and parse flawlessly on every machine.",
      },
      {
        title: "Live ATS Scoring & Optimization",
        desc: "Instant score breakdown showing formatting compliance, keyword density, and action verbs.",
      },
      {
        title: "Hosted Online Developer Profile",
        desc: "A shareable live URL to link directly on LinkedIn, GitHub bios, and job application forms.",
      },
    ],
  },
};

export default function HeadToHeadDuelSection() {
  const { isDarkMode } = useDarkMode();
  const [selectedKey, setSelectedKey] = useState("canva");
  const activeDuel = DUEL_DATA[selectedKey];

  return (
    <section
      id="head-to-head"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 border-t ${
        isDarkMode
          ? "bg-[#08090d] border-zinc-800/80 text-zinc-100"
          : "bg-white border-slate-200/80 text-slate-900"
      }`}
    >
      {/* Ambient Gradient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] bg-rose-500/5 dark:bg-rose-500/10" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] bg-blue-500/10 dark:bg-blue-500/15" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium uppercase tracking-wider ${
              isDarkMode
                ? "bg-zinc-900 border-zinc-800 text-indigo-400"
                : "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Duel • Head-to-Head</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Select Your Current Tool.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400">
              See Why People Switch.
            </span>
          </h2>

          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            Click a competitor below to see the hidden roadblocks costing you interview callbacks.
          </p>
        </motion.div>

        {/* Interactive Segmented Selector Tabs */}
        <div className="flex justify-center">
          <div
            className={`inline-flex p-1.5 rounded-2xl border backdrop-blur-xl ${
              isDarkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-slate-100/90 border-slate-200"
            }`}
          >
            {Object.values(DUEL_DATA).map((item) => {
              const isSelected = selectedKey === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedKey(item.id)}
                  className={`relative px-4 sm:px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? isDarkMode
                        ? "text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-900 shadow-sm"
                      : isDarkMode
                      ? "text-zinc-400 hover:text-zinc-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeDuelTab"
                      className={`absolute inset-0 rounded-xl border ${
                        isDarkMode
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400/30"
                          : "bg-white border-slate-300/80 shadow-sm"
                      }`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 text-base">{item.icon}</span>
                  <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Head-to-Head Duel Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDuel.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          >
            {/* Left Card: The Old Way (Competitor) */}
            <div
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-md ${
                isDarkMode
                  ? "bg-gradient-to-b from-rose-950/20 via-zinc-950 to-zinc-950 border-rose-900/30"
                  : "bg-gradient-to-b from-rose-50/70 via-white to-white border-rose-200/80 shadow-lg shadow-rose-500/5"
              }`}
            >
              <div className="space-y-6">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      ❌ The Old Way
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                      <span>{activeDuel.name}</span>
                    </h3>
                  </div>
                  <span className="text-3xl">{activeDuel.icon}</span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  {activeDuel.competitorSubtitle}
                </p>

                {/* Real User Pain Quote */}
                <div
                  className={`p-4 rounded-2xl border relative ${
                    isDarkMode
                      ? "bg-rose-950/30 border-rose-900/40 text-rose-200"
                      : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
                >
                  <Quote className="w-5 h-5 text-rose-500 mb-1 opacity-70" />
                  <p className="text-xs sm:text-sm italic leading-relaxed">{activeDuel.quote}</p>
                  <p className="text-[11px] font-bold mt-2 text-rose-600 dark:text-rose-400">
                    — {activeDuel.author}
                  </p>
                </div>

                {/* Pain Points List */}
                <div className="space-y-3.5 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                    Common Frustrations:
                  </span>
                  {activeDuel.painPoints.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card: The SmartNShine Way (Hero Winner) */}
            <div
              className={`rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-md ${
                isDarkMode
                  ? "bg-gradient-to-b from-blue-950/30 via-indigo-950/20 to-zinc-950 border-blue-500/50 shadow-2xl shadow-blue-500/10"
                  : "bg-gradient-to-b from-blue-50/80 via-white to-white border-blue-500/40 shadow-xl shadow-blue-500/10"
              }`}
            >
              {/* Corner Specular Flare */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/20 via-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                      <Sparkles className="w-3 h-3" /> ⚡ The SmartNShine Way
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      SmartNShine Intelligence
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
                    ⚡
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold">
                  Built from the ground up for 100% ATS parser acceptance & developer portfolios
                </p>

                {/* Proof Guarantee Strip */}
                <div
                  className={`p-4 rounded-2xl border relative ${
                    isDarkMode
                      ? "bg-blue-950/40 border-blue-500/30 text-blue-200"
                      : "bg-blue-50/80 border-blue-200 text-blue-950"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-blue-600 dark:text-blue-300">
                    <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    <span>The SmartNShine Difference</span>
                  </div>
                  <p className="text-xs leading-relaxed mt-1 text-zinc-600 dark:text-zinc-300 font-medium">
                    Every resume is compiled with machine-verified syntax, ensuring Workday, Greenhouse, and
                    Taleo read every single metric without data loss.
                  </p>
                </div>

                {/* Winning Features List */}
                <div className="space-y-3.5 pt-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                    Why Candidates Land 3x More Interviews:
                  </span>
                  {activeDuel.smartnshineWins.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 relative z-10">
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Build ATS-Compliant Resume Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
