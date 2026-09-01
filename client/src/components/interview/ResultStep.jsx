import React from "react";
import {
  Award,
  BarChart3,
  CheckCircle,
  XCircle,
  BookOpen,
  RefreshCw,
} from "lucide-react";

// Result Step Component
export const ResultStep = ({
  result,
  elapsedTime,
  formatTime,
  onNewInterview,
  onViewHistory,
}) => {
  if (!result) return null;

  const scoreColor =
    result.overallScore >= 70
      ? "text-green-500"
      : result.overallScore >= 50
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-blue-500/10 dark:to-cyan-500/10 dark:backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full text-sm font-medium text-slate-700 dark:text-blue-300 shadow-lg mb-6">
          <Award className="w-4 h-4" />
          Interview Complete
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Your Performance Report
        </h2>
        <div className="relative w-36 h-36 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="64"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-gray-200 dark:text-white/10"
            />
            <circle
              cx="72"
              cy="72"
              r="64"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeDasharray={`${(result.overallScore / 100) * 402} 402`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="scoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  className={`${result.overallScore >= 70 ? "stop-color-green-500" : result.overallScore >= 50 ? "stop-color-yellow-500" : "stop-color-red-500"}`}
                  style={{
                    stopColor:
                      result.overallScore >= 70
                        ? "#22c55e"
                        : result.overallScore >= 50
                          ? "#eab308"
                          : "#ef4444",
                  }}
                />
                <stop
                  offset="100%"
                  className={`${result.overallScore >= 70 ? "stop-color-emerald-500" : result.overallScore >= 50 ? "stop-color-orange-500" : "stop-color-pink-500"}`}
                  style={{
                    stopColor:
                      result.overallScore >= 70
                        ? "#10b981"
                        : result.overallScore >= 50
                          ? "#f97316"
                          : "#ec4899",
                  }}
                />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${scoreColor}`}>
              {result.overallScore}
            </span>
          </div>
        </div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {result.grade} - {result.performanceLevel}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Duration: {formatTime(elapsedTime)} |{" "}
          {result.metrics?.answeredQuestions || 0}/{result.metrics?.totalQuestions || 0}{" "}
          questions answered
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Skill Breakdown */}
      {result.skillBreakdown && Object.keys(result.skillBreakdown).length > 0 && (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Skill Breakdown
          </h3>
          <div className="space-y-5">
            {Object.entries(result.skillBreakdown).map(([skill, data]) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300 capitalize font-medium">
                    {skill.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span
                    className={`font-bold ${data.score >= 70 ? "text-green-500" : data.score >= 50 ? "text-yellow-500" : "text-red-500"}`}
                  >
                    {data.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      data.score >= 70
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : data.score >= 50
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-red-500 to-pink-500"
                    }`}
                    style={{ width: `${data.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-green-200 dark:border-green-500/20 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths?.map((s, i) => (
              <li
                key={i}
                className="text-gray-600 dark:text-gray-400 flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-red-500/20 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {result.weaknesses?.map((w, i) => (
              <li
                key={i}
                className="text-gray-600 dark:text-gray-400 flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Practice Areas */}
      {result.practiceAreas?.length > 0 && (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Recommended Practice Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.practiceAreas.map((area, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-500/20"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onNewInterview}
          className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          <RefreshCw className="w-5 h-5" />
          Practice Again
        </button>
        <button
          onClick={onViewHistory}
          className="flex-1 py-4 bg-gray-100/80 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:border-blue-500/50 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <BarChart3 className="w-5 h-5" />
          View History
        </button>
      </div>
    </div>
  );
};
