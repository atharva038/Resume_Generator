import {useState, useEffect} from "react";
import {calculateResumeScore} from "@/utils/resumeScoring";
import {getScoreTierMeta} from "@/utils/scorePresentation";
import {Lightbulb, Target, CircleCheck} from "lucide-react";

const ScoreCard = ({resumeData, expanded = false}) => {
  const [scoreData, setScoreData] = useState(null);
  const [showDetails, setShowDetails] = useState(expanded);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(expanded);

  useEffect(() => {
    if (resumeData) {
      const result = calculateResumeScore(resumeData);
      setScoreData(result);
    }
  }, [resumeData]);

  if (!scoreData) return null;

  const {totalScore, breakdown, recommendations, level} = scoreData;

  const tierMeta = getScoreTierMeta(totalScore, {high: 80, medium: 60});
  const colorClass = tierMeta.panelClass;
  const progressColor = tierMeta.solid;
  const previewRecommendations = showAllRecommendations
    ? recommendations
    : recommendations.slice(0, 5);
  const weakAreas = Object.entries(breakdown)
    .map(([category, data]) => ({
      category,
      percent: (data.score / data.maxScore) * 100,
      score: data.score,
      maxScore: data.maxScore,
    }))
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 2);

  return (
    <div
      className="card p-6 shadow-lg border"
      style={{
        borderColor: `${progressColor}66`,
        boxShadow: `0 0 0 1px ${progressColor}1f`,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ATS Score
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Resume Quality Analysis
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Score Circle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
        <div className="relative mx-auto sm:mx-0">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke={progressColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(totalScore / 100) * 301.59} 301.59`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{color: progressColor}}>
              {totalScore}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              / 100
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${colorClass}`}
          >
            {level.label}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {level.description}
          </p>

          {/* Quick weak-area summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {weakAreas.map((area) => (
              <div
                key={area.category}
                className="text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900"
              >
                <span className="text-gray-500 dark:text-gray-400 capitalize">
                  {area.category === "extras" ? "projects & certs" : area.category}
                </span>
                <span className="font-semibold ml-1 dark:text-gray-300">
                  {area.score}/{area.maxScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="border-t dark:border-gray-700 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Score Breakdown
            </h4>
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-xs text-primary-600 dark:text-primary-400 font-medium"
            >
              {showBreakdown ? "Collapse" : "Expand"}
            </button>
          </div>

          {showBreakdown && (
            <div className="space-y-2">
              {Object.entries(breakdown).map(([category, data]) => (
                <div key={category} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {category === "extras" ? "Projects & Certs" : category}
                    </span>
                    <span className="text-xs font-semibold dark:text-gray-300">
                      {data.score}/{data.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(data.score / data.maxScore) * 100}%`,
                        backgroundColor: getScoreTierMeta(
                          (data.score / data.maxScore) * 100,
                          {high: 80, medium: 60}
                        ).solid,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {data.details}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Top Recommendations */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              Top Recommendations
            </h4>
            <div className="space-y-2">
              {previewRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <span className="text-primary-600 dark:text-primary-400 mt-0.5">
                    •
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">
                    {rec}
                  </span>
                </div>
              ))}
            </div>
            {recommendations.length > 5 && (
              <button
                onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium mt-2"
              >
                {showAllRecommendations
                  ? "Show fewer recommendations"
                  : `View all ${recommendations.length} recommendations`}
              </button>
            )}
          </div>

          {/* Improvement Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 text-xs flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" />
              Quick Tips to Improve
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li className="flex items-start gap-1.5">
                <CircleCheck className="w-3.5 h-3.5 mt-0.5 text-blue-700 dark:text-blue-300" />
                Start bullets with action verbs (Led, Developed, Achieved)
              </li>
              <li className="flex items-start gap-1.5">
                <CircleCheck className="w-3.5 h-3.5 mt-0.5 text-blue-700 dark:text-blue-300" />
                Add numbers and metrics (increased revenue by 30%)
              </li>
              <li className="flex items-start gap-1.5">
                <CircleCheck className="w-3.5 h-3.5 mt-0.5 text-blue-700 dark:text-blue-300" />
                Keep it to 1 page (400-800 words optimal)
              </li>
              <li className="flex items-start gap-1.5">
                <CircleCheck className="w-3.5 h-3.5 mt-0.5 text-blue-700 dark:text-blue-300" />
                Include 12-30 relevant skills across 3-5 categories
              </li>
              <li className="flex items-start gap-1.5">
                <CircleCheck className="w-3.5 h-3.5 mt-0.5 text-blue-700 dark:text-blue-300" />
                Add LinkedIn and portfolio links
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {totalScore < 100 && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              Progress to Excellent (90+)
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {Math.max(0, 90 - totalScore)} points needed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
              style={{width: `${(totalScore / 90) * 100}%`}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
