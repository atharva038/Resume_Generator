import {useState, useEffect} from "react";
import {motion} from "framer-motion";
import toast from "react-hot-toast";
import {
  Brain,
  Users,
  TrendingUp,
  AlertTriangle,
  Search,
  RefreshCw,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Calendar,
} from "lucide-react";
import {
  getAIExtractionUsage,
  resetUserExtractionCounter,
} from "@/api/admin.api";

const AIExtractionManagement = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [resetting, setResetting] = useState(null);

  useEffect(() => {
    fetchExtractionData();
  }, [currentPage, searchTerm, filterTier, filterStatus]);

  const fetchExtractionData = async () => {
    try {
      setLoading(true);
      const response = await getAIExtractionUsage({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        tier: filterTier !== "all" ? filterTier : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      });
      setData(response.data);
    } catch (err) {
      console.error("Error fetching extraction data:", err);
      toast.error("Failed to load extraction usage data");
    } finally {
      setLoading(false);
    }
  };

  const handleResetCounter = async (userId, userName) => {
    if (
      !window.confirm(
        `Reset AI extraction counter for ${userName}?\n\nThis will reset their daily extraction count to 0.`
      )
    ) {
      return;
    }

    try {
      setResetting(userId);
      await resetUserExtractionCounter(userId);
      toast.success(`Extraction counter reset for ${userName}! 🔄`, {
        duration: 3000,
      });
      fetchExtractionData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset counter");
    } finally {
      setResetting(null);
    }
  };

  const getTierBadgeColor = (tier) => {
    const colors = {
      free: "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30",
      "one-time":
        "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      pro: "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
      premium:
        "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
      lifetime:
        "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    };
    return colors[tier] || colors.free;
  };

  const getStatusColor = (user) => {
    if (user.extractionsToday >= user.limit) {
      return "text-red-500";
    } else if (user.extractionsToday >= user.limit * 0.8) {
      return "text-orange-500";
    }
    return "text-green-500";
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{opacity: 0, y: -20}}
        animate={{opacity: 1, y: 0}}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium inline-block mb-3">
            AI Extraction
          </span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            AI Extraction Usage
          </h1>
          <p className="text-gray-400 mt-1">
            Monitor and manage daily AI resume extraction limits
          </p>
        </div>
        <button
          onClick={fetchExtractionData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.1}}
          className="relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Extractions Today
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {data?.summary?.totalExtractionsToday || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.2}}
          className="relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {data?.summary?.activeUsers || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.3}}
          className="relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Users At Limit
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {data?.summary?.usersAtLimit || 0}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.4}}
          className="relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Average Usage
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {data?.summary?.averageUsage
                    ? `${data.summary.averageUsage.toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tier Breakdown */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.5}}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Usage by Tier</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data?.tierBreakdown?.map((tier, idx) => (
            <div
              key={tier._id}
              className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="text-2xl font-bold text-white">{tier.count}</p>
              <p className="text-sm text-gray-400 capitalize mt-1">
                {tier._id}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {tier.totalExtractions} extractions
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.6}}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
          </div>

          {/* Tier Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <select
              value={filterTier}
              onChange={(e) => {
                setFilterTier(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none"
            >
              <option value="all" className="bg-gray-900">
                All Tiers
              </option>
              <option value="free" className="bg-gray-900">
                Free
              </option>
              <option value="one-time" className="bg-gray-900">
                One-Time
              </option>
              <option value="pro" className="bg-gray-900">
                Pro
              </option>
              <option value="premium" className="bg-gray-900">
                Premium
              </option>
              <option value="lifetime" className="bg-gray-900">
                Lifetime
              </option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all appearance-none"
            >
              <option value="all" className="bg-gray-900">
                All Status
              </option>
              <option value="active" className="bg-gray-900">
                Active (Used Today)
              </option>
              <option value="at-limit" className="bg-gray-900">
                At Limit
              </option>
              <option value="unused" className="bg-gray-900">
                Unused
              </option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.7}}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Usage Today
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Extraction
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data?.users?.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{opacity: 0, x: -20}}
                  animate={{opacity: 1, x: 0}}
                  transition={{delay: idx * 0.05}}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTierBadgeColor(
                        user.subscriptionTier
                      )}`}
                    >
                      {user.subscriptionTier.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-sm font-semibold ${getStatusColor(
                              user
                            )}`}
                          >
                            {user.extractionsToday} / {user.limit}
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.usagePercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              user.extractionsToday >= user.limit
                                ? "bg-gradient-to-r from-red-500 to-orange-500"
                                : user.extractionsToday >= user.limit * 0.8
                                  ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                                  : "bg-gradient-to-r from-green-500 to-emerald-500"
                            }`}
                            style={{width: `${user.usagePercentage}%`}}
                          ></div>
                        </div>
                      </div>
                      {user.extractionsToday >= user.limit && (
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.lastExtraction ? (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        {new Date(user.lastExtraction).toLocaleString()}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleResetCounter(user._id, user.name)}
                      disabled={resetting === user._id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm rounded-xl transition-all duration-200 shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${
                          resetting === user._id ? "animate-spin" : ""
                        }`}
                      />
                      Reset
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <div className="px-6 py-4 border-t border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {(currentPage - 1) * data.pagination.limit + 1} to{" "}
                {Math.min(
                  currentPage * data.pagination.limit,
                  data.pagination.total
                )}{" "}
                of {data.pagination.total} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from(
                    {length: data.pagination.totalPages},
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === data.pagination.totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, idx, arr) => (
                      <div key={page} className="flex items-center gap-2">
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentPage === page
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/25"
                              : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(data.pagination.totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === data.pagination.totalPages}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AIExtractionManagement;
