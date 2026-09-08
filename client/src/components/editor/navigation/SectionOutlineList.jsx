import { memo } from "react";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { SECTION_META } from "../constants/editorConstants";

const SectionOutlineList = memo(
  ({
    sectionIds,
    activeSectionId,
    sectionCompletionMap,
    onSelectSection,
    onMoveSection,
  }) => (
    <div className="space-y-1">
      {sectionIds.map((sectionId, index) => {
        const section = SECTION_META[sectionId];
        if (!section) return null;

        const Icon = section.icon;
        const isActive = activeSectionId === sectionId;
        const complete = sectionCompletionMap[sectionId];
        const isFirst = index === 0;
        const isLast = index === sectionIds.length - 1;

        return (
          <div
            key={sectionId}
            className={`group w-full px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
              isActive
                ? "bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/80"
                : "hover:bg-gray-50 dark:hover:bg-zinc-900 border border-transparent"
            }`}
          >
            {/* Section click to navigate */}
            <button
              type="button"
              onClick={() => onSelectSection(sectionId)}
              className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
              title={`Jump to ${section.label}`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300"
                }`}
              />
              <span
                className={`text-xs truncate font-medium ${
                  isActive
                    ? "text-violet-700 dark:text-violet-300 font-semibold"
                    : "text-gray-700 dark:text-zinc-300"
                }`}
              >
                {section.label}
              </span>
            </button>

            {/* Reorder Arrows (↑ / ↓) */}
            {onMoveSection && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSection(sectionId, "up");
                  }}
                  className={`p-1 rounded text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors ${
                    isFirst ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  title="Move section up in resume"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={isLast}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSection(sectionId, "down");
                  }}
                  className={`p-1 rounded text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors ${
                    isLast ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  title="Move section down in resume"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Completion Status Dot */}
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                complete ? "bg-emerald-500 shadow-xs shadow-emerald-500/50" : "bg-gray-300 dark:bg-zinc-700"
              }`}
              title={complete ? "Complete" : "Incomplete"}
            />
          </div>
        );
      })}
    </div>
  )
);

export default SectionOutlineList;
