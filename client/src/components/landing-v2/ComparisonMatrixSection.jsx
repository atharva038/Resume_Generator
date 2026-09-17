import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Zap,
  Globe,
  Cpu,
  FileText,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useDarkMode } from "../../context/DarkModeContext";

const COMPARISON_DATA = [
  {
    category: "Parsing & Compatibility",
    feature: "ATS Machine Readability",
    icon: FileCode,
    description: "Tested against Workday, Taleo, Greenhouse & Lever parsers.",
    smartnshine: {
      type: "success",
      title: "100% Tested & Compliant",
      subtitle: "Semantic single-column LaTeX/HTML structure. Zero broken bounding boxes.",
    },
    canva: {
      type: "fail",
      title: "Fails ATS Parsing",
      subtitle: "Flattened SVG/canvas layers turn into unreadable character soup.",
    },
    zety: {
      type: "warning",
      title: "Inconsistent",
      subtitle: "Rigid table markup often causes dropped headers.",
    },
    word: {
      type: "warning",
      title: "Fragile Alignment",
      subtitle: "Margins and fonts easily shift upon PDF export.",
    },
  },
  {
    category: "AI Intelligence",
    feature: "Live Job Description Audit",
    icon: Zap,
    description: "Analyzes target JD to highlight missing skills and keywords.",
    smartnshine: {
      type: "success",
      title: "Real-Time AI Scan",
      subtitle: "Semantic keyword gap match with 1-click optimization.",
    },
    canva: {
      type: "fail",
      title: "Manual Guesswork",
      subtitle: "No JD parsing or keyword suggestions.",
    },
    zety: {
      type: "warning",
      title: "Basic / Generic",
      subtitle: "Fixed pre-written generic phrases.",
    },
    word: {
      type: "fail",
      title: "None",
      subtitle: "No AI or matching capabilities.",
    },
  },
  {
    category: "Web Presence",
    feature: "Live Developer Portfolio",
    icon: Globe,
    description: "Instant responsive website with custom shareable link.",
    smartnshine: {
      type: "success",
      title: "1-Click Hosted Portfolio",
      subtitle: "Deploys an interactive web portfolio from your resume data.",
    },
    canva: {
      type: "fail",
      title: "Static Graphic Only",
      subtitle: "No hosted website or live portfolio.",
    },
    zety: {
      type: "fail",
      title: "PDF Only",
      subtitle: "No live web hosting.",
    },
    word: {
      type: "fail",
      title: "None",
      subtitle: "Local file only.",
    },
  },
  {
    category: "Developer Integrations",
    feature: "One-Click GitHub Sync",
    icon: Cpu,
    description: "Automatically pulls starred repos, languages, and contributions.",
    smartnshine: {
      type: "success",
      title: "Automated GitHub Import",
      subtitle: "Syncs verified repos, tech stacks, and live commits seamlessly.",
    },
    canva: {
      type: "fail",
      title: "Manual Typing",
      subtitle: "Zero developer integrations.",
    },
    zety: {
      type: "fail",
      title: "Manual Entry Only",
      subtitle: "No repository connection.",
    },
    word: {
      type: "fail",
      title: "None",
      subtitle: "Manual entry.",
    },
  },
  {
    category: "Content Optimization",
    feature: "STAR Metric Bullet Rewriter",
    icon: Sparkles,
    description: "Transforms basic task lists into quantified accomplishment statements.",
    smartnshine: {
      type: "success",
      title: "AI Quantified Bullets",
      subtitle: "Turns task lists into impact-driven STAR metrics.",
    },
    canva: {
      type: "fail",
      title: "None",
      subtitle: "No bullet optimization.",
    },
    zety: {
      type: "warning",
      title: "Template Fillers",
      subtitle: "Generic static snippets.",
    },
    word: {
      type: "fail",
      title: "None",
      subtitle: "Standard spellcheck only.",
    },
  },
  {
    category: "Transparency & Trust",
    feature: "Pricing Transparency",
    icon: Lock,
    description: "Straightforward plans with no recurring subscription traps.",
    description: "Zero deceptive recurring billing surprises or hidden trial fees.",
    smartnshine: {
      type: "success",
      title: "Honest, Transparent Pricing",
      subtitle: "Generous Free Tier + clear One-Time and Pro plans. Zero deceptive auto-renewing hidden trial fees.",
    },
    canva: {
      type: "warning",
      title: "Paywalled Assets",
      subtitle: "Requires monthly Pro tier for premium fonts, icons, and high-res vector exports.",
    },
    zety: {
      type: "fail",
      title: "$2.95 Auto-Billing Trap",
      subtitle: "Famous for $2.95 14-day trials that silently auto-bill $29.95+ every 4 weeks.",
    },
    word: {
      type: "warning",
      title: "Office 365 License",
      subtitle: "Requires active recurring Microsoft 365 subscription for desktop apps.",
    },
  },
];

const COMPETITOR_TABS = [
  { id: "canva", name: "Canva", badge: "Graphic Tool" },
  { id: "zety", name: "Zety / Resume.io", badge: "Legacy Builder" },
  { id: "word", name: "MS Word / Docs", badge: "Word Processor" },
];

export default function ComparisonMatrixSection() {
  const { isDarkMode } = useDarkMode();
  const [mobileCompetitor, setMobileCompetitor] = useState("canva");

  const renderStatusBadge = (item, isSmartNShine = false) => {
    if (isSmartNShine) {
      return (
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{item.title}</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            {item.subtitle}
          </p>
        </div>
      );
    }

    if (item.type === "fail") {
      return (
        <div className="flex flex-col items-center text-center space-y-1">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center">
            <X className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-tight">
            {item.title}
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug">
            {item.subtitle}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center text-center space-y-1">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 stroke-[2.5]" />
        </div>
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-tight">
          {item.title}
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug">
          {item.subtitle}
        </span>
      </div>
    );
  };

  return (
    <section
      id="comparison"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-[#060709] text-zinc-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[160px] bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-teal-500/10 dark:from-blue-600/15 dark:via-indigo-600/15 dark:to-cyan-500/15" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
            Engineered for ATS bots,{" "}
            <span className="font-light text-slate-400 dark:text-zinc-500">
              not graphic traps.
            </span>
          </h2>

          <p
            className={`text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            See why ambitious job seekers choose SmartNShine over graphic tools and deceptive legacy resume builders.
          </p>
        </motion.div>

        {/* ================= DESKTOP COMPARISON TABLE ================= */}
        <div className="hidden lg:block">
          <div
            className={`rounded-3xl border shadow-xl overflow-hidden backdrop-blur-md ${
              isDarkMode
                ? "bg-zinc-950/80 border-zinc-800/80 shadow-black/50"
                : "bg-white border-slate-200/90 shadow-slate-200/70"
            }`}
          >
            <table className="w-full text-left border-collapse table-fixed">
              {/* Column Widths */}
              <colgroup>
                <col className="w-[30%]" />
                <col className="w-[31%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
              </colgroup>

              {/* Table Header */}
              <thead>
                <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <th className="p-6 text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 align-bottom">
                    Capabilities
                  </th>

                  {/* SmartNShine Header Column */}
                  <th className="p-6 relative bg-gradient-to-b from-blue-600/10 to-transparent dark:from-blue-600/20 border-x border-blue-500/30 dark:border-blue-500/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                        <ShieldCheck className="w-3 h-3" /> Recommended
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚡</span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                          SmartNShine
                        </h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Career Intelligence Engine
                        </p>
                      </div>
                    </div>
                  </th>

                  {/* Canva Header */}
                  <th className="p-5 text-center align-bottom bg-zinc-50/50 dark:bg-zinc-900/30">
                    <span className="text-lg block mb-1">🎨</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 block">
                      Canva / Figma
                    </span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-normal">
                      Design Tools
                    </span>
                  </th>

                  {/* Zety Header */}
                  <th className="p-5 text-center align-bottom bg-zinc-50/50 dark:bg-zinc-900/30">
                    <span className="text-lg block mb-1">🏢</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 block">
                      Zety / Resume.io
                    </span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-normal">
                      Legacy Builders
                    </span>
                  </th>

                  {/* Word Header */}
                  <th className="p-5 text-center align-bottom bg-zinc-50/50 dark:bg-zinc-900/30">
                    <span className="text-lg block mb-1">📄</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 block">
                      Word / Docs
                    </span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-normal">
                      Word Processors
                    </span>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                {COMPARISON_DATA.map((row, idx) => {
                  const Icon = row.icon;
                  return (
                    <tr
                      key={row.feature}
                      className={`transition-colors duration-150 ${
                        idx % 2 === 0
                          ? isDarkMode
                            ? "bg-transparent"
                            : "bg-slate-50/30"
                          : isDarkMode
                          ? "bg-zinc-900/20"
                          : "bg-white"
                      } hover:bg-blue-50/40 dark:hover:bg-blue-950/15`}
                    >
                      {/* Feature Column */}
                      <td className="p-6 align-top">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              isDarkMode
                                ? "bg-zinc-900 border-zinc-800 text-blue-400"
                                : "bg-white border-slate-200 text-blue-600 shadow-sm"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                              {row.feature}
                            </h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                              {row.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SmartNShine Column */}
                      <td className="p-6 align-top bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-600/10 dark:to-indigo-600/10 border-x border-blue-500/30 dark:border-blue-500/40">
                        {renderStatusBadge(row.smartnshine, true)}
                      </td>

                      {/* Canva Column */}
                      <td className="p-5 align-top">
                        {renderStatusBadge(row.canva)}
                      </td>

                      {/* Zety Column */}
                      <td className="p-5 align-top">
                        {renderStatusBadge(row.zety)}
                      </td>

                      {/* Word Column */}
                      <td className="p-5 align-top">
                        {renderStatusBadge(row.word)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Bottom Footer CTA Strip */}
            <div
              className={`p-6 sm:p-7 flex items-center justify-between border-t ${
                isDarkMode
                  ? "bg-zinc-900/90 border-zinc-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ready to test your resume against real ATS algorithms?
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Build and export your first ATS-optimized resume in under 3 minutes.
                </p>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ================= MOBILE / TABLET VIEW ================= */}
        <div className="block lg:hidden space-y-6">
          {/* Competitor Selector Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase text-zinc-400 font-medium tracking-wider">
              Compare SmartNShine against:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {COMPETITOR_TABS.map((tab) => {
                const isSelected = mobileCompetitor === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMobileCompetitor(tab.id)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? isDarkMode
                          ? "bg-blue-600/20 border-blue-500 text-white shadow-sm"
                          : "bg-blue-50 border-blue-400 text-blue-900 font-bold"
                        : isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-zinc-400"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight">{tab.name}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature Duel Cards */}
          <div className="space-y-3.5">
            {COMPARISON_DATA.map((row) => {
              const Icon = row.icon;
              const competitorInfo = row[mobileCompetitor];

              return (
                <div
                  key={row.feature}
                  className={`p-4 rounded-2xl border backdrop-blur-sm space-y-3 ${
                    isDarkMode
                      ? "bg-zinc-950 border-zinc-800/80"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Card Title */}
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <Icon className="w-4 h-4 text-blue-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {row.feature}
                    </h4>
                  </div>

                  {/* SmartNShine Winner Row */}
                  <div
                    className={`p-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-blue-950/20 border-blue-500/40 text-blue-100"
                        : "bg-blue-50/60 border-blue-200 text-blue-950"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        ⚡ SmartNShine
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        {row.smartnshine.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug">
                      {row.smartnshine.subtitle}
                    </p>
                  </div>

                  {/* Competitor Row */}
                  <div
                    className={`p-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-zinc-900/50 border-zinc-800"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {COMPETITOR_TABS.find((t) => t.id === mobileCompetitor)?.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          competitorInfo.type === "fail"
                            ? "bg-rose-500/10 text-rose-500"
                            : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {competitorInfo.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-snug">
                      {competitorInfo.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <Link
            to="/register"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/20"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
