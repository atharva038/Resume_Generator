import {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import toast from "react-hot-toast";
import {useAuth} from "@/context/AuthContext";
import interviewAPI from "@/api/interview.api";
import {
  Award,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  MessageSquare,
  BookOpen,
  Lightbulb,
  Play,
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

const InterviewResult = () => {
  const {sessionId} = useParams();
  const navigate = useNavigate();
  const {user} = useAuth();

  const [result, setResult] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadResult();
  }, [user, navigate, sessionId]);

  const loadResult = async () => {
    try {
      const response = await interviewAPI.getResult(sessionId);
      setResult(response.data.result);
      setSession(response.data.session);
    } catch (error) {
      console.error("Failed to load result:", error);
      toast.error("Failed to load interview result");
      navigate("/interview/history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const handleDownloadReport = () => {
    // Generate downloadable report
    const reportText = generateTextReport();
    const blob = new Blob([reportText], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-report-${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  const generateTextReport = () => {
    let report = `
INTERVIEW PERFORMANCE REPORT
============================
Date: ${formatDate(result.createdAt)}
Role: ${session.role}
Type: ${session.interviewType}
Experience Level: ${session.experienceLevel}

OVERALL SCORE: ${result.overallScore}% (${result.grade})

SKILL BREAKDOWN
---------------
`;
    result.skillBreakdown?.forEach((skill) => {
      report += `${skill.skill}: ${skill.score}%\n`;
    });

    report += `
ANSWERS
-------
`;
    session.questions?.forEach((q, i) => {
      report += `
Q${i + 1}: ${q.question}
Your Answer: ${q.answer || "Not answered"}
Score: ${q.score?.toFixed(1) || "N/A"}%
Feedback: ${q.feedback || "N/A"}
`;
    });

    report += `
IMPROVEMENT SUGGESTIONS
-----------------------
`;
    result.improvementSuggestions?.forEach((suggestion) => {
      report += `- [${suggestion.priority}] ${suggestion.area}: ${suggestion.suggestion}\n`;
    });

    report += `
OVERALL FEEDBACK
----------------
${result.overallFeedback}

RECOMMENDATIONS
---------------
${result.recommendations?.join("\n") || "No specific recommendations"}
`;
    return report;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!result || !session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Result Not Found
        </h2>
        <Link to="/interview/history" className="text-blue-500 hover:underline">
          Back to History
        </Link>
      </div>
    );
  }

  const Icon = typeIcons[session.interviewType] || Sparkles;
  const TrendIcon =
    result.comparisonData?.trend === "improving"
      ? TrendingUp
      : result.comparisonData?.trend === "declining"
        ? TrendingDown
        : Minus;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/interview/history"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to History
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Main Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Icon className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {session.role} Interview
                </h1>
                <p className="text-gray-600 dark:text-gray-400 capitalize">
                  {session.interviewType.replace("-", " ")} •{" "}
                  {session.experienceLevel} Level
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(result.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(session.totalDurationSeconds)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className={`relative w-40 h-40 mx-auto mb-4`}>
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.overallScore / 100)}`}
                    strokeLinecap="round"
                    className={getScoreColor(result.overallScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}
                  >
                    {result.overallScore}%
                  </span>
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    {result.grade}
                  </span>
                </div>
              </div>

              {result.comparisonData && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <TrendIcon
                    className={`w-4 h-4 ${
                      result.comparisonData.trend === "improving"
                        ? "text-green-500"
                        : result.comparisonData.trend === "declining"
                          ? "text-red-500"
                          : "text-gray-500"
                    }`}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {result.comparisonData.trend === "improving"
                      ? `+${result.comparisonData.percentageChange}% from last`
                      : result.comparisonData.trend === "declining"
                        ? `${result.comparisonData.percentageChange}% from last`
                        : "No change"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skill Breakdown */}
          {result.skillBreakdown?.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Skill Breakdown
              </h2>
              <div className="space-y-4">
                {result.skillBreakdown.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">
                        {skill.skill}
                      </span>
                      <span
                        className={`font-semibold ${getScoreColor(skill.score)}`}
                      >
                        {skill.score}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          skill.score >= 80
                            ? "bg-green-500"
                            : skill.score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{width: `${skill.score}%`}}
                      />
                    </div>
                    {skill.feedback && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {skill.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Overall Feedback */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Overall Feedback
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {result.overallFeedback}
          </p>
        </div>

        {/* Questions & Answers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Questions & Answers ({session.questions?.length || 0})
          </h2>
          <div className="space-y-4">
            {session.questions?.map((q, i) => (
              <div
                key={i}
                className={`border rounded-lg overflow-hidden ${
                  q.score >= 70
                    ? "border-green-200 dark:border-green-800"
                    : q.score >= 50
                      ? "border-yellow-200 dark:border-yellow-800"
                      : "border-red-200 dark:border-red-800"
                }`}
              >
                <button
                  onClick={() =>
                    setExpandedQuestion(expandedQuestion === i ? null : i)
                  }
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${getScoreBgColor(q.score)} ${getScoreColor(q.score)}`}
                    >
                      {q.score?.toFixed(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        Q{i + 1}: {q.question}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {q.category} • {q.difficulty}
                      </p>
                    </div>
                  </div>
                  {expandedQuestion === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedQuestion === i && (
                  <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Your Answer
                      </h4>
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        {q.answer || "Not answered"}
                      </p>
                    </div>

                    {q.feedback && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Feedback
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {q.feedback}
                        </p>
                      </div>
                    )}

                    {q.strengths?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Strengths
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {q.strengths.map((s, j) => (
                            <li key={j}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {q.improvements?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Areas for Improvement
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                          {q.improvements.map((im, j) => (
                            <li key={j}>{im}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Suggestions */}
        {result.improvementSuggestions?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Improvement Suggestions
            </h2>
            <div className="space-y-3">
              {result.improvementSuggestions.map((suggestion, i) => {
                const priorityColors = {
                  high: "border-l-red-500 bg-red-50 dark:bg-red-900/10",
                  medium:
                    "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10",
                  low: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10",
                };

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border-l-4 ${priorityColors[suggestion.priority]}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {suggestion.area}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          suggestion.priority === "high"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : suggestion.priority === "medium"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {suggestion.suggestion}
                    </p>
                    {suggestion.resources?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {suggestion.resources.map((resource, j) => (
                          <a
                            key={j}
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Resource {j + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations?.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recommendations
            </h2>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/interview"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            New Interview
          </Link>
          <Link
            to="/interview/history"
            className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;
