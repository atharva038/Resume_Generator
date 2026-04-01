import {useState} from "react";
import {calculateResumeScore} from "@/utils/resumeScoring";
import {
  BriefcaseBusiness,
  Circle,
  FileText,
  GraduationCap,
  KeyRound,
  Lightbulb,
  Loader2,
  Mail,
  Rocket,
  Sparkles,
  Star,
  Target,
  Wrench,
  X,
  ChevronDown,
  CircleCheck,
} from "lucide-react";

const RecommendationsPanel = ({resumeData, onEnhanceAll, compact = true}) => {
  const [expanded, setExpanded] = useState(true);
  const [enhancing, setEnhancing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAdvancedEnhancer, setShowAdvancedEnhancer] = useState(false);

  if (!resumeData) return null;

  const {totalScore, breakdown, recommendations} =
    calculateResumeScore(resumeData);

  const groupedRecs = {};
  recommendations.forEach((rec) => {
    const match = rec.match(/^\[([^\]]+)\]\s*(.+)$/);
    if (!match) return;
    const [, category, text] = match;
    if (!groupedRecs[category]) groupedRecs[category] = [];
    groupedRecs[category].push(text);
  });

  const getPriorityIcon = (category) => {
    const icons = {
      Experience: BriefcaseBusiness,
      Summary: FileText,
      Skills: Target,
      Contact: Mail,
      Education: GraduationCap,
      Extras: Star,
      Formatting: Wrench,
      Keywords: KeyRound,
    };
    return icons[category] || Circle;
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

  const prioritizedCategories = Object.entries(groupedRecs)
    .map(([category, items]) => {
      const key = category.toLowerCase();
      const scoreEntry = breakdown[key];
      const score = scoreEntry?.score || 0;
      const maxScore = scoreEntry?.maxScore || 10;
      const percent = Math.round((score / maxScore) * 100);

      return {
        category,
        items,
        score,
        maxScore,
        percent,
        gap: Math.max(0, maxScore - score),
      };
    })
    .sort((a, b) => a.percent - b.percent);

  const quickWins = prioritizedCategories
    .slice(0, 3)
    .flatMap((category) =>
      category.items.slice(0, 2).map((item) => ({
        category: category.category,
        text: item,
      }))
    )
    .slice(0, compact ? 4 : 6);

  const visibleCategories = showAllCategories
    ? prioritizedCategories
    : prioritizedCategories.slice(0, compact ? 3 : 6);

  if (!expanded) {
    return (
      <div
        className="card p-4 cursor-pointer hover:shadow-md transition"
        onClick={() => setExpanded(true)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Improvement Recommendations
            </span>
            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-full font-medium">
              {recommendations.length} tips
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? "card p-4" : "card p-6"}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className={`${compact ? "text-base" : "text-lg"} font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2`}
          >
            <Lightbulb className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            {compact ? "Priority Recommendations" : "How to Improve Your Score"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {compact
              ? `Focus on high-impact changes to push ATS ${totalScore} toward 90+.`
              : `Follow these recommendations to increase your ATS score from ${totalScore} to 90+.`}
          </p>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Priority chips */}
      {prioritizedCategories.length > 0 && (
        <div className={`${compact ? "mb-4" : "mb-6"}`}>
          <div className="flex flex-wrap gap-2">
            {prioritizedCategories.slice(0, 3).map((item) => (
              <span
                key={item.category}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300"
              >
                {(() => {
                  const Icon = getPriorityIcon(item.category);
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
                <span>{item.category}</span>
                <span className="text-primary-600 dark:text-primary-400">
                  +{item.gap} pts
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick wins */}
      {quickWins.length > 0 && totalScore < 90 && (
        <div
          className={`${compact ? "mb-4 p-3" : "mb-6 p-4"} bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg`}
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            Quick Wins to Gain {Math.min(90 - totalScore, 20)} Points
          </h4>
          <ul className="space-y-2">
            {quickWins.map((rec, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
              >
                <span className="text-primary-600 dark:text-primary-400 font-bold mt-0.5">
                  {index + 1}.
                </span>
                <span>
                  <span className="font-medium">[{rec.category}] </span>
                  {rec.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grouped Recommendations */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">
          Grouped Recommendations
        </h4>
        {visibleCategories.map((entry) => (
          <details
            key={entry.category}
            className={`border rounded-lg ${compact ? "p-3" : "p-4"} ${getCategoryColor(entry.category)}`}
            open={!compact}
          >
            <summary className="list-none cursor-pointer">
              <div className="flex justify-between items-center gap-3">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
                  {(() => {
                    const Icon = getPriorityIcon(entry.category);
                    return <Icon className="w-3.5 h-3.5" />;
                  })()}
                  {entry.category}
                </h5>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {entry.score}/{entry.maxScore} ({entry.percent}%)
                </span>
              </div>
            </summary>
            <ul className="space-y-1.5 mt-3">
              {entry.items.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                >
                  <Circle className="w-2.5 h-2.5 mt-1.5 text-gray-400 dark:text-gray-500 fill-current" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}

        {prioritizedCategories.length > (compact ? 3 : 6) && (
          <button
            type="button"
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="text-xs font-medium text-primary-600 dark:text-primary-400"
          >
            {showAllCategories ? "Show fewer categories" : "Show all categories"}
          </button>
        )}
      </div>

      {/* Bottom Tips */}
      <div className={`${compact ? "mt-4 pt-3" : "mt-6 pt-4"} border-t dark:border-gray-700`}>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          General ATS Best Practices
        </h4>
        <div className={`grid ${compact ? "grid-cols-1" : "md:grid-cols-2"} gap-4`}>
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Content
            </h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Use action verbs (Led, Developed, Achieved)</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Quantify everything (%, $, #, time saved)</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Tailor to job description keywords</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Show results, not just responsibilities</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Format
            </h5>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Keep to 1 page (for &lt;10 years exp)</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Use standard section headers</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />Simple fonts (Arial, Calibri, Times)</li>
              <li className="flex items-start gap-1.5"><CircleCheck className="w-3.5 h-3.5 mt-0.5 text-primary-600 dark:text-primary-400" />No images, tables, or columns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Button - AI Enhancement */}
      {onEnhanceAll && (
        <div className={`${compact ? "mt-4" : "mt-6"}`}>
          {compact && (
            <button
              type="button"
              onClick={() => setShowAdvancedEnhancer((prev) => !prev)}
              className="mb-3 text-xs font-medium text-primary-600 dark:text-primary-400"
            >
              {showAdvancedEnhancer
                ? "Hide advanced AI instructions"
                : "Add advanced AI instructions"}
            </button>
          )}

          {/* Custom Prompt Input */}
          {(!compact || showAdvancedEnhancer) && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Custom AI Instructions (Optional)
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., Focus on technical skills, add more metrics, emphasize leadership experience, target software engineering roles..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="3"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Tip: Give specific instructions like "target data science roles"
                or "emphasize cloud technologies"
              </p>
            </div>
          )}

          {/* Enhancement Button */}
          <button
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={async () => {
              setEnhancing(true);
              try {
                await onEnhanceAll(customPrompt);
              } finally {
                setEnhancing(false);
              }
            }}
            disabled={enhancing}
          >
            {enhancing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enhancing All Sections...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                {customPrompt
                  ? "Apply Custom AI Enhancement"
                  : "Apply AI Enhancement to All Sections"}
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            AI will analyze your experience level and optimize content with
            action verbs, metrics, and keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPanel;
