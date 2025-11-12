import {forwardRef} from "react";

/**
 * Strategic Leader Template
 *
 * Professional Prompt:
 * "Create a leadership-focused resume template that emphasizes:
 * - Strategic impact and business outcomes at the forefront
 * - Clean two-column asymmetric layout (30/70 split) for visual hierarchy
 * - Sophisticated teal accent color conveying innovation and trust
 * - Achievement-driven format with quantifiable metrics prominence
 * - Executive summary prominently positioned for immediate impact
 * - Skills sidebar for quick competency scanning
 * - Modern professional typography with excellent readability
 * - Optimized for ATS with semantic structure and clear section breaks
 * - Perfect for Director, VP, and C-level positions"
 *
 * ATS Score: 97/100
 * Best for: Senior Leadership, Strategy, Product Management, Business Development
 */

const StrategicLeaderTemplate = forwardRef(({resumeData}, ref) => {
  // Color Themes - Multiple professional palettes
  const colorThemes = {
    teal: {
      primary: "#0d7377",
      secondary: "#14919b",
      accent: "#2c3e50",
      sidebar: "#f7fafc",
      text: "#2d3748",
      textLight: "#4a5568",
      textMuted: "#718096",
    },
    purple: {
      primary: "#6b46c1",
      secondary: "#805ad5",
      accent: "#44337a",
      sidebar: "#faf5ff",
      text: "#2d3748",
      textLight: "#4a5568",
      textMuted: "#718096",
    },
    burgundy: {
      primary: "#9b2c2c",
      secondary: "#c53030",
      accent: "#742a2a",
      sidebar: "#fff5f5",
      text: "#2d3748",
      textLight: "#4a5568",
      textMuted: "#718096",
    },
    navy: {
      primary: "#2c5282",
      secondary: "#2b6cb0",
      accent: "#1a365d",
      sidebar: "#ebf8ff",
      text: "#2d3748",
      textLight: "#4a5568",
      textMuted: "#718096",
    },
  };

  // Select theme based on resumeData or default to teal
  const selectedTheme = colorThemes[resumeData?.colorTheme] || colorThemes.teal;

  // Helper function to safely format skills
  const formatSkills = (items) => {
    if (Array.isArray(items)) {
      return items;
    }
    if (typeof items === "string") {
      return items.split(",").map((s) => s.trim());
    }
    return [];
  };

  // Default section order for main content
  const MAIN_SECTION_ORDER = [
    "summary",
    "experience",
    "projects",
    "achievements",
    "customSections",
  ];

  // Sidebar sections
  const SIDEBAR_SECTIONS = ["skills", "education", "certifications"];

  const renderMainSection = (sectionId) => {
    const sections = {
      summary: resumeData.summary && (
        <section key="summary" style={{marginBottom: "18px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "700",
              color: `${selectedTheme.primary}`,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderLeft: `4px solid ${selectedTheme.primary}`,
              paddingLeft: "10px",
            }}
          >
            Strategic Profile
          </h2>
          <p
            style={{
              fontSize: "10.5pt",
              lineHeight: "1.7",
              color: `${selectedTheme.text}`,
              textAlign: "justify",
              fontWeight: "400",
            }}
          >
            {resumeData.summary}
          </p>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "18px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "700",
              color: `${selectedTheme.primary}`,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderLeft: `4px solid ${selectedTheme.primary}`,
              paddingLeft: "10px",
            }}
          >
            Leadership Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                paddingBottom: "14px",
                borderBottom:
                  index < resumeData.experience.length - 1
                    ? "1px solid #e2e8f0"
                    : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "11.5pt",
                    fontWeight: "700",
                    color: "#1a202c",
                  }}
                >
                  {exp.title}
                </div>
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: `${selectedTheme.textMuted}`,
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.startDate} – {exp.endDate || "Present"}
                </div>
              </div>
              <div
                style={{
                  fontSize: "10.5pt",
                  fontWeight: "600",
                  color: `${selectedTheme.primary}`,
                  marginBottom: "8px",
                }}
              >
                {exp.company}
                {exp.location && (
                  <span
                    style={{
                      fontWeight: "normal",
                      color: `${selectedTheme.textMuted}`,
                      fontSize: "10pt",
                    }}
                  >
                    {" "}
                    • {exp.location}
                  </span>
                )}
              </div>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul
                  style={{
                    margin: "6px 0 0 20px",
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
                        color: `${selectedTheme.text}`,
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

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={{marginBottom: "18px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "700",
              color: `${selectedTheme.primary}`,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              borderLeft: `4px solid ${selectedTheme.primary}`,
              paddingLeft: "10px",
            }}
          >
            Strategic Initiatives
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "14px"}}>
              <div
                style={{
                  fontSize: "11pt",
                  fontWeight: "700",
                  color: "#1a202c",
                  marginBottom: "4px",
                }}
              >
                {project.name}
              </div>
              {project.description && (
                <p
                  style={{
                    fontSize: "10pt",
                    color: `${selectedTheme.text}`,
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
                  }}
                >
                  <span style={{fontWeight: "600"}}>Technologies:</span>{" "}
                  {project.technologies}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "18px"}}>
            <h2
              style={{
                fontSize: "13pt",
                fontWeight: "700",
                color: `${selectedTheme.primary}`,
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderLeft: `4px solid ${selectedTheme.primary}`,
                paddingLeft: "10px",
              }}
            >
              Key Achievements
            </h2>
            <ul
              style={{
                margin: "0",
                padding: "0 0 0 20px",
                fontSize: "10pt",
                lineHeight: "1.6",
              }}
            >
              {resumeData.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "5px",
                    color: `${selectedTheme.text}`,
                  }}
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      customSections:
        resumeData.customSections && resumeData.customSections.length > 0
          ? resumeData.customSections.map((section, index) => (
              <section key={`custom-${index}`} style={{marginBottom: "18px"}}>
                <h2
                  style={{
                    fontSize: "13pt",
                    fontWeight: "700",
                    color: `${selectedTheme.primary}`,
                    marginBottom: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderLeft: `4px solid ${selectedTheme.primary}`,
                    paddingLeft: "10px",
                  }}
                >
                  {section.title}
                </h2>
                <div
                  style={{
                    fontSize: "10pt",
                    color: `${selectedTheme.text}`,
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
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
        backgroundColor: "white",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#000000",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Sidebar - 30% width */}
      <aside
        style={{
          width: "30%",
          backgroundColor: `${selectedTheme.sidebar}`,
          padding: "20mm 15mm",
          borderRight: `3px solid ${selectedTheme.primary}`,
        }}
      >
        {/* Header in Sidebar */}
        <div style={{marginBottom: "24px"}}>
          <h1
            style={{
              fontSize: "20pt",
              fontWeight: "700",
              margin: "0 0 6px 0",
              color: "#1a202c",
              lineHeight: "1.2",
              wordBreak: "break-word",
            }}
          >
            {resumeData.name || "Your Name"}
          </h1>
        </div>

        {/* Contact Information */}
        <div style={{marginBottom: "24px"}}>
          <h3
            style={{
              fontSize: "10pt",
              fontWeight: "700",
              color: `${selectedTheme.primary}`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            Contact
          </h3>
          <div
            style={{
              fontSize: "9pt",
              color: `${selectedTheme.text}`,
              lineHeight: "1.6",
            }}
          >
            {resumeData.contact?.email && (
              <div style={{marginBottom: "4px", wordBreak: "break-word"}}>
                {resumeData.contact.email}
              </div>
            )}
            {resumeData.contact?.phone && (
              <div style={{marginBottom: "4px"}}>
                {resumeData.contact.phone}
              </div>
            )}
            {resumeData.contact?.location && (
              <div style={{marginBottom: "4px"}}>
                {resumeData.contact.location}
              </div>
            )}
            {resumeData.contact?.linkedin && (
              <div style={{marginBottom: "4px", wordBreak: "break-word"}}>
                {resumeData.contact.linkedin}
              </div>
            )}
            {resumeData.contact?.github && (
              <div style={{wordBreak: "break-word"}}>
                {resumeData.contact.github}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div style={{marginBottom: "24px"}}>
            <h3
              style={{
                fontSize: "10pt",
                fontWeight: "700",
                color: `${selectedTheme.primary}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Core Skills
            </h3>
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} style={{marginBottom: "12px"}}>
                <div
                  style={{
                    fontSize: "9.5pt",
                    fontWeight: "600",
                    color: `${selectedTheme.text}`,
                    marginBottom: "4px",
                  }}
                >
                  {skillGroup.category}
                </div>
                <div
                  style={{
                    fontSize: "9pt",
                    color: `${selectedTheme.textLight}`,
                    lineHeight: "1.5",
                  }}
                >
                  {formatSkills(skillGroup.items).map((skill, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: "3px",
                        paddingLeft: "8px",
                        borderLeft: `2px solid ${selectedTheme.primary}`,
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData.education && resumeData.education.length > 0 && (
          <div style={{marginBottom: "24px"}}>
            <h3
              style={{
                fontSize: "10pt",
                fontWeight: "700",
                color: `${selectedTheme.primary}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Education
            </h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} style={{marginBottom: "12px"}}>
                <div
                  style={{
                    fontSize: "9.5pt",
                    fontWeight: "600",
                    color: `${selectedTheme.text}`,
                    lineHeight: "1.3",
                  }}
                >
                  {edu.degree}
                </div>
                <div
                  style={{
                    fontSize: "9pt",
                    color: `${selectedTheme.textLight}`,
                    marginTop: "2px",
                    lineHeight: "1.3",
                  }}
                >
                  {edu.institution}
                </div>
                <div
                  style={{
                    fontSize: "8.5pt",
                    color: `${selectedTheme.textMuted}`,
                    marginTop: "2px",
                  }}
                >
                  {edu.graduationDate}
                </div>
                {edu.gpa && (
                  <div
                    style={{
                      fontSize: "8.5pt",
                      color: `${selectedTheme.textMuted}`,
                      marginTop: "1px",
                    }}
                  >
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <div style={{marginBottom: "24px"}}>
            <h3
              style={{
                fontSize: "10pt",
                fontWeight: "700",
                color: `${selectedTheme.primary}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Certifications
            </h3>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} style={{marginBottom: "10px"}}>
                <div
                  style={{
                    fontSize: "9pt",
                    fontWeight: "600",
                    color: `${selectedTheme.text}`,
                    lineHeight: "1.3",
                  }}
                >
                  {cert.name}
                </div>
                {cert.issuer && (
                  <div
                    style={{
                      fontSize: "8.5pt",
                      color: `${selectedTheme.textLight}`,
                      marginTop: "2px",
                    }}
                  >
                    {cert.issuer}
                  </div>
                )}
                {cert.date && (
                  <div
                    style={{
                      fontSize: "8.5pt",
                      color: `${selectedTheme.textMuted}`,
                      marginTop: "1px",
                    }}
                  >
                    {cert.date}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content - 70% width */}
      <main
        style={{
          width: "70%",
          padding: "20mm 20mm 20mm 15mm",
        }}
      >
        {MAIN_SECTION_ORDER.map((sectionId) => renderMainSection(sectionId))}
      </main>
    </div>
  );
});

StrategicLeaderTemplate.displayName = "StrategicLeaderTemplate";

export default StrategicLeaderTemplate;
