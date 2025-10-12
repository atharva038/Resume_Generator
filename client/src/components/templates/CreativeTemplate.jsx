import {forwardRef} from "react";

const CreativeTemplate = forwardRef(({resumeData}, ref) => {
  // Default section order optimized for creative roles
  const DEFAULT_SECTION_ORDER = [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "achievements",
    "certifications",
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
        <section key="summary" style={{marginBottom: "16px"}}>
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-8px",
                top: "0",
                width: "4px",
                height: "100%",
                background: "linear-gradient(to bottom, #8b5cf6, #ec4899)",
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                color: "#7c3aed",
                marginBottom: "8px",
                paddingLeft: "8px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              About Me
            </h2>
            <p
              style={{
                fontSize: "10pt",
                lineHeight: "1.6",
                color: "#374151",
                paddingLeft: "8px",
              }}
            >
              {resumeData.summary}
            </p>
          </div>
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "16px"}}>
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-8px",
                top: "0",
                width: "4px",
                height: "100%",
                background: "linear-gradient(to bottom, #8b5cf6, #ec4899)",
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                color: "#7c3aed",
                marginBottom: "10px",
                paddingLeft: "8px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Skills & Expertise
            </h2>
            <div style={{paddingLeft: "8px"}}>
              {resumeData.skills.map((skillGroup, index) => (
                <div key={index} style={{marginBottom: "8px"}}>
                  <div
                    style={{
                      fontSize: "10pt",
                      fontWeight: "bold",
                      color: "#ec4899",
                      marginBottom: "3px",
                    }}
                  >
                    {skillGroup.category}
                  </div>
                  <div
                    style={{
                      fontSize: "9.5pt",
                      color: "#4b5563",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    {skillGroup.items?.map((item, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: "#f3e8ff",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          color: "#7c3aed",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "16px"}}>
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-8px",
                top: "0",
                width: "4px",
                height: "100%",
                background: "linear-gradient(to bottom, #8b5cf6, #ec4899)",
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                color: "#7c3aed",
                marginBottom: "10px",
                paddingLeft: "8px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Experience
            </h2>
            <div style={{paddingLeft: "8px"}}>
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  style={{marginBottom: "14px", position: "relative"}}
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
                        color: "#1f2937",
                      }}
                    >
                      {exp.position}
                    </h3>
                    <span
                      style={{
                        fontSize: "9pt",
                        color: "#6b7280",
                        fontStyle: "italic",
                        backgroundColor: "#fef3c7",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {exp.startDate} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#ec4899",
                      fontWeight: "600",
                      marginBottom: "5px",
                    }}
                  >
                    {exp.company} {exp.location && `• ${exp.location}`}
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
                            color: "#4b5563",
                            position: "relative",
                            paddingLeft: "8px",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: "-10px",
                              color: "#ec4899",
                              fontSize: "14pt",
                            }}
                          >
                            •
                          </span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={{marginBottom: "16px"}}>
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-8px",
                top: "0",
                width: "4px",
                height: "100%",
                background: "linear-gradient(to bottom, #8b5cf6, #ec4899)",
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                color: "#7c3aed",
                marginBottom: "10px",
                paddingLeft: "8px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Featured Projects
            </h2>
            <div style={{paddingLeft: "8px"}}>
              {resumeData.projects.map((project, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "12px",
                    backgroundColor: "#faf5ff",
                    padding: "10px",
                    borderRadius: "6px",
                    borderLeft: "3px solid #ec4899",
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
                        color: "#1f2937",
                      }}
                    >
                      {project.name}
                    </h3>
                    {project.date && (
                      <span
                        style={{
                          fontSize: "9pt",
                          color: "#6b7280",
                          fontStyle: "italic",
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
                        color: "#4b5563",
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
                        color: "#7c3aed",
                        marginTop: "5px",
                        fontWeight: "600",
                      }}
                    >
                      🛠️ {project.technologies}
                    </div>
                  )}
                  {project.link && (
                    <div
                      style={{
                        fontSize: "9pt",
                        color: "#ec4899",
                        marginTop: "3px",
                      }}
                    >
                      🔗 {project.link}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section key="education" style={{marginBottom: "16px"}}>
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: "-8px",
                top: "0",
                width: "4px",
                height: "100%",
                background: "linear-gradient(to bottom, #8b5cf6, #ec4899)",
                borderRadius: "2px",
              }}
            ></div>
            <h2
              style={{
                fontSize: "12pt",
                fontWeight: "bold",
                color: "#7c3aed",
                marginBottom: "10px",
                paddingLeft: "8px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Education
            </h2>
            <div style={{paddingLeft: "8px"}}>
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
                          color: "#1f2937",
                        }}
                      >
                        {edu.degree} in {edu.field}
                      </div>
                      <div
                        style={{
                          fontSize: "9.5pt",
                          color: "#ec4899",
                          fontWeight: "600",
                        }}
                      >
                        {edu.institution} {edu.location && `• ${edu.location}`}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "9pt",
                        color: "#6b7280",
                        fontStyle: "italic",
                      }}
                    >
                      {edu.graduationDate}
                    </span>
                  </div>
                  {edu.gpa && (
                    <div
                      style={{
                        fontSize: "9pt",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "16px"}}>
            <div style={{position: "relative"}}>
              <div
                style={{
                  position: "absolute",
                  left: "-8px",
                  top: "0",
                  width: "4px",
                  height: "100%",
                  background: "linear-gradient(to bottom, #8b5cf6, #ec4899)",
                  borderRadius: "2px",
                }}
              ></div>
              <h2
                style={{
                  fontSize: "12pt",
                  fontWeight: "bold",
                  color: "#7c3aed",
                  marginBottom: "10px",
                  paddingLeft: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Achievements & Awards
              </h2>
              <div style={{paddingLeft: "8px"}}>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    listStyleType: "none",
                  }}
                >
                  {resumeData.achievements.map((achievement, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: "9.5pt",
                        marginBottom: "5px",
                        lineHeight: "1.5",
                        color: "#4b5563",
                        position: "relative",
                        paddingLeft: "8px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "-10px",
                          color: "#ec4899",
                        }}
                      >
                        ★
                      </span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "16px"}}>
            <div style={{position: "relative"}}>
              <div
                style={{
                  position: "absolute",
                  left: "-8px",
                  top: "0",
                  width: "4px",
                  height: "100%",
                  background: "linear-gradient(to bottom, #8b5cf6, #ec4899)",
                  borderRadius: "2px",
                }}
              ></div>
              <h2
                style={{
                  fontSize: "12pt",
                  fontWeight: "bold",
                  color: "#7c3aed",
                  marginBottom: "10px",
                  paddingLeft: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Certifications
              </h2>
              <div
                style={{
                  paddingLeft: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {resumeData.certifications.map((cert, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "9.5pt",
                      color: "#1f2937",
                      backgroundColor: "#fae8ff",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #e9d5ff",
                    }}
                  >
                    <span style={{fontWeight: "600", color: "#7c3aed"}}>
                      {cert.name}
                    </span>
                    {cert.issuer && (
                      <div style={{fontSize: "8.5pt", color: "#6b7280"}}>
                        {cert.issuer}
                      </div>
                    )}
                    {cert.date && (
                      <div style={{fontSize: "8.5pt", color: "#6b7280"}}>
                        {cert.date}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ),

      customSections: resumeData.customSections &&
        resumeData.customSections.length > 0 && (
          <>
            {resumeData.customSections.map((section, index) => (
              <section key={`custom-${index}`} style={{marginBottom: "16px"}}>
                <div style={{position: "relative"}}>
                  <div
                    style={{
                      position: "absolute",
                      left: "-8px",
                      top: "0",
                      width: "4px",
                      height: "100%",
                      background:
                        "linear-gradient(to bottom, #8b5cf6, #ec4899)",
                      borderRadius: "2px",
                    }}
                  ></div>
                  <h2
                    style={{
                      fontSize: "12pt",
                      fontWeight: "bold",
                      color: "#7c3aed",
                      marginBottom: "10px",
                      paddingLeft: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    {section.title}
                  </h2>
                  <div
                    style={{
                      fontSize: "9.5pt",
                      lineHeight: "1.5",
                      color: "#4b5563",
                      whiteSpace: "pre-wrap",
                      paddingLeft: "8px",
                    }}
                  >
                    {section.content}
                  </div>
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
        fontFamily: "'Poppins', 'Segoe UI', 'Arial', sans-serif",
        color: "#1f2937",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header Section - Creative Style with Gradient */}
      <header style={{marginBottom: "20px", position: "relative"}}>
        <div
          style={{
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            padding: "20px",
            borderRadius: "8px",
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "24pt",
              fontWeight: "bold",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            {resumeData.name || "Your Name"}
          </h1>
          <div
            style={{
              fontSize: "10pt",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              opacity: 0.95,
            }}
          >
            {resumeData.contact?.email && (
              <span>✉️ {resumeData.contact.email}</span>
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
            {resumeData.contact?.portfolio && (
              <span>🎨 {resumeData.contact.portfolio}</span>
            )}
            {resumeData.contact?.website && (
              <span>🌐 {resumeData.contact.website}</span>
            )}
          </div>
        </div>
      </header>

      {/* Body Sections with Left Border Accent */}
      <div style={{paddingLeft: "8px"}}>
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  );
});

CreativeTemplate.displayName = "CreativeTemplate";

export default CreativeTemplate;
