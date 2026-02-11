/**
 * Section Components for Editor
 * Separated components for each editable section
 */

import {useState, useEffect} from "react";
import {useToggle} from "@/hooks";
import EditableSection from "./EditableSection";
import {ScoreCard} from "@/components/common/cards";
import {RecommendationsPanel} from "@/components/editor/panels";
import {resumeAPI} from "@/api/api";
import {LimitedTextarea} from "@/components/common/LimitedInputs";
import toast from "react-hot-toast";

export const PersonalInfoSection = ({
  resumeData,
  updateField,
  updateContact,
}) => (
  <div className="space-y-3">
    <input
      type="text"
      value={resumeData.name || ""}
      onChange={(e) => updateField("name", e.target.value)}
      placeholder="Full Name"
      className="input-field font-semibold text-lg"
      autoComplete="name"
    />
    <div className="grid grid-cols-2 gap-3">
      <input
        type="email"
        value={resumeData.contact?.email || ""}
        onChange={(e) => updateContact("email", e.target.value)}
        placeholder="Email"
        className="input-field"
        autoComplete="email"
      />
      <input
        type="tel"
        value={resumeData.contact?.phone || ""}
        onChange={(e) => {
          const value = e.target.value;
          // Only allow numbers, spaces, hyphens, parentheses, and plus sign
          if (/^[0-9\s\-()+ ]*$/.test(value)) {
            updateContact("phone", value);
          }
        }}
        placeholder="Phone (e.g., +1 234-567-8900)"
        className="input-field"
        autoComplete="tel"
        maxLength="20"
      />
    </div>
    <input
      type="text"
      value={resumeData.contact?.location || ""}
      onChange={(e) => updateContact("location", e.target.value)}
      placeholder="Location"
      className="input-field"
      autoComplete="off"
    />
    <div className="grid grid-cols-2 gap-3">
      <input
        type="url"
        value={resumeData.contact?.linkedin || ""}
        onChange={(e) => updateContact("linkedin", e.target.value)}
        placeholder="LinkedIn URL"
        className="input-field"
        autoComplete="url"
      />
      <input
        type="url"
        value={resumeData.contact?.github || ""}
        onChange={(e) => updateContact("github", e.target.value)}
        placeholder="GitHub URL"
        className="input-field"
        autoComplete="url"
      />
    </div>
  </div>
);

export const SkillsSection = ({resumeData, updateField, user}) => {
  const [skillsInput, setSkillsInput] = useState("");
  const [isLoading, toggleLoading, setIsLoadingTrue, setIsLoadingFalse] =
    useToggle(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Initialize skills input from existing data when skills are loaded
  useEffect(() => {
    if (resumeData.skills && resumeData.skills.length > 0 && !initialized) {
      // Clean up any corrupted skills data (where items might be a string instead of array)
      const cleanedSkills = resumeData.skills.map((skillGroup) => ({
        ...skillGroup,
        items: Array.isArray(skillGroup.items)
          ? skillGroup.items
          : typeof skillGroup.items === "string"
            ? skillGroup.items
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
      }));

      // If skills were corrupted, update them
      const hasCorruptedData = resumeData.skills.some(
        (sg) => !Array.isArray(sg.items)
      );
      if (hasCorruptedData) {
        updateField("skills", cleanedSkills);
      }

      const allSkills = cleanedSkills
        .flatMap((group) => group.items || [])
        .join(", ");
      setSkillsInput(allSkills);
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData.skills, initialized]);

  // Handle textarea input with no restrictions
  const handleSkillsInputChange = (e) => {
    const value = e.target.value;
    // Allow all characters including commas, periods, etc.
    setSkillsInput(value);
    // Clear any error
    if (error) setError("");
  };

  // Handle AI categorization
  const handleCategorize = async () => {
    if (!skillsInput.trim()) {
      setError("Please enter some skills first");
      return;
    }

    // Check if user is logged in
    if (!user) {
      setError("Please log in to use AI features.");
      return;
    }

    setIsLoadingTrue();
    setError("");

    try {
      console.log("🚀 Starting categorization with input:", skillsInput);
      console.log("📝 Resume ID:", resumeData._id);
      console.log("👤 User authenticated:", !!user);
      
      // ResumeId is optional - works for both new and existing resumes
      const response = await resumeAPI.categorizeSkills(
        skillsInput,
        resumeData._id // Pass if available, undefined if new resume
      );

      console.log("✅ Categorization response:", response);
      console.log("📊 Response data:", response.data);

      // Check if server returned an error
      if (response.data && response.data.error) {
        console.error("❌ Server returned error:", response.data.error);
        setError(response.data.error);
        return;
      }

      // Try to extract skills from different possible response structures
      let categorizedSkills = null;
      
      if (response.data) {
        if (response.data.skills) {
          categorizedSkills = response.data.skills;
        } else if (Array.isArray(response.data)) {
          // Sometimes the API might return the array directly
          categorizedSkills = response.data;
        } else if (response.data.data) {
          // Sometimes it might be nested under 'data'
          categorizedSkills = response.data.data;
        }
      }
      
      console.log("🔍 Extracted categorizedSkills:", categorizedSkills);
      console.log("🔍 Type of categorizedSkills:", typeof categorizedSkills);
      console.log("🔍 Is array?", Array.isArray(categorizedSkills));
      
      if (categorizedSkills && Array.isArray(categorizedSkills)) {
        console.log("🔍 Raw categorizedSkills:", categorizedSkills);
        
        // Ensure all skills have the correct array structure
        const validatedSkills = categorizedSkills
          .map((skillGroup) => ({
            category: skillGroup.category || "Uncategorized",
            items: Array.isArray(skillGroup.items) 
              ? skillGroup.items.filter(item => item && item.trim())
              : [],
          }))
          .filter(group => group.items.length > 0); // Remove empty categories

        console.log("✨ Validated skills:", validatedSkills);

        if (validatedSkills.length === 0) {
          setError("No valid skills could be categorized. Please check your input.");
          return;
        }

        console.log("About to update resumeData.skills with:", validatedSkills);
        
        // Update the skills in resumeData
        updateField("skills", validatedSkills);
        setError("");
        
        // Reset initialized flag to allow re-syncing
        setInitialized(false);
        
        // Show success message
        toast.success(
          `Successfully categorized ${validatedSkills.length} skill categories!`,
          {
            icon: "✨",
            duration: 3000,
          }
        );
      } else {
        console.error("❌ No valid skills array found in response");
        console.error("❌ Full response:", response);
        setError("Invalid response format from server. Skills data not found or in wrong format.");
      }
    } catch (err) {
      console.error("❌ Categorization error:", err);
      console.error("📋 Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
      });
      
      // Handle different error types
      let errorMessage = "Failed to categorize skills. Please try again.";
      
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 401) {
          errorMessage = "Authentication failed. Please refresh the page and log in again.";
        } else if (status === 403) {
          errorMessage = data.error || data.message || "AI usage limit reached. Please upgrade your plan or try again tomorrow.";
        } else if (status === 429) {
          errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
        } else if (status === 400) {
          errorMessage = data.error || "Invalid input. Please check your skills text and try again.";
        } else if (status === 500) {
          errorMessage = "Server error. Our AI service might be temporarily unavailable. Please try again in a few minutes.";
        } else {
          errorMessage = data.error || data.message || `Server returned error ${status}. Please try again.`;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = "Cannot connect to server. Please check your internet connection and try again.";
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoadingFalse();
    }
  };

  // Handle manual edit of categorized skills
  const updateSkillCategory = (index, field, value) => {
    const updatedSkills = [...(resumeData.skills || [])];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
    };
    updateField("skills", updatedSkills);
  };

  const removeSkillCategory = (index) => {
    const updatedSkills = (resumeData.skills || []).filter(
      (_, i) => i !== index
    );
    updateField("skills", updatedSkills);
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="section-title mb-0">Skills</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ✨ AI-Powered Categorization
          </div>
        </div>

        <div className="space-y-3">
          {/* Single input box for all skills */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Enter all your skills (comma-separated or line-separated)
            </label>
            <textarea
              value={skillsInput}
              onChange={handleSkillsInputChange}
              placeholder="e.g., JavaScript, React, Node.js, Python, Docker, AWS, MongoDB, Git, Problem Solving, Team Leadership"
              className="input-field min-h-[120px] resize-y"
              rows={5}
              autoComplete="off"
              spellCheck="false"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 Tip: Just list all your skills and AI will automatically
              organize them into categories
            </p>
            {skillsInput && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {skillsInput.length} characters |{" "}
                {skillsInput.split(/[,\n]/).filter((s) => s.trim()).length}{" "}
                skills detected
              </p>
            )}
          </div>

          {/* Categorize button */}
          <button
            onClick={handleCategorize}
            disabled={isLoading || !skillsInput.trim() || !user}
            className={`py-2 px-6 rounded-lg text-sm font-medium transition-all ${
              isLoading || !skillsInput.trim() || !user
                ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {!user ? (
              "🔒 Login Required for AI Features"
            ) : isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Categorizing with AI...
              </span>
            ) : (
              "🤖 Categorize Skills with AI"
            )}
          </button>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Display categorized skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>📊 Categorized Skills</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({resumeData.skills.length} categories)
                </span>
              </div>

              {resumeData.skills.map((skillGroup, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black"
                >
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillGroup.category || ""}
                      onChange={(e) =>
                        updateSkillCategory(index, "category", e.target.value)
                      }
                      placeholder="Category Name"
                      className="input-field flex-1 font-semibold"
                      autoComplete="off"
                    />
                    <button
                      onClick={() => removeSkillCategory(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      title="Remove category"
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    value={
                      Array.isArray(skillGroup.items)
                        ? skillGroup.items.join(", ")
                        : typeof skillGroup.items === "string"
                          ? skillGroup.items
                          : ""
                    }
                    onChange={(e) => {
                      // Always store as array to prevent data corruption during autosave
                      const value = e.target.value;
                      const itemsArray = value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      updateSkillCategory(index, "items", itemsArray);
                    }}
                    placeholder="Skills (comma-separated)"
                    className="input-field min-h-[60px] resize-y"
                    rows={2}
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Debug Panel - Remove after testing */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-xs font-mono">
                <div className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                  🔍 Debug: Skills in resumeData ({resumeData.skills.length}{" "}
                  categories)
                </div>
                <pre className="text-blue-800 dark:text-blue-400 overflow-auto max-h-40">
                  {JSON.stringify(resumeData.skills, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const ExperienceSection = ({
  resumeData,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  moveItem,
  updateField,
}) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="section-title mb-0">Experience</h2>
      <button
        onClick={() =>
          addArrayItem("experience", {
            company: "",
            title: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            bullets: [""],
          })
        }
        className="text-primary-600 hover:text-primary-700 font-medium"
      >
        + Add Experience
      </button>
    </div>
    {resumeData.experience?.map((exp, index) => (
      <EditableSection
        key={index}
        title={`${exp.title || "Position"} at ${exp.company || "Company"}`}
        content={exp}
        onUpdate={(value) =>
          updateArrayItem("experience", index, "bullets", value)
        }
        onRemove={() => removeArrayItem("experience", index)}
        onMoveUp={
          index > 0 ? () => moveItem("experience", index, index - 1) : null
        }
        onMoveDown={
          index < resumeData.experience.length - 1
            ? () => moveItem("experience", index, index + 1)
            : null
        }
        sectionType="experience"
        resumeData={resumeData}
        experienceData={exp}
        onUpdateExperience={(field, value) =>
          updateArrayItem("experience", index, field, value)
        }
      />
    ))}
  </>
);

export const EducationSection = ({
  resumeData,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  moveItem,
}) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="section-title mb-0">Education</h2>
      <button
        onClick={() =>
          addArrayItem("education", {
            institution: "",
            degree: "",
            field: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
            bullets: [],
          })
        }
        className="text-primary-600 hover:text-primary-700 font-medium"
      >
        + Add Education
      </button>
    </div>
    {resumeData.education?.map((edu, index) => (
      <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
        <div className="flex justify-between mb-3">
          <div className="flex gap-2">
            {index > 0 && (
              <button
                onClick={() => moveItem("education", index, index - 1)}
                className="text-gray-400 hover:text-gray-600"
              >
                ↑
              </button>
            )}
            {index < resumeData.education.length - 1 && (
              <button
                onClick={() => moveItem("education", index, index + 1)}
                className="text-gray-400 hover:text-gray-600"
              >
                ↓
              </button>
            )}
          </div>
          <button
            onClick={() => removeArrayItem("education", index)}
            className="text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={edu.institution}
            onChange={(e) =>
              updateArrayItem("education", index, "institution", e.target.value)
            }
            placeholder="Institution"
            className="input-field"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={edu.degree}
              onChange={(e) =>
                updateArrayItem("education", index, "degree", e.target.value)
              }
              placeholder="Degree"
              className="input-field"
            />
            <input
              type="text"
              value={edu.field}
              onChange={(e) =>
                updateArrayItem("education", index, "field", e.target.value)
              }
              placeholder="Field of Study"
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={edu.startDate}
              onChange={(e) =>
                updateArrayItem("education", index, "startDate", e.target.value)
              }
              placeholder="Start (MM/YYYY)"
              className="input-field"
              pattern="(0[1-9]|1[0-2])\/[0-9]{4}"
              title="Format: MM/YYYY (e.g., 08/2018)"
            />
            <input
              type="text"
              value={edu.endDate}
              onChange={(e) =>
                updateArrayItem("education", index, "endDate", e.target.value)
              }
              placeholder="End (MM/YYYY)"
              className="input-field"
              pattern="(0[1-9]|1[0-2])\/[0-9]{4}"
              title="Format: MM/YYYY (e.g., 05/2022)"
            />
            <input
              type="text"
              value={edu.gpa || ""}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and decimal point, max one decimal point
                if (/^\d*\.?\d*$/.test(value) && value.length <= 4) {
                  updateArrayItem("education", index, "gpa", value);
                }
              }}
              placeholder="GPA (e.g., 3.8)"
              className="input-field"
              maxLength="4"
              title="Enter GPA (e.g., 3.8 or 3.85)"
            />
          </div>
        </div>
      </div>
    ))}
  </>
);

export const ProjectsSection = ({
  resumeData,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
  moveItem,
}) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="section-title mb-0">Projects</h2>
      <button
        onClick={() =>
          addArrayItem("projects", {
            name: "",
            description: "",
            technologies: [],
            link: "",
            bullets: [""],
          })
        }
        className="text-primary-600 hover:text-primary-700 font-medium"
      >
        + Add Project
      </button>
    </div>
    {resumeData.projects?.map((project, index) => (
      <EditableSection
        key={index}
        title={project.name || `Project ${index + 1}`}
        content={project}
        onUpdate={(value) =>
          updateArrayItem("projects", index, "bullets", value)
        }
        onRemove={() => removeArrayItem("projects", index)}
        onMoveUp={
          index > 0 ? () => moveItem("projects", index, index - 1) : null
        }
        onMoveDown={
          index < resumeData.projects.length - 1
            ? () => moveItem("projects", index, index + 1)
            : null
        }
        sectionType="projects"
        resumeData={resumeData}
        projectData={project}
        onUpdateProject={(field, value) =>
          updateArrayItem("projects", index, field, value)
        }
      />
    ))}
  </>
);

export const CertificationsSection = ({
  resumeData,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
}) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="section-title mb-0">Certifications</h2>
      <button
        onClick={() =>
          addArrayItem("certifications", {
            name: "",
            issuer: "",
            date: "",
            credentialId: "",
            link: "",
          })
        }
        className="text-primary-600 hover:text-primary-700 font-medium"
      >
        + Add Certification
      </button>
    </div>
    {resumeData.certifications?.map((cert, index) => (
      <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => removeArrayItem("certifications", index)}
            className="text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={cert.name || ""}
            onChange={(e) =>
              updateArrayItem("certifications", index, "name", e.target.value)
            }
            placeholder="Certification Name"
            className="input-field"
            autoComplete="off"
          />
          <input
            type="text"
            value={cert.issuer || ""}
            onChange={(e) =>
              updateArrayItem("certifications", index, "issuer", e.target.value)
            }
            placeholder="Issuing Organization"
            className="input-field"
            autoComplete="off"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={cert.date || ""}
              onChange={(e) =>
                updateArrayItem("certifications", index, "date", e.target.value)
              }
              placeholder="Date"
              className="input-field"
              autoComplete="off"
            />
            <input
              type="text"
              value={cert.credentialId || ""}
              onChange={(e) =>
                updateArrayItem(
                  "certifications",
                  index,
                  "credentialId",
                  e.target.value
                )
              }
              placeholder="Credential ID"
              className="input-field"
              autoComplete="off"
            />
          </div>
          <input
            type="url"
            value={cert.link || ""}
            onChange={(e) =>
              updateArrayItem("certifications", index, "link", e.target.value)
            }
            placeholder="Credential URL"
            className="input-field"
            autoComplete="off"
          />
        </div>
      </div>
    ))}
  </>
);

export const AchievementsSection = ({resumeData, updateField}) => {
  const achievements = resumeData.achievements || [];
  const [achievementsInput, setAchievementsInput] = useState("");
  const [isLoading, toggleLoading, setIsLoadingTrue, setIsLoadingFalse] =
    useToggle(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Initialize input from existing data when achievements are loaded
  useEffect(() => {
    if (achievements && achievements.length > 0 && !initialized) {
      setAchievementsInput(achievements.join("\n"));
      setInitialized(true);
    }
  }, [achievements, initialized]);

  // Handle AI segregation
  const handleSegregate = async () => {
    if (!achievementsInput.trim()) {
      setError("Please enter some achievements first");
      return;
    }

    setIsLoadingTrue();
    setError("");

    try {
      const response = await resumeAPI.segregateAchievements(
        achievementsInput,
        resumeData._id
      );

      if (response.data && response.data.achievements) {
        updateField("achievements", response.data.achievements);
        setAchievementsInput("");
        setError("");
      } else {
        setError("Failed to segregate achievements");
      }
    } catch (err) {
      console.error("Segregation error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to segregate achievements. Please try again."
      );
    } finally {
      setIsLoadingFalse();
    }
  };

  const updateAchievement = (index, value) => {
    const updated = [...achievements];
    updated[index] = value;
    updateField("achievements", updated);
  };

  const removeAchievement = (index) => {
    const updated = achievements.filter((_, i) => i !== index);
    updateField("achievements", updated);
  };

  const addAchievement = () => {
    updateField("achievements", [...achievements, ""]);
  };

  // Manual save - split by newlines and add to achievements
  const handleManualSave = () => {
    if (!achievementsInput.trim()) {
      setError("Please enter some achievements first");
      return;
    }

    // Split by newlines and filter out empty lines
    const newAchievements = achievementsInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (newAchievements.length > 0) {
      updateField("achievements", [...achievements, ...newAchievements]);
      setAchievementsInput("");
      setError("");
    }
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="section-title mb-0">Achievements</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            ✨ AI-Powered Formatting
          </div>
        </div>

        <div className="space-y-3">
          {/* Input textarea for bulk achievements */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Enter your achievements (paragraph or mixed format)
            </label>
            <textarea
              value={achievementsInput}
              onChange={(e) => setAchievementsInput(e.target.value)}
              placeholder="e.g., Won first place in national coding competition with 500+ participants. Led a team of 10 developers to successfully complete a major project 2 weeks ahead of schedule. Published 3 research papers in top-tier AI conferences."
              className="input-field min-h-[120px] resize-y"
              rows={5}
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 Tip: Write naturally and AI will format them into professional
              bullet points
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {/* Manual Save button */}
            <button
              onClick={handleManualSave}
              disabled={!achievementsInput.trim()}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                !achievementsInput.trim()
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              ➕ Add to List
            </button>

            {/* AI Segregate button */}
            <button
              onClick={handleSegregate}
              disabled={isLoading || !achievementsInput.trim()}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                isLoading || !achievementsInput.trim()
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Formatting with AI...
                </span>
              ) : (
                "🤖 Format with AI"
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Display formatted achievements */}
          {achievements && achievements.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span>🏆 Formatted Achievements</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({achievements.length} items)
                  </span>
                </div>
                <button
                  onClick={addAchievement}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  + Add More
                </button>
              </div>

              {achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={achievement || ""}
                    onChange={(e) => updateAchievement(index, e.target.value)}
                    placeholder="Enter achievement"
                    className="input-field flex-1"
                    autoComplete="off"
                  />
                  <button
                    onClick={() => removeAchievement(index)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Remove achievement"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const CustomSectionsManager = ({resumeData, updateField}) => {
  const customSections = resumeData.customSections || [];

  const addCustomSection = () => {
    updateField("customSections", [
      ...customSections,
      {
        id: Date.now().toString(),
        title: "",
        items: [],
      },
    ]);
  };

  const updateCustomSection = (index, field, value) => {
    const updated = [...customSections];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    updateField("customSections", updated);
  };

  const removeCustomSection = (index) => {
    const updated = customSections.filter((_, i) => i !== index);
    updateField("customSections", updated);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title mb-0">Custom Sections</h2>
        <button
          onClick={addCustomSection}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          + Add Custom Section
        </button>
      </div>

      {customSections.length === 0 ? (
        <div className="text-center py-8 px-4 bg-gray-50 dark:bg-black rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-800">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No custom sections yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Add custom sections like Publications, Volunteer Work, Languages,
            etc.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {customSections.map((section, index) => (
            <CustomSectionItem
              key={section.id || `section-${index}`}
              section={section}
              index={index}
              onUpdate={updateCustomSection}
              onRemove={removeCustomSection}
            />
          ))}
        </div>
      )}
    </>
  );
};

const CustomSectionItem = ({section, index, onUpdate, onRemove}) => {
  const [contentInput, setContentInput] = useState("");
  const [isLoading, toggleLoading, setIsLoadingTrue, setIsLoadingFalse] =
    useToggle(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  // Initialize input from existing data
  const initializeInput = () => {
    if (section.items && section.items.length > 0) {
      return section.items.join("\n");
    }
    return "";
  };

  // Handle AI processing
  const handleProcess = async () => {
    if (!contentInput.trim()) {
      setError("Please enter some content first");
      return;
    }

    if (!section.title.trim()) {
      setError("Please enter a section title first");
      return;
    }

    setIsLoadingTrue();
    setError("");

    try {
      const response = await resumeAPI.processCustomSection(
        contentInput,
        section.title,
        resumeData._id
      );

      if (response.data && response.data.content) {
        onUpdate(index, "items", response.data.content);
        setContentInput("");
        setError("");
      } else {
        setError("Failed to process content");
      }
    } catch (err) {
      console.error("Processing error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to process content. Please try again."
      );
    } finally {
      setIsLoadingFalse();
    }
  };

  const updateItem = (itemIndex, value) => {
    const updated = [...section.items];
    updated[itemIndex] = value;
    onUpdate(index, "items", updated);
  };

  const removeItem = (itemIndex) => {
    const updated = section.items.filter((_, i) => i !== itemIndex);
    onUpdate(index, "items", updated);
  };

  const addItem = () => {
    onUpdate(index, "items", [...section.items, ""]);
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <input
          type="text"
          value={section.title}
          onChange={(e) => onUpdate(index, "title", e.target.value)}
          placeholder="Section Title (e.g., Publications, Languages, Volunteer Work)"
          className="input-field flex-1 font-semibold"
        />
        <button
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          title="Remove section"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="space-y-3 ml-7">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>✨ AI-Powered Formatting</span>
          </div>

          {/* Input textarea */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Enter content (paragraph or mixed format)
            </label>
            <textarea
              value={contentInput || initializeInput()}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="e.g., Fluent in English and Spanish. Conversational in French. Published 5 papers in top AI journals. Active volunteer at local food bank for 3 years."
              className="input-field min-h-[100px] resize-y"
              rows={4}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💡 Tip: Write naturally and AI will format into professional
              bullet points
            </p>
          </div>

          {/* Process button */}
          <button
            onClick={handleProcess}
            disabled={
              isLoading || !contentInput.trim() || !section.title.trim()
            }
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-sm ${
              isLoading || !contentInput.trim() || !section.title.trim()
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Formatting...
              </span>
            ) : (
              "🤖 Format with AI"
            )}
          </button>

          {/* Error message */}
          {error && (
            <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Display formatted items */}
          {section.items && section.items.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  📝 Formatted Items ({section.items.length})
                </div>
                <button
                  onClick={addItem}
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  + Add Item
                </button>
              </div>

              {section.items.map((item, itemIndex) => (
                <div
                  key={`${section.id}-item-${itemIndex}`}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(itemIndex, e.target.value)}
                    placeholder="Enter item"
                    className="input-field flex-1 text-sm"
                  />
                  <button
                    onClick={() => removeItem(itemIndex)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 px-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
