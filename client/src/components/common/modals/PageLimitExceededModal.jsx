import {X, AlertTriangle, TrendingDown, FileText} from "lucide-react";
<<<<<<< HEAD
import {calculateContentMetrics, getSuggestedReductions} from "../../../utils/resumeLimits";
=======
import {
  calculateContentMetrics,
  getSuggestedReductions,
} from "@/utils/resumeLimits";
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c

/**
 * PageLimitExceededModal - Warning popup when resume exceeds one page
 * Shows current page utilization, suggestions for reduction, and option to enable 2-page mode
 */
const PageLimitExceededModal = ({
  isOpen,
  onClose,
  resumeData,
  onEnableTwoPages,
  onContinueEditing,
}) => {
  if (!isOpen) return null;

  const metrics = calculateContentMetrics(resumeData);
  const suggestions = getSuggestedReductions(metrics);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Page Limit Exceeded</h2>
                <p className="text-orange-100 text-sm mt-1">
                  Content beyond one page will be hidden in single-page mode
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-5 border-2 border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Current Page Usage
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  Estimated Lines:
                </span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {metrics.estimatedLines} / 45 lines
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    metrics.utilizationPercent > 100
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : metrics.utilizationPercent > 90
<<<<<<< HEAD
                      ? "bg-gradient-to-r from-orange-500 to-orange-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                  style={{width: `${Math.min(metrics.utilizationPercent, 100)}%`}}
=======
                        ? "bg-gradient-to-r from-orange-500 to-orange-600"
                        : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                  style={{
                    width: `${Math.min(metrics.utilizationPercent, 100)}%`,
                  }}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
                {metrics.utilizationPercent}% of one page
              </div>
            </div>
          </div>

          {/* Section Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Content Breakdown by Section
            </h3>
            <div className="space-y-2">
              {Object.entries(metrics.sections).map(([section, data]) => {
                if (data.lines === 0) return null;
                return (
                  <div
                    key={section}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {section}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ~{data.lines} lines
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                💡 Suggestions to Fit One Page
              </h3>
              <ul className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {suggestion.section}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.action}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Will save ~{suggestion.estimatedSavings} lines
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content Hidden Warning */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border-2 border-red-200 dark:border-red-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-red-700 dark:text-red-400">
                ⚠️ Important:
              </strong>{" "}
<<<<<<< HEAD
              In single-page mode, any content that doesn't fit will be <strong>hidden</strong> from the final resume. 
              The overflow content won't appear in the PDF download or be visible to recruiters.
=======
              In single-page mode, any content that doesn't fit will be{" "}
              <strong>hidden</strong> from the final resume. The overflow
              content won't appear in the PDF download or be visible to
              recruiters.
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
            </p>
          </div>

          {/* Important Note */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-purple-700 dark:text-purple-400">
                📌 Best Practice:
              </strong>{" "}
              Most recruiters prefer one-page resumes. They spend an average of
              6-7 seconds on initial screening. A concise, well-organized
              one-page resume is more likely to get noticed.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onContinueEditing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              ✏️ Continue Editing (Reduce Content)
            </button>
            <button
              onClick={onEnableTwoPages}
              className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              📄 Enable Two-Page Resume
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
            You can change this setting anytime in the editor
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLimitExceededModal;
