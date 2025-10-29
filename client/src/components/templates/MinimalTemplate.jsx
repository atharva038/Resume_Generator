import {forwardRef} from "react";

const MinimalTemplate = forwardRef(({resumeData}, ref) => {
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
        <section key="summary" style={{marginBottom: "16px"}}>
          <p
            style={{
              fontSize: "10.5pt",
              lineHeight: "1.5",
              textAlign: "justify",
            }}
          >
            {resumeData.summary}
          </p>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "16px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            {getSectionTitle("experience")}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "12px"}}>
              <div style={{marginBottom: "2px"}}>
                <span className="font-bold" style={{fontSize: "11pt"}}>
                  {exp.title || "Position"}
                </span>
                {exp.company && (
                  <span style={{fontSize: "11pt"}}> — {exp.company}</span>
                )}
              </div>
              <div
                style={{fontSize: "9pt", color: "#6b7280", marginBottom: "4px"}}
              >
                {exp.location && <span>{exp.location} | </span>}
                {exp.startDate && (
                  <span>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                )}
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{marginTop: "4px", marginLeft: "20px"}}>
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "10pt", marginBottom: "3px"}}>
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
        <section key="projects" style={{marginBottom: "16px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            {getSectionTitle("projects")}
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div
                style={{
                  marginBottom: "2px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <span className="font-bold" style={{fontSize: "11pt"}}>
                    {project.name}
                  </span>
                  {project.technologies && (
                    <span style={{fontSize: "9pt", color: "#6b7280"}}>
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
                      fontSize: "9pt",
                      color: "#000",
                      textDecoration: "underline",
                      marginLeft: "8px",
                    }}
                  >
                    🔗 Link
                  </a>
                )}
              </div>
              {project.bullets && project.bullets.length > 0 && (
                <ul style={{marginTop: "4px", marginLeft: "20px"}}>
                  {project.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "10pt", marginBottom: "3px"}}>
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
        <section key="education" style={{marginBottom: "16px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            {getSectionTitle("education")}
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "8px"}}>
              <div style={{marginBottom: "2px"}}>
                <span className="font-bold" style={{fontSize: "11pt"}}>
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </span>
              </div>
              <div style={{fontSize: "10pt", color: "#374151"}}>
                {edu.institution}
                {edu.location && <span> — {edu.location}</span>}
              </div>
              <div style={{fontSize: "9pt", color: "#6b7280"}}>
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
        <section key="skills" style={{marginBottom: "16px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            {getSectionTitle("skills")}
          </h2>
          {resumeData.skills.map((skillGroup, index) => (
            <div key={index} style={{fontSize: "10pt", marginBottom: "5px"}}>
              <span className="font-semibold">{skillGroup.category}:</span>{" "}
              {formatSkills(skillGroup.items)}
            </div>
          ))}
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "12px"}}>
            <h2
              className="font-bold"
              style={{
                fontSize: "13pt",
                marginBottom: "8px",
                letterSpacing: "1px",
              }}
            >
              {getSectionTitle("certifications")}
            </h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} style={{fontSize: "10pt", marginBottom: "4px"}}>
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.date && (
                  <span style={{fontSize: "9pt", color: "#6b7280"}}>
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
          <section key="achievements" style={{marginBottom: "12px"}}>
            <h2
              className="font-bold"
              style={{
                fontSize: "13pt",
                marginBottom: "8px",
                letterSpacing: "1px",
              }}
            >
              {getSectionTitle("achievements")}
            </h2>
            <ul
              className="list-disc list-outside ml-5"
              style={{marginTop: "4px"}}
            >
              {resumeData.achievements.map((achievement, index) => (
                <li key={index} style={{fontSize: "10pt", marginBottom: "3px"}}>
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
                  <section key={sectionIndex} style={{marginBottom: "12px"}}>
                    <h2
                      className="font-bold"
                      style={{
                        fontSize: "13pt",
                        marginBottom: "8px",
                        letterSpacing: "1px",
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
                          style={{fontSize: "10pt", marginBottom: "3px"}}
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
      ref={ref}
      className="resume-preview !bg-white !text-black shadow-lg border border-gray-300 font-resume"
      style={{
        width: "8.5in",
        minHeight: "11in",
        padding: "0.6in",
        fontSize: "10.5pt",
        lineHeight: "1.4",
        color: "#000000",
      }}
    >
      {/* Header - Minimal Clean Style */}
      <header style={{marginBottom: "20px"}}>
        <h1
          className="font-bold"
          style={{
            fontSize: "32pt",
            marginBottom: "4px",
            letterSpacing: "-0.5px",
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>
        <div
          style={{
            fontSize: "10pt",
            color: "#374151",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
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
              style={{color: "#000000", textDecoration: "underline"}}
            >
              LinkedIn
            </a>
          )}
          {resumeData.contact?.github && (
            <a
              href={resumeData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{color: "#000000", textDecoration: "underline"}}
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
