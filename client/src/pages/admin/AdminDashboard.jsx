import {useState, useEffect} from "react";
import {
  Users,
  FileText,
  Sparkles,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  MessageSquare,
  IndianRupee,
  CreditCard,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
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

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 animate-pulse shadow-2xl shadow-purple-500/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Loading dashboard...
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
          onClick={fetchDashboardStats}
          className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.stats?.totalUsers || 0,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Resumes",
      value: stats?.stats?.totalResumes || 0,
      icon: FileText,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      change: "+8%",
      trend: "up",
    },
    {
      title: "AI API Calls",
      value: stats?.stats?.totalAICalls || 0,
      icon: Sparkles,
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-500/10 to-violet-500/10",
      change: "+24%",
      trend: "up",
    },
    {
      title: "Total Earnings",
      value: `₹${(stats?.stats?.earnings?.totalINR || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
      change: `${stats?.stats?.earnings?.totalSubscriptions || 0} subs`,
      trend: "up",
    },
  ];

  const secondaryStats = [
    {
      title: "AI Extractions",
      value: stats?.stats?.aiExtractions?.today || 0,
      subtitle: `${stats?.stats?.aiExtractions?.usersAtLimit || 0} at limit`,
      icon: Activity,
      color: "text-orange-400",
    },
    {
      title: "AI Cost",
      value: `$${(stats?.stats?.totalAICost || 0).toFixed(2)}`,
      subtitle: "Total spent",
      icon: DollarSign,
      color: "text-pink-400",
    },
    {
      title: "Messages",
      value: stats?.stats?.totalContacts || 0,
      subtitle: "Contact forms",
      icon: MessageSquare,
      color: "text-cyan-400",
    },
    {
      title: "Active Subs",
      value: stats?.subscriptions?.byStatus?.active || 0,
      subtitle: `${stats?.subscriptions?.byStatus?.expired || 0} expired`,
      icon: CreditCard,
      color: "text-indigo-400",
    },
  ];

  const COLORS = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#06b6d4",
  ];

  return (
    <div className="space-y-6 sm:space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-400 mb-3">
            <BarChart3 className="w-4 h-4" />
            Analytics Overview
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with SmartNShine today.
          </p>
        </div>
        <button
          onClick={fetchDashboardStats}
          className="self-start sm:self-auto px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-xl rounded-2xl p-5 border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 transition-all group`}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-green-400" : "text-red-400"} bg-white/10 dark:bg-white/5 px-2 py-1 rounded-full`}
                  >
                    <TrendIcon className="w-3 h-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {stat.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Growth Chart */}
        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Users Growth
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-lg">
              Last 7 Days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats?.charts?.usersGrowth || []}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="_id"
                tick={{fontSize: 11, fill: "#9CA3AF"}}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{fontSize: 11, fill: "#9CA3AF"}}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 17, 17, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
                labelStyle={{color: "#fff"}}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
                name="New Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Resumes Growth Chart */}
        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resumes Created
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-lg">
              Last 7 Days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats?.charts?.resumesGrowth || []} barSize={40}>
              <defs>
                <linearGradient id="colorResumes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="_id"
                tick={{fontSize: 11, fill: "#9CA3AF"}}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{fontSize: 11, fill: "#9CA3AF"}}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 17, 17, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
                cursor={{fill: "rgba(255,255,255,0.05)"}}
              />
              <Bar
                dataKey="count"
                fill="url(#colorResumes)"
                name="Resumes"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Usage & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Usage by Feature
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats?.charts?.aiUsageByFeature || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({_id, count}) => `${_id}: ${count}`}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="count"
                paddingAngle={2}
              >
                {(stats?.charts?.aiUsageByFeature || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
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

        {/* Recent Activity */}
        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Users
            </h3>
          </div>
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {(stats?.recentActivity?.users || []).map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!stats?.recentActivity?.users ||
              stats.recentActivity.users.length === 0) && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">
                No recent users
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Revenue
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-lg">
              Last 6 Months
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats?.charts?.earningsByMonth || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis
                dataKey="_id"
                tick={{fontSize: 11, fill: "#9CA3AF"}}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{fontSize: 11, fill: "#9CA3AF"}}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 17, 17, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
                formatter={(value) => [
                  `₹${value?.toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue (₹)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Tier */}
        <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue by Tier
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats?.charts?.earningsByTier || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({_id, revenue}) =>
                  `${_id}: ₹${revenue?.toLocaleString("en-IN") || 0}`
                }
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="revenue"
                paddingAngle={2}
              >
                {(stats?.charts?.earningsByTier || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
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
                  `₹${value?.toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Subscriptions */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Subscriptions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-white/10">
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Tier
                </th>
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Plan
                </th>
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {(stats?.subscriptions?.recent || []).map((sub, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                        {sub.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {sub.userId?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {sub.userId?.email || ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        sub.tier === "pro"
                          ? "bg-purple-500/10 text-purple-400"
                          : sub.tier === "one-time"
                            ? "bg-blue-500/10 text-blue-400"
                            : sub.tier === "student"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {sub.tier}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                    {sub.plan || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white font-semibold">
                    {sub.currency === "INR" ? "₹" : "$"}
                    {sub.amount?.toLocaleString("en-IN") || 0}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        sub.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : sub.status === "expired"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          sub.status === "active"
                            ? "bg-green-400"
                            : sub.status === "expired"
                              ? "bg-yellow-400"
                              : "bg-gray-400"
                        }`}
                      ></span>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-sm">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!stats?.subscriptions?.recent ||
                stats.subscriptions.recent.length === 0) && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No subscriptions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Status
          </h3>
          <span className="flex items-center gap-2 text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <div className="text-3xl font-bold text-green-400">
              {stats?.stats?.activeUsers || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Active Users
            </div>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-xl">
            <div className="text-3xl font-bold text-red-400">
              {stats?.stats?.disabledUsers || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Disabled Users
            </div>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
            <div className="text-3xl font-bold text-blue-400">99.9%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Uptime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
