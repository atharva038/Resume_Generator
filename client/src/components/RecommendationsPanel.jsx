import {useState} from "react";
import {calculateResumeScore} from "../utils/resumeScoring";

const RecommendationsPanel = ({resumeData, onEnhanceAll}) => {
  const [expanded, setExpanded] = useState(true);
  const [enhancing, setEnhancing] = useState(false);

  if (!resumeData) return null;

  const {totalScore, breakdown, recommendations} =
    calculateResumeScore(resumeData);

  // Group recommendations by category
  const groupedRecs = {};
  recommendations.forEach((rec) => {
    const match = rec.match(/^\[([^\]]+)\]\s*(.+)$/);
    if (match) {
      const [, category, text] = match;
      if (!groupedRecs[category]) groupedRecs[category] = [];
      groupedRecs[category].push(text);
    }
  });

  const getPriorityIcon = (category) => {
    const icons = {
      Experience: "💼",
      Summary: "📝",
      Skills: "🎯",
      Contact: "📧",
      Education: "🎓",
      Extras: "⭐",
      Formatting: "📄",
      Keywords: "🔑",
    };
    return icons[category] || "•";
  };

  const getCategoryColor = (category) => {
    const colors = {
      Experience:
        "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
      Summary:
        "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20",
      Skills:
        "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
      Contact:
        "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
      Education:
        "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-900/20",
      Extras:
        "border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20",
      Formatting:
        "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
      Keywords:
        "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20",
    };
    return (
      colors[category] ||
      "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
    );
  };

  if (!expanded) {
    return (
      <div
        className="card p-4 cursor-pointer hover:shadow-md transition"
        onClick={() => setExpanded(true)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Improvement Recommendations
            </span>
            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-full font-medium">
              {recommendations.length} tips
            </span>
          </div>
          <span className="text-gray-400 dark:text-gray-500">▼</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>💡</span>
            How to Improve Your Score
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Follow these recommendations to increase your ATS score from{" "}
            <span className="font-semibold">{totalScore}</span> to 90+
          </p>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <span className="text-xl">×</span>
        </button>
      </div>

      {/* Priority Actions */}
      {totalScore < 90 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
          <h4 className="font-semibold text-primary-900 dark:text-primary-300 mb-2 flex items-center gap-2">
            <span>🚀</span>
            Quick Wins to Gain {Math.min(90 - totalScore, 20)} Points
          </h4>
          <ul className="space-y-2">
            {recommendations.slice(0, 3).map((rec, index) => (
              <li
                key={index}
                className="text-sm text-primary-800 dark:text-primary-300 flex items-start gap-2"
              >
                <span className="text-primary-600 dark:text-primary-400 font-bold mt-0.5">
                  {index + 1}.
                </span>
                <span>{rec.replace(/^\[[^\]]+\]\s*/, "")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grouped Recommendations */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3">
          All Recommendations by Category
        </h4>
        {Object.entries(groupedRecs).map(([category, items]) => {
          const categoryData = breakdown[category.toLowerCase()];
          const percentage = categoryData
            ? Math.round((categoryData.score / categoryData.maxScore) * 100)
            : 0;

          return (
            <div
              key={category}
              className={`border rounded-lg p-4 ${getCategoryColor(category)}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
                  <span>{getPriorityIcon(category)}</span>
                  {category}
                </h5>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {categoryData?.score || 0}/{categoryData?.maxScore || 0} pts (
                  {percentage}%)
                </span>
              </div>
              <ul className="space-y-1.5">
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                  >
                    <span className="text-gray-400 dark:text-gray-500 mt-0.5">
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Bottom Tips */}
      <div className="mt-6 pt-4 border-t dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
          <span>📚</span>
          General ATS Best Practices
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Content
            </h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>✓ Use action verbs (Led, Developed, Achieved)</li>
              <li>✓ Quantify everything (%, $, #, time saved)</li>
              <li>✓ Tailor to job description keywords</li>
              <li>✓ Show results, not just responsibilities</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Format
            </h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>✓ Keep to 1 page (for &lt;10 years exp)</li>
              <li>✓ Use standard section headers</li>
              <li>✓ Simple fonts (Arial, Calibri, Times)</li>
              <li>✓ No images, tables, or columns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {totalScore < 80 && onEnhanceAll && (
        <div className="mt-6 text-center">
          <button
            className="btn-primary w-full"
            onClick={async () => {
              setEnhancing(true);
              try {
                await onEnhanceAll();
              } finally {
                setEnhancing(false);
              }
            }}
            disabled={enhancing}
          >
            {enhancing ? (
              <>
                <span className="inline-block animate-spin mr-2">⚙️</span>
                Enhancing All Sections...
              </>
            ) : (
              "Apply AI Enhancement to All Sections"
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Let AI optimize your content with action verbs, metrics, and
            keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPanel;
