import {useState, useEffect} from "react";
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  Zap,
  Activity,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Server,
  FileText,
  MessageSquare,
  HelpCircle,
  Sliders,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getOpenAICreditStatus,
  refillOpenAICredits,
  setExactOpenAIBalance,
  updateOpenAICreditSettings,
  checkOpenAIQuotaHealth,
} from "@/api/admin.api";

export default function OpenAICreditTracker({onRefreshNeeded}) {
  const [creditData, setCreditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState(null);
  const [isCurrencyInr, setIsCurrencyInr] = useState(false);

  // Modal states
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [modalMode, setModalMode] = useState("set_exact"); // 'set_exact' | 'add_pool' | 'reset'
  const [balanceAmount, setBalanceAmount] = useState("10");
  const [refillNotes, setRefillNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState("2.00");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const res = await getOpenAICreditStatus();
      if (res.data?.success) {
        setCreditData(res.data.data);
        if (res.data.data.budget?.alertThresholdUsd) {
          setAlertThreshold(String(res.data.data.budget.alertThresholdUsd));
        }
      }
    } catch (err) {
      console.error("Failed to load OpenAI credits:", err);
      toast.error(err.response?.data?.message || "Failed to load OpenAI credits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const handleTestHealth = async () => {
    try {
      setTestingHealth(true);
      const res = await checkOpenAIQuotaHealth();
      setHealthResult(res.data.data);
      if (res.data.data?.healthy) {
        toast.success(`OpenAI API Active • ${res.data.data.responseTimeMs}ms latency`);
      } else {
        toast.error(res.data.data?.message || "OpenAI Quota/Connection Issue Detected");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Health test failed");
    } finally {
      setTestingHealth(false);
    }
  };

  const handleBalanceSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid dollar amount");
      return;
    }

    try {
      setIsSubmitting(true);
      let res;
      if (modalMode === "set_exact") {
        res = await setExactOpenAIBalance({
          exactBalanceUsd: amount,
          notes: refillNotes,
        });
      } else {
        res = await refillOpenAICredits({
          amountUsd: amount,
          isReset: modalMode === "reset",
          notes: refillNotes,
        });
      }

      if (res.data?.success) {
        setCreditData(res.data.data);
        toast.success(res.data.message || `Balance updated to $${amount.toFixed(2)}`);
        setShowRefillModal(false);
        setRefillNotes("");
        if (onRefreshNeeded) onRefreshNeeded();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update credits");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const threshold = parseFloat(alertThreshold);
    if (isNaN(threshold) || threshold < 0) {
      toast.error("Please enter a valid alert threshold");
      return;
    }

    try {
      setIsSavingSettings(true);
      const res = await updateOpenAICreditSettings({
        alertThresholdUsd: threshold,
      });

      if (res.data?.success) {
        setCreditData(res.data.data);
        toast.success("Credit alert threshold saved");
        setShowSettingsModal(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (loading && !creditData) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-sm flex items-center justify-center min-h-[220px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
          <span className="text-sm font-medium text-slate-300">
            Checking OpenAI Account Credit Balance...
          </span>
        </div>
      </div>
    );
  }

  const budget = creditData?.budget || {
    allocatedUsd: 10,
    remainingUsd: 10,
    spentPeriodUsd: 0,
    percentRemaining: 100,
    allocatedInr: 865,
    remainingInr: 865,
    spentPeriodInr: 0,
  };

  const stats = creditData?.usageStats || {};
  const remainingOps = creditData?.estimatedRemaining || {};
  const status = creditData?.status || "healthy";
  const exchangeRate = creditData?.exchangeRate || 86.5;

  const formatCurrency = (usdVal, inrVal) => {
    if (isCurrencyInr) {
      const val = inrVal !== undefined ? inrVal : (usdVal || 0) * exchangeRate;
      return `₹${val.toLocaleString("en-IN", {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    return `$${(usdVal || 0).toFixed(2)}`;
  };

  const getStatusBadge = () => {
    if (status === "depleted" || (healthResult && !healthResult.healthy)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-semibold animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" /> Quota Depleted / Empty
        </span>
      );
    }
    if (status === "low") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" /> Low Credit Alert (&lt; {formatCurrency(budget.alertThresholdUsd, budget.alertThresholdInr)})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" /> OpenAI Balance Active
      </span>
    );
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl shadow-indigo-950/40">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Quick Actions */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-white">
                OpenAI Account Credits & Balance Tracker
              </h2>
              {getStatusBadge()}
              {creditData?.syncMode === "live_openai_synced" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-[11px] font-semibold">
                  <Server className="w-3 h-3 text-blue-400" />
                  Live OpenAI Org: {creditData.liveOrgData?.orgName || "Connected"}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 mt-0.5">
              Accurate live credit monitoring, token burn-rate analytics, and quota exhaustion safeguards.
            </p>
          </div>
        </div>

        {/* Currency & Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Refresh Sync Button */}
          <button
            onClick={fetchCredits}
            className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 rounded-xl transition-colors flex items-center gap-1.5"
            title="Fetch latest metrics from OpenAI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            <span>Sync Live</span>
          </button>

          {/* Currency Switcher */}
          <button
            onClick={() => setIsCurrencyInr(!isCurrencyInr)}
            className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 rounded-xl transition-colors flex items-center gap-1.5"
            title="Toggle USD / INR view"
          >
            <span>Currency:</span>
            <span className="font-bold text-emerald-400">
              {isCurrencyInr ? "INR (₹)" : "USD ($)"}
            </span>
          </button>

          {/* Test Health / Quota Button */}
          <button
            onClick={handleTestHealth}
            disabled={testingHealth}
            className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Ping OpenAI API to verify quota & key authorization"
          >
            <Activity className={`w-3.5 h-3.5 ${testingHealth ? "animate-spin" : ""}`} />
            <span>{testingHealth ? "Pinging..." : "Check Quota"}</span>
          </button>

          {/* Set Exact / Top Up Button */}
          <button
            onClick={() => {
              setModalMode("set_exact");
              setBalanceAmount(String(budget.remainingUsd || "10"));
              setShowRefillModal(true);
            }}
            className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Set / Top Up Balance</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            title="Configure Low Credit Alert Threshold"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {/* 1. Available Credits */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Available Balance</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight text-emerald-400">
              {formatCurrency(budget.remainingUsd, budget.remainingInr)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>Allocated: {formatCurrency(budget.allocatedUsd, budget.allocatedInr)}</span>
              <span className="font-semibold text-slate-300">
                {budget.percentRemaining}% Left
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budget.percentRemaining > 30
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : budget.percentRemaining > 15
                    ? "bg-gradient-to-r from-amber-500 to-orange-400"
                    : "bg-gradient-to-r from-rose-500 to-red-500"
                }`}
                style={{width: `${Math.max(3, budget.percentRemaining)}%`}}
              />
            </div>
          </div>
        </div>

        {/* 2. Total OpenAI Spent (Current Period) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Tracked OpenAI Usage</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight text-white">
              {formatCurrency(budget.spentPeriodUsd, budget.spentPeriodInr)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
              <span>{stats.periodCalls || 0} API requests</span>
              <span>{(stats.periodTokens || 0).toLocaleString()} tokens</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 truncate">
              Since {budget.lastRefillDate ? new Date(budget.lastRefillDate).toLocaleDateString() : "inception"}
            </div>
          </div>
        </div>

        {/* 3. Average Burn Rate per Call */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Avg. Cost per Request</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold tracking-tight text-white">
              {isCurrencyInr
                ? `₹${(stats.avgCallCostInr || 0).toFixed(3)}`
                : `$${(stats.avgCallCostUsd || 0).toFixed(4)}`}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              All-time spend: {formatCurrency(stats.allTimeSpentUsd, stats.allTimeSpentInr)}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Across {(stats.allTimeCalls || 0).toLocaleString()} total OpenAI operations
            </div>
          </div>
        </div>

        {/* 4. Live Health & Model Status */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>API Engine & Status</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              GPT-4o Omnimodel
            </div>
            <div className="text-xs text-slate-300 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token Tracking: Active</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 truncate">
              {healthResult
                ? `Latency: ${healthResult.responseTimeMs}ms • Status: ${healthResult.status}`
                : "API Key Authorized"}
            </div>
          </div>
        </div>
      </div>

      {/* Burn-rate & Capacity Forecasting Cards */}
      <div className="relative z-10 mt-6 bg-white/[0.03] border border-white/10 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Remaining Operations Capacity Forecast
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Calculated with current balance ({formatCurrency(budget.remainingUsd, budget.remainingInr)})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS Resume Scans</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              ~{(remainingOps.atsScans || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">
              @ ~{formatCurrency(creditData?.burnRate?.avgAtsCostUsd || 0.0075)} / scan
            </span>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Bullet Enhancements</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              ~{(remainingOps.resumeEnhancements || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">
              @ ~{formatCurrency(creditData?.burnRate?.avgEnhanceCostUsd || 0.004)} / rewrite
            </span>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Interviews</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              ~{(remainingOps.interviews || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">
              @ ~{formatCurrency(creditData?.burnRate?.avgInterviewCostUsd || 0.0025)} / eval
            </span>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Total API Requests</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              ~{(remainingOps.totalCalls || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">
              @ current avg request size
            </span>
          </div>
        </div>
      </div>

      {/* Set Balance / Top Up Modal */}
      {showRefillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Update OpenAI Account Credits
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sync your exact live OpenAI dashboard balance or add credits
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRefillModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBalanceSubmit} className="mt-5 space-y-4">
              {/* Mode Tabs */}
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setModalMode("set_exact")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    modalMode === "set_exact"
                      ? "bg-emerald-500 text-slate-950 shadow font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Set Exact Balance
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode("add_pool")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    modalMode === "add_pool"
                      ? "bg-emerald-500 text-slate-950 shadow font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  + Add Top-up
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode("reset")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    modalMode === "reset"
                      ? "bg-emerald-500 text-slate-950 shadow font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Reset Budget
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {modalMode === "set_exact"
                    ? "Enter Exact Current OpenAI Balance (USD $)"
                    : modalMode === "add_pool"
                    ? "Amount to Add to Balance (USD $)"
                    : "New Total Budget Pool (USD $)"}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-white font-semibold focus:outline-none focus:border-emerald-500 text-base"
                    placeholder="25.00"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    ≈ ₹{(parseFloat(balanceAmount || 0) * exchangeRate).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2">
                {["5", "10", "20", "50", "100"].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBalanceAmount(amt)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      balanceAmount === amt
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Notes / Billing Reference (Optional)
                </label>
                <input
                  type="text"
                  value={refillNotes}
                  onChange={(e) => setRefillNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800/80 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., Synced from OpenAI platform.openai.com/billing"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowRefillModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Updating..."
                    : modalMode === "set_exact"
                    ? "Set Exact Balance"
                    : modalMode === "reset"
                    ? "Reset Budget"
                    : "Add Credits"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Credit Alert Settings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Set low-balance warning triggers & notification limits
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSettingsSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Low Balance Alert Threshold (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-xl text-white font-semibold focus:outline-none focus:border-amber-500 text-sm"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  When remaining balance falls below this amount, the system will create an admin warning alert.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {isSavingSettings ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
