import {forwardRef} from "react";

/**
 * Impact Pro Template
 *
 * Professional Prompt:
 * "Design a high-impact, results-driven resume template featuring:
 * - Bold, confident layout that immediately draws attention to achievements
 * - Vibrant emerald green accent color representing growth and success
 * - Metrics-first approach with numerical achievements highlighted
 * - Strategic use of bold typography for key accomplishments
 * - Clean single-column layout with optimal white space for ATS parsing
 * - Professional sans-serif typography for modern corporate appeal
 * - Emphasis on action verbs and quantifiable results
 * - Section dividers that create clear visual separation
 * - Perfect for high-performers showcasing measurable impact
 * - 98% ATS compatibility with semantic HTML structure"
 *
 * ATS Score: 98/100
 * Best for: Sales, Marketing, Operations, Project Management, Business Analytics
 */

const ImpactProTemplate = forwardRef(({resumeData}, ref) => {
  // Color Themes - Multiple professional palettes
  const colorThemes = {
    emerald: {
      primary: "#047857",
      secondary: "#059669",
      accent: "#10b981",
      light: "#d1fae5",
      text: "#1e293b",
      textSecondary: "#334155",
      textMuted: "#64748b",
      border: "#cbd5e1",
    },
    blue: {
      primary: "#1e40af",
      secondary: "#2563eb",
      accent: "#3b82f6",
      light: "#dbeafe",
      text: "#1e293b",
      textSecondary: "#334155",
      textMuted: "#64748b",
      border: "#cbd5e1",
    },
    purple: {
      primary: "#7e22ce",
      secondary: "#9333ea",
      accent: "#a855f7",
      light: "#f3e8ff",
      text: "#1e293b",
      textSecondary: "#334155",
      textMuted: "#64748b",
      border: "#cbd5e1",
    },
    orange: {
      primary: "#c2410c",
      secondary: "#ea580c",
      accent: "#f97316",
      light: "#ffedd5",
      text: "#1e293b",
      textSecondary: "#334155",
      textMuted: "#64748b",
      border: "#cbd5e1",
    },
  };

  // Select theme based on resumeData or default to emerald
  const selectedTheme =
    colorThemes[resumeData?.colorTheme] || colorThemes.emerald;

  // Helper function to safely format skills
  const formatSkills = (items) => {
    if (Array.isArray(items)) {
      return items.join(" • ");
    }
    if (typeof items === "string") {
      return items;
    }
    return "";
  };

  // Default section order
  const DEFAULT_SECTION_ORDER = [
    "summary",
    "skills",
    "experience",
    "achievements",
    "projects",
    "education",
    "certifications",
    "customSections",
  ];

  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder.filter(
          (id) => !["score", "personal", "recommendations"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Render section helper
  const renderSection = (sectionId) => {
    const sections = {
      summary: resumeData.summary && (
        <section key="summary" style={{marginBottom: "18px"}}>
          <div
            style={{
              backgroundColor: `${selectedTheme.primary}`,
              color: "white",
              padding: "6px 12px",
              fontSize: "11pt",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Professional Impact Summary
          </div>
          <p
            style={{
              fontSize: "10.5pt",
              lineHeight: "1.7",
              color: `${selectedTheme.text}`,
              textAlign: "justify",
              paddingLeft: "8px",
              borderLeft: `3px solid ${selectedTheme.primary}`,
            }}
          >
            {resumeData.summary}
          </p>
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "18px"}}>
          <div
            style={{
              backgroundColor: `${selectedTheme.primary}`,
              color: "white",
              padding: "6px 12px",
              fontSize: "11pt",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Core Competencies & Skills
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
              paddingLeft: "8px",
            }}
          >
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index}>
                <div
                  style={{
                    fontSize: "10.5pt",
                    fontWeight: "700",
                    color: `${selectedTheme.primary}`,
                    marginBottom: "4px",
                  }}
                >
                  {skillGroup.category}
                </div>
                <div
                  style={{
                    fontSize: "10pt",
                    color: `${selectedTheme.textSecondary}`,
                    lineHeight: "1.5",
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
        <section key="experience" style={{marginBottom: "18px"}}>
          <div
            style={{
              backgroundColor: `${selectedTheme.primary}`,
              color: "white",
              padding: "6px 12px",
              fontSize: "11pt",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Professional Experience & Results
          </div>
          {resumeData.experience.map((exp, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                paddingLeft: "8px",
                borderLeft: `3px solid ${selectedTheme.light}`,
              }}
            >
              <div style={{marginBottom: "6px"}}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "12pt",
                        fontWeight: "700",
                        color: `${selectedTheme.primary}`,
                      }}
                    >
                      {exp.title}
                    </span>
                    <span
                      style={{
                        fontSize: "11pt",
                        fontWeight: "600",
                        color: `${selectedTheme.text}`,
                        marginLeft: "8px",
                      }}
                    >
                      @ {exp.company}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "10pt",
                      color: `${selectedTheme.textMuted}`,
                      fontWeight: "600",
                    }}
                  >
                    {exp.startDate} – {exp.endDate || "Present"}
                  </div>
                </div>
                {exp.location && (
                  <div
                    style={{
                      fontSize: "9.5pt",
                      color: `${selectedTheme.textMuted}`,
                      marginTop: "2px",
                    }}
                  >
                    📍 {exp.location}
                  </div>
                )}
              </div>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul
                  style={{
                    margin: "8px 0 0 18px",
                    padding: 0,
                    fontSize: "10pt",
                    lineHeight: "1.6",
                  }}
                >
                  {exp.responsibilities.map((resp, i) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: "4px",
                        color: `${selectedTheme.textSecondary}`,
                      }}
                    >
                      {resp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "18px"}}>
            <div
              style={{
                backgroundColor: `${selectedTheme.primary}`,
                color: "white",
                padding: "6px 12px",
                fontSize: "11pt",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              Key Achievements & Recognition
            </div>
            <div
              style={{
                paddingLeft: "8px",
                borderLeft: `3px solid ${selectedTheme.light}`,
              }}
            >
              <ul
                style={{
                  margin: "0",
                  padding: "0 0 0 18px",
                  fontSize: "10pt",
                  lineHeight: "1.6",
                }}
              >
                {resumeData.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "5px",
                      color: `${selectedTheme.textSecondary}`,
                      fontWeight: "500",
                    }}
                  >
                    <span
                      style={{
                        color: `${selectedTheme.primary}`,
                        fontWeight: "700",
                      }}
                    >
                      ▸
                    </span>{" "}
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={{marginBottom: "18px"}}>
          <div
            style={{
              backgroundColor: `${selectedTheme.primary}`,
              color: "white",
              padding: "6px 12px",
              fontSize: "11pt",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Notable Projects & Initiatives
          </div>
          {resumeData.projects.map((project, index) => (
            <div
              key={index}
              style={{
                marginBottom: "14px",
                paddingLeft: "8px",
                borderLeft: `3px solid ${selectedTheme.light}`,
              }}
            >
              <div
                style={{
                  fontSize: "11pt",
                  fontWeight: "700",
                  color: `${selectedTheme.primary}`,
                  marginBottom: "4px",
                }}
              >
                {project.name}
              </div>
              {project.description && (
                <p
                  style={{
                    fontSize: "10pt",
                    color: `${selectedTheme.textSecondary}`,
                    margin: "4px 0",
                    lineHeight: "1.6",
                  }}
                >
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: `${selectedTheme.textMuted}`,
                    marginTop: "4px",
                    fontWeight: "600",
                  }}
                >
                  <span style={{color: `${selectedTheme.primary}`}}>
                    Tech Stack:
                  </span>{" "}
                  {project.technologies}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section key="education" style={{marginBottom: "18px"}}>
          <div
            style={{
              backgroundColor: `${selectedTheme.primary}`,
              color: "white",
              padding: "6px 12px",
              fontSize: "11pt",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
            }}
          >
            Education & Academic Background
          </div>
          <div
            style={{
              paddingLeft: "8px",
              borderLeft: `3px solid ${selectedTheme.light}`,
            }}
          >
            {resumeData.education.map((edu, index) => (
              <div key={index} style={{marginBottom: "12px"}}>
                <div
                  style={{
                    fontSize: "11pt",
                    fontWeight: "700",
                    color: `${selectedTheme.primary}`,
                  }}
                >
                  {edu.degree}
                </div>
                <div
                  style={{
                    fontSize: "10.5pt",
                    fontWeight: "600",
                    color: `${selectedTheme.text}`,
                    marginTop: "2px",
                  }}
                >
                  {edu.institution}
                </div>
                <div
                  style={{
                    fontSize: "10pt",
                    color: `${selectedTheme.textMuted}`,
                    marginTop: "2px",
                  }}
                >
                  {edu.graduationDate}
                  {edu.gpa && (
                    <span style={{marginLeft: "12px", fontWeight: "600"}}>
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "18px"}}>
            <div
              style={{
                backgroundColor: `${selectedTheme.primary}`,
                color: "white",
                padding: "6px 12px",
                fontSize: "11pt",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "10px",
              }}
            >
              Professional Certifications
            </div>
            <div
              style={{
                paddingLeft: "8px",
                borderLeft: `3px solid ${selectedTheme.light}`,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
              }}
            >
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: "10pt",
                    color: `${selectedTheme.textSecondary}`,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      color: `${selectedTheme.primary}`,
                    }}
                  >
                    {cert.name}
                  </div>
                  {cert.issuer && (
                    <div
                      style={{
                        fontSize: "9.5pt",
                        color: `${selectedTheme.textMuted}`,
                      }}
                    >
                      {cert.issuer}
                    </div>
                  )}
                  {cert.date && (
                    <div
                      style={{
                        fontSize: "9pt",
                        color: "#9ca3af",
                        fontWeight: "600",
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

      customSections:
        resumeData.customSections && resumeData.customSections.length > 0
          ? resumeData.customSections.map((section, index) => (
              <section key={`custom-${index}`} style={{marginBottom: "18px"}}>
                <div
                  style={{
                    backgroundColor: `${selectedTheme.primary}`,
                    color: "white",
                    padding: "6px 12px",
                    fontSize: "11pt",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "10px",
                  }}
                >
                  {section.title}
                </div>
                <div
                  style={{
                    fontSize: "10pt",
                    color: `${selectedTheme.textSecondary}`,
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    paddingLeft: "8px",
                    borderLeft: `3px solid ${selectedTheme.light}`,
                  }}
                >
                  {section.content}
                </div>
              </section>
            ))
          : null,
    };

    return sections[sectionId] || null;
  };

  return (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "18mm 22mm",
        backgroundColor: "white",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        color: "#000000",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header
        style={{
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: `4px solid ${selectedTheme.primary}`,
        }}
      >
        <h1
          style={{
            fontSize: "28pt",
            fontWeight: "700",
            margin: "0 0 10px 0",
            color: `${selectedTheme.primary}`,
            letterSpacing: "0.5px",
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>

        {/* Contact Information */}
        <div
          style={{
            fontSize: "10pt",
            color: "#4b5563",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            fontWeight: "500",
          }}
        >
          {resumeData.contact?.email && (
            <span>✉️ {resumeData.contact.email}</span>
          )}
          {resumeData.contact?.phone && (
            <>
              <span style={{color: `${selectedTheme.border}`}}>|</span>
              <span>📱 {resumeData.contact.phone}</span>
            </>
          )}
          {resumeData.contact?.location && (
            <>
              <span style={{color: `${selectedTheme.border}`}}>|</span>
              <span>📍 {resumeData.contact.location}</span>
            </>
          )}
          {resumeData.contact?.linkedin && (
            <>
              <span style={{color: `${selectedTheme.border}`}}>|</span>
              <span>💼 {resumeData.contact.linkedin}</span>
            </>
          )}
          {resumeData.contact?.github && (
            <>
              <span style={{color: `${selectedTheme.border}`}}>|</span>
              <span>🔗 {resumeData.contact.github}</span>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{sectionOrder.map((sectionId) => renderSection(sectionId))}</main>

      {/* Footer Watermark */}
      <footer
        style={{
          marginTop: "20px",
          paddingTop: "10px",
          borderTop: "2px solid #e5e7eb",
          fontSize: "8pt",
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        Impact-Driven Professional | Results-Oriented Leader
      </footer>
    </div>
  );
});

ImpactProTemplate.displayName = "ImpactProTemplate";

export default ImpactProTemplate;
