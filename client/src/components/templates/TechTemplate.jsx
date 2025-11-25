import {forwardRef} from "react";

const TechTemplate = forwardRef(({resumeData}, ref) => {
  // Color themes for the template
  const colorThemes = {
    black: {
      primary: "#0f172a", // slate-900 - Deep tech black
      secondary: "#1e293b", // slate-800
      accent: "#334155", // slate-700
      text: "#1e293b", // slate-800
      textLight: "#475569", // slate-600
      border: "#0f172a",
      headerBg: "#0f172a", // Black header
      headerText: "#ffffff",
    },
    blue: {
      primary: "#1e40af", // blue-800 - Solid blue
      secondary: "#1e3a8a", // blue-900
      accent: "#3b82f6", // blue-500
      text: "#1e293b", // slate-800
      textLight: "#475569", // slate-600
      border: "#1e40af",
      headerBg: "#1e40af",
      headerText: "#ffffff",
    },
    purple: {
      primary: "#7e22ce", // purple-700 - Solid purple
      secondary: "#6b21a8", // purple-800
      accent: "#a855f7", // purple-500
      text: "#1e293b",
      textLight: "#475569",
      border: "#7e22ce",
      headerBg: "#7e22ce",
      headerText: "#ffffff",
    },
    teal: {
      primary: "#0f766e", // teal-700 - Solid teal
      secondary: "#115e59", // teal-800
      accent: "#14b8a6", // teal-500
      text: "#1e293b",
      textLight: "#475569",
      border: "#0f766e",
      headerBg: "#0f766e",
      headerText: "#ffffff",
    },
  };

  // Select the color theme (default to black if not specified)
  const selectedTheme =
    colorThemes[resumeData?.colorTheme] || colorThemes.black;

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

  // Default section order optimized for tech roles
  const DEFAULT_SECTION_ORDER = [
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
          (id) =>
            !["score", "personal", "recommendations", "summary"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Render section helper function
  const renderSection = (sectionId) => {
    const sections = {
      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              color: selectedTheme.primary,
              marginBottom: "10px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.border}`,
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {"<Technical Skills />"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              backgroundColor: `${selectedTheme.primary}10`,
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} style={{fontSize: "10pt"}}>
                <div
                  style={{
                    fontWeight: "bold",
                    color: selectedTheme.text,
                    marginBottom: "3px",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {skillGroup.category}
                </div>
                <div
                  style={{
                    color: selectedTheme.textLight,
                    fontSize: "9.5pt",
                    lineHeight: "1.4",
                  }}
                >
                  {formatSkills(skillGroup.items)}
                </div>
              </div>
            ))}
          </div>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              color: selectedTheme.primary,
              marginBottom: "10px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.border}`,
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {"<Work Experience />"}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div
              key={index}
              style={{
                marginBottom: "12px",
                borderLeft: `3px solid ${selectedTheme.border}`,
                paddingLeft: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "3px",
                }}
              >
                <h3
                  style={{
                    fontSize: "11pt",
                    fontWeight: "bold",
                    color: selectedTheme.text,
                  }}
                >
                  {exp.position}
                </h3>
                <span
                  style={{
                    fontSize: "9pt",
                    color: selectedTheme.textLight,
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {exp.startDate} → {exp.endDate || "Present"}
                </span>
              </div>
              <div
                style={{
                  fontSize: "10pt",
                  color: selectedTheme.textLight,
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                {exp.company} {exp.location && `| ${exp.location}`}
              </div>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    listStyleType: "none",
                  }}
                >
                  {exp.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: "9.5pt",
                        marginBottom: "4px",
                        lineHeight: "1.5",
                        color: selectedTheme.text,
                        position: "relative",
                        paddingLeft: "10px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "-10px",
                          color: selectedTheme.primary,
                          fontWeight: "bold",
                        }}
                      >
                        ▹
                      </span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              color: selectedTheme.primary,
              marginBottom: "10px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.border}`,
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {"<Projects />"}
          </h2>
          {resumeData.projects.map((project, index) => (
            <div
              key={index}
              style={{
                marginBottom: "12px",
                backgroundColor: `${selectedTheme.primary}10`,
                padding: "10px",
                borderRadius: "4px",
                borderLeft: `3px solid ${selectedTheme.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <h3
                  style={{
                    fontSize: "10.5pt",
                    fontWeight: "bold",
                    color: selectedTheme.text,
                  }}
                >
                  {project.name}
                </h3>
                {project.date && (
                  <span
                    style={{
                      fontSize: "9pt",
                      color: selectedTheme.textLight,
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {project.date}
                  </span>
                )}
              </div>
              {project.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    margin: "4px 0",
                    color: selectedTheme.textLight,
                    lineHeight: "1.5",
                  }}
                >
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: selectedTheme.textLight,
                    marginTop: "5px",
                    fontFamily: "'Courier New', monospace",
                    backgroundColor: `${selectedTheme.accent}30`,
                    padding: "4px 8px",
                    borderRadius: "3px",
                    display: "inline-block",
                  }}
                >
                  {project.technologies}
                </div>
              )}
              {project.link && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: selectedTheme.primary,
                    marginTop: "3px",
                  }}
                >
                  🔗 {project.link}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section key="education" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              color: selectedTheme.primary,
              marginBottom: "10px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.border}`,
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {"<Education />"}
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10.5pt",
                      fontWeight: "bold",
                      color: selectedTheme.text,
                    }}
                  >
                    {edu.degree} in {edu.field}
                  </div>
                  <div
                    style={{fontSize: "9.5pt", color: selectedTheme.textLight}}
                  >
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "9pt",
                    color: selectedTheme.textLight,
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {edu.graduationDate}
                </span>
              </div>
              {edu.gpa && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: selectedTheme.textLight,
                    marginTop: "2px",
                  }}
                >
                  GPA: {edu.gpa}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "16px"}}>
            <h2
              style={{
                fontSize: "13pt",
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: "10px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${selectedTheme.border}`,
                fontFamily: "'Courier New', monospace",
                letterSpacing: "1px",
              }}
            >
              {"<Certifications />"}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: "9.5pt",
                    color: selectedTheme.text,
                    backgroundColor: `${selectedTheme.primary}10`,
                    padding: "6px 10px",
                    borderRadius: "3px",
                  }}
                >
                  <span style={{fontWeight: "600"}}>{cert.name}</span>
                  {cert.issuer && (
                    <div
                      style={{
                        fontSize: "8.5pt",
                        color: selectedTheme.textLight,
                      }}
                    >
                      {cert.issuer}
                    </div>
                  )}
                  {cert.date && (
                    <div
                      style={{
                        fontSize: "8.5pt",
                        color: selectedTheme.textLight,
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {cert.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "16px"}}>
            <h2
              style={{
                fontSize: "13pt",
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: "10px",
                paddingBottom: "4px",
                borderBottom: `2px solid ${selectedTheme.border}`,
                fontFamily: "'Courier New', monospace",
                letterSpacing: "1px",
              }}
            >
              {"<Achievements />"}
            </h2>
            <ul style={{margin: 0, paddingLeft: "18px", listStyleType: "none"}}>
              {resumeData.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: "9.5pt",
                    marginBottom: "4px",
                    lineHeight: "1.5",
                    color: selectedTheme.text,
                    position: "relative",
                    paddingLeft: "10px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-10px",
                      color: selectedTheme.primary,
                      fontWeight: "bold",
                    }}
                  >
                    ▹
                  </span>
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      customSections: resumeData.customSections &&
        resumeData.customSections.length > 0 && (
          <>
            {resumeData.customSections.map((section, index) => (
              <section key={`custom-${index}`} style={{marginBottom: "16px"}}>
                <h2
                  style={{
                    fontSize: "13pt",
                    fontWeight: "bold",
                    color: selectedTheme.primary,
                    marginBottom: "10px",
                    paddingBottom: "4px",
                    borderBottom: `2px solid ${selectedTheme.border}`,
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "1px",
                  }}
                >
                  {"<" + section.title + " />"}
                </h2>
                <div
                  style={{
                    fontSize: "9.5pt",
                    lineHeight: "1.5",
                    color: selectedTheme.text,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {section.content}
                </div>
              </section>
            ))}
          </>
        ),
    };

    return sections[sectionId] || null;
  };

  return (
    <div
      ref={ref}
      className="resume-preview"
      style={{
        minHeight: "11in",
        backgroundColor: "white",
        padding: "0.5in",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        color: selectedTheme.text,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header Section - Tech Style */}
      <header
        style={{
          marginBottom: "18px",
          backgroundColor: selectedTheme.headerBg || selectedTheme.primary,
          color: selectedTheme.headerText || "white",
          padding: "20px",
          borderRadius: "6px",
        }}
      >
        <h1
          style={{
            fontSize: "22pt",
            fontWeight: "bold",
            marginBottom: "6px",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "1px",
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>
        {resumeData.summary && (
          <p
            style={{
              fontSize: "10pt",
              marginBottom: "10px",
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: "1.5",
            }}
          >
            {resumeData.summary}
          </p>
        )}
        <div
          style={{
            fontSize: "9.5pt",
            color: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {resumeData.contact?.email && (
            <span>✉️ {resumeData.contact.email}</span>
          )}
          {resumeData.contact?.phone && (
            <span>📱 {resumeData.contact.phone}</span>
          )}
          {resumeData.contact?.location && (
            <span>📍 {resumeData.contact.location}</span>
          )}
          {resumeData.contact?.linkedin && (
            <span>🔗 {resumeData.contact.linkedin}</span>
          )}
          {resumeData.contact?.github && (
            <span>💻 {resumeData.contact.github}</span>
          )}
          {resumeData.contact?.website && (
            <span>🌐 {resumeData.contact.website}</span>
          )}
        </div>
      </header>

      {/* Body Sections */}
      <div>{sectionOrder.map((sectionId) => renderSection(sectionId))}</div>
    </div>
  );
});

TechTemplate.displayName = "TechTemplate";

export default TechTemplate;
