import {forwardRef} from "react";

const ModernTemplate = forwardRef(({resumeData}, ref) => {
  return (
    <div
      ref={ref}
      className="resume-preview bg-white shadow-lg border border-gray-300 font-resume"
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
            <span>
              🔗 {resumeData.contact.linkedin.replace(/^https?:\/\//, "")}
            </span>
          )}
          {resumeData.contact?.github && (
            <span>
              💻 {resumeData.contact.github.replace(/^https?:\/\//, "")}
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {resumeData.summary && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            ABOUT ME
          </h2>
          <p style={{fontSize: "10pt", textAlign: "justify"}}>
            {resumeData.summary}
          </p>
        </section>
      )}

      {/* Skills - Grid Layout */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            SKILLS
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
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            EXPERIENCE
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
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section style={{marginBottom: "14px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            PROJECTS
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div className="font-bold" style={{fontSize: "11pt"}}>
                {project.name}
              </div>
              {project.technologies && project.technologies.length > 0 && (
                <div
                  style={{
                    fontSize: "9pt",
                    color: "#6b7280",
                    marginBottom: "3px",
                  }}
                >
                  <span className="font-semibold">Tech:</span>{" "}
                  {project.technologies.join(", ")}
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
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            EDUCATION
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
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "12pt",
              color: "#1a56db",
              marginBottom: "6px",
              letterSpacing: "0.5px",
            }}
          >
            CERTIFICATIONS
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
      )}
    </div>
  );
});

ModernTemplate.displayName = "ModernTemplate";

export default ModernTemplate;
