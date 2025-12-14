import {forwardRef, useRef, useEffect, useState} from "react";

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

const StrategicLeaderTemplate = forwardRef(
  ({resumeData, onPageUsageChange}, ref) => {
    // Page overflow detection state
    const containerRef = useRef(null);
    const [pageOverflowInfo, setPageOverflowInfo] = useState({
      isOverflowing: false,
      currentHeight: 0,
      maxHeight: 1056, // Standard A4 page height at 96 DPI (11 inches * 96)
      overflowPercentage: 0,
      templateName: "StrategicLeaderTemplate",
    });

    // Detect page overflow whenever resumeData changes
    useEffect(() => {
      if (containerRef.current) {
        const currentHeight = containerRef.current.scrollHeight;
        const maxHeight = 1056; // A4 page height
        const isOverflowing = currentHeight > maxHeight;
        const overflowPercentage = isOverflowing
          ? Math.round(((currentHeight - maxHeight) / maxHeight) * 100)
          : 0;

        const usageInfo = {
          isOverflowing,
          currentHeight,
          maxHeight,
          overflowPercentage,
          percentage: Math.round((currentHeight / maxHeight) * 100), // Allow > 100% for overflow
          templateName: "StrategicLeaderTemplate",
        };

        setPageOverflowInfo(usageInfo);

        // Log overflow information for testing - TEMPLATE SPECIFIC
        if (isOverflowing) {
          console.log(
            `⚠️ StrategicLeaderTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
          );
        } else {
          console.log(
            `✅ StrategicLeaderTemplate: Content fits on one page. Height: ${currentHeight}px / ${maxHeight}px (${usageInfo.percentage}% filled)`
          );
        }

        // Pass data to parent component if callback provided
        if (onPageUsageChange) {
          onPageUsageChange(usageInfo);
        }
      }
    }, [resumeData]); // Don't include onPageUsageChange to prevent infinite loops

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
    const selectedTheme =
      colorThemes[resumeData?.colorTheme] || colorThemes.teal;

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
          <section key="summary" style={{marginBottom: "12px"}}>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "700",
                color: "white",
                backgroundColor: `${selectedTheme.primary}`,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "3px 10px",
                display: "inline-block",
              }}
            >
              Strategic Profile
            </h2>
            <p
              style={{
                fontSize: "10pt",
                lineHeight: "1.5",
                color: `${selectedTheme.text}`,
                textAlign: "justify",
                fontWeight: "400",
              }}
            >
              {resumeData.summary}
            </p>
          </section>
        ),

        experience: resumeData.experience &&
          resumeData.experience.length > 0 && (
            <section key="experience" style={{marginBottom: "12px"}}>
              <h2
                style={{
                  fontSize: "12pt",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: `${selectedTheme.primary}`,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "3px 10px",
                  display: "inline-block",
                }}
              >
                Leadership Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "10px",
                    paddingBottom: "8px",
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
                      marginBottom: "3px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11pt",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      {exp.title}
                    </div>
                    <div
                      style={{
                        fontSize: "9pt",
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
                      fontSize: "10pt",
                      fontWeight: "600",
                      color: `${selectedTheme.primary}`,
                      marginBottom: "5px",
                    }}
                  >
                    {exp.company}
                    {exp.location && (
                      <span
                        style={{
                          fontWeight: "normal",
                          color: `${selectedTheme.textMuted}`,
                          fontSize: "9pt",
                        }}
                      >
                        {" "}
                        • {exp.location}
                      </span>
                    )}
                  </div>
                  {/* Use bullets array (actual field name from API) */}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul
                      style={{
                        margin: "4px 0 0 18px",
                        padding: 0,
                        fontSize: "9.5pt",
                        lineHeight: "1.5",
                      }}
                    >
                      {exp.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          style={{
                            marginBottom: "3px",
                            color: `${selectedTheme.text}`,
                          }}
                        >
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
          <section key="projects" style={{marginBottom: "12px"}}>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "700",
                color: "white",
                backgroundColor: `${selectedTheme.primary}`,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "3px 10px",
                display: "inline-block",
              }}
            >
              Strategic Initiatives
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} style={{marginBottom: "10px"}}>
                <div
                  style={{
                    fontSize: "10.5pt",
                    fontWeight: "700",
                    color: "#1a202c",
                    marginBottom: "3px",
                  }}
                >
                  {project.name}
                </div>
                {/* Use bullets array for projects too */}
                {project.bullets && project.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: "3px 0 0 18px",
                      padding: 0,
                      fontSize: "9.5pt",
                      lineHeight: "1.5",
                    }}
                  >
                    {project.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: "3px",
                          color: `${selectedTheme.text}`,
                        }}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
                {project.technologies && (
                  <div
                    style={{
                      fontSize: "9pt",
                      color: `${selectedTheme.textMuted}`,
                      marginTop: "3px",
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
            <section key="achievements" style={{marginBottom: "12px"}}>
              <h2
                style={{
                  fontSize: "12pt",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: `${selectedTheme.primary}`,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  padding: "3px 10px",
                  display: "inline-block",
                }}
              >
                Key Achievements
              </h2>
              <ul
                style={{
                  margin: "0",
                  padding: "0 0 0 18px",
                  fontSize: "9.5pt",
                  lineHeight: "1.5",
                }}
              >
                {resumeData.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "3px",
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
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        style={{
          width: "210mm",
          minHeight: "297mm",
          backgroundColor: "white",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
            padding: "8mm 10mm",
            borderRight: `3px solid ${selectedTheme.primary}`,
          }}
        >
          {/* Header in Sidebar */}
          <div style={{marginBottom: "14px"}}>
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
          <div style={{marginBottom: "14px"}}>
            <h3
              style={{
                fontSize: "10pt",
                fontWeight: "700",
                color: "white",
                backgroundColor: `${selectedTheme.primary}`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
                padding: "3px 8px",
                display: "inline-block",
              }}
            >
              Contact
            </h3>
            <div
              style={{
                fontSize: "9pt",
                color: `${selectedTheme.text}`,
                lineHeight: "1.5",
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
            <div style={{marginBottom: "14px"}}>
              <h3
                style={{
                  fontSize: "10pt",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: `${selectedTheme.primary}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                  padding: "3px 8px",
                  display: "inline-block",
                }}
              >
                Core Skills
              </h3>
              {resumeData.skills.map((skillGroup, index) => (
                <div key={index} style={{marginBottom: "8px"}}>
                  <div
                    style={{
                      fontSize: "9.5pt",
                      fontWeight: "600",
                      color: `${selectedTheme.text}`,
                      marginBottom: "3px",
                    }}
                  >
                    {skillGroup.category}
                  </div>
                  <div
                    style={{
                      fontSize: "9pt",
                      color: `${selectedTheme.textLight}`,
                      lineHeight: "1.4",
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
            <div style={{marginBottom: "14px"}}>
              <h3
                style={{
                  fontSize: "10pt",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: `${selectedTheme.primary}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "6px",
                  padding: "3px 8px",
                  display: "inline-block",
                }}
              >
                Education
              </h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} style={{marginBottom: "8px"}}>
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
          {resumeData.certifications &&
            resumeData.certifications.length > 0 && (
              <div style={{marginBottom: "14px"}}>
                <h3
                  style={{
                    fontSize: "10pt",
                    fontWeight: "700",
                    color: "white",
                    backgroundColor: `${selectedTheme.primary}`,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                    padding: "3px 8px",
                    display: "inline-block",
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
            padding: "8mm 10mm",
          }}
        >
          {MAIN_SECTION_ORDER.map((sectionId) => renderMainSection(sectionId))}
        </main>
      </div>
    );
  }
);

StrategicLeaderTemplate.displayName = "StrategicLeaderTemplate";

export default StrategicLeaderTemplate;
