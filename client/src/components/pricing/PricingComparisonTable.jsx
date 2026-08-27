import React from "react";
import { Check, X, HelpCircle, FileText, Lock, X as CloseIcon, Sparkles } from "lucide-react";
import { useBodyScrollLock } from "@/hooks";

export function PricingComparisonTable() {
  const featureCategories = [
    {
      category: "AI Engines & Ingestion",
      items: [
        { name: "Monthly AI Resume Rewrites", free: "10 / month", oneTime: "150 / 21 days", pro: "Unlimited ∞" },
        { name: "AI Model Quality", free: "Gemini Standard", oneTime: "GPT-4o Enhanced", pro: "GPT-4o + Gemini Pro" },
        { name: "Resume PDF/DOCX Parser", free: "1 / month", oneTime: "Full Access", pro: "Unlimited / day" },
      ],
    },
    {
      category: "ATS Diagnostic Engine",
      items: [
        { name: "ATS Compatibility Match Score", free: "Basic Check", oneTime: "Full Scan (1)", pro: "Unlimited Scans ∞" },
        { name: "Missing Keyword Gap Detection", free: "Partial", oneTime: "Full Report", pro: "Full Deep Diagnostic" },
        { name: "Actionable Recommendation Engine", free: "Top 2 Tips", oneTime: "All Fixes", pro: "All High-Impact Fixes" },
      ],
    },
    {
      category: "Builder & Templates Studio",
      items: [
        { name: "Resumes per Account", free: "1 Active", oneTime: "1 Dedicated (21d)", pro: "Unlimited Resumes ∞" },
        { name: "All 11 ATS-Certified Templates", free: "3 Core Templates", oneTime: "All 11 Unlocked", pro: "All 11 Unlocked" },
        { name: "Dynamic Color Themes & Custom Fonts", free: "Standard Palette", oneTime: "All Themes", pro: "All Themes + Custom" },
        { name: "Live Multi-Page PDF Exports", free: "Watermark-Free", oneTime: "Priority HD PDF", pro: "Instant Priority HD" },
      ],
    },
    {
      category: "Career Hub & Web Portfolios",
      items: [
        { name: "Master Career Profile Hub", free: "Active", oneTime: "Full Access", pro: "2-Way Live Sync" },
        { name: "Live Public Portfolio Website", free: "Preview Only", oneTime: "1 Live Website", pro: "Unlimited Portfolios ∞" },
        { name: "Custom Portfolio Themes & Slugs", free: "Standard", oneTime: "All Themes", pro: "All Themes + Custom Slugs" },
        { name: "Career Q&A Studio (Interview Prep)", free: "5 Questions", oneTime: "Full Access", pro: "Unlimited Practice ∞" },
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Feature Matrix</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Comprehensive Plan Comparison
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Explore all capabilities included across each tier
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-white/10 text-gray-400 dark:text-zinc-500 font-bold uppercase text-[11px]">
              <th className="py-3.5 px-4 w-2/5">Capability</th>
              <th className="py-3.5 px-4 text-center">Starter Free</th>
              <th className="py-3.5 px-4 text-center text-blue-600 dark:text-blue-400">One-Time Pass</th>
              <th className="py-3.5 px-4 text-center text-purple-600 dark:text-purple-400 font-black">Pro Unlimited</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {featureCategories.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                <tr className="bg-gray-50/80 dark:bg-zinc-950/80">
                  <td
                    colSpan={4}
                    className="py-2.5 px-4 font-black uppercase text-[10px] tracking-wider text-gray-500 dark:text-zinc-400"
                  >
                    {group.category}
                  </td>
                </tr>
                {group.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-zinc-200">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-center text-gray-600 dark:text-zinc-400 font-medium">
                      {item.free}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-gray-800 dark:text-zinc-200">
                      {item.oneTime}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-purple-600 dark:text-purple-400">
                      {item.pro}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PricingFAQ() {
  const faqs = [
    {
      q: "What is included with the Pro Unlimited plan?",
      a: "Pro unlocks unrestricted access to our dual GPT-4o & Gemini Pro AI rewrite engine, unlimited ATS diagnostic scans, all 11 executive resume templates, unlimited public portfolio websites with live URLs, full Career Q&A Studio interview prep, and priority PDF rendering.",
    },
    {
      q: "How does the One-Time Pass work?",
      a: "The One-Time Pass gives you full access to all 11 templates, 150 AI requests, deep ATS diagnostics, and 1 portfolio website for a specific resume for 21 days without recurring monthly charges.",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes! You can cancel recurring subscriptions with 1 click directly from your profile settings. You will retain full Pro benefits until the end of your billing cycle.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support UPI, Net Banking, Credit/Debit cards (Visa, MasterCard, RuPay), and digital wallets via our secure Razorpay gateway.",
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900/90 rounded-3xl p-6 sm:p-8 border border-gray-200/90 dark:border-white/[0.08] shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Everything you need to know about plans & features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-gray-50/70 dark:bg-zinc-950/60 border border-gray-200/70 dark:border-white/5 space-y-2"
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 pl-6 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PricingResumeChooserModal({
  isOpen,
  onClose,
  selectableResumes,
  loadingResumes,
  onChooseResume,
}) {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden z-10">
        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Select Resume to Unlock
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              One-Time pass applies full AI access to your chosen resume for 21 days
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 rounded-xl"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-3">
          {loadingResumes ? (
            <p className="text-xs text-gray-500 dark:text-zinc-400 text-center py-6">
              Loading your saved resumes...
            </p>
          ) : selectableResumes.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-zinc-400 text-center py-6">
              No resumes found. Please create or upload a resume first.
            </p>
          ) : (
            selectableResumes.map((resume) => {
              const isLocked = resume.access?.upgradeRequired;
              return (
                <button
                  key={resume._id}
                  onClick={() => onChooseResume(resume)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-zinc-900/60 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-left transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    {isLocked ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {resume.resumeTitle || resume.name || "Untitled Resume"}
                      </p>
                      {isLocked && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                      Last edited {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
