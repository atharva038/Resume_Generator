import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FaCrown, FaExclamationTriangle} from "react-icons/fa";
import {getUsageStats} from "../../services/subscription.api";

/**
 * Usage Badge Component
 * Shows current tier and usage warnings
 */
export const UsageBadge = ({compact = false}) => {
  const [usage, setUsage] = useState(null);
  const [tier, setTier] = useState("free");

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const data = await getUsageStats();
      setUsage(data);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setTier(user.subscription?.tier || "free");
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      free: "bg-gray-500",
      "one-time": "bg-blue-500",
      pro: "bg-purple-500",
      premium: "bg-yellow-500",
      lifetime: "bg-pink-500",
    };
    return colors[tier] || "bg-gray-500";
  };

  const hasWarning = () => {
    if (!usage) return false;
    const checks = [
      {used: usage.resumesUsed, limit: usage.resumesLimit},
      {used: usage.atsScansUsed, limit: usage.atsScansLimit},
      {used: usage.jobMatchesUsed, limit: usage.jobMatchesLimit},
      {used: usage.coverLettersUsed, limit: usage.coverLettersLimit},
    ];
    return checks.some(
      ({used, limit}) => limit && limit !== Infinity && used / limit >= 0.8
    );
  };

  if (compact) {
    return (
      <Link to="/subscription">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full ${getTierColor(
            tier
          )} text-white text-sm font-semibold hover:opacity-90 transition-all relative`}
        >
          <FaCrown className="text-xs" />
          <span>{tier.toUpperCase()}</span>
          {hasWarning() && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link to="/subscription">
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-lg ${getTierColor(
          tier
        )} text-white hover:opacity-90 transition-all shadow-md`}
      >
        <FaCrown className="text-xl" />
        <div>
          <div className="font-bold text-sm">{tier.toUpperCase()} Plan</div>
          {hasWarning() && (
            <div className="text-xs flex items-center gap-1 mt-1">
              <FaExclamationTriangle className="text-xs" />
              <span>Usage limit warning</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

/**
 * Usage Progress Component
 * Shows progress bar for specific usage type
 */
export const UsageProgress = ({type, label}) => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const data = await getUsageStats();
      setUsage(data);
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUsageData = () => {
    if (!usage) return {used: 0, limit: 0};

    const mapping = {
      resumes: {used: usage.resumesUsed, limit: usage.resumesLimit},
      atsScans: {used: usage.atsScansUsed, limit: usage.atsScansLimit},
      jobMatches: {used: usage.jobMatchesUsed, limit: usage.jobMatchesLimit},
      coverLetters: {
        used: usage.coverLettersUsed,
        limit: usage.coverLettersLimit,
      },
    };

    return mapping[type] || {used: 0, limit: 0};
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-4 rounded-full"></div>;
  }

  const {used, limit} = getUsageData();

  if (limit === Infinity) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-green-600">Unlimited</span>
      </div>
    );
  }

  if (limit === 0) return null;

  const percentage = (used / limit) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">
          {used} / {limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getProgressColor(
            percentage
          )}`}
          style={{width: `${Math.min(percentage, 100)}%`}}
        ></div>
      </div>
      {percentage >= 80 && (
        <div className="text-xs text-orange-600 mt-1">
          {percentage >= 100
            ? "Limit reached!"
            : `${(100 - percentage).toFixed(0)}% remaining`}
        </div>
      )}
    </div>
  );
};

/**
 * Tier Indicator Component
 * Shows tier with icon and optional upgrade prompt
 */
export const TierIndicator = ({showUpgrade = true}) => {
  const [tier, setTier] = useState("free");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setTier(user.subscription?.tier || "free");
  }, []);

  const getTierInfo = (tier) => {
    const info = {
      free: {label: "Free", color: "gray", icon: "⭐"},
      "one-time": {label: "One-Time", color: "blue", icon: "🚀"},
      pro: {label: "Pro", color: "purple", icon: "👑"},
      premium: {label: "Premium", color: "yellow", icon: "👑"},
      lifetime: {label: "Lifetime", color: "pink", icon: "♾️"},
    };
    return info[tier] || info.free;
  };

  const tierInfo = getTierInfo(tier);

  return (
    <div
      className={`bg-${tierInfo.color}-50 border border-${tierInfo.color}-200 rounded-lg p-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{tierInfo.icon}</span>
          <div>
            <div className="font-bold text-gray-900">{tierInfo.label} Plan</div>
            <div className="text-sm text-gray-600">Current subscription</div>
          </div>
        </div>
        {showUpgrade && tier === "free" && (
          <Link
            to="/pricing"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Upgrade
          </Link>
        )}
      </div>
    </div>
  );
};

/**
 * Usage Summary Card Component
 * Compact card showing all usage stats
 */
export const UsageSummaryCard = () => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const data = await getUsageStats();
      setUsage(data);
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!usage) return null;

  const stats = [
    {label: "Resumes", used: usage.resumesUsed, limit: usage.resumesLimit},
    {label: "ATS Scans", used: usage.atsScansUsed, limit: usage.atsScansLimit},
    {
      label: "Job Matches",
      used: usage.jobMatchesUsed,
      limit: usage.jobMatchesLimit,
    },
    {
      label: "Cover Letters",
      used: usage.coverLettersUsed,
      limit: usage.coverLettersLimit,
    },
  ].filter((stat) => stat.limit && stat.limit > 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-gray-900 mb-3">Usage This Month</h3>
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{stat.label}</span>
            <span className="font-semibold text-gray-900">
              {stat.limit === Infinity ? "∞" : `${stat.used}/${stat.limit}`}
            </span>
          </div>
        ))}
      </div>
      <Link
        to="/subscription"
        className="block mt-4 text-center text-purple-600 hover:text-purple-700 font-semibold text-sm"
      >
        View Details →
      </Link>
    </div>
  );
};

export default {
  UsageBadge,
  UsageProgress,
  TierIndicator,
  UsageSummaryCard,
};
