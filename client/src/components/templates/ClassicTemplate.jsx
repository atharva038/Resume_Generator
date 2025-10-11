import {forwardRef} from "react";

const ClassicTemplate = forwardRef(({resumeData}, ref) => {
  // Default section order if not specified
  const DEFAULT_SECTION_ORDER = [
    "summary",
    "skills",
    "experience",
    "education",
    "projects",
    "certifications",
  ];
  
  const sectionOrder = resumeData.sectionOrder?.filter(id => 
    !['score', 'personal', 'recommendations'].includes(id)
  ) || DEFAULT_SECTION_ORDER;

  // Render section helper function
  const renderSection = (sectionId) => {
    const sections = {
      summary: resumeData.summary && (
        <section key="summary" style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
            }}
          >
            Professional Summary
          </h2>
          <p style={{fontSize: "10pt"}}>{resumeData.summary}</p>
        </section>
      ),
      
      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
            }}
          >
            Skills
          </h2>
          {resumeData.skills.map((skillGroup, index) => (
            <div key={index} style={{fontSize: "10pt", marginBottom: "4px"}}>
              <span className="font-semibold">{skillGroup.category}:</span>{" "}
              {skillGroup.items?.join(", ")}
            </div>
          ))}
        </section>
      ),
      
      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
            }}
          >
            Professional Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div
                className="flex justify-between items-baseline"
                style={{marginBottom: "3px"}}
              >
                <div>
                  <span className="font-bold" style={{fontSize: "10pt"}}>
                    {exp.company}
                  </span>
                  {exp.title && (
                    <span style={{fontSize: "10pt"}}> — {exp.title}</span>
                  )}
                </div>
                <div style={{fontSize: "9pt"}}>
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
                  style={{fontSize: "9pt", marginBottom: "3px"}}
                >
                  {exp.location}
                </div>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-5"
                  style={{marginTop: "4px"}}
                >
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
        <section key="projects" style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
            }}
          >
            Projects
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div className="font-bold" style={{fontSize: "10pt"}}>
                {project.name}
              </div>
              {project.technologies && project.technologies.length > 0 && (
                <div
                  className="italic"
                  style={{fontSize: "9pt", marginBottom: "3px"}}
                >
                  Technologies: {project.technologies.join(", ")}
                </div>
              )}
              {project.bullets && project.bullets.length > 0 && (
                <ul
                  className="list-disc list-outside ml-5"
                  style={{marginTop: "4px"}}
                >
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
        <section key="education" style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
            }}
          >
            Education
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "8px"}}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold" style={{fontSize: "10pt"}}>
                    {edu.institution}
                  </span>
                  {edu.location && (
                    <span style={{fontSize: "9pt"}}> — {edu.location}</span>
                  )}
                </div>
                <div style={{fontSize: "9pt"}}>
                  {edu.startDate && (
                    <>
                      {edu.startDate} - {edu.endDate}
                    </>
                  )}
                </div>
              </div>
              <div style={{fontSize: "10pt"}}>
                {edu.degree && edu.field && (
                  <span>
                    {edu.degree} in {edu.field}
                  </span>
                )}
                {edu.gpa && (
                  <span style={{fontSize: "9pt"}}> | GPA: {edu.gpa}</span>
                )}
              </div>
            </div>
          ))}
        </section>
      ),
      
      certifications: resumeData.certifications && resumeData.certifications.length > 0 && (
        <section key="certifications" style={{marginBottom: "12px"}}>
          <h2
            className="font-bold uppercase"
            style={{
              fontSize: "11pt",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
            }}
          >
            Certifications
          </h2>
          {resumeData.certifications.map((cert, index) => (
            <div key={index} style={{fontSize: "10pt", marginBottom: "4px"}}>
              <span className="font-semibold">{cert.name}</span>
              {cert.issuer && <span> — {cert.issuer}</span>}
              {cert.date && (
                <span style={{fontSize: "9pt"}}> ({cert.date})</span>
              )}
            </div>
          ))}
        </section>
      ),
    };
    
    return sections[sectionId] || null;
  };

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
      {/* Header - Contact Information */}
      <header
        className="text-center pb-2 mb-3"
        style={{borderBottom: "2px solid black"}}
      >
        <h1
          className="font-bold uppercase tracking-wide"
          style={{fontSize: "22pt", marginBottom: "8px"}}
        >
          {resumeData.name || "Your Name"}
        </h1>
        <div style={{fontSize: "10pt"}}>
          {resumeData.contact?.email && (
            <div style={{marginBottom: "4px"}}>{resumeData.contact.email}</div>
          )}
          <div className="flex justify-center gap-3 flex-wrap">
            {resumeData.contact?.phone && (
              <span>{resumeData.contact.phone}</span>
            )}
            {resumeData.contact?.location && (
              <span>{resumeData.contact.location}</span>
            )}
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {resumeData.contact?.linkedin && (
              <span>
                {resumeData.contact.linkedin.replace(/^https?:\/\//, "")}
              </span>
            )}
            {resumeData.contact?.github && (
              <span>
                {resumeData.contact.github.replace(/^https?:\/\//, "")}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

ClassicTemplate.displayName = "ClassicTemplate";

export default ClassicTemplate;
