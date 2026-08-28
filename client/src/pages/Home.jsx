import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SEO from "../components/common/SEO";
import FAQSchema from "../components/common/FAQSchema";
import { FestiveSaleBanner } from "../components/common";
import { getPricing } from "../api/subscription.api";
import SkewCards from "../components/ui/gradient-card-showcase";
import { TiltCard } from "../components/ui/be-ui-tilt-card";
import TestimonialsSection from "../components/ui/testimonials-3";
import CareerOSControlCenter from "../components/ui/career-os-control-center";
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
  Globe,
  Mic,
  Palette,
  ShieldCheck,
  Zap,
  Gift,
  Clock,
  Copy,
  CheckCircle2,
  Lock,
  RefreshCw,
  AlertTriangle,
  Activity,
  Play,
  Pause,
  Video,
  Star,
  FileText,
  Database,
  Radio,
  Terminal,
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

const corePillars = [
  {
    icon: Upload,
    colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "1. AI Resume Extraction",
    desc: "Drop any existing PDF or DOCX file. Our AI instantly parses work history, skills, and education into an editable format.",
  },
  {
    icon: Brain,
    colorClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    title: "2. Bullet Point Rewriter",
    desc: "Generate high-impact action verbs, quantifiable metrics, and role-targeted achievements tailored for ATS scoring systems.",
  },
  {
    icon: Target,
    colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    title: "3. ATS Diagnostic Scanner",
    desc: "Receive instant compatibility percentages, semantic gap analysis, and missing keyword alerts before applying.",
  },
  {
    icon: Globe2,
    colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    title: "4. Live Web Portfolios",
    desc: "Turn your career milestones into a responsive, public personal website with customizable themes and shareable links.",
  },
  {
    icon: Mic,
    colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    title: "5. Career Q&A Studio",
    desc: "Generate project-specific behavioral and technical mock interview questions with verified model answers.",
  },
  {
    icon: UserCheck,
    colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    title: "6. Master Profile Sync",
    desc: "Store all your verified projects and experience in one central database. Sync changes to multiple resumes with 1 click.",
  },
];

const demoPresets = [
  {
    role: "💻 Software Engineer",
    beforeBullet:
      "Responsible for writing backend APIs in Node.js and fixing various performance and database bugs.",
    beforeScore: 46,
    beforeIssues: [
      "Missing quantifiable business & latency metrics",
      "Passive verb phrase 'Responsible for'",
      "Lacks high-tier caching & architecture keywords",
    ],
    optimizedBullet:
      "Architected high-throughput microservices handling 2.4M daily requests, reducing P99 latency by 38% via Redis caching and PostgreSQL query optimization.",
    optimizedScore: 97,
    actionVerbs: 98,
    metrics: 95,
    keywords: 96,
    extractedKeywords: [
      "Microservices",
      "Redis Caching",
      "PostgreSQL",
      "P99 Latency",
      "2.4M Daily Requests",
    ],
    compliance: [
      { name: "Greenhouse", score: 99 },
      { name: "Workday", score: 96 },
      { name: "Lever", score: 98 },
    ],
    tip: "Strong active verb 'Architected' paired with clear quantification ($2.4M requests, 38% latency). Perfect ATS scoring signature.",
  },
  {
    role: "📊 Product Manager",
    beforeBullet:
      "Managed software releases with developers and worked on improving product user retention.",
    beforeScore: 42,
    beforeIssues: [
      "No revenue or customer activation data",
      "Weak generic verb 'Managed'",
      "Missing cross-functional leadership indicators",
    ],
    optimizedBullet:
      "Spearheaded cross-functional team of 14 engineers to launch B2B SaaS analytics portal, accelerating customer activation by 42% and generating $1.8M ARR.",
    optimizedScore: 95,
    actionVerbs: 96,
    metrics: 97,
    keywords: 94,
    extractedKeywords: [
      "Cross-Functional Leadership",
      "B2B SaaS Portal",
      "Activation Rate +42%",
      "$1.8M ARR",
      "Agile Sprints",
    ],
    compliance: [
      { name: "Greenhouse", score: 97 },
      { name: "Workday", score: 95 },
      { name: "Lever", score: 96 },
    ],
    tip: "Clear commercial growth indicators ($1.8M ARR, 42% activation) with explicit team size management.",
  },
  {
    role: "🤖 AI / ML Engineer",
    beforeBullet:
      "Trained machine learning models on customer data and analyzed dataset performance.",
    beforeScore: 44,
    beforeIssues: [
      "Missing specific model architecture (Transformers/LLMs)",
      "No benchmark accuracy metrics",
      "Lacks infrastructure cost reduction metrics",
    ],
    optimizedBullet:
      "Fine-tuned transformer-based LLM pipeline for real-time customer sentiment classification, lifting prediction accuracy to 94.2% and slashing GPU compute costs by $340K.",
    optimizedScore: 98,
    actionVerbs: 97,
    metrics: 98,
    keywords: 98,
    extractedKeywords: [
      "Transformer LLMs",
      "Fine-Tuning",
      "Accuracy 94.2%",
      "GPU Compute Optimization",
      "$340K Savings",
    ],
    compliance: [
      { name: "Greenhouse", score: 99 },
      { name: "Workday", score: 98 },
      { name: "Lever", score: 99 },
    ],
    tip: "Exceptional metric density (accuracy uplift + compute cost reduction) with high-value technical keywords.",
  },
  {
    role: "📈 Growth Marketing",
    beforeBullet:
      "Handled digital marketing campaigns and managed ad spend on Facebook and Google.",
    beforeScore: 45,
    beforeIssues: [
      "No ROAS or CAC efficiency metrics",
      "Passive language without conversion attribution",
      "Missing budget scale indicator",
    ],
    optimizedBullet:
      "Scaled multi-channel performance marketing spend across Meta & Google Ads with $220K monthly budget, reducing CAC by 31% while driving 4.6x ROAS.",
    optimizedScore: 96,
    actionVerbs: 95,
    metrics: 98,
    keywords: 95,
    extractedKeywords: [
      "Performance Marketing",
      "4.6x ROAS",
      "CAC -31%",
      "Multi-Touch Attribution",
      "Meta & Google Ads",
    ],
    compliance: [
      { name: "Greenhouse", score: 96 },
      { name: "Workday", score: 95 },
      { name: "Lever", score: 97 },
    ],
    tip: "High-value commercial ROI metrics with clear budget scale and customer acquisition efficiency.",
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
  const [demoTab, setDemoTab] = useState("ats"); // "ats" | "templates" | "portfolio"
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoTour, setIsAutoTour] = useState(true);
  const [tourPhase, setTourPhase] = useState("draft"); // "draft" | "scanning" | "optimized"
  const [streamText, setStreamText] = useState("");
  const [displayScore, setDisplayScore] = useState(46);
  const [copiedBullet, setCopiedBullet] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedTemplateAccent, setSelectedTemplateAccent] = useState("indigo");
  const [selectedTemplateLayout, setSelectedTemplateLayout] = useState("single");
  const [selectedDemoTemplate, setSelectedDemoTemplate] = useState("modern");
  const [selectedPortfolioTheme, setSelectedPortfolioTheme] = useState("dark-modern");
  const scrollContainerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Comprehensive Cross-Tab Auto-Play Video Tour Engine
  useEffect(() => {
    if (!isAutoTour) return;

    if (demoTab === "ats") {
      // Phase 1: Show Raw Un-optimized Draft (0s - 2.8s)
      setIsOptimized(false);
      setIsScanning(false);
      setTourPhase("draft");

      // Phase 2: High-Tech Deep Laser Scan & Neural Analysis (2.8s - 6.2s: 3.4s slow cinematic animation)
      const scanTimer = setTimeout(() => {
        setIsScanning(true);
        setTourPhase("scanning");
      }, 2800);

      // Phase 3: AI Transformation Complete (6.2s - 10.8s) - Types optimized bullet & counts up score
      const optimizeTimer = setTimeout(() => {
        setIsScanning(false);
        setIsOptimized(true);
        setTourPhase("optimized");
      }, 6200);

      // Phase 4: Advance to Tab 2: Template Studio (10.8s)
      const toTemplatesTimer = setTimeout(() => {
        setDemoTab("templates");
      }, 10800);

      return () => {
        clearTimeout(scanTimer);
        clearTimeout(optimizeTimer);
        clearTimeout(toTemplatesTimer);
      };
    } else if (demoTab === "templates") {
      // Cycle through template presets and accents
      const accentTimer1 = setTimeout(() => {
        setSelectedTemplateAccent("emerald");
        setSelectedDemoTemplate("impact-pro");
      }, 2000);
      const accentTimer2 = setTimeout(() => {
        setSelectedTemplateAccent("crimson");
        setSelectedDemoTemplate("strategic-leader");
      }, 4200);

      // Advance to Tab 3: Portfolio Sandbox (6.4s)
      const toPortfolioTimer = setTimeout(() => {
        setDemoTab("portfolio");
      }, 6400);

      return () => {
        clearTimeout(accentTimer1);
        clearTimeout(accentTimer2);
        clearTimeout(toPortfolioTimer);
      };
    } else if (demoTab === "portfolio") {
      // Cycle through portfolio themes
      const themeTimer1 = setTimeout(() => setSelectedPortfolioTheme("cyberpunk"), 2200);
      const themeTimer2 = setTimeout(() => setSelectedPortfolioTheme("luxury-gold"), 4400);

      // Return to Tab 1: ATS Scanner with next career track (6.6s)
      const backToAtsTimer = setTimeout(() => {
        setSelectedPreset((prev) => (prev + 1) % demoPresets.length);
        setSelectedTemplateAccent("indigo");
        setSelectedDemoTemplate("modern");
        setSelectedPortfolioTheme("dark-modern");
        setDemoTab("ats");
      }, 6600);

      return () => {
        clearTimeout(themeTimer1);
        clearTimeout(themeTimer2);
        clearTimeout(backToAtsTimer);
      };
    }
  }, [isAutoTour, demoTab, selectedPreset]);

  // Typewriter Streaming Engine & Smooth Number Counter
  useEffect(() => {
    const targetText = isOptimized
      ? demoPresets[selectedPreset].optimizedBullet
      : demoPresets[selectedPreset].beforeBullet;
    const targetScore = isOptimized
      ? demoPresets[selectedPreset].optimizedScore
      : demoPresets[selectedPreset].beforeScore;

    let charIndex = 0;
    setStreamText("");

    const typeInterval = setInterval(() => {
      if (charIndex <= targetText.length) {
        setStreamText(targetText.slice(0, charIndex));
        charIndex += 2; // Smooth 2-character chunks for natural flow
      } else {
        clearInterval(typeInterval);
      }
    }, 22);

    // Smooth score interpolation
    let startScore = displayScore;
    let scoreStep = 0;
    const scoreInterval = setInterval(() => {
      scoreStep++;
      const progress = Math.min(scoreStep / 22, 1);
      const curr = Math.round(startScore + (targetScore - startScore) * progress);
      setDisplayScore(curr);
      if (progress >= 1) clearInterval(scoreInterval);
    }, 30);

    return () => {
      clearInterval(typeInterval);
      clearInterval(scoreInterval);
    };
  }, [isOptimized, selectedPreset]);

  const handleTriggerAIOptimize = () => {
    setIsScanning(true);
    setTourPhase("scanning");
    setTimeout(() => {
      setIsScanning(false);
      setIsOptimized(true);
      setTourPhase("optimized");
    }, 600);
  };

  const handleCopyOptimizedText = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedBullet(true);
    setTimeout(() => setCopiedBullet(false), 2000);
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

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
        {/* HERO SECTION: UNIFIED CAREER CONTROL CENTER (CONCEPT 1) */}
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

        <SectionDivider />

        {/* NEXT-LEVEL INTERACTIVE CAREER STUDIO WORKBENCH */}
        <section id="interactive-studio" className="py-10 sm:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-10">
          <div className="text-center space-y-2 sm:space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs font-black uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>Interactive Career OS Workbench</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Test Drive the ATS Diagnostic Engine
            </h2>
            <p className="text-xs sm:text-base text-gray-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto">
              Experience real-time AI bullet transformation, ATS parser matrix diagnostics, dynamic template styling, and live portfolio sandboxing.
            </p>
          </div>

          {/* MacOS-Style Studio Device Container */}
          <div className="rounded-2xl sm:rounded-3xl border border-gray-200/90 dark:border-white/10 bg-white/90 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-xl sm:shadow-2xl overflow-hidden">
            {/* Top Studio macOS Title Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-4 bg-gray-100/80 dark:bg-zinc-900/90 border-b border-gray-200/80 dark:border-white/10">
              {/* Traffic light window controls */}
              <div className="hidden sm:flex items-center gap-2 self-start sm:self-auto">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block shadow-2xs" />
                <span className="ml-2 text-xs font-mono font-bold text-gray-500 dark:text-zinc-400">
                  smartnshine_studio_v4.8.tsx
                </span>
              </div>

              {/* Center Segmented Tool Tabs */}
              <div className="flex items-center p-0.5 sm:p-1 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-zinc-800/90 border border-gray-200/80 dark:border-white/10 shadow-xs w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => {
                    setDemoTab("ats");
                  }}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 flex-1 sm:flex-initial px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                    demoTab === "ats"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>ATS HUD</span>
                </button>

                <button
                  onClick={() => {
                    setDemoTab("templates");
                    setIsAutoTour(false);
                  }}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 flex-1 sm:flex-initial px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                    demoTab === "templates"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Templates</span>
                </button>

                <button
                  onClick={() => {
                    setDemoTab("portfolio");
                    setIsAutoTour(false);
                  }}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 flex-1 sm:flex-initial px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer ${
                    demoTab === "portfolio"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Globe2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Portfolio</span>
                </button>
              </div>

              {/* Auto-Play Tour Video Player Controls */}
              <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsAutoTour(!isAutoTour)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black transition-all cursor-pointer border ${
                    isAutoTour
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 shadow-xs"
                      : "bg-gray-200/80 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300"
                  }`}
                >
                  {isAutoTour ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      <span>Tour Active</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                      <span>Auto-Tour</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* TAB 1: NEXT-GEN ATS BEFORE & AFTER TRANSFORMATION HUD */}
            {demoTab === "ats" && (
              <div className="p-3.5 sm:p-6 lg:p-10 space-y-4 sm:space-y-8 animate-fadeIn">
                {/* Auto-Play Studio Module Progress Bar */}
                {isAutoTour && (
                  <div className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/15">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-gray-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                        <Video className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse shrink-0" />
                        <span className="hidden sm:inline">Interactive Studio Auto-Tour:</span>
                        <strong className="text-gray-900 dark:text-white truncate">
                          Module 1: ATS HUD ({demoPresets[selectedPreset].role})
                        </strong>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[10px] shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md font-black uppercase text-[9px] sm:text-[10px] ${
                            tourPhase === "draft"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30"
                              : tourPhase === "scanning"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 animate-pulse"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                          }`}
                        >
                          {tourPhase === "draft"
                            ? "Raw Draft"
                            : tourPhase === "scanning"
                            ? "AI Scanning..."
                            : "ATS Optimized"}
                        </span>
                      </div>
                    </div>
                    {/* 3 Studio Modules Timeline */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-0.5">
                      <div className="h-1 sm:h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-blue-600 w-full animate-pulse" />
                      </div>
                      <div className="h-1 sm:h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-gray-300 dark:bg-zinc-700 w-0" />
                      </div>
                      <div className="h-1 sm:h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-gray-300 dark:bg-zinc-700 w-0" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Track Selector Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-6 border-b border-gray-100 dark:border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] sm:text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                      Career Track
                    </span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
                      {demoPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedPreset(idx);
                            setIsAutoTour(false);
                            setIsOptimized(true);
                          }}
                          className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                            selectedPreset === idx
                              ? "bg-blue-600 text-white shadow-xs scale-105"
                              : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {preset.role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Before / After Interactive Switcher */}
                  <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800/90 p-1 rounded-xl border border-gray-200 dark:border-white/10 self-start sm:self-auto">
                    <button
                      onClick={() => {
                        setIsOptimized(false);
                        setIsAutoTour(false);
                      }}
                      className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                        !isOptimized
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-black"
                          : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      Draft (44)
                    </button>
                    <button
                      onClick={() => {
                        setIsOptimized(true);
                        setIsAutoTour(false);
                      }}
                      className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                        isOptimized
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-black"
                          : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      Optimized (97)
                    </button>
                  </div>
                </div>

                {/* Main Interactive Workbench Split: Left Sandbox, Right Score HUD */}
                <div className="grid lg:grid-cols-12 gap-4 sm:gap-8 items-stretch">
                  {/* Left: Interactive Bullet Sandbox */}
                  <div className="lg:col-span-7 p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gray-50/80 dark:bg-zinc-900/80 border border-gray-200/90 dark:border-white/10 space-y-3 sm:space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                          Live AI Bullet Transformation
                        </span>
                      </div>
                      <span
                        className={`text-[9px] sm:text-[11px] font-black uppercase px-2 py-0.5 rounded-md sm:rounded-lg ${
                          isOptimized
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {isOptimized ? "ATS Optimized" : "Needs Rewrite"}
                      </span>
                    </div>

                    {/* Live Streaming Typewriter Bullet Display */}
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-950 border border-gray-200/80 dark:border-white/5 font-mono text-xs sm:text-sm leading-relaxed text-gray-800 dark:text-zinc-200 min-h-[85px] sm:min-h-[115px] flex items-center relative">
                      <p className="font-sans font-medium">
                        {isOptimized ? (
                          <>
                            {streamText.split(" ").length > 0 && (
                              <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md mr-1">
                                {streamText.split(" ")[0]}
                              </span>
                            )}
                            {streamText.split(" ").slice(1).join(" ")}
                          </>
                        ) : (
                          <span className="text-gray-500 dark:text-zinc-400 italic">
                            "{streamText}"
                          </span>
                        )}
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 0.6 }}
                          className="inline-block w-1.5 h-3.5 sm:w-2 sm:h-4 ml-1 bg-blue-500 align-middle rounded-xs"
                        />
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-gray-200/80 dark:border-white/5">
                      {!isOptimized ? (
                        <button
                          onClick={handleTriggerAIOptimize}
                          disabled={isScanning}
                          className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{isScanning ? "Scanning..." : "⚡ Run AI Optimize"}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleCopyOptimizedText(
                                demoPresets[selectedPreset].optimizedBullet
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg sm:rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs shadow-xs cursor-pointer"
                          >
                            {copiedBullet ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={handleTriggerAIOptimize}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold text-xs cursor-pointer"
                          >
                            <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
                            <span>Re-Scan</span>
                          </button>
                        </div>
                      )}

                      <Link
                        to="/ats-analyzer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span>Full Scanner</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Right: Diagnostic HUD Terminal & Score Gauge */}
                  <div className="lg:col-span-5 p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-zinc-900/90 dark:to-zinc-900/50 border border-gray-200/90 dark:border-white/10 space-y-3 sm:space-y-6">
                    {/* Circular Score Gauge & Top Badge */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 sm:space-y-1">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Diagnostic Rating
                        </span>
                        <h4 className="text-sm sm:text-xl font-black text-gray-900 dark:text-white">
                          {displayScore >= 90 ? "Guaranteed Top 1% Match" : "High Risk of Rejection"}
                        </h4>
                      </div>

                      {/* Score Gauge */}
                      <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200 dark:text-zinc-700"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={`transition-all duration-300 ${
                              displayScore >= 85 ? "text-emerald-500" : "text-rose-500"
                            }`}
                            strokeDasharray={`${displayScore}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-sm sm:text-lg font-black text-gray-900 dark:text-white leading-none">
                            {displayScore}
                          </span>
                          <span className="text-[8px] sm:text-[9px] uppercase font-bold text-gray-500 dark:text-zinc-400">
                            / 100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE 11-TEMPLATE LIVE STUDIO CANVAS */}
            {demoTab === "templates" && (
              <div className="p-3.5 sm:p-6 lg:p-10 space-y-4 sm:space-y-8 animate-fadeIn">
                {/* Auto-Play Studio Module Progress Bar */}
                {isAutoTour && (
                  <div className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/15">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-gray-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                        <Video className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse shrink-0" />
                        <span className="hidden sm:inline">Interactive Studio:</span>
                        <strong className="text-gray-900 dark:text-white capitalize truncate">
                          Module 2: 11-Templates ({selectedDemoTemplate.replace("-", " ")})
                        </strong>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                      <div className="h-1 sm:h-1.5 rounded-full bg-blue-600" />
                      <div className="h-1 sm:h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-blue-500 w-full animate-pulse" />
                      </div>
                      <div className="h-1 sm:h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-gray-300 dark:bg-zinc-700 w-0" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Template Studio Controls Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/10">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs font-black uppercase text-gray-500 dark:text-zinc-400">
                      Color:
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {[
                        { id: "indigo", hex: "#4f46e5", bgClass: "bg-indigo-600", label: "Indigo" },
                        { id: "emerald", hex: "#059669", bgClass: "bg-emerald-600", label: "Emerald" },
                        { id: "crimson", hex: "#dc2626", bgClass: "bg-red-600", label: "Red / Crimson" },
                        { id: "gold", hex: "#d97706", bgClass: "bg-amber-600", label: "Gold" },
                        { id: "slate", hex: "#334155", bgClass: "bg-slate-700", label: "Slate" },
                      ].map((c) => (
                        <button
                          key={c.id}
                          title={c.label}
                          onClick={() => {
                            setSelectedTemplateAccent(c.id);
                            setIsAutoTour(false);
                          }}
                          className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full ${c.bgClass} transition-all cursor-pointer shadow-xs ${
                            selectedTemplateAccent === c.id
                              ? "ring-2 ring-offset-1 ring-blue-500 scale-110"
                              : "opacity-75 hover:opacity-100 hover:scale-105"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs font-black uppercase text-gray-500 dark:text-zinc-400">
                      Layout:
                    </span>
                    <div className="flex p-0.5 rounded-lg sm:rounded-xl bg-gray-200 dark:bg-zinc-800">
                      <button
                        onClick={() => {
                          setSelectedTemplateLayout("single");
                          setIsAutoTour(false);
                        }}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                          selectedTemplateLayout === "single"
                            ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs font-black"
                            : "text-gray-600 dark:text-zinc-400 hover:text-gray-900"
                        }`}
                      >
                        Single (Max ATS)
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTemplateLayout("dual");
                          setIsAutoTour(false);
                        }}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                          selectedTemplateLayout === "dual"
                            ? "bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs font-black"
                            : "text-gray-600 dark:text-zinc-400 hover:text-gray-900"
                        }`}
                      >
                        Dual (Executive)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Studio Workspace: Details on Left, Live Canvas on Right */}
                <div className="grid lg:grid-cols-12 gap-4 sm:gap-8 items-center">
                  <div className="lg:col-span-5 space-y-2.5 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                        Template Profile
                      </span>
                      <h3 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white capitalize">
                        {selectedDemoTemplate.replace("-", " ")} Template
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                        Engineered specifically for engineering, product, and leadership roles. Fully compliant with 2026 ATS standards.
                      </p>
                    </div>

                    <div className="space-y-1 sm:space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>100% Machine-Readable Vector Flow</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Dynamic Page-Break & Font Scaler</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Auto-Formatted Section Hierarchy</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link
                        to={`/editor?template=${selectedDemoTemplate}`}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:scale-105 transition-all"
                      >
                        <span>Launch in Resume Studio</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Real Interactive Live Document Canvas */}
                  <div className="lg:col-span-7 flex flex-col items-center space-y-4">
                    {/* Live Resume Sheet Canvas */}
                    <div
                      className="w-full max-w-[400px] sm:max-w-[440px] rounded-2xl bg-white text-gray-900 p-6 sm:p-7 shadow-2xl border border-gray-200/90 text-left font-sans text-xs space-y-4 select-none transition-all duration-300"
                      style={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      {/* Document Header */}
                      <div
                        className="border-b pb-3"
                        style={{
                          borderColor:
                            selectedTemplateAccent === "crimson"
                              ? "#dc262640"
                              : selectedTemplateAccent === "emerald"
                              ? "#05966940"
                              : selectedTemplateAccent === "gold"
                              ? "#d9770640"
                              : selectedTemplateAccent === "slate"
                              ? "#33415540"
                              : "#4f46e540",
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base sm:text-lg font-black tracking-tight text-gray-900 uppercase">
                              ATHARVA JOSHI
                            </h4>
                            <p
                              className="text-[11px] font-black"
                              style={{
                                color:
                                  selectedTemplateAccent === "crimson"
                                    ? "#dc2626"
                                    : selectedTemplateAccent === "emerald"
                                    ? "#059669"
                                    : selectedTemplateAccent === "gold"
                                    ? "#d97706"
                                    : selectedTemplateAccent === "slate"
                                    ? "#334155"
                                    : "#4f46e5",
                              }}
                            >
                              Lead Full-Stack AI Systems Architect
                            </p>
                          </div>
                          <span
                            className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white shadow-2xs"
                            style={{
                              backgroundColor:
                                selectedTemplateAccent === "crimson"
                                  ? "#dc2626"
                                  : selectedTemplateAccent === "emerald"
                                  ? "#059669"
                                  : selectedTemplateAccent === "gold"
                                  ? "#d97706"
                                  : selectedTemplateAccent === "slate"
                                  ? "#334155"
                                  : "#4f46e5",
                            }}
                          >
                            ATS 100%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 font-medium pt-1.5">
                          <span>atharva@example.com</span>
                          <span>•</span>
                          <span>+1 (555) 019-2834</span>
                          <span>•</span>
                          <span>San Francisco, CA</span>
                        </div>
                      </div>

                      {/* Single or Dual Column Content */}
                      {selectedTemplateLayout === "single" ? (
                        <div className="space-y-3">
                          {/* Experience Section */}
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className="w-1.5 h-3.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    selectedTemplateAccent === "crimson"
                                      ? "#dc2626"
                                      : selectedTemplateAccent === "emerald"
                                      ? "#059669"
                                      : selectedTemplateAccent === "gold"
                                      ? "#d97706"
                                      : selectedTemplateAccent === "slate"
                                      ? "#334155"
                                      : "#4f46e5",
                                }}
                              />
                              <h5
                                className="text-[11px] font-black uppercase tracking-wider"
                                style={{
                                  color:
                                    selectedTemplateAccent === "crimson"
                                      ? "#dc2626"
                                      : selectedTemplateAccent === "emerald"
                                      ? "#059669"
                                      : selectedTemplateAccent === "gold"
                                      ? "#d97706"
                                      : selectedTemplateAccent === "slate"
                                      ? "#334155"
                                      : "#4f46e5",
                                }}
                              >
                                Work Experience
                              </h5>
                              <div
                                className="flex-1 h-px"
                                style={{
                                  backgroundColor:
                                    selectedTemplateAccent === "crimson"
                                      ? "#dc262630"
                                      : selectedTemplateAccent === "emerald"
                                      ? "#05966930"
                                      : selectedTemplateAccent === "gold"
                                      ? "#d9770630"
                                      : selectedTemplateAccent === "slate"
                                      ? "#33415530"
                                      : "#4f46e530",
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between font-bold text-[10.5px]">
                                <span>TechCorp AI — Staff Systems Engineer</span>
                                <span className="text-gray-500 font-normal">2023 - Present</span>
                              </div>
                              <p className="text-[9.5px] text-gray-600 leading-relaxed">
                                • Architected distributed LLM inference pipeline handling 2.4M daily requests with 38% latency reduction.
                              </p>
                              <p className="text-[9.5px] text-gray-600 leading-relaxed">
                                • Spearheaded PostgreSQL query optimization, saving $140K/yr in AWS compute overhead.
                              </p>
                            </div>
                          </div>

                          {/* Skills Section */}
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className="w-1.5 h-3.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    selectedTemplateAccent === "crimson"
                                      ? "#dc2626"
                                      : selectedTemplateAccent === "emerald"
                                      ? "#059669"
                                      : selectedTemplateAccent === "gold"
                                      ? "#d97706"
                                      : selectedTemplateAccent === "slate"
                                      ? "#334155"
                                      : "#4f46e5",
                                }}
                              />
                              <h5
                                className="text-[11px] font-black uppercase tracking-wider"
                                style={{
                                  color:
                                    selectedTemplateAccent === "crimson"
                                      ? "#dc2626"
                                      : selectedTemplateAccent === "emerald"
                                      ? "#059669"
                                      : selectedTemplateAccent === "gold"
                                      ? "#d97706"
                                      : selectedTemplateAccent === "slate"
                                      ? "#334155"
                                      : "#4f46e5",
                                }}
                              >
                                Core Technical Skills
                              </h5>
                              <div
                                className="flex-1 h-px"
                                style={{
                                  backgroundColor:
                                    selectedTemplateAccent === "crimson"
                                      ? "#dc262630"
                                      : selectedTemplateAccent === "emerald"
                                      ? "#05966930"
                                      : selectedTemplateAccent === "gold"
                                      ? "#d9770630"
                                      : selectedTemplateAccent === "slate"
                                      ? "#33415530"
                                      : "#4f46e530",
                                }}
                              />
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {["React 19", "Node.js", "Python", "GPT-4o", "PostgreSQL", "Redis", "Docker", "AWS"].map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded text-[9.5px] font-bold"
                                  style={{
                                    backgroundColor:
                                      selectedTemplateAccent === "crimson"
                                        ? "#dc262615"
                                        : selectedTemplateAccent === "emerald"
                                        ? "#05966915"
                                        : selectedTemplateAccent === "gold"
                                        ? "#d9770615"
                                        : selectedTemplateAccent === "slate"
                                        ? "#33415515"
                                        : "#4f46e515",
                                    color:
                                      selectedTemplateAccent === "crimson"
                                        ? "#dc2626"
                                        : selectedTemplateAccent === "emerald"
                                        ? "#059669"
                                        : selectedTemplateAccent === "gold"
                                        ? "#d97706"
                                        : selectedTemplateAccent === "slate"
                                        ? "#334155"
                                        : "#4f46e5",
                                    border: `1px solid ${
                                      selectedTemplateAccent === "crimson"
                                        ? "#dc262630"
                                        : selectedTemplateAccent === "emerald"
                                        ? "#05966930"
                                        : selectedTemplateAccent === "gold"
                                        ? "#d9770630"
                                        : selectedTemplateAccent === "slate"
                                        ? "#33415530"
                                        : "#4f46e530"
                                    }`,
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-12 gap-3">
                          {/* Left Sidebar */}
                          <div
                            className="col-span-4 p-2.5 rounded-xl space-y-2.5"
                            style={{
                              backgroundColor:
                                selectedTemplateAccent === "crimson"
                                  ? "#dc262608"
                                  : selectedTemplateAccent === "emerald"
                                  ? "#05966908"
                                  : selectedTemplateAccent === "gold"
                                  ? "#d9770608"
                                  : selectedTemplateAccent === "slate"
                                  ? "#33415508"
                                  : "#4f46e508",
                              border: `1px solid ${
                                selectedTemplateAccent === "crimson"
                                  ? "#dc262620"
                                  : selectedTemplateAccent === "emerald"
                                  ? "#05966920"
                                  : selectedTemplateAccent === "gold"
                                  ? "#d9770620"
                                  : selectedTemplateAccent === "slate"
                                  ? "#33415520"
                                  : "#4f46e520"
                              }`,
                            }}
                          >
                            <div>
                              <h6
                                className="text-[9.5px] font-black uppercase tracking-wider mb-1"
                                style={{
                                  color:
                                    selectedTemplateAccent === "crimson"
                                      ? "#dc2626"
                                      : selectedTemplateAccent === "emerald"
                                      ? "#059669"
                                      : selectedTemplateAccent === "gold"
                                      ? "#d97706"
                                      : selectedTemplateAccent === "slate"
                                      ? "#334155"
                                      : "#4f46e5",
                                }}
                              >
                                Key Skills
                              </h6>
                              <div className="flex flex-wrap gap-1">
                                {["React", "Node.js", "Python", "LLMs", "PostgreSQL"].map((s, i) => (
                                  <span key={i} className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-white border border-gray-200">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h6
                                className="text-[9.5px] font-black uppercase tracking-wider mb-0.5"
                                style={{
                                  color:
                                    selectedTemplateAccent === "crimson"
                                      ? "#dc2626"
                                      : selectedTemplateAccent === "emerald"
                                      ? "#059669"
                                      : selectedTemplateAccent === "gold"
                                      ? "#d97706"
                                      : selectedTemplateAccent === "slate"
                                      ? "#334155"
                                      : "#4f46e5",
                                }}
                              >
                                Education
                              </h6>
                              <p className="text-[8.5px] font-bold">B.S. Computer Science</p>
                              <p className="text-[8px] text-gray-500">UC Berkeley (3.9 GPA)</p>
                            </div>
                          </div>

                          {/* Right Main Body */}
                          <div className="col-span-8 space-y-2">
                            <h6
                              className="text-[9.5px] font-black uppercase tracking-wider"
                              style={{
                                color:
                                  selectedTemplateAccent === "crimson"
                                    ? "#dc2626"
                                    : selectedTemplateAccent === "emerald"
                                    ? "#059669"
                                    : selectedTemplateAccent === "gold"
                                    ? "#d97706"
                                    : selectedTemplateAccent === "slate"
                                    ? "#334155"
                                    : "#4f46e5",
                              }}
                            >
                              Experience
                            </h6>
                            <div className="space-y-1">
                              <div className="flex justify-between font-bold text-[9.5px]">
                                <span>TechCorp AI — Lead</span>
                                <span className="text-gray-500 font-normal">2023-Pres</span>
                              </div>
                              <p className="text-[8.5px] text-gray-600 leading-relaxed">
                                • Architected distributed inference pipeline handling 2.4M requests with Redis & PostgreSQL.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Template Switcher Pills */}
                    <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                      {allTemplates.slice(0, 6).map((tid) => (
                        <button
                          key={tid}
                          onClick={() => {
                            setSelectedDemoTemplate(tid);
                            setIsAutoTour(false);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                            selectedDemoTemplate === tid
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                              : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200"
                          }`}
                        >
                          {tid.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE PORTFOLIO MINI-BROWSER SANDBOX */}
            {demoTab === "portfolio" && (
              <div className="p-6 sm:p-10 space-y-8 animate-fadeIn">
                {/* Auto-Play Studio Module Progress Bar */}
                {isAutoTour && (
                  <div className="space-y-2 p-3.5 rounded-2xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/15">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Video className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                        <span>Interactive Studio Auto-Tour:</span>
                        <strong className="text-gray-900 dark:text-white capitalize">
                          Module 3: Hosted Portfolio Sandbox ({selectedPortfolioTheme.replace("-", " ")})
                        </strong>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] bg-blue-500/15 text-blue-500">
                        Live Theme Simulator (Next: ATS Diagnostic HUD)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="h-1.5 rounded-full bg-blue-600" />
                      <div className="h-1.5 rounded-full bg-blue-600" />
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-blue-500 w-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mini Browser URL Bar */}
                <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-700 dark:text-zinc-300 flex-1 overflow-hidden">
                    <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">https://smartnshine.app/p/atharva-joshi</span>
                  </div>

                  <button
                    onClick={() => handleCopyUrl("https://smartnshine.app/p/atharva-joshi")}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-xs font-bold text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-white/10 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                        1-Click Live Website
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                        Turn Your Career into a Public Website
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                        Publish your own hosted portfolio with custom themes, interactive project showcases, verified credentials, and recruiter contact triggers.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Custom Hosted Domain URL</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Interactive Project Modals & Demos</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Recruiter "Hire Me" Direct Triggers</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link
                        to="/portfolio"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:scale-105 transition-all"
                      >
                        <span>Build My Portfolio Website</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Simulated Portfolio Card */}
                  <div className="lg:col-span-7 flex flex-col items-center space-y-4">
                    {/* Theme Buttons */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        { id: "dark-modern", label: "🌙 Dark Modern" },
                        { id: "cyberpunk", label: "⚡ Cyberpunk Neon" },
                        { id: "minimalist", label: "✨ Minimalist Clean" },
                        { id: "luxury-gold", label: "👑 Luxury Gold" },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setSelectedPortfolioTheme(theme.id);
                            setIsAutoTour(false);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                            selectedPortfolioTheme === theme.id
                              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105"
                              : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {theme.label}
                        </button>
                      ))}
                    </div>

                    <div
                      className={`w-full max-w-[420px] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 transition-all duration-300 ${
                        selectedPortfolioTheme === "cyberpunk"
                          ? "bg-[#070b19] border-cyan-400/50 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.25)]"
                          : selectedPortfolioTheme === "luxury-gold"
                          ? "bg-[#141009] border-amber-500/50 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                          : selectedPortfolioTheme === "minimalist"
                          ? "bg-white text-gray-900 border-gray-200 shadow-2xl shadow-gray-200/80 dark:bg-zinc-900 dark:border-white/10 dark:text-white"
                          : "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white border-blue-500/30 shadow-2xl shadow-blue-500/10"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-4 border-b pb-4 ${
                          selectedPortfolioTheme === "minimalist"
                            ? "border-gray-200 dark:border-white/10"
                            : selectedPortfolioTheme === "cyberpunk"
                            ? "border-cyan-400/30"
                            : selectedPortfolioTheme === "luxury-gold"
                            ? "border-amber-500/30"
                            : "border-white/10"
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md ${
                            selectedPortfolioTheme === "cyberpunk"
                              ? "bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                              : selectedPortfolioTheme === "luxury-gold"
                              ? "bg-gradient-to-tr from-amber-500 to-amber-700 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                              : "bg-gradient-to-tr from-blue-600 to-indigo-600"
                          }`}
                        >
                          AJ
                        </div>
                        <div>
                          <h4 className="font-black text-base sm:text-lg">
                            Atharva Joshi
                          </h4>
                          <p
                            className={`text-xs font-bold ${
                              selectedPortfolioTheme === "minimalist"
                                ? "text-blue-600 dark:text-blue-400"
                                : selectedPortfolioTheme === "cyberpunk"
                                ? "text-cyan-400"
                                : selectedPortfolioTheme === "luxury-gold"
                                ? "text-amber-400"
                                : "text-blue-400"
                            }`}
                          >
                            Full-Stack AI Systems Architect
                          </p>
                        </div>
                      </div>

                      <div className="py-4 space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          {["React", "Node.js", "GPT-4o", "TailwindCSS", "PostgreSQL"].map(
                            (skill, i) => (
                              <span
                                key={i}
                                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                  selectedPortfolioTheme === "minimalist"
                                    ? "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-white/5"
                                    : selectedPortfolioTheme === "cyberpunk"
                                    ? "bg-cyan-950/70 text-cyan-300 border border-cyan-400/40"
                                    : selectedPortfolioTheme === "luxury-gold"
                                    ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                                    : "bg-white/10 text-zinc-200 border border-white/10"
                                }`}
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>

                        <div
                          className={`p-3.5 rounded-xl space-y-1 ${
                            selectedPortfolioTheme === "minimalist"
                              ? "bg-gray-50 border border-gray-200 text-gray-900 dark:bg-zinc-800/60 dark:border-white/5 dark:text-white"
                              : selectedPortfolioTheme === "cyberpunk"
                              ? "bg-cyan-950/40 border border-cyan-400/30 text-cyan-200"
                              : selectedPortfolioTheme === "luxury-gold"
                              ? "bg-amber-950/40 border border-amber-500/25 text-amber-100"
                              : "bg-white/5 border border-white/10 text-white"
                          }`}
                        >
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider ${
                              selectedPortfolioTheme === "minimalist"
                                ? "text-gray-500 dark:text-zinc-400"
                                : selectedPortfolioTheme === "cyberpunk"
                                ? "text-cyan-400"
                                : selectedPortfolioTheme === "luxury-gold"
                                ? "text-amber-400"
                                : "text-blue-400"
                            }`}
                          >
                            Featured Project
                          </span>
                          <h5 className="font-bold text-xs sm:text-sm">
                            SmartNShine AI Career OS
                          </h5>
                          <p
                            className={`text-[11px] font-medium leading-relaxed ${
                              selectedPortfolioTheme === "minimalist"
                                ? "text-gray-600 dark:text-zinc-400"
                                : "opacity-75"
                            }`}
                          >
                            Full-suite career platform with 11 ATS templates, diagnostic scanner, and hosted portfolio generator.
                          </p>
                        </div>
                      </div>

                      <div
                        className={`pt-2 flex justify-between items-center text-xs font-black ${
                          selectedPortfolioTheme === "minimalist"
                            ? "text-gray-700 dark:text-zinc-300"
                            : "opacity-80"
                        }`}
                      >
                        <span className="font-mono text-[11px]">🔗 smartnshine.app/p/atharva</span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            selectedPortfolioTheme === "minimalist"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
                              : selectedPortfolioTheme === "cyberpunk"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse"
                              : selectedPortfolioTheme === "luxury-gold"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          ● Available for Hire
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <SectionDivider />

        {/* THE 6 CORE PILLARS BENTO GRID */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: 1200 }}>
            {corePillars.map((pillar, idx) => {
              const IconComponent = pillar.icon;
              return (
                <TiltCard
                  key={idx}
                  max={18}
                  glare={true}
                  className="p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-2xl transition-all h-full"
                >
                  <div className="space-y-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${pillar.colorClass} flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>

        <SectionDivider />

        {/* 3D INTERACTIVE TEMPLATES SHOWCASE & CAROUSEL */}
        <section id="templates" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          {/* 3D Fanning Stack Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-cyan-500/5 dark:from-zinc-900/60 dark:to-zinc-950/80 border border-gray-200 dark:border-white/10 p-8 sm:p-12 overflow-hidden relative">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
                  <Palette className="w-3.5 h-3.5" />
                  Precision Document Architecture
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  11 Enterprise ATS-Certified Resume Formats
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 leading-relaxed">
                  Engineered with zero tables, single-column fallback hierarchies, and recruiter-tested typography to guarantee 100% parseability across Greenhouse, Workday, Taleo, and Lever.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to="/templates"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-transform"
                  >
                    <span>Browse All 11 Templates</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 3D Interactive Floating Template Stack */}
              <div className="lg:col-span-6 relative h-[280px] sm:h-[340px] flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  {heroTemplates.map((t, idx) => (
                    <motion.div
                      key={t.id}
                      className="absolute w-[180px] sm:w-[220px] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white shadow-xl dark:shadow-2xl transition-all duration-500 cursor-pointer"
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
                        scale: 1.08,
                        y: t.y - 20,
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
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Live Template Gallery
              </h3>
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
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="mx-auto max-w-xl text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Proven Career Outcomes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Loved by Engineers & Leaders Worldwide
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
              Don't take our word for it — here's how candidates unlocked dream interviews and accelerated offers with SmartNShine.
            </p>
          </div>

          <TestimonialsSection />
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
