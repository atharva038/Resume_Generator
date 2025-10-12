import {forwardRef} from "react";

const AcademicTemplate = forwardRef(({resumeData}, ref) => {
  // Default section order optimized for academic CVs
  const DEFAULT_SECTION_ORDER = [
    "education",
    "experience",
    "publications",
    "research",
    "achievements",
    "skills",
    "certifications",
    "projects",
    "customSections",
  ];

  const sectionOrder =
    resumeData.sectionOrder?.filter(
      (id) => !["score", "personal", "recommendations"].includes(id)
    ) || DEFAULT_SECTION_ORDER;

  // Render section helper function
  const renderSection = (sectionId) => {
    const sections = {
      summary: resumeData.summary && (
        <section key="summary" style={{marginBottom: "14px"}}>
          <h2
            style={{
              fontSize: "11pt",
              fontWeight: "bold",
              color: "#1a202c",
              borderBottom: "1.5pt solid #2d3748",
              paddingBottom: "3px",
              marginBottom: "8px",
              textTransform: "uppercase",
              fontVariant: "small-caps",
              letterSpacing: "0.5px",
            }}
          >
            Research Interests
          </h2>
          <p
            style={{
              fontSize: "10pt",
              lineHeight: "1.5",
              color: "#2d3748",
              textAlign: "justify",
            }}
          >
            {resumeData.summary}
          </p>
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section key="education" style={{marginBottom: "14px"}}>
          <h2
            style={{
              fontSize: "11pt",
              fontWeight: "bold",
              color: "#1a202c",
              borderBottom: "1.5pt solid #2d3748",
              paddingBottom: "3px",
              marginBottom: "8px",
              textTransform: "uppercase",
              fontVariant: "small-caps",
              letterSpacing: "0.5px",
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
                <div style={{flex: 1}}>
                  <div
                    style={{
                      fontSize: "10.5pt",
                      fontWeight: "bold",
                      color: "#1a202c",
                    }}
                  >
                    {edu.degree} in {edu.field}
                  </div>
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#2d3748",
                      fontStyle: "italic",
                    }}
                  >
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: "#4a5568",
                    textAlign: "right",
                    minWidth: "80px",
                  }}
                >
                  {edu.graduationDate}
                </div>
              </div>
              {edu.gpa && (
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: "#4a5568",
                    marginTop: "2px",
                  }}
                >
                  GPA: {edu.gpa}
                </div>
              )}
              {edu.thesis && (
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: "#4a5568",
                    marginTop: "3px",
                  }}
                >
                  <span style={{fontStyle: "italic"}}>Thesis:</span>{" "}
                  {edu.thesis}
                </div>
              )}
              {edu.advisor && (
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: "#4a5568",
                    marginTop: "2px",
                  }}
                >
                  <span style={{fontStyle: "italic"}}>Advisor:</span>{" "}
                  {edu.advisor}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "14px"}}>
          <h2
            style={{
              fontSize: "11pt",
              fontWeight: "bold",
              color: "#1a202c",
              borderBottom: "1.5pt solid #2d3748",
              paddingBottom: "3px",
              marginBottom: "8px",
              textTransform: "uppercase",
              fontVariant: "small-caps",
              letterSpacing: "0.5px",
            }}
          >
            Academic & Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "12px"}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div style={{flex: 1}}>
                  <h3
                    style={{
                      fontSize: "10.5pt",
                      fontWeight: "bold",
                      color: "#1a202c",
                    }}
                  >
                    {exp.position}
                  </h3>
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#2d3748",
                      fontStyle: "italic",
                    }}
                  >
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: "#4a5568",
                    textAlign: "right",
                    minWidth: "120px",
                  }}
                >
                  {exp.startDate} – {exp.endDate || "Present"}
                </div>
              </div>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul
                  style={{
                    margin: "5px 0 0 0",
                    paddingLeft: "16px",
                    listStyleType: "disc",
                  }}
                >
                  {exp.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: "9.5pt",
                        marginBottom: "3px",
                        lineHeight: "1.4",
                        color: "#2d3748",
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

      publications: resumeData.publications &&
        resumeData.publications.length > 0 && (
          <section key="publications" style={{marginBottom: "14px"}}>
            <h2
              style={{
                fontSize: "11pt",
                fontWeight: "bold",
                color: "#1a202c",
                borderBottom: "1.5pt solid #2d3748",
                paddingBottom: "3px",
                marginBottom: "8px",
                textTransform: "uppercase",
                fontVariant: "small-caps",
                letterSpacing: "0.5px",
              }}
            >
              Publications
            </h2>
            <ol
              style={{margin: 0, paddingLeft: "18px", listStyleType: "decimal"}}
            >
              {resumeData.publications.map((pub, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: "9.5pt",
                    marginBottom: "8px",
                    lineHeight: "1.4",
                    color: "#2d3748",
                  }}
                >
                  <span style={{fontWeight: "600"}}>{pub.authors}</span>. "
                  {pub.title}".{" "}
                  <span style={{fontStyle: "italic"}}>
                    {pub.journal || pub.conference}
                  </span>
                  {pub.volume && `, ${pub.volume}`}
                  {pub.pages && `, pp. ${pub.pages}`}
                  {pub.year && ` (${pub.year})`}.
                  {pub.doi && (
                    <span style={{color: "#4299e1"}}> DOI: {pub.doi}</span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ),

      research: resumeData.research && resumeData.research.length > 0 && (
        <section key="research" style={{marginBottom: "14px"}}>
          <h2
            style={{
              fontSize: "11pt",
              fontWeight: "bold",
              color: "#1a202c",
              borderBottom: "1.5pt solid #2d3748",
              paddingBottom: "3px",
              marginBottom: "8px",
              textTransform: "uppercase",
              fontVariant: "small-caps",
              letterSpacing: "0.5px",
            }}
          >
            Research Experience
          </h2>
          {resumeData.research.map((res, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div style={{flex: 1}}>
                  <h3
                    style={{
                      fontSize: "10.5pt",
                      fontWeight: "bold",
                      color: "#1a202c",
                    }}
                  >
                    {res.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "10pt",
                      color: "#2d3748",
                      fontStyle: "italic",
                    }}
                  >
                    {res.institution}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "9.5pt",
                    color: "#4a5568",
                    textAlign: "right",
                  }}
                >
                  {res.date}
                </div>
              </div>
              {res.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    margin: "3px 0",
                    lineHeight: "1.4",
                    color: "#2d3748",
                  }}
                >
                  {res.description}
                </p>
              )}
            </div>
          ))}
        </section>
      ),

      achievements: resumeData.achievements &&
        resumeData.achievements.length > 0 && (
          <section key="achievements" style={{marginBottom: "14px"}}>
            <h2
              style={{
                fontSize: "11pt",
                fontWeight: "bold",
                color: "#1a202c",
                borderBottom: "1.5pt solid #2d3748",
                paddingBottom: "3px",
                marginBottom: "8px",
                textTransform: "uppercase",
                fontVariant: "small-caps",
                letterSpacing: "0.5px",
              }}
            >
              Honors & Awards
            </h2>
            <ul style={{margin: 0, paddingLeft: "16px", listStyleType: "disc"}}>
              {resumeData.achievements.map((achievement, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: "9.5pt",
                    marginBottom: "4px",
                    lineHeight: "1.4",
                    color: "#2d3748",
                  }}
                >
                  {achievement}
                </li>
              ))}
            </ul>
          </section>
        ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "14px"}}>
          <h2
            style={{
              fontSize: "11pt",
              fontWeight: "bold",
              color: "#1a202c",
              borderBottom: "1.5pt solid #2d3748",
              paddingBottom: "3px",
              marginBottom: "8px",
              textTransform: "uppercase",
              fontVariant: "small-caps",
              letterSpacing: "0.5px",
            }}
          >
            Technical Skills
          </h2>
          {resumeData.skills.map((skillGroup, index) => (
            <div
              key={index}
              style={{fontSize: "9.5pt", marginBottom: "4px", color: "#2d3748"}}
            >
              <span style={{fontWeight: "bold"}}>{skillGroup.category}:</span>{" "}
              {skillGroup.items?.join(", ")}
            </div>
          ))}
        </section>
      ),

      certifications: resumeData.certifications &&
        resumeData.certifications.length > 0 && (
          <section key="certifications" style={{marginBottom: "14px"}}>
            <h2
              style={{
                fontSize: "11pt",
                fontWeight: "bold",
                color: "#1a202c",
                borderBottom: "1.5pt solid #2d3748",
                paddingBottom: "3px",
                marginBottom: "8px",
                textTransform: "uppercase",
                fontVariant: "small-caps",
                letterSpacing: "0.5px",
              }}
            >
              Professional Certifications
            </h2>
            <ul style={{margin: 0, paddingLeft: "16px", listStyleType: "disc"}}>
              {resumeData.certifications.map((cert, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: "9.5pt",
                    marginBottom: "3px",
                    color: "#2d3748",
                  }}
                >
                  <span style={{fontWeight: "600"}}>{cert.name}</span>
                  {cert.issuer && `, ${cert.issuer}`}
                  {cert.date && ` (${cert.date})`}
                </li>
              ))}
            </ul>
          </section>
        ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={{marginBottom: "14px"}}>
          <h2
            style={{
              fontSize: "11pt",
              fontWeight: "bold",
              color: "#1a202c",
              borderBottom: "1.5pt solid #2d3748",
              paddingBottom: "3px",
              marginBottom: "8px",
              textTransform: "uppercase",
              fontVariant: "small-caps",
              letterSpacing: "0.5px",
            }}
          >
            Projects & Grants
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
                    color: "#1a202c",
                  }}
                >
                  {project.name}
                </h3>
                {project.date && (
                  <span style={{fontSize: "9.5pt", color: "#4a5568"}}>
                    {project.date}
                  </span>
                )}
              </div>
              {project.description && (
                <p
                  style={{
                    fontSize: "9.5pt",
                    margin: "3px 0",
                    lineHeight: "1.4",
                    color: "#2d3748",
                  }}
                >
                  {project.description}
                </p>
              )}
              {project.funding && (
                <p
                  style={{fontSize: "9pt", color: "#4a5568", marginTop: "2px"}}
                >
                  <span style={{fontStyle: "italic"}}>Funding:</span>{" "}
                  {project.funding}
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
              <section key={`custom-${index}`} style={{marginBottom: "14px"}}>
                <h2
                  style={{
                    fontSize: "11pt",
                    fontWeight: "bold",
                    color: "#1a202c",
                    borderBottom: "1.5pt solid #2d3748",
                    paddingBottom: "3px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontVariant: "small-caps",
                    letterSpacing: "0.5px",
                  }}
                >
                  {section.title}
                </h2>
                <div
                  style={{
                    fontSize: "9.5pt",
                    lineHeight: "1.4",
                    color: "#2d3748",
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
        padding: "20mm 20mm",
        fontFamily: "'Times New Roman', 'Garamond', serif",
        color: "#1a202c",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header Section - Academic Style */}
      <header
        style={{
          marginBottom: "18px",
          textAlign: "center",
          borderBottom: "2pt double #2d3748",
          paddingBottom: "12px",
        }}
      >
        <h1
          style={{
            fontSize: "18pt",
            fontWeight: "bold",
            marginBottom: "6px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#1a202c",
          }}
        >
          {resumeData.personalInfo?.fullName || "Your Name"}
        </h1>
        {resumeData.personalInfo?.title && (
          <div
            style={{
              fontSize: "11pt",
              color: "#2d3748",
              fontStyle: "italic",
              marginBottom: "8px",
            }}
          >
            {resumeData.personalInfo.title}
          </div>
        )}
        <div
          style={{
            fontSize: "9.5pt",
            color: "#4a5568",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {resumeData.personalInfo?.email && (
            <span>{resumeData.personalInfo.email}</span>
          )}
          {resumeData.personalInfo?.phone && <span>•</span>}
          {resumeData.personalInfo?.phone && (
            <span>{resumeData.personalInfo.phone}</span>
          )}
          {resumeData.personalInfo?.location && <span>•</span>}
          {resumeData.personalInfo?.location && (
            <span>{resumeData.personalInfo.location}</span>
          )}
        </div>
        {(resumeData.personalInfo?.linkedin ||
          resumeData.personalInfo?.website) && (
          <div
            style={{
              fontSize: "9pt",
              color: "#4a5568",
              marginTop: "4px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {resumeData.personalInfo?.linkedin && (
              <span>LinkedIn: {resumeData.personalInfo.linkedin}</span>
            )}
            {resumeData.personalInfo?.website && <span>•</span>}
            {resumeData.personalInfo?.website && (
              <span>Website: {resumeData.personalInfo.website}</span>
            )}
          </div>
        )}
      </header>

      {/* Summary if exists */}
      {resumeData.summary && renderSection("summary")}

      {/* Body Sections */}
      <div>{sectionOrder.map((sectionId) => renderSection(sectionId))}</div>
    </div>
  );
});

AcademicTemplate.displayName = "AcademicTemplate";

export default AcademicTemplate;
