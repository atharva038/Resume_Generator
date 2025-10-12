import {forwardRef} from "react";

const TechTemplate = forwardRef(({resumeData}, ref) => {
  // Default section order optimized for tech roles
  const DEFAULT_SECTION_ORDER = [
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "customSections",
  ];

  const sectionOrder =
    resumeData.sectionOrder?.filter(
      (id) => !["score", "personal", "recommendations", "summary"].includes(id)
    ) || DEFAULT_SECTION_ORDER;

  // Render section helper function
  const renderSection = (sectionId) => {
    const sections = {
      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              color: "#0ea5e9",
              marginBottom: "10px",
              paddingBottom: "4px",
              borderBottom: "2px solid #0ea5e9",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {"<Technical Skills />"}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              backgroundColor: "#f8fafc",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} style={{fontSize: "10pt"}}>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "#334155",
                    marginBottom: "3px",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {skillGroup.category}
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "9.5pt",
                    lineHeight: "1.4",
                  }}
                >
                  {skillGroup.items?.join(" • ")}
                </div>
              </div>
            ))}
          </div>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              color: "#0ea5e9",
              marginBottom: "10px",
              paddingBottom: "4px",
              borderBottom: "2px solid #0ea5e9",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {"<Work Experience />"}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div
              key={index}
              style={{
                marginBottom: "12px",
                borderLeft: "3px solid #cbd5e1",
                paddingLeft: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "3px",
                }}
              >
                <h3
                  style={{
                    fontSize: "11pt",
                    fontWeight: "bold",
                    color: "#1e293b",
                  }}
                >
                  {exp.position}
                </h3>
                <span
                  style={{
                    fontSize: "9pt",
                    color: "#64748b",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {exp.startDate} → {exp.endDate || "Present"}
                </span>
              </div>
              <div
                style={{
                  fontSize: "10pt",
                  color: "#475569",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                {exp.company} {exp.location && `| ${exp.location}`}
              </div>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    listStyleType: "none",
                  }}
                >
                  {exp.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: "9.5pt",
                        marginBottom: "4px",
                        lineHeight: "1.5",
                        color: "#334155",
                        position: "relative",
                        paddingLeft: "10px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "-10px",
                          color: "#0ea5e9",
                          fontWeight: "bold",
                        }}
                      >
                        ▹
                      </span>
                      {achievement}
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
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              color: "#0ea5e9",
              marginBottom: "10px",
              paddingBottom: "4px",
              borderBottom: "2px solid #0ea5e9",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {"<Projects />"}
          </h2>
          {resumeData.projects.map((project, index) => (
            <div
              key={index}
              style={{
                marginBottom: "12px",
                backgroundColor: "#f8fafc",
                padding: "10px",
                borderRadius: "4px",
                borderLeft: "3px solid #0ea5e9",
              }}
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
                    fontSize: "10.5pt",
                    fontWeight: "bold",
                    color: "#1e293b",
                  }}
                >
                  {project.name}
                </h3>
                {project.date && (
                  <span
                    style={{
                      fontSize: "9pt",
                      color: "#64748b",
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {project.date}
                  </span>
                )}
              </div>
              {project.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    margin: "4px 0",
                    color: "#475569",
                    lineHeight: "1.5",
                  }}
                >
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: "#64748b",
                    marginTop: "5px",
                    fontFamily: "'Courier New', monospace",
                    backgroundColor: "#e0f2fe",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    display: "inline-block",
                  }}
                >
                  {project.technologies}
                </div>
              )}
              {project.link && (
                <div
                  style={{fontSize: "9pt", color: "#0ea5e9", marginTop: "3px"}}
                >
                  🔗 {project.link}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section key="education" style={{marginBottom: "16px"}}>
          <h2
            style={{
              fontSize: "13pt",
              fontWeight: "bold",
              color: "#0ea5e9",
              marginBottom: "10px",
              paddingBottom: "4px",
              borderBottom: "2px solid #0ea5e9",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {"<Education />"}
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
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
                      fontSize: "10.5pt",
                      fontWeight: "bold",
                      color: "#1e293b",
                    }}
                  >
                    {edu.degree} in {edu.field}
                  </div>
                  <div style={{fontSize: "9.5pt", color: "#475569"}}>
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "9pt",
                    color: "#64748b",
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {edu.graduationDate}
                </span>
              </div>
              {edu.gpa && (
                <div
                  style={{fontSize: "9pt", color: "#64748b", marginTop: "2px"}}
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
          <section key="certifications" style={{marginBottom: "16px"}}>
            <h2
              style={{
                fontSize: "13pt",
                fontWeight: "bold",
                color: "#0ea5e9",
                marginBottom: "10px",
                paddingBottom: "4px",
                borderBottom: "2px solid #0ea5e9",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "1px",
              }}
            >
              {"<Certifications />"}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              {resumeData.certifications.map((cert, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: "9.5pt",
                    color: "#334155",
                    backgroundColor: "#f1f5f9",
                    padding: "6px 10px",
                    borderRadius: "3px",
                  }}
                >
                  <span style={{fontWeight: "600"}}>{cert.name}</span>
                  {cert.issuer && (
                    <div style={{fontSize: "8.5pt", color: "#64748b"}}>
                      {cert.issuer}
                    </div>
                  )}
                  {cert.date && (
                    <div
                      style={{
                        fontSize: "8.5pt",
                        color: "#64748b",
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {cert.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "16px"}}>
            <h2
              style={{
                fontSize: "13pt",
                fontWeight: "bold",
                color: "#0ea5e9",
                marginBottom: "10px",
                paddingBottom: "4px",
                borderBottom: "2px solid #0ea5e9",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "1px",
              }}
            >
              {"<Achievements />"}
            </h2>
            <ul style={{margin: 0, paddingLeft: "18px", listStyleType: "none"}}>
              {resumeData.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: "9.5pt",
                    marginBottom: "4px",
                    lineHeight: "1.5",
                    color: "#334155",
                    position: "relative",
                    paddingLeft: "10px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-10px",
                      color: "#0ea5e9",
                      fontWeight: "bold",
                    }}
                  >
                    ▹
                  </span>
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      customSections: resumeData.customSections &&
        resumeData.customSections.length > 0 && (
          <>
            {resumeData.customSections.map((section, index) => (
              <section key={`custom-${index}`} style={{marginBottom: "16px"}}>
                <h2
                  style={{
                    fontSize: "13pt",
                    fontWeight: "bold",
                    color: "#0ea5e9",
                    marginBottom: "10px",
                    paddingBottom: "4px",
                    borderBottom: "2px solid #0ea5e9",
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "1px",
                  }}
                >
                  {"<" + section.title + " />"}
                </h2>
                <div
                  style={{
                    fontSize: "9.5pt",
                    lineHeight: "1.5",
                    color: "#334155",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {section.content}
                </div>
              </section>
            ))}
          </>
        ),
    };

    return sections[sectionId] || null;
  };

  return (
    <div
      ref={ref}
      className="resume-preview"
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "white",
        padding: "18mm 16mm",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        color: "#1e293b",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header Section - Tech Style */}
      <header
        style={{
          marginBottom: "18px",
          backgroundColor: "#0f172a",
          color: "white",
          padding: "16px",
          borderRadius: "6px",
          margin: "-18mm -16mm 18px -16mm",
        }}
      >
        <div style={{padding: "0 16mm"}}>
          <h1
            style={{
              fontSize: "22pt",
              fontWeight: "bold",
              marginBottom: "6px",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "1px",
            }}
          >
            {resumeData.personalInfo?.fullName || "Your Name"}
          </h1>
          {resumeData.summary && (
            <p
              style={{
                fontSize: "10pt",
                marginBottom: "10px",
                color: "#cbd5e1",
                lineHeight: "1.5",
              }}
            >
              {resumeData.summary}
            </p>
          )}
          <div
            style={{
              fontSize: "9.5pt",
              color: "#94a3b8",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {resumeData.personalInfo?.email && (
              <span>✉️ {resumeData.personalInfo.email}</span>
            )}
            {resumeData.personalInfo?.phone && (
              <span>📱 {resumeData.personalInfo.phone}</span>
            )}
            {resumeData.personalInfo?.location && (
              <span>📍 {resumeData.personalInfo.location}</span>
            )}
            {resumeData.personalInfo?.linkedin && (
              <span>🔗 {resumeData.personalInfo.linkedin}</span>
            )}
            {resumeData.personalInfo?.github && (
              <span>💻 {resumeData.personalInfo.github}</span>
            )}
            {resumeData.personalInfo?.website && (
              <span>🌐 {resumeData.personalInfo.website}</span>
            )}
          </div>
        </div>
      </header>

      {/* Body Sections */}
      <div>{sectionOrder.map((sectionId) => renderSection(sectionId))}</div>
    </div>
  );
});

TechTemplate.displayName = "TechTemplate";

export default TechTemplate;
