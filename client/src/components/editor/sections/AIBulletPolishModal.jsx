import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Target,
  Check,
  Copy,
  RefreshCw,
  X,
  ArrowRight,
  Sliders,
  Send,
  Loader2,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { resumeAPI } from "@/api/api";
import { authStorage } from "@/utils/storage";

// Smart client-side variation generator fallback for offline/instant mode
function generateClientVariations(originalText, sectionType, context = {}) {
  const clean = (originalText || "").trim().replace(/^[-•*]\s*/, "");
  if (!clean) {
    return {
      quantified: "Spearheaded high-impact initiatives, driving a 35% improvement in operational efficiency and saving 12+ team hours weekly.",
      concise: "Architected and delivered core platform capabilities ahead of schedule with zero production downtime.",
      keywordEnriched: "Orchestrated full lifecycle engineering using modern CI/CD pipelines, microservices architecture, and automated testing suites.",
    };
  }

  // Action verb list for concise rewriting
  const actionVerbs = [
    "Architected",
    "Spearheaded",
    "Orchestrated",
    "Engineered",
    "Streamlined",
    "Automated",
    "Formulated",
    "Pioneered",
  ];
  const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

  // Clean starting verb
  let stripped = clean.replace(/^(I |We |Responsible for |Worked on |Helped in |Assisted with |Managed |Handled )/i, "");
  stripped = stripped.charAt(0).toLowerCase() + stripped.slice(1);

  // 1. Quantified
  const quantified = `${randomVerb} ${stripped}, accelerating performance by +35% and supporting over 15k+ active users with 99.9% uptime.`;

  // 2. Executive & Concise
  const concise = `${randomVerb} ${stripped} across cross-functional teams, cutting delivery cycles by 3 weeks.`;

  // 3. ATS Keyword-Enriched
  const keywords = context.role
    ? `leveraging enterprise ${context.role} best practices, scalable design patterns, and automated quality controls`
    : "implementing industry-standard design patterns, high-availability architecture, and agile methodologies";
  const keywordEnriched = `${randomVerb} ${stripped}, ${keywords} to exceed target benchmark KPIs.`;

  return {
    quantified,
    concise,
    keywordEnriched,
  };
}

export default function AIBulletPolishModal({
  isOpen,
  onClose,
  originalText,
  onApply,
  sectionType = "experience",
  context = {},
  resumeData = null,
}) {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState(null);
  const [customInstruction, setCustomInstruction] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [appliedKey, setAppliedKey] = useState(null);

  useEffect(() => {
    if (isOpen && originalText) {
      fetchVariations();
    } else {
      setVariations(null);
      setCustomInstruction("");
      setAppliedKey(null);
    }
  }, [isOpen, originalText]);

  const fetchVariations = async (instruction = "") => {
    setLoading(true);
    try {
      if (authStorage.hasToken()) {
        const res = await resumeAPI.getBulletRewrites(
          originalText,
          sectionType,
          context,
          resumeData,
          instruction
        );
        if (res.data?.data) {
          setVariations(res.data.data);
          setLoading(false);
          return;
        }
      }
      // Fallback if no token or fast fallback
      const fallback = generateClientVariations(originalText, sectionType, context);
      setVariations(fallback);
    } catch (err) {
      console.warn("API rewrite unavailable, using fallback generator:", err);
      const fallback = generateClientVariations(originalText, sectionType, context);
      setVariations(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (key, text) => {
    setAppliedKey(key);
    onApply(text);
    toast.success("Applied AI variation!", {
      icon: "✨",
      duration: 2500,
    });
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!", { duration: 1500 });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInstruction.trim() || loading) return;
    fetchVariations(customInstruction.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/70 dark:bg-zinc-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                Inline AI Power Polish
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  3 Archetypes
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                1-click rewrite tailored for ATS algorithms and hiring managers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Original Text Preview */}
          <div className="bg-gray-50 dark:bg-zinc-950/70 border border-gray-200/80 dark:border-zinc-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 dark:text-gray-500">
                Original Draft
              </span>
              <span className="text-[11px] text-gray-400">
                {originalText?.length || 0} characters
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 italic line-clamp-2">
              "{originalText || "No content"}"
            </p>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-md animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin text-amber-400" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
                Crafting 3 tailored ATS variations with AI...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Analyzing action verbs, metric density, and industry keywords
              </p>
            </div>
          ) : variations ? (
            <div className="space-y-3">
              {/* Variation 1: Quantified & Results-Oriented */}
              <div
                className={`group relative rounded-xl border transition-all duration-200 p-4 ${
                  appliedKey === "quantified"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20"
                    : "border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 hover:border-emerald-400 dark:hover:border-emerald-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <TrendingUp className="w-3 h-3" />
                      Quantified & Results-Oriented
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy("quantified", variations.quantified)}
                      className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded-md hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedKey === "quantified" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleApply("quantified", variations.quantified)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all"
                    >
                      {appliedKey === "quantified" ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Applied
                        </>
                      ) : (
                        <>
                          Apply <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-zinc-200 leading-relaxed font-medium">
                  {variations.quantified}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                  <span>✦ Injects measurable impact, scale, & quantifiable metrics</span>
                </p>
              </div>

              {/* Variation 2: Executive & Concise */}
              <div
                className={`group relative rounded-xl border transition-all duration-200 p-4 ${
                  appliedKey === "concise"
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20"
                    : "border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/10 hover:border-indigo-400 dark:hover:border-indigo-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                      <Award className="w-3 h-3" />
                      Executive & Concise
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy("concise", variations.concise)}
                      className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-md hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedKey === "concise" ? (
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleApply("concise", variations.concise)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all"
                    >
                      {appliedKey === "concise" ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Applied
                        </>
                      ) : (
                        <>
                          Apply <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-zinc-200 leading-relaxed font-medium">
                  {variations.concise}
                </p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-2 flex items-center gap-1">
                  <span>✦ Cuts passive fluff and leads with decisive action verbs</span>
                </p>
              </div>

              {/* Variation 3: ATS Keyword-Enriched */}
              <div
                className={`group relative rounded-xl border transition-all duration-200 p-4 ${
                  appliedKey === "keywordEnriched"
                    ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20"
                    : "border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10 hover:border-amber-400 dark:hover:border-amber-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      <Target className="w-3 h-3" />
                      ATS Keyword-Enriched
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy("keywordEnriched", variations.keywordEnriched)}
                      className="text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 p-1.5 rounded-md hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedKey === "keywordEnriched" ? (
                        <Check className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleApply("keywordEnriched", variations.keywordEnriched)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow transition-all"
                    >
                      {appliedKey === "keywordEnriched" ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Applied
                        </>
                      ) : (
                        <>
                          Apply <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-zinc-200 leading-relaxed font-medium">
                  {variations.keywordEnriched}
                </p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                  <span>✦ Maximizes match frequency for top recruiter search filters</span>
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Custom Prompt Toolbar */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row items-center gap-2">
          <form onSubmit={handleCustomSubmit} className="w-full flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Optional instruction (e.g. 'Focus on React/AWS', 'Make more senior', 'Shorter')..."
                className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !customInstruction.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
              Refine
            </button>
            <button
              type="button"
              onClick={() => fetchVariations()}
              disabled={loading}
              className="p-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              title="Regenerate all variations"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
