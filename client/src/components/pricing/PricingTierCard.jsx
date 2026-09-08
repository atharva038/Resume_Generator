import { Check, Star, Rocket, Crown, ArrowRight, Sparkles, Zap } from "lucide-react";

export default function PricingTierCard({
  tierKey,
  tierData,
  isPopular,
  isActivePlan,
  onSelectPlan,
}) {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTierIcon = () => {
    if (tierKey === "free") return Star;
    if (tierKey === "one-time") return Rocket;
    return Crown;
  };

  const Icon = getTierIcon();

  const getTitle = () => {
    if (tierKey === "free") return "Starter Free";
    if (tierKey === "one-time") return "One-Time Pass";
    return "Pro Unlimited";
  };

  const getSubtitle = () => {
    if (tierKey === "free") return "Essential toolkit for casual updates";
    if (tierKey === "one-time") return "Complete 21-day single resume boost";
    return "Unlimited AI generation & ATS diagnostic engine";
  };

  const proAmount = tierData?.monthly?.amount || 199;
  const proOriginalAmount = tierData?.monthly?.originalAmount || 199;
  const isProDiscounted =
    tierData?.monthly?.isPromo || proAmount < proOriginalAmount;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl transition-all duration-300 p-6 sm:p-8 overflow-hidden backdrop-blur-xl ${
        tierKey === "pro"
          ? "bg-gradient-to-b from-blue-500/[0.07] via-cyan-500/[0.03] to-indigo-500/[0.05] dark:from-blue-950/40 dark:via-zinc-900/90 dark:to-cyan-950/40 border-2 border-blue-500/70 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-400/40 scale-[1.02]"
          : tierKey === "one-time"
          ? "bg-gradient-to-b from-orange-500/[0.06] via-transparent to-amber-500/[0.04] dark:from-orange-950/30 dark:via-zinc-900/90 dark:to-zinc-950 border-2 border-orange-500/50 shadow-xl shadow-orange-500/10"
          : "bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md"
      }`}
    >
      {/* Decorative ambient glowing orb in background for Pro */}
      {tierKey === "pro" && (
        <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-indigo-500/30 rounded-full blur-3xl" />
      )}

      {/* Popular Pill */}
      {isPopular && (
        <div className="absolute top-0 right-0 z-10">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-lg shadow-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Most Popular
          </span>
        </div>
      )}

      {/* Active Plan Pill */}
      {isActivePlan && (
        <div className="absolute top-0 left-0 z-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-br-2xl shadow-md">
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Plan
          </span>
        </div>
      )}

      <div className="space-y-6 relative z-10">
        {/* Tier Header */}
        <div className="space-y-3 pt-2">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              tierKey === "pro"
                ? "bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/40"
                : tierKey === "one-time"
                ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 border border-orange-400/30"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>

          <div>
            <h3
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                tierKey === "pro"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-300 dark:via-cyan-200 dark:to-indigo-300"
                  : tierKey === "one-time"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-300 dark:to-amber-200"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {getTitle()}
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed font-medium">
              {getSubtitle()}
            </p>
          </div>
        </div>

        {/* Pricing Display */}
        <div className="py-2 border-y border-gray-100 dark:border-white/5">
          {tierKey === "free" ? (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                ₹0
              </span>
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                / forever
              </span>
            </div>
          ) : tierKey === "one-time" ? (
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400">
                  {formatPrice(tierData.amount ?? 9)}
                </span>
                {(tierData.isPromo || (tierData.amount && tierData.amount < 49)) && (
                  <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 line-through">
                    {formatPrice(tierData.originalAmount || 49)}
                  </span>
                )}
                <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                  / 21 days pass
                </span>
              </div>
              {(tierData.isPromo || (tierData.amount && tierData.amount < 49)) && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-500/30 shadow-xs">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  <span>
                    {tierData.promoBadge || "RAKHI DEAL"} • Flat{" "}
                    {Math.round(
                      (1 - (tierData.amount || 9) / (tierData.originalAmount || 49)) *
                        100
                    )}
                    % OFF
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400">
                  {formatPrice(proAmount)}
                </span>
                {isProDiscounted && (
                  <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 line-through">
                    {formatPrice(proOriginalAmount)}
                  </span>
                )}
                <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                  / month
                </span>
              </div>
              {isProDiscounted && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-indigo-500/15 text-blue-700 dark:text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-blue-500/30 shadow-xs">
                  <Zap className="w-3 h-3 text-cyan-400 fill-current" />
                  <span>
                    PRO SPECIAL • Flat{" "}
                    {Math.round((1 - proAmount / proOriginalAmount) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features Checklist */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
            Included Capabilities:
          </p>
          <ul className="space-y-2.5">
            {tierData.features?.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-zinc-300 font-medium"
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    tierKey === "pro"
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Buttons Footer */}
      <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/5 relative z-10">
        {tierKey === "pro" ? (
          <button
            onClick={() => onSelectPlan("pro", "monthly")}
            disabled={isActivePlan}
            className={`w-full py-4 px-5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
              isActivePlan
                ? "bg-gray-200 dark:bg-zinc-800 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:scale-[1.02]"
            }`}
          >
            <span>
              {isActivePlan
                ? "Current Active Plan ✓"
                : `Upgrade to Pro (${formatPrice(proAmount)}/mo)`}
            </span>
            {!isActivePlan && <ArrowRight className="w-4 h-4 stroke-[3]" />}
          </button>
        ) : (
          <button
            onClick={() => onSelectPlan(tierKey, tierData.plan || "one-time")}
            disabled={isActivePlan}
            className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
              isActivePlan
                ? "bg-gray-200 dark:bg-zinc-800 text-gray-500 cursor-not-allowed"
                : tierKey === "one-time"
                ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25 transform hover:scale-[1.02]"
                : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-sm"
            }`}
          >
            <span>
              {isActivePlan
                ? "Current Active Plan ✓"
                : tierKey === "free"
                ? "Get Started Free"
                : `Claim ${formatPrice(tierData.amount ?? 9)} Pass`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
