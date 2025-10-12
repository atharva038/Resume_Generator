import {forwardRef} from "react";

const ProfessionalTemplate = forwardRef(({resumeData}, ref) => {
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
      {/* Header - Professional Two-Column Layout */}
      <header
        style={{
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "3px solid #2563eb",
        }}
      >
        <h1
          className="font-bold"
          style={{fontSize: "24pt", marginBottom: "8px", color: "#1e40af"}}
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
                  style={{color: "#1e40af", textDecoration: "underline"}}
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
                  style={{color: "#1e40af", textDecoration: "underline"}}
                >
                  💻 GitHub
                </a>
              </div>
            )}
          </div>
        </div>
        {resumeData.contact?.location && (
          <div style={{fontSize: "10pt", marginTop: "4px", color: "#6b7280"}}>
            📍 {resumeData.contact.location}
          </div>
        )}
      </header>

      {/* Professional Summary */}
      {resumeData.summary && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: "#1e40af",
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: "2px solid #93c5fd",
            }}
          >
            Executive Summary
          </h2>
          <p
            style={{fontSize: "10pt", textAlign: "justify", lineHeight: "1.5"}}
          >
            {resumeData.summary}
          </p>
        </section>
      )}

      {/* Skills - Professional Grid */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: "#1e40af",
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: "2px solid #93c5fd",
            }}
          >
            Core Competencies
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
            }}
          >
            {resumeData.skills.map((skillGroup, index) => (
              <div key={index} style={{fontSize: "10pt"}}>
                <div
                  className="font-semibold"
                  style={{color: "#1e40af", marginBottom: "2px"}}
                >
                  {skillGroup.category}
                </div>
                <div style={{color: "#4b5563"}}>
                  {skillGroup.items?.join(" • ")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: "#1e40af",
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: "2px solid #93c5fd",
            }}
          >
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "12px"}}>
              <div
                className="flex justify-between items-start"
                style={{marginBottom: "3px"}}
              >
                <div style={{flex: 1}}>
                  <div
                    className="font-bold"
                    style={{fontSize: "11pt", color: "#1e40af"}}
                  >
                    {exp.title || "Position"}
                  </div>
                  <div style={{fontSize: "10pt", fontWeight: 600}}>
                    {exp.company}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "9pt",
                    color: "#6b7280",
                    textAlign: "right",
                  }}
                >
                  <div>{exp.location}</div>
                  <div>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
              </div>
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
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: "#1e40af",
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: "2px solid #93c5fd",
            }}
          >
            Key Projects
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
                <div
                  className="font-bold"
                  style={{fontSize: "11pt", color: "#1e40af"}}
                >
                  {project.name}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "9pt",
                      color: "#1e40af",
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🔗 View Project
                  </a>
                )}
              </div>
              {project.technologies && project.technologies.length > 0 && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: "#6b7280",
                    marginBottom: "3px",
                    fontStyle: "italic",
                  }}
                >
                  Technologies: {project.technologies.join(" | ")}
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
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: "#1e40af",
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: "2px solid #93c5fd",
            }}
          >
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "8px"}}>
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="font-bold" style={{fontSize: "10pt"}}>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </div>
                  <div style={{fontSize: "10pt", color: "#4b5563"}}>
                    {edu.institution}
                    {edu.location && <span> — {edu.location}</span>}
                  </div>
                </div>
                <div style={{fontSize: "9pt", color: "#6b7280"}}>
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
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: "#1e40af",
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: "2px solid #93c5fd",
            }}
          >
            Certifications
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
            }}
          >
            {resumeData.certifications.map((cert, index) => (
              <div key={index} style={{fontSize: "10pt"}}>
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && (
                  <div style={{fontSize: "9pt", color: "#6b7280"}}>
                    {cert.issuer} {cert.date && `(${cert.date})`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <section style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              color: "#1e40af",
              marginBottom: "6px",
              paddingBottom: "3px",
              borderBottom: "2px solid #93c5fd",
            }}
          >
            Achievements
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
      )}

      {/* Custom Sections */}
      {resumeData.customSections && resumeData.customSections.length > 0 && (
        <>
          {resumeData.customSections.map((section, sectionIndex) => {
            if (section.title && section.items && section.items.length > 0) {
              return (
                <section key={sectionIndex} style={{marginBottom: "12px"}}>
                  <h2
                    className="font-bold uppercase"
                    style={{
                      fontSize: "11pt",
                      color: "#1e40af",
                      marginBottom: "6px",
                      paddingBottom: "3px",
                      borderBottom: "2px solid #93c5fd",
                    }}
                  >
                    {section.title}
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
        </>
      )}
    </div>
  );
});

ProfessionalTemplate.displayName = "ProfessionalTemplate";

export default ProfessionalTemplate;
