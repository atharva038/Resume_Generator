import {useState, useEffect} from "react";
import {
  getAllJobs,
  getJobCategories,
  getJobsByCategory,
} from "../utils/jobProfiles";
import {calculateJobSpecificScore} from "../utils/jobSpecificScoring";

const JobSpecificScoreCard = ({resumeData, onUpdateField}) => {
  const [customTechStack, setCustomTechStack] = useState("");
  const [showCustomTech, setShowCustomTech] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const categories = getJobCategories();
  const allJobs = getAllJobs();

  // Get selected job from resumeData or default
  const selectedJob = resumeData?.targetJobRole || "software-engineer";

  // Calculate score when job or tech stack changes
  const calculateScore = () => {
    if (!resumeData) return;

    setIsCalculating(true);

    // For predefined jobs, use the normal calculation
    const techArray = customTechStack
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    try {
      const result = calculateJobSpecificScore(
        resumeData,
        selectedJob,
        techArray
      );
      setScoreData(result);
      setIsCalculating(false);
    } catch (error) {
      console.error("Error calculating score:", error);
      // Fallback to zero score if calculation fails
      setScoreData({
        totalScore: 0,
        breakdown: {
          technical: {score: 0, matched: [], missing: []},
          experience: {score: 0},
          projects: {score: 0},
          education: {score: 0},
        },
        jobProfile: {label: "Error"},
        recommendations: [],
        matchedSkills: [],
        missingSkills: [],
        level: {
          label: "Error",
          description: "Unable to calculate score",
          color: "red",
        },
      });
      setIsCalculating(false);
    }
  };

  // Calculate on mount and when dependencies change
  useEffect(() => {
    calculateScore();
  }, [resumeData, selectedJob, customTechStack]);

  if (!resumeData) return null;

  const handleJobChange = (newJob) => {
    if (onUpdateField) {
      onUpdateField("targetJobRole", newJob);
    }
  };

  const handleCustomTechStackChange = (value) => {
    setCustomTechStack(value);
    // Score will recalculate automatically via useEffect
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 75) return "text-blue-600 dark:text-blue-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = (score) => {
    if (score >= 90) return "#10b981";
    if (score >= 75) return "#3b82f6";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🎯 Job-Specific ATS Score
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          See how well your resume matches specific job roles and tech stacks
        </p>
      </div>

      {/* Job Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Target Job Role
        </label>

        <div className="space-y-2">
          <select
            value={selectedJob}
            onChange={(e) => handleJobChange(e.target.value)}
            className="input-field"
          >
            {categories.map((category) => (
              <optgroup key={category} label={category}>
                {getJobsByCategory(category).map((job) => (
                  <option key={job.key} value={job.key}>
                    {job.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Custom Tech Stack */}
        <div>
          <button
            onClick={() => setShowCustomTech(!showCustomTech)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            {showCustomTech ? "- Hide" : "+"} Add Custom Tech Stack
          </button>

          {showCustomTech && (
            <div className="mt-2">
              <input
                type="text"
                value={customTechStack}
                onChange={(e) => handleCustomTechStackChange(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                className="input-field text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add specific technologies from the job description
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Score Display */}
      {isCalculating ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <svg
            className="animate-spin h-12 w-12 text-primary-600 dark:text-primary-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Calculating your job match score...
          </p>
        </div>
      ) : (
        scoreData &&
        scoreData.breakdown && (
          <div className="space-y-4">
            {/* Main Score Circle */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                    className="dark:stroke-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={getProgressColor(scoreData.totalScore)}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${
                      (scoreData.totalScore / 100) * 351.86
                    } 351.86`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl font-bold ${getScoreColor(
                      scoreData.totalScore
                    )}`}
                  >
                    {scoreData.totalScore}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    / 100
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                    scoreData.level.color === "green"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : scoreData.level.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : scoreData.level.color === "yellow"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {scoreData.level.label}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {scoreData.level.description}
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div className="mb-1">
                    <span className="font-semibold">Skills Match:</span>{" "}
                    {scoreData.matchedSkills.length}/
                    {scoreData.matchedSkills.length +
                      scoreData.missingSkills.length}
                  </div>
                  <div>
                    <span className="font-semibold">Job:</span>{" "}
                    {scoreData.jobProfile.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Score Breakdown
              </h4>
              <div className="space-y-3">
                {/* Technical Score */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Technical Skills
                      {scoreData.jobProfile?.weights?.technical &&
                        ` (${Math.round(
                          scoreData.jobProfile.weights.technical * 100
                        )}% weight)`}
                    </span>
                    <span className="text-xs font-semibold dark:text-gray-300">
                      {scoreData.breakdown?.technical?.score || 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${scoreData.breakdown.technical.score}%`,
                        backgroundColor: getProgressColor(
                          scoreData.breakdown.technical.score
                        ),
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {scoreData.breakdown.technical.details}
                  </p>
                </div>

                {/* Experience Score */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Experience
                      {scoreData.jobProfile?.weights?.experience &&
                        ` (${Math.round(
                          scoreData.jobProfile.weights.experience * 100
                        )}% weight)`}
                    </span>
                    <span className="text-xs font-semibold dark:text-gray-300">
                      {scoreData.breakdown?.experience?.score || 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${scoreData.breakdown.experience.score}%`,
                        backgroundColor: getProgressColor(
                          scoreData.breakdown.experience.score
                        ),
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {scoreData.breakdown.experience.details}
                  </p>
                </div>

                {/* Projects Score */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Projects
                      {scoreData.jobProfile?.weights?.projects &&
                        ` (${Math.round(
                          scoreData.jobProfile.weights.projects * 100
                        )}% weight)`}
                    </span>
                    <span className="text-xs font-semibold dark:text-gray-300">
                      {scoreData.breakdown?.projects?.score || 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${scoreData.breakdown.projects.score}%`,
                        backgroundColor: getProgressColor(
                          scoreData.breakdown.projects.score
                        ),
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {scoreData.breakdown.projects.details}
                  </p>
                </div>

                {/* Education Score */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Education
                      {scoreData.jobProfile?.weights?.education &&
                        ` (${Math.round(
                          scoreData.jobProfile.weights.education * 100
                        )}% weight)`}
                    </span>
                    <span className="text-xs font-semibold dark:text-gray-300">
                      {scoreData.breakdown?.education?.score || 0}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${scoreData.breakdown.education.score}%`,
                        backgroundColor: getProgressColor(
                          scoreData.breakdown.education.score
                        ),
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {scoreData.breakdown.education.details}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Recommendations */}
            {scoreData.recommendations.length > 0 && (
              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <span>💡</span>
                  Top Recommendations for This Role
                </h4>
                <div className="space-y-2">
                  {scoreData.recommendations.slice(0, 5).map((rec, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-sm ${
                        rec.priority === "high"
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                          : rec.priority === "medium"
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                          : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`font-bold ${
                            rec.priority === "high"
                              ? "text-red-600 dark:text-red-400"
                              : rec.priority === "medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {rec.priority === "high"
                            ? "⚠️"
                            : rec.priority === "medium"
                            ? "⚡"
                            : "ℹ️"}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {rec.category}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 mb-1">
                            {rec.message}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Impact: {rec.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {scoreData.missingSkills.length > 0 && (
              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Missing Skills for This Role
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scoreData.missingSkills.slice(0, 15).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default JobSpecificScoreCard;
