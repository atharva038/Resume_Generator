import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import toast from "react-hot-toast";
import {useAuth} from "@/context/AuthContext";
import interviewAPI from "@/api/interview.api";
import {
  Clock,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  BarChart3,
  Play,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Briefcase,
  Code,
  Users,
} from "lucide-react";

const typeIcons = {
  "resume-based": FileText,
  "job-description": Briefcase,
  technical: Code,
  behavioral: Users,
  mixed: Sparkles,
};

const statusColors = {
  completed:
    "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  "in-progress":
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  abandoned: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  created: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
};

const InterviewHistory = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({total: 0, limit: 10, skip: 0});
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadData();
  }, [user, navigate, pagination.skip, filter]);

  const loadData = async () => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        interviewAPI.getHistory({
          limit: pagination.limit,
          skip: pagination.skip,
          status: filter || undefined,
        }),
        interviewAPI.getStats(),
      ]);

      setHistory(historyRes.data.interviews || []);
      setPagination((prev) => ({
        ...prev,
        total: historyRes.data.pagination?.total || 0,
        hasMore: historyRes.data.pagination?.hasMore || false,
      }));
      setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to load history:", error);
      toast.error("Failed to load interview history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.limit),
    }));
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      skip: prev.skip + prev.limit,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              Interview History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your progress and review past interviews
            </p>
          </div>
          <Link
            to="/interview"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            New Interview
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={Target}
              label="Total Interviews"
              value={stats.totalInterviews}
              color="blue"
            />
            <StatsCard
              icon={Award}
              label="Average Score"
              value={`${stats.averageScore}%`}
              color={
                stats.averageScore >= 70
                  ? "green"
                  : stats.averageScore >= 50
                    ? "yellow"
                    : "red"
              }
            />
            <StatsCard
              icon={Clock}
              label="Total Practice Time"
              value={formatDuration(stats.totalTimeSpent)}
              color="purple"
            />
            <StatsCard
              icon={TrendingUp}
              label="Recent Trend"
              value={
                stats.recentScores?.length > 1
                  ? stats.recentScores[0]?.score >
                    stats.recentScores[stats.recentScores.length - 1]?.score
                    ? "Improving"
                    : "Needs Focus"
                  : "N/A"
              }
              color={
                stats.recentScores?.length > 1 &&
                stats.recentScores[0]?.score >
                  stats.recentScores[stats.recentScores.length - 1]?.score
                  ? "green"
                  : "yellow"
              }
            />
          </div>
        )}

        {/* Score Trend Chart */}
        {stats?.improvementTrend?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Score Trend
            </h2>
            <div className="h-32 flex items-end gap-2">
              {stats.improvementTrend.map((item, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs text-gray-500">
                    {item.overallScore}%
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      item.overallScore >= 70
                        ? "bg-green-500"
                        : item.overallScore >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{height: `${item.overallScore}%`}}
                  />
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPagination((prev) => ({...prev, skip: 0}));
            }}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Interviews</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Interviews Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start your first mock interview to practice and improve
            </p>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
            >
              <Play className="w-5 h-5" />
              Start Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((interview) => {
              const Icon = typeIcons[interview.interviewType] || Sparkles;
              const TrendIcon =
                interview.result?.comparisonData?.trend === "improving"
                  ? TrendingUp
                  : interview.result?.comparisonData?.trend === "declining"
                    ? TrendingDown
                    : Minus;

              return (
                <div
                  key={interview._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {interview.role} Interview
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="capitalize">
                            {interview.interviewType.replace("-", " ")}
                          </span>
                          <span>•</span>
                          <span className="capitalize">
                            {interview.experienceLevel}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(interview.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[interview.status]}`}
                          >
                            {interview.status}
                          </span>
                          {interview.totalDurationSeconds && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(interview.totalDurationSeconds)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {interview.result && (
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${
                              interview.result.overallScore >= 70
                                ? "text-green-500"
                                : interview.result.overallScore >= 50
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          >
                            {interview.result.overallScore}%
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <TrendIcon
                              className={`w-3 h-3 ${
                                interview.result?.comparisonData?.trend ===
                                "improving"
                                  ? "text-green-500"
                                  : interview.result?.comparisonData?.trend ===
                                      "declining"
                                    ? "text-red-500"
                                    : "text-gray-500"
                              }`}
                            />
                            {interview.result.grade}
                          </div>
                        </div>
                      )}

                      {interview.status === "completed" && (
                        <Link
                          to={`/interview/result/${interview._id}`}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      )}

                      {interview.status === "in-progress" && (
                        <Link
                          to={`/interview?resume=${interview._id}`}
                          className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                          title="Continue"
                        >
                          <Play className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {pagination.skip + 1} -{" "}
              {Math.min(pagination.skip + pagination.limit, pagination.total)}{" "}
              of {pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={pagination.skip === 0}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasMore}
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({icon: Icon, label, value, color}) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-500",
    green: "bg-green-100 dark:bg-green-900/30 text-green-500",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500",
    red: "bg-red-100 dark:bg-red-900/30 text-red-500",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-500",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div
        className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default InterviewHistory;
