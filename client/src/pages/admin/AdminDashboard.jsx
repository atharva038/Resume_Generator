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
} from "recharts";
import {getDashboardStats} from "../../services/admin.api";

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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Resumes",
      value: stats?.stats?.totalResumes || 0,
      icon: FileText,
      color: "bg-green-500",
      change: "+8%",
      trend: "up",
    },
    {
      title: "AI API Calls",
      value: stats?.stats?.totalAICalls || 0,
      icon: Sparkles,
      color: "bg-purple-500",
      change: "+24%",
      trend: "up",
    },
    {
      title: "AI Cost",
      value: `$${(stats?.stats?.totalAICost || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-orange-500",
      change: "+15%",
      trend: "up",
    },
    {
      title: "Templates",
      value: stats?.stats?.totalTemplates || 0,
      icon: Activity,
      color: "bg-pink-500",
      change: "+2",
      trend: "up",
    },
    {
      title: "Contact Messages",
      value: stats?.stats?.totalContacts || 0,
      icon: MessageSquare,
      color: "bg-cyan-500",
      change: "+5",
      trend: "up",
    },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with SmartNShine today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs sm:text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 dark:text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                {stat.title}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Users Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-3 sm:mb-4">
            Users Growth (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.charts?.usersGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip />
              <Legend wrapperStyle={{fontSize: "12px"}} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resumes Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-3 sm:mb-4">
            Resumes Created (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.charts?.resumesGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip />
              <Legend wrapperStyle={{fontSize: "12px"}} />
              <Bar dataKey="count" fill="#10b981" name="Resumes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Usage by Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-3 sm:mb-4">
            AI Usage by Feature
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.charts?.aiUsageByFeature || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({_id, count}) => `${_id}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(stats?.charts?.aiUsageByFeature || []).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-3 sm:mb-4">
            Recent Users
          </h3>
          <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
            {(stats?.recentActivity?.users || []).map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {(!stats?.recentActivity?.users ||
              stats.recentActivity.users.length === 0) && (
              <p className="text-gray-500 dark:text-gray-500 dark:text-gray-600 dark:text-gray-400 text-center py-4 text-sm">
                No recent users
              </p>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-900 dark:text-white mb-3 sm:mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {stats?.stats?.activeUsers || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
              Active Users
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
              {stats?.stats?.disabledUsers || 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
              Disabled Users
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              99.9%
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400 mt-1">
              Uptime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
