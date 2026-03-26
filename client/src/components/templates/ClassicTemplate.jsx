import {forwardRef, useRef, useEffect, useMemo} from "react";

const COLOR_THEMES = {
  navy: {
    primary: "#003d82",
    secondary: "#0066cc",
    text: "#000000",
    textLight: "#2d3748",
    textMuted: "#4a5568",
    border: "#003d82",
    linkColor: "#0066cc",
  },
  burgundy: {
    primary: "#7d1007",
    secondary: "#8b1a1a",
    text: "#000000",
    textLight: "#2d3748",
    textMuted: "#4a5568",
    border: "#7d1007",
    linkColor: "#8b1a1a",
  },
  forest: {
    primary: "#0d4d0d",
    secondary: "#1b5e20",
    text: "#000000",
    textLight: "#2d3748",
    textMuted: "#4a5568",
    border: "#0d4d0d",
    linkColor: "#1b5e20",
  },
  charcoal: {
    primary: "#1a202c",
    secondary: "#2d3748",
    text: "#000000",
    textLight: "#2d3748",
    textMuted: "#4a5568",
    border: "#1a202c",
    linkColor: "#2d3748",
  },
  slate: {
    primary: "#1e293b",
    secondary: "#334155",
    text: "#000000",
    textLight: "#334155",
    textMuted: "#64748b",
    border: "#1e293b",
    linkColor: "#334155",
  },
  teal: {
    primary: "#0d5e5e",
    secondary: "#0f766e",
    text: "#000000",
    textLight: "#2d3748",
    textMuted: "#4a5568",
    border: "#0d5e5e",
    linkColor: "#0f766e",
  },
};

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

/**
 * ClassicTemplate - Professional ATS-optimized resume template with clean formatting
 *
 * Features:
 * - Single-column layout optimized for ATS parsing
 * - Professional color themes (navy, burgundy, forest, charcoal, slate)
 * - Automatic page overflow detection for A4 size
 * - Customizable section order and visibility
 * - Two-column skills layout option
 * - LinkedIn/GitHub links with proper formatting
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.resumeData - Complete resume data object
 * @param {string} props.resumeData.name - Candidate's full name
 * @param {Object} props.resumeData.contact - Contact information
 * @param {string} props.resumeData.contact.email - Email address
 * @param {string} [props.resumeData.contact.phone] - Phone number
 * @param {string} [props.resumeData.contact.location] - City, State or full address
 * @param {string} [props.resumeData.contact.linkedin] - LinkedIn profile URL
 * @param {string} [props.resumeData.contact.github] - GitHub profile URL
 * @param {string} [props.resumeData.contact.website] - Personal website URL
 * @param {string} [props.resumeData.summary] - Professional summary/objective
 * @param {Array<Object>} [props.resumeData.experience] - Work experience entries
 * @param {string} props.resumeData.experience[].title - Job title
 * @param {string} props.resumeData.experience[].company - Company name
 * @param {string} [props.resumeData.experience[].location] - Job location
 * @param {string} props.resumeData.experience[].startDate - Start date (MM/YYYY or text)
 * @param {string} [props.resumeData.experience[].endDate] - End date (MM/YYYY, "Present", or text)
 * @param {Array<string>} [props.resumeData.experience[].bullets] - Achievement bullets
 * @param {Array<Object>} [props.resumeData.education] - Education entries
 * @param {string} props.resumeData.education[].degree - Degree name
 * @param {string} props.resumeData.education[].institution - School name
 * @param {string} props.resumeData.education[].graduationDate - Graduation date
 * @param {string} [props.resumeData.education[].gpa] - GPA (e.g., "3.8/4.0")
 * @param {Array<Object>} [props.resumeData.skills] - Skills grouped by category
 * @param {string} props.resumeData.skills[].category - Skill category name
 * @param {Array<string>} props.resumeData.skills[].items - Skills in category
 * @param {Array<Object>} [props.resumeData.projects] - Project entries
 * @param {string} props.resumeData.projects[].name - Project name
 * @param {Array<string>} [props.resumeData.projects[].bullets] - Project descriptions
 * @param {string} [props.resumeData.projects[].technologies] - Technologies used
 * @param {Array<Object>} [props.resumeData.certifications] - Certification entries
 * @param {string} props.resumeData.certifications[].name - Certification name
 * @param {string} [props.resumeData.certifications[].issuer] - Issuing organization
 * @param {string} [props.resumeData.certifications[].date] - Date obtained
 * @param {Array<string>} [props.resumeData.achievements] - Achievement/award entries
 * @param {Array<Object>} [props.resumeData.customSections] - Custom sections
 * @param {string} props.resumeData.customSections[].title - Section title
 * @param {string} props.resumeData.customSections[].content - Section content
 * @param {string} [props.resumeData.selectedTheme] - Color theme (navy, burgundy, forest, charcoal, slate)
 * @param {Array<string>} [props.resumeData.sectionOrder] - Custom section ordering
 * @param {Function} [props.onPageUsageChange] - Callback when page overflow is detected
 * @param {React.Ref} ref - Forwarded ref for PDF generation (DO NOT use forwardedRef prop)
 *
 * @example
 * // Basic usage with required fields only
 * <ClassicTemplate
 *   ref={templateRef}
 *   resumeData={{
 *     name: "John Doe",
 *     contact: { email: "john@example.com" }
 *   }}
 * />
 *
 * @example
 * // Full usage with all features
 * <ClassicTemplate
 *   ref={templateRef}
 *   resumeData={{
 *     name: "Jane Smith",
 *     contact: {
 *       email: "jane@example.com",
 *       phone: "+1-555-0100",
 *       location: "San Francisco, CA",
 *       linkedin: "linkedin.com/in/janesmith",
 *       github: "github.com/janesmith"
 *     },
 *     summary: "Experienced software engineer...",
 *     experience: [{
 *       title: "Senior Developer",
 *       company: "Tech Corp",
 *       location: "Remote",
 *       startDate: "01/2020",
 *       endDate: "Present",
 *       bullets: ["Led team of 5 engineers", "Increased performance by 40%"]
 *     }],
 *     selectedTheme: "navy",
 *     sectionOrder: ["summary", "experience", "skills", "education"]
 *   }}
 *   onPageUsageChange={(info) => {
 *     if (info.isOverflowing) {
 *       console.warn(`Resume overflows by ${info.overflowPercentage}%`);
 *     }
 *   }}
 * />
 */
const ClassicTemplate = forwardRef(({resumeData, onPageUsageChange}, ref) => {
  const containerRef = useRef(null);
  const data = useMemo(() => resumeData || {}, [resumeData]);

  // Detect page overflow whenever resumeData changes
  useEffect(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.scrollHeight;
      const maxHeight = 1123; // A4 page height in pixels (297mm × 96/25.4 ≈ 1123px)
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
        templateName: "ClassicTemplate",
      };

      // Pass data to parent component if callback provided
      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData]); // Don't include onPageUsageChange to prevent infinite loops

  // Select theme based on resumeData or default to navy
  const selectedTheme = useMemo(
    () =>
      COLOR_THEMES[data?.selectedTheme || data?.colorTheme] || COLOR_THEMES.navy,
    [data?.selectedTheme, data?.colorTheme]
  );

  // Calculate content density to determine styling mode (memoized to prevent recalculation on every render)
  const contentDensity = useMemo(() => {
    let contentScore = 0;

    // Count experience items and bullets
    if (data.experience?.length) {
      contentScore += data.experience.length * 3;
      data.experience.forEach((exp) => {
        contentScore += (exp.bullets?.length || 0) * 1;
      });
    }

    // Count projects and bullets
    if (data.projects?.length) {
      contentScore += data.projects.length * 2;
      data.projects.forEach((proj) => {
        contentScore += (proj.bullets?.length || 0) * 1;
      });
    }

    // Count education items
    contentScore += (data.education?.length || 0) * 2;

    // Count skills
    contentScore += (data.skills?.length || 0) * 1.5;

    // Count certifications
    contentScore += (data.certifications?.length || 0) * 1;

    // Count achievements
    contentScore += (data.achievements?.length || 0) * 1;

    // Count custom sections
    if (data.customSections?.length) {
      data.customSections.forEach((section) => {
        contentScore += (section.items?.length || 0) * 1;
      });
    }

    // Summary adds to content
    if (data.summary) {
      contentScore += data.summary.length > 300 ? 3 : 2;
    }

    // Determine density: low (<15), medium (15-30), high (>30)
    const density =
      contentScore < 15 ? "low" : contentScore < 30 ? "medium" : "high";

    return density;
  }, [data]); // Only recalculate when resumeData changes

  // Dynamic styling based on content density
  const getDynamicStyles = () => {
    switch (contentDensity) {
      case "low":
        return {
          containerPadding: "0.5in",
          fontSize: "10.5pt",
          lineHeight: "1.35",
          headerMarginBottom: "12px",
          headerPaddingBottom: "8px",
          nameSize: "22pt",
          nameMarginBottom: "8px",
          contactSize: "10pt",
          contactMarginBottom: "4px",
          sectionMarginBottom: "12px",
          sectionHeadingSize: "11pt",
          sectionHeadingPaddingBottom: "3px",
          sectionHeadingMarginBottom: "6px",
          summarySize: "10pt",
          experienceMarginBottom: "10px",
          experienceItemMarginBottom: "3px",
          experienceTitleSize: "10pt",
          experienceDateSize: "9pt",
          experienceLocationSize: "9pt",
          experienceLocationMarginBottom: "3px",
          experienceBulletSize: "10pt",
          experienceBulletMarginBottom: "3px",
          projectMarginBottom: "10px",
          projectTitleSize: "10pt",
          projectLinkSize: "9pt",
          projectTechSize: "9pt",
          projectTechMarginBottom: "3px",
          projectBulletSize: "10pt",
          projectBulletMarginBottom: "3px",
          educationMarginBottom: "8px",
          educationInstitutionSize: "10pt",
          educationLocationSize: "9pt",
          educationDateSize: "9pt",
          educationDegreeSize: "10pt",
          educationGpaSize: "9pt",
          skillsSize: "10pt",
          skillsMarginBottom: "4px",
          certificationSize: "10pt",
          certificationMarginBottom: "4px",
          certificationDateSize: "9pt",
          achievementSize: "10pt",
          achievementMarginBottom: "3px",
        };
      case "medium":
        return {
          containerPadding: "0.45in 0.5in",
          fontSize: "10pt",
          lineHeight: "1.3",
          headerMarginBottom: "10px",
          headerPaddingBottom: "7px",
          nameSize: "20pt",
          nameMarginBottom: "7px",
          contactSize: "9.5pt",
          contactMarginBottom: "3px",
          sectionMarginBottom: "10px",
          sectionHeadingSize: "10.5pt",
          sectionHeadingPaddingBottom: "2.5px",
          sectionHeadingMarginBottom: "5px",
          summarySize: "9.5pt",
          experienceMarginBottom: "8px",
          experienceItemMarginBottom: "2.5px",
          experienceTitleSize: "9.5pt",
          experienceDateSize: "8.5pt",
          experienceLocationSize: "8.5pt",
          experienceLocationMarginBottom: "2.5px",
          experienceBulletSize: "9.5pt",
          experienceBulletMarginBottom: "2px",
          projectMarginBottom: "8px",
          projectTitleSize: "9.5pt",
          projectLinkSize: "8.5pt",
          projectTechSize: "8.5pt",
          projectTechMarginBottom: "2.5px",
          projectBulletSize: "9.5pt",
          projectBulletMarginBottom: "2px",
          educationMarginBottom: "7px",
          educationInstitutionSize: "9.5pt",
          educationLocationSize: "8.5pt",
          educationDateSize: "8.5pt",
          educationDegreeSize: "9.5pt",
          educationGpaSize: "8.5pt",
          skillsSize: "9.5pt",
          skillsMarginBottom: "3px",
          certificationSize: "9.5pt",
          certificationMarginBottom: "3px",
          certificationDateSize: "8.5pt",
          achievementSize: "9.5pt",
          achievementMarginBottom: "2px",
        };
      case "high":
      default:
        return {
          containerPadding: "0.4in 0.5in",
          fontSize: "9.5pt",
          lineHeight: "1.25",
          headerMarginBottom: "8px",
          headerPaddingBottom: "6px",
          nameSize: "19pt",
          nameMarginBottom: "6px",
          contactSize: "9pt",
          contactMarginBottom: "3px",
          sectionMarginBottom: "8px",
          sectionHeadingSize: "10pt",
          sectionHeadingPaddingBottom: "2px",
          sectionHeadingMarginBottom: "4px",
          summarySize: "9pt",
          experienceMarginBottom: "7px",
          experienceItemMarginBottom: "2px",
          experienceTitleSize: "9pt",
          experienceDateSize: "8pt",
          experienceLocationSize: "8pt",
          experienceLocationMarginBottom: "2px",
          experienceBulletSize: "9pt",
          experienceBulletMarginBottom: "1.5px",
          projectMarginBottom: "7px",
          projectTitleSize: "9pt",
          projectLinkSize: "8pt",
          projectTechSize: "8pt",
          projectTechMarginBottom: "2px",
          projectBulletSize: "9pt",
          projectBulletMarginBottom: "1.5px",
          educationMarginBottom: "6px",
          educationInstitutionSize: "9pt",
          educationLocationSize: "8pt",
          educationDateSize: "8pt",
          educationDegreeSize: "9pt",
          educationGpaSize: "8pt",
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

  const dynamicStyles = useMemo(() => getDynamicStyles(), [contentDensity]);

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

  const sectionStyle = useMemo(
    () => ({
      marginBottom: dynamicStyles.sectionMarginBottom,
      pageBreakInside: "avoid",
      breakInside: "avoid",
    }),
    [dynamicStyles.sectionMarginBottom]
  );

  const sectionHeadingStyle = useMemo(
    () => ({
      fontSize: dynamicStyles.sectionHeadingSize,
      color: selectedTheme.primary,
      borderBottom: `1.5px solid ${selectedTheme.border}`,
      paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
      marginBottom: dynamicStyles.sectionHeadingMarginBottom,
      letterSpacing: "0.5px",
    }),
    [
      dynamicStyles.sectionHeadingSize,
      dynamicStyles.sectionHeadingPaddingBottom,
      dynamicStyles.sectionHeadingMarginBottom,
      selectedTheme.primary,
      selectedTheme.border,
    ]
  );

  // Render section helper function
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case "summary":
        return data.summary ? (
        <section key="summary" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={sectionHeadingStyle}>
            Professional Summary
          </h2>
          <p
            style={{
              fontSize: dynamicStyles.summarySize,
              lineHeight: dynamicStyles.lineHeight,
              color: selectedTheme.text,
            }}
          >
            {data.summary}
          </p>
        </section>
        ) : null;

      case "skills":
        return data.skills && data.skills.length > 0 ? (
        <section key="skills" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={sectionHeadingStyle}>
            Skills
          </h2>
          {data.skills.map((skillGroup, index) => (
            <div
              key={index}
              style={{
                fontSize: dynamicStyles.skillsSize,
                lineHeight: dynamicStyles.lineHeight,
                marginBottom: dynamicStyles.skillsMarginBottom,
                color: selectedTheme.text,
              }}
            >
              <span
                className="font-semibold"
                style={{color: selectedTheme.textLight}}
              >
                {skillGroup.category}:
              </span>{" "}
              {formatSkills(skillGroup.items)}
            </div>
          ))}
        </section>
        ) : null;

      case "experience":
        return data.experience && data.experience.length > 0 ? (
        <section key="experience" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={sectionHeadingStyle}>
            Professional Experience
          </h2>
          {data.experience.map((exp, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.experienceMarginBottom}}
            >
              <div
                className="flex justify-between items-baseline"
                style={{marginBottom: dynamicStyles.experienceItemMarginBottom}}
              >
                <div>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: dynamicStyles.experienceTitleSize,
                      color: selectedTheme.textLight,
                    }}
                  >
                    {exp.company}
                  </span>
                  {exp.title && (
                    <span
                      style={{
                        fontSize: dynamicStyles.experienceTitleSize,
                        color: selectedTheme.text,
                      }}
                    >
                      {" "}
                      — {exp.title}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: dynamicStyles.experienceDateSize,
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
                  className="italic"
                  style={{
                    fontSize: dynamicStyles.experienceLocationSize,
                    marginBottom: dynamicStyles.experienceLocationMarginBottom,
                    color: selectedTheme.textMuted,
                  }}
                >
                  {exp.location}
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
                        fontSize: dynamicStyles.experienceBulletSize,
                        lineHeight: dynamicStyles.lineHeight,
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
            </div>
          ))}
        </section>
        ) : null;

      case "projects":
        return data.projects && data.projects.length > 0 ? (
        <section key="projects" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={sectionHeadingStyle}>
            Projects
          </h2>
          {data.projects.map((project, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.projectMarginBottom}}
            >
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
                  style={{
                    fontSize: dynamicStyles.projectTitleSize,
                    color: selectedTheme.textLight,
                  }}
                >
                  {project.name}
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
                    🔗 View Project
                  </a>
                )}
              </div>
              {project.technologies && (
                <div
                  className="italic"
                  style={{
                    fontSize: dynamicStyles.projectTechSize,
                    marginBottom: dynamicStyles.projectTechMarginBottom,
                    color: selectedTheme.textMuted,
                  }}
                >
                  Technologies:{" "}
                  {Array.isArray(project.technologies)
                    ? project.technologies.join(", ")
                    : project.technologies}
                </div>
              )}
              {project.bullets && project.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-5"
                  style={{marginTop: "4px"}}
                >
                  {project.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: dynamicStyles.projectBulletSize,
                        lineHeight: dynamicStyles.lineHeight,
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
        ) : null;

      case "education":
        return data.education && data.education.length > 0 ? (
        <section key="education" style={sectionStyle}>
          <h2 className="font-bold uppercase" style={sectionHeadingStyle}>
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div
              key={index}
              style={{marginBottom: dynamicStyles.educationMarginBottom}}
            >
              <div className="flex justify-between items-baseline">
                <div>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: dynamicStyles.educationInstitutionSize,
                      color: selectedTheme.textLight,
                    }}
                  >
                    {edu.institution}
                  </span>
                  {edu.location && (
                    <span
                      style={{
                        fontSize: dynamicStyles.educationLocationSize,
                        color: selectedTheme.textMuted,
                      }}
                    >
                      {" "}
                      — {edu.location}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: dynamicStyles.educationDateSize,
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
                  fontSize: dynamicStyles.educationDegreeSize,
                  color: selectedTheme.text,
                }}
              >
                {edu.degree && edu.field && (
                  <span>
                    {edu.degree} in {edu.field}
                  </span>
                )}
                {edu.gpa && (
                  <span
                    style={{
                      fontSize: dynamicStyles.educationGpaSize,
                      color: selectedTheme.textMuted,
                    }}
                  >
                    {" "}
                    | GPA: {edu.gpa}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
        ) : null;

      case "certifications":
        return data.certifications && data.certifications.length > 0 ? (
          <section key="certifications" style={sectionStyle}>
            <h2 className="font-bold uppercase" style={sectionHeadingStyle}>
              Certifications
            </h2>
            {data.certifications.map((cert, index) => (
              <div
                key={index}
                style={{
                  fontSize: dynamicStyles.certificationSize,
                  lineHeight: dynamicStyles.lineHeight,
                  marginBottom: dynamicStyles.certificationMarginBottom,
                  color: selectedTheme.text,
                }}
              >
                <span
                  className="font-semibold"
                  style={{color: selectedTheme.textLight}}
                >
                  {cert.name}
                </span>
                {cert.issuer && <span> — {cert.issuer}</span>}
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
        ) : null;

      case "achievements":
        return data.achievements && data.achievements.length > 0 ? (
          <section key="achievements" style={sectionStyle}>
            <h2 className="font-bold uppercase" style={sectionHeadingStyle}>
              Achievements
            </h2>
            <ul
              className="list-disc list-outside ml-5"
              style={{marginTop: "4px"}}
            >
              {data.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: dynamicStyles.achievementSize,
                    lineHeight: dynamicStyles.lineHeight,
                    marginBottom: dynamicStyles.achievementMarginBottom,
                    color: selectedTheme.text,
                  }}
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ) : null;

      case "customSections":
        return data.customSections && data.customSections.length > 0 ? (
          <>
            {data.customSections.map((section, sectionIndex) => {
              if (section.title && section.items && section.items.length > 0) {
                return (
                  <section
                    key={`customSection_${sectionIndex}`}
                    style={sectionStyle}
                  >
                    <h2 className="font-bold uppercase" style={sectionHeadingStyle}>
                      {section.title}
                    </h2>
                    <ul
                      className="list-disc list-outside ml-5"
                      style={{marginTop: "4px"}}
                    >
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={`${
                            section.id || sectionIndex
                          }-item-${itemIndex}`}
                          style={{
                            fontSize: dynamicStyles.achievementSize,
                            lineHeight: dynamicStyles.lineHeight,
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
          </>
        ) : null;

      default:
        return null;
    }
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
      {/* Header - Contact Information */}
      <header
        className="text-center pb-2 mb-3"
        style={{
          borderBottom: `2px solid ${selectedTheme.border}`,
          marginBottom: dynamicStyles.headerMarginBottom,
          paddingBottom: dynamicStyles.headerPaddingBottom,
        }}
      >
        <h1
          className="font-bold uppercase tracking-wide"
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
            color: selectedTheme.textLight,
          }}
        >
          {data.contact?.email && (
            <div style={{marginBottom: dynamicStyles.contactMarginBottom}}>
              {data.contact.email}
            </div>
          )}
          <div className="flex justify-center gap-3 flex-wrap">
            {data.contact?.phone && (
              <span>{data.contact.phone}</span>
            )}
            {data.contact?.location && (
              <span>{data.contact.location}</span>
            )}
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {data.contact?.linkedin && (
              <a
                href={data.contact.linkedin}
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
            {data.contact?.github && (
              <a
                href={data.contact.github}
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
        </div>
      </header>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

ClassicTemplate.displayName = "ClassicTemplate";

export default ClassicTemplate;
