import {useState, useEffect} from "react";
import {TrendingUp, DollarSign, Clock, Activity, Filter} from "lucide-react";
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

const AIAnalytics = () => {
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

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Usage Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
          Monitor AI API usage, costs, and performance
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filters.period}
            onChange={(e) =>
              setFilters((prev) => ({...prev, period: e.target.value}))
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select
            value={filters.feature}
            onChange={(e) =>
              setFilters((prev) => ({...prev, feature: e.target.value}))
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Features</option>
            <option value="ats_analysis">ATS Analysis</option>
            <option value="resume_enhancement">Resume Enhancement</option>
            <option value="github_import">GitHub Import</option>
            <option value="ai_suggestions">AI Suggestions</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total API Calls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 text-sm">
                Total API Calls
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totals?.totalCalls || 0}
              </p>
            </div>
          </div>
        </div>

        {/* OpenAI Stats */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-sm border-2 border-green-300 dark:border-green-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-700 dark:text-green-300 text-sm font-semibold">
                🤖 OpenAI (GPT-4o)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totals?.openaiCalls || 0} calls
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ${(analytics?.totals?.openaiCost || 0).toFixed(2)} cost
              </p>
            </div>
          </div>
        </div>

        {/* Gemini Stats */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 shadow-sm border-2 border-purple-300 dark:border-purple-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-purple-700 dark:text-purple-300 text-sm font-semibold">
                ✨ Gemini Flash
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totals?.geminiCalls || 0} calls
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ${(analytics?.totals?.geminiCost || 0).toFixed(2)} cost
              </p>
            </div>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 text-sm">
                Total Cost
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(analytics?.totals?.totalCost || 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-600 dark:text-gray-400 mt-1">
                {analytics?.totals?.totalTokens?.toLocaleString() || 0} tokens
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
          AI Provider Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300 font-semibold mb-2">
              🤖 OpenAI
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.totals?.openaiCalls || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
              {((analytics?.totals?.openaiTokens || 0) / 1000).toFixed(1)}K
              tokens
            </p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-2">
              ${(analytics?.totals?.openaiCost || 0).toFixed(2)}
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold mb-2">
              ✨ Gemini
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.totals?.geminiCalls || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
              {((analytics?.totals?.geminiTokens || 0) / 1000).toFixed(1)}K
              tokens
            </p>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mt-2">
              ${(analytics?.totals?.geminiCost || 0).toFixed(2)}
            </p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-700 dark:text-gray-300 font-semibold mb-2">
              🔄 Hybrid
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.totals?.hybridCalls || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
              Mixed usage
            </p>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-2">
              -
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
            API Calls Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.charts?.usageOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                name="API Calls"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Usage by Feature */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
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
                fill="#8884d8"
                dataKey="count"
              >
                {(analytics?.charts?.usageByFeature || []).map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
          Top Users by API Usage
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  Total Calls
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-600 dark:text-green-400 uppercase">
                  OpenAI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">
                  Gemini
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {(analytics?.topUsers || []).map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.userName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-500 dark:text-gray-400">
                        {user.userEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.count}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-400">
                      {((user.totalTokens || 0) / 1000).toFixed(1)}K tokens
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {user.openaiCalls || 0} calls
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      ${(user.openaiCost || 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {user.geminiCalls || 0} calls
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
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
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-4">
          Recent API Calls
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  Tokens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-500 dark:text-gray-700 dark:text-gray-300 uppercase">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {(analytics?.recentLogs || []).slice(0, 20).map((log, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500 dark:text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.userId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.feature}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === "success"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.tokensUsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${log.cost.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
