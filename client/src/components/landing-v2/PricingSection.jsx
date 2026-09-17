import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { getPricing, getSubscriptionStatus } from "@/api/subscription.api";
import { resumeAPI } from "@/api/api";
import PaymentModal from "@/components/common/PaymentModal";
import { PricingResumeChooserModal } from "@/components/pricing";
import toast from "react-hot-toast";
import { useToggle } from "@/hooks";
import { useDarkMode } from "../../context/DarkModeContext";

const FALLBACK_PRICING = {
  free: {
    tier: "free",
    amount: 0,
    features: [
      "3 Core ATS-Certified Templates",
      "10 AI Bullet Rewrites / month",
      "Basic ATS Match Score Diagnostic",
      "1 Active Resume at a time",
      "Clean PDF Export",
    ],
  },
  "one-time": {
    tier: "one-time",
    amount: 9,
    originalAmount: 49,
    isPromo: true,
    promoBadge: "FLASH DEAL",
    features: [
      "All 11 ATS-Certified Templates",
      "150 AI Rewrites for 21 Days",
      "Full ATS Compatibility Scan",
      "1 Dedicated Tailored Resume",
      "Priority HD Vector PDF Export",
    ],
  },
  pro: {
    tier: "pro",
    monthly: {
      amount: 199,
      originalAmount: 299,
      isPromo: true,
    },
    features: [
      "Unlimited AI Generation ∞",
      "All 11 Executive Templates",
      "Unlimited ATS Diagnostic Scans",
      "Unlimited Resumes & Web Portfolios",
      "Career Q&A Studio Bank",
      "2-Way Master Profile Live Sync",
    ],
  },
};

export default function PricingSection() {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, , setShowPaymentModalTrue, setShowPaymentModalFalse] =
    useToggle(false);
  const [paymentData, setPaymentData] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [resumeChooserOpen, setResumeChooserOpen] = useState(false);
  const [selectableResumes, setSelectableResumes] = useState([]);
  const [pendingOneTimePlan, setPendingOneTimePlan] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    fetchPricing();
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await getSubscriptionStatus();
      setCurrentSubscription(response.subscription || null);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    }
  };

  const fetchPricing = async () => {
    try {
      const data = await getPricing();
      setPricing(data.pricing || data);
    } catch (error) {
      console.error("Pricing fetch error:", error);
      setPricing(FALLBACK_PRICING);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSelectPlan = async (tier, plan = "monthly") => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to subscribe");
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }

    if (tier === "free") {
      toast.success("You are already active on the Free Starter plan");
      return;
    }

    const isCurrentActivePlan =
      currentSubscription?.tier === tier &&
      tier === "pro" &&
      currentSubscription?.status === "active";

    if (isCurrentActivePlan) {
      toast.error(
        `You already have an active ${tier.replace("-", " ")} subscription!`
      );
      return;
    }

    if (tier === "one-time") {
      try {
        setLoadingResumes(true);
        const response = await resumeAPI.list();
        const resumes = response.data.resumes || [];

        if (resumes.length === 0) {
          toast.error("Create or upload a resume before buying one-time access");
          navigate("/upload");
          return;
        }

        setSelectableResumes(resumes);
        setPendingOneTimePlan({ tier, plan });
        setResumeChooserOpen(true);
      } catch (error) {
        toast.error("Failed to load your resumes");
        console.error(error);
      } finally {
        setLoadingResumes(false);
      }
      return;
    }

    setPaymentData({ tier, plan });
    setShowPaymentModalTrue();
  };

  const handleChooseResumeForOneTime = (resume) => {
    setResumeChooserOpen(false);
    setPaymentData({
      ...pendingOneTimePlan,
      resumeId: resume._id,
      resumeTitle: resume.resumeTitle || resume.name || "Untitled Resume",
    });
    setShowPaymentModalTrue();
  };

  const activePricing = pricing || FALLBACK_PRICING;

  const tiersConfig = [
    {
      key: "free",
      name: "Starter Free",
      subtitle: "Essential toolkit for casual updates",
      data: activePricing.free || FALLBACK_PRICING.free,
    },
    {
      key: "one-time",
      name: "One-Time Pass",
      subtitle: "Complete 21-day single resume boost",
      data: activePricing["one-time"] || FALLBACK_PRICING["one-time"],
    },
    {
      key: "pro",
      name: "Pro Unlimited",
      subtitle: "Unlimited AI generation & ATS diagnostic engine",
      data: activePricing.pro || FALLBACK_PRICING.pro,
      isPopular: true,
    },
  ];

  return (
    <section
      id="pricing"
      className={`relative py-24 px-6 sm:px-10 lg:px-16 overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-[#08090e] text-zinc-100" : "bg-[#fbfbfa] text-slate-900"
      }`}
    >
      {/* Subtle ambient glass glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] bg-indigo-500/5 dark:bg-indigo-500/10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full blur-[120px] bg-amber-500/5 dark:bg-amber-500/5" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Simple, predictable <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">pricing</span>.
          </h2>

          <p
            className={`text-base sm:text-lg font-light leading-relaxed ${
              isDarkMode ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            Transparent plans designed for every stage of your career. Upgrade, downgrade, or cancel anytime.
          </p>
        </motion.div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-3">
              <RefreshCw className="w-7 h-7 text-indigo-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Fetching latest rates...
              </p>
            </div>
          </div>
        ) : (
          /* Glassy Simple Pricing Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {tiersConfig.map((tier, idx) => {
              const { key, name, subtitle, data, isPopular } = tier;
              const isCurrentPlan = currentSubscription?.tier === key;
              const isActivePlan =
                isCurrentPlan &&
                (key === "free" ||
                  (key === "pro" && currentSubscription?.status === "active"));

              const isPro = key === "pro";
              const isOneTime = key === "one-time";
              const isFree = key === "free";

              const proAmount = data?.monthly?.amount ?? 199;
              const proOriginalAmount = data?.monthly?.originalAmount ?? 299;
              const isProDiscounted =
                data?.monthly?.isPromo || proAmount < proOriginalAmount;

              const oneTimeAmount = data?.amount ?? 9;
              const oneTimeOriginalAmount = data?.originalAmount ?? 49;
              const isOneTimeDiscounted =
                data?.isPromo || oneTimeAmount < oneTimeOriginalAmount;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 55, scale: 0.94, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 backdrop-blur-xl border transition-all duration-300 ${
                    isPro
                      ? "bg-white/85 dark:bg-zinc-900/70 border-indigo-500/50 dark:border-indigo-400/40 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-950/30 md:-translate-y-2 ring-1 ring-indigo-500/20"
                      : isOneTime
                      ? "bg-white/75 dark:bg-zinc-900/40 border-amber-500/30 dark:border-amber-500/20 shadow-sm hover:shadow-lg"
                      : "bg-white/65 dark:bg-zinc-900/40 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-sm hover:shadow-lg"
                  }`}
                >
                  {/* Pro Ambient Light */}
                  {isPro && (
                    <div className="pointer-events-none absolute -top-14 -right-14 w-48 h-48 rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 blur-3xl" />
                  )}

                  <div className="space-y-6 relative z-10">
                    {/* Header */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-2xl sm:text-3xl font-normal tracking-tight ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {name}
                        </h3>

                        {isActivePlan ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-medium uppercase tracking-wider border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Active
                          </span>
                        ) : isPopular ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-mono font-medium uppercase tracking-wider border border-indigo-500/25 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 fill-current" /> Popular
                          </span>
                        ) : null}
                      </div>

                      <p
                        className={`text-sm sm:text-[15px] font-light leading-relaxed ${
                          isDarkMode ? "text-zinc-400" : "text-slate-500"
                        }`}
                      >
                        {subtitle}
                      </p>
                    </div>

                    {/* Price Tag */}
                    <div className="py-4 border-y border-slate-100 dark:border-white/5 space-y-2">
                      {isFree && (
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-4xl sm:text-5xl font-light tracking-tight ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}
                          >
                            ₹0
                          </span>
                          <span
                            className={`text-sm font-light ${
                              isDarkMode ? "text-zinc-400" : "text-slate-500"
                            }`}
                          >
                            / forever free
                          </span>
                        </div>
                      )}

                      {isOneTime && (
                        <div className="space-y-1.5">
                          <div className="flex items-baseline gap-2.5">
                            <span className="text-4xl sm:text-5xl font-light tracking-tight text-amber-600 dark:text-amber-400">
                              {formatPrice(oneTimeAmount)}
                            </span>
                            {isOneTimeDiscounted && (
                              <span className="text-base font-light text-slate-400 dark:text-zinc-500 line-through">
                                {formatPrice(oneTimeOriginalAmount)}
                              </span>
                            )}
                            <span
                              className={`text-sm font-light ${
                                isDarkMode ? "text-zinc-400" : "text-slate-500"
                              }`}
                            >
                              / 21 days
                            </span>
                          </div>

                          {isOneTimeDiscounted && (
                            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-mono font-medium uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {data.promoBadge || "SPECIAL"} • Flat{" "}
                              {Math.round(
                                (1 - oneTimeAmount / oneTimeOriginalAmount) * 100
                              )}
                              % OFF
                            </span>
                          )}
                        </div>
                      )}

                      {isPro && (
                        <div className="space-y-1.5">
                          <div className="flex items-baseline gap-2.5">
                            <span className="text-4xl sm:text-5xl font-light tracking-tight text-indigo-600 dark:text-indigo-400">
                              {formatPrice(proAmount)}
                            </span>
                            {isProDiscounted && (
                              <span className="text-base font-light text-slate-400 dark:text-zinc-500 line-through">
                                {formatPrice(proOriginalAmount)}
                              </span>
                            )}
                            <span
                              className={`text-sm font-light ${
                                isDarkMode ? "text-zinc-400" : "text-slate-500"
                              }`}
                            >
                              / month
                            </span>
                          </div>

                          {isProDiscounted && (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                              <Zap className="w-3 h-3 fill-current" />
                              PRO DEAL • Flat{" "}
                              {Math.round((1 - proAmount / proOriginalAmount) * 100)}%
                              OFF
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Features list */}
                    <div className="space-y-3">
                      <p
                        className={`text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-zinc-400" : "text-slate-600"
                        }`}
                      >
                        What's Included:
                      </p>
                      <ul className="space-y-3">
                        {data.features?.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm sm:text-[15px] font-light leading-relaxed"
                          >
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                                isPro
                                  ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                                  : isOneTime
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                  : "bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-zinc-300"
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                            <span
                              className={
                                isDarkMode ? "text-zinc-300" : "text-slate-700"
                              }
                            >
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 relative z-10">
                    {isPro ? (
                      <button
                        onClick={() => handleSelectPlan("pro", "monthly")}
                        disabled={isActivePlan}
                        className={`w-full py-3.5 px-5 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                          isActivePlan
                            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 hover:from-indigo-500 hover:via-blue-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35"
                        }`}
                      >
                        <span>
                          {isActivePlan
                            ? "Current Active Plan ✓"
                            : `Upgrade to Pro (${formatPrice(proAmount)}/mo)`}
                        </span>
                        {!isActivePlan && <ArrowRight className="w-4 h-4" />}
                      </button>
                    ) : isOneTime ? (
                      <button
                        onClick={() =>
                          handleSelectPlan("one-time", data.plan || "one-time")
                        }
                        disabled={isActivePlan}
                        className={`w-full py-3.5 px-5 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                          isActivePlan
                            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20"
                        }`}
                      >
                        <span>
                          {isActivePlan
                            ? "Current Active Plan ✓"
                            : `Get 21-Day Pass (${formatPrice(oneTimeAmount)})`}
                        </span>
                        {!isActivePlan && <ArrowRight className="w-4 h-4" />}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan("free")}
                        disabled={isActivePlan}
                        className={`w-full py-3.5 px-5 rounded-2xl text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                          isActivePlan
                            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-zinc-100 shadow-sm"
                        }`}
                      >
                        <span>
                          {isActivePlan ? "Current Active Plan ✓" : "Get Started Free"}
                        </span>
                        {!isActivePlan && <ArrowRight className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Resume Chooser Modal for One-Time Pass */}
      <PricingResumeChooserModal
        isOpen={resumeChooserOpen}
        onClose={() => setResumeChooserOpen(false)}
        selectableResumes={selectableResumes}
        loadingResumes={loadingResumes}
        onChooseResume={handleChooseResumeForOneTime}
      />

      {/* Payment Processing Modal */}
      {showPaymentModal && paymentData && (
        <PaymentModal
          tier={paymentData.tier}
          plan={paymentData.plan}
          resumeId={paymentData.resumeId}
          resumeTitle={paymentData.resumeTitle}
          onClose={() => {
            setShowPaymentModalFalse();
            setPaymentData(null);
          }}
        />
      )}
    </section>
  );
}
