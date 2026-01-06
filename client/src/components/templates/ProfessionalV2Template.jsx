import {forwardRef, useRef, useEffect, useState} from "react";
<<<<<<< HEAD

=======
import {Mail, Phone, MapPin, Linkedin, Github, Globe} from "lucide-react";

/**
 * ProfessionalV2Template - Enhanced version of ProfessionalTemplate with improved spacing
 *
 * Features:
 * - Refined professional layout with optimized whitespace
 * - Lucide React icons for contact information
 * - Multiple color themes (blue, teal, purple, green, orange, gray)
 * - Improved section spacing for better readability
 * - Automatic page overflow detection
 * - ATS-compatible structure with enhanced visual hierarchy
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.resumeData - Complete resume data object (same structure as ClassicTemplate)
 * @param {string} [props.resumeData.selectedTheme] - Color theme (blue, teal, purple, green, orange, gray)
 * @param {Function} [props.onPageUsageChange] - Callback for page overflow detection
 * @param {React.Ref} ref - Forwarded ref for PDF generation
 *
 * @example
 * <ProfessionalV2Template
 *   ref={templateRef}
 *   resumeData={{ name: "Riley Kim", contact: { email: "riley@example.com" }, selectedTheme: "teal" }}
 * />
 */
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
const ProfessionalV2Template = forwardRef(
  ({resumeData, onPageUsageChange}, ref) => {
    // Page overflow detection state
    const containerRef = useRef(null);
    const [pageOverflowInfo, setPageOverflowInfo] = useState({
      isOverflowing: false,
      currentHeight: 0,
      maxHeight: 1056, // Standard A4 page height at 96 DPI (11 inches * 96)
      overflowPercentage: 0,
      templateName: "ProfessionalV2Template",
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
          templateName: "ProfessionalV2Template",
        };

        setPageOverflowInfo(usageInfo);

        // Log overflow information for testing
        if (isOverflowing) {
          console.log(
            `⚠️ ProfessionalV2Template: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
          );
        } else {
          console.log(
            `✅ ProfessionalV2Template: Content fits on one page. Height: ${currentHeight}px / ${maxHeight}px (${usageInfo.percentage}% filled)`
          );
        }

        // Pass data to parent component if callback provided
        if (onPageUsageChange) {
          onPageUsageChange(usageInfo);
        }
      }
    }, [resumeData]);

    // Color Themes - Multiple professional palettes
    const colorThemes = {
      blue: {
        primary: "#1d4ed8",
        secondary: "#2563eb",
        accent: "#3b82f6",
        text: "#111827",
        textLight: "#4b5563",
        textMuted: "#6b7280",
      },
      purple: {
        primary: "#7e22ce",
        secondary: "#9333ea",
        accent: "#a855f7",
        text: "#111827",
        textLight: "#4b5563",
        textMuted: "#6b7280",
      },
      teal: {
        primary: "#0f766e",
        secondary: "#14b8a6",
        accent: "#2dd4bf",
        text: "#111827",
        textLight: "#4b5563",
        textMuted: "#6b7280",
      },
      burgundy: {
        primary: "#9f1239",
        secondary: "#be123c",
        accent: "#e11d48",
        text: "#111827",
        textLight: "#4b5563",
        textMuted: "#6b7280",
      },
    };

    // Select theme based on resumeData or default to blue
    const selectedTheme =
      colorThemes[resumeData?.colorTheme] || colorThemes.blue;

    // Helper function to safely format skills (returns array)
    const formatSkills = (items) => {
      if (!items) return [];

      if (Array.isArray(items)) {
        return items
          .flatMap((item) => {
            if (typeof item === "string") return [item];
            if (item.items && Array.isArray(item.items))
              return formatSkills(item.items);
            if (item.category || item.name) return [item.category || item.name];
            return [];
          })
          .filter(Boolean);
      }

      if (typeof items === "string") {
        return [items];
      }

      return [];
    };

    // Default section order - Complete list for single column design
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

    // Helper: Get section title
    const getSectionTitle = (sectionId) => {
      const customTitles = resumeData.sectionTitles || {};
      const defaultTitles = {
        experience: "Professional Experience",
        projects: "Projects",
        education: "Education",
        certifications: "Certifications",
        achievements: "Achievements",
        customSections: "Additional Information",
      };
      return customTitles[sectionId] || defaultTitles[sectionId] || sectionId;
    };

    // Helper: Check if section has content
    const hasContent = (section) => {
      if (!section) return false;
      if (Array.isArray(section)) return section.length > 0;
      if (typeof section === "string") return section.trim().length > 0;
      if (typeof section === "object") return Object.keys(section).length > 0;
      return false;
    };

    // Helper: Truncate text
    const truncateText = (text, lines = 4) => {
      if (!text) return "";
      const words = text.split(" ");
      if (words.length <= 50) return text;
      return words.slice(0, 50).join(" ") + "...";
    };

    // Section styling with page break prevention
    const sectionStyle = {
      marginBottom: "24px",
      pageBreakInside: "avoid",
      breakInside: "avoid",
    };

    // Render sections dynamically
    const renderSection = (sectionId) => {
      const sections = {
        summary: resumeData.summary && (
          <section
            key="summary"
            className="resume-section"
            style={sectionStyle}
          >
            <h2 className="section-title">Professional Summary</h2>
            <div className="section-content">
              <p className="summary-text">{resumeData.summary}</p>
            </div>
          </section>
        ),

        skills: hasContent(resumeData.skills) && (
          <section key="skills" className="resume-section" style={sectionStyle}>
            <h2 className="section-title">{getSectionTitle("skills")}</h2>
            <div className="section-content">
              <div className="skills-container">
                {formatSkills(resumeData.skills).map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ),

        experience: hasContent(resumeData.experience) && (
          <section
            key="experience"
            className="resume-section"
            style={sectionStyle}
          >
            <h2 className="section-title">{getSectionTitle("experience")}</h2>
            <div className="section-content">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="experience-item"
                  style={{
                    ...sectionStyle,
                    animation: `fadeInHighlight 0.5s ease ${index * 0.1}s`,
                  }}
                >
                  <div className="experience-header">
                    <div className="experience-left">
                      <h3 className="experience-role">
                        {exp.position || exp.title}
                      </h3>
                      <p className="experience-company">{exp.company}</p>
                    </div>
                    <div className="experience-right">
                      <p className="experience-duration">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </p>
                      {exp.location && (
                        <p className="experience-location">{exp.location}</p>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="experience-description">{exp.description}</p>
                  )}
                  {hasContent(exp.bullets || exp.highlights) && (
                    <ul className="experience-bullets">
                      {(exp.bullets || exp.highlights).map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ),

        projects: hasContent(resumeData.projects) && (
          <section
            key="projects"
            className="resume-section"
            style={sectionStyle}
          >
            <h2 className="section-title">{getSectionTitle("projects")}</h2>
            <div className="section-content">
              {resumeData.projects.map((project, index) => (
                <div
                  key={index}
                  className="project-item"
                  style={{
                    ...sectionStyle,
                    animation: `fadeInHighlight 0.5s ease ${index * 0.1}s`,
                  }}
                >
                  <div className="project-header">
                    <h3 className="project-name">
                      {project.name || project.title}
                      {project.source === "github" && (
                        <span className="github-tag">
                          <Github size={12} /> GitHub
                        </span>
                      )}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                  {hasContent(project.technologies || project.techStack) && (
                    <div className="project-tech">
                      <strong>Tech Stack:</strong>{" "}
                      {Array.isArray(project.technologies || project.techStack)
                        ? (project.technologies || project.techStack).join(", ")
                        : project.technologies || project.techStack}
                    </div>
                  )}
                  {hasContent(project.bullets || project.highlights) && (
                    <ul className="project-bullets">
                      {(project.bullets || project.highlights).map(
                        (bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ),

        education: hasContent(resumeData.education) && (
          <section
            key="education"
            className="resume-section"
            style={sectionStyle}
          >
            <h2 className="section-title">{getSectionTitle("education")}</h2>
            <div className="section-content">
              {resumeData.education.map((edu, index) => (
                <div
                  key={index}
                  className="education-item"
                  style={sectionStyle}
                >
                  <div className="education-header">
                    <div className="education-left">
                      <h3 className="education-degree">{edu.degree}</h3>
                      <p className="education-institution">{edu.institution}</p>
                      {edu.field && (
                        <p className="education-field">Major: {edu.field}</p>
                      )}
                    </div>
                    <div className="education-right">
                      <p className="education-duration">
                        {edu.startDate} - {edu.endDate}
                      </p>
                      {edu.gpa && (
                        <p className="education-gpa">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                  {hasContent(edu.achievements) && (
                    <ul className="education-achievements">
                      {edu.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ),

        certifications: hasContent(resumeData.certifications) && (
          <section
            key="certifications"
            className="resume-section"
            style={sectionStyle}
          >
            <h2 className="section-title">
              {getSectionTitle("certifications")}
            </h2>
            <div className="section-content">
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="certification-item"
                  style={sectionStyle}
                >
                  <div className="certification-header">
                    <h3 className="certification-title">{cert.title}</h3>
                    {cert.date && (
                      <span className="certification-date">{cert.date}</span>
                    )}
                  </div>
                  <p className="certification-issuer">{cert.issuer}</p>
                  {cert.description && (
                    <p className="certification-description">
                      {cert.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ),

        achievements: hasContent(resumeData.achievements) && (
          <section
            key="achievements"
            className="resume-section"
            style={sectionStyle}
          >
            <h2 className="section-title">{getSectionTitle("achievements")}</h2>
            <div className="section-content">
              <ul className="achievements-list">
                {resumeData.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          </section>
        ),

        customSections:
          hasContent(resumeData.customSections) &&
          resumeData.customSections.map((section, index) => (
            <section
              key={`custom-${index}`}
              className="resume-section"
              style={sectionStyle}
            >
              <h2 className="section-title">{section.title}</h2>
              <div className="section-content">
                <p style={{whiteSpace: "pre-wrap"}}>{section.content}</p>
              </div>
            </section>
          )),
      };

      return sections[sectionId];
    };

    return (
      <div
        ref={(el) => {
          containerRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        className="professional-v2-template"
      >
        <div className="template-container">
          {/* Unique Header Design */}
          <header className="resume-header" style={sectionStyle}>
            <div className="header-top">
              <div className="header-left">
                <h1 className="header-name">
                  {resumeData.personalInfo?.fullName || "Your Name"}
                </h1>
                {resumeData.personalInfo?.title && (
                  <p className="header-title">
                    {resumeData.personalInfo.title}
                  </p>
                )}
              </div>
              {resumeData.personalInfo?.photo && (
                <div className="header-photo">
                  <img
                    src={resumeData.personalInfo.photo}
                    alt={resumeData.personalInfo?.fullName}
                  />
                </div>
              )}
            </div>

            {/* Contact Info Bar */}
            <div className="contact-bar">
              {resumeData.personalInfo?.email && (
                <div className="contact-item">
                  <Mail size={12} className="contact-icon" />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo?.phone && (
                <div className="contact-item">
                  <Phone size={12} className="contact-icon" />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo?.location && (
                <div className="contact-item">
                  <MapPin size={12} className="contact-icon" />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
              {resumeData.personalInfo?.linkedin && (
                <div className="contact-item">
                  <Linkedin size={12} className="contact-icon" />
                  <a
                    href={resumeData.personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              {resumeData.personalInfo?.github && (
                <div className="contact-item">
                  <Github size={12} className="contact-icon" />
                  <a
                    href={resumeData.personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              )}
              {resumeData.personalInfo?.website && (
                <div className="contact-item">
                  <Globe size={12} className="contact-icon" />
                  <a
                    href={resumeData.personalInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Portfolio
                  </a>
                </div>
              )}
            </div>

            {/* Languages inline if available */}
            {hasContent(resumeData.languages) && (
              <div className="languages-bar">
                <strong>Languages:</strong>
                {resumeData.languages.map((lang, index) => (
                  <span key={index} className="language-tag">
                    {typeof lang === "string"
                      ? lang
                      : `${lang.name}${
                          lang.proficiency ? ` (${lang.proficiency})` : ""
                        }`}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="main-content">
            {/* Dynamic Sections */}
            {sectionOrder.map((sectionId) => renderSection(sectionId))}
          </main>
        </div>

        {/* Styles */}
        <style jsx>{`
          .professional-v2-template {
<<<<<<< HEAD
            font-family: "Inter", "Roboto", "Source Sans Pro", -apple-system,
              BlinkMacSystemFont, sans-serif;
=======
            font-family:
              "Inter",
              "Roboto",
              "Source Sans Pro",
              -apple-system,
              BlinkMacSystemFont,
              sans-serif;
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
            background: white;
            color: #1a1a1a;
            line-height: 1.5;
          }

          .template-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
          }

          /* UNIQUE HEADER DESIGN */
          .resume-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            color: white;
            padding: 20px 24px 16px 24px;
            margin-bottom: 18px;
            border-radius: 0 0 8px 8px;
          }

          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 14px;
            gap: 16px;
          }

          .header-left {
            flex: 1;
          }

          .header-name {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin: 0 0 4px 0;
            letter-spacing: -0.5px;
          }

          .header-title {
            font-size: 15px;
            color: rgba(255, 255, 255, 0.95);
            margin: 0;
            font-weight: 500;
          }

          .header-photo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            flex-shrink: 0;
          }

          .header-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* CONTACT BAR */
          .contact-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 12px 16px;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 6px;
            margin-bottom: 10px;
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            color: white;
          }

          .contact-icon {
            flex-shrink: 0;
            color: white;
            opacity: 0.9;
          }

          .contact-item span {
            color: white;
          }

          .contact-item a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid rgba(255, 255, 255, 0.5);
          }

          .contact-item a:hover {
            border-bottom-color: white;
          }

          /* LANGUAGES BAR */
          .languages-bar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            color: white;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }

          .languages-bar strong {
            color: white;
            font-weight: 600;
          }

          .language-tag {
            background: rgba(255, 255, 255, 0.2);
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 500;
            color: white;
          }

          /* MAIN CONTENT */
          .main-content {
            padding: 0 24px 20px 24px;
          }

          /* SECTIONS */
          .resume-section {
            margin-bottom: 16px;
          }

          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin: 0 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #1e3a8a;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .section-title::before {
            content: "";
            width: 4px;
            height: 14px;
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            border-radius: 2px;
          }

          .section-content {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          /* SUMMARY */
          .summary-text {
            font-size: 12px;
            color: #1a1a1a;
            line-height: 1.6;
            margin: 0;
            text-align: justify;
          }

          /* SKILLS CONTAINER */
          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .skill-badge {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            color: white;
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.2s;
          }

          .skill-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(30, 58, 138, 0.3);
          }

          .skill-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(30, 58, 138, 0.3);
          }

          /* EXPERIENCE */
          .experience-item {
            padding: 10px 12px;
            border-left: 3px solid #2563eb;
            background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
            border-radius: 4px;
            transition: all 0.2s;
          }

          .experience-item:hover {
            background: #f1f5f9;
            border-left-color: #1e3a8a;
          }

          .experience-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            flex-wrap: wrap;
            gap: 6px;
          }

          .experience-left {
            flex: 1;
          }

          .experience-right {
            text-align: right;
          }

          .experience-role {
            font-size: 13px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 2px 0;
          }

          .experience-company {
            font-size: 12px;
            color: #1e3a8a;
            font-weight: 600;
            margin: 0;
          }

          .experience-duration {
            font-size: 11px;
            color: #1a1a1a;
            font-weight: 500;
            margin: 0 0 2px 0;
          }

          .experience-location {
            font-size: 10px;
            color: #64748b;
            margin: 0;
          }

          .experience-description {
            font-size: 12px;
            color: #1a1a1a;
            margin: 0 0 6px 0;
            line-height: 1.5;
          }

          .experience-bullets {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .experience-bullets li {
            font-size: 11px;
            color: #1a1a1a;
            padding-left: 14px;
            position: relative;
            margin-bottom: 3px;
            line-height: 1.5;
          }

          .experience-bullets li::before {
            content: "▸";
            position: absolute;
            left: 0;
            color: #2563eb;
            font-weight: bold;
          }

          /* PROJECTS */
          .project-item {
            padding: 10px 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            transition: all 0.2s;
            background: #fafafa;
          }

          .project-item:hover {
            border-color: #2563eb;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
            background: white;
          }

          .project-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            flex-wrap: wrap;
            gap: 6px;
          }

          .project-name {
            font-size: 13px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .github-tag {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: 600;
          }

          .project-link {
            font-size: 11px;
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
          }

          .project-link:hover {
            text-decoration: underline;
          }

          .project-description {
            font-size: 12px;
            color: #1a1a1a;
            margin: 0 0 6px 0;
            line-height: 1.5;
          }

          .project-tech {
            font-size: 11px;
            color: #1a1a1a;
            margin-bottom: 6px;
          }

          .project-tech strong {
            color: #1e3a8a;
            font-weight: 600;
          }

          .project-bullets {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .project-bullets li {
            font-size: 11px;
            color: #1a1a1a;
            padding-left: 14px;
            position: relative;
            margin-bottom: 3px;
            line-height: 1.5;
          }

          .project-bullets li::before {
            content: "▸";
            position: absolute;
            left: 0;
            color: #2563eb;
            font-weight: bold;
          }

          /* EDUCATION */
          .education-item {
            padding: 10px;
            background: #ffffff;
            border-radius: 3px;
            border-left: 3px solid #2563eb;
            transition: all 0.2s;
          }

          .education-item:hover {
            border-left-color: #1e3a8a;
            box-shadow: 0 1px 3px rgba(37, 99, 235, 0.1);
          }

          .education-header {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 6px;
          }

          .education-degree {
            font-size: 13px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0 0 2px 0;
          }

          .education-institution {
            font-size: 12px;
            color: #2563eb;
            font-weight: 600;
            margin: 0 0 2px 0;
          }

          .education-field {
            font-size: 11px;
            color: #1a1a1a;
            margin: 0;
          }

          .education-duration {
            font-size: 11px;
            color: #1a1a1a;
            font-weight: 500;
            margin: 0 0 2px 0;
          }

          .education-gpa {
            font-size: 11px;
            color: #2563eb;
            font-weight: 600;
            margin: 0;
          }

          .education-achievements {
            list-style: none;
            padding: 0;
            margin: 6px 0 0 0;
          }

          .education-achievements li {
            font-size: 11px;
            color: #1a1a1a;
            padding-left: 14px;
            position: relative;
            margin-bottom: 2px;
            line-height: 1.5;
          }

          .education-achievements li::before {
            content: "▸";
            position: absolute;
            left: 0;
            color: #2563eb;
            font-weight: bold;
          }

          /* CERTIFICATIONS */
          .certification-item {
            padding: 10px;
            border-left: 3px solid #2563eb;
            background: #ffffff;
            border-radius: 3px;
            transition: all 0.2s;
          }

          .certification-item:hover {
            border-left-color: #1e3a8a;
            box-shadow: 0 1px 3px rgba(37, 99, 235, 0.1);
          }

          .certification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3px;
            flex-wrap: wrap;
            gap: 4px;
          }

          .certification-title {
            font-size: 12px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0;
          }

          .certification-date {
            font-size: 10px;
            color: #1a1a1a;
            font-weight: 500;
          }

          .certification-issuer {
            font-size: 11px;
            color: #2563eb;
            font-weight: 600;
            margin: 0 0 3px 0;
          }

          .certification-description {
            font-size: 11px;
            color: #1a1a1a;
            line-height: 1.5;
            margin: 0;
          }

          /* ACHIEVEMENTS */
          .achievements-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .achievements-list li {
            font-size: 11px;
            color: #1a1a1a;
            padding-left: 14px;
            position: relative;
            margin-bottom: 3px;
            line-height: 1.5;
          }

          .achievements-list li::before {
            content: "★";
            position: absolute;
            left: 0;
            color: #2563eb;
            font-weight: bold;
          }

          /* ANIMATIONS */
          @keyframes fadeInHighlight {
            0% {
              opacity: 0;
              transform: translateY(10px);
              background: #fff8e1;
            }
            50% {
              background: #fff8e1;
            }
            100% {
              opacity: 1;
              transform: translateY(0);
              background: transparent;
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* PRINT STYLES */
          @media print {
            .professional-v2-template {
              background: white;
            }

            .resume-header {
              background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .expand-skills-btn,
            .read-more-btn {
              display: none;
            }

            .resume-section {
              page-break-inside: avoid;
            }
          }

          /* RESPONSIVE */
          @media (max-width: 768px) {
            .resume-header {
              padding: 16px;
            }

            .header-top {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }

            .header-photo {
              margin-top: 12px;
            }

            .contact-bar {
              flex-direction: column;
              gap: 8px;
              align-items: center;
            }

            .main-content {
              padding: 16px;
            }

            .experience-header,
            .education-header {
              flex-direction: column;
            }

            .experience-right,
            .education-right {
              text-align: left;
            }
          }
        `}</style>
      </div>
    );
  }
);

ProfessionalV2Template.displayName = "ProfessionalV2Template";

export default ProfessionalV2Template;
