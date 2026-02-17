import {useState} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import {resumeAPI} from "@/api/api";
import {parseValidationErrors} from "@/utils/errorHandler";
import {authStorage} from "@/utils/storage";
import {useToggle} from "@/hooks";
import {handleDateChange, isValidDate, getDateValidationMessage} from "@/utils/dateValidation";

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
  const [enhancing, toggleEnhancing, setEnhancingTrue, setEnhancingFalse] =
    useToggle(false);
  const [isEditing, toggleEditing, setIsEditingTrue, setIsEditingFalse] =
    useToggle(false);

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
    setEnhancingTrue();
    try {
      // Check if user is authenticated
      if (!authStorage.hasToken()) {
        toast.error("Please log in to use AI enhancement", {
          icon: "🔒",
          duration: 3000,
        });
        setEnhancingFalse();
        return;
      }

      // Validate resumeData and resumeId
      if (!resumeData?._id) {
        console.warn(
          "⚠️  Resume not saved yet. Please save before using AI enhancement."
        );
        toast.error(
          "Please save your resume first before using AI enhancement",
          {
            icon: "💾",
            duration: 4000,
          }
        );
        setEnhancingFalse();
        return;
      }

      console.log("🔍 Enhancing with resumeId:", resumeData._id);

      let contentToEnhance;

      if (sectionType === "summary") {
        contentToEnhance = content;
      } else if (sectionType === "experience" && experienceData) {
        // Ensure we're sending bullets as array of strings
        contentToEnhance = Array.isArray(experienceData.bullets)
          ? experienceData.bullets
          : [experienceData.bullets].filter(Boolean);
      } else if (sectionType === "projects" && projectData) {
        // Ensure we're sending bullets as array of strings
        contentToEnhance = Array.isArray(projectData.bullets)
          ? projectData.bullets
          : [projectData.bullets].filter(Boolean);
      } else {
        contentToEnhance = content;
      }

      // Ensure contentToEnhance is serializable (no complex objects)
      if (
        typeof contentToEnhance === "object" &&
        !Array.isArray(contentToEnhance)
      ) {
        console.warn("⚠️  Content is an object, converting to string");
        contentToEnhance = JSON.stringify(contentToEnhance);
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

        // Convert bullets to strings (handle objects like project data)
        const bulletStrings = bullets.map((b) => {
          if (typeof b === "string") {
            return b;
          } else if (typeof b === "object" && b !== null) {
            // If it's an object (like a project), convert to string representation
            return JSON.stringify(b);
          }
          return String(b);
        });

        onUpdate(bulletStrings);
        editor?.commands.setContent(
          `<ul>${bulletStrings.map((b) => `<li>${b}</li>`).join("")}</ul>`
        );
      }

      toast.success("Content enhanced successfully!", {
        icon: "✨",
        duration: 2000,
      });
    } catch (err) {
      // Handle 401 Unauthorized specifically
      if (err.response?.status === 401) {
        const errorCode = err.response?.data?.code;
        const errorMessage = err.response?.data?.error;

        if (errorCode === "TOKEN_EXPIRED") {
          toast.error(
            "Your session has expired. Please refresh the page and log in again.",
            {
              icon: "⏰",
              duration: 5000,
            }
          );
        } else {
          toast.error(
            errorMessage || "Authentication required. Please log in.",
            {
              icon: "🔒",
              duration: 4000,
            }
          );
        }
      } else if (err.response?.status === 403) {
        // Handle subscription/limit errors
        const errorMessage =
          err.response?.data?.error || err.response?.data?.message;
        toast.error(
          errorMessage ||
            "You've reached your usage limit. Please upgrade your plan.",
          {
            icon: "⚠️",
            duration: 5000,
          }
        );
      } else {
        toast.error(
          "Failed to enhance content: " + parseValidationErrors(err),
          {
            icon: "❌",
            duration: 3000,
          }
        );
      }
    } finally {
      setEnhancingFalse();
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
            <div>
              <input
                type="text"
                value={experienceData.startDate || ""}
                onChange={(e) =>
                  handleDateChange(
                    e.target.value,
                    experienceData.startDate || "",
                    (value) => onUpdateExperience("startDate", value)
                  )
                }
                placeholder="Start (DD/MM/YYYY)"
                className={`input-field ${!isValidDate(experienceData.startDate) && experienceData.startDate ? 'border-red-500' : ''}`}
                autoComplete="off"
                title="Format: DD/MM/YYYY (e.g., 15/01/2020)"
                maxLength="10"
              />
              {!isValidDate(experienceData.startDate) && experienceData.startDate && (
                <p className="text-xs text-red-500 mt-1">
                  {getDateValidationMessage(experienceData.startDate)}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={experienceData.endDate || ""}
                onChange={(e) =>
                  handleDateChange(
                    e.target.value,
                    experienceData.endDate || "",
                    (value) => onUpdateExperience("endDate", value)
                  )
                }
                placeholder={
                  experienceData.current ? "Present" : "End (DD/MM/YYYY)"
                }
                className={`input-field ${!isValidDate(experienceData.endDate) && experienceData.endDate && !experienceData.current ? 'border-red-500' : ''}`}
                autoComplete="off"
                disabled={experienceData.current}
                title="Format: DD/MM/YYYY (e.g., 20/12/2023)"
                maxLength="10"
              />
              {!isValidDate(experienceData.endDate) && experienceData.endDate && !experienceData.current && (
                <p className="text-xs text-red-500 mt-1">
                  {getDateValidationMessage(experienceData.endDate)}
                </p>
              )}
            </div>
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
      {sectionType === "projects" && projectData && onUpdateProject && (
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

      {/* TipTap Editor */}
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
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        💡 Tip: Click "Enhance" to optimize this content with AI for better ATS
        compatibility
      </p>
    </div>
  );
};

export default EditableSection;
