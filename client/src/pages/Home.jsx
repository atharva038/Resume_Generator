import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SEO from "../components/common/SEO";
import FAQSchema from "../components/common/FAQSchema";
import { FestiveSaleBanner } from "../components/common";
import { getPricing } from "../api/subscription.api";
import {
  Sparkles,
  Upload,
  Brain,
  TrendingUp,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Target,
  UserCheck,
  Globe2,
  Mic,
  Palette,
  ShieldCheck,
  Zap,
  Gift,
  Clock,
  Flame,
} from "lucide-react";

// High-res template IDs for hero fan
const heroTemplates = [
  { id: "impact-pro", rotate: -10, x: -90, y: 15, zIndex: 10 },
  { id: "strategic-leader", rotate: -3, x: -30, y: -5, zIndex: 20 },
  { id: "modern", rotate: 3, x: 30, y: -5, zIndex: 30 },
  { id: "structured-photo", rotate: 10, x: 90, y: 15, zIndex: 40 },
];

const allTemplates = [
  "classic",
  "creative2",
  "github-style",
  "impact-pro",
  "minimal",
  "modern",
  "professional",
  "professional2",
  "strategic-leader",
  "structured-photo",
  "tech",
];

const faqs = [
  {
    question: "Is my resume data safe and private?",
    answer:
      "Absolutely! We use bank-level encryption. Your resume and master career profile data are stored securely and never shared with third parties. You can export or delete your profile anytime.",
  },
  {
    question: "What makes SmartNShine ATS-optimized?",
    answer:
      "Every template is engineered without complex multi-layer floats or illegible fonts that confuse applicant tracking systems. Our ATS diagnostic engine gives you line-by-line feedback, keyword matching, and structure validation.",
  },
  {
    question: "How does the AI enhancement and interview prep work?",
    answer:
      "We combine GPT-4o and Gemini Pro to rewrite achievement bullets, quantify career impact, and generate customized role-specific mock interview questions with expert answers.",
  },
  {
    question: "Can I generate a public portfolio website?",
    answer:
      "Yes! You can turn your master career profile into a live, responsive portfolio website with custom themes and a shareable public URL with just 1 click.",
  },
];

const trustHighlights = [
  "11 ATS-Certified Templates",
  "Master Career Profile Hub",
  "AI Mock Interview Prep",
  "Live Public Portfolios",
  "Deep ATS Compatibility Scans",
  "Export-Ready Vector PDFs",
];

const testimonials = [
  {
    name: "Anshu Nagnurwar",
    role: "Software Engineer",
    company: "Tech Lead",
    text: "The ATS diagnostic engine caught 4 crucial missing keywords before my recruiter screen. Landed the offer in 2 weeks.",
  },
  {
    name: "Anuj Nandgaonkar",
    role: "Product Manager",
    company: "FinTech",
    text: "The AI bullet enhancement preserved my authentic voice while making every single impact quantifiable.",
  },
  {
    name: "Vibhanshu Titirmare",
    role: "Frontend Developer",
    company: "Design Systems",
    text: "Being able to generate both an ATS resume and a live portfolio website from one master profile is game-changing.",
  },
];

const SectionDivider = () => (
  <div
    className="relative z-10 h-10 sm:h-12 bg-white dark:bg-[#09090b] overflow-hidden"
    aria-hidden="true"
  >
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />
  </div>
);

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const scrollContainerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const data = await getPricing();
        if (data.promotion) {
          setPromotion(data.promotion);
        }
      } catch (err) {
        console.error("Failed to load promotion for home page:", err);
      }
    };
    fetchPromo();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <SEO
        title="SmartNShine - AI Resume Builder, ATS Scanner & Career Hub"
        description="Build ATS-crushing resumes, practice AI mock interviews, and launch personal portfolio websites with SmartNShine."
        keywords="resume builder, ATS optimization, AI resume, career profile, portfolio builder, mock interviews"
        url="https://www.smartnshine.app"
      />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 font-sans overflow-x-hidden transition-colors duration-200">
        {/* HERO SECTION */}
        <section className="relative pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Badge / Sale Callout */}
              <div className="flex flex-wrap items-center gap-2">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                  animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Next-Gen Career Optimization Platform</span>
                </motion.div>
              </div>

              {/* Main Headline */}
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-gray-900 dark:text-white"
              >
                Your resume, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  precision engineered.
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-zinc-300 max-w-xl font-normal leading-relaxed"
              >
                Build ATS-passing resumes, extract data from existing PDFs, practice AI mock interview questions, and launch a live portfolio website in minutes.
              </motion.p>

              {/* Festive Raksha Bandhan Sales Ad Card with Dynamic Theme Support & Larger Text */}
              {promotion && promotion.enabled && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                  animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.22 }}
                  className={`relative overflow-hidden rounded-3xl border-2 p-5 sm:p-7 shadow-xl backdrop-blur-xl transition-all duration-300 ${
                    promotion.theme === "gold-luxury"
                      ? "bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 dark:from-amber-950/50 dark:to-zinc-900 border-amber-500/40 shadow-amber-500/10"
                      : promotion.theme === "crimson-festive"
                      ? "bg-gradient-to-br from-rose-500/20 via-red-500/10 to-pink-600/20 dark:from-rose-950/50 dark:to-zinc-900 border-rose-500/40 shadow-rose-500/10"
                      : promotion.theme === "vibrant-indigo"
                      ? "bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-600/20 dark:from-indigo-950/50 dark:to-zinc-900 border-indigo-500/40 shadow-indigo-500/10"
                      : "bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-rose-500/20 dark:from-orange-950/50 dark:to-zinc-900 border-orange-500/40 shadow-orange-500/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎁 🪢</span>
                        <span
                          className={`text-xs sm:text-sm font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-xs ${
                            promotion.theme === "gold-luxury"
                              ? "bg-amber-500/20 text-amber-700 dark:text-yellow-300 border-amber-500/30"
                              : promotion.theme === "crimson-festive"
                              ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30"
                              : promotion.theme === "vibrant-indigo"
                              ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30"
                              : "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30"
                          }`}
                        >
                          {promotion.badgeText || "FESTIVE MEGA DEAL"}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {promotion.title || "Raksha Bandhan Special Sale"}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-zinc-200 font-medium leading-relaxed">
                        {promotion.tagline ||
                          "Get 21-day full access pass with all 11 ATS templates & AI rewriting for"}{" "}
                        <span className="font-black text-orange-600 dark:text-orange-400 text-lg sm:text-xl underline decoration-2 underline-offset-4">
                          ₹{promotion.oneTimePrice ?? 9}
                        </span>{" "}
                        <span className="line-through text-gray-400 text-sm">
                          ₹{promotion.originalOneTimePrice ?? 49}
                        </span>{" "}
                        <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                          (Flat{" "}
                          {Math.round(
                            (1 -
                              (promotion.oneTimePrice ?? 9) /
                                (promotion.originalOneTimePrice ?? 49)) *
                              100
                          )}
                          % OFF)
                        </span>
                      </p>
                    </div>

                    <Link
                      to="/pricing"
                      className={`w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-white font-black text-sm sm:text-base shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                        promotion.theme === "gold-luxury"
                          ? "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-amber-950 font-black shadow-amber-500/30"
                          : promotion.theme === "crimson-festive"
                          ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-rose-500/30"
                          : promotion.theme === "vibrant-indigo"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30"
                          : "bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 shadow-orange-500/30"
                      }`}
                    >
                      <Zap className="w-5 h-5 fill-current" />
                      <span>{promotion.ctaText || "Claim ₹9 Deal"}</span>
                      <ArrowRight className="w-5 h-5 stroke-[3]" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Quick Feature Pills */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-wrap gap-2 pt-1"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
                  <Target className="w-3.5 h-3.5 text-blue-500" />
                  ATS Diagnostic Engine
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
                  <Mic className="w-3.5 h-3.5 text-purple-500" />
                  Career Q&A Studio
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-xs font-semibold border border-gray-200 dark:border-white/5">
                  <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
                  Live Portfolio Builder
                </span>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                animate={reduceMotion ? false : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
              >
                <Link
                  to="/upload"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <span>Start Building Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/templates"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-2xl font-bold text-sm sm:text-base transition-all active:scale-98 border border-gray-200 dark:border-white/5"
                >
                  <Palette className="w-4 h-4 text-gray-500" />
                  <span>Browse 11 Templates</span>
                </Link>
              </motion.div>
            </div>

            {/* Hero Right: 3D Floating Template Fan */}
            <div className="lg:col-span-5 relative h-[360px] sm:h-[460px] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                {heroTemplates.map((t, idx) => (
                  <motion.div
                    key={t.id}
                    className="absolute w-[220px] sm:w-[260px] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white shadow-xl dark:shadow-2xl transition-all duration-500"
                    initial={{
                      rotateZ: t.rotate,
                      x: t.x,
                      y: t.y,
                    }}
                    animate={{
                      rotateZ: t.rotate,
                      x: t.x,
                      y: t.y,
                      zIndex: t.zIndex,
                    }}
                    whileHover={{
                      scale: 1.06,
                      y: t.y - 25,
                      zIndex: 50,
                      rotateZ: 0,
                    }}
                  >
                    <img
                      src={`/templates/${t.id}.png`}
                      alt={`Template ${t.id}`}
                      className="w-full h-auto block object-cover"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* TRUST HIGHLIGHTS */}
        <section className="py-8 bg-gray-50/60 dark:bg-zinc-950/60 border-y border-gray-200/80 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {trustHighlights.map((label, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-white/10 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300 shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* THE 5 CORE PILLARS BENTO GRID */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Complete Career Toolkit</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              One Workspace. Endless Opportunities.
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400">
              Everything you need from your first draft to your final technical interview.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                1. AI Resume Extraction
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                Drop any existing PDF or DOCX file. Our AI instantly parses work history, skills, and education into an editable format.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                2. Bullet Point Rewriter
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                Generate high-impact action verbs, quantifiable metrics, and role-targeted achievements tailored for ATS scoring systems.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                3. ATS Diagnostic Scanner
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                Receive instant compatibility percentages, semantic gap analysis, and missing keyword alerts before applying.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                4. Live Web Portfolios
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                Turn your career milestones into a responsive, public personal website with customizable themes and shareable links.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                5. Career Q&A Studio
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                Generate project-specific behavioral and technical mock interview questions with verified model answers.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                6. Master Profile Sync
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                Store all your verified projects and experience in one central database. Sync changes to multiple resumes with 1 click.
              </p>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* TEMPLATES CAROUSEL */}
        <section id="templates" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                11 ATS-Certified Templates
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                Crafted for readability by both applicant tracking algorithms and senior recruiters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          >
            {allTemplates.map((tid, idx) => (
              <div
                key={`${tid}-${idx}`}
                className="w-[260px] sm:w-[280px] shrink-0 snap-start group"
              >
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white shadow-sm hover:shadow-md transition-all">
                  <img
                    src={`/templates/${tid}.png`}
                    alt={tid}
                    className="w-full h-[360px] object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 backdrop-blur-xs">
                    <Link
                      to={`/editor?template=${tid}`}
                      className="px-5 py-2.5 bg-white text-gray-900 text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 capitalize">
                  {tid.replace("-", " ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* TESTIMONIALS */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Trusted by Job Seekers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
              Hear how candidates landed their target roles with SmartNShine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm flex flex-col justify-between space-y-6"
              >
                <p className="text-sm sm:text-base text-gray-700 dark:text-zinc-300 leading-relaxed font-normal">
                  "{t.text}"
                </p>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    {t.role} {t.company ? `• ${t.company}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* FAQ */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
              Clear answers to common questions.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-zinc-900/90 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 sm:p-6 text-left cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
                      openFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFAQ === idx && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 max-w-xl mx-auto">
              Build your ATS-optimized resume, test it with diagnostic scans, and launch your public portfolio today.
            </p>
            <div className="pt-2">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-98 cursor-pointer"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
