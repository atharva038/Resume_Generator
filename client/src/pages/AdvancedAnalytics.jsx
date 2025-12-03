import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  FileText,
  Zap,
  DollarSign,
  Calendar,
  Award,
  Activity,
  Target,
  Clock,
  Sparkles,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdvancedAnalytics = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/subscription/analytics`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);

      // Check if it's a 403 upgrade required error
      if (err.response?.status === 403 && err.response?.data?.upgradeRequired) {
        setError({
          title: err.response.data.error,
          message: err.response.data.message,
          upgradeRequired: true,
        });
      } else {
        setError({
          title: "Error",
          message: "Failed to load analytics data",
          upgradeRequired: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error?.upgradeRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error.title}
            </h2>
            <p className="text-gray-600">{error.message}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/pricing")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View Pro Plans
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error.message}</p>
          <button
            onClick={fetchAnalytics}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];

  // Prepare data for charts
  const providerData = analytics.aiAnalytics.byProvider.map((item) => ({
    name: item.provider.toUpperCase(),
    requests: item.requests,
    cost: item.cost.toFixed(2),
  }));

  const templateData = Object.entries(analytics.resumeAnalytics.byTemplate).map(
    ([template, count]) => ({
      name: template.charAt(0).toUpperCase() + template.slice(1),
      value: count,
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Advanced Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into your resume building journey
              </p>
            </div>
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-lg">
              <span className="text-sm font-semibold text-indigo-700">
                {analytics.subscriptionInfo.tier.toUpperCase()} PLAN
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {new Date(analytics.generatedAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FileText className="w-6 h-6" />}
            title="Total Resumes"
            value={analytics.overallUsage.resumesCreated}
            subtitle={`${analytics.resumeAnalytics.last7Days} in last 7 days`}
            color="indigo"
          />
          <StatCard
            icon={<Zap className="w-6 h-6" />}
            title="AI Requests"
            value={analytics.aiAnalytics.last30Days}
            subtitle="Last 30 days"
            color="purple"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            title="ATS Scans"
            value={analytics.overallUsage.atsScans}
            subtitle="Total scans performed"
            color="pink"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Money Saved"
            value={`₹${analytics.costSavings.saved.toFixed(0)}`}
            subtitle="vs Pay-as-you-go"
            color="green"
          />
        </div>

        {/* Subscription Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Subscription Details
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Plan</p>
              <p className="text-lg font-semibold text-gray-900">
                {analytics.subscriptionInfo.tier.toUpperCase()} -{" "}
                {analytics.subscriptionInfo.plan}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  analytics.subscriptionInfo.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {analytics.subscriptionInfo.status.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
              <p className="text-lg font-semibold text-gray-900">
                {analytics.subscriptionInfo.daysRemaining !== null
                  ? `${analytics.subscriptionInfo.daysRemaining} days`
                  : "Unlimited"}
              </p>
            </div>
          </div>
        </div>

        {/* Current Month Usage */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            Current Period Usage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UsageBar
              label="Resumes"
              used={analytics.currentMonthUsage.resumes.used}
              limit={analytics.currentMonthUsage.resumes.limit}
            />
            <UsageBar
              label="ATS Scans"
              used={analytics.currentMonthUsage.atsScans.used}
              limit={analytics.currentMonthUsage.atsScans.limit}
            />
            <UsageBar
              label="Cover Letters"
              used={analytics.currentMonthUsage.coverLetters.used}
              limit={analytics.currentMonthUsage.coverLetters.limit}
            />
            {/* TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE */}
            {/* <UsageBar
              label="Job Matches"
              used={analytics.currentMonthUsage.jobMatches.used}
              limit={analytics.currentMonthUsage.jobMatches.limit}
            /> */}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              30-Day Activity Timeline
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.activityTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{fontSize: 12}}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="aiRequests"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="AI Requests"
                  dot={{fill: "#6366f1"}}
                />
                <Line
                  type="monotone"
                  dataKey="resumesCreated"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Resumes Created"
                  dot={{fill: "#8b5cf6"}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Provider Usage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              AI Provider Distribution
            </h2>
            {providerData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={providerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="requests"
                  >
                    {providerData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No AI usage data yet
              </div>
            )}
          </div>
        </div>

        {/* Template Usage */}
        {Object.keys(analytics.resumeAnalytics.byTemplate).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Template Usage
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={templateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Resumes */}
        {analytics.resumeAnalytics.mostRecentlyUpdated.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Recently Updated Resumes
            </h2>
            <div className="space-y-3">
              {analytics.resumeAnalytics.mostRecentlyUpdated.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {resume.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        Template: {resume.template}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({icon, title, value, subtitle, color}) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600",
    pink: "from-pink-500 to-pink-600",
    green: "from-green-500 to-green-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div
        className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

// Usage Bar Component
const UsageBar = ({label, used, limit}) => {
  const isUnlimited = limit === Infinity || limit === 999999;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const color =
    percentage >= 90
      ? "bg-red-500"
      : percentage >= 70
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-sm text-gray-600">
          {used} / {isUnlimited ? "∞" : limit}
        </p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{width: isUnlimited ? "0%" : `${percentage}%`}}
        />
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
