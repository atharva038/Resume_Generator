import {useState} from "react";
import {
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  AlertCircle,
  Loader2,
  Zap,
} from "lucide-react";
import {mlAPI} from "../../../services/api";
import toast from "react-hot-toast";

const JobMatchAnalyzer = ({resumeData}) => {
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const handleAnalyze = async () => {
    if (!jobDescription || jobDescription.trim().length < 50) {
      toast.error("Please enter a job description (at least 50 characters)");
      return;
    }

    if (!resumeData) {
      toast.error("Resume data is required");
      return;
    }

    setAnalyzing(true);

    try {
      const response = await mlAPI.calculateMatchScore(
        resumeData,
        jobDescription
      );

      if (response.data.success) {
        setMatchResult(response.data.data);
        toast.success("Match analysis complete! 🎯", {icon: "✨"});
      } else {
        throw new Error(response.data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Match analysis error:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to analyze match. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (score >= 60) return "bg-gradient-to-r from-blue-500 to-indigo-500";
    if (score >= 40) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent Match! 🎉";
    if (score >= 60) return "Good Match! 👍";
    if (score >= 40) return "Fair Match";
    return "Needs Improvement";
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
            AI-Powered Matching
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          AI Job-Resume Match Analyzer
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          See how well your resume matches any job description using Google
          Gemini AI
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Paste Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the complete job description here... (Requirements, skills, responsibilities, etc.)"
          className="w-full min-h-[200px] px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors resize-y text-gray-900 dark:text-white"
          disabled={analyzing}
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {jobDescription.length} characters (min: 50)
          </p>
          <button
            onClick={handleAnalyze}
            disabled={analyzing || jobDescription.trim().length < 50}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Analyze Match
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {matchResult && (
        <div className="animate-fade-in-up space-y-6">
          {/* Match Score Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular Score */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg
                  className="transform -rotate-90 w-48 h-48"
                  viewBox="0 0 200 200"
                >
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="currentColor"
                    strokeWidth="15"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    stroke="url(#gradient)"
                    strokeWidth="15"
                    fill="none"
                    strokeDasharray={`${
                      (matchResult.matchPercentage / 100) * 534
                    } 534`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          matchResult.matchPercentage >= 80
                            ? "#10b981"
                            : matchResult.matchPercentage >= 60
                            ? "#3b82f6"
                            : matchResult.matchPercentage >= 40
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          matchResult.matchPercentage >= 80
                            ? "#34d399"
                            : matchResult.matchPercentage >= 60
                            ? "#6366f1"
                            : matchResult.matchPercentage >= 40
                            ? "#fb923c"
                            : "#f472b6"
                        }
                      />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-5xl font-bold ${getScoreColor(
                      matchResult.matchPercentage
                    )}`}
                  >
                    {matchResult.matchPercentage}%
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Match Score
                  </span>
                </div>
              </div>

              {/* Score Details */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {getScoreMessage(matchResult.matchPercentage)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                  {matchResult.overallAssessment}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      {matchResult.matchedSkills?.length || 0} Skills Matched
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      {matchResult.missingSkills?.length || 0} Skills Missing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h4 className="text-xl font-bold text-green-900 dark:text-green-100">
                  Your Strengths
                </h4>
              </div>
              <ul className="space-y-2">
                {matchResult.strengths?.map((strength, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-green-800 dark:text-green-200"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <h4 className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  Areas to Improve
                </h4>
              </div>
              <ul className="space-y-2">
                {matchResult.weaknesses?.map((weakness, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-orange-800 dark:text-orange-200"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-600 dark:text-orange-400" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Skills Analysis
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <div>
                <h5 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Matched Skills ({matchResult.matchedSkills?.length || 0})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {matchResult.matchedSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h5 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Missing Skills ({matchResult.missingSkills?.length || 0})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium"
                    >
                      ✗ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 md:p-8 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              <h4 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                Actionable Suggestions
              </h4>
            </div>
            <div className="space-y-3">
              {matchResult.suggestions?.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JobMatchAnalyzer;
