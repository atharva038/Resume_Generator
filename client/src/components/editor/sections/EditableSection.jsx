import {useState} from "react";
import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";
import {resumeAPI} from "@/api/api";
import {parseValidationErrors} from "@/utils/errorHandler";
import {authStorage} from "@/utils/storage";
import {useToggle} from "@/hooks";
import {Lightbulb, Loader2, Sparkles} from "lucide-react";

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
  const [techInputValue, setTechInputValue] = useState(
    Array.isArray(projectData?.technologies)
      ? projectData.technologies.join(", ")
      : projectData?.technologies || ""
  );

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
    <div className="card p-3 sm:p-3.5 mb-2.5">
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex-1 min-w-0">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mb-0">{title}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 text-xs"
              title="Move Up"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 text-xs"
              title="Move Down"
            >
              ↓
            </button>
          )}
          <button
            onClick={handleEnhance}
            disabled={enhancing}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-blue-500/40 dark:border-blue-400/40 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {enhancing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Enhance
              </>
            )}
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 text-xs font-medium px-2 py-1"
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
              placeholder="Start Date (MM/YYYY)"
              className="input-field"
              autoComplete="off"
              pattern="(0[1-9]|1[0-2])\/[0-9]{4}"
              title="Format: MM/YYYY (e.g., 01/2020)"
            />
            <input
              type="text"
              value={experienceData.endDate || ""}
              onChange={(e) => onUpdateExperience("endDate", e.target.value)}
              placeholder={
                experienceData.current ? "Present" : "End Date (MM/YYYY)"
              }
              className="input-field"
              autoComplete="off"
              disabled={experienceData.current}
              pattern="(0[1-9]|1[0-2])\/[0-9]{4}"
              title="Format: MM/YYYY (e.g., 12/2023)"
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
            value={techInputValue}
            onChange={(e) => setTechInputValue(e.target.value)}
            onBlur={(e) => {
              const techArray = e.target.value
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
      <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100">
        <div className="bg-gray-50 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-700 p-1.5 flex gap-1.5">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-xs font-semibold ${
              editor?.isActive("bold")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-xs font-semibold ${
              editor?.isActive("italic")
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
          >
            <em>I</em>
          </button>
          {sectionType !== "summary" && (
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                editor?.isActive("bulletList")
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                  : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
              }`}
            >
              • List
            </button>
          )}
        </div>
        <EditorContent
          editor={editor}
          className="max-w-none text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-900"
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1.5">
        <Lightbulb className="w-3.5 h-3.5" />
        Tip: Click "Enhance" to optimize this content with AI for better ATS
        compatibility
      </p>
    </div>
  );
};

export default EditableSection;
