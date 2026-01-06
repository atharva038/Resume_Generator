import {forwardRef, useRef, useEffect, useState} from "react";

const DataAnalystTemplate = forwardRef(({resumeData, onPageUsageChange}, ref) => {
  // Page overflow detection state
  const containerRef = useRef(null);
  const [pageOverflowInfo, setPageOverflowInfo] = useState({
    isOverflowing: false,
    currentHeight: 0,
    maxHeight: 1056,
    overflowPercentage: 0,
    templateName: "DataAnalystTemplate",
  });

  // Detect page overflow whenever resumeData changes
  useEffect(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.scrollHeight;
      const maxHeight = 1056;
      const isOverflowing = currentHeight > maxHeight;
      const overflowPercentage = isOverflowing
        ? Math.round(((currentHeight - maxHeight) / maxHeight) * 100)
        : 0;

      const usageInfo = {
        isOverflowing,
        currentHeight,
        maxHeight,
        overflowPercentage,
        percentage: Math.round((currentHeight / maxHeight) * 100),
        templateName: "DataAnalystTemplate",
      };

      setPageOverflowInfo(usageInfo);

      if (isOverflowing) {
        console.log(
          `⚠️ DataAnalystTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
        );
      }

      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData]);

  // Fixed color theme (black and white like the original)
  const selectedTheme = {
    primary: "#000000",
    secondary: "#000000",
    text: "#000000",
    textLight: "#000000",
    textMuted: "#000000",
    border: "#000000",
    bg: "#ffffff",
  };

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

  // Default section order
  const DEFAULT_SECTION_ORDER = [
    "experience",
    "projects",
    "education",
    "skills",
    "certifications",
    "customSections",
  ];

  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder.filter(
          (id) => !["summary", "score", "personal", "recommendations", "achievements"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Get custom section titles
  const getSectionTitle = (sectionId) => {
    const customTitles = resumeData.sectionTitles || {};
    const defaultTitles = {
      experience: "PROFESSIONAL EXPERIENCE",
      projects: "PROJECTS",
      education: "EDUCATION",
      skills: "SKILLS & OTHER",
      certifications: "CERTIFICATIONS",
    };
    return (
      customTitles[sectionId] ||
      defaultTitles[sectionId] ||
      sectionId
    ).toUpperCase();
  };

  // Format company line
  const formatCompanyLine = (company, location, startDate, endDate, current) => {
    let dateStr = "";
    if (startDate) {
      if (current) {
        dateStr = ` ${startDate} – Present`;
      } else if (endDate) {
        dateStr = ` ${startDate} – ${endDate}`;
      } else {
        dateStr = ` ${startDate}`;
      }
    }
    
    return `${company}${location ? `, ${location}` : ''}${dateStr}`;
  };

  // Render section helper function
  const renderSection = (sectionId) => {
    const sectionStyle = {
      marginBottom: "18px",
      pageBreakInside: "avoid",
      breakInside: "avoid",
    };

    const sections = {
      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "16pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.primary}`,
            }}
          >
            {getSectionTitle("experience")}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "24px"}}>
              {/* Company and date on same line */}
              <div style={{marginBottom: "6px"}}>
                <div className="font-bold" style={{fontSize: "11pt", color: selectedTheme.text}}>
                  {formatCompanyLine(exp.company, exp.location, exp.startDate, exp.endDate, exp.current)}
                </div>
              </div>
              
              {/* Job title */}
              {exp.title && (
                <div style={{fontSize: "11pt", fontWeight: "bold", marginBottom: "10px"}}>
                  {exp.title}
                </div>
              )}
              
              {/* Description */}
              {(exp.description || exp.summary) && (
                <div style={{
                  fontSize: "10pt",
                  marginBottom: "8px",
                  lineHeight: "1.3"
                }}>
                  {exp.description || exp.summary}
                </div>
              )}
              
              {/* Bullet points */}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{paddingLeft: "20px"}}>
                  {exp.bullets.map((bullet, i) => (
                    <li 
                      key={i} 
                      style={{
                        fontSize: "10pt", 
                        marginBottom: "6px", 
                        color: selectedTheme.text,
                        lineHeight: "1.3",
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              
              {/* Separator line (dashed) */}
              {index < resumeData.experience.length - 1 && (
                <div 
                  style={{
                    marginTop: "18px",
                    borderTop: `1px dashed ${selectedTheme.border}`,
                    height: "1px"
                  }}
                />
              )}
            </div>
          ))}
        </section>
      ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section key="projects" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "16pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.primary}`,
            }}
          >
            {getSectionTitle("projects")}
          </h2>
          
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "16px"}}>
              <div className="font-bold" style={{fontSize: "11pt", marginBottom: "6px"}}>
                {project.name || "Project Name"}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: "10px",
                      fontSize: "10pt",
                      color: selectedTheme.text,
                      textDecoration: "underline",
                    }}
                  >
                    View Project
                  </a>
                )}
              </div>
              
              {project.technologies && (
                <div style={{
                  fontSize: "10pt",
                  marginBottom: "6px",
                  fontStyle: "italic"
                }}>
                  Technologies: {formatSkills(project.technologies)}
                </div>
              )}
              
              {project.description && (
                <div style={{
                  fontSize: "10pt",
                  marginBottom: "6px",
                  lineHeight: "1.3"
                }}>
                  {project.description}
                </div>
              )}
              
              {project.bullets && project.bullets.length > 0 && (
                <ul style={{paddingLeft: "20px", marginTop: "4px"}}>
                  {project.bullets.map((bullet, i) => (
                    <li 
                      key={i} 
                      style={{
                        fontSize: "10pt", 
                        marginBottom: "4px", 
                        color: selectedTheme.text,
                        lineHeight: "1.3",
                      }}
                    >
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
        <section key="education" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "16pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.primary}`,
            }}
          >
            {getSectionTitle("education")}
          </h2>
          
          {/* Education table layout - EXACT FORMAT */}
          <table style={{width: "100%", borderCollapse: "collapse", fontSize: "10pt"}}>
            <tbody>
              {resumeData.education.map((edu, index) => (
                <tr key={index}>
                  <td style={{verticalAlign: "top", paddingBottom: "10px", width: "80%"}}>
                    <div className="font-bold" style={{color: selectedTheme.text}}>
                      {edu.institution}
                      {edu.location && <span>, {edu.location}</span>}
                    </div>
                    <div style={{color: selectedTheme.text, marginTop: "2px"}}>
                      <span className="font-bold">{edu.degree}</span>
                      {edu.field && <span>, {edu.field}</span>}
                    </div>
                    {edu.gpa && (
                      <div style={{color: selectedTheme.text, marginTop: "2px"}}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                    {edu.details && edu.details.length > 0 && (
                      <ul style={{marginTop: "4px", paddingLeft: "20px"}}>
                        {edu.details.map((detail, i) => (
                          <li key={i} style={{color: selectedTheme.text, marginBottom: "2px"}}>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td style={{
                    verticalAlign: "top", 
                    textAlign: "right",
                    paddingBottom: "10px",
                    color: selectedTheme.text,
                    whiteSpace: "nowrap",
                    width: "20%"
                  }}>
                    {edu.graduationDate || edu.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "16pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.primary}`,
            }}
          >
            {getSectionTitle("skills")}
          </h2>
          
          {/* Skills content - EXACT FORMAT */}
          <div style={{fontSize: "10pt", color: selectedTheme.text, lineHeight: "1.4"}}>
            {/* Skills line */}
            <div style={{marginBottom: "10px"}}>
              <span className="font-bold">Skills: </span>
              <span>
                {resumeData.skills.map((skillGroup, index) => (
                  <span key={index}>
                    {formatSkills(skillGroup.items)}
                    {index < resumeData.skills.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </section>
      ),

      certifications: resumeData.certifications && resumeData.certifications.length > 0 && (
        <section key="certifications" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "16pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `2px solid ${selectedTheme.primary}`,
            }}
          >
            {getSectionTitle("certifications")}
          </h2>
          
          <div style={{fontSize: "10pt", lineHeight: "1.4"}}>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} style={{marginBottom: "6px"}}>
                <span className="font-bold">{cert.name}</span>
                {cert.issuer && (
                  <span style={{color: selectedTheme.text}}>
                    {" — "}{cert.issuer}
                  </span>
                )}
                {cert.date && (
                  <span style={{color: selectedTheme.text}}>
                    {" ("}{cert.date}{")"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ),

      customSections: resumeData.customSections && resumeData.customSections.length > 0 && (
        <div key="customSections">
          {resumeData.customSections.map((section, sectionIndex) => {
            if (section.title && section.items && section.items.length > 0) {
              return (
                <section key={sectionIndex} style={sectionStyle}>
                  <h2
                    className="font-bold"
                    style={{
                      fontSize: "16pt",
                      color: selectedTheme.primary,
                      marginBottom: "12px",
                      paddingBottom: "4px",
                      borderBottom: `2px solid ${selectedTheme.primary}`,
                    }}
                  >
                    {section.title.toUpperCase()}
                  </h2>
                  
                  <ul style={{paddingLeft: "20px", fontSize: "10pt"}}>
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        style={{
                          marginBottom: "6px",
                          color: selectedTheme.text,
                          lineHeight: "1.3",
                        }}
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
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className="resume-preview font-resume"
      style={{
        minHeight: "11in",
        padding: "0.5in",
        fontSize: "10.5pt",
        lineHeight: "1.4",
        color: selectedTheme.text,
        backgroundColor: selectedTheme.bg,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header - EXACT FORMAT */}
      <header style={{marginBottom: "20px"}}>
        <h1
          className="font-bold uppercase"
          style={{
            fontSize: "24pt",
            marginBottom: "8px",
            color: selectedTheme.primary,
            letterSpacing: "0.5px",
            fontWeight: "bold",
          }}
        >
          {resumeData.name || "FIRST LAST"}
        </h1>
        
        {/* Contact info in a single line with dots */}
        <div
          style={{
            fontSize: "10pt",
            color: selectedTheme.text,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {resumeData.contact?.location && (
            <span style={{marginRight: "8px"}}>{resumeData.contact.location}</span>
          )}
          {resumeData.contact?.location && resumeData.contact?.phone && (
            <span style={{margin: "0 8px"}}>·</span>
          )}
          {resumeData.contact?.phone && (
            <span style={{marginRight: "8px"}}>{resumeData.contact.phone}</span>
          )}
          {resumeData.contact?.phone && resumeData.contact?.email && (
            <span style={{margin: "0 8px"}}>·</span>
          )}
          {resumeData.contact?.email && (
            <a
              href={`mailto:${resumeData.contact.email}`}
              style={{
                color: selectedTheme.text,
                textDecoration: "none",
                marginRight: "8px",
              }}
            >
              {resumeData.contact.email}
            </a>
          )}
          {resumeData.contact?.email && resumeData.contact?.linkedin && (
            <span style={{margin: "0 8px"}}>·</span>
          )}
          {resumeData.contact?.linkedin && (
            <a
              href={resumeData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: selectedTheme.text,
                textDecoration: "none",
              }}
            >
              linkedin.com/in/{resumeData.contact.linkedin.split('/').pop()}
            </a>
          )}
        </div>
        
        {/* Optional Summary Note */}
        {resumeData.summary && (
          <div style={{
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: `1px solid ${selectedTheme.border}`,
            fontSize: "9pt",
            color: selectedTheme.text,
            lineHeight: "1.5"
          }}>
            <div style={{fontStyle: "italic", marginBottom: "8px"}}>
              NB: The Summary section is completely optional. However, if you have valuable experience that doesn't fit in your experience section below (e.g. you're changing careers), you can include one.
            </div>
            <p>
              {resumeData.summary}
            </p>
          </div>
        )}
      </header>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

DataAnalystTemplate.displayName = "DataAnalystTemplate";

export default DataAnalystTemplate;