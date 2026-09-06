import { BarChart3, ChevronRight } from "lucide-react";

export default function EditorMiniScoreBar({ atsScore, onOpenAnalysis }) {
  if (!atsScore) return null;

  const isHigh = atsScore.totalScore >= 80;
  const isMid = atsScore.totalScore >= 60;

  const bgColor = isHigh ? "#dcfce7" : isMid ? "#fef9c3" : "#fee2e2";
  const textColor = isHigh ? "#15803d" : isMid ? "#854d0e" : "#b91c1c";
  const dotColor = isHigh ? "#16a34a" : isMid ? "#ca8a04" : "#dc2626";

  return (
    <div className="sticky top-0 z-20 mb-5 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm border border-gray-200/90 dark:border-zinc-800 rounded-xl shadow-xs">
      <div className="flex items-center justify-between px-3.5 py-2.5 gap-3">
        {/* Left: Score pills */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 hidden sm:block shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" /> Resume Score
            </span>
          </span>

          {/* ATS pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: dotColor }}
            />
            ATS {atsScore.totalScore}/100
          </div>

          {/* Mini progress bar */}
          <div className="hidden sm:flex items-center gap-2 w-24 shrink-0">
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${atsScore.totalScore}%`,
                  backgroundColor: dotColor,
                }}
              />
            </div>
          </div>

          {/* Level label */}
          <span className="hidden md:block text-xs text-gray-500 dark:text-gray-400 truncate">
            {atsScore.level?.label}
          </span>
        </div>

        {/* Right: CTA button */}
        <button
          onClick={onOpenAnalysis}
          className="shrink-0 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        >
          <span>Full Analysis</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
