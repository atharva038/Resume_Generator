import {forwardRef, useState} from "react";
import {Mail, Phone, MapPin, Github, Globe, Linkedin} from "lucide-react";

const ProfessionalV2Template = forwardRef(({resumeData}, ref) => {
  const [expandedSkills, setExpandedSkills] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState(false);

  // Default section order
  const DEFAULT_SECTION_ORDER = [
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
  ];

  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder.filter(
          (id) =>
            ![
              "score",
              "personal",
              "recommendations",
              "summary",
              "skills",
            ].includes(id)
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

  // Render sections dynamically
  const renderSection = (sectionId) => {
    const sections = {
      experience: hasContent(resumeData.experience) && (
        <section key="experience" className="resume-section animate-fade-in">
          <h2 className="section-title">{getSectionTitle("experience")}</h2>
          <div className="section-content">
            {resumeData.experience.map((exp, index) => (
              <div
                key={index}
                className="experience-item"
                style={{
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
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
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
        <section key="projects" className="resume-section animate-fade-in">
          <h2 className="section-title">{getSectionTitle("projects")}</h2>
          <div className="section-content">
            {resumeData.projects.map((project, index) => (
              <div
                key={index}
                className="project-item"
                style={{
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
        <section key="education" className="resume-section animate-fade-in">
          <h2 className="section-title">{getSectionTitle("education")}</h2>
          <div className="section-content">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item">
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
                    {edu.gpa && <p className="education-gpa">GPA: {edu.gpa}</p>}
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
          className="resume-section animate-fade-in"
        >
          <h2 className="section-title">{getSectionTitle("certifications")}</h2>
          <div className="section-content">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="certification-item">
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
        <section key="achievements" className="resume-section animate-fade-in">
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
            className="resume-section animate-fade-in"
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

  const visibleSkills = expandedSkills
    ? resumeData.skills
    : (resumeData.skills || []).slice(0, 10);

  const summaryText =
    expandedSummary || !resumeData.summary
      ? resumeData.summary
      : truncateText(resumeData.summary);

  return (
    <div ref={ref} className="professional-v2-template">
      <div className="template-container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          {/* Profile Photo */}
          {resumeData.personalInfo?.photo && (
            <div className="profile-photo">
              <img
                src={resumeData.personalInfo.photo}
                alt={resumeData.personalInfo?.fullName}
              />
            </div>
          )}

          {/* Contact Information */}
          <div className="sidebar-section">
            <h2 className="sidebar-title">Contact</h2>
            <div className="contact-list">
              {resumeData.personalInfo?.email && (
                <div className="contact-item">
                  <Mail size={14} className="contact-icon" />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo?.phone && (
                <div className="contact-item">
                  <Phone size={14} className="contact-icon" />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo?.location && (
                <div className="contact-item">
                  <MapPin size={14} className="contact-icon" />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
              {resumeData.personalInfo?.github && (
                <div className="contact-item">
                  <Github size={14} className="contact-icon" />
                  <a
                    href={resumeData.personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              )}
              {resumeData.personalInfo?.linkedin && (
                <div className="contact-item">
                  <Linkedin size={14} className="contact-icon" />
                  <a
                    href={resumeData.personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              {resumeData.personalInfo?.website && (
                <div className="contact-item">
                  <Globe size={14} className="contact-icon" />
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
          </div>

          {/* Skills Section */}
          {hasContent(resumeData.skills) && (
            <div className="sidebar-section">
              <h2 className="sidebar-title">Skills</h2>
              <div className="skills-list">
                {visibleSkills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {typeof skill === "string"
                      ? skill
                      : skill.name || skill.category}
                  </div>
                ))}
              </div>
              {resumeData.skills.length > 10 && (
                <button
                  className="expand-skills-btn"
                  onClick={() => setExpandedSkills(!expandedSkills)}
                >
                  {expandedSkills
                    ? "Show Less"
                    : `+${resumeData.skills.length - 10} More`}
                </button>
              )}
            </div>
          )}

          {/* Languages */}
          {hasContent(resumeData.languages) && (
            <div className="sidebar-section">
              <h2 className="sidebar-title">Languages</h2>
              <div className="languages-list">
                {resumeData.languages.map((lang, index) => (
                  <div key={index} className="language-item">
                    <span className="language-name">
                      {typeof lang === "string" ? lang : lang.name}
                    </span>
                    {lang.proficiency && (
                      <span className="language-proficiency">
                        {lang.proficiency}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Header */}
          <header className="resume-header">
            <h1 className="header-name">
              {resumeData.personalInfo?.fullName || "Your Name"}
            </h1>
            {resumeData.personalInfo?.title && (
              <p className="header-title">{resumeData.personalInfo.title}</p>
            )}
          </header>

          {/* Summary Section */}
          {resumeData.summary && (
            <section className="summary-section">
              <h2 className="section-title">About</h2>
              <p className="summary-text">{summaryText}</p>
              {resumeData.summary.split(" ").length > 50 && (
                <button
                  className="read-more-btn"
                  onClick={() => setExpandedSummary(!expandedSummary)}
                >
                  {expandedSummary ? "Read Less" : "Read More"}
                </button>
              )}
            </section>
          )}

          {/* Dynamic Sections */}
          {sectionOrder.map((sectionId) => renderSection(sectionId))}
        </main>
      </div>

      {/* Styles */}
      <style jsx>{`
        .professional-v2-template {
          font-family: "Inter", "Roboto", "Source Sans Pro", -apple-system,
            BlinkMacSystemFont, sans-serif;
          background: white;
          color: #1a1a1a;
          line-height: 1.6;
        }

        .template-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* SIDEBAR */
        .sidebar {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
          color: white;
          padding: 40px 24px;
        }

        .profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 24px;
          border: 4px solid rgba(255, 255, 255, 0.2);
        }

        .profile-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sidebar-section {
          margin-bottom: 32px;
        }

        .sidebar-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          padding-bottom: 8px;
        }

        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          word-break: break-word;
        }

        .contact-icon {
          flex-shrink: 0;
          opacity: 0.9;
        }

        .contact-item a {
          color: white;
          text-decoration: underline;
          text-decoration-color: rgba(255, 255, 255, 0.3);
        }

        .contact-item a:hover {
          text-decoration-color: white;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-tag {
          background: rgba(255, 255, 255, 0.15);
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }

        .expand-skills-btn {
          margin-top: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          width: 100%;
          transition: all 0.3s;
        }

        .expand-skills-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .languages-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .language-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .language-name {
          font-weight: 600;
        }

        .language-proficiency {
          font-size: 11px;
          opacity: 0.8;
        }

        /* MAIN CONTENT */
        .main-content {
          padding: 40px 48px;
          background: white;
        }

        .resume-header {
          margin-bottom: 32px;
          border-bottom: 3px solid #1e3a8a;
          padding-bottom: 16px;
        }

        .header-name {
          font-size: 36px;
          font-weight: 700;
          color: #1e3a8a;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .header-title {
          font-size: 18px;
          color: #4b5563;
          margin: 0;
          font-weight: 500;
        }

        /* SECTIONS */
        .resume-section {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3a8a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }

        .section-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* SUMMARY */
        .summary-section {
          margin-bottom: 32px;
        }

        .summary-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.7;
          margin: 0;
        }

        .read-more-btn {
          margin-top: 8px;
          background: none;
          border: none;
          color: #1e3a8a;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        /* EXPERIENCE */
        .experience-item {
          padding: 16px;
          border-left: 3px solid #1e3a8a;
          background: #f9fafb;
          border-radius: 4px;
          transition: all 0.3s;
        }

        .experience-item:hover {
          background: #f3f4f6;
          transform: translateX(4px);
        }

        .experience-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .experience-left {
          flex: 1;
        }

        .experience-right {
          text-align: right;
        }

        .experience-role {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .experience-company {
          font-size: 14px;
          color: #1e3a8a;
          font-weight: 600;
          margin: 0;
        }

        .experience-duration {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .experience-location {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        .experience-description {
          font-size: 14px;
          color: #4b5563;
          margin: 0 0 12px 0;
          line-height: 1.6;
        }

        .experience-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .experience-bullets li {
          font-size: 13px;
          color: #374151;
          padding-left: 20px;
          position: relative;
          margin-bottom: 6px;
          line-height: 1.6;
        }

        .experience-bullets li::before {
          content: "▸";
          position: absolute;
          left: 0;
          color: #1e3a8a;
          font-weight: bold;
        }

        /* PROJECTS */
        .project-item {
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .project-item:hover {
          border-color: #1e3a8a;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.1);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .project-name {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .github-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f3f4f6;
          color: #6b7280;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .project-link {
          font-size: 13px;
          color: #1e3a8a;
          text-decoration: none;
          font-weight: 600;
        }

        .project-link:hover {
          text-decoration: underline;
        }

        .project-description {
          font-size: 14px;
          color: #4b5563;
          margin: 0 0 10px 0;
          line-height: 1.6;
        }

        .project-tech {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 10px;
        }

        .project-tech strong {
          color: #1e3a8a;
        }

        .project-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .project-bullets li {
          font-size: 13px;
          color: #374151;
          padding-left: 20px;
          position: relative;
          margin-bottom: 6px;
          line-height: 1.6;
        }

        .project-bullets li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #1e3a8a;
          font-weight: bold;
        }

        /* EDUCATION */
        .education-item {
          padding: 14px;
          background: #f9fafb;
          border-radius: 4px;
        }

        .education-header {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .education-degree {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .education-institution {
          font-size: 14px;
          color: #1e3a8a;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .education-field {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .education-duration {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .education-gpa {
          font-size: 13px;
          color: #4b5563;
          font-weight: 600;
          margin: 0;
        }

        .education-achievements {
          list-style: none;
          padding: 0;
          margin: 10px 0 0 0;
        }

        .education-achievements li {
          font-size: 13px;
          color: #374151;
          padding-left: 20px;
          position: relative;
          margin-bottom: 4px;
        }

        .education-achievements li::before {
          content: "★";
          position: absolute;
          left: 0;
          color: #1e3a8a;
        }

        /* CERTIFICATIONS */
        .certification-item {
          padding: 12px;
          border-left: 3px solid #e5e7eb;
          background: #f9fafb;
        }

        .certification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .certification-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .certification-date {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .certification-issuer {
          font-size: 13px;
          color: #1e3a8a;
          font-weight: 600;
          margin: 0 0 6px 0;
        }

        .certification-description {
          font-size: 13px;
          color: #4b5563;
          margin: 0;
        }

        /* ACHIEVEMENTS */
        .achievements-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .achievements-list li {
          font-size: 14px;
          color: #374151;
          padding-left: 24px;
          position: relative;
          margin-bottom: 10px;
          line-height: 1.6;
        }

        .achievements-list li::before {
          content: "🏆";
          position: absolute;
          left: 0;
          font-size: 16px;
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

          .template-container {
            display: grid;
            grid-template-columns: 240px 1fr;
          }

          .sidebar {
            background: #1e3a8a !important;
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
          .template-container {
            grid-template-columns: 1fr;
          }

          .sidebar {
            padding: 24px 20px;
          }

          .main-content {
            padding: 24px 20px;
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
});

ProfessionalV2Template.displayName = "ProfessionalV2Template";

export default ProfessionalV2Template;
