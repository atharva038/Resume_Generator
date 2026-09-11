import { memo } from "react";
import { X, List } from "lucide-react";
import SectionOutlineList from "./SectionOutlineList";

// Memoized desktop floating nav to keep editor re-renders from repainting the full outline panel.
const DesktopFloatingSectionNav = memo(
  ({
    floatingNavContainerRef,
    floatingNavOffset,
    showFloatingNav,
    onDragStart,
    onToggleFloatingNav,
    completionPercentage,
    onJumpToFirstIncomplete,
    onExpandAll,
    onCollapseAll,
    trackableSectionIds,
    activeSectionId,
    sectionCompletionMap,
    onSelectSection,
    onMoveSection,
  }) => (
    <div
      ref={floatingNavContainerRef}
      className="hidden lg:block fixed right-6 bottom-20 z-50 no-print"
      style={{
        transform: `translate(${floatingNavOffset?.x || 0}px, ${floatingNavOffset?.y || 0}px)`,
      }}
    >
      <button
        onMouseDown={onDragStart}
        onClick={onToggleFloatingNav}
        className="w-11 h-11 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg border border-gray-700 dark:border-gray-300 hover:shadow-xl transition-all flex items-center justify-center cursor-grab active:cursor-grabbing"
        title="Drag or toggle section navigation"
      >
        {showFloatingNav ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
      </button>

      {showFloatingNav && (
        <div className="mt-3 w-64 bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Section Outline
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {completionPercentage}%
            </span>
          </div>
          <button
            onClick={onJumpToFirstIncomplete}
            className="w-full mb-2 px-2.5 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            Jump to first incomplete
          </button>
          <div className="flex items-center gap-1.5 mb-2">
            <button
              onClick={onExpandAll}
              className="flex-1 px-2 py-1.5 rounded-md border border-gray-200 dark:border-zinc-700 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Expand all
            </button>
            <button
              onClick={onCollapseAll}
              className="flex-1 px-2 py-1.5 rounded-md border border-gray-200 dark:border-zinc-700 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Collapse all
            </button>
          </div>
          <div className="h-px bg-gray-200 dark:bg-zinc-800 mb-2" />
          <div className="space-y-1">
            <SectionOutlineList
              sectionIds={trackableSectionIds}
              activeSectionId={activeSectionId}
              sectionCompletionMap={sectionCompletionMap}
              onSelectSection={onSelectSection}
              onMoveSection={onMoveSection}
            />
          </div>
        </div>
      )}
    </div>
  )
);

export default DesktopFloatingSectionNav;
