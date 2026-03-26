import {forwardRef, useRef, useEffect, useState, useMemo} from "react";

const DEFAULT_SECTION_ORDER = [
  "summary",
  "skills",
  "experience",
  "education",
  "projects",
  "certifications",
  "achievements",
  "customSections",
];

const SECTION_TITLES = {
  summary: "ABOUT ME",
  skills: "SKILLS",
  experience: "EXPERIENCE",
  education: "EDUCATION",
  projects: "PROJECTS",
  certifications: "CERTIFICATIONS",
  achievements: "ACHIEVEMENTS",
};

const COLOR_THEMES = {
  blue: {
    primary: "#2563eb",
    secondary: "#1e40af",
    text: "#000000",
    textLight: "#374151",
    textMuted: "#6b7280",
  },
  purple: {
    primary: "#7c3aed",
    secondary: "#6d28d9",
    text: "#000000",
    textLight: "#374151",
    textMuted: "#6b7280",
  },
  teal: {
    primary: "#0d9488",
    secondary: "#0f766e",
    text: "#000000",
    textLight: "#374151",
    textMuted: "#6b7280",
  },
  orange: {
    primary: "#ea580c",
    secondary: "#c2410c",
    text: "#000000",
    textLight: "#374151",
    textMuted: "#6b7280",
  },
};

/**
 * ModernTemplate - Contemporary resume template with bold design elements
 *
 * Features:
 * - Modern single-column layout with visual hierarchy
 * - Multiple color themes (blue, teal, purple, amber, emerald)
 * - Automatic page overflow detection and logging
 * - Clean section separators with color accents
 * - Professional typography with modern spacing
 * - ATS-compatible structure
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.resumeData - Complete resume data object (same structure as ClassicTemplate)
 * @param {string} props.resumeData.name - Candidate's full name
 * @param {Object} props.resumeData.contact - Contact information
 * @param {string} [props.resumeData.summary] - Professional summary
 * @param {Array<Object>} [props.resumeData.experience] - Work experience entries
 * @param {Array<Object>} [props.resumeData.education] - Education entries
 * @param {Array<Object>} [props.resumeData.skills] - Skills grouped by category
 * @param {Array<Object>} [props.resumeData.projects] - Project entries
 * @param {Array<Object>} [props.resumeData.certifications] - Certifications
 * @param {Array<string>} [props.resumeData.achievements] - Achievements
 * @param {Array<Object>} [props.resumeData.customSections] - Custom sections
 * @param {string} [props.resumeData.selectedTheme] - Color theme (blue, teal, purple, amber, emerald)
 * @param {Array<string>} [props.resumeData.sectionOrder] - Custom section ordering
 * @param {Function} [props.onPageUsageChange] - Callback for page overflow detection
 * @param {React.Ref} ref - Forwarded ref for PDF generation
 *
 * @example
 * <ModernTemplate
 *   ref={templateRef}
 *   resumeData={{
 *     name: "Alex Johnson",
 *     contact: { email: "alex@example.com" },
 *     selectedTheme: "teal"
 *   }}
 *   onPageUsageChange={(info) => console.log(info)}
 * />
 */
const ModernTemplate = forwardRef(({resumeData, onPageUsageChange}, ref) => {
  // Page overflow detection state
  const containerRef = useRef(null);
  const data = useMemo(() => resumeData || {}, [resumeData]);
  const [pageOverflowInfo, setPageOverflowInfo] = useState({
    isOverflowing: false,
    currentHeight: 0,
    maxHeight: 1056, // 11in at 96dpi (matches template minHeight)
    overflowPercentage: 0,
    templateName: "ModernTemplate",
  });

  // Detect page overflow whenever resumeData changes
  useEffect(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.scrollHeight;
      const maxHeight = 1056; // 11in at 96dpi (matches template minHeight)
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
        templateName: "ModernTemplate",
      };

      setPageOverflowInfo(usageInfo);

      // Pass data to parent component if callback provided
      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData]);

  // Select theme based on resumeData or default to blue
  const selectedTheme =
    COLOR_THEMES[data?.selectedTheme || data?.colorTheme] || COLOR_THEMES.blue;

  const contentDensity = useMemo(() => {
    let score = 0;

    score += (data.summary?.length || 0) > 280 ? 3 : data.summary ? 2 : 0;
    score += (data.experience?.length || 0) * 3;
    score += (data.projects?.length || 0) * 2;
    score += (data.education?.length || 0) * 2;
    score += (data.skills?.length || 0) * 1.5;
    score += (data.certifications?.length || 0) * 1;
    score += (data.achievements?.length || 0) * 1;

    (data.experience || []).forEach((item) => {
      score += item?.bullets?.length || 0;
    });
    (data.projects || []).forEach((item) => {
      score += item?.bullets?.length || 0;
    });
    (data.customSections || []).forEach((section) => {
      score += section?.items?.length || 0;
    });

    if (score < 16) {
      return "low";
    }
    if (score < 30) {
      return "medium";
    }
    return "high";
  }, [data]);

  const dynamicStyles = useMemo(() => {
    if (contentDensity === "low") {
      return {
        containerPadding: "0.55in",
        fontSize: "10.5pt",
        lineHeight: "1.38",
        headerMarginBottom: "15px",
        nameSize: "27pt",
        nameMarginBottom: "7px",
        contactSize: "10pt",
        contactGap: "10px",
        sectionMarginBottom: "13px",
        sectionHeadingSize: "12pt",
        sectionHeadingMarginBottom: "7px",
        sectionHeadingTracking: "0.5px",
        summarySize: "10pt",
        metaSize: "9pt",
        bodySize: "10pt",
        roleSize: "11pt",
        itemGap: "11px",
        bulletGap: "3px",
        sectionAccentWidth: "2px",
        sectionAccentPadding: "10px",
        sectionTopPadding: "7px",
      };
    }
    if (contentDensity === "medium") {
      return {
        containerPadding: "0.48in 0.52in",
        fontSize: "10pt",
        lineHeight: "1.34",
        headerMarginBottom: "12px",
        nameSize: "24pt",
        nameMarginBottom: "6px",
        contactSize: "9.5pt",
        contactGap: "8px",
        sectionMarginBottom: "10px",
        sectionHeadingSize: "11pt",
        sectionHeadingMarginBottom: "6px",
        sectionHeadingTracking: "0.5px",
        summarySize: "9.5pt",
        metaSize: "8.8pt",
        bodySize: "9.5pt",
        roleSize: "10.5pt",
        itemGap: "8px",
        bulletGap: "2px",
        sectionAccentWidth: "2px",
        sectionAccentPadding: "9px",
        sectionTopPadding: "6px",
      };
    }

    return {
      containerPadding: "0.42in 0.5in",
      fontSize: "9.5pt",
      lineHeight: "1.3",
      headerMarginBottom: "9px",
      nameSize: "21pt",
      nameMarginBottom: "5px",
      contactSize: "9pt",
      contactGap: "7px",
      sectionMarginBottom: "8px",
      sectionHeadingSize: "10pt",
      sectionHeadingMarginBottom: "4px",
      sectionHeadingTracking: "0.45px",
      summarySize: "9pt",
      metaSize: "8pt",
      bodySize: "9pt",
      roleSize: "9.8pt",
      itemGap: "6px",
      bulletGap: "1.5px",
      sectionAccentWidth: "1.5px",
      sectionAccentPadding: "8px",
      sectionTopPadding: "5px",
    };
  }, [contentDensity]);

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

  const sectionOrder =
    data.sectionOrder && data.sectionOrder.length > 0
      ? data.sectionOrder.filter(
          (id) => !["score", "personal", "recommendations"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Get custom section titles or use defaults
  const getSectionTitle = (sectionId) => {
    const customTitles = data.sectionTitles || {};
    return (
      customTitles[sectionId] ||
      SECTION_TITLES[sectionId] ||
      sectionId
    ).toUpperCase();
  };

  // Render section helper function
  const renderSection = (sectionId) => {
    // Common style to prevent page breaks inside sections
    const sectionStyle = {
      marginBottom: dynamicStyles.sectionMarginBottom,
      pageBreakInside: "avoid",
      breakInside: "avoid",
      borderLeft:
        sectionId === "summary"
          ? "none"
          : `${dynamicStyles.sectionAccentWidth} solid ${selectedTheme.primary}`,
      borderTop:
        sectionId === "summary" ? "none" : `1px solid ${selectedTheme.primary}22`,
      paddingLeft: dynamicStyles.sectionAccentPadding,
      paddingTop: sectionId === "summary" ? "0" : dynamicStyles.sectionTopPadding,
    };

    const headingStyle = {
      fontSize: dynamicStyles.sectionHeadingSize,
      color: selectedTheme.primary,
      marginBottom: dynamicStyles.sectionHeadingMarginBottom,
      letterSpacing: dynamicStyles.sectionHeadingTracking,
    };

    const adaptiveSkillsColumns =
      contentDensity === "high" || (data.skills?.length || 0) > 12
        ? "1fr"
        : "repeat(2, minmax(0, 1fr))";

    const sections = {
      summary: data.summary && (
        <section key="summary" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={headingStyle}>
            {getSectionTitle("summary")}
          </h2>
          <p
            style={{fontSize: dynamicStyles.summarySize, textAlign: "justify"}}
          >
            {typeof data.summary === "string"
              ? data.summary
              : data.summary?.summary || ""}
          </p>
        </section>
      ),

      skills: data.skills && data.skills.length > 0 && (
        <section key="skills" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={headingStyle}>
            {getSectionTitle("skills")}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: adaptiveSkillsColumns,
              gap: dynamicStyles.itemGap,
            }}
          >
            {data.skills.map((skillGroup, index) => (
              <div key={index} style={{fontSize: dynamicStyles.bodySize}}>
                <span
                  className="font-semibold"
                  style={{color: selectedTheme.textLight}}
                >
                  {skillGroup.category}:
                </span>{" "}
                <span style={{color: selectedTheme.textMuted}}>
                  {formatSkills(skillGroup.items)}
                </span>
              </div>
            ))}
          </div>
        </section>
      ),

      experience: data.experience && data.experience.length > 0 && (
        <section key="experience" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={headingStyle}>
            {getSectionTitle("experience")}
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: dynamicStyles.itemGap}}>
              <div
                className="flex justify-between items-baseline"
                style={{marginBottom: "2px"}}
              >
                <div>
                  <span
                    className="font-bold"
                    style={{fontSize: dynamicStyles.roleSize}}
                  >
                    {exp.title || "Position"}
                  </span>
                  {exp.company && (
                    <span
                      style={{
                        fontSize: dynamicStyles.bodySize,
                        color: selectedTheme.textMuted,
                      }}
                    >
                      {" "}
                      @ {exp.company}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: dynamicStyles.metaSize,
                    color: selectedTheme.textMuted,
                  }}
                >
                  {exp.startDate && (
                    <>
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </>
                  )}
                </div>
              </div>
              {exp.location && (
                <div
                  style={{
                    fontSize: dynamicStyles.metaSize,
                    color: selectedTheme.textMuted,
                    marginBottom: "4px",
                  }}
                >
                  Location: {exp.location}
                </div>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-5"
                  style={{marginTop: "4px"}}
                >
                  {exp.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: dynamicStyles.bodySize,
                        marginBottom: dynamicStyles.bulletGap,
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

      projects: data.projects && data.projects.length > 0 && (
        <section key="projects" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={headingStyle}>
            {getSectionTitle("projects")}
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} style={{marginBottom: dynamicStyles.itemGap}}>
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
                  style={{fontSize: dynamicStyles.roleSize}}
                >
                  {project.name}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: dynamicStyles.metaSize,
                      color: selectedTheme.primary,
                      textDecoration: "underline",
                      marginLeft: "8px",
                    }}
                  >
                    Project Link
                  </a>
                )}
              </div>
              {project.technologies && (
                <div
                  style={{
                    fontSize: dynamicStyles.metaSize,
                    color: selectedTheme.textMuted,
                    marginBottom: "3px",
                  }}
                >
                  <span className="font-semibold">Tech:</span>{" "}
                  {Array.isArray(project.technologies)
                    ? project.technologies.join(", ")
                    : project.technologies}
                </div>
              )}
              {project.bullets && project.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-5"
                  style={{marginTop: "3px"}}
                >
                  {project.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: dynamicStyles.bodySize,
                        marginBottom: dynamicStyles.bulletGap,
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

      education: data.education && data.education.length > 0 && (
        <section key="education" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={headingStyle}>
            {getSectionTitle("education")}
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} style={{marginBottom: dynamicStyles.itemGap}}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span
                    className="font-bold"
                    style={{fontSize: dynamicStyles.bodySize}}
                  >
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: dynamicStyles.metaSize,
                    color: selectedTheme.textMuted,
                  }}
                >
                  {edu.startDate && (
                    <>
                      {edu.startDate} - {edu.endDate}
                    </>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: dynamicStyles.bodySize,
                  color: selectedTheme.textMuted,
                }}
              >
                {edu.institution}
                {edu.location && <span> — {edu.location}</span>}
                {edu.gpa && <span> | GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </section>
      ),

      certifications: data.certifications &&
        data.certifications.length > 0 && (
          <section key="certifications" style={sectionStyle}>
            <h2 className="font-bold uppercase" style={headingStyle}>
              {getSectionTitle("certifications")}
            </h2>
            {data.certifications.map((cert, index) => (
              <div
                key={index}
                style={{
                  fontSize: dynamicStyles.bodySize,
                  marginBottom: dynamicStyles.bulletGap,
                }}
              >
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && (
                  <span style={{color: selectedTheme.textMuted}}>
                    {" "}
                    — {cert.issuer}
                  </span>
                )}
                {cert.date && (
                  <span
                    style={{
                      fontSize: dynamicStyles.metaSize,
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

      achievements: data.achievements &&
        data.achievements.length > 0 && (
          <section key="achievements" style={sectionStyle}>
            <h2 className="font-bold uppercase" style={headingStyle}>
              {getSectionTitle("achievements")}
            </h2>
            <ul
              className="list-disc list-outside ml-5"
              style={{marginTop: "4px"}}
            >
              {data.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: dynamicStyles.bodySize,
                    marginBottom: dynamicStyles.bulletGap,
                  }}
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      customSections: data.customSections &&
        data.customSections.length > 0 && (
          <div key="customSections">
            {data.customSections.map((section, sectionIndex) => {
              if (section.title && section.items && section.items.length > 0) {
                return (
                  <section key={sectionIndex} style={sectionStyle}>
                    <h2 className="font-bold uppercase" style={headingStyle}>
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
                            fontSize: dynamicStyles.bodySize,
                            marginBottom: dynamicStyles.bulletGap,
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
        background: `linear-gradient(180deg, ${selectedTheme.primary}08 0%, #ffffff 180px)`,
      }}
    >
      {/* Header - Left Aligned Modern Style */}
      <header
        style={{
          marginBottom: dynamicStyles.headerMarginBottom,
          borderBottom: `2px solid ${selectedTheme.primary}`,
          paddingBottom: "8px",
        }}
      >
        <h1
          className="font-bold"
          style={{
            fontSize: dynamicStyles.nameSize,
            marginBottom: dynamicStyles.nameMarginBottom,
            color: selectedTheme.primary,
          }}
        >
          {data.name || "Your Name"}
        </h1>
        <div
          style={{
            fontSize: dynamicStyles.contactSize,
            display: "flex",
            flexWrap: "wrap",
            gap: dynamicStyles.contactGap,
            color: selectedTheme.textMuted,
          }}
        >
          {data.contact?.email && (
            <span>Email: {data.contact.email}</span>
          )}
          {data.contact?.phone && (
            <span>Phone: {data.contact.phone}</span>
          )}
          {data.contact?.location && (
            <span>Location: {data.contact.location}</span>
          )}
          {data.contact?.linkedin && (
            <a
              href={data.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: selectedTheme.primary,
                textDecoration: "underline",
              }}
            >
              LinkedIn
            </a>
          )}
          {data.contact?.github && (
            <a
              href={data.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: selectedTheme.primary,
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

ModernTemplate.displayName = "ModernTemplate";

export default ModernTemplate;
