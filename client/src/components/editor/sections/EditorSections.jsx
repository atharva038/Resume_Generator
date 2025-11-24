/**
 * Section Components for Editor
 * Separated components for each editable section
 */

import {useState, useEffect} from "react";
import EditableSection from "./EditableSection";
import {ScoreCard} from "../../common/cards";
import {RecommendationsPanel} from "../panels";
import {resumeAPI} from "../../../services/api";
import {LimitedTextarea} from "../../common/LimitedInputs";

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
        onChange={(e) => updateContact("phone", e.target.value)}
        placeholder="Phone"
        className="input-field"
        autoComplete="tel"
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

export const SkillsSection = ({resumeData, updateField}) => {
  const [skillsInput, setSkillsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Initialize skills input from existing data when skills are loaded
  useEffect(() => {
    if (resumeData.skills && resumeData.skills.length > 0 && !initialized) {
      const allSkills = resumeData.skills
        .flatMap((group) => group.items || [])
        .join(", ");
      setSkillsInput(allSkills);
      setInitialized(true);
    }
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

    setIsLoading(true);
    setError("");

    try {
      const response = await resumeAPI.categorizeSkills(skillsInput);

      if (response.data && response.data.skills) {
        // Update the skills in resumeData
        updateField("skills", response.data.skills);
        setError("");
      } else {
        setError("Failed to categorize skills");
      }
    } catch (err) {
      console.error("Categorization error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to categorize skills. Please try again."
      );
    } finally {
      setIsLoading(false);
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
            disabled={isLoading || !skillsInput.trim()}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isLoading || !skillsInput.trim()
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
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
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
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
                      // Allow free-form editing, store as string temporarily
                      const value = e.target.value;
                      updateSkillCategory(index, "items", value);
                    }}
                    onBlur={(e) => {
                      // Convert to array when user finishes editing
                      const value = e.target.value;
                      if (typeof value === "string") {
                        const itemsArray = value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        updateSkillCategory(index, "items", itemsArray);
                      }
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
              placeholder="Start Date"
              className="input-field"
            />
            <input
              type="text"
              value={edu.endDate}
              onChange={(e) =>
                updateArrayItem("education", index, "endDate", e.target.value)
              }
              placeholder="End Date"
              className="input-field"
            />
            <input
              type="text"
              value={edu.gpa || ""}
              onChange={(e) =>
                updateArrayItem("education", index, "gpa", e.target.value)
              }
              placeholder="GPA"
              className="input-field"
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
        sectionType="project"
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
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    setError("");

    try {
      const response = await resumeAPI.segregateAchievements(achievementsInput);

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
      setIsLoading(false);
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
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          + Add Custom Section
        </button>
      </div>

      {customSections.length === 0 ? (
        <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
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
              key={section.id}
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
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    setError("");

    try {
      const response = await resumeAPI.processCustomSection(
        contentInput,
        section.title
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
      setIsLoading(false);
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
    <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
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
                <div key={itemIndex} className="flex gap-2">
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
