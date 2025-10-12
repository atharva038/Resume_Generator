import {forwardRef} from "react";

const ModernTemplate = forwardRef(({resumeData}, ref) => {
  // Default section order if not specified
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
      summary: "ABOUT ME",
      skills: "SKILLS",
      experience: "EXPERIENCE",
      education: "EDUCATION",
      projects: "PROJECTS",
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
        <section key="summary" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            {getSectionTitle("summary")}
          </h2>
          <p style={{fontSize: "10pt", textAlign: "justify"}}>
            {resumeData.summary}
          </p>
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            {getSectionTitle("skills")}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
            }}
          >
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} style={{fontSize: "10pt"}}>
                <span className="font-semibold" style={{color: "#374151"}}>
                  {skillGroup.category}:
                </span>{" "}
                <span style={{color: "#6b7280"}}>
                  {skillGroup.items?.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            {getSectionTitle("experience")}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "12px"}}>
              <div
                className="flex justify-between items-baseline"
                style={{marginBottom: "2px"}}
              >
                <div>
                  <span className="font-bold" style={{fontSize: "11pt"}}>
                    {exp.title || "Position"}
                  </span>
                  {exp.company && (
                    <span style={{fontSize: "10pt", color: "#6b7280"}}>
                      {" "}
                      @ {exp.company}
                    </span>
                  )}
                </div>
                <div style={{fontSize: "9pt", color: "#9ca3af"}}>
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
                    fontSize: "9pt",
                    color: "#6b7280",
                    marginBottom: "4px",
                  }}
                >
                  📍 {exp.location}
                </div>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-5"
                  style={{marginTop: "4px"}}
                >
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "10pt", marginBottom: "2px"}}>
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
        <section key="projects" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            {getSectionTitle("projects")}
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                }}
              >
                <div className="font-bold" style={{fontSize: "11pt"}}>
                  {project.name}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "9pt",
                      color: "#1a56db",
                      textDecoration: "underline",
                      marginLeft: "8px",
                    }}
                  >
                    🔗 Link
                  </a>
                )}
              </div>
              {project.technologies && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: "#6b7280",
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
                    <li key={i} style={{fontSize: "10pt", marginBottom: "2px"}}>
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
        <section key="education" style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            {getSectionTitle("education")}
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "8px"}}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold" style={{fontSize: "10pt"}}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                </div>
                <div style={{fontSize: "9pt", color: "#9ca3af"}}>
                  {edu.startDate && (
                    <>
                      {edu.startDate} - {edu.endDate}
                    </>
                  )}
                </div>
              </div>
              <div style={{fontSize: "10pt", color: "#6b7280"}}>
                {edu.institution}
                {edu.location && <span> — {edu.location}</span>}
                {edu.gpa && <span> | GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "12px"}}>
            <h2
              className="font-bold uppercase"
              style={{
                fontSize: "12pt",
                color: "#1a56db",
                marginBottom: "6px",
                letterSpacing: "0.5px",
              }}
            >
              {getSectionTitle("certifications")}
            </h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} style={{fontSize: "10pt", marginBottom: "4px"}}>
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && (
                  <span style={{color: "#6b7280"}}> — {cert.issuer}</span>
                )}
                {cert.date && (
                  <span style={{fontSize: "9pt", color: "#9ca3af"}}>
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
              className="font-bold uppercase"
              style={{
                fontSize: "12pt",
                color: "#1a56db",
                marginBottom: "6px",
                letterSpacing: "0.5px",
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
                      className="font-bold uppercase"
                      style={{
                        fontSize: "12pt",
                        color: "#1a56db",
                        marginBottom: "6px",
                        letterSpacing: "0.5px",
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
        padding: "0.5in",
        fontSize: "10.5pt",
        lineHeight: "1.35",
        color: "#000000",
      }}
    >
      {/* Header - Left Aligned Modern Style */}
      <header style={{marginBottom: "16px"}}>
        <h1
          className="font-bold"
          style={{fontSize: "28pt", marginBottom: "6px", color: "#1a56db"}}
        >
          {resumeData.name || "Your Name"}
        </h1>
        <div
          style={{
            fontSize: "10pt",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            color: "#4b5563",
          }}
        >
          {resumeData.contact?.email && (
            <span>✉ {resumeData.contact.email}</span>
          )}
          {resumeData.contact?.phone && (
            <span>📱 {resumeData.contact.phone}</span>
          )}
          {resumeData.contact?.location && (
            <span>📍 {resumeData.contact.location}</span>
          )}
          {resumeData.contact?.linkedin && (
            <a
              href={resumeData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{color: "#1a56db", textDecoration: "underline"}}
            >
              🔗 LinkedIn
            </a>
          )}
          {resumeData.contact?.github && (
            <a
              href={resumeData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{color: "#1a56db", textDecoration: "underline"}}
            >
              💻 GitHub
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
