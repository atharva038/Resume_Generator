import {useState, useEffect} from "react";
import {
  MessageSquare,
  Lightbulb,
  Bug,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ThumbsUp,
  Trash2,
  Eye,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllFeedback,
  getFeedbackStatistics,
  updateFeedbackStatus,
  deleteFeedbackAdmin,
} from "@/api/admin.api";
import {parseValidationErrors} from "@/utils/errorHandler";
import {useToggle} from "@/hooks";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, toggleLoading, setLoadingTrue, setLoadingFalse] =
    useToggle(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    priority: "",
    search: "",
    page: 1,
    limit: 20,
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, toggleModal, setShowModalTrue, setShowModalFalse] =
    useToggle(false);
  const [responseText, setResponseText] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    fetchFeedbacks();
    fetchStatistics();
  }, [filters]);

  const fetchFeedbacks = async () => {
    try {
      setLoadingTrue();
      const response = await getAllFeedback(filters);
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoadingFalse();
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getFeedbackStatistics();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateFeedbackStatus(id, {status});
      fetchFeedbacks();
      fetchStatistics();
      toast.success("Feedback status updated successfully!", {
        icon: "✅",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status: " + parseValidationErrors(error), {
        icon: "❌",
        duration: 3000,
      });
    }
  };

  const handleResponseSubmit = async () => {
    if (!selectedFeedback || !responseText) return;

    try {
      await updateFeedbackStatus(selectedFeedback._id, {
        adminResponse: responseText,
        status: statusUpdate || selectedFeedback.status,
      });
      setShowModalFalse();
      setSelectedFeedback(null);
      setResponseText("");
      setStatusUpdate("");
      fetchFeedbacks();
      fetchStatistics();
      toast.success("Response submitted successfully!", {
        icon: "💬",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error(
        "Failed to submit response: " + parseValidationErrors(error),
        {
          icon: "❌",
          duration: 3000,
        }
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedbackAdmin(id);
        fetchFeedbacks();
        fetchStatistics();
        toast.success("Feedback deleted successfully!", {
          icon: "🗑️",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error deleting feedback:", error);
        toast.error(
          "Failed to delete feedback: " + parseValidationErrors(error),
          {
            icon: "❌",
            duration: 3000,
          }
        );
      }
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      improvement: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      feedback: <MessageSquare className="w-5 h-5 text-blue-500" />,
      bug: <Bug className="w-5 h-5 text-red-500" />,
    };
    return icons[type];
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: {
        label: "Open",
        class:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        icon: <Clock className="w-3 h-3" />,
      },
      "in-progress": {
        label: "In Progress",
        class:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
      },
      resolved: {
        label: "Resolved",
        class:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      closed: {
        label: "Closed",
        class:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        icon: <XCircle className="w-3 h-3" />,
      },
    };
    return badges[status] || badges.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-gray-600 dark:text-gray-400",
      medium: "text-blue-600 dark:text-blue-400",
      high: "text-orange-600 dark:text-orange-400",
      critical: "text-red-600 dark:text-red-400",
    };
    return colors[priority];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium inline-block mb-3">
          Feedback Center
        </span>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          User Feedback Management
        </h1>
        <p className="text-gray-400 mt-1">
          View and manage user feedback, suggestions, and bug reports
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white/5 dark:border-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Feedback</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 dark:border-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Open</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  {stats.open}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 dark:border-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">
                  {stats.inProgress}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                <Loader2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 dark:border-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  {stats.resolved}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/5 dark:border-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Bugs Reported</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  {stats.bugs}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
                <Bug className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/5 dark:border-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={filters.search}
              onChange={(e) =>
                setFilters({...filters, search: e.target.value, page: 1})
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters({...filters, type: e.target.value, page: 1})
            }
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
          >
            <option value="" className="bg-gray-900">
              All Types
            </option>
            <option value="improvement" className="bg-gray-900">
              Improvements
            </option>
            <option value="feedback" className="bg-gray-900">
              Feedback
            </option>
            <option value="bug" className="bg-gray-900">
              Bugs
            </option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({...filters, status: e.target.value, page: 1})
            }
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
          >
            <option value="" className="bg-gray-900">
              All Status
            </option>
            <option value="open" className="bg-gray-900">
              Open
            </option>
            <option value="in-progress" className="bg-gray-900">
              In Progress
            </option>
            <option value="resolved" className="bg-gray-900">
              Resolved
            </option>
            <option value="closed" className="bg-gray-900">
              Closed
            </option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({...filters, priority: e.target.value, page: 1})
            }
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
          >
            <option value="" className="bg-gray-900">
              All Priorities
            </option>
            <option value="low" className="bg-gray-900">
              Low
            </option>
            <option value="medium" className="bg-gray-900">
              Medium
            </option>
            <option value="high" className="bg-gray-900">
              High
            </option>
            <option value="critical" className="bg-gray-900">
              Critical
            </option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white/5 dark:border-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center animate-pulse">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400">No feedback found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {feedbacks.map((feedback) => {
              const statusBadge = getStatusBadge(feedback.status);
              return (
                <div
                  key={feedback._id}
                  className="p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(feedback.type)}
                        <h3 className="font-semibold text-white text-lg">
                          {feedback.title}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.class}`}
                        >
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                        <span
                          className={`text-xs font-semibold uppercase ${getPriorityColor(
                            feedback.priority
                          )}`}
                        >
                          {feedback.priority}
                        </span>
                      </div>

                      <p className="text-gray-400 mb-3">
                        {feedback.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>
                          By: {feedback.userId?.name || "Unknown"} (
                          {feedback.userId?.email})
                        </span>
                        <span>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {feedback.upvotes} upvotes
                        </span>
                        <span className="capitalize">{feedback.category}</span>
                      </div>

                      {feedback.adminResponse && (
                        <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                          <p className="text-xs font-medium text-purple-400 mb-1">
                            Admin Response:
                          </p>
                          <p className="text-sm text-gray-300">
                            {feedback.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {/* Quick Status Updates */}
                      {feedback.status === "open" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(feedback._id, "in-progress")
                          }
                          className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-sm rounded-lg font-medium transition-all shadow-lg shadow-yellow-500/25"
                          title="Mark as In Progress"
                        >
                          In Progress
                        </button>
                      )}
                      {(feedback.status === "open" ||
                        feedback.status === "in-progress") && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(feedback._id, "resolved")
                          }
                          className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm rounded-lg font-medium transition-all shadow-lg shadow-green-500/25"
                          title="Mark as Resolved"
                        >
                          Resolve
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setResponseText(feedback.adminResponse || "");
                          setStatusUpdate(feedback.status);
                          setShowModalTrue();
                        }}
                        className="p-2 hover:bg-purple-500/20 rounded-xl text-purple-400 transition-colors"
                        title="Add Response"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="p-2 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full p-6 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              Respond to Feedback
            </h3>

            <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="font-semibold text-white mb-2">
                {selectedFeedback.title}
              </p>
              <p className="text-sm text-gray-400">
                {selectedFeedback.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                >
                  <option value="open" className="bg-gray-900">
                    Open
                  </option>
                  <option value="in-progress" className="bg-gray-900">
                    In Progress
                  </option>
                  <option value="resolved" className="bg-gray-900">
                    Resolved
                  </option>
                  <option value="closed" className="bg-gray-900">
                    Closed
                  </option>
                  <option value="duplicate" className="bg-gray-900">
                    Duplicate
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  placeholder="Write your response to the user..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleResponseSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/25"
                >
                  Submit Response
                </button>
                <button
                  onClick={() => {
                    setShowModalFalse();
                    setSelectedFeedback(null);
                    setResponseText("");
                    setStatusUpdate("");
                  }}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
