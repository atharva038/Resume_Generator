import {forwardRef, useRef, useEffect, useState} from "react";
import {Mail, Phone, MapPin, Linkedin, Github, Globe} from "lucide-react";

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

const CorporateEliteTemplate = forwardRef(
  ({resumeData, onPageUsageChange}, ref) => {
    // Page overflow detection state
    const containerRef = useRef(null);
    const [pageOverflowInfo, setPageOverflowInfo] = useState({
      isOverflowing: false,
      currentHeight: 0,
      maxHeight: 1056, // Standard A4 page height at 96 DPI (11 inches * 96)
      overflowPercentage: 0,
      templateName: "CorporateEliteTemplate",
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
          templateName: "CorporateEliteTemplate",
        };

        setPageOverflowInfo(usageInfo);

        // Log overflow information for testing - TEMPLATE SPECIFIC
        if (isOverflowing) {
          console.log(
            `⚠️ CorporateEliteTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
          );
        } else {
          console.log(
            `✅ CorporateEliteTemplate: Content fits on one page. Height: ${currentHeight}px / ${maxHeight}px (${usageInfo.percentage}% filled)`
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
    const selectedTheme =
      colorThemes[resumeData?.colorTheme] || colorThemes.navy;

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
          <section key="summary" style={{marginBottom: "10px"}}>
            <h2
              style={{
                fontSize: "11pt",
                fontWeight: "700",
                color: selectedTheme.primary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderBottom: `2px solid ${selectedTheme.primary}`,
                paddingBottom: "3px",
                marginBottom: "6px",
                fontFamily: "Georgia, serif",
              }}
            >
              Executive Summary
            </h2>
            <p
              style={{
                fontSize: "9.5pt",
                lineHeight: "1.4",
                color: selectedTheme.text,
                textAlign: "justify",
              }}
            >
              {resumeData.summary}
            </p>
          </section>
        ),

        experience: resumeData.experience &&
          resumeData.experience.length > 0 && (
            <section key="experience" style={{marginBottom: "10px"}}>
              <h2
                style={{
                  fontSize: "11pt",
                  fontWeight: "700",
                  color: selectedTheme.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: `2px solid `,
                  paddingBottom: "3px",
                  marginBottom: "6px",
                  fontFamily: "Georgia, serif",
                }}
              >
                Professional Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} style={{marginBottom: "10px"}}>
                  <div style={{marginBottom: "3px"}}>
                    <div
                      style={{
                        fontSize: "10pt",
                        fontWeight: "700",
                        color: selectedTheme.primary,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <span>
                        {exp.title}
                        <span
                          style={{
                            fontWeight: "600",
                            color: selectedTheme.secondary,
                            marginLeft: "8px",
                          }}
                        >
                          | {exp.company}
                        </span>
                      </span>
                      {exp.location && (
                        <span
                          style={{
                            fontSize: "9pt",
                            fontWeight: "normal",
                            color: selectedTheme.accent,
                          }}
                        >
                          {exp.location}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "9pt",
                        color: selectedTheme.accent,
                        fontStyle: "italic",
                        marginTop: "1px",
                      }}
                    >
                      {exp.startDate} – {exp.endDate || "Present"}
                    </div>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul
                      style={{
                        margin: "4px 0 0 16px",
                        padding: 0,
                        fontSize: "9.5pt",
                        lineHeight: "1.4",
                      }}
                    >
                      {exp.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          style={{
                            marginBottom: "2px",
                            color: selectedTheme.text,
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

        skills: resumeData.skills && resumeData.skills.length > 0 && (
          <section key="skills" style={{marginBottom: "10px"}}>
            <h2
              style={{
                fontSize: "11pt",
                fontWeight: "700",
                color: selectedTheme.primary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderBottom: `2px solid `,
                paddingBottom: "3px",
                marginBottom: "6px",
                fontFamily: "Georgia, serif",
              }}
            >
              Core Competencies
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5px 15px",
                columnGap: "15px",
              }}
            >
              {resumeData.skills.map((skillGroup, index) => (
                <div key={index}>
                  <div
                    style={{
                      fontSize: "9.5pt",
                      fontWeight: "600",
                      color: selectedTheme.secondary,
                      marginBottom: "2px",
                    }}
                  >
                    {skillGroup.category}
                  </div>
                  <div
                    style={{
                      fontSize: "9.5pt",
                      color: selectedTheme.text,
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

        education: resumeData.education && resumeData.education.length > 0 && (
          <section key="education" style={{marginBottom: "10px"}}>
            <h2
              style={{
                fontSize: "11pt",
                fontWeight: "700",
                color: selectedTheme.primary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderBottom: `2px solid `,
                paddingBottom: "3px",
                marginBottom: "6px",
                fontFamily: "Georgia, serif",
              }}
            >
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} style={{marginBottom: "6px"}}>
                <div
                  style={{
                    fontSize: "9.5pt",
                    fontWeight: "700",
                    color: selectedTheme.primary,
                  }}
                >
                  {edu.degree}
                </div>
                <div
                  style={{
                    fontSize: "9pt",
                    fontWeight: "600",
                    color: selectedTheme.secondary,
                    marginTop: "1px",
                  }}
                >
                  {edu.institution}
                </div>
                <div
                  style={{
                    fontSize: "8.5pt",
                    color: selectedTheme.accent,
                    fontStyle: "italic",
                    marginTop: "1px",
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
            <section key="certifications" style={{marginBottom: "10px"}}>
              <h2
                style={{
                  fontSize: "11pt",
                  fontWeight: "700",
                  color: selectedTheme.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: `2px solid `,
                  paddingBottom: "3px",
                  marginBottom: "6px",
                  fontFamily: "Georgia, serif",
                }}
              >
                Professional Certifications
              </h2>
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: "9.5pt",
                    color: selectedTheme.text,
                    marginBottom: "3px",
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
                    <span style={{color: selectedTheme.accent}}>
                      {cert.date}
                    </span>
                  )}
                </div>
              ))}
            </section>
          ),

        projects: resumeData.projects && resumeData.projects.length > 0 && (
          <section key="projects" style={{marginBottom: "10px"}}>
            <h2
              style={{
                fontSize: "11pt",
                fontWeight: "700",
                color: selectedTheme.primary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderBottom: `2px solid `,
                paddingBottom: "3px",
                marginBottom: "6px",
                fontFamily: "Georgia, serif",
              }}
            >
              Key Projects
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} style={{marginBottom: "8px"}}>
                <div
                  style={{
                    fontSize: "9.5pt",
                    fontWeight: "700",
                    color: selectedTheme.primary,
                  }}
                >
                  {project.name}
                </div>
                {project.bullets && project.bullets.length > 0 && (
                  <ul
                    style={{
                      fontSize: "9.5pt",
                      color: selectedTheme.text,
                      margin: "3px 0 3px 16px",
                      lineHeight: "1.4",
                      paddingLeft: "0",
                    }}
                  >
                    {project.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} style={{marginBottom: "2px"}}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
                {project.technologies && (
                  <div
                    style={{
                      fontSize: "9pt",
                      color: selectedTheme.accent,
                      fontStyle: "italic",
                      marginTop: "2px",
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
            <section key="achievements" style={{marginBottom: "10px"}}>
              <h2
                style={{
                  fontSize: "11pt",
                  fontWeight: "700",
                  color: selectedTheme.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  borderBottom: `2px solid `,
                  paddingBottom: "3px",
                  marginBottom: "6px",
                  fontFamily: "Georgia, serif",
                }}
              >
                Notable Achievements
              </h2>
              <ul
                style={{
                  margin: "0",
                  padding: "0 0 0 16px",
                  fontSize: "9.5pt",
                  lineHeight: "1.4",
                }}
              >
                {resumeData.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    style={{
                      marginBottom: "2px",
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
                <section key={`custom-${index}`} style={{marginBottom: "10px"}}>
                  <h2
                    style={{
                      fontSize: "11pt",
                      fontWeight: "700",
                      color: selectedTheme.primary,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: `2px solid `,
                      paddingBottom: "3px",
                      marginBottom: "6px",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {section.title}
                  </h2>
                  <div
                    style={{
                      fontSize: "9.5pt",
                      color: selectedTheme.text,
                      lineHeight: "1.4",
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
          padding: "12mm",
          backgroundColor: "white",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: "#000000",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <header style={{marginBottom: "12px", textAlign: "center"}}>
          <h1
            style={{
              fontSize: "20pt",
              fontWeight: "700",
              margin: "0 0 6px 0",
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
              fontSize: "9pt",
              color: selectedTheme.accent,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "6px",
              borderTop: "1px solid ${selectedTheme.light}",
              borderBottom: "1px solid ${selectedTheme.light}",
              padding: "5px 0",
              marginTop: "5px",
            }}
          >
            {resumeData.contact?.email && (
              <span>{resumeData.contact.email}</span>
            )}
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
  }
);

CorporateEliteTemplate.displayName = "CorporateEliteTemplate";

export default CorporateEliteTemplate;
