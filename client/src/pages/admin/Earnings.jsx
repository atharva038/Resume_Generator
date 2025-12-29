import {useState, useEffect} from "react";
import {
  IndianRupee,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Users,
  Crown,
  Zap,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react";
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
  Area,
  AreaChart,
} from "recharts";
import {getDashboardStats} from "@/api/admin.api";

const Earnings = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("6m"); // 1m, 3m, 6m, 1y

  useEffect(() => {
    fetchEarningsData();
  }, [dateRange]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching earnings:", err);
      setError(err.response?.data?.message || "Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    pro: "#8B5CF6",
    "one-time": "#3B82F6",
    student: "#10B981",
    basic: "#F59E0B",
  };

  const tierIcons = {
    pro: Crown,
    "one-time": Zap,
    student: GraduationCap,
    basic: CreditCard,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 animate-pulse shadow-2xl shadow-green-500/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <IndianRupee className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Loading earnings data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <p className="text-red-400 font-medium">{error}</p>
        <button
          onClick={fetchEarningsData}
          className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  // Extract data from correct paths in the API response
  const earnings = stats?.stats?.earnings || {};
  const earningsByTier = stats?.charts?.earningsByTier || [];
  const earningsByMonth = stats?.charts?.earningsByMonth || [];
  const recentSubscriptions = stats?.subscriptions?.recent || [];
  const subscriptionCounts = stats?.subscriptions?.byStatus || {};

  // Calculate total earnings
  const totalINR = earnings?.totalINR || 0;
  const totalUSD = earnings?.totalUSD || 0;

  // Calculate month-over-month growth
  const currentMonth =
    earningsByMonth[earningsByMonth.length - 1]?.revenue || 0;
  const previousMonth =
    earningsByMonth[earningsByMonth.length - 2]?.revenue || 0;
  const monthGrowth =
    previousMonth > 0
      ? (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1)
      : 0;

  // Prepare pie chart data (backend uses 'revenue' not 'total')
  const pieChartData = earningsByTier.map((item) => ({
    name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1) || "Unknown",
    value: item.revenue || 0,
    tier: item._id,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-3">
            <IndianRupee className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-medium text-green-400">
              Revenue Tracking
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Earnings Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track subscription revenue, payment history, and financial insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
            {["1m", "3m", "6m", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  dateRange === range
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchEarningsData}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings INR */}
        <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  Number(monthGrowth) >= 0
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {Number(monthGrowth) >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(monthGrowth)}%
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Earnings (INR)</p>
            <p className="text-3xl font-bold text-white">
              ₹{totalINR.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Total Earnings USD */}
        <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Earnings (USD)</p>
            <p className="text-3xl font-bold text-white">
              ${totalUSD.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Active Subscriptions</p>
            <p className="text-3xl font-bold text-white">
              {subscriptionCounts?.active || 0}
            </p>
          </div>
        </div>

        {/* Total Subscriptions */}
        <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Subscriptions</p>
            <p className="text-3xl font-bold text-white">
              {(subscriptionCounts?.active || 0) +
                (subscriptionCounts?.expired || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Monthly Revenue
              </h3>
              <p className="text-sm text-gray-400">
                Revenue trend over the past 6 months
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-400">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={earningsByMonth}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="_id"
                stroke="#9CA3AF"
                tick={{fill: "#9CA3AF", fontSize: 12}}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{fill: "#9CA3AF", fontSize: 12}}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 17, 17, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
                labelStyle={{color: "#fff", fontWeight: "bold"}}
                itemStyle={{color: "#10B981"}}
                formatter={(value) => [
                  `₹${value.toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Tier */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">
              Revenue by Tier
            </h3>
            <p className="text-sm text-gray-400">
              Distribution by subscription type
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.tier] || "#6B7280"}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 17, 17, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
                formatter={(value) => [
                  `₹${value.toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {pieChartData.map((item, index) => {
              const Icon = tierIcons[item.tier] || CreditCard;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{backgroundColor: COLORS[item.tier] || "#6B7280"}}
                    ></div>
                    <Icon
                      className="w-4 h-4"
                      style={{color: COLORS[item.tier] || "#6B7280"}}
                    />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">
                    ₹{item.value.toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscription Stats by Tier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {earningsByTier.map((tier, index) => {
          const Icon = tierIcons[tier._id] || CreditCard;
          const color = COLORS[tier._id] || "#6B7280";
          return (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{backgroundColor: `${color}20`}}
                >
                  <Icon className="w-6 h-6" style={{color}} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white capitalize">
                    {tier._id || "Unknown"} Plan
                  </h3>
                  <p className="text-sm text-gray-400">
                    {tier.count} subscriptions
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  ₹{(tier.revenue || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-gray-400">total revenue</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Subscriptions Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Recent Subscriptions
              </h3>
              <p className="text-sm text-gray-400">
                Latest subscription purchases
              </p>
            </div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 flex items-center gap-2 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentSubscriptions.length > 0 ? (
                recentSubscriptions.map((sub, index) => {
                  const Icon = tierIcons[sub.tier] || CreditCard;
                  const color = COLORS[sub.tier] || "#6B7280";
                  return (
                    <tr
                      key={index}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                            {sub.userId?.name?.charAt(0) ||
                              sub.user?.name?.charAt(0) ||
                              "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {sub.userId?.name ||
                                sub.user?.name ||
                                "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {sub.userId?.email ||
                                sub.user?.email ||
                                "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="p-1.5 rounded-lg"
                            style={{backgroundColor: `${color}20`}}
                          >
                            <Icon className="w-4 h-4" style={{color}} />
                          </div>
                          <span
                            className="text-sm font-medium capitalize"
                            style={{color}}
                          >
                            {sub.tier}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-white">
                          {sub.currency === "INR" ? "₹" : "$"}
                          {sub.amount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            sub.status === "active"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CreditCard className="w-12 h-12 text-gray-600" />
                      <p className="text-gray-400">No subscriptions yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm font-medium text-green-400">Active</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {subscriptionCounts?.active || 0}
          </p>
          <p className="text-sm text-gray-400 mt-1">Active subscriptions</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-sm font-medium text-yellow-400">Expired</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {subscriptionCounts?.expired || 0}
          </p>
          <p className="text-sm text-gray-400 mt-1">Expired subscriptions</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-blue-400">
              Conversion
            </span>
          </div>
          <p className="text-3xl font-bold text-white">
            {stats?.stats?.totalUsers > 0
              ? (
                  ((subscriptionCounts?.active || 0) / stats.stats.totalUsers) *
                  100
                ).toFixed(1)
              : 0}
            %
          </p>
          <p className="text-sm text-gray-400 mt-1">User to subscriber rate</p>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
