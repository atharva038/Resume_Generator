import React, { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";

export const row1Faqs = [
  {
    id: "01",
    q: "What makes SmartNShine ATS-optimized, and which parsers are tested?",
    a: "Every template is engineered with single-column, parser-compliant hierarchies without complex multi-layer floats or text boxes. Verified on Workday, Greenhouse, Taleo, and Lever.",
    tag: "ATS Optimization",
    takeaway: "✓ Tested on Workday, Greenhouse & Taleo",
    tagColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    indicatorColor: "bg-emerald-500",
  },
  {
    id: "02",
    q: "How does the AI bullet enhancement and STAR rewriter work?",
    a: "SmartNShine uses state-of-the-art OpenAI GPT-4o to transform raw bullets into quantified STAR achievements with verified action verbs and recruiter-tested impact metrics.",
    tag: "AI Bullet Engine",
    takeaway: "✓ OpenAI GPT-4o STAR rewriter",
    tagColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    indicatorColor: "bg-purple-500",
  },
  {
    id: "03",
    q: "What is the One Master Profile, and how does it sync?",
    a: "Your central career database holding all verified experience, GitHub projects, and skills. Sync updates across multiple role-tailored resumes and portfolios in 1 click.",
    tag: "Master Profile",
    takeaway: "✓ 1 Master Profile powers all resumes",
    tagColor: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
    indicatorColor: "bg-rose-500",
  },
  {
    id: "04",
    q: "Can I deploy a live developer portfolio from my resume?",
    a: "Yes! Instantly deploy a live, responsive portfolio website with custom themes (Glassmorphism, Tech 3D, Minimal) and your own shareable public URL slug.",
    tag: "Web Portfolio",
    takeaway: "✓ 1-click live deploy with custom slug",
    tagColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    indicatorColor: "bg-cyan-500",
  },
  {
    id: "05",
    q: "How does the Career Q&A Studio and interview prep work?",
    a: "It benchmarks your target role and resume to generate relevant behavioral, situational, and salary negotiation mock prompts with expert calibrated answers.",
    tag: "Interview Studio",
    takeaway: "✓ Role-specific mock interview prep",
    tagColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    indicatorColor: "bg-indigo-500",
  },
];

export const row2Faqs = [
  {
    id: "06",
    q: "Is SmartNShine free to use, and what is included in the Free plan?",
    a: "Yes. The free tier gives you 3 ATS-certified templates, 10 AI bullet rewrites per month, basic ATS match score diagnostics, and clean PDF exports with zero card required.",
    tag: "Free Access",
    takeaway: "✓ Free tier with no credit card required",
    tagColor: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    indicatorColor: "bg-amber-500",
  },
  {
    id: "07",
    q: "What is the difference between the One-Time Pass and Pro Unlimited?",
    a: "One-Time Pass (₹9/₹49 flash deal) gives 21 days full access, 150 AI requests, and 1 portfolio without recurring fees. Pro (₹199/mo) unlocks unlimited AI, resumes & Q&A.",
    tag: "Flexible Plans",
    takeaway: "✓ ₹9 One-Time Pass or ₹199/mo Pro",
    tagColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    indicatorColor: "bg-blue-500",
  },
  {
    id: "08",
    q: "What payment methods are supported, and can I cancel anytime?",
    a: "We support UPI, Net Banking, Credit/Debit cards via secure Razorpay. Cancel recurring subscriptions with 1 click anytime directly from your dashboard.",
    tag: "Payments & Billing",
    takeaway: "✓ UPI, Cards, Net Banking & 1-click cancel",
    tagColor: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
    indicatorColor: "bg-teal-500",
  },
  {
    id: "09",
    q: "Is my resume data safe, encrypted, and strictly private?",
    a: "Absolutely. We use bank-grade encryption. Your career data is never shared or sold to third-party recruiters, and you can export or delete your profile anytime.",
    tag: "Privacy & Security",
    takeaway: "✓ Bank-grade encryption • 100% private",
    tagColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    indicatorColor: "bg-emerald-500",
  },
  {
    id: "10",
    q: "How are resumes exported, and is the text selectable?",
    a: "All exports produce true vector PDFs where text remains crisp, selectable, and fully searchable, ensuring 100% compatibility with enterprise ATS parsers.",
    tag: "Vector PDF",
    takeaway: "✓ Machine-readable selectable vector PDF",
    tagColor: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    indicatorColor: "bg-violet-500",
  },
];

// Unified structured array for Schema.org SEO integration
export const SYSTEM_FAQS = [...row1Faqs, ...row2Faqs].map((item) => ({
  question: item.q,
  answer: item.a,
}));

function FAQCard({ item, isDarkMode }) {
  const { id, q, a, tag, takeaway, tagColor, indicatorColor } = item;
  return (
    <div
      className={`w-[350px] sm:w-[410px] min-h-[255px] shrink-0 p-6 rounded-3xl backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between select-none ${
        isDarkMode
          ? "bg-zinc-900/60 border-white/10 hover:border-white/25 shadow-lg hover:shadow-2xl"
          : "bg-white/85 border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl"
      }`}
    >
      <div className="space-y-2.5">
        {/* Category Pill & Dot */}
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md ${tagColor}`}
          >
            <span className="opacity-80 font-mono">{id}</span>
            <span className="opacity-40 font-mono">/</span>
            <span>{tag}</span>
          </div>
          <span className={`w-1.5 h-1.5 rounded-full ${indicatorColor}`} />
        </div>

        {/* Question */}
        <h3
          className={`text-[15px] font-semibold tracking-tight leading-snug ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          {q}
        </h3>
      </div>

      {/* Answer & Takeaway */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-white/5 space-y-2">
        <p
          className={`text-xs sm:text-[13px] font-normal leading-relaxed ${
            isDarkMode ? "text-zinc-400" : "text-slate-600"
          }`}
        >
          {a}
        </p>
        <div className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 pt-0.5">
          {takeaway}
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { isDarkMode } = useDarkMode();
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate arrays once for seamless infinite loop
  const duplicatedRow1 = [...row1Faqs, ...row1Faqs];
  const duplicatedRow2 = [...row2Faqs, ...row2Faqs];

  return (
    <section
      id="faq"
      className={`relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-[#07080c] text-zinc-100" : "bg-[#f8f8f6] text-slate-900"
      }`}
    >
      {/* Scoped CSS for hardware-accelerated, lightweight, glitch-free keyframes */}
      <style>{`
        @keyframes faqScrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes faqScrollRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .faq-track-left {
          display: flex;
          width: max-content;
          animation: faqScrollLeft 56s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .faq-track-right {
          display: flex;
          width: max-content;
          animation: faqScrollRight 56s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .faq-marquee-container:hover .faq-track-left,
        .faq-marquee-container:hover .faq-track-right {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full blur-[140px] bg-indigo-500/5 dark:bg-indigo-500/10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold tracking-wider uppercase backdrop-blur-md ${
              isDarkMode
                ? "bg-zinc-800/60 border-zinc-700/60 text-zinc-300"
                : "bg-white/80 border-slate-200/80 text-slate-700 shadow-xs"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Everything you need to know.
          </h2>

          <p
            className={`text-xs sm:text-sm font-normal leading-relaxed ${
              isDarkMode ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            Hover or tap any card to pause the slider. Real answers calibrated to SmartNShine features.
          </p>

          {/* Interactive Pause/Play Toggle Button */}
          <div className="pt-2">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
                isPaused
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : isDarkMode
                  ? "bg-zinc-800/80 hover:bg-zinc-700 border-white/10 text-zinc-300"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs"
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Resume Slider</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Pause Motion</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual Marquee Track with Edge Gradient Fade */}
        <div className="relative overflow-hidden faq-marquee-container py-2 space-y-6">
          {/* Left Gradient Edge Mask */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-20 bg-gradient-to-r ${
              isDarkMode
                ? "from-[#07080c] via-[#07080c]/80 to-transparent"
                : "from-[#f8f8f6] via-[#f8f8f6]/80 to-transparent"
            }`}
          />

          {/* Right Gradient Edge Mask */}
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-20 bg-gradient-to-l ${
              isDarkMode
                ? "from-[#07080c] via-[#07080c]/80 to-transparent"
                : "from-[#f8f8f6] via-[#f8f8f6]/80 to-transparent"
            }`}
          />

          {/* Track 1: Gliding Left */}
          <div
            className="faq-track-left gap-5"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicatedRow1.map((item, idx) => (
              <FAQCard key={`r1-${idx}`} item={item} isDarkMode={isDarkMode} />
            ))}
          </div>

          {/* Track 2: Gliding Right */}
          <div
            className="faq-track-right gap-5"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {duplicatedRow2.map((item, idx) => (
              <FAQCard key={`r2-${idx}`} item={item} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
