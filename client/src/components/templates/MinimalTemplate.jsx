import {forwardRef, useRef, useEffect, useState} from "react";

/**
 * MinimalTemplate - Clean, minimalist resume template with maximum readability
 *
 * Features:
 * - Ultra-clean single-column layout
 * - Subtle color accents for visual organization
 * - Excellent whitespace and typography
 * - Optimized for ATS parsing
 * - Professional color themes (slate, indigo, rose, amber, emerald, neutral)
 * - Automatic page overflow detection
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.resumeData - Complete resume data object (same structure as ClassicTemplate)
 * @param {string} [props.resumeData.selectedTheme] - Color theme (slate, indigo, rose, amber, emerald, neutral)
 * @param {Function} [props.onPageUsageChange] - Callback for page overflow detection
 * @param {React.Ref} ref - Forwarded ref for PDF generation
 *
 * @example
 * <MinimalTemplate
 *   ref={templateRef}
 *   resumeData={{ name: "Sam Lee", contact: { email: "sam@example.com" }, selectedTheme: "neutral" }}
 * />
 */
const MinimalTemplate = forwardRef(({resumeData, onPageUsageChange}, ref) => {
  // Page overflow detection state
  const containerRef = useRef(null);
  const [pageOverflowInfo, setPageOverflowInfo] = useState({
    isOverflowing: false,
    currentHeight: 0,
    maxHeight: 1056, // Standard A4 page height at 96 DPI (11 inches * 96)
    overflowPercentage: 0,
    templateName: "MinimalTemplate",
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
        templateName: "MinimalTemplate",
      };

      setPageOverflowInfo(usageInfo);

      // Pass data to parent component if callback provided
      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData]); // Don't include onPageUsageChange to prevent infinite loops

  // Color Themes - Professional ATS-friendly palettes
  const colorThemes = {
    charcoal: {
      primary: "#2c3e50", // Professional charcoal
      secondary: "#34495e",
      text: "#1a1a1a",
      textLight: "#4a5568",
      textMuted: "#6b7280",
      border: "#e2e8f0",
      linkColor: "#2c3e50",
    },
    navy: {
      primary: "#1e3a8a", // Deep navy blue
      secondary: "#1e40af",
      text: "#1a1a1a",
      textLight: "#374151",
      textMuted: "#6b7280",
      border: "#e2e8f0",
      linkColor: "#1e3a8a",
    },
    slate: {
      primary: "#334155", // Modern slate
      secondary: "#475569",
      text: "#0f172a",
      textLight: "#475569",
      textMuted: "#64748b",
      border: "#e2e8f0",
      linkColor: "#334155",
    },
    graphite: {
      primary: "#18181b", // Pure graphite
      secondary: "#27272a",
      text: "#09090b",
      textLight: "#3f3f46",
      textMuted: "#71717a",
      border: "#e4e4e7",
      linkColor: "#18181b",
    },
    burgundy: {
      primary: "#881337", // Professional burgundy
      secondary: "#9f1239",
      text: "#1a1a1a",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#e2e8f0",
      linkColor: "#881337",
    },
    forest: {
      primary: "#065f46", // Deep forest green
      secondary: "#047857",
      text: "#1a1a1a",
      textLight: "#374151",
      textMuted: "#6b7280",
      border: "#e2e8f0",
      linkColor: "#065f46",
    },
  };

  // Select theme based on resumeData or default to charcoal
  const selectedTheme =
    colorThemes[resumeData?.colorTheme] || colorThemes.charcoal;

  // Calculate content density to determine styling mode
  const calculateContentDensity = () => {
    let contentScore = 0;

    // Count experience items and bullets
    if (resumeData.experience?.length) {
      contentScore += resumeData.experience.length * 3;
      resumeData.experience.forEach((exp) => {
        contentScore += (exp.bullets?.length || 0) * 1;
      });
    }

    // Count projects and bullets
    if (resumeData.projects?.length) {
      contentScore += resumeData.projects.length * 2;
      resumeData.projects.forEach((proj) => {
        contentScore += (proj.bullets?.length || 0) * 1;
      });
    }

    // Count education items
    contentScore += (resumeData.education?.length || 0) * 2;

    // Count skills
    contentScore += (resumeData.skills?.length || 0) * 1.5;

    // Count certifications
    contentScore += (resumeData.certifications?.length || 0) * 1;

    // Count achievements
    contentScore += (resumeData.achievements?.length || 0) * 1;

    // Count custom sections
    if (resumeData.customSections?.length) {
      resumeData.customSections.forEach((section) => {
        contentScore += (section.items?.length || 0) * 1;
      });
    }

    // Summary adds to content
    if (resumeData.summary) {
      contentScore += resumeData.summary.length > 300 ? 3 : 2;
    }

    // Determine density: low (<15), medium (15-30), high (>30)
    if (contentScore < 15) return "low";
    if (contentScore < 30) return "medium";
    return "high";
  };

  const contentDensity = calculateContentDensity();

  // Dynamic styling based on content density
  const getDynamicStyles = () => {
    switch (contentDensity) {
      case "low":
        return {
          containerPadding: "0.6in",
          fontSize: "10.5pt",
          lineHeight: "1.4",
          headerMarginBottom: "20px",
          nameSize: "32pt",
          nameMarginBottom: "4px",
          contactSize: "10pt",
          contactGap: "12px",
          sectionMarginBottom: "16px",
          sectionHeadingSize: "13pt",
          sectionHeadingMarginBottom: "8px",
          summarySize: "10.5pt",
          summaryLineHeight: "1.5",
          experienceMarginBottom: "12px",
          experienceItemMarginBottom: "2px",
          experienceTitleSize: "11pt",
          experienceDateSize: "9pt",
          experienceDateMarginBottom: "4px",
          experienceBulletSize: "10pt",
          experienceBulletMarginBottom: "3px",
          projectMarginBottom: "10px",
          projectTitleSize: "11pt",
          projectTechSize: "9pt",
          projectLinkSize: "9pt",
          projectBulletSize: "10pt",
          projectBulletMarginBottom: "3px",
          educationMarginBottom: "8px",
          educationItemMarginBottom: "2px",
          educationDegreeSize: "11pt",
          educationInstitutionSize: "10pt",
          educationDateSize: "9pt",
          skillsSize: "10pt",
          skillsMarginBottom: "5px",
          certificationSize: "10pt",
          certificationMarginBottom: "4px",
          certificationDateSize: "9pt",
          achievementSize: "10pt",
          achievementMarginBottom: "3px",
        };
      case "medium":
        return {
          containerPadding: "0.5in 0.55in",
          fontSize: "10pt",
          lineHeight: "1.35",
          headerMarginBottom: "16px",
          nameSize: "28pt",
          nameMarginBottom: "3px",
          contactSize: "9.5pt",
          contactGap: "10px",
          sectionMarginBottom: "13px",
          sectionHeadingSize: "12pt",
          sectionHeadingMarginBottom: "7px",
          summarySize: "10pt",
          summaryLineHeight: "1.45",
          experienceMarginBottom: "10px",
          experienceItemMarginBottom: "2px",
          experienceTitleSize: "10.5pt",
          experienceDateSize: "8.5pt",
          experienceDateMarginBottom: "3px",
          experienceBulletSize: "9.5pt",
          experienceBulletMarginBottom: "2px",
          projectMarginBottom: "8px",
          projectTitleSize: "10.5pt",
          projectTechSize: "8.5pt",
          projectLinkSize: "8.5pt",
          projectBulletSize: "9.5pt",
          projectBulletMarginBottom: "2px",
          educationMarginBottom: "7px",
          educationItemMarginBottom: "2px",
          educationDegreeSize: "10.5pt",
          educationInstitutionSize: "9.5pt",
          educationDateSize: "8.5pt",
          skillsSize: "9.5pt",
          skillsMarginBottom: "4px",
          certificationSize: "9.5pt",
          certificationMarginBottom: "3px",
          certificationDateSize: "8.5pt",
          achievementSize: "9.5pt",
          achievementMarginBottom: "2px",
        };
      case "high":
      default:
        return {
          containerPadding: "0.45in 0.5in",
          fontSize: "9.5pt",
          lineHeight: "1.3",
          headerMarginBottom: "12px",
          nameSize: "26pt",
          nameMarginBottom: "3px",
          contactSize: "9pt",
          contactGap: "8px",
          sectionMarginBottom: "10px",
          sectionHeadingSize: "11pt",
          sectionHeadingMarginBottom: "6px",
          summarySize: "9.5pt",
          summaryLineHeight: "1.4",
          experienceMarginBottom: "8px",
          experienceItemMarginBottom: "2px",
          experienceTitleSize: "10pt",
          experienceDateSize: "8pt",
          experienceDateMarginBottom: "3px",
          experienceBulletSize: "9pt",
          experienceBulletMarginBottom: "1.5px",
          projectMarginBottom: "7px",
          projectTitleSize: "10pt",
          projectTechSize: "8pt",
          projectLinkSize: "8pt",
          projectBulletSize: "9pt",
          projectBulletMarginBottom: "1.5px",
          educationMarginBottom: "6px",
          educationItemMarginBottom: "2px",
          educationDegreeSize: "10pt",
          educationInstitutionSize: "9pt",
          educationDateSize: "8pt",
          skillsSize: "9pt",
          skillsMarginBottom: "3px",
          certificationSize: "9pt",
          certificationMarginBottom: "3px",
          certificationDateSize: "8pt",
          achievementSize: "9pt",
          achievementMarginBottom: "2px",
        };
    }
  };

  const dynamicStyles = getDynamicStyles();

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
    "experience",
    "projects",
    "education",
    "skills",
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
      summary: "",
      experience: "EXPERIENCE",
      projects: "PROJECTS",
      education: "EDUCATION",
      skills: "SKILLS",
      certifications: "CERTIFICATIONS",
      achievements: "ACHIEVEMENTS",
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
        <section
          key="summary"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <p
            style={{
              fontSize: dynamicStyles.summarySize,
              lineHeight: dynamicStyles.summaryLineHeight,
              textAlign: "justify",
              color: selectedTheme.text,
            }}
          >
            {resumeData.summary}
          </p>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section
          key="experience"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <h2
            className="font-bold"
            style={{
              fontSize: dynamicStyles.sectionHeadingSize,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              letterSpacing: "1px",
              color: selectedTheme.primary,
            }}
          >
            {getSectionTitle("experience")}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.experienceMarginBottom}}
            >
              <div
                style={{marginBottom: dynamicStyles.experienceItemMarginBottom}}
              >
                <span
                  className="font-bold"
                  style={{
                    fontSize: dynamicStyles.experienceTitleSize,
                    color: selectedTheme.text,
                  }}
                >
                  {exp.title || "Position"}
                </span>
                {exp.company && (
                  <span
                    style={{
                      fontSize: dynamicStyles.experienceTitleSize,
                      color: selectedTheme.text,
                    }}
                  >
                    {" "}
                    — {exp.company}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: dynamicStyles.experienceDateSize,
                  color: selectedTheme.textMuted,
                  marginBottom: dynamicStyles.experienceDateMarginBottom,
                }}
              >
                {exp.location && <span>{exp.location} | </span>}
                {exp.startDate && (
                  <span>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                )}
              </div>

              {/* Experience Description/Bullets */}
              {exp.description && (
                <p
                  style={{
                    fontSize: dynamicStyles.experienceBulletSize,
                    marginTop: "4px",
                    marginBottom: dynamicStyles.experienceBulletMarginBottom,
                    color: selectedTheme.text,
                  }}
                >
                  {exp.description}
                </p>
              )}

              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{marginTop: "4px", marginLeft: "20px"}}>
                  {exp.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: dynamicStyles.experienceBulletSize,
                        marginBottom:
                          dynamicStyles.experienceBulletMarginBottom,
                        color: selectedTheme.text,
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <ul style={{marginTop: "4px", marginLeft: "20px"}}>
                  {exp.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: dynamicStyles.experienceBulletSize,
                        marginBottom:
                          dynamicStyles.experienceBulletMarginBottom,
                        color: selectedTheme.text,
                      }}
                    >
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
        <section
          key="projects"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <h2
            className="font-bold"
            style={{
              fontSize: dynamicStyles.sectionHeadingSize,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              letterSpacing: "1px",
              color: selectedTheme.primary,
            }}
          >
            {getSectionTitle("projects")}
          </h2>
          {resumeData.projects.map((project, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.projectMarginBottom}}
            >
              <div
                style={{
                  marginBottom: dynamicStyles.experienceItemMarginBottom,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: dynamicStyles.projectTitleSize,
                      color: selectedTheme.text,
                    }}
                  >
                    {project.name}
                  </span>
                  {project.technologies && (
                    <span
                      style={{
                        fontSize: dynamicStyles.projectTechSize,
                        color: selectedTheme.textMuted,
                      }}
                    >
                      {" "}
                      —{" "}
                      {Array.isArray(project.technologies)
                        ? project.technologies.join(", ")
                        : project.technologies}
                    </span>
                  )}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: dynamicStyles.projectLinkSize,
                      color: selectedTheme.linkColor,
                      textDecoration: "underline",
                      marginLeft: "8px",
                    }}
                  >
                    🔗 Link
                  </a>
                )}
              </div>

              {/* Project Description */}
              {project.description && (
                <p
                  style={{
                    fontSize: dynamicStyles.projectBulletSize,
                    marginTop: "4px",
                    marginBottom: dynamicStyles.projectBulletMarginBottom,
                    color: selectedTheme.text,
                  }}
                >
                  {project.description}
                </p>
              )}

              {project.bullets && project.bullets.length > 0 && (
                <ul style={{marginTop: "4px", marginLeft: "20px"}}>
                  {project.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: dynamicStyles.projectBulletSize,
                        marginBottom: dynamicStyles.projectBulletMarginBottom,
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

      education: resumeData.education && resumeData.education.length > 0 && (
        <section
          key="education"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <h2
            className="font-bold"
            style={{
              fontSize: dynamicStyles.sectionHeadingSize,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              letterSpacing: "1px",
              color: selectedTheme.primary,
            }}
          >
            {getSectionTitle("education")}
          </h2>
          {resumeData.education.map((edu, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.educationMarginBottom}}
            >
              <div
                style={{marginBottom: dynamicStyles.educationItemMarginBottom}}
              >
                <span
                  className="font-bold"
                  style={{
                    fontSize: dynamicStyles.educationDegreeSize,
                    color: selectedTheme.text,
                  }}
                >
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </span>
              </div>
              <div
                style={{
                  fontSize: dynamicStyles.educationInstitutionSize,
                  color: selectedTheme.textLight,
                }}
              >
                {edu.institution}
                {edu.location && <span> — {edu.location}</span>}
              </div>
              <div
                style={{
                  fontSize: dynamicStyles.educationDateSize,
                  color: selectedTheme.textMuted,
                }}
              >
                {edu.startDate && (
                  <span>
                    {edu.startDate} - {edu.endDate}
                  </span>
                )}
                {edu.gpa && <span> | GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section
          key="skills"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <h2
            className="font-bold"
            style={{
              fontSize: dynamicStyles.sectionHeadingSize,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              letterSpacing: "1px",
              color: selectedTheme.primary,
            }}
          >
            {getSectionTitle("skills")}
          </h2>
          {resumeData.skills.map((skillGroup, index) => (
            <div
              key={index}
              style={{
                fontSize: dynamicStyles.skillsSize,
                marginBottom: dynamicStyles.skillsMarginBottom,
              }}
            >
              <span
                className="font-semibold"
                style={{color: selectedTheme.text}}
              >
                {skillGroup.category}:
              </span>{" "}
              <span style={{color: selectedTheme.textLight}}>
                {formatSkills(skillGroup.items)}
              </span>
            </div>
          ))}
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section
            key="certifications"
            style={{marginBottom: dynamicStyles.sectionMarginBottom}}
          >
            <h2
              className="font-bold"
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                letterSpacing: "1px",
                color: selectedTheme.primary,
              }}
            >
              {getSectionTitle("certifications")}
            </h2>
            {resumeData.certifications.map((cert, index) => (
              <div
                key={index}
                style={{
                  fontSize: dynamicStyles.certificationSize,
                  marginBottom: dynamicStyles.certificationMarginBottom,
                }}
              >
                <span
                  className="font-semibold"
                  style={{color: selectedTheme.text}}
                >
                  {cert.name}
                </span>
                {cert.issuer && (
                  <span style={{color: selectedTheme.textLight}}>
                    {" "}
                    — {cert.issuer}
                  </span>
                )}
                {cert.date && (
                  <span
                    style={{
                      fontSize: dynamicStyles.certificationDateSize,
                      color: selectedTheme.textMuted,
                    }}
                  >
                    {" "}
                    ({cert.date})
                  </span>
                )}
              </div>
            ))}
          </section>
        ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section
            key="achievements"
            style={{marginBottom: dynamicStyles.sectionMarginBottom}}
          >
            <h2
              className="font-bold"
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                letterSpacing: "1px",
                color: selectedTheme.primary,
              }}
            >
              {getSectionTitle("achievements")}
            </h2>
            <ul
              className="list-disc list-outside ml-5"
              style={{marginTop: "4px"}}
            >
              {resumeData.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: dynamicStyles.achievementSize,
                    marginBottom: dynamicStyles.achievementMarginBottom,
                    color: selectedTheme.text,
                  }}
                >
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
                  <section
                    key={sectionIndex}
                    style={{marginBottom: dynamicStyles.sectionMarginBottom}}
                  >
                    <h2
                      className="font-bold"
                      style={{
                        fontSize: dynamicStyles.sectionHeadingSize,
                        marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                        letterSpacing: "1px",
                        color: selectedTheme.primary,
                      }}
                    >
                      {section.title.toUpperCase()}
                    </h2>
                    <ul
                      className="list-disc list-outside ml-5"
                      style={{marginTop: "4px"}}
                    >
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          style={{
                            fontSize: dynamicStyles.achievementSize,
                            marginBottom: dynamicStyles.achievementMarginBottom,
                            color: selectedTheme.text,
                          }}
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
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className="resume-preview !bg-white !text-black shadow-lg border border-gray-300 font-resume"
      style={{
        minHeight: "11in",
        padding: dynamicStyles.containerPadding,
        fontSize: dynamicStyles.fontSize,
        lineHeight: dynamicStyles.lineHeight,
        color: selectedTheme.text,
      }}
    >
      {/* Header - Minimal Clean Style */}
      <header style={{marginBottom: dynamicStyles.headerMarginBottom}}>
        <h1
          className="font-bold"
          style={{
            fontSize: dynamicStyles.nameSize,
            marginBottom: dynamicStyles.nameMarginBottom,
            letterSpacing: "-0.5px",
            color: selectedTheme.primary,
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>
        <div
          style={{
            fontSize: dynamicStyles.contactSize,
            color: selectedTheme.textLight,
            display: "flex",
            flexWrap: "wrap",
            gap: dynamicStyles.contactGap,
          }}
        >
          {resumeData.contact?.email && <span>{resumeData.contact.email}</span>}
          {resumeData.contact?.phone && <span>{resumeData.contact.phone}</span>}
          {resumeData.contact?.location && (
            <span>{resumeData.contact.location}</span>
          )}
          {resumeData.contact?.linkedin && (
            <a
              href={resumeData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: selectedTheme.linkColor,
                textDecoration: "underline",
              }}
            >
              LinkedIn
            </a>
          )}
          {resumeData.contact?.github && (
            <a
              href={resumeData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: selectedTheme.linkColor,
                textDecoration: "underline",
              }}
            >
              GitHub
            </a>
          )}
        </div>
      </header>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

MinimalTemplate.displayName = "MinimalTemplate";

export default MinimalTemplate;
