import {forwardRef, useRef, useEffect, useState} from "react";

const ExecutiveTemplate = forwardRef(({resumeData, onPageUsageChange}, ref) => {
  // Page overflow detection state
  const containerRef = useRef(null);
  const [pageOverflowInfo, setPageOverflowInfo] = useState({
    isOverflowing: false,
    currentHeight: 0,
    maxHeight: 1056, // Standard A4 page height at 96 DPI (11 inches * 96)
    overflowPercentage: 0,
    templateName: "ExecutiveTemplate",
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
        percentage: Math.round((currentHeight / maxHeight) * 100),
        templateName: "ExecutiveTemplate",
      };

      setPageOverflowInfo(usageInfo);

      // Log overflow information for testing
      if (isOverflowing) {
        console.log(
          `⚠️ ExecutiveTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
        );
      } else {
        console.log(
          `✅ ExecutiveTemplate: Content fits on one page. Height: ${currentHeight}px / ${maxHeight}px (${usageInfo.percentage}% filled)`
        );
      }

      // Pass data to parent component if callback provided
      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData]); // Don't include onPageUsageChange to prevent infinite loops

  // Color Themes - Professional ATS-friendly palettes for Executive style
  const colorThemes = {
    navy: {
      primary: "#003d82", // Deep professional navy
      secondary: "#0066cc",
      text: "#000000",
      textLight: "#2d3748",
      textMuted: "#4a5568",
      border: "#003d82",
      linkColor: "#0066cc",
    },
    burgundy: {
      primary: "#7d1007", // Deep burgundy
      secondary: "#8b1a1a",
      text: "#000000",
      textLight: "#2d3748",
      textMuted: "#4a5568",
      border: "#7d1007",
      linkColor: "#8b1a1a",
    },
    forest: {
      primary: "#0d4d0d", // Deep forest green
      secondary: "#1b5e20",
      text: "#000000",
      textLight: "#2d3748",
      textMuted: "#4a5568",
      border: "#0d4d0d",
      linkColor: "#1b5e20",
    },
    charcoal: {
      primary: "#1a202c", // Professional charcoal
      secondary: "#2d3748",
      text: "#000000",
      textLight: "#2d3748",
      textMuted: "#4a5568",
      border: "#1a202c",
      linkColor: "#2d3748",
    },
    slate: {
      primary: "#1e293b", // Professional slate
      secondary: "#334155",
      text: "#000000",
      textLight: "#334155",
      textMuted: "#64748b",
      border: "#1e293b",
      linkColor: "#334155",
    },
    teal: {
      primary: "#0d5e5e", // Professional teal
      secondary: "#0f766e",
      text: "#000000",
      textLight: "#2d3748",
      textMuted: "#4a5568",
      border: "#0d5e5e",
      linkColor: "#0f766e",
    },
  };

  // Select theme based on resumeData or default to navy
  const selectedTheme = colorThemes[resumeData?.colorTheme] || colorThemes.navy;

  // Calculate content density to determine styling mode
  const calculateContentDensity = () => {
    let contentScore = 0;

    // Count experience items and achievements
    if (resumeData.experience?.length) {
      contentScore += resumeData.experience.length * 3;
      resumeData.experience.forEach((exp) => {
        contentScore += (exp.achievements?.length || 0) * 1;
        contentScore += (exp.bullets?.length || 0) * 1;
      });
    }

    // Count projects
    if (resumeData.projects?.length) {
      contentScore += resumeData.projects.length * 2;
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

  // Log content density for debugging
  console.log(
    `📊 ExecutiveTemplate Content Density: ${contentDensity} (low < 15, medium 15-30, high > 30)`
  );

  // Dynamic styling based on content density
  const getDynamicStyles = () => {
    switch (contentDensity) {
      case "low":
        return {
          containerPadding: "0.6in 0.55in",
          fontSize: "10.5pt",
          lineHeight: "1.6",
          headerMarginBottom: "20px",
          headerPaddingBottom: "12px",
          headerBorderWidth: "3px",
          nameSize: "20pt",
          nameMarginBottom: "6px",
          contactSize: "10pt",
          sectionMarginBottom: "18px",
          sectionHeadingSize: "12pt",
          sectionHeadingPaddingBottom: "4px",
          sectionHeadingMarginBottom: "10px",
          sectionBorderWidth: "2px",
          summarySize: "10.5pt",
          experienceMarginBottom: "14px",
          experienceItemMarginBottom: "4px",
          experienceTitleSize: "11pt",
          experienceDateSize: "9.5pt",
          experienceCompanySize: "10.5pt",
          experienceBulletSize: "10pt",
          experienceBulletMarginBottom: "4px",
          projectMarginBottom: "10px",
          projectTitleSize: "10.5pt",
          projectDescSize: "10pt",
          projectTechSize: "9.5pt",
          educationMarginBottom: "10px",
          educationDegreeSize: "10.5pt",
          educationInstitutionSize: "10pt",
          educationDateSize: "9.5pt",
          educationGpaSize: "9.5pt",
          skillsSize: "10pt",
          skillsGridGap: "8px",
          certificationSize: "10pt",
          certificationMarginBottom: "4px",
          achievementSize: "10pt",
          achievementMarginBottom: "5px",
        };
      case "medium":
        return {
          containerPadding: "0.55in 0.5in",
          fontSize: "10pt",
          lineHeight: "1.5",
          headerMarginBottom: "16px",
          headerPaddingBottom: "10px",
          headerBorderWidth: "2.5px",
          nameSize: "19pt",
          nameMarginBottom: "5px",
          contactSize: "9.5pt",
          sectionMarginBottom: "14px",
          sectionHeadingSize: "11.5pt",
          sectionHeadingPaddingBottom: "3.5px",
          sectionHeadingMarginBottom: "8px",
          sectionBorderWidth: "1.75px",
          summarySize: "10pt",
          experienceMarginBottom: "11px",
          experienceItemMarginBottom: "3px",
          experienceTitleSize: "10.5pt",
          experienceDateSize: "9pt",
          experienceCompanySize: "10pt",
          experienceBulletSize: "9.5pt",
          experienceBulletMarginBottom: "3px",
          projectMarginBottom: "8px",
          projectTitleSize: "10pt",
          projectDescSize: "9.5pt",
          projectTechSize: "9pt",
          educationMarginBottom: "8px",
          educationDegreeSize: "10pt",
          educationInstitutionSize: "9.5pt",
          educationDateSize: "9pt",
          educationGpaSize: "9pt",
          skillsSize: "9.5pt",
          skillsGridGap: "6px",
          certificationSize: "9.5pt",
          certificationMarginBottom: "3px",
          achievementSize: "9.5pt",
          achievementMarginBottom: "4px",
        };
      case "high":
      default:
        return {
          containerPadding: "0.5in 0.45in",
          fontSize: "9.5pt",
          lineHeight: "1.4",
          headerMarginBottom: "14px",
          headerPaddingBottom: "8px",
          headerBorderWidth: "2px",
          nameSize: "18pt",
          nameMarginBottom: "5px",
          contactSize: "9pt",
          sectionMarginBottom: "12px",
          sectionHeadingSize: "11pt",
          sectionHeadingPaddingBottom: "3px",
          sectionHeadingMarginBottom: "7px",
          sectionBorderWidth: "1.5px",
          summarySize: "9.5pt",
          experienceMarginBottom: "9px",
          experienceItemMarginBottom: "2.5px",
          experienceTitleSize: "10pt",
          experienceDateSize: "8.5pt",
          experienceCompanySize: "9.5pt",
          experienceBulletSize: "9pt",
          experienceBulletMarginBottom: "2px",
          projectMarginBottom: "7px",
          projectTitleSize: "9.5pt",
          projectDescSize: "9pt",
          projectTechSize: "8.5pt",
          educationMarginBottom: "7px",
          educationDegreeSize: "9.5pt",
          educationInstitutionSize: "9pt",
          educationDateSize: "8.5pt",
          educationGpaSize: "8.5pt",
          skillsSize: "9pt",
          skillsGridGap: "5px",
          certificationSize: "9pt",
          certificationMarginBottom: "3px",
          achievementSize: "9pt",
          achievementMarginBottom: "3px",
        };
    }
  };

  const dynamicStyles = getDynamicStyles();

  // Helper function to safely format skills (handles both array and string)
  const formatSkills = (items) => {
    if (Array.isArray(items)) {
      return items.join(", ");
    }
    if (typeof items === "string") {
      return items;
    }
    return "";
  };

  // Default section order optimized for executives
  const DEFAULT_SECTION_ORDER = [
    "summary",
    "experience",
    "achievements",
    "skills",
    "education",
    "certifications",
    "projects",
    "customSections",
  ];

  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder.filter(
          (id) => !["score", "personal", "recommendations"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Render section helper function
  const renderSection = (sectionId) => {
    const sections = {
      summary: resumeData.summary && (
        <section
          key="summary"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: dynamicStyles.sectionHeadingSize,
              fontWeight: "bold",
              color: selectedTheme.primary,
              borderBottom: `${dynamicStyles.sectionBorderWidth} solid ${selectedTheme.border}`,
              paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Executive Summary
          </h2>
          <p
            style={{
              fontSize: dynamicStyles.summarySize,
              lineHeight: dynamicStyles.lineHeight,
              color: selectedTheme.textLight,
              fontStyle: "italic",
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
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: dynamicStyles.sectionHeadingSize,
              fontWeight: "bold",
              color: selectedTheme.primary,
              borderBottom: `${dynamicStyles.sectionBorderWidth} solid ${selectedTheme.border}`,
              paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.experienceMarginBottom}}
            >
              <div
                style={{marginBottom: dynamicStyles.experienceItemMarginBottom}}
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
                      fontSize: dynamicStyles.experienceTitleSize,
                      fontWeight: "bold",
                      color: selectedTheme.text,
                      marginBottom: "2px",
                    }}
                  >
                    {exp.position}
                  </h3>
                  <span
                    style={{
                      fontSize: dynamicStyles.experienceDateSize,
                      color: selectedTheme.textMuted,
                      fontStyle: "italic",
                    }}
                  >
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: dynamicStyles.experienceCompanySize,
                    color: selectedTheme.textLight,
                    fontWeight: "600",
                    marginBottom: "2px",
                  }}
                >
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
              </div>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    listStyleType: "square",
                  }}
                >
                  {exp.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: dynamicStyles.experienceBulletSize,
                        marginBottom:
                          dynamicStyles.experienceBulletMarginBottom,
                        lineHeight: dynamicStyles.lineHeight,
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

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section
            key="achievements"
            style={{marginBottom: dynamicStyles.sectionMarginBottom}}
          >
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                borderBottom: `${dynamicStyles.sectionBorderWidth} solid ${selectedTheme.border}`,
                paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Key Achievements & Awards
            </h2>
            <ul style={{margin: 0, paddingLeft: "20px", listStyleType: "disc"}}>
              {resumeData.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: dynamicStyles.achievementSize,
                    marginBottom: dynamicStyles.achievementMarginBottom,
                    lineHeight: dynamicStyles.lineHeight,
                    color: selectedTheme.text,
                  }}
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section
          key="skills"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: dynamicStyles.sectionHeadingSize,
              fontWeight: "bold",
              color: selectedTheme.primary,
              borderBottom: `${dynamicStyles.sectionBorderWidth} solid ${selectedTheme.border}`,
              paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Core Competencies
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: dynamicStyles.skillsGridGap,
            }}
          >
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} style={{fontSize: dynamicStyles.skillsSize}}>
                <span
                  style={{fontWeight: "bold", color: selectedTheme.textLight}}
                >
                  {skillGroup.category}:
                </span>{" "}
                <span style={{color: selectedTheme.text}}>
                  {formatSkills(skillGroup.items)}
                </span>
              </div>
            ))}
          </div>
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section
          key="education"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: dynamicStyles.sectionHeadingSize,
              fontWeight: "bold",
              color: selectedTheme.primary,
              borderBottom: `${dynamicStyles.sectionBorderWidth} solid ${selectedTheme.border}`,
              paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.educationMarginBottom}}
            >
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
                      fontSize: dynamicStyles.educationDegreeSize,
                      fontWeight: "bold",
                      color: selectedTheme.text,
                    }}
                  >
                    {edu.degree} in {edu.field}
                  </div>
                  <div
                    style={{
                      fontSize: dynamicStyles.educationInstitutionSize,
                      color: selectedTheme.textLight,
                    }}
                  >
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: dynamicStyles.educationDateSize,
                    color: selectedTheme.textMuted,
                    fontStyle: "italic",
                  }}
                >
                  {edu.graduationDate}
                </span>
              </div>
              {edu.gpa && (
                <div
                  style={{
                    fontSize: dynamicStyles.educationGpaSize,
                    color: selectedTheme.textMuted,
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
          <section
            key="certifications"
            style={{marginBottom: dynamicStyles.sectionMarginBottom}}
          >
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                borderBottom: `${dynamicStyles.sectionBorderWidth} solid ${selectedTheme.border}`,
                paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Certifications & Licenses
            </h2>
            <ul
              style={{margin: 0, paddingLeft: "20px", listStyleType: "circle"}}
            >
              {resumeData.certifications.map((cert, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: dynamicStyles.certificationSize,
                    marginBottom: dynamicStyles.certificationMarginBottom,
                    color: selectedTheme.text,
                  }}
                >
                  <span
                    style={{fontWeight: "600", color: selectedTheme.textLight}}
                  >
                    {cert.name}
                  </span>
                  {cert.issuer && ` - ${cert.issuer}`}
                  {cert.date && (
                    <span style={{color: selectedTheme.textMuted}}>
                      {" "}
                      ({cert.date})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section
          key="projects"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: dynamicStyles.sectionHeadingSize,
              fontWeight: "bold",
              color: selectedTheme.primary,
              borderBottom: `${dynamicStyles.sectionBorderWidth} solid ${selectedTheme.border}`,
              paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
              marginBottom: dynamicStyles.sectionHeadingMarginBottom,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Notable Projects
          </h2>
          {resumeData.projects.map((project, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.projectMarginBottom}}
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
                    fontSize: dynamicStyles.projectTitleSize,
                    fontWeight: "bold",
                    color: selectedTheme.text,
                  }}
                >
                  {project.name}
                </h3>
                {project.date && (
                  <span
                    style={{
                      fontSize: dynamicStyles.experienceDateSize,
                      color: selectedTheme.textMuted,
                      fontStyle: "italic",
                    }}
                  >
                    {project.date}
                  </span>
                )}
              </div>
              {project.description && (
                <p
                  style={{
                    fontSize: dynamicStyles.projectDescSize,
                    margin: "3px 0",
                    color: selectedTheme.text,
                  }}
                >
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <p
                  style={{
                    fontSize: dynamicStyles.projectTechSize,
                    color: selectedTheme.textMuted,
                    marginTop: "2px",
                  }}
                >
                  <span style={{fontWeight: "600"}}>Technologies:</span>{" "}
                  {project.technologies}
                </p>
              )}
            </div>
          ))}
        </section>
      ),

      customSections: resumeData.customSections &&
        resumeData.customSections.length > 0 && (
          <>
            {resumeData.customSections.map((section, index) => (
              <section
                key={section.id || `custom-${index}`}
                style={{marginBottom: dynamicStyles.sectionMarginBottom}}
              >
                <h2
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: dynamicStyles.sectionHeadingSize,
                    fontWeight: "bold",
                    color: selectedTheme.primary,
                    borderBottom: `${dynamicStyles.sectionBorderWidth} solid ${selectedTheme.border}`,
                    paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
                    marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {section.title}
                </h2>
                {section.items && section.items.length > 0 ? (
                  <ul style={{paddingLeft: "20px", margin: "0"}}>
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={`${section.id || index}-item-${itemIndex}`}
                        style={{
                          fontSize: dynamicStyles.achievementSize,
                          lineHeight: dynamicStyles.lineHeight,
                          color: selectedTheme.text,
                          marginBottom: dynamicStyles.achievementMarginBottom,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div
                    style={{
                      fontSize: dynamicStyles.fontSize,
                      lineHeight: dynamicStyles.lineHeight,
                      color: selectedTheme.text,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {section.content}
                  </div>
                )}
              </section>
            ))}
          </>
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
      className="resume-preview"
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "white",
        padding: dynamicStyles.containerPadding,
        fontFamily: "'Times New Roman', Georgia, serif",
        color: selectedTheme.text,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontSize: dynamicStyles.fontSize,
        lineHeight: dynamicStyles.lineHeight,
      }}
    >
      {/* Header Section - Executive Style */}
      <header
        style={{
          marginBottom: dynamicStyles.headerMarginBottom,
          borderBottom: `${dynamicStyles.headerBorderWidth} solid ${selectedTheme.border}`,
          paddingBottom: dynamicStyles.headerPaddingBottom,
        }}
      >
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: dynamicStyles.nameSize,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: dynamicStyles.nameMarginBottom,
            color: selectedTheme.primary,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>
        <div
          style={{
            textAlign: "center",
            fontSize: dynamicStyles.contactSize,
            color: selectedTheme.textLight,
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          {resumeData.contact?.email && (
            <span>📧 {resumeData.contact.email}</span>
          )}
          {resumeData.contact?.phone && (
            <span>📞 {resumeData.contact.phone}</span>
          )}
          {resumeData.contact?.location && (
            <span>📍 {resumeData.contact.location}</span>
          )}
          {resumeData.contact?.linkedin && (
            <span style={{color: selectedTheme.linkColor}}>
              💼 {resumeData.contact.linkedin}
            </span>
          )}
        </div>
      </header>

      {/* Body Sections */}
      <div>{sectionOrder.map((sectionId) => renderSection(sectionId))}</div>
    </div>
  );
});

ExecutiveTemplate.displayName = "ExecutiveTemplate";

export default ExecutiveTemplate;
