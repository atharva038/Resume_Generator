import {useState, useEffect} from "react";
import {TrendingUp, DollarSign, Clock, Activity, Filter, Sparkles, Shield, BarChart3} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {getAIAnalytics} from "@/api/admin.api";
import AIQuotaManagement from "./AIQuotaManagement";
import AIExtractionManagement from "./AIExtractionManagement";

const AIAnalytics = () => {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'quotas' | 'extraction'
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    period: "7d",
    feature: "",
  });

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAIAnalytics(filters);
      setAnalytics(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching AI analytics:", err);
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const exchangeRate = 86.5;
  const formatInr = (usdCost) => {
    const inr = (usdCost || 0) * exchangeRate;
    if (inr >= 1) return `₹${inr.toFixed(2)}`;
    if (inr > 0) return `₹${inr.toFixed(3)}`;
    return `₹0.00`;
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-medium text-orange-400">
              AI Operations Hub
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Usage & Quota Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor model analytics, token costs, user quota limits, and resume extraction counters.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/10 gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          AI Analytics & Token Costs
        </button>

        <button
          onClick={() => setActiveTab("quotas")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "quotas"
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Shield className="w-4 h-4" />
          User AI Quota Limits
        </button>

        <button
          onClick={() => setActiveTab("extraction")}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "extraction"
              ? "border-orange-500 text-orange-600 dark:text-orange-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Resume Extraction Counters
        </button>
      </div>

      {activeTab === "quotas" && <AIQuotaManagement />}
      {activeTab === "extraction" && <AIExtractionManagement />}

      {activeTab === "overview" && (
        loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center animate-pulse">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-gray-500 text-sm">Loading AI analytics...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-black rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filters.period}
                  onChange={(e) =>
                    setFilters((prev) => ({...prev, period: e.target.value}))
                  }
                  className="px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/40 transition-all"
                >
                  <option value="24h" className="bg-white dark:bg-[#1a1a1a]">
                    Last 24 Hours
                  </option>
                  <option value="7d" className="bg-white dark:bg-[#1a1a1a]">
                    Last 7 Days
                  </option>
                  <option value="30d" className="bg-white dark:bg-[#1a1a1a]">
                    Last 30 Days
                  </option>
                  <option value="90d" className="bg-white dark:bg-[#1a1a1a]">
                    Last 90 Days
                  </option>
                </select>
                <select
                  value={filters.feature}
                  onChange={(e) =>
                    setFilters((prev) => ({...prev, feature: e.target.value}))
                  }
                  className="px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/40 transition-all"
                >
                  <option value="" className="bg-white dark:bg-[#1a1a1a]">
                    All Features
                  </option>
                  <option value="ats_analysis" className="bg-white dark:bg-[#1a1a1a]">
                    ATS Analysis
                  </option>
                  <option value="resume_enhancement" className="bg-white dark:bg-[#1a1a1a]">
                    Resume Enhancement
                  </option>
                  <option value="github_import" className="bg-white dark:bg-[#1a1a1a]">
                    GitHub Import
                  </option>
                  <option value="ai_suggestions" className="bg-white dark:bg-[#1a1a1a]">
                    AI Suggestions
                  </option>
                </select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total API Calls */}
              <div className="group relative bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-white/[0.07] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total API Calls</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics?.totals?.totalCalls || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* OpenAI Stats */}
              <div className="group relative bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-6 hover:border-green-300 dark:hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-500 dark:text-green-400 text-sm font-semibold">
                      OpenAI (GPT-4o)
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics?.totals?.openaiCalls || 0} calls
                    </p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatInr(analytics?.totals?.openaiCost)}
                      <span className="text-xs font-normal text-gray-400 ml-1">
                        (≈ ${(analytics?.totals?.openaiCost || 0).toFixed(2)})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Gemini Stats */}
              <div className="group relative bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-indigo-500 dark:text-indigo-400 text-sm font-semibold">
                      Gemini Flash
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analytics?.totals?.geminiCalls || 0} calls
                    </p>
                    <p className="text-sm font-bold text-indigo-500 dark:text-indigo-400">
                      {formatInr(analytics?.totals?.geminiCost)}
                      <span className="text-xs font-normal text-gray-400 ml-1">
                        (≈ ${(analytics?.totals?.geminiCost || 0).toFixed(2)})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Cost */}
              <div className="group relative bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-white/[0.07] hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Expense</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatInr(analytics?.totals?.totalCost)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ≈ ${(analytics?.totals?.totalCost || 0).toFixed(2)} USD • {analytics?.totals?.totalTokens?.toLocaleString() || 0} tokens
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Comparison */}
            <div className="bg-white dark:bg-black rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Provider Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-500/20">
                  <p className="text-sm text-green-500 dark:text-green-400 font-semibold mb-2">
                    OpenAI
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics?.totals?.openaiCalls || 0}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {((analytics?.totals?.openaiTokens || 0) / 1000).toFixed(1)}K tokens
                  </p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                    {formatInr(analytics?.totals?.openaiCost)}
                  </p>
                </div>

                <div className="text-center p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
                  <p className="text-sm text-indigo-500 dark:text-indigo-400 font-semibold mb-2">
                    Gemini
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics?.totals?.geminiCalls || 0}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {((analytics?.totals?.geminiTokens || 0) / 1000).toFixed(1)}K tokens
                  </p>
                  <p className="text-lg font-bold text-indigo-500 dark:text-indigo-400 mt-2">
                    {formatInr(analytics?.totals?.geminiCost)}
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10">
                  <p className="text-sm text-gray-400 font-semibold mb-2">
                    Hybrid
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics?.totals?.hybridCalls || 0}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Mixed usage</p>
                  <p className="text-lg font-semibold text-gray-400 mt-2">-</p>
                </div>
              </div>
            </div>

            {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <div className="bg-white dark:bg-black rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            API Calls Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.charts?.usageOverTime || []}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="_id"
                stroke="#9CA3AF"
                tick={{fill: "#9CA3AF", fontSize: 12}}
              />
              <YAxis stroke="#9CA3AF" tick={{fill: "#9CA3AF", fontSize: 12}} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 17, 17, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
                labelStyle={{color: "#fff"}}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="API Calls"
                dot={{fill: "#3b82f6", strokeWidth: 2}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Usage by Feature */}
        <div className="bg-white dark:bg-black rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Usage by Feature
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.charts?.usageByFeature || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({_id, count}) => `${_id}: ${count}`}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="count"
                paddingAngle={5}
              >
                {(analytics?.charts?.usageByFeature || []).map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="transparent"
                    />
                  )
                )}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 17, 17, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-white dark:bg-black rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Users by API Usage
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Total Calls
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-green-400 uppercase">
                  OpenAI
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-500 dark:text-indigo-400 uppercase">
                  Gemini
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {(analytics?.topUsers || []).map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-black text-sm font-medium">
                        {user.userName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.userName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.count}
                    </div>
                    <div className="text-xs text-gray-400">
                      {((user.totalTokens || 0) / 1000).toFixed(1)}K tokens
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-400">
                      {user.openaiCalls || 0} calls
                    </div>
                    <div className="text-xs text-gray-400">
                      ${(user.openaiCost || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-indigo-500 dark:text-indigo-400">
                      {user.geminiCalls || 0} calls
                    </div>
                    <div className="text-xs text-gray-400">
                      ${(user.geminiCost || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      ${(user.totalCost || 0).toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white dark:bg-black rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent API Calls
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Feature
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Tokens
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {(analytics?.recentLogs || []).slice(0, 20).map((log, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.userId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300 border border-primary-200 dark:border-primary-500/20 rounded-lg">
                      {log.feature}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        log.status === "success"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.tokensUsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatInr(log.cost)}
                    </p>
                    <span className="text-[11px] text-gray-400">
                      ≈ ${(log.cost || 0).toFixed(4)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
          </div>
        )
      )}
    </div>
  );
};

export default AIAnalytics;
