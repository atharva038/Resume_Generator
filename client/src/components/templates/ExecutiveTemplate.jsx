import {forwardRef} from "react";

const ExecutiveTemplate = forwardRef(({resumeData}, ref) => {
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

  // Default section order optimized for executives
  const DEFAULT_SECTION_ORDER = [
    "summary",
    "experience",
    "achievements",
    "skills",
    "education",
    "certifications",
    "projects",
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
        <section key="summary" style={{marginBottom: "18px"}}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "12pt",
              fontWeight: "bold",
              color: "#1a1a1a",
              borderBottom: "2px solid #2c3e50",
              paddingBottom: "4px",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Executive Summary
          </h2>
          <p
            style={{
              fontSize: "10.5pt",
              lineHeight: "1.6",
              color: "#2c3e50",
              fontStyle: "italic",
            }}
          >
            {resumeData.summary}
          </p>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "18px"}}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "12pt",
              fontWeight: "bold",
              color: "#1a1a1a",
              borderBottom: "2px solid #2c3e50",
              paddingBottom: "4px",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "14px"}}>
              <div style={{marginBottom: "4px"}}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "11pt",
                      fontWeight: "bold",
                      color: "#1a1a1a",
                      marginBottom: "2px",
                    }}
                  >
                    {exp.position}
                  </h3>
                  <span
                    style={{
                      fontSize: "9.5pt",
                      color: "#555",
                      fontStyle: "italic",
                    }}
                  >
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "10.5pt",
                    color: "#2c3e50",
                    fontWeight: "600",
                    marginBottom: "2px",
                  }}
                >
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
              </div>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    listStyleType: "square",
                  }}
                >
                  {exp.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: "10pt",
                        marginBottom: "4px",
                        lineHeight: "1.5",
                        color: "#333",
                      }}
                    >
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "18px"}}>
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "12pt",
                fontWeight: "bold",
                color: "#1a1a1a",
                borderBottom: "2px solid #2c3e50",
                paddingBottom: "4px",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Key Achievements & Awards
            </h2>
            <ul style={{margin: 0, paddingLeft: "20px", listStyleType: "disc"}}>
              {resumeData.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: "10pt",
                    marginBottom: "5px",
                    lineHeight: "1.5",
                    color: "#333",
                  }}
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "18px"}}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "12pt",
              fontWeight: "bold",
              color: "#1a1a1a",
              borderBottom: "2px solid #2c3e50",
              paddingBottom: "4px",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Core Competencies
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} style={{fontSize: "10pt"}}>
                <span style={{fontWeight: "bold", color: "#2c3e50"}}>
                  {skillGroup.category}:
                </span>{" "}
                <span style={{color: "#333"}}>
                  {formatSkills(skillGroup.items)}
                </span>
              </div>
            ))}
          </div>
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section key="education" style={{marginBottom: "18px"}}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "12pt",
              fontWeight: "bold",
              color: "#1a1a1a",
              borderBottom: "2px solid #2c3e50",
              paddingBottom: "4px",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Education
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
                      color: "#1a1a1a",
                    }}
                  >
                    {edu.degree} in {edu.field}
                  </div>
                  <div style={{fontSize: "10pt", color: "#2c3e50"}}>
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "9.5pt",
                    color: "#555",
                    fontStyle: "italic",
                  }}
                >
                  {edu.graduationDate}
                </span>
              </div>
              {edu.gpa && (
                <div
                  style={{fontSize: "9.5pt", color: "#555", marginTop: "2px"}}
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
          <section key="certifications" style={{marginBottom: "18px"}}>
            <h2
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "12pt",
                fontWeight: "bold",
                color: "#1a1a1a",
                borderBottom: "2px solid #2c3e50",
                paddingBottom: "4px",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Certifications & Licenses
            </h2>
            <ul
              style={{margin: 0, paddingLeft: "20px", listStyleType: "circle"}}
            >
              {resumeData.certifications.map((cert, index) => (
                <li
                  key={index}
                  style={{fontSize: "10pt", marginBottom: "4px", color: "#333"}}
                >
                  <span style={{fontWeight: "600"}}>{cert.name}</span>
                  {cert.issuer && ` - ${cert.issuer}`}
                  {cert.date && ` (${cert.date})`}
                </li>
              ))}
            </ul>
          </section>
        ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={{marginBottom: "18px"}}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "12pt",
              fontWeight: "bold",
              color: "#1a1a1a",
              borderBottom: "2px solid #2c3e50",
              paddingBottom: "4px",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Notable Projects
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
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
                    color: "#1a1a1a",
                  }}
                >
                  {project.name}
                </h3>
                {project.date && (
                  <span
                    style={{
                      fontSize: "9.5pt",
                      color: "#555",
                      fontStyle: "italic",
                    }}
                  >
                    {project.date}
                  </span>
                )}
              </div>
              {project.description && (
                <p style={{fontSize: "10pt", margin: "3px 0", color: "#333"}}>
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <p style={{fontSize: "9.5pt", color: "#555", marginTop: "2px"}}>
                  <span style={{fontWeight: "600"}}>Technologies:</span>{" "}
                  {project.technologies}
                </p>
              )}
            </div>
          ))}
        </section>
      ),

      customSections: resumeData.customSections &&
        resumeData.customSections.length > 0 && (
          <>
            {resumeData.customSections.map((section, index) => (
              <section key={`custom-${index}`} style={{marginBottom: "18px"}}>
                <h2
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: "12pt",
                    fontWeight: "bold",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #2c3e50",
                    paddingBottom: "4px",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {section.title}
                </h2>
                <div
                  style={{
                    fontSize: "10pt",
                    lineHeight: "1.5",
                    color: "#333",
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
        padding: "20mm 18mm",
        fontFamily: "'Times New Roman', Georgia, serif",
        color: "#1a1a1a",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header Section - Executive Style */}
      <header
        style={{
          marginBottom: "20px",
          borderBottom: "3px solid #2c3e50",
          paddingBottom: "12px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "20pt",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "6px",
            color: "#1a1a1a",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>
        <div
          style={{
            textAlign: "center",
            fontSize: "10pt",
            color: "#2c3e50",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          {resumeData.contact?.email && (
            <span>📧 {resumeData.contact.email}</span>
          )}
          {resumeData.contact?.phone && (
            <span>📞 {resumeData.contact.phone}</span>
          )}
          {resumeData.contact?.location && (
            <span>📍 {resumeData.contact.location}</span>
          )}
          {resumeData.contact?.linkedin && (
            <span>💼 {resumeData.contact.linkedin}</span>
          )}
        </div>
      </header>

      {/* Body Sections */}
      <div>{sectionOrder.map((sectionId) => renderSection(sectionId))}</div>
    </div>
  );
});

ExecutiveTemplate.displayName = "ExecutiveTemplate";

export default ExecutiveTemplate;
