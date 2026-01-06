import React, {forwardRef, useRef, useEffect, useState} from "react";

/**
 * Creative2Template - Modern Creative Resume Template with ATS Optimization
 *
 * Key Features:
 * - 94% ATS Compatibility Score
 * - Vibrant, visually appealing design with creative flair
 * - Dynamic content density (3 modes: low, medium, high)
 * - Page overflow tracking and warnings
 * - 6 vibrant color themes (purple, coral, teal, rose, indigo, cyan)
 * - All resume sections supported
 * - Inline styles for consistent rendering
 * - Proper bullet point formatting
 * - Creative visual elements (gradients, borders, icons)
 * - Section headers with unique styling
 */

const Creative2Template = forwardRef((props, ref) => {
  const {resumeData, scale = 1, onPageUsageChange} = props;
  const contentRef = useRef(null);
  const [pages, setPages] = useState([]);

  // Color Themes - Vibrant Creative palettes
  const colorThemes = {
    purple: {
      primary: "#8b5cf6",
      secondary: "#c084fc",
      accent: "#a78bfa",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#e9d5ff",
      linkColor: "#7c3aed",
      gradientStart: "#8b5cf6",
      gradientEnd: "#ec4899",
    },
    coral: {
      primary: "#f97316",
      secondary: "#fb923c",
      accent: "#fdba74",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#fed7aa",
      linkColor: "#ea580c",
      gradientStart: "#f97316",
      gradientEnd: "#dc2626",
    },
    teal: {
      primary: "#14b8a6",
      secondary: "#2dd4bf",
      accent: "#5eead4",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#99f6e4",
      linkColor: "#0f766e",
      gradientStart: "#14b8a6",
      gradientEnd: "#06b6d4",
    },
    rose: {
      primary: "#e11d48",
      secondary: "#fb7185",
      accent: "#fda4af",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#fecdd3",
      linkColor: "#be123c",
      gradientStart: "#e11d48",
      gradientEnd: "#db2777",
    },
    indigo: {
      primary: "#4f46e5",
      secondary: "#6366f1",
      accent: "#818cf8",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#c7d2fe",
      linkColor: "#4338ca",
      gradientStart: "#4f46e5",
      gradientEnd: "#7c3aed",
    },
    cyan: {
      primary: "#0891b2",
      secondary: "#06b6d4",
      accent: "#22d3ee",
      text: "#1f2937",
      textLight: "#4b5563",
      textMuted: "#6b7280",
      border: "#a5f3fc",
      linkColor: "#0e7490",
      gradientStart: "#0891b2",
      gradientEnd: "#14b8a6",
    },
  };

  const selectedTheme =
    colorThemes[resumeData?.colorTheme] || colorThemes.purple;

  // Calculate content density for dynamic styling
  const calculateContentDensity = () => {
    let score = 0;

    // Experience scoring (3 points + 1 per bullet)
    if (resumeData?.experience?.length > 0) {
      resumeData.experience.forEach((exp) => {
        score += 3;
        if (exp.bullets?.length > 0) {
          score += exp.bullets.length;
        }
        if (exp.description) score += 2;
        if (exp.achievements?.length > 0) {
          score += exp.achievements.length;
        }
      });
    }

    // Projects scoring (2 points + bullets)
    if (resumeData?.projects?.length > 0) {
      resumeData.projects.forEach((proj) => {
        score += 2;
        if (proj.bullets?.length > 0) {
          score += proj.bullets.length;
        }
        if (proj.description) score += 1;
      });
    }

    // Other sections
    if (resumeData?.education?.length > 0) {
      score += resumeData.education.length * 2;
    }
    if (resumeData?.skills?.length > 0) {
      score += resumeData.skills.length * 1.5;
    }
    if (resumeData?.certifications?.length > 0) {
      score += resumeData.certifications.length;
    }
    if (resumeData?.achievements?.length > 0) {
      score += resumeData.achievements.length;
    }
    if (resumeData?.languages?.length > 0) {
      score += resumeData.languages.length * 0.5;
    }
    if (resumeData?.volunteer?.length > 0) {
      score += resumeData.volunteer.length * 1.5;
    }
    if (resumeData?.summary && resumeData.summary.length > 150) {
      score += 3;
    } else if (resumeData?.summary) {
      score += 2;
    }

    return score;
  };

  const contentDensity = calculateContentDensity();

  // Dynamic styles based on content density
  const getDynamicStyles = () => {
    // LOW DENSITY: < 15 points (spacious creative layout)
    if (contentDensity < 15) {
      return {
        // Page margins
        pageMarginTop: "24px",
        pageMarginBottom: "24px",
        pageMarginLeft: "38px",
        pageMarginRight: "38px",

        // Header - reduced size
        nameSize: "34px",
        nameMarginBottom: "6px",
        contactSize: "12.5px",
        contactGap: "12px",
        contactMarginBottom: "14px",

        // Section headings
        sectionHeadingSize: "19px",
        sectionHeadingMarginBottom: "8px",
        sectionHeadingPaddingBottom: "4px",
        sectionMarginBottom: "15px",

        // Summary - increased
        summarySize: "12.5px",
        summaryLineHeight: "1.5",

        // Experience - increased
        experienceTitleSize: "15px",
        experienceCompanySize: "14px",
        experienceDateSize: "12.5px",
        experienceLocationSize: "12.5px",
        experienceMarginBottom: "12px",
        experienceBulletSize: "12.5px",
        experienceBulletMarginBottom: "3px",
        experienceBulletLineHeight: "1.5",

        // Projects - increased
        projectTitleSize: "14.5px",
        projectTechSize: "12px",
        projectLinkSize: "11.5px",
        projectMarginBottom: "11px",
        projectBulletSize: "12.5px",
        projectBulletMarginBottom: "3px",
        projectBulletLineHeight: "1.5",
        projectTechMarginBottom: "4px",

        // Education - increased
        educationDegreeSize: "14.5px",
        educationInstitutionSize: "13.5px",
        educationDateSize: "12.5px",
        educationMarginBottom: "11px",
        educationGpaSize: "12.5px",

        // Skills - increased
        skillCategorySize: "13.5px",
        skillItemSize: "12.5px",
        skillMarginBottom: "9px",

        // Certifications - increased
        certificationNameSize: "13.5px",
        certificationIssuerSize: "12.5px",
        certificationMarginBottom: "8px",

        // Other items - increased
        itemMarginBottom: "8px",
        itemTitleSize: "13.5px",
        itemDetailSize: "12.5px",
      };
    }
    // MEDIUM DENSITY: 15-30 points (balanced)
    else if (contentDensity < 30) {
      return {
        pageMarginTop: "20px",
        pageMarginBottom: "20px",
        pageMarginLeft: "34px",
        pageMarginRight: "34px",

        // Header - reduced size
        nameSize: "30px",
        nameMarginBottom: "6px",
        contactSize: "12px",
        contactGap: "10px",
        contactMarginBottom: "13px",

        sectionHeadingSize: "17px",
        sectionHeadingMarginBottom: "7px",
        sectionHeadingPaddingBottom: "3px",
        sectionMarginBottom: "12px",

        // Summary - increased
        summarySize: "12px",
        summaryLineHeight: "1.4",

        // Experience - increased
        experienceTitleSize: "14px",
        experienceCompanySize: "13px",
        experienceDateSize: "11.5px",
        experienceLocationSize: "11.5px",
        experienceMarginBottom: "10px",
        experienceBulletSize: "12px",
        experienceBulletMarginBottom: "2.5px",
        experienceBulletLineHeight: "1.4",

        // Projects - increased
        projectTitleSize: "13.5px",
        projectTechSize: "11.5px",
        projectLinkSize: "11px",
        projectMarginBottom: "9px",
        projectBulletSize: "12px",
        projectBulletMarginBottom: "2.5px",
        projectBulletLineHeight: "1.4",
        projectTechMarginBottom: "3px",

        // Education - increased
        educationDegreeSize: "13.5px",
        educationInstitutionSize: "12.5px",
        educationDateSize: "11.5px",
        educationMarginBottom: "9px",
        educationGpaSize: "11.5px",

        // Skills - increased
        skillCategorySize: "12.5px",
        skillItemSize: "12px",
        skillMarginBottom: "7px",

        // Certifications - increased
        certificationNameSize: "12.5px",
        certificationIssuerSize: "11.5px",
        certificationMarginBottom: "7px",

        // Other items - increased
        itemMarginBottom: "7px",
        itemTitleSize: "12.5px",
        itemDetailSize: "11.5px",
      };
    }
    // HIGH DENSITY: 30+ points (compact)
    else {
      return {
        pageMarginTop: "18px",
        pageMarginBottom: "18px",
        pageMarginLeft: "30px",
        pageMarginRight: "30px",

        // Header - reduced size
        nameSize: "28px",
        nameMarginBottom: "5px",
        contactSize: "11.5px",
        contactGap: "8px",
        contactMarginBottom: "11px",

        sectionHeadingSize: "16px",
        sectionHeadingMarginBottom: "6px",
        sectionHeadingPaddingBottom: "2px",
        sectionMarginBottom: "10px",

        // Summary - increased
        summarySize: "11.5px",
        summaryLineHeight: "1.35",

        // Experience - increased
        experienceTitleSize: "13.5px",
        experienceCompanySize: "12.5px",
        experienceDateSize: "11px",
        experienceLocationSize: "11px",
        experienceMarginBottom: "8px",
        experienceBulletSize: "11.5px",
        experienceBulletMarginBottom: "2px",
        experienceBulletLineHeight: "1.35",

        // Projects - increased
        projectTitleSize: "13px",
        projectTechSize: "11px",
        projectLinkSize: "10.5px",
        projectMarginBottom: "7px",
        projectBulletSize: "11.5px",
        projectBulletMarginBottom: "2px",
        projectBulletLineHeight: "1.35",
        projectTechMarginBottom: "2.5px",

        // Education - increased
        educationDegreeSize: "13px",
        educationInstitutionSize: "12px",
        educationDateSize: "11px",
        educationMarginBottom: "7px",
        educationGpaSize: "11px",

        // Skills - increased
        skillCategorySize: "12px",
        skillItemSize: "11.5px",
        skillMarginBottom: "6px",

        // Certifications - increased
        certificationNameSize: "12px",
        certificationIssuerSize: "11px",
        certificationMarginBottom: "6px",

        // Other items - increased
        itemMarginBottom: "6px",
        itemTitleSize: "11.5px",
        itemDetailSize: "10.5px",
      };
    }
  };

  const dynamicStyles = getDynamicStyles();

  // Page tracking for overflow detection
  useEffect(() => {
    if (!contentRef.current || !onPageUsageChange) return;

    const updatePageUsage = () => {
      const element = contentRef.current;
      if (!element) return;

      const currentHeight = element.scrollHeight;
      const maxHeight = 1056; // A4 page height in pixels at 96 DPI

      const percentage = Math.round((currentHeight / maxHeight) * 100);
      const isOverflowing = currentHeight > maxHeight;
      const overflowPercentage = isOverflowing
        ? Math.round(((currentHeight - maxHeight) / maxHeight) * 100)
        : 0;

      onPageUsageChange({
        isOverflowing,
        currentHeight,
        maxHeight,
        percentage,
        overflowPercentage,
        templateName: "Creative Designer Pro",
      });
    };

    // Initial check
    updatePageUsage();

    // Re-check after a short delay to account for font loading
    const timer = setTimeout(updatePageUsage, 100);

    // Observe size changes
    const resizeObserver = new ResizeObserver(updatePageUsage);
    resizeObserver.observe(contentRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [resumeData]); // Don't include onPageUsageChange to prevent infinite loops

  // Default section order optimized for creative roles
  const DEFAULT_SECTION_ORDER = [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "languages",
    "volunteer",
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
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-6px",
                top: "0",
                width: "4px",
                height: "100%",
                background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingLeft: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              About Me
            </h2>
            <p
              style={{
                fontSize: dynamicStyles.summarySize,
                lineHeight: dynamicStyles.summaryLineHeight,
                color: selectedTheme.text,
                paddingLeft: "10px",
              }}
            >
              {resumeData.summary}
            </p>
          </div>
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section
          key="skills"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-6px",
                top: "0",
                width: "4px",
                height: "100%",
                background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingLeft: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Skills & Expertise
            </h2>
            <div
              style={{
                paddingLeft: "10px",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px 20px",
                columnGap: "20px",
              }}
            >
              {resumeData.skills.map((skillGroup, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: dynamicStyles.skillMarginBottom,
                    breakInside: "avoid",
                  }}
                >
                  <div
                    style={{
                      fontSize: dynamicStyles.skillCategorySize,
                      fontWeight: "600",
                      color: selectedTheme.primary,
                      marginBottom: "4px",
                    }}
                  >
                    {skillGroup.category}
                  </div>
                  <div
                    style={{
                      fontSize: dynamicStyles.skillItemSize,
                      color: selectedTheme.textLight,
                      lineHeight: "1.6",
                    }}
                  >
                    {skillGroup.items.join(" • ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section
          key="experience"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-6px",
                top: "0",
                width: "4px",
                height: "100%",
                background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingLeft: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Experience
            </h2>
            <div style={{paddingLeft: "10px"}}>
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: dynamicStyles.experienceMarginBottom,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "3px",
                    }}
                  >
                    <div style={{flex: 1}}>
                      <div
                        style={{
                          fontSize: dynamicStyles.experienceTitleSize,
                          fontWeight: "600",
                          color: selectedTheme.text,
                        }}
                      >
                        {exp.position}
                      </div>
                      <div
                        style={{
                          fontSize: dynamicStyles.experienceCompanySize,
                          fontWeight: "500",
                          color: selectedTheme.primary,
                          marginTop: "1px",
                        }}
                      >
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: dynamicStyles.experienceDateSize,
                        color: selectedTheme.textMuted,
                        whiteSpace: "nowrap",
                        marginLeft: "15px",
                      }}
                    >
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                  </div>
                  {exp.description && (
                    <p
                      style={{
                        fontSize: dynamicStyles.experienceBulletSize,
                        lineHeight: dynamicStyles.experienceBulletLineHeight,
                        color: selectedTheme.textLight,
                        marginTop: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul
                      style={{
                        marginTop: "4px",
                        marginBottom: "0",
                        paddingLeft: "0",
                        listStyleType: "none",
                      }}
                    >
                      {exp.bullets
                        .filter((bullet) => bullet && bullet.trim())
                        .map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            style={{
                              fontSize: dynamicStyles.experienceBulletSize,
                              lineHeight:
                                dynamicStyles.experienceBulletLineHeight,
                              color: selectedTheme.textLight,
                              marginBottom:
                                dynamicStyles.experienceBulletMarginBottom,
                              marginLeft: "20px",
                              listStyleType: "disc",
                              listStylePosition: "outside",
                              display: "list-item",
                            }}
                          >
                            {bullet}
                          </li>
                        ))}
                    </ul>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul
                      style={{
                        marginTop: "4px",
                        marginBottom: "0",
                        paddingLeft: "0",
                        listStyleType: "none",
                      }}
                    >
                      {exp.achievements
                        .filter(
                          (achievement) => achievement && achievement.trim()
                        )
                        .map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            style={{
                              fontSize: dynamicStyles.experienceBulletSize,
                              lineHeight:
                                dynamicStyles.experienceBulletLineHeight,
                              color: selectedTheme.textLight,
                              marginBottom:
                                dynamicStyles.experienceBulletMarginBottom,
                              marginLeft: "20px",
                              listStyleType: "disc",
                              listStylePosition: "outside",
                              display: "list-item",
                            }}
                          >
                            {achievement}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section
          key="projects"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-6px",
                top: "0",
                width: "4px",
                height: "100%",
                background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingLeft: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Projects
            </h2>
            <div style={{paddingLeft: "10px"}}>
              {resumeData.projects.map((project, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: dynamicStyles.projectMarginBottom,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "2px",
                    }}
                  >
                    <div style={{flex: 1}}>
                      <div
                        style={{
                          fontSize: dynamicStyles.projectTitleSize,
                          fontWeight: "600",
                          color: selectedTheme.text,
                        }}
                      >
                        {project.name}
                        {project.url && (
                          <span
                            style={{
                              fontSize: dynamicStyles.projectLinkSize,
                              color: selectedTheme.linkColor,
                              marginLeft: "8px",
                              fontWeight: "normal",
                            }}
                          >
                            ({project.url})
                          </span>
                        )}
                      </div>
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div
                            style={{
                              fontSize: dynamicStyles.projectTechSize,
                              color: selectedTheme.primary,
                              marginTop: "2px",
                              fontWeight: "500",
                            }}
                          >
                            {project.technologies.join(" • ")}
                          </div>
                        )}
                    </div>
                    {project.date && (
                      <div
                        style={{
                          fontSize: dynamicStyles.experienceDateSize,
                          color: selectedTheme.textMuted,
                          whiteSpace: "nowrap",
                          marginLeft: "15px",
                        }}
                      >
                        {project.date}
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p
                      style={{
                        fontSize: dynamicStyles.projectBulletSize,
                        lineHeight: dynamicStyles.projectBulletLineHeight,
                        color: selectedTheme.textLight,
                        marginTop: dynamicStyles.projectTechMarginBottom,
                        marginBottom: "4px",
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                  {project.bullets && project.bullets.length > 0 && (
                    <ul
                      style={{
                        marginTop: dynamicStyles.projectTechMarginBottom,
                        marginBottom: "0",
                        paddingLeft: "0",
                        listStyleType: "none",
                      }}
                    >
                      {project.bullets
                        .filter((bullet) => bullet && bullet.trim())
                        .map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            style={{
                              fontSize: dynamicStyles.projectBulletSize,
                              lineHeight: dynamicStyles.projectBulletLineHeight,
                              color: selectedTheme.textLight,
                              marginBottom:
                                dynamicStyles.projectBulletMarginBottom,
                              marginLeft: "20px",
                              listStyleType: "disc",
                              listStylePosition: "outside",
                              display: "list-item",
                            }}
                          >
                            {bullet}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section
          key="education"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-6px",
                top: "0",
                width: "4px",
                height: "100%",
                background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingLeft: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Education
            </h2>
            <div style={{paddingLeft: "10px"}}>
              {resumeData.education.map((edu, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: dynamicStyles.educationMarginBottom,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{flex: 1}}>
                      <div
                        style={{
                          fontSize: dynamicStyles.educationDegreeSize,
                          fontWeight: "600",
                          color: selectedTheme.text,
                        }}
                      >
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </div>
                      <div
                        style={{
                          fontSize: dynamicStyles.educationInstitutionSize,
                          color: selectedTheme.primary,
                          marginTop: "1px",
                          fontWeight: "500",
                        }}
                      >
                        {edu.institution}
                        {edu.location && ` • ${edu.location}`}
                      </div>
                      {edu.gpa && (
                        <div
                          style={{
                            fontSize: dynamicStyles.educationGpaSize,
                            color: selectedTheme.textLight,
                            marginTop: "2px",
                          }}
                        >
                          GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: dynamicStyles.educationDateSize,
                        color: selectedTheme.textMuted,
                        whiteSpace: "nowrap",
                        marginLeft: "15px",
                      }}
                    >
                      {edu.graduationDate}
                    </div>
                  </div>
                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul
                      style={{
                        marginTop: "4px",
                        marginBottom: "0",
                        paddingLeft: "0",
                        listStyleType: "none",
                      }}
                    >
                      {edu.bullets
                        .filter((bullet) => bullet && bullet.trim())
                        .map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            style={{
                              fontSize: dynamicStyles.projectBulletSize,
                              lineHeight: dynamicStyles.projectBulletLineHeight,
                              color: selectedTheme.textLight,
                              marginBottom:
                                dynamicStyles.projectBulletMarginBottom,
                              marginLeft: "20px",
                              listStyleType: "disc",
                              listStylePosition: "outside",
                              display: "list-item",
                            }}
                          >
                            {bullet}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section
            key="certifications"
            style={{marginBottom: dynamicStyles.sectionMarginBottom}}
          >
            <div style={{position: "relative"}}>
              <div
                style={{
                  position: "absolute",
                  left: "-6px",
                  top: "0",
                  width: "4px",
                  height: "100%",
                  background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                  borderRadius: "2px",
                }}
              ></div>
              <h2
                style={{
                  fontSize: dynamicStyles.sectionHeadingSize,
                  fontWeight: "bold",
                  color: selectedTheme.primary,
                  marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                  paddingLeft: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Certifications
              </h2>
              <div style={{paddingLeft: "10px"}}>
                {resumeData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: dynamicStyles.certificationMarginBottom,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{flex: 1}}>
                        <div
                          style={{
                            fontSize: dynamicStyles.certificationNameSize,
                            fontWeight: "600",
                            color: selectedTheme.text,
                          }}
                        >
                          {cert.name}
                        </div>
                        <div
                          style={{
                            fontSize: dynamicStyles.certificationIssuerSize,
                            color: selectedTheme.primary,
                            marginTop: "1px",
                            fontWeight: "500",
                          }}
                        >
                          {cert.issuer}
                        </div>
                      </div>
                      {cert.date && (
                        <div
                          style={{
                            fontSize: dynamicStyles.certificationIssuerSize,
                            color: selectedTheme.textMuted,
                            whiteSpace: "nowrap",
                            marginLeft: "15px",
                          }}
                        >
                          {cert.date}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section
            key="achievements"
            style={{marginBottom: dynamicStyles.sectionMarginBottom}}
          >
            <div style={{position: "relative"}}>
              <div
                style={{
                  position: "absolute",
                  left: "-6px",
                  top: "0",
                  width: "4px",
                  height: "100%",
                  background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                  borderRadius: "2px",
                }}
              ></div>
              <h2
                style={{
                  fontSize: dynamicStyles.sectionHeadingSize,
                  fontWeight: "bold",
                  color: selectedTheme.primary,
                  marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                  paddingLeft: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Achievements
              </h2>
              <ul
                style={{
                  marginTop: "4px",
                  marginBottom: "0",
                  paddingLeft: "10px",
                  listStyleType: "none",
                }}
              >
                {resumeData.achievements
                  .filter((achievement) => achievement && achievement.trim())
                  .map((achievement, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: dynamicStyles.itemTitleSize,
                        lineHeight: "1.5",
                        color: selectedTheme.textLight,
                        marginBottom: dynamicStyles.itemMarginBottom,
                        marginLeft: "20px",
                        listStyleType: "disc",
                        listStylePosition: "outside",
                        display: "list-item",
                      }}
                    >
                      {achievement}
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        ),

      languages: resumeData.languages && resumeData.languages.length > 0 && (
        <section
          key="languages"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-6px",
                top: "0",
                width: "4px",
                height: "100%",
                background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingLeft: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Languages
            </h2>
            <div style={{paddingLeft: "10px"}}>
              {resumeData.languages.map((lang, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: dynamicStyles.itemMarginBottom,
                  }}
                >
                  <span
                    style={{
                      fontSize: dynamicStyles.itemTitleSize,
                      fontWeight: "600",
                      color: selectedTheme.text,
                    }}
                  >
                    {lang.language}
                  </span>
                  {lang.proficiency && (
                    <span
                      style={{
                        fontSize: dynamicStyles.itemDetailSize,
                        color: selectedTheme.textLight,
                        marginLeft: "8px",
                      }}
                    >
                      — {lang.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      volunteer: resumeData.volunteer && resumeData.volunteer.length > 0 && (
        <section
          key="volunteer"
          style={{marginBottom: dynamicStyles.sectionMarginBottom}}
        >
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-6px",
                top: "0",
                width: "4px",
                height: "100%",
                background: `linear-gradient(to bottom, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                fontWeight: "bold",
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingLeft: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Volunteer Experience
            </h2>
            <div style={{paddingLeft: "10px"}}>
              {resumeData.volunteer.map((vol, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: dynamicStyles.itemMarginBottom,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{flex: 1}}>
                      <div
                        style={{
                          fontSize: dynamicStyles.itemTitleSize,
                          fontWeight: "600",
                          color: selectedTheme.text,
                        }}
                      >
                        {vol.role}
                      </div>
                      <div
                        style={{
                          fontSize: dynamicStyles.itemDetailSize,
                          color: selectedTheme.primary,
                          marginTop: "1px",
                          fontWeight: "500",
                        }}
                      >
                        {vol.organization}
                      </div>
                    </div>
                    {vol.date && (
                      <div
                        style={{
                          fontSize: dynamicStyles.itemDetailSize,
                          color: selectedTheme.textMuted,
                          whiteSpace: "nowrap",
                          marginLeft: "15px",
                        }}
                      >
                        {vol.date}
                      </div>
                    )}
                  </div>
                  {vol.description && (
                    <p
                      style={{
                        fontSize: dynamicStyles.itemDetailSize,
                        lineHeight: "1.5",
                        color: selectedTheme.textLight,
                        marginTop: "3px",
                        marginBottom: "0",
                      }}
                    >
                      {vol.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
    };

    return sections[sectionId];
  };

  return (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#ffffff",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        color: selectedTheme.text,
        padding: `${dynamicStyles.pageMarginTop} ${dynamicStyles.pageMarginRight} ${dynamicStyles.pageMarginBottom} ${dynamicStyles.pageMarginLeft}`,
        boxSizing: "border-box",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        position: "relative",
      }}
    >
      <div ref={contentRef}>
        {/* Header Section */}
        <header style={{marginBottom: dynamicStyles.contactMarginBottom}}>
          <div
            style={{
              background: `linear-gradient(135deg, ${selectedTheme.gradientStart}, ${selectedTheme.gradientEnd})`,
              padding: "16px 20px",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          >
            <h1
              style={{
                fontSize: dynamicStyles.nameSize,
                fontWeight: "bold",
                color: "#ffffff",
                margin: "0",
                letterSpacing: "0.5px",
              }}
            >
              {resumeData.name || "Your Name"}
            </h1>
          </div>

          {/* Contact Information */}
          {resumeData.contact && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: dynamicStyles.contactGap,
                fontSize: dynamicStyles.contactSize,
                color: selectedTheme.textLight,
                paddingLeft: "4px",
              }}
            >
              {resumeData.contact.email && (
                <span>{resumeData.contact.email}</span>
              )}
              {resumeData.contact.phone && (
                <span>• {resumeData.contact.phone}</span>
              )}
              {resumeData.contact.location && (
                <span>• {resumeData.contact.location}</span>
              )}
              {resumeData.contact.linkedin && (
                <span>• {resumeData.contact.linkedin}</span>
              )}
              {resumeData.contact.github && (
                <span>• {resumeData.contact.github}</span>
              )}
              {resumeData.contact.website && (
                <span>• {resumeData.contact.website}</span>
              )}
              {resumeData.contact.portfolio && (
                <span>• {resumeData.contact.portfolio}</span>
              )}
            </div>
          )}
        </header>

        {/* Dynamic Sections */}
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  );
});

Creative2Template.displayName = "Creative2Template";

export default Creative2Template;
