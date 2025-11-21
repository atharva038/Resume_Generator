import {useState, useEffect} from "react";
import toast from "react-hot-toast";
import {
  Lightbulb,
  MessageSquare,
  Bug,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  ThumbsUp,
  Trash2,
  Edit,
} from "lucide-react";
import {feedbackAPI} from "../services/feedback.api";
import {parseValidationErrors} from "../utils/errorHandler";

const Feedback = () => {
  const [activeTab, setActiveTab] = useState("improvement");
  const [formData, setFormData] = useState({
    type: "improvement",
    title: "",
    description: "",
    priority: "medium",
    category: "other",
    browserInfo: "",
    deviceInfo: "",
    pageUrl: window.location.href,
  });
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [myFeedback, setMyFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [stats, setStats] = useState(null);

  const tabs = [
    {
      id: "improvement",
      label: "Suggest Improvement",
      icon: Lightbulb,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-500",
    },
    {
      id: "feedback",
      label: "General Feedback",
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-500",
    },
    {
      id: "bug",
      label: "Report Bug",
      icon: Bug,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-500",
    },
  ];

  const priorities = [
    {value: "low", label: "Low", color: "text-gray-600"},
    {value: "medium", label: "Medium", color: "text-blue-600"},
    {value: "high", label: "High", color: "text-orange-600"},
    {value: "critical", label: "Critical", color: "text-red-600"},
  ];

  const categories = [
    {value: "ui-ux", label: "UI/UX"},
    {value: "performance", label: "Performance"},
    {value: "feature-request", label: "Feature Request"},
    {value: "ai-enhancement", label: "AI Enhancement"},
    {value: "template", label: "Template"},
    {value: "authentication", label: "Authentication"},
    {value: "other", label: "Other"},
  ];

  useEffect(() => {
    // Get browser and device info
    const browserInfo = navigator.userAgent;
    const deviceInfo = `${window.screen.width}x${window.screen.height}`;

    setFormData((prev) => ({
      ...prev,
      browserInfo,
      deviceInfo,
    }));

    fetchMyFeedback();
    fetchStats();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({...prev, type: activeTab}));
  }, [activeTab]);

  const fetchMyFeedback = async () => {
    try {
      setLoadingFeedback(true);
      const response = await feedbackAPI.getMyFeedback({limit: 20});
      setMyFeedback(response.data.feedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await feedbackAPI.getFeedbackStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      await feedbackAPI.submitFeedback(formData);
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        type: activeTab,
        title: "",
        description: "",
        priority: "medium",
        category: "other",
        browserInfo: formData.browserInfo,
        deviceInfo: formData.deviceInfo,
        pageUrl: window.location.href,
      });
      // Refresh feedback list
      fetchMyFeedback();
      fetchStats();

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitError(parseValidationErrors(error));
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await feedbackAPI.upvoteFeedback(id);
      fetchMyFeedback();
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await feedbackAPI.deleteFeedback(id);
        fetchMyFeedback();
        fetchStats();
        toast.success("Feedback deleted successfully!", {
          icon: "🗑️",
          duration: 2000,
        });
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Failed to delete feedback", {
          icon: "❌",
          duration: 3000,
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: {
        label: "Open",
        class:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
      "in-progress": {
        label: "In Progress",
        class:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      resolved: {
        label: "Resolved",
        class:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      },
      closed: {
        label: "Closed",
        class:
          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      },
      duplicate: {
        label: "Duplicate",
        class:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      },
    };
    return badges[status] || badges.open;
  };

  const getTypeIcon = (type) => {
    const icons = {
      improvement: <Lightbulb className="w-4 h-4 text-yellow-500" />,
      feedback: <MessageSquare className="w-4 h-4 text-blue-500" />,
      bug: <Bug className="w-4 h-4 text-red-500" />,
    };
    return icons[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            We Value Your Feedback
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Help us improve SmartNShine by sharing your suggestions, feedback,
            or reporting bugs. Every submission matters!
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Submitted
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resolved
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.resolved}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Feedback Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Submit Feedback
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? `${tab.bgColor} ${tab.color} border-2 ${tab.borderColor}`
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-700 dark:text-green-400 font-medium">
                  Thank you! Your feedback has been submitted successfully.
                </p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-400 text-sm">
                  {submitError}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({...formData, title: e.target.value})
                  }
                  placeholder="Brief summary of your feedback"
                  required
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({...formData, description: e.target.value})
                  }
                  placeholder="Provide detailed information..."
                  required
                  maxLength={2000}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.description.length}/2000 characters
                </p>
              </div>

              {/* Priority & Category Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({...formData, priority: e.target.value})
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {priorities.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({...formData, category: e.target.value})
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>

          {/* My Feedback List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              My Feedback
            </h2>

            {loadingFeedback ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : myFeedback.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No feedback submitted yet
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {myFeedback.map((item) => {
                  const statusBadge = getStatusBadge(item.status);
                  return (
                    <div
                      key={item._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <span className="capitalize">{item.priority}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpvote(item._id)}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {item.upvotes}
                          </button>
                          {item.status === "open" && (
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {item.adminResponse && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            Admin Response:
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {item.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
