import {forwardRef} from "react";

const ProfessionalTemplate = forwardRef(({resumeData}, ref) => {
  // Color Themes - Multiple professional palettes
  const colorThemes = {
    navy: {
      primary: "#1e3a8a",
      secondary: "#1e40af",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#e5e7eb",
    },
    burgundy: {
      primary: "#881337",
      secondary: "#9f1239",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#e5e7eb",
    },
    forest: {
      primary: "#065f46",
      secondary: "#047857",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#e5e7eb",
    },
    gray: {
      primary: "#374151",
      secondary: "#4b5563",
      text: "#1f2937",
      textLight: "#6b7280",
      textMuted: "#9ca3af",
      border: "#e5e7eb",
    },
  };

  // Select theme based on resumeData or default to navy
  const selectedTheme = colorThemes[resumeData?.colorTheme] || colorThemes.navy;

  // Helper function to safely format skills (handles both array and string)
  const formatSkills = (items) => {
    if (Array.isArray(items)) {
      return items.join(" • ");
    }
    if (typeof items === "string") {
      return items;
    }
    return "";
  };

  // Default section order if not specified
  const DEFAULT_SECTION_ORDER = [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "customSections",
  ];

  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder.filter(
          (id) => !["score", "personal", "recommendations"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Get custom section titles or use defaults
  const getSectionTitle = (sectionId) => {
    const customTitles = resumeData.sectionTitles || {};
    const defaultTitles = {
      summary: "Executive Summary",
      skills: "Core Competencies",
      experience: "Professional Experience",
      projects: "Key Projects",
      education: "Education",
      certifications: "Certifications",
      achievements: "Achievements",
    };
    return (
      customTitles[sectionId] ||
      defaultTitles[sectionId] ||
      sectionId
    ).toUpperCase();
  };

  // Render section helper function
  const renderSection = (sectionId) => {
    const sections = {
      summary: resumeData.summary && (
        <section key="summary" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: selectedTheme.primary,
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: `2px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("summary")}
          </h2>
          <p
            style={{fontSize: "10pt", textAlign: "justify", lineHeight: "1.5"}}
          >
            {resumeData.summary}
          </p>
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: selectedTheme.primary,
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: `2px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("skills")}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
            }}
          >
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} style={{fontSize: "10pt"}}>
                <div
                  className="font-semibold"
                  style={{color: selectedTheme.primary, marginBottom: "2px"}}
                >
                  {skillGroup.category}
                </div>
                <div style={{color: selectedTheme.textLight}}>
                  {formatSkills(skillGroup.items)}
                </div>
              </div>
            ))}
          </div>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: selectedTheme.primary,
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: `2px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("experience")}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "12px"}}>
              <div
                className="flex justify-between items-start"
                style={{marginBottom: "3px"}}
              >
                <div style={{flex: 1}}>
                  <div
                    className="font-bold"
                    style={{fontSize: "11pt", color: selectedTheme.primary}}
                  >
                    {exp.title || "Position"}
                  </div>
                  <div style={{fontSize: "10pt", fontWeight: 600}}>
                    {exp.company}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "9pt",
                    color: selectedTheme.textMuted,
                    textAlign: "right",
                  }}
                >
                  <div>{exp.location}</div>
                  <div>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-5"
                  style={{marginTop: "4px"}}
                >
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "10pt", marginBottom: "2px"}}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: selectedTheme.primary,
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: `2px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("projects")}
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="font-bold"
                  style={{fontSize: "11pt", color: selectedTheme.primary}}
                >
                  {project.name}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "9pt",
                      color: selectedTheme.primary,
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🔗 View Project
                  </a>
                )}
              </div>
              {project.technologies && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: selectedTheme.textMuted,
                    marginBottom: "3px",
                    fontStyle: "italic",
                  }}
                >
                  Technologies:{" "}
                  {Array.isArray(project.technologies)
                    ? project.technologies.join(" | ")
                    : project.technologies}
                </div>
              )}
              {project.bullets && project.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-5"
                  style={{marginTop: "3px"}}
                >
                  {project.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "10pt", marginBottom: "2px"}}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section key="education" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: selectedTheme.primary,
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: `2px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("education")}
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "8px"}}>
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="font-bold" style={{fontSize: "10pt"}}>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </div>
                  <div
                    style={{fontSize: "10pt", color: selectedTheme.textLight}}
                  >
                    {edu.institution}
                    {edu.location && <span> — {edu.location}</span>}
                  </div>
                </div>
                <div style={{fontSize: "9pt", color: selectedTheme.textMuted}}>
                  {edu.startDate && (
                    <div>
                      {edu.startDate} - {edu.endDate}
                    </div>
                  )}
                  {edu.gpa && <div>GPA: {edu.gpa}</div>}
                </div>
              </div>
            </div>
          ))}
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "12px"}}>
            <h2
              className="font-bold uppercase"
              style={{
                fontSize: "11pt",
                color: selectedTheme.primary,
                marginBottom: "6px",
                paddingBottom: "3px",
                borderBottom: `2px solid ${selectedTheme.border}`,
              }}
            >
              {getSectionTitle("certifications")}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              {resumeData.certifications.map((cert, index) => (
                <div key={index} style={{fontSize: "10pt"}}>
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && (
                    <div
                      style={{fontSize: "9pt", color: selectedTheme.textMuted}}
                    >
                      {cert.issuer} {cert.date && `(${cert.date})`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "12px"}}>
            <h2
              className="font-bold uppercase"
              style={{
                fontSize: "11pt",
                color: selectedTheme.primary,
                marginBottom: "6px",
                paddingBottom: "3px",
                borderBottom: `2px solid ${selectedTheme.border}`,
              }}
            >
              {getSectionTitle("achievements")}
            </h2>
            <ul
              className="list-disc list-outside ml-5"
              style={{marginTop: "4px"}}
            >
              {resumeData.achievements.map((achievement, index) => (
                <li key={index} style={{fontSize: "10pt", marginBottom: "3px"}}>
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      customSections: resumeData.customSections &&
        resumeData.customSections.length > 0 && (
          <div key="customSections">
            {resumeData.customSections.map((section, sectionIndex) => {
              if (section.title && section.items && section.items.length > 0) {
                return (
                  <section key={sectionIndex} style={{marginBottom: "12px"}}>
                    <h2
                      className="font-bold uppercase"
                      style={{
                        fontSize: "11pt",
                        color: selectedTheme.primary,
                        marginBottom: "6px",
                        paddingBottom: "3px",
                        borderBottom: `2px solid ${selectedTheme.border}`,
                      }}
                    >
                      {section.title}
                    </h2>
                    <ul
                      className="list-disc list-outside ml-5"
                      style={{marginTop: "4px"}}
                    >
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          style={{fontSize: "10pt", marginBottom: "3px"}}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              }
              return null;
            })}
          </div>
        ),
    };

    return sections[sectionId] || null;
  };

  return (
    <div
      ref={ref}
      className="resume-preview !bg-white !text-black shadow-lg border border-gray-300 font-resume"
      style={{
        minHeight: "11in",
        padding: "0.5in",
        fontSize: "10.5pt",
        lineHeight: "1.35",
        color: "#000000",
      }}
    >
      {/* Header - Professional Two-Column Layout */}
      <header
        style={{
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "3px solid #2563eb",
        }}
      >
        <h1
          className="font-bold"
          style={{
            fontSize: "24pt",
            marginBottom: "8px",
            color: selectedTheme.primary,
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>
        <div
          style={{
            fontSize: "10pt",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px",
            color: "#374151",
          }}
        >
          <div>
            {resumeData.contact?.email && (
              <div>✉ {resumeData.contact.email}</div>
            )}
            {resumeData.contact?.phone && (
              <div>📞 {resumeData.contact.phone}</div>
            )}
          </div>
          <div>
            {resumeData.contact?.linkedin && (
              <div>
                <a
                  href={resumeData.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: selectedTheme.primary,
                    textDecoration: "underline",
                  }}
                >
                  🔗 LinkedIn
                </a>
              </div>
            )}
            {resumeData.contact?.github && (
              <div>
                <a
                  href={resumeData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: selectedTheme.primary,
                    textDecoration: "underline",
                  }}
                >
                  💻 GitHub
                </a>
              </div>
            )}
          </div>
        </div>
        {resumeData.contact?.location && (
          <div
            style={{
              fontSize: "10pt",
              marginTop: "4px",
              color: selectedTheme.textMuted,
            }}
          >
            📍 {resumeData.contact.location}
          </div>
        )}
      </header>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

ProfessionalTemplate.displayName = "ProfessionalTemplate";

export default ProfessionalTemplate;
