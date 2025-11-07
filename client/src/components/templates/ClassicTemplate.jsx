import {forwardRef} from "react";

const ClassicTemplate = forwardRef(({resumeData}, ref) => {
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

  // Render section helper function
  const renderSection = (sectionId) => {
    const sections = {
      summary: resumeData.summary && (
        <section key="summary" style={{marginBottom: "8px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "10pt",
              borderBottom: "1px solid black",
              paddingBottom: "2px",
              marginBottom: "4px",
            }}
          >
            Professional Summary
          </h2>
          <p style={{fontSize: "9pt", lineHeight: "1.3"}}>{resumeData.summary}</p>
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "8px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "10pt",
              borderBottom: "1px solid black",
              paddingBottom: "2px",
              marginBottom: "4px",
            }}
          >
            Skills
          </h2>
          {resumeData.skills.map((skillGroup, index) => (
            <div key={index} style={{fontSize: "9pt", marginBottom: "2px", lineHeight: "1.3"}}>
              <span className="font-semibold">{skillGroup.category}:</span>{" "}
              {formatSkills(skillGroup.items)}
            </div>
          ))}
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "8px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "10pt",
              borderBottom: "1px solid black",
              paddingBottom: "2px",
              marginBottom: "4px",
            }}
          >
            Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "6px"}}>
              <div
                className="flex justify-between items-baseline"
                style={{marginBottom: "1px"}}
              >
                <div>
                  <span className="font-bold" style={{fontSize: "9pt"}}>
                    {exp.title || exp.company}
                  </span>
                  {exp.title && exp.company && (
                    <span className="italic" style={{fontSize: "9pt"}}> | {exp.company}</span>
                  )}
                </div>
                <div style={{fontSize: "8.5pt"}}>
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
                  style={{fontSize: "8.5pt", marginBottom: "2px"}}
                >
                  {exp.location}
                </div>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-4"
                  style={{marginTop: "2px"}}
                >
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "9pt", marginBottom: "1px", lineHeight: "1.3"}}>
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
        <section key="projects" style={{marginBottom: "8px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "10pt",
              borderBottom: "1px solid black",
              paddingBottom: "2px",
              marginBottom: "4px",
            }}
          >
            Projects
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "6px"}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                }}
              >
                <div className="font-bold" style={{fontSize: "9pt"}}>
                  {project.name}
                  {project.technologies && (
                    <span className="italic font-normal" style={{fontSize: "8.5pt", marginLeft: "6px"}}>
                      | {Array.isArray(project.technologies)
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
                      fontSize: "8.5pt",
                      color: "#0066cc",
                      textDecoration: "underline",
                    }}
                  >
                    🔗
                  </a>
                )}
              </div>
              {project.bullets && project.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-4"
                  style={{marginTop: "2px"}}
                >
                  {project.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "9pt", marginBottom: "1px", lineHeight: "1.3"}}>
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
        <section key="education" style={{marginBottom: "8px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "10pt",
              borderBottom: "1px solid black",
              paddingBottom: "2px",
              marginBottom: "4px",
            }}
          >
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "5px"}}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold" style={{fontSize: "9pt"}}>
                    {edu.institution}
                  </span>
                  {edu.location && (
                    <span className="italic" style={{fontSize: "8.5pt"}}> | {edu.location}</span>
                  )}
                </div>
                <div style={{fontSize: "8.5pt"}}>
                  {edu.startDate && (
                    <>
                      {edu.startDate} - {edu.endDate}
                    </>
                  )}
                </div>
              </div>
              <div style={{fontSize: "9pt", lineHeight: "1.3"}}>
                {edu.degree && edu.field && (
                  <span className="italic">
                    {edu.degree} in {edu.field}
                  </span>
                )}
                {edu.gpa && (
                  <span style={{fontSize: "8.5pt"}}> | GPA: {edu.gpa}</span>
                )}
              </div>
            </div>
          ))}
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "8px"}}>
            <h2
              className="font-bold uppercase"
              style={{
                fontSize: "10pt",
                borderBottom: "1px solid black",
                paddingBottom: "2px",
                marginBottom: "4px",
              }}
            >
              Certifications
            </h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} style={{fontSize: "9pt", marginBottom: "2px", lineHeight: "1.3"}}>
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.date && (
                  <span style={{fontSize: "8.5pt"}}> ({cert.date})</span>
                )}
              </div>
            ))}
          </section>
        ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "8px"}}>
            <h2
              className="font-bold uppercase"
              style={{
                fontSize: "10pt",
                borderBottom: "1px solid black",
                paddingBottom: "2px",
                marginBottom: "4px",
              }}
            >
              Achievements
            </h2>
            <ul
              className="list-disc list-outside ml-4"
              style={{marginTop: "2px"}}
            >
              {resumeData.achievements.map((achievement, index) => (
                <li key={index} style={{fontSize: "9pt", marginBottom: "1px", lineHeight: "1.3"}}>
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      customSections: resumeData.customSections &&
        resumeData.customSections.length > 0 && (
          <>
            {resumeData.customSections.map((section, sectionIndex) => {
              if (section.title && section.items && section.items.length > 0) {
                return (
                  <section
                    key={`customSection_${sectionIndex}`}
                    style={{marginBottom: "8px"}}
                  >
                    <h2
                      className="font-bold uppercase"
                      style={{
                        fontSize: "10pt",
                        borderBottom: "1px solid black",
                        paddingBottom: "2px",
                        marginBottom: "4px",
                      }}
                    >
                      {section.title}
                    </h2>
                    <ul
                      className="list-disc list-outside ml-4"
                      style={{marginTop: "2px"}}
                    >
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          style={{fontSize: "9pt", marginBottom: "1px", lineHeight: "1.3"}}
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
        ),
    };

    return sections[sectionId] || null;
  };

  return (
    <div
      ref={ref}
      className="resume-preview !bg-white !text-black shadow-lg border border-gray-300 font-resume"
      style={{
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        padding: "0.4in 0.5in",
        fontSize: "9.5pt",
        lineHeight: "1.25",
        color: "#000000",
        overflow: "hidden",
        boxSizing: "border-box"
      }}
    >
      <header
        className="text-center pb-1.5 mb-2"
        style={{borderBottom: "1.5px solid black"}}
      >
        <h1
          className="font-bold uppercase tracking-wide"
          style={{fontSize: "18pt", marginBottom: "4px", lineHeight: "1.1"}}
        >
          {resumeData.name || "Your Name"}
        </h1>
        <div style={{fontSize: "9pt", lineHeight: "1.3"}}>
          {resumeData.contact?.email && (
            <div style={{marginBottom: "2px"}}>{resumeData.contact.email}</div>
          )}
          <div className="flex justify-center gap-2 flex-wrap">
            {resumeData.contact?.phone && (
              <span>{resumeData.contact.phone}</span>
            )}
            {resumeData.contact?.location && (
              <span>{resumeData.contact.location}</span>
            )}
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {resumeData.contact?.linkedin && (
              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{color: "#0066cc", textDecoration: "underline"}}
              >
                LinkedIn
              </a>
            )}
            {resumeData.contact?.github && (
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{color: "#0066cc", textDecoration: "underline"}}
              >
                GitHub
              </a>
            )}
            {resumeData.contact?.portfolio && (
              <a
                href={resumeData.contact.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                style={{color: "#0066cc", textDecoration: "underline"}}
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
      </header>

      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

ClassicTemplate.displayName = "ClassicTemplate";

export default ClassicTemplate;
