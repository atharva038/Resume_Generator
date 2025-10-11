import {useState, useEffect} from "react";
import {calculateResumeScore} from "../utils/resumeScoring";

const ScoreCard = ({resumeData, expanded = false}) => {
  const [scoreData, setScoreData] = useState(null);
  const [showDetails, setShowDetails] = useState(expanded);

  useEffect(() => {
    if (resumeData) {
      const result = calculateResumeScore(resumeData);
      setScoreData(result);
    }
  }, [resumeData]);

  if (!scoreData) return null;

  const {totalScore, breakdown, recommendations, level} = scoreData;

  // Color based on score
  const getColor = (score) => {
    if (score >= 80) return "text-green-600 border-green-500 bg-green-50";
    if (score >= 60) return "text-yellow-600 border-yellow-500 bg-yellow-50";
    return "text-red-600 border-red-500 bg-red-50";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "#10b981"; // green-500
    if (score >= 60) return "#f59e0b"; // yellow-500
    return "#ef4444"; // red-500
  };

  const colorClass = getColor(totalScore);
  const progressColor = getProgressColor(totalScore);

  return (
    <div
      className="card p-6 shadow-lg border-l-4"
      style={{borderLeftColor: progressColor}}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">ATS Score</h3>
          <p className="text-sm text-gray-600">Resume Quality Analysis</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Score Circle */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={progressColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(totalScore / 100) * 351.86} 351.86`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{color: progressColor}}>
              {totalScore}
            </span>
            <span className="text-sm text-gray-600">/ 100</span>
          </div>
        </div>

        <div className="flex-1">
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${colorClass}`}
          >
            {level.label}
          </div>
          <p className="text-sm text-gray-700">{level.description}</p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-xs">
              <span className="text-gray-500">Experience:</span>
              <span className="font-semibold ml-1">
                {breakdown.experience.score}/{breakdown.experience.maxScore}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-gray-500">Keywords:</span>
              <span className="font-semibold ml-1">
                {breakdown.keywords.score}/{breakdown.keywords.maxScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="border-t pt-4 space-y-4">
          {/* Category Breakdown */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">
              Score Breakdown
            </h4>
            <div className="space-y-2">
              {Object.entries(breakdown).map(([category, data]) => (
                <div key={category} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 capitalize">
                      {category === "extras" ? "Projects & Certs" : category}
                    </span>
                    <span className="text-xs font-semibold">
                      {data.score}/{data.maxScore}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(data.score / data.maxScore) * 100}%`,
                        backgroundColor: getProgressColor(
                          (data.score / data.maxScore) * 100
                        ),
                      }}
                    />
                  </div>
                  {/* Details tooltip */}
                  <p className="text-xs text-gray-500 mt-1">{data.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Recommendations */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
              <span>🎯</span>
              Top Recommendations
            </h4>
            <div className="space-y-2">
              {recommendations.slice(0, 5).map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <span className="text-primary-600 mt-0.5">•</span>
                  <span className="text-gray-700 flex-1">{rec}</span>
                </div>
              ))}
            </div>
            {recommendations.length > 5 && (
              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-2">
                View all {recommendations.length} recommendations →
              </button>
            )}
          </div>

          {/* Improvement Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-900 mb-2 text-xs flex items-center gap-1">
              <span>💡</span>
              Quick Tips to Improve
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>
                • Start bullets with action verbs (Led, Developed, Achieved)
              </li>
              <li>• Add numbers and metrics (increased revenue by 30%)</li>
              <li>• Keep it to 1 page (400-800 words optimal)</li>
              <li>• Include 12-30 relevant skills across 3-5 categories</li>
              <li>• Add LinkedIn and portfolio links</li>
            </ul>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {totalScore < 100 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Progress to Excellent (90+)</span>
            <span className="font-semibold text-gray-900">
              {Math.max(0, 90 - totalScore)} points needed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
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
