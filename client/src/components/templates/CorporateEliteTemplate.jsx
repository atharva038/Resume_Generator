import {forwardRef} from "react";

/**
 * Corporate Elite Template
 *
 * Professional Prompt:
 * "Design an ultra-professional, Fortune 500-ready resume template with:
 * - Sophisticated two-column layout with clear hierarchy
 * - Conservative navy blue accents for corporate credibility
 * - Maximum white space for ATS parsing accuracy
 * - Structured sections with bold separators for easy scanning
 * - Traditional serif headings paired with modern sans-serif body text
 * - Emphasis on quantifiable achievements and metrics
 * - Executive-level polish suitable for C-suite and senior management
 * - 99% ATS compatibility with logical content flow"
 *
 * ATS Score: 99/100
 * Best for: Corporate, Finance, Consulting, Senior Management
 */

const CorporateEliteTemplate = forwardRef(({resumeData}, ref) => {
  // Color Themes - Multiple professional palettes
  const colorThemes = {
    navy: {
      primary: "#1e3a5f",
      secondary: "#34495e",
      accent: "#5a6c7d",
      light: "#bdc3c7",
      text: "#2c3e50",
    },
    burgundy: {
      primary: "#7c2d3a",
      secondary: "#4a1a24",
      accent: "#a64253",
      light: "#d4a5ae",
      text: "#3d1e26",
    },
    forest: {
      primary: "#2d5016",
      secondary: "#1a3009",
      accent: "#4a7c2d",
      light: "#a8c99c",
      text: "#253d1a",
    },
    charcoal: {
      primary: "#2c3e50",
      secondary: "#1a252f",
      accent: "#4a5f7a",
      light: "#95a5a6",
      text: "#212f3c",
    },
  };

  // Select theme based on resumeData or default to navy
  const selectedTheme = colorThemes[resumeData?.colorTheme] || colorThemes.navy;

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
    "experience",
    "skills",
    "education",
    "certifications",
    "projects",
    "achievements",
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
        <section key="summary" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: selectedTheme.primary,
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: `2px solid ${selectedTheme.primary}`,
              paddingBottom: "4px",
              marginBottom: "8px",
              fontFamily: "Georgia, serif",
            }}
          >
            Executive Summary
          </h2>
          <p
            style={{
              fontSize: "10.5pt",
              lineHeight: "1.6",
              color: selectedTheme.text,
              textAlign: "justify",
            }}
          >
            {resumeData.summary}
          </p>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: selectedTheme.primary,
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: `2px solid `,
              paddingBottom: "4px",
              marginBottom: "8px",
              fontFamily: "Georgia, serif",
            }}
          >
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "14px"}}>
              <div style={{marginBottom: "4px"}}>
                <div
                  style={{
                    fontSize: "11pt",
                    fontWeight: "700",
                    color: selectedTheme.primary,
                  }}
                >
                  {exp.title}
                </div>
                <div
                  style={{
                    fontSize: "10.5pt",
                    fontWeight: "600",
                    color: selectedTheme.secondary,
                    marginTop: "2px",
                  }}
                >
                  {exp.company}
                  {exp.location && (
                    <span
                      style={{
                        fontWeight: "normal",
                        color: selectedTheme.accent,
                      }}
                    >
                      {" "}
                      | {exp.location}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: selectedTheme.accent,
                    fontStyle: "italic",
                    marginTop: "2px",
                  }}
                >
                  {exp.startDate} – {exp.endDate || "Present"}
                </div>
              </div>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul
                  style={{
                    margin: "6px 0 0 18px",
                    padding: 0,
                    fontSize: "10pt",
                    lineHeight: "1.5",
                  }}
                >
                  {exp.responsibilities.map((resp, i) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: "3px",
                        color: selectedTheme.text,
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

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: selectedTheme.primary,
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: `2px solid `,
              paddingBottom: "4px",
              marginBottom: "8px",
              fontFamily: "Georgia, serif",
            }}
          >
            Core Competencies
          </h2>
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index}>
                <div
                  style={{
                    fontSize: "10.5pt",
                    fontWeight: "600",
                    color: selectedTheme.secondary,
                    marginBottom: "3px",
                  }}
                >
                  {skillGroup.category}
                </div>
                <div
                  style={{
                    fontSize: "10pt",
                    color: selectedTheme.text,
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

      education: resumeData.education && resumeData.education.length > 0 && (
        <section key="education" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: selectedTheme.primary,
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: `2px solid `,
              paddingBottom: "4px",
              marginBottom: "8px",
              fontFamily: "Georgia, serif",
            }}
          >
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div
                style={{
                  fontSize: "10.5pt",
                  fontWeight: "700",
                  color: selectedTheme.primary,
                }}
              >
                {edu.degree}
              </div>
              <div
                style={{
                  fontSize: "10pt",
                  fontWeight: "600",
                  color: selectedTheme.secondary,
                  marginTop: "2px",
                }}
              >
                {edu.institution}
              </div>
              <div
                style={{
                  fontSize: "9.5pt",
                  color: selectedTheme.accent,
                  fontStyle: "italic",
                  marginTop: "2px",
                }}
              >
                {edu.graduationDate}
                {edu.gpa && ` | GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "16px"}}>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "700",
                color: selectedTheme.primary,
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid `,
                paddingBottom: "4px",
                marginBottom: "8px",
                fontFamily: "Georgia, serif",
              }}
            >
              Professional Certifications
            </h2>
            {resumeData.certifications.map((cert, index) => (
              <div
                key={index}
                style={{
                  fontSize: "10pt",
                  color: selectedTheme.text,
                  marginBottom: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  <span style={{fontWeight: "600"}}>{cert.name}</span>
                  {cert.issuer && (
                    <span style={{color: selectedTheme.accent}}>
                      {" "}
                      — {cert.issuer}
                    </span>
                  )}
                </span>
                {cert.date && (
                  <span style={{color: selectedTheme.accent}}>{cert.date}</span>
                )}
              </div>
            ))}
          </section>
        ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "12pt",
              fontWeight: "700",
              color: selectedTheme.primary,
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: `2px solid `,
              paddingBottom: "4px",
              marginBottom: "8px",
              fontFamily: "Georgia, serif",
            }}
          >
            Key Projects
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "12px"}}>
              <div
                style={{
                  fontSize: "10.5pt",
                  fontWeight: "700",
                  color: selectedTheme.primary,
                }}
              >
                {project.name}
              </div>
              {project.description && (
                <p
                  style={{
                    fontSize: "10pt",
                    color: selectedTheme.text,
                    margin: "4px 0",
                    lineHeight: "1.5",
                  }}
                >
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: selectedTheme.accent,
                    fontStyle: "italic",
                    marginTop: "3px",
                  }}
                >
                  Technologies: {project.technologies}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "16px"}}>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "700",
                color: selectedTheme.primary,
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: `2px solid `,
                paddingBottom: "4px",
                marginBottom: "8px",
                fontFamily: "Georgia, serif",
              }}
            >
              Notable Achievements
            </h2>
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
                    marginBottom: "4px",
                    color: selectedTheme.text,
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
              <section key={`custom-${index}`} style={{marginBottom: "16px"}}>
                <h2
                  style={{
                    fontSize: "12pt",
                    fontWeight: "700",
                    color: selectedTheme.primary,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    borderBottom: `2px solid `,
                    paddingBottom: "4px",
                    marginBottom: "8px",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {section.title}
                </h2>
                <div
                  style={{
                    fontSize: "10pt",
                    color: selectedTheme.text,
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
        padding: "20mm",
        backgroundColor: "white",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#000000",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header style={{marginBottom: "20px", textAlign: "center"}}>
        <h1
          style={{
            fontSize: "24pt",
            fontWeight: "700",
            margin: "0 0 8px 0",
            color: selectedTheme.primary,
            letterSpacing: "1px",
            fontFamily: "Georgia, serif",
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>

        {/* Contact Information */}
        <div
          style={{
            fontSize: "10pt",
            color: selectedTheme.accent,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px",
            borderTop: "1px solid ${selectedTheme.light}",
            borderBottom: "1px solid ${selectedTheme.light}",
            padding: "8px 0",
            marginTop: "8px",
          }}
        >
          {resumeData.contact?.email && <span>{resumeData.contact.email}</span>}
          {resumeData.contact?.phone && (
            <>
              <span style={{color: selectedTheme.light}}>|</span>
              <span>{resumeData.contact.phone}</span>
            </>
          )}
          {resumeData.contact?.location && (
            <>
              <span style={{color: selectedTheme.light}}>|</span>
              <span>{resumeData.contact.location}</span>
            </>
          )}
          {resumeData.contact?.linkedin && (
            <>
              <span style={{color: selectedTheme.light}}>|</span>
              <span>{resumeData.contact.linkedin}</span>
            </>
          )}
          {resumeData.contact?.github && (
            <>
              <span style={{color: selectedTheme.light}}>|</span>
              <span>{resumeData.contact.github}</span>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{sectionOrder.map((sectionId) => renderSection(sectionId))}</main>
    </div>
  );
});

CorporateEliteTemplate.displayName = "CorporateEliteTemplate";

export default CorporateEliteTemplate;
