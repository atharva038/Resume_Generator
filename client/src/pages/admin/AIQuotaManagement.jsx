import {useState, useEffect} from "react";
import toast from "react-hot-toast";
import {
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Search,
  RefreshCw,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  getUserQuotaStatus,
  getUserQuotaDetails,
  resetUserDailyQuota,
} from "../../services/admin.api";

const AIQuotaManagement = () => {
  const [quotaData, setQuotaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("usage");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    fetchQuotaStatus();
  }, [sortBy, searchTerm]);

  const fetchQuotaStatus = async () => {
    try {
      setLoading(true);
      const response = await getUserQuotaStatus({
        sortBy,
        search: searchTerm,
      });
      setQuotaData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching quota status:", err);
      setError(err.response?.data?.error || "Failed to load quota data");
    } finally {
      setLoading(false);
    }
  };

  const handleResetQuota = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to reset daily quota for ${userName}?`
      )
    ) {
      return;
    }

    try {
      await resetUserDailyQuota(userId);
      toast.success(`Daily quota reset successfully for ${userName}!`, {
        icon: "🔄",
        duration: 2500,
      });
      fetchQuotaStatus();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset quota", {
        icon: "❌",
        duration: 3000,
      });
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await getUserQuotaDetails(userId);
      setSelectedUser(response.data);
      setShowUserDetails(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load user details", {
        icon: "❌",
        duration: 3000,
      });
    }
  };

  const getQuotaStatusColor = (percentage, tier) => {
    if (tier === "admin") return "text-purple-600";
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 80) return "text-orange-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getQuotaStatusBg = (percentage, tier) => {
    if (tier === "admin") return "bg-purple-100 dark:bg-purple-900/20";
    if (percentage >= 100) return "bg-red-100 dark:bg-red-900/20";
    if (percentage >= 80) return "bg-orange-100 dark:bg-orange-900/20";
    if (percentage >= 50) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-green-100 dark:bg-green-900/20";
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Quota Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage user AI usage quotas
          </p>
        </div>
        <button
          onClick={fetchQuotaStatus}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {quotaData?.totalUsers || 0}
              </p>
            </div>
            <Users className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily Usage
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {quotaData?.summary?.totalDailyUsage || 0}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly Cost
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${quotaData?.summary?.totalMonthlyCost?.toFixed(4) || "0.00"}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Users Near Limit
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {quotaData?.summary?.usersNearLimit || 0}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="usage">Sort by Usage</option>
            <option value="cost">Sort by Cost</option>
            <option value="percentage">Sort by Percentage</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Daily Quota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monthly Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {quotaData?.users?.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.tier === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}
                    >
                      {user.tier === "admin" && <Shield className="w-3 h-3" />}
                      {user.tier.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${getQuotaStatusColor(
                            user.quota.daily.percentage,
                            user.tier
                          )}`}
                        >
                          {user.quota.daily.used} /{" "}
                          {user.quota.daily.limit === Infinity
                            ? "∞"
                            : user.quota.daily.limit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            user.tier === "admin"
                              ? "bg-purple-600"
                              : user.quota.daily.percentage >= 100
                              ? "bg-red-600"
                              : user.quota.daily.percentage >= 80
                              ? "bg-orange-600"
                              : user.quota.daily.percentage >= 50
                              ? "bg-yellow-600"
                              : "bg-green-600"
                          }`}
                          style={{
                            width: `${Math.min(
                              user.quota.daily.percentage,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.quota.monthly.used} /{" "}
                      {user.quota.monthly.limit === Infinity
                        ? "∞"
                        : user.quota.monthly.limit}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.quota.monthly.totalTokens.toLocaleString()} tokens
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${user.quota.monthly.totalCost.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.tier === "admin" ? (
                      <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-medium">Unlimited</span>
                      </span>
                    ) : user.quota.daily.percentage >= 100 ? (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          Quota Exceeded
                        </span>
                      </span>
                    ) : user.quota.daily.percentage >= 80 ? (
                      <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-medium">Near Limit</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Active</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(user.userId)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        View Details
                      </button>
                      {user.tier !== "admin" && user.quota.daily.used > 0 && (
                        <button
                          onClick={() =>
                            handleResetQuota(user.userId, user.name)
                          }
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedUser.user.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.user.email}
                  </p>
                </div>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quota Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quota Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Daily Quota
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {selectedUser.quota.daily.used} /{" "}
                      {selectedUser.quota.daily.limit === Infinity
                        ? "∞"
                        : selectedUser.quota.daily.limit}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedUser.quota.daily.remaining} remaining
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Monthly Quota
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {selectedUser.quota.monthly.used} /{" "}
                      {selectedUser.quota.monthly.limit === Infinity
                        ? "∞"
                        : selectedUser.quota.monthly.limit}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedUser.quota.monthly.remaining} remaining
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage by Feature */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Usage by Feature
                </h3>
                <div className="space-y-2">
                  {selectedUser.usageByFeature.map((feature) => (
                    <div
                      key={feature._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {feature._id}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.successCount} successful,{" "}
                          {feature.errorCount} errors
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {feature.totalTokens.toLocaleString()} tokens
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${feature.totalCost.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Requests */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Requests
                </h3>
                <div className="space-y-2">
                  {selectedUser.recentRequests.slice(0, 10).map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-3">
                        {request.status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {request.feature}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-white">
                          {request.tokensUsed} tokens
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {request.responseTime}ms
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuotaManagement;
