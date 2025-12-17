import {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
  FaCrown,
  FaCalendarAlt,
  FaChartLine,
  FaRocket,
  FaExclamationTriangle,
  FaCheckCircle,
  FaStar,
  FaCog,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  getSubscriptionStatus,
  getUsageStats,
  getSubscriptionHistory,
  cancelSubscription,
  getAIConfig,
  updateAIPreference,
} from "@/api/subscription.api";
import toast from "react-hot-toast";
import {useToggle} from "@/hooks";

/**
 * Subscription Dashboard Component
 * Shows current subscription, usage statistics, and management options
 * @param {boolean} embedded - Whether the component is embedded in another page (removes outer container)
 */
const SubscriptionDashboard = ({embedded = false}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiConfig, setAiConfig] = useState(null);
  const [
    showCancelModal,
    toggleCancelModal,
    setShowCancelModalTrue,
    setShowCancelModalFalse,
  ] = useToggle(false);
  const [cancelReason, setCancelReason] = useState("");
  const [
    showAISettings,
    toggleAISettings,
    setShowAISettingsTrue,
    setShowAISettingsFalse,
  ] = useToggle(false);
  const [selectedAI, setSelectedAI] = useState("auto");

  useEffect(() => {
    fetchDashboardData();

    // Show success message if redirected after payment
    if (location.state?.subscriptionActivated) {
      toast.success("🎉 Subscription activated successfully!");
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [subData, usageData, historyData, aiData] = await Promise.all([
        getSubscriptionStatus(),
        getUsageStats(),
        getSubscriptionHistory(),
        getAIConfig(),
      ]);

      console.log("📊 Dashboard - Subscription data:", subData);
      console.log("📊 Dashboard - Usage data:", usageData);
      console.log("📊 Dashboard - History data:", historyData);

      // Extract subscription from response (API returns {success: true, subscription: {...}})
      setSubscription(subData?.subscription || subData);

      // Transform usage data from nested structure to flat structure
      const transformedUsage = usageData?.stats?.usage
        ? {
            resumesUsed: usageData.stats.usage.resumes?.used || 0,
            resumesLimit: usageData.stats.usage.resumes?.limit || 0,
            aiGenerationsUsed: usageData.stats.usage.aiGenerations?.used || 0,
            aiGenerationsLimit: usageData.stats.usage.aiGenerations?.limit || 0,
            atsScansUsed: usageData.stats.usage.atsScans?.used || 0,
            atsScansLimit: usageData.stats.usage.atsScans?.limit || 0,
            jobMatchesUsed: usageData.stats.usage.jobMatches?.used || 0,
            jobMatchesLimit: usageData.stats.usage.jobMatches?.limit || 0,
            coverLettersUsed: usageData.stats.usage.coverLetters?.used || 0,
            coverLettersLimit: usageData.stats.usage.coverLetters?.limit || 0,
            resetDate: usageData.stats.resetDate || null,
          }
        : usageData;

      setUsage(transformedUsage);
      // Extract history from response (API returns {success: true, history: [...]})
      setHistory(historyData?.history || historyData || []);
      setAiConfig(aiData);
      setSelectedAI(aiData?.preference || "auto");
    } catch (error) {
      toast.error("Failed to load subscription data");
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription(cancelReason);
      toast.success(
        "Subscription cancelled. Access until " + subscription.endDate
      );
      setShowCancelModalFalse();
      fetchDashboardData();
    } catch (error) {
      toast.error(error.error || "Failed to cancel subscription");
    }
  };

  const handleRenewSubscription = async () => {
    try {
      // Get current subscription details
      if (!subscription?.tier || !subscription?.plan) {
        toast.error("Unable to determine subscription details");
        return;
      }

      // Show loading toast
      toast.loading("Redirecting to renewal...", {duration: 1500});

      // Simply redirect to pricing page - user will select the same plan
      // This is cleaner than pre-creating the order
      setTimeout(() => {
        navigate("/pricing");
      }, 1500);
    } catch (error) {
      console.error("Renew error:", error);
      toast.error("Failed to redirect to renewal");
    }
  };

  const handleUpdateAIPreference = async (preference) => {
    try {
      await updateAIPreference(preference);
      setSelectedAI(preference);
      toast.success(`AI preference updated to ${preference.toUpperCase()}`);
      setShowAISettingsFalse();
      fetchDashboardData();
    } catch (error) {
      toast.error(error.error || "Failed to update AI preference");
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getTierColor = (tier) => {
    const colors = {
      free: "text-gray-600 dark:text-gray-300",
      "one-time": "text-blue-600",
      pro: "text-purple-600",
      premium: "text-yellow-600",
      lifetime: "text-pink-600",
    };
    return colors[tier] || "text-gray-600 dark:text-gray-300";
  };

  const getTierBadge = (tier) => {
    const badges = {
      free: {bg: "bg-gray-100", text: "text-gray-800", icon: <FaStar />},
      "one-time": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <FaRocket />,
      },
      pro: {bg: "bg-purple-100", text: "text-purple-800", icon: <FaCrown />},
      premium: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <FaCrown />,
      },
      lifetime: {bg: "bg-pink-100", text: "text-pink-800", icon: <FaCrown />},
    };
    return badges[tier] || badges.free;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate purchase statistics
  const getPurchaseStats = () => {
    if (!history || history.length === 0) return null;

    const stats = {
      total: history.length,
      oneTimePlans: history.filter((h) => h.tier === "one-time").length,
      proPlans: history.filter((h) => h.tier === "pro").length,
      totalSpent: history.reduce((sum, h) => sum + (h.amount || 0), 0),
      hasActivePro:
        subscription?.tier === "pro" && subscription?.status === "active",
    };

    return stats;
  };

  // Get all active one-time plans with their individual expiry dates
  const getActiveOneTimePlans = () => {
    if (!history || history.length === 0) return [];

    return history
      .filter(
        (h) =>
          h.tier === "one-time" &&
          h.status === "active" &&
          new Date(h.endDate) > new Date()
      )
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Sort by newest first
  };

  // Get all active Pro plans with their individual expiry dates
  const getActiveProPlans = () => {
    if (!history || history.length === 0) return [];

    return history
      .filter(
        (h) =>
          h.tier === "pro" &&
          h.status === "active" &&
          new Date(h.endDate) > new Date()
      )
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Sort by newest first
  };

  if (loading) {
    return (
      <div
        className={
          embedded
            ? "flex items-center justify-center py-12"
            : "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
        }
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const badge = getTierBadge(subscription?.tier || "free");

  // Content component (without outer wrapper)
  const DashboardContent = () => (
    <div
      className={`max-w-7xl mx-auto ${embedded ? "" : "px-4 sm:px-6 lg:px-8"}`}
    >
      {/* Header - only show if not embedded */}
      {!embedded && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-1">
            Subscription Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-700 dark:text-gray-300 text-sm">
            Manage your subscription and track your usage
          </p>
        </div>
      )}

      {/* Current Plan Card - Only show for Free tier */}
      {subscription?.tier === "free" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div
                className={`${badge.bg} ${badge.text} p-3 rounded-full text-2xl mr-3`}
              >
                {badge.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase">
                  Free Plan
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  <span className="flex items-center text-green-600">
                    <FaCheckCircle className="mr-2" /> Active
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/pricing")}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg text-sm"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Active Pro Plans Timeline */}
      {(() => {
        const activeProPlans = getActiveProPlans();
        if (activeProPlans.length === 0) return null;

        return (
          <div className="mb-6 mt-6">
            <div className="flex items-center mb-4">
              <FaCrown className="text-2xl text-purple-600 mr-2" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Active Pro Plans
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  You have {activeProPlans.length} active Pro subscription
                  {activeProPlans.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeProPlans.map((plan, index) => {
                const daysRemaining = Math.max(
                  0,
                  Math.ceil(
                    (new Date(plan.endDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                );
                const totalDays = plan.plan === "monthly" ? 30 : 365;
                const progressPercentage = Math.min(
                  100,
                  ((totalDays - daysRemaining) / totalDays) * 100
                );

                return (
                  <div
                    key={plan._id || index}
                    className="bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden"
                  >
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 border-b border-purple-200 dark:border-purple-800/30">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            Pro Plan #{activeProPlans.length - index}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {plan.plan === "monthly" ? "Monthly" : "Yearly"}{" "}
                            Subscription
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Started: {formatDate(plan.startDate)}
                          </p>
                        </div>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Next Renewal
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatDate(plan.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Days Until Renewal
                          </p>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {daysRemaining}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Billing Cycle Progress</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-purple-600 transition-all"
                            style={{width: `${progressPercentage}%`}}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-black rounded-lg p-3 mb-3 border border-gray-200 dark:border-zinc-800">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          ✨ Your Pro Benefits:
                        </p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li>🤖 Unlimited AI Requests</li>
                          <li>📄 5 Resumes per month</li>
                          <li>🎯 Premium AI Models (GPT-4o)</li>
                          <li>💎 Priority Support</li>
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-black rounded-lg p-3 mb-4 border border-gray-200 dark:border-zinc-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          💳 Auto-renewal on {formatDate(plan.endDate)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          You'll be charged ₹
                          {plan.plan === "monthly" ? "199" : "1999"} for the
                          next billing cycle
                        </p>
                      </div>

                      {plan.receiptId && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Receipt: {plan.receiptId}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons for Pro Plan */}
                    <div className="p-3 bg-gray-50 dark:bg-zinc-900 flex flex-wrap gap-2 border-t border-gray-200 dark:border-zinc-800">
                      <button
                        onClick={() => navigate("/pricing")}
                        className="flex-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-700 transition-all text-xs"
                      >
                        Change Plan
                      </button>
                      <button
                        onClick={handleRenewSubscription}
                        className="flex-1 bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700 transition-all text-xs"
                      >
                        Renew Now
                      </button>
                      <button
                        onClick={setShowCancelModalTrue}
                        className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition-all text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-600 p-3 rounded-r-lg">
              <p className="text-xs text-purple-800 dark:text-purple-300">
                🎉 <strong>Pro Member:</strong> Enjoy unlimited resumes, premium
                AI models, and priority support!
              </p>
            </div>
          </div>
        );
      })()}

      {/* All Active One-Time Plans */}
      {(() => {
        const activeOneTimePlans = getActiveOneTimePlans();
        if (activeOneTimePlans.length === 0) return null;

        return (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FaRocket className="text-2xl text-blue-600 mr-2" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Active One-Time Plans
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  You have {activeOneTimePlans.length} active one-time plan
                  {activeOneTimePlans.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOneTimePlans.map((plan, index) => {
                const daysRemaining = Math.max(
                  0,
                  Math.ceil(
                    (new Date(plan.endDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )
                );
                const progressPercentage = Math.min(
                  100,
                  ((21 - daysRemaining) / 21) * 100
                );

                return (
                  <div
                    key={plan._id || index}
                    className="bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 border-b border-blue-200 dark:border-blue-800/30">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            One-Time Plan #{activeOneTimePlans.length - index}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Started: {formatDate(plan.startDate)}
                          </p>
                        </div>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                            Expires On
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatDate(plan.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                            Days Left
                          </p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {daysRemaining}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Time Used</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              progressPercentage >= 90
                                ? "bg-red-500"
                                : progressPercentage >= 70
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{width: `${progressPercentage}%`}}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-black rounded-lg p-3 mb-3 border border-gray-200 dark:border-zinc-800">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          ✨ Your Plan Includes:
                        </p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <li>🤖 150 AI Requests (21-day period)</li>
                          <li>📄 1 Resume</li>
                          <li>🎯 Premium AI Models (GPT-4o)</li>
                          <li>⚡ Full Feature Access</li>
                        </ul>
                      </div>

                      {plan.receiptId && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Receipt: {plan.receiptId}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons for One-Time Plan */}
                    <div className="p-3 bg-gray-50 dark:bg-zinc-900 flex flex-wrap gap-2 border-t border-gray-200 dark:border-zinc-800">
                      <button
                        onClick={() => navigate("/pricing")}
                        className="flex-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-700 transition-all text-xs"
                      >
                        Upgrade to Pro
                      </button>
                      <button
                        onClick={handleRenewSubscription}
                        className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700 transition-all text-xs"
                      >
                        Buy Another
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-600 p-3 rounded-r-lg">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                💡 <strong>Tip:</strong> Each one-time plan gives you 21 days of
                access from its purchase date. You can buy multiple plans to
                extend your access period!
              </p>
            </div>
          </div>
        );
      })()}

      {/* Purchase Statistics */}
      {(() => {
        const stats = getPurchaseStats();
        if (!stats || stats.total === 0) return null;

        return (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-2xl text-purple-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Purchase Statistics
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Total Purchases */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                  <FaShoppingCart className="text-xl text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-700 dark:text-gray-300 font-medium">
                  Total Purchases
                </p>
              </div>

              {/* One-Time Plans */}
              {stats.oneTimePlans > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
                  <div className="flex items-center justify-between mb-1.5">
                    <FaRocket className="text-xl text-blue-500" />
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.oneTimePlans}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-700 dark:text-gray-300 font-medium">
                    One-Time Plans
                  </p>
                </div>
              )}

              {/* Pro Plans */}
              {stats.proPlans > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
                  <div className="flex items-center justify-between mb-1.5">
                    <FaCrown className="text-xl text-purple-500" />
                    <span className="text-2xl font-bold text-purple-600">
                      {stats.proPlans}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-700 dark:text-gray-300 font-medium">
                    Pro Plans
                  </p>
                </div>
              )}

              {/* Total Spent */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg p-3 shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                  <FaMoneyBillWave className="text-xl text-green-600" />
                  <span className="text-xl font-bold text-green-700 dark:text-green-400">
                    {formatPrice(stats.totalSpent)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-700 dark:text-gray-300 font-medium">
                  Total Investment
                </p>
              </div>
            </div>

            {/* Active Pro Status */}
            {stats.hasActivePro && (
              <div className="mt-3 bg-purple-100 dark:bg-purple-900 border-l-4 border-purple-600 p-3 rounded-r-lg">
                <div className="flex items-center">
                  <FaCrown className="text-purple-600 mr-2" />
                  <p className="text-xs text-purple-800 dark:text-purple-200 font-medium">
                    🎉 You're on our best plan! Enjoy unlimited features.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* AI Configuration (PRO only) */}
      {subscription?.tier === "pro" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                AI Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Current AI Model:{" "}
                <span className="font-semibold">
                  {aiConfig?.aiService?.toUpperCase() || "HYBRID"}
                </span>
              </p>
            </div>
            <button
              onClick={toggleAISettings}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center text-xs"
            >
              <FaCog className="mr-1.5" /> Configure
            </button>
          </div>

          {showAISettings && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
                Choose your preferred AI model for resume generation:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => handleUpdateAIPreference("auto")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAI === "auto"
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900"
                      : "border-gray-200 dark:border-gray-600 hover:border-purple-300"
                  }`}
                >
                  <h3 className="font-semibold mb-1.5 text-sm text-gray-900 dark:text-white">
                    Auto (Hybrid)
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    70% Gemini + 30% GPT-4o
                  </p>
                </button>
                <button
                  onClick={() => handleUpdateAIPreference("gemini")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAI === "gemini"
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900"
                      : "border-gray-200 dark:border-gray-600 hover:border-purple-300"
                  }`}
                >
                  <h3 className="font-semibold mb-1.5 text-sm text-gray-900 dark:text-white">
                    Gemini
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Fast & Cost-effective
                  </p>
                </button>
                <button
                  onClick={() => handleUpdateAIPreference("gpt4o")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAI === "gpt4o"
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900"
                      : "border-gray-200 dark:border-gray-600 hover:border-purple-300"
                  }`}
                >
                  <h3 className="font-semibold mb-1.5 text-sm text-gray-900 dark:text-white">
                    GPT-4o
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Highest Quality
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Usage Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
          Usage Statistics
        </h2>

        {usage && (
          <div className="space-y-4">
            {/* Resumes */}
            {usage.resumesLimit !== undefined && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                    Resumes Generated
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {usage.resumesUsed} /{" "}
                    {usage.resumesLimit === Infinity ? "∞" : usage.resumesLimit}
                  </span>
                </div>
                {usage.resumesLimit !== Infinity && (
                  <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 shadow-inner">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(
                        (usage.resumesUsed / usage.resumesLimit) * 100
                      )}`}
                      style={{
                        width: `${Math.min(
                          (usage.resumesUsed / usage.resumesLimit) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* AI Requests */}
            {usage.aiGenerationsLimit !== undefined && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                    AI Requests{" "}
                    {subscription?.tier === "one-time"
                      ? "(21-day period)"
                      : "(This Month)"}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {usage.aiGenerationsUsed} /{" "}
                    {usage.aiGenerationsLimit === Infinity
                      ? "∞"
                      : usage.aiGenerationsLimit}
                  </span>
                </div>
                {usage.aiGenerationsLimit !== Infinity && (
                  <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 shadow-inner">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(
                        (usage.aiGenerationsUsed / usage.aiGenerationsLimit) *
                          100
                      )}`}
                      style={{
                        width: `${Math.min(
                          (usage.aiGenerationsUsed / usage.aiGenerationsLimit) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                )}
                {usage.aiGenerationsLimit !== Infinity && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 AI features include: Resume parsing, content
                      enhancement, summary generation, and skills categorization
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ATS Scans */}
            {usage.atsScansLimit !== undefined && usage.atsScansLimit > 0 && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                    ATS Scans
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {usage.atsScansUsed} /{" "}
                    {usage.atsScansLimit === Infinity
                      ? "∞"
                      : usage.atsScansLimit}
                  </span>
                </div>
                {usage.atsScansLimit !== Infinity && (
                  <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 shadow-inner">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(
                        (usage.atsScansUsed / usage.atsScansLimit) * 100
                      )}`}
                      style={{
                        width: `${Math.min(
                          (usage.atsScansUsed / usage.atsScansLimit) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE - Job Matches */}
            {/* {usage.jobMatchesLimit !== undefined &&
              usage.jobMatchesLimit > 0 && (
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                      Job Matches (Today)
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {usage.jobMatchesUsed} /{" "}
                      {usage.jobMatchesLimit === Infinity
                        ? "∞"
                        : usage.jobMatchesLimit}
                    </span>
                  </div>
                  {usage.jobMatchesLimit !== Infinity && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(
                          (usage.jobMatchesUsed / usage.jobMatchesLimit) * 100
                        )}`}
                        style={{
                          width: `${Math.min(
                            (usage.jobMatchesUsed / usage.jobMatchesLimit) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              )} */}

            {/* Cover Letters */}
            {usage.coverLettersLimit !== undefined &&
              usage.coverLettersLimit > 0 && (
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                      Cover Letters
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {usage.coverLettersUsed} /{" "}
                      {usage.coverLettersLimit === Infinity
                        ? "∞"
                        : usage.coverLettersLimit}
                    </span>
                  </div>
                  {usage.coverLettersLimit !== Infinity && (
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 shadow-inner">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(
                          (usage.coverLettersUsed / usage.coverLettersLimit) *
                            100
                        )}`}
                        style={{
                          width: `${Math.min(
                            (usage.coverLettersUsed / usage.coverLettersLimit) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

            {/* Reset Date */}
            {usage.resetDate && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mt-3">
                <p className="text-xs text-blue-800 dark:text-blue-200 font-semibold">
                  Usage resets on: {formatDate(usage.resetDate)}
                </p>
              </div>
            )}
          </div>
        )}

        {!usage && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No usage data available
          </p>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
          Payment History
        </h2>

        {history && history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-200 font-semibold">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-200 font-semibold">
                    Receipt ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-200 font-semibold">
                    Plan
                  </th>
                  <th className="px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-200 font-semibold">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-200 font-semibold">
                    Payment ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs text-gray-700 dark:text-gray-200 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {history.map((payment, index) => (
                  <tr
                    key={payment._id || payment.receiptId || `payment-${index}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                      {formatDate(payment.createdAt || payment.date)}
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400">
                        {payment.receiptId || "LEGACY"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`font-semibold text-xs ${getTierColor(
                          payment.tier
                        )}`}
                      >
                        {payment.tier?.toUpperCase()} - {payment.plan}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-semibold text-xs text-gray-900 dark:text-white">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-500 dark:text-gray-600 dark:text-gray-400 break-all">
                        {payment.paymentId ? payment.paymentId : "N/A"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          payment.status === "active"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "expired"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 dark:text-gray-700 dark:text-gray-300 mb-3">
              No payment history yet
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
            >
              View Plans →
            </button>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-3">
              Cancel Subscription
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-700 dark:text-gray-300 mb-3">
              Are you sure you want to cancel your subscription? You'll continue
              to have access until {formatDate(subscription?.endDate)}.
            </p>
            <textarea
              placeholder="Tell us why you're cancelling (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-900 dark:text-white rounded-lg p-2.5 mb-3 focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={setShowCancelModalFalse}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-900 dark:text-white py-1.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all text-sm"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 text-gray-900 dark:text-white py-1.5 rounded-lg hover:bg-red-700 transition-all text-sm"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Return with or without container based on embedded prop
  if (embedded) {
    return <DashboardContent />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <DashboardContent />
      </div>
    </div>
  );
};

export default SubscriptionDashboard;
