import {useState} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import {resumeAPI} from "../services/api";
import {parseValidationErrors} from "../utils/errorHandler";
import CharacterCounter from "./CharacterCounter";

const EditableSection = ({
  title,
  content,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  sectionType,
  resumeData,
  experienceData,
  onUpdateExperience,
  projectData,
  onUpdateProject,
}) => {
  const [enhancing, setEnhancing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize TipTap editor for bullet points
  const editor = useEditor({
    extensions: [StarterKit],
    content: Array.isArray(content)
      ? `<ul>${content.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`
      : typeof content === "object"
      ? `<ul>${(content.bullets || [])
          .map((bullet) => `<li>${bullet}</li>`)
          .join("")}</ul>`
      : `<p>${content || ""}</p>`,
    onUpdate: ({editor}) => {
      if (sectionType === "summary") {
        onUpdate(editor.getText());
      } else {
        // Extract bullets from editor
        const html = editor.getHTML();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const bullets = Array.from(doc.querySelectorAll("li")).map((li) =>
          li.textContent.trim()
        );
        onUpdate(bullets.length > 0 ? bullets : [editor.getText()]);
      }
    },
  });

  const handleEnhance = async () => {
    setEnhancing(true);
    try {
      let contentToEnhance;

      if (sectionType === "summary") {
        contentToEnhance = content;
      } else if (sectionType === "experience" && experienceData) {
        contentToEnhance = experienceData.bullets;
      } else if (sectionType === "project" && projectData) {
        contentToEnhance = projectData.bullets;
      } else {
        contentToEnhance = content;
      }

      // Pass full resumeData for context-aware enhancement
      const response = await resumeAPI.enhance(
        contentToEnhance,
        sectionType,
        resumeData
      );
      const enhanced = response.data.enhanced;

      if (sectionType === "summary") {
        onUpdate(enhanced);
        editor?.commands.setContent(`<p>${enhanced}</p>`);
      } else {
        const bullets = Array.isArray(enhanced) ? enhanced : [enhanced];
        onUpdate(bullets);
        editor?.commands.setContent(
          `<ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
        );
      }

      toast.success("Content enhanced successfully!", {
        icon: "✨",
        duration: 2000,
      });
    } catch (err) {
      toast.error("Failed to enhance content: " + parseValidationErrors(err), {
        icon: "❌",
        duration: 3000,
      });
    } finally {
      setEnhancing(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="section-title mb-0">{title}</h2>
        </div>
        <div className="flex gap-2">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            >
              ↓
            </button>
          )}
          <button
            onClick={handleEnhance}
            disabled={enhancing}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 font-medium px-3 py-1 rounded border border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50"
          >
            {enhancing ? "✨ Enhancing..." : "✨ Enhance"}
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 font-medium px-3 py-1"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Experience-specific fields */}
      {sectionType === "experience" && experienceData && onUpdateExperience && (
        <div className="space-y-2 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={experienceData.company || ""}
              onChange={(e) => onUpdateExperience("company", e.target.value)}
              placeholder="Company Name"
              className="input-field"
              autoComplete="off"
            />
            <input
              type="text"
              value={experienceData.title || ""}
              onChange={(e) => onUpdateExperience("title", e.target.value)}
              placeholder="Job Title"
              className="input-field"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={experienceData.location || ""}
              onChange={(e) => onUpdateExperience("location", e.target.value)}
              placeholder="Location"
              className="input-field"
              autoComplete="off"
            />
            <input
              type="text"
              value={experienceData.startDate || ""}
              onChange={(e) => onUpdateExperience("startDate", e.target.value)}
              placeholder="Start Date"
              className="input-field"
              autoComplete="off"
            />
            <input
              type="text"
              value={experienceData.endDate || ""}
              onChange={(e) => onUpdateExperience("endDate", e.target.value)}
              placeholder={experienceData.current ? "Present" : "End Date"}
              className="input-field"
              autoComplete="off"
              disabled={experienceData.current}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={experienceData.current || false}
              onChange={(e) => onUpdateExperience("current", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current position
            </span>
          </label>
        </div>
      )}

      {/* Project-specific fields */}
      {sectionType === "project" && projectData && onUpdateProject && (
        <div className="space-y-2 mb-4">
          <input
            type="text"
            value={projectData.name || ""}
            onChange={(e) => onUpdateProject("name", e.target.value)}
            placeholder="Project Name"
            className="input-field font-medium"
            autoComplete="off"
          />
          <input
            type="text"
            value={
              Array.isArray(projectData.technologies)
                ? projectData.technologies.join(", ")
                : projectData.technologies || ""
            }
            onChange={(e) => {
              const value = e.target.value;
              const techArray = value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
              onUpdateProject("technologies", techArray);
            }}
            placeholder="Technologies (comma-separated)"
            className="input-field"
            autoComplete="off"
          />
          <input
            type="url"
            value={projectData.link || ""}
            onChange={(e) => onUpdateProject("link", e.target.value)}
            placeholder="Project Link (optional)"
            className="input-field"
            autoComplete="off"
          />
        </div>
      )}

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2 flex gap-2">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("bold")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("italic")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <em>I</em>
          </button>
          {sectionType !== "summary" && (
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`px-2 py-1 rounded ${
                editor?.isActive("bulletList")
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              • List
            </button>
          )}
        </div>
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none"
        />
        {sectionType === "summary" && (
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
            <CharacterCounter 
              section="summary" 
              field="summary" 
              value={content || ''} 
            />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        💡 Tip: Click "Enhance" to optimize this content with AI for better ATS
        compatibility
      </p>
    </div>
  );
};

export default EditableSection;
