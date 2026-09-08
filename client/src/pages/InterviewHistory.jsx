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
  completed: "bg-green-500/10 border border-green-500/20 text-green-500",
  "in-progress": "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
  abandoned: "bg-red-500/10 border border-red-500/20 text-red-500",
  created: "bg-gray-500/10 border border-gray-500/20 text-gray-500",
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
      <div className="min-h-screen bg-white dark:bg-[#0C0C0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 animate-pulse"></div>
            <Loader2 className="w-8 h-8 animate-spin text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0C0C0C] overflow-x-hidden">
      {/* Ambient gradient blur effects */}
      <div className="fixed top-40 left-20 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed top-60 right-20 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:backdrop-blur-xl border border-blue-500/20 dark:border-white/10 rounded-full text-sm font-medium text-blue-600 dark:text-blue-300 shadow-lg mb-6">
            <BarChart3 className="w-4 h-4" />
            Interview Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Your{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              Interview History
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Track your progress, review past interviews, and improve your skills
          </p>
          <div className="mt-6">
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              New Interview
            </Link>
          </div>
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
              color="cyan"
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
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-6 mb-8">
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.overallScore}%
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      item.overallScore >= 70
                        ? "bg-gradient-to-t from-green-600 to-green-400"
                        : item.overallScore >= 50
                          ? "bg-gradient-to-t from-yellow-600 to-yellow-400"
                          : "bg-gradient-to-t from-red-600 to-red-400"
                    }`}
                    style={{height: `${item.overallScore}%`}}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
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
            className="px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          >
            <option value="">All Interviews</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Interviews Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start your first mock interview to practice and improve your
              skills
            </p>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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

              const answeredQuestions =
                interview.questions?.filter(
                  (q) => q.userAnswer || q.evaluation?.score
                )?.length || 0;
              const totalQuestions =
                interview.totalQuestions || interview.questions?.length || 10;
              const progressPercent = Math.min(
                100,
                Math.round((answeredQuestions / totalQuestions) * 100)
              );

              return (
                <div
                  key={interview._id}
                  className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-6 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {interview.role} Interview
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
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
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[interview.status]}`}
                          >
                            {interview.status}
                          </span>
                          {interview.totalDurationSeconds > 0 ? (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(interview.totalDurationSeconds)}
                            </span>
                          ) : null}
                          <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md font-medium">
                            {answeredQuestions}/{totalQuestions} questions ({progressPercent}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/5">
                      {interview.result && interview.result.overallScore > 0 ? (
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {interview.result.overallScore}%
                            </span>
                            <TrendIcon
                              className={`w-4 h-4 ${
                                interview.result?.comparisonData?.trend ===
                                "improving"
                                  ? "text-green-500"
                                  : interview.result?.comparisonData?.trend ===
                                      "declining"
                                    ? "text-red-500"
                                    : "text-gray-500"
                              }`}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {interview.result.grade}
                          </div>
                        </div>
                      ) : (
                        <div className="w-28 md:w-32">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {(interview.status === "completed" || answeredQuestions > 0) && (
                          <Link
                            to={`/interview/result/${interview._id}`}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors flex items-center gap-1 text-sm font-medium"
                            title={interview.status === "completed" ? "View Full Report" : "View Partial Progress"}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Details</span>
                          </Link>
                        )}

                        {interview.status === "in-progress" && (
                          <Link
                            to={`/interview?resume=${interview._id}`}
                            className="p-2 text-green-400 hover:bg-green-500/10 rounded-xl transition-colors flex items-center gap-1 text-sm font-medium"
                            title="Continue Interview"
                          >
                            <Play className="w-4 h-4" />
                            <span className="hidden sm:inline">Continue</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {pagination.skip + 1} -{" "}
              {Math.min(pagination.skip + pagination.limit, pagination.total)}{" "}
              of {pagination.total}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={pagination.skip === 0}
                className="p-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasMore}
                className="p-2.5 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
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
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/20 text-blue-400",
    green:
      "from-green-500/20 to-green-600/20 border-green-500/20 text-green-400",
    yellow:
      "from-yellow-500/20 to-yellow-600/20 border-yellow-500/20 text-yellow-400",
    red: "from-red-500/20 to-red-600/20 border-red-500/20 text-red-400",
    cyan: "from-cyan-500/20 to-blue-600/20 border-cyan-500/20 text-cyan-400",
  };

  const iconBgClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
    red: "bg-red-500/10 text-red-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
  };

  return (
    <div
      className={`bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-6 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${iconBgClasses[color]} flex items-center justify-center mb-4`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default InterviewHistory;
