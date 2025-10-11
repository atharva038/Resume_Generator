import {forwardRef} from "react";

const MinimalTemplate = forwardRef(({resumeData}, ref) => {
  return (
    <div
      ref={ref}
      className="resume-preview bg-white shadow-lg border border-gray-300 font-resume"
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
            <span>
              {resumeData.contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          )}
          {resumeData.contact?.github && (
            <span>
              {resumeData.contact.github.replace(/^https?:\/\/(www\.)?/, "")}
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.summary && (
        <section style={{marginBottom: "16px"}}>
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
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <section style={{marginBottom: "16px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            EXPERIENCE
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
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section style={{marginBottom: "16px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            PROJECTS
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div style={{marginBottom: "2px"}}>
                <span className="font-bold" style={{fontSize: "11pt"}}>
                  {project.name}
                </span>
                {project.technologies && project.technologies.length > 0 && (
                  <span style={{fontSize: "9pt", color: "#6b7280"}}>
                    {" "}
                    — {project.technologies.join(", ")}
                  </span>
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
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <section style={{marginBottom: "16px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            EDUCATION
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
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <section style={{marginBottom: "16px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            SKILLS
          </h2>
          {resumeData.skills.map((skillGroup, index) => (
            <div key={index} style={{fontSize: "10pt", marginBottom: "5px"}}>
              <span className="font-semibold">{skillGroup.category}:</span>{" "}
              {skillGroup.items?.join(" • ")}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section style={{marginBottom: "12px"}}>
          <h2
            className="font-bold"
            style={{
              fontSize: "13pt",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >
            CERTIFICATIONS
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
      )}
    </div>
  );
});

MinimalTemplate.displayName = "MinimalTemplate";

export default MinimalTemplate;
