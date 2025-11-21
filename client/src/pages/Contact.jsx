import {useState, useEffect} from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  Building,
  Clock,
  Sparkles,
  Lightbulb,
  Bug,
  ThumbsUp,
  Trash2,
  Loader2,
} from "lucide-react";
import {contactAPI} from "../services/api";
import {feedbackAPI} from "../services/feedback.api";
import {parseValidationErrors, formatFieldErrors} from "../utils/errorHandler";
import toast from "react-hot-toast";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("contact"); // 'contact' or 'feedback'
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    category: "general",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const [errors, setErrors] = useState({});
  
  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    type: "improvement",
    title: "",
    description: "",
    priority: "medium",
    category: "other",
    browserInfo: navigator.userAgent,
    deviceInfo: `${navigator.platform} - ${window.screen.width}x${window.screen.height}`,
    pageUrl: window.location.href,
  });
  
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [myFeedback, setMyFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch feedback data when switching to feedback tab
  useEffect(() => {
    if (activeTab === "feedback") {
      fetchMyFeedback();
      fetchStats();
    }
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

  const categories = [
    {value: "general", label: "General Inquiry", icon: "💬"},
    {value: "support", label: "Technical Support", icon: "🛠️"},
    {value: "business", label: "Business Inquiry", icon: "💼"},
    {value: "bug-report", label: "Bug Report", icon: "🐛"},
    {value: "feature-request", label: "Feature Request", icon: "✨"},
  ];

  const feedbackTypes = [
    {
      id: "improvement",
      label: "Improvement",
      icon: Lightbulb,
      color: "yellow",
      description: "Suggest ways to make our app better",
    },
    {
      id: "feedback",
      label: "General Feedback",
      icon: MessageSquare,
      color: "blue",
      description: "Share your thoughts and experiences",
    },
    {
      id: "bug",
      label: "Bug Report",
      icon: Bug,
      color: "red",
      description: "Report issues or technical problems",
    },
  ];

  const feedbackCategories = [
    {value: "ui-ux", label: "UI/UX"},
    {value: "feature-request", label: "Feature"},
    {value: "performance", label: "Performance"},
    {value: "ai-enhancement", label: "AI Enhancement"},
    {value: "template", label: "Template"},
    {value: "authentication", label: "Authentication"},
    {value: "other", label: "Other"},
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: null}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus({loading: true, success: false, error: null});

    try {
      await contactAPI.submit(formData);

      setStatus({loading: false, success: true, error: null});
      toast.success("Message sent successfully! We'll get back to you soon.", {
        icon: "✅",
        duration: 3000,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        category: "general",
        message: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setStatus({loading: false, success: false, error: null});
      }, 5000);
    } catch (err) {
      // Check for field-specific validation errors
      const fieldErrors = formatFieldErrors(err);
      if (fieldErrors) {
        setErrors(fieldErrors);
      }

      setStatus({
        loading: false,
        success: false,
        error: parseValidationErrors(err),
      });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);

    try {
      await feedbackAPI.submitFeedback(feedbackForm);
      toast.success("Feedback submitted successfully! Thank you!", {
        icon: "🎉",
        duration: 3000,
      });
      
      // Reset form
      setFeedbackForm({
        type: feedbackForm.type,
        title: "",
        description: "",
        priority: "medium",
        category: "other",
        browserInfo: navigator.userAgent,
        deviceInfo: `${navigator.platform} - ${window.screen.width}x${window.screen.height}`,
        pageUrl: window.location.href,
      });
      
      fetchMyFeedback();
      fetchStats();
    } catch (error) {
      toast.error(parseValidationErrors(error), {
        icon: "❌",
        duration: 4000,
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await feedbackAPI.upvoteFeedback(id);
      fetchMyFeedback();
      toast.success("Vote updated!", {icon: "👍", duration: 1500});
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleDeleteFeedback = async (id) => {
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
        toast.error("Failed to delete feedback", {icon: "❌", duration: 2000});
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mb-4 shadow-md">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Contact & Feedback
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/20">
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "contact"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Mail className="w-5 h-5" />
            <span>Contact Us</span>
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "feedback"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Feedback</span>
          </button>
        </div>

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
                        Email
                      </p>
                      <a
                        href="mailto:atharvasjoshi2005@gmail.com"
                        className="text-gray-900 dark:text-gray-100 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        atharvasjoshi2005@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
                        Phone
                      </p>
                      <a
                        href="tel:+919156906881"
                        className="text-gray-900 dark:text-gray-100 font-semibold hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        +91 9156906881
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
                        Location
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">
                        Cidco, Nanded
                        <br />
                        Maharashtra, India
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
                        Working Hours
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">
                        Mon - Fri: 9:00 AM - 6:00 PM
                        <br />
                        Sat - Sun: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Send className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  Send us a Message
                </h2>

                {/* Success Message */}
                {status.success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fade-in">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                          Message Sent Successfully!
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          We'll get back to you as soon as possible.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {status.error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                          Error
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-400">
                          {status.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() =>
                            setFormData({...formData, category: cat.value})
                          }
                          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            formData.category === cat.value
                              ? "border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-lg"
                              : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 bg-white dark:bg-gray-700/50"
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{cat.icon}</span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.name
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                          } bg-white dark:bg-gray-700 focus:ring-2 dark:text-white transition-all`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                            errors.email
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                          } bg-white dark:bg-gray-700 focus:ring-2 dark:text-white transition-all`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Company */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.subject
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                      } bg-white dark:bg-gray-700 focus:ring-2 dark:text-white transition-all`}
                      placeholder="How can we help?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.message
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                      } bg-white dark:bg-gray-700 focus:ring-2 dark:text-white transition-all resize-none`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {status.loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="space-y-8">
            {/* Feedback Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stats.total || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    Total Submitted
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.open || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    Open
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.inProgress || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    In Progress
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.resolved || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    Resolved
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Type Selection */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                What would you like to share?
              </h3>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setFeedbackForm({...feedbackForm, type: type.id})
                      }
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        feedbackForm.type === type.id
                          ? `border-${type.color}-500 bg-gradient-to-br from-${type.color}-50 to-${type.color}-100 dark:from-${type.color}-900/20 dark:to-${type.color}-900/10 shadow-xl shadow-${type.color}-500/20`
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-700/50"
                      }`}
                    >
                      <Icon
                        className={`w-10 h-10 mx-auto mb-3 ${
                          feedbackForm.type === type.id
                            ? `text-${type.color}-600`
                            : "text-gray-400"
                        }`}
                      />
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {type.label}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={feedbackForm.title}
                    onChange={(e) =>
                      setFeedbackForm({...feedbackForm, title: e.target.value})
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    placeholder="Brief summary of your feedback"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    maxLength={2000}
                    value={feedbackForm.description}
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all resize-none"
                    placeholder="Provide detailed information..."
                  />
                </div>

                {/* Priority & Category */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={feedbackForm.priority}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          priority: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={feedbackForm.category}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                    >
                      {feedbackCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={feedbackLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {feedbackLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* My Feedback List */}
            {loadingFeedback ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : myFeedback.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Your Feedback History
                </h3>
                {myFeedback.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-semibold text-gray-800 dark:text-white">
                            {item.title}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.type === "bug"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : item.type === "improvement"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {item.type}
                          </span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleUpvote(item._id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {item.upvotes}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(item._id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {item.adminResponse && (
                      <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                          Admin Response:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {item.adminResponse}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
