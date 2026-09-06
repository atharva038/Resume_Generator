import { memo } from "react";
import { SECTION_META } from "../constants/editorConstants";

const SectionOutlineList = memo(
  ({ sectionIds, activeSectionId, sectionCompletionMap, onSelectSection }) => (
    <>
      {sectionIds.map((sectionId) => {
        const section = SECTION_META[sectionId];
        if (!section) return null;

        const Icon = section.icon;
        const isActive = activeSectionId === sectionId;
        const complete = sectionCompletionMap[sectionId];

        return (
          <button
            key={sectionId}
            onClick={() => onSelectSection(sectionId)}
            className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
              isActive
                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                : "hover:bg-gray-50 dark:hover:bg-zinc-900 border border-transparent"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span
              className={`text-sm flex-1 ${
                isActive
                  ? "text-blue-700 dark:text-blue-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {section.label}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                complete ? "bg-emerald-500" : "bg-gray-300 dark:bg-zinc-600"
              }`}
            />
          </button>
        );
      })}
    </>
  )
);

export default SectionOutlineList;
