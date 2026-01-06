import {forwardRef, useRef, useEffect, useState} from "react";
<<<<<<< HEAD

const ProfessionalTemplate = forwardRef(
  ({resumeData, onPageUsageChange}, ref) => {
    // Page overflow detection state
    const containerRef = useRef(null);
    const [pageOverflowInfo, setPageOverflowInfo] = useState({
      isOverflowing: false,
      currentHeight: 0,
      maxHeight: 1056, // Standard A4 page height at 96 DPI (11 inches * 96)
      overflowPercentage: 0,
      templateName: "ProfessionalTemplate",
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
          templateName: "ProfessionalTemplate",
        };

        setPageOverflowInfo(usageInfo);

        // Log overflow information for testing
        if (isOverflowing) {
          console.log(
            `⚠️ ProfessionalTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
          );
        } else {
          console.log(
            `✅ ProfessionalTemplate: Content fits on one page. Height: ${currentHeight}px / ${maxHeight}px (${usageInfo.percentage}% filled)`
          );
        }

=======
import {Mail, Phone, MapPin, Linkedin, Github, Globe} from "lucide-react";

/**
 * ProfessionalTemplate - Corporate-style resume template with icon accents
 *
 * Features:
 * - Professional single-column layout
 * - Lucide React icons for contact information
 * - Multiple color themes (blue, teal, purple, green, orange, gray)
 * - Clean section headers with subtle borders
 * - Automatic page overflow detection with console logging
 * - ATS-compatible structure
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.resumeData - Complete resume data object (same structure as ClassicTemplate)
 * @param {string} [props.resumeData.selectedTheme] - Color theme (blue, teal, purple, green, orange, gray)
 * @param {Function} [props.onPageUsageChange] - Callback for page overflow detection
 * @param {React.Ref} ref - Forwarded ref for PDF generation
 *
 * @example
 * <ProfessionalTemplate
 *   ref={templateRef}
 *   resumeData={{ name: "Pat Chen", contact: { email: "pat@example.com", linkedin: "linkedin.com/in/patchen" } }}
 * />
 */
const ProfessionalTemplate = forwardRef(
  ({resumeData, onPageUsageChange}, ref) => {
    // Debug: Log resume data structure
    console.log("🔍 ProfessionalTemplate - Resume Data:", {
      hasExperience: !!resumeData?.experience,
      experienceCount: resumeData?.experience?.length || 0,
      firstExp: resumeData?.experience?.[0],
      hasProjects: !!resumeData?.projects,
      projectsCount: resumeData?.projects?.length || 0,
      firstProject: resumeData?.projects?.[0],
    });

    // Page overflow detection state
    const containerRef = useRef(null);
    const [pageOverflowInfo, setPageOverflowInfo] = useState({
      isOverflowing: false,
      currentHeight: 0,
      maxHeight: 1056, // Standard A4 page height at 96 DPI (11 inches * 96)
      overflowPercentage: 0,
      templateName: "ProfessionalTemplate",
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
          templateName: "ProfessionalTemplate",
        };

        setPageOverflowInfo(usageInfo);

        // Log overflow information for testing
        if (isOverflowing) {
          console.log(
            `⚠️ ProfessionalTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
          );
        } else {
          console.log(
            `✅ ProfessionalTemplate: Content fits on one page. Height: ${currentHeight}px / ${maxHeight}px (${usageInfo.percentage}% filled)`
          );
        }

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
        // Pass data to parent component if callback provided
        if (onPageUsageChange) {
          onPageUsageChange(usageInfo);
        }
      }
    }, [resumeData]);

    // Color Themes - Multiple professional palettes
    const colorThemes = {
      navy: {
        primary: "#1e3a8a",
        secondary: "#1e40af",
        text: "#1f2937",
        textLight: "#4b5563",
        textMuted: "#6b7280",
        border: "#e5e7eb",
      },
      burgundy: {
        primary: "#881337",
        secondary: "#9f1239",
        text: "#1f2937",
        textLight: "#4b5563",
        textMuted: "#6b7280",
        border: "#e5e7eb",
      },
      forest: {
        primary: "#065f46",
        secondary: "#047857",
        text: "#1f2937",
        textLight: "#4b5563",
        textMuted: "#6b7280",
        border: "#e5e7eb",
      },
      gray: {
        primary: "#374151",
        secondary: "#4b5563",
        text: "#1f2937",
        textLight: "#6b7280",
        textMuted: "#9ca3af",
        border: "#e5e7eb",
      },
    };

    // Select theme based on resumeData or default to navy
    const selectedTheme =
      colorThemes[resumeData?.colorTheme] || colorThemes.navy;

<<<<<<< HEAD
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
      "skills",
      "experience",
      "projects",
      "education",
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
        summary: "Executive Summary",
        skills: "Core Competencies",
        experience: "Professional Experience",
        projects: "Key Projects",
        education: "Education",
        certifications: "Certifications",
        achievements: "Achievements",
      };
      return (
        customTitles[sectionId] ||
        defaultTitles[sectionId] ||
        sectionId
      ).toUpperCase();
    };

=======
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

    // Log content density for debugging
    console.log(
      `📊 ProfessionalTemplate Content Density: ${contentDensity} (low < 15, medium 15-30, high > 30)`
    );

    // Dynamic styling based on content density
    const getDynamicStyles = () => {
      switch (contentDensity) {
        case "low":
          return {
            containerPadding: "0.5in",
            fontSize: "10.5pt",
            lineHeight: "1.4",
            headerMarginBottom: "14px",
            headerPaddingBottom: "10px",
            nameSize: "24pt",
            nameMarginBottom: "8px",
            contactSize: "10pt",
            contactGap: "6px",
            locationMarginTop: "4px",
            sectionMarginBottom: "12px",
            sectionHeadingSize: "11pt",
            sectionHeadingMarginBottom: "6px",
            sectionHeadingPaddingBottom: "3px",
            summarySize: "10pt",
            summaryLineHeight: "1.5",
            skillsSize: "10pt",
            skillsGap: "6px",
            experienceMarginBottom: "12px",
            experienceItemMarginBottom: "3px",
            experienceTitleSize: "11pt",
            experienceCompanySize: "10pt",
            experienceDateSize: "9pt",
            experienceBulletSize: "10pt",
            experienceBulletMarginBottom: "2px",
            experienceBulletLineHeight: "1.4",
            projectMarginBottom: "10px",
            projectTitleSize: "11pt",
            projectLinkSize: "9pt",
            projectTechSize: "9pt",
            projectTechMarginBottom: "3px",
            projectBulletSize: "10pt",
            projectBulletMarginBottom: "2px",
            projectBulletLineHeight: "1.4",
            educationMarginBottom: "8px",
            educationDegreeSize: "10pt",
            educationInstitutionSize: "10pt",
            educationDateSize: "9pt",
            certificationSize: "10pt",
            certificationGap: "6px",
            certificationIssuerSize: "9pt",
            achievementSize: "10pt",
            achievementMarginBottom: "3px",
            achievementLineHeight: "1.4",
          };
        case "medium":
          return {
            containerPadding: "0.45in 0.5in",
            fontSize: "10pt",
            lineHeight: "1.35",
            headerMarginBottom: "12px",
            headerPaddingBottom: "9px",
            nameSize: "23pt",
            nameMarginBottom: "7px",
            contactSize: "9.5pt",
            contactGap: "5px",
            locationMarginTop: "3.5px",
            sectionMarginBottom: "10px",
            sectionHeadingSize: "10.5pt",
            sectionHeadingMarginBottom: "5px",
            sectionHeadingPaddingBottom: "2.5px",
            summarySize: "9.5pt",
            summaryLineHeight: "1.45",
            skillsSize: "9.5pt",
            skillsGap: "5px",
            experienceMarginBottom: "10px",
            experienceItemMarginBottom: "2.5px",
            experienceTitleSize: "10.5pt",
            experienceCompanySize: "9.5pt",
            experienceDateSize: "8.5pt",
            experienceBulletSize: "9.5pt",
            experienceBulletMarginBottom: "1.5px",
            experienceBulletLineHeight: "1.35",
            projectMarginBottom: "8.5px",
            projectTitleSize: "10.5pt",
            projectLinkSize: "8.5pt",
            projectTechSize: "8.5pt",
            projectTechMarginBottom: "2.5px",
            projectBulletSize: "9.5pt",
            projectBulletMarginBottom: "1.5px",
            projectBulletLineHeight: "1.35",
            educationMarginBottom: "7px",
            educationDegreeSize: "9.5pt",
            educationInstitutionSize: "9.5pt",
            educationDateSize: "8.5pt",
            certificationSize: "9.5pt",
            certificationGap: "5px",
            certificationIssuerSize: "8.5pt",
            achievementSize: "9.5pt",
            achievementMarginBottom: "2.5px",
            achievementLineHeight: "1.35",
          };
        case "high":
        default:
          return {
            containerPadding: "0.4in 0.5in",
            fontSize: "9.5pt",
            lineHeight: "1.3",
            headerMarginBottom: "10px",
            headerPaddingBottom: "8px",
            nameSize: "22pt",
            nameMarginBottom: "6px",
            contactSize: "9pt",
            contactGap: "4px",
            locationMarginTop: "3px",
            sectionMarginBottom: "8px",
            sectionHeadingSize: "10pt",
            sectionHeadingMarginBottom: "4px",
            sectionHeadingPaddingBottom: "2px",
            summarySize: "9pt",
            summaryLineHeight: "1.4",
            skillsSize: "9pt",
            skillsGap: "4px",
            experienceMarginBottom: "8px",
            experienceItemMarginBottom: "2px",
            experienceTitleSize: "10pt",
            experienceCompanySize: "9pt",
            experienceDateSize: "8.5pt",
            experienceBulletSize: "9pt",
            experienceBulletMarginBottom: "1px",
            experienceBulletLineHeight: "1.3",
            projectMarginBottom: "7px",
            projectTitleSize: "10pt",
            projectLinkSize: "8.5pt",
            projectTechSize: "8.5pt",
            projectTechMarginBottom: "2px",
            projectBulletSize: "9pt",
            projectBulletMarginBottom: "1px",
            projectBulletLineHeight: "1.3",
            educationMarginBottom: "6px",
            educationDegreeSize: "9.5pt",
            educationInstitutionSize: "9pt",
            educationDateSize: "8.5pt",
            certificationSize: "9pt",
            certificationGap: "4px",
            certificationIssuerSize: "8.5pt",
            achievementSize: "9pt",
            achievementMarginBottom: "2px",
            achievementLineHeight: "1.3",
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
      "skills",
      "experience",
      "projects",
      "education",
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
        summary: "Executive Summary",
        skills: "Core Competencies",
        experience: "Professional Experience",
        projects: "Key Projects",
        education: "Education",
        certifications: "Certifications",
        achievements: "Achievements",
      };
      return (
        customTitles[sectionId] ||
        defaultTitles[sectionId] ||
        sectionId
      ).toUpperCase();
    };

>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
    // Render section helper function
    const renderSection = (sectionId) => {
      // Common style to prevent page breaks inside sections
      const sectionStyle = {
<<<<<<< HEAD
        marginBottom: "14px",
=======
        marginBottom: dynamicStyles.sectionMarginBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
        pageBreakInside: "avoid",
        breakInside: "avoid",
      };

      const sections = {
        summary: resumeData.summary && (
          <section key="summary" style={sectionStyle}>
            <h2
              className="font-bold uppercase"
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
                borderBottom: `2px solid ${selectedTheme.border}`,
              }}
            >
              {getSectionTitle("summary")}
            </h2>
            <p
              style={{
<<<<<<< HEAD
                fontSize: "10pt",
                textAlign: "justify",
                lineHeight: "1.5",
=======
                fontSize: dynamicStyles.summarySize,
                textAlign: "justify",
                lineHeight: dynamicStyles.summaryLineHeight,
                color: selectedTheme.text,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
              }}
            >
              {resumeData.summary}
            </p>
          </section>
        ),

        skills: resumeData.skills && resumeData.skills.length > 0 && (
          <section key="skills" style={sectionStyle}>
            <h2
              className="font-bold uppercase"
              style={{
<<<<<<< HEAD
                fontSize: "11pt",
                color: selectedTheme.primary,
                marginBottom: "6px",
                paddingBottom: "3px",
=======
                fontSize: dynamicStyles.sectionHeadingSize,
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                borderBottom: `2px solid ${selectedTheme.border}`,
              }}
            >
              {getSectionTitle("skills")}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
<<<<<<< HEAD
                gap: "8px",
              }}
            >
              {resumeData.skills.map((skillGroup, index) => (
                <div key={index} style={{fontSize: "10pt"}}>
                  <div
                    className="font-semibold"
                    style={{color: selectedTheme.primary, marginBottom: "2px"}}
=======
                gap: dynamicStyles.skillsGap,
              }}
            >
              {resumeData.skills.map((skillGroup, index) => (
                <div key={index} style={{fontSize: dynamicStyles.skillsSize}}>
                  <div
                    className="font-semibold"
                    style={{color: selectedTheme.primary, marginBottom: "1px"}}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                  >
                    {skillGroup.category}
                  </div>
                  <div style={{color: selectedTheme.textLight}}>
                    {formatSkills(skillGroup.items)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ),

        experience: resumeData.experience &&
          resumeData.experience.length > 0 && (
            <section key="experience" style={sectionStyle}>
              <h2
                className="font-bold uppercase"
                style={{
<<<<<<< HEAD
                  fontSize: "11pt",
                  color: selectedTheme.primary,
                  marginBottom: "6px",
                  paddingBottom: "3px",
=======
                  fontSize: dynamicStyles.sectionHeadingSize,
                  color: selectedTheme.primary,
                  marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                  paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                  borderBottom: `2px solid ${selectedTheme.border}`,
                }}
              >
                {getSectionTitle("experience")}
              </h2>
              {resumeData.experience.map((exp, index) => (
<<<<<<< HEAD
                <div key={index} style={{marginBottom: "12px"}}>
                  <div
                    className="flex justify-between items-start"
                    style={{marginBottom: "3px"}}
=======
                <div
                  key={index}
                  style={{marginBottom: dynamicStyles.experienceMarginBottom}}
                >
                  <div
                    className="flex justify-between items-start"
                    style={{
                      marginBottom: dynamicStyles.experienceItemMarginBottom,
                    }}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                  >
                    <div style={{flex: 1}}>
                      <div
                        className="font-bold"
<<<<<<< HEAD
                        style={{fontSize: "11pt", color: selectedTheme.primary}}
                      >
                        {exp.title || "Position"}
                      </div>
                      <div style={{fontSize: "10pt", fontWeight: 600}}>
=======
                        style={{
                          fontSize: dynamicStyles.experienceTitleSize,
                          color: selectedTheme.primary,
                        }}
                      >
                        {exp.title || "Position"}
                      </div>
                      <div
                        style={{
                          fontSize: dynamicStyles.experienceCompanySize,
                          fontWeight: 600,
                          color: selectedTheme.text,
                        }}
                      >
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                        {exp.company}
                      </div>
                    </div>
                    <div
                      style={{
<<<<<<< HEAD
                        fontSize: "9pt",
=======
                        fontSize: dynamicStyles.experienceDateSize,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                        color: selectedTheme.textMuted,
                        textAlign: "right",
                      }}
                    >
<<<<<<< HEAD
                      <div>{exp.location}</div>
=======
                      {exp.location && <div>{exp.location}</div>}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                      <div>
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </div>
                    </div>
                  </div>
<<<<<<< HEAD
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul
                      className="list-disc list-outside ml-5"
                      style={{marginTop: "4px"}}
                    >
                      {exp.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          style={{fontSize: "10pt", marginBottom: "2px"}}
                        >
                          {bullet}
                        </li>
                      ))}
=======

                  {/* Experience Description/Bullets */}
                  {exp.description && (
                    <p
                      style={{
                        fontSize: dynamicStyles.experienceBulletSize,
                        marginTop: "4px",
                        marginBottom:
                          dynamicStyles.experienceBulletMarginBottom,
                        lineHeight: dynamicStyles.experienceBulletLineHeight,
                        color: selectedTheme.text,
                      }}
                    >
                      {exp.description}
                    </p>
                  )}

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul
                      style={{
                        marginTop: "4px",
                        marginLeft: "20px",
                        listStyleType: "disc",
                        listStylePosition: "outside",
                      }}
                    >
                      {exp.bullets
                        .filter((bullet) => bullet && bullet.trim())
                        .map((bullet, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: dynamicStyles.experienceBulletSize,
                              marginBottom:
                                dynamicStyles.experienceBulletMarginBottom,
                              lineHeight:
                                dynamicStyles.experienceBulletLineHeight,
                              color: selectedTheme.text,
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
                        marginLeft: "20px",
                        listStyleType: "disc",
                        listStylePosition: "outside",
                      }}
                    >
                      {exp.achievements
                        .filter(
                          (achievement) => achievement && achievement.trim()
                        )
                        .map((achievement, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: dynamicStyles.experienceBulletSize,
                              marginBottom:
                                dynamicStyles.experienceBulletMarginBottom,
                              lineHeight:
                                dynamicStyles.experienceBulletLineHeight,
                              color: selectedTheme.text,
                            }}
                          >
                            {achievement}
                          </li>
                        ))}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                    </ul>
                  )}
                </div>
              ))}
            </section>
          ),

        projects: resumeData.projects && resumeData.projects.length > 0 && (
          <section key="projects" style={sectionStyle}>
            <h2
              className="font-bold uppercase"
              style={{
                fontSize: dynamicStyles.sectionHeadingSize,
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
                borderBottom: `2px solid ${selectedTheme.border}`,
              }}
            >
              {getSectionTitle("projects")}
            </h2>
            {resumeData.projects.map((project, index) => (
<<<<<<< HEAD
              <div key={index} style={{marginBottom: "10px"}}>
=======
              <div
                key={index}
                style={{marginBottom: dynamicStyles.projectMarginBottom}}
              >
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
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
<<<<<<< HEAD
                    style={{fontSize: "11pt", color: selectedTheme.primary}}
=======
                    style={{
                      fontSize: dynamicStyles.projectTitleSize,
                      color: selectedTheme.primary,
                    }}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                  >
                    {project.name}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
<<<<<<< HEAD
                        fontSize: "9pt",
=======
                        fontSize: dynamicStyles.projectLinkSize,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                        color: selectedTheme.primary,
                        textDecoration: "underline",
                        whiteSpace: "nowrap",
                      }}
                    >
                      🔗 View Project
                    </a>
                  )}
                </div>
                {project.technologies && (
                  <div
                    style={{
<<<<<<< HEAD
                      fontSize: "9pt",
                      color: selectedTheme.textMuted,
                      marginBottom: "3px",
=======
                      fontSize: dynamicStyles.projectTechSize,
                      color: selectedTheme.textMuted,
                      marginBottom: dynamicStyles.projectTechMarginBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                      fontStyle: "italic",
                    }}
                  >
                    Technologies:{" "}
                    {Array.isArray(project.technologies)
                      ? project.technologies.join(" | ")
                      : project.technologies}
                  </div>
                )}
<<<<<<< HEAD
                {project.bullets && project.bullets.length > 0 && (
                  <ul
                    className="list-disc list-outside ml-5"
                    style={{marginTop: "3px"}}
                  >
                    {project.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        style={{fontSize: "10pt", marginBottom: "2px"}}
                      >
                        {bullet}
                      </li>
                    ))}
=======

                {/* Project Description */}
                {project.description && (
                  <p
                    style={{
                      fontSize: dynamicStyles.projectBulletSize,
                      marginTop: "4px",
                      marginBottom: dynamicStyles.projectBulletMarginBottom,
                      lineHeight: dynamicStyles.projectBulletLineHeight,
                      color: selectedTheme.text,
                    }}
                  >
                    {project.description}
                  </p>
                )}

                {project.bullets && project.bullets.length > 0 && (
                  <ul
                    style={{
                      marginTop: "4px",
                      marginLeft: "20px",
                      listStyleType: "disc",
                      listStylePosition: "outside",
                    }}
                  >
                    {project.bullets
                      .filter((bullet) => bullet && bullet.trim())
                      .map((bullet, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: dynamicStyles.projectBulletSize,
                            marginBottom:
                              dynamicStyles.projectBulletMarginBottom,
                            lineHeight: dynamicStyles.projectBulletLineHeight,
                            color: selectedTheme.text,
                          }}
                        >
                          {bullet}
                        </li>
                      ))}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                  </ul>
                )}
              </div>
            ))}
          </section>
        ),

        education: resumeData.education && resumeData.education.length > 0 && (
          <section key="education" style={sectionStyle}>
            <h2
              className="font-bold uppercase"
              style={{
<<<<<<< HEAD
                fontSize: "11pt",
                color: selectedTheme.primary,
                marginBottom: "6px",
                paddingBottom: "3px",
=======
                fontSize: dynamicStyles.sectionHeadingSize,
                color: selectedTheme.primary,
                marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                borderBottom: `2px solid ${selectedTheme.border}`,
              }}
            >
              {getSectionTitle("education")}
            </h2>
            {resumeData.education.map((edu, index) => (
<<<<<<< HEAD
              <div key={index} style={{marginBottom: "8px"}}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="font-bold" style={{fontSize: "10pt"}}>
=======
              <div
                key={index}
                style={{marginBottom: dynamicStyles.educationMarginBottom}}
              >
                <div className="flex justify-between items-baseline">
                  <div>
                    <div
                      className="font-bold"
                      style={{fontSize: dynamicStyles.educationDegreeSize}}
                    >
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </div>
                    <div
<<<<<<< HEAD
                      style={{fontSize: "10pt", color: selectedTheme.textLight}}
=======
                      style={{
                        fontSize: dynamicStyles.educationInstitutionSize,
                        color: selectedTheme.textLight,
                      }}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                    >
                      {edu.institution}
                      {edu.location && <span> — {edu.location}</span>}
                    </div>
                  </div>
                  <div
<<<<<<< HEAD
                    style={{fontSize: "9pt", color: selectedTheme.textMuted}}
=======
                    style={{
                      fontSize: dynamicStyles.educationDateSize,
                      color: selectedTheme.textMuted,
                    }}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                  >
                    {edu.startDate && (
                      <div>
                        {edu.startDate} - {edu.endDate}
                      </div>
                    )}
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        ),

        certifications: resumeData.certifications &&
          resumeData.certifications.length > 0 && (
            <section key="certifications" style={sectionStyle}>
              <h2
                className="font-bold uppercase"
                style={{
<<<<<<< HEAD
                  fontSize: "11pt",
                  color: selectedTheme.primary,
                  marginBottom: "6px",
                  paddingBottom: "3px",
=======
                  fontSize: dynamicStyles.sectionHeadingSize,
                  color: selectedTheme.primary,
                  marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                  paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                  borderBottom: `2px solid ${selectedTheme.border}`,
                }}
              >
                {getSectionTitle("certifications")}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
<<<<<<< HEAD
                  gap: "6px",
                }}
              >
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} style={{fontSize: "10pt"}}>
=======
                  gap: dynamicStyles.certificationGap,
                }}
              >
                {resumeData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    style={{fontSize: dynamicStyles.certificationSize}}
                  >
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                    <span className="font-semibold">{cert.name}</span>
                    {cert.issuer && (
                      <div
                        style={{
<<<<<<< HEAD
                          fontSize: "9pt",
=======
                          fontSize: dynamicStyles.certificationIssuerSize,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                          color: selectedTheme.textMuted,
                        }}
                      >
                        {cert.issuer} {cert.date && `(${cert.date})`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ),

        achievements: resumeData.achievements &&
          resumeData.achievements.length > 0 && (
            <section key="achievements" style={sectionStyle}>
              <h2
                className="font-bold uppercase"
                style={{
<<<<<<< HEAD
                  fontSize: "11pt",
                  color: selectedTheme.primary,
                  marginBottom: "6px",
                  paddingBottom: "3px",
=======
                  fontSize: dynamicStyles.sectionHeadingSize,
                  color: selectedTheme.primary,
                  marginBottom: dynamicStyles.sectionHeadingMarginBottom,
                  paddingBottom: dynamicStyles.sectionHeadingPaddingBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                  borderBottom: `2px solid ${selectedTheme.border}`,
                }}
              >
                {getSectionTitle("achievements")}
              </h2>
              <ul
                className="list-disc list-outside ml-5"
<<<<<<< HEAD
                style={{marginTop: "4px"}}
=======
                style={{marginTop: "2px"}}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
              >
                {resumeData.achievements.map((achievement, index) => (
                  <li
                    key={index}
<<<<<<< HEAD
                    style={{fontSize: "10pt", marginBottom: "3px"}}
=======
                    style={{
                      fontSize: dynamicStyles.achievementSize,
                      marginBottom: dynamicStyles.achievementMarginBottom,
                      lineHeight: dynamicStyles.achievementLineHeight,
                    }}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
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
                if (
                  section.title &&
                  section.items &&
                  section.items.length > 0
                ) {
                  return (
                    <section key={sectionIndex} style={sectionStyle}>
                      <h2
                        className="font-bold uppercase"
                        style={{
<<<<<<< HEAD
                          fontSize: "11pt",
                          color: selectedTheme.primary,
                          marginBottom: "6px",
                          paddingBottom: "3px",
=======
                          fontSize: dynamicStyles.sectionHeadingSize,
                          color: selectedTheme.primary,
                          marginBottom:
                            dynamicStyles.sectionHeadingMarginBottom,
                          paddingBottom:
                            dynamicStyles.sectionHeadingPaddingBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                          borderBottom: `2px solid ${selectedTheme.border}`,
                        }}
                      >
                        {section.title}
                      </h2>
                      <ul
                        className="list-disc list-outside ml-5"
<<<<<<< HEAD
                        style={{marginTop: "4px"}}
=======
                        style={{marginTop: "2px"}}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                      >
                        {section.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
<<<<<<< HEAD
                            style={{fontSize: "10pt", marginBottom: "3px"}}
=======
                            style={{
                              fontSize: dynamicStyles.achievementSize,
                              marginBottom:
                                dynamicStyles.achievementMarginBottom,
                              lineHeight: dynamicStyles.achievementLineHeight,
                            }}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
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
<<<<<<< HEAD
          padding: "0.5in",
          fontSize: "10.5pt",
          lineHeight: "1.35",
=======
          padding: dynamicStyles.containerPadding,
          fontSize: dynamicStyles.fontSize,
          lineHeight: dynamicStyles.lineHeight,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
          color: "#000000",
        }}
      >
        {/* Header - Professional Two-Column Layout */}
        <header
          style={{
<<<<<<< HEAD
            marginBottom: "16px",
            paddingBottom: "12px",
=======
            marginBottom: dynamicStyles.headerMarginBottom,
            paddingBottom: dynamicStyles.headerPaddingBottom,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
            borderBottom: "3px solid #2563eb",
          }}
        >
          <h1
            className="font-bold"
<<<<<<< HEAD
            style={{
              fontSize: "24pt",
              marginBottom: "8px",
              color: selectedTheme.primary,
            }}
          >
            {resumeData.name || "Your Name"}
          </h1>
          <div
            style={{
              fontSize: "10pt",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              color: "#374151",
            }}
          >
=======
            style={{
              fontSize: dynamicStyles.nameSize,
              marginBottom: dynamicStyles.nameMarginBottom,
              color: selectedTheme.primary,
            }}
          >
            {resumeData.name || "Your Name"}
          </h1>
          <div
            style={{
              fontSize: dynamicStyles.contactSize,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: dynamicStyles.contactGap,
              color: "#374151",
            }}
          >
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
            <div>
              {resumeData.contact?.email && (
                <div>✉ {resumeData.contact.email}</div>
              )}
              {resumeData.contact?.phone && (
                <div>📞 {resumeData.contact.phone}</div>
              )}
            </div>
            <div>
              {resumeData.contact?.linkedin && (
                <div>
                  <a
                    href={resumeData.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: selectedTheme.primary,
                      textDecoration: "underline",
                    }}
                  >
                    🔗 LinkedIn
                  </a>
                </div>
              )}
              {resumeData.contact?.github && (
                <div>
                  <a
                    href={resumeData.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: selectedTheme.primary,
                      textDecoration: "underline",
                    }}
                  >
                    💻 GitHub
                  </a>
                </div>
              )}
            </div>
          </div>
          {resumeData.contact?.location && (
            <div
              style={{
<<<<<<< HEAD
                fontSize: "10pt",
                marginTop: "4px",
=======
                fontSize: dynamicStyles.contactSize,
                marginTop: dynamicStyles.locationMarginTop,
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                color: selectedTheme.textMuted,
              }}
            >
              📍 {resumeData.contact.location}
            </div>
          )}
        </header>

        {/* Dynamic sections based on sectionOrder */}
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    );
  }
);

ProfessionalTemplate.displayName = "ProfessionalTemplate";

export default ProfessionalTemplate;
