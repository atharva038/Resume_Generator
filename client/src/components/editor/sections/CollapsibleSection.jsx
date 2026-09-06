import {useEffect, useState} from "react";

/**
 * CollapsibleSection - Wrapper component for collapsible, draggable sections
 * @param {string} title - Section title
 * @param {ReactNode} icon - Icon element for the section
 * @param {ReactNode} children - Section content
 * @param {boolean} defaultExpanded - Whether section starts expanded
 * @param {function} onDragStart - Drag start handler
 * @param {function} onDragEnd - Drag end handler
 * @param {function} onDragOver - Drag over handler
 * @param {function} onDrop - Drop handler
 * @param {string} sectionId - Unique section identifier
 * @param {boolean} isDragging - Whether this section is being dragged
 * @param {boolean|null} forceExpanded - Optional external expand/collapse control
 */
const CollapsibleSection = ({
  title,
  icon = null,
  children,
  defaultExpanded = true,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  sectionId,
  isDragging = false,
  forceExpanded = null,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (typeof forceExpanded === "boolean") {
      setIsExpanded(forceExpanded);
    }
  }, [forceExpanded]);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, sectionId)}
      onDragEnd={(e) => onDragEnd && onDragEnd(e)}
      onDragOver={(e) => onDragOver && onDragOver(e)}
      onDrop={(e) => onDrop && onDrop(e, sectionId)}
      className={`card transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"
      }`}
      style={{
        cursor: "move",
        border: isDragging ? "2px dashed #3b82f6" : undefined,
      }}
    >
      {/* Header with collapse toggle and drag handle */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-gray-50/80 dark:hover:bg-zinc-900/80 rounded-t-xl transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Drag handle */}
          <div className="cursor-move text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 shrink-0">
            <svg
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="drag-handle"
            >
              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
            </svg>
          </div>

          {/* Icon and title */}
          {icon && <span className="text-base inline-flex shrink-0 text-gray-600 dark:text-gray-400">{icon}</span>}
          <h2 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mb-0">{title}</h2>

          {/* Item count badge (if applicable) */}
          {children && children.props && children.props.items && (
            <span className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-1.5 py-0.5 rounded-full font-medium shrink-0">
              {children.props.items.length} items
            </span>
          )}
        </div>

        {/* Expand/collapse icon */}
        <div
          className="text-gray-400 dark:text-gray-500 transition-transform duration-200 shrink-0"
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3.5 pb-3.5 pt-0.5">{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
