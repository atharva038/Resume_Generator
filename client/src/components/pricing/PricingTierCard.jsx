import { Check, Star, Rocket, Crown, ArrowRight, Sparkles } from "lucide-react";

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

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl transition-all duration-300 p-6 sm:p-8 overflow-hidden backdrop-blur-xl ${
        isPopular
          ? "bg-white dark:bg-gradient-to-b dark:from-zinc-900 dark:to-zinc-950 border-2 border-purple-500/80 shadow-xl shadow-purple-500/10 scale-[1.02]"
          : "bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/[0.08] shadow-sm hover:shadow-md"
      }`}
    >
      {/* Popular Pill */}
      {isPopular && (
        <div className="absolute top-0 right-0">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-2xl shadow-md">
            <Sparkles className="w-3 h-3" /> Most Popular
          </span>
        </div>
      )}

      {/* Active Plan Pill */}
      {isActivePlan && (
        <div className="absolute top-0 left-0">
          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-br-2xl shadow-md">
            <Check className="w-3 h-3" /> Active Plan
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Tier Header */}
        <div className="space-y-3 pt-2">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              tierKey === "pro"
                ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-md shadow-purple-500/15"
                : tierKey === "one-time"
                ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {getTitle()}
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
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
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                {formatPrice(tierData.amount || 49)}
              </span>
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                / one-time (21 days)
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                  {formatPrice(tierData?.monthly?.amount || 199)}
                </span>
                <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                  / month
                </span>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Or {formatPrice(tierData?.yearly?.amount || 1499)}/year (Save 37%)
              </p>
            </div>
          )}
        </div>

        {/* Features Checklist */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
            Included Capabilities:
          </p>
          <ul className="space-y-2">
            {tierData.features?.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-zinc-300"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Buttons Footer */}
      <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/5">
        {tierKey === "pro" ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectPlan("pro", "monthly")}
              disabled={isActivePlan}
              className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                isActivePlan
                  ? "bg-gray-200 dark:bg-zinc-800 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20"
              }`}
            >
              <span>Monthly</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectPlan("pro", "yearly")}
              disabled={isActivePlan}
              className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer ${
                isActivePlan
                  ? "bg-gray-200 dark:bg-zinc-800 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
              }`}
            >
              <span>Yearly</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSelectPlan(tierKey, tierData.plan || "one-time")}
            disabled={isActivePlan}
            className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
              isActivePlan
                ? "bg-gray-200 dark:bg-zinc-800 text-gray-500 cursor-not-allowed"
                : tierKey === "one-time"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                : "bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-sm"
            }`}
          >
            <span>
              {isActivePlan
                ? "Current Active Plan ✓"
                : tierKey === "free"
                ? "Get Started Free"
                : "Choose One-Time Plan"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
