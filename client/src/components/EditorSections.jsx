/**
 * Section Components for Editor
 * Separated components for each editable section
 */

import EditableSection from "../components/EditableSection";
import ScoreCard from "../components/ScoreCard";
import RecommendationsPanel from "../components/RecommendationsPanel";

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
    />
    <div className="grid grid-cols-2 gap-3">
      <input
        type="email"
        value={resumeData.contact?.email || ""}
        onChange={(e) => updateContact("email", e.target.value)}
        placeholder="Email"
        className="input-field"
      />
      <input
        type="tel"
        value={resumeData.contact?.phone || ""}
        onChange={(e) => updateContact("phone", e.target.value)}
        placeholder="Phone"
        className="input-field"
      />
    </div>
    <input
      type="text"
      value={resumeData.contact?.location || ""}
      onChange={(e) => updateContact("location", e.target.value)}
      placeholder="Location"
      className="input-field"
    />
    <div className="grid grid-cols-2 gap-3">
      <input
        type="url"
        value={resumeData.contact?.linkedin || ""}
        onChange={(e) => updateContact("linkedin", e.target.value)}
        placeholder="LinkedIn URL"
        className="input-field"
      />
      <input
        type="url"
        value={resumeData.contact?.github || ""}
        onChange={(e) => updateContact("github", e.target.value)}
        placeholder="GitHub URL"
        className="input-field"
      />
    </div>
  </div>
);

export const SkillsSection = ({
  resumeData,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
}) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="section-title mb-0">Skills</h2>
      <button
        onClick={() =>
          addArrayItem("skills", {
            category: "Technical Skills",
            items: [],
          })
        }
        className="text-primary-600 hover:text-primary-700 font-medium"
      >
        + Add Category
      </button>
    </div>
    {resumeData.skills?.map((skillGroup, index) => (
      <div key={index} className="mb-4 p-3 border border-gray-200 rounded">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skillGroup.category}
            onChange={(e) =>
              updateArrayItem("skills", index, "category", e.target.value)
            }
            placeholder="Category"
            className="input-field flex-1"
          />
          <button
            onClick={() => removeArrayItem("skills", index)}
            className="text-red-600 hover:text-red-700 px-2"
          >
            ✕
          </button>
        </div>
        <input
          type="text"
          value={skillGroup.items?.join(", ") || ""}
          onChange={(e) =>
            updateArrayItem(
              "skills",
              index,
              "items",
              e.target.value.split(",").map((s) => s.trim())
            )
          }
          placeholder="Skills (comma-separated)"
          className="input-field"
        />
      </div>
    ))}
  </>
);

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
            value={cert.name}
            onChange={(e) =>
              updateArrayItem("certifications", index, "name", e.target.value)
            }
            placeholder="Certification Name"
            className="input-field"
          />
          <input
            type="text"
            value={cert.issuer}
            onChange={(e) =>
              updateArrayItem("certifications", index, "issuer", e.target.value)
            }
            placeholder="Issuing Organization"
            className="input-field"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={cert.date}
              onChange={(e) =>
                updateArrayItem("certifications", index, "date", e.target.value)
              }
              placeholder="Date"
              className="input-field"
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
          />
        </div>
      </div>
    ))}
  </>
);
