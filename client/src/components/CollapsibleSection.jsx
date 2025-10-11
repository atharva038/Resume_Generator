import {useState} from "react";

/**
 * CollapsibleSection - Wrapper component for collapsible, draggable sections
 * @param {string} title - Section title
 * @param {string} icon - Emoji icon for the section
 * @param {ReactNode} children - Section content
 * @param {boolean} defaultExpanded - Whether section starts expanded
 * @param {function} onDragStart - Drag start handler
 * @param {function} onDragEnd - Drag end handler
 * @param {function} onDragOver - Drag over handler
 * @param {function} onDrop - Drop handler
 * @param {string} sectionId - Unique section identifier
 * @param {boolean} isDragging - Whether this section is being dragged
 */
const CollapsibleSection = ({
  title,
  icon = "📄",
  children,
  defaultExpanded = true,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  sectionId,
  isDragging = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

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
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-lg transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <div className="cursor-move text-gray-400 hover:text-gray-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="drag-handle"
            >
              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
            </svg>
          </div>

          {/* Icon and title */}
          <span className="text-xl">{icon}</span>
          <h2 className="section-title mb-0">{title}</h2>

          {/* Item count badge (if applicable) */}
          {children && children.props && children.props.items && (
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
              {children.props.items.length} items
            </span>
          )}
        </div>

        {/* Expand/collapse icon */}
        <div
          className="text-gray-400 transition-transform duration-200"
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
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
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
