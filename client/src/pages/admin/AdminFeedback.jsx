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
} from "../../services/admin.api";
import {parseValidationErrors} from "../../utils/errorHandler";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    fetchFeedbacks();
    fetchStatistics();
  }, [filters]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await getAllFeedback(filters);
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
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
      setShowModal(false);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Feedback Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage user feedback, suggestions, and bug reports
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Feedback
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.total}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.open}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              In Progress
            </p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.inProgress}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.resolved}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bugs Reported
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.bugs}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={filters.search}
              onChange={(e) =>
                setFilters({...filters, search: e.target.value, page: 1})
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters({...filters, type: e.target.value, page: 1})
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Types</option>
            <option value="improvement">Improvements</option>
            <option value="feedback">Feedback</option>
            <option value="bug">Bugs</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({...filters, status: e.target.value, page: 1})
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({...filters, priority: e.target.value, page: 1})
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No feedback found
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {feedbacks.map((feedback) => {
              const statusBadge = getStatusBadge(feedback.status);
              return (
                <div
                  key={feedback._id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(feedback.type)}
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {feedback.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.class}`}
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

                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {feedback.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
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
                        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            Admin Response:
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
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
                          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
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
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
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
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400"
                        title="Add Response"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleDelete(feedback._id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Respond to Feedback
            </h3>

            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                {selectedFeedback.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFeedback.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="duplicate">Duplicate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  placeholder="Write your response to the user..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResponseSubmit}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Submit Response
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedFeedback(null);
                    setResponseText("");
                    setStatusUpdate("");
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
