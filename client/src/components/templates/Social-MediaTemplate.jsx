import { forwardRef, useRef, useEffect, useState } from "react";

const SocialMediaTemplate = forwardRef(({ resumeData, onPageUsageChange }, ref) => {
  // Page overflow detection state
  const containerRef = useRef(null);
  const [pageOverflowInfo, setPageOverflowInfo] = useState({
    isOverflowing: false,
    currentHeight: 0,
    maxHeight: 1056,
    overflowPercentage: 0,
    templateName: "SocialMediaTemplate",
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
        templateName: "SocialMediaTemplate",
      };

      setPageOverflowInfo(usageInfo);

      if (isOverflowing) {
        console.log(
          `⚠️ SocialMediaTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
        );
      }

      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData]);

  // Theme colors for the template
  const selectedTheme = {
    primary: "#2c3e50",
    secondary: "#3498db",
    text: "#333333",
    textLight: "#7f8c8d",
    textMuted: "#bdc3c7",
    border: "#ecf0f1",
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

  // Default section order - optimized for one page
  const DEFAULT_SECTION_ORDER = ["experience", "projects", "education", "additional", "achievements", "customSections"];

  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder.filter(
          (id) => !["summary", "score", "personal", "recommendations"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Get custom section titles
  const getSectionTitle = (sectionId) => {
    const customTitles = resumeData.sectionTitles || {};
    const defaultTitles = {
      experience: "PROFESSIONAL EXPERIENCE",
      projects: "PROJECTS",
      education: "EDUCATION",
      additional: "ADDITIONAL INFORMATION",
      achievements: "ACHIEVEMENTS",
      certifications: "CERTIFICATIONS",
      skills: "TECHNICAL SKILLS",
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
      marginBottom: "12px",
      pageBreakInside: "avoid",
      breakInside: "avoid",
    };

    const sections = {
      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "22px",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "6px",
              borderBottom: `2px solid ${selectedTheme.secondary}`,
              fontWeight: 600,
            }}
          >
            {getSectionTitle("experience")}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: "12px" }}>
              {/* Company and location on same line */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "5px" 
              }}>
                <div className="font-bold" style={{ 
                  fontSize: "18px", 
                  fontWeight: 600, 
                  color: selectedTheme.primary 
                }}>
                  {exp.company}
                </div>
              </div>
              
              {/* Job title and dates */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: "14px", 
                color: selectedTheme.textLight,
                marginBottom: "10px"
              }}>
                <div style={{ fontSize: "16px", fontWeight: 500, color: selectedTheme.secondary }}>
                  {exp.title}
                </div>
                <div>
                  {exp.location}
                </div>
              </div>
              
              {/* Dates */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: "14px", 
                color: selectedTheme.textLight,
                marginBottom: "10px"
              }}>
                <div></div>
                <div>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</div>
              </div>
              
              {/* Description */}
              {exp.description && (
                <div style={{ 
                  fontSize: "10pt", 
                  marginBottom: "10px", 
                  color: selectedTheme.text,
                  lineHeight: "1.4"
                }}>
                  {exp.description}
                </div>
              )}
              
              {/* Bullet points */}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{ paddingLeft: "20px", marginBottom: "8px" }}>
                  {exp.bullets.map((bullet, i) => (
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
              
              {/* Selected Project Experience (special format) */}
              {exp.projects && exp.projects.length > 0 && (
                <div style={{ marginTop: "8px", marginLeft: "15px" }}>
                  <div style={{ 
                    fontWeight: 600, 
                    color: selectedTheme.primary, 
                    marginBottom: "5px", 
                    fontSize: "16px" 
                  }}>
                    Selected Project Experience
                  </div>
                  
                  {exp.projects.map((project, projectIndex) => (
                    <div key={projectIndex} style={{ marginBottom: "8px" }}>
                      <div style={{ 
                        fontWeight: 600, 
                        color: selectedTheme.primary, 
                        marginBottom: "8px", 
                        fontSize: "16px" 
                      }}>
                        {project.name}
                      </div>
                      {project.bullets && project.bullets.length > 0 && (
                        <ul style={{ paddingLeft: "20px" }}>
                          {project.bullets.map((bullet, i) => (
                            <li 
                              key={i} 
                              style={{
                                fontSize: "10pt", 
                                marginBottom: "8px", 
                                color: selectedTheme.text,
                                lineHeight: "1.4",
                              }}
                            >
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
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
              fontSize: "22px",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "6px",
              borderBottom: `2px solid ${selectedTheme.secondary}`,
              fontWeight: 600,
            }}
          >
            {getSectionTitle("projects")}
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "5px" 
              }}>
                <div className="font-bold" style={{ 
                  fontSize: "16px", 
                  fontWeight: 600, 
                  color: selectedTheme.primary 
                }}>
                  {project.name || "Project Name"}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "13px",
                      color: selectedTheme.secondary,
                      textDecoration: "none",
                    }}
                  >
                    View Project
                  </a>
                )}
              </div>
              
              {project.technologies && (
                <div style={{ 
                  fontSize: "13px", 
                  color: selectedTheme.textLight,
                  marginBottom: "5px",
                  fontStyle: "italic"
                }}>
                  Technologies: {formatSkills(project.technologies)}
                </div>
              )}
              
              {project.description && (
                <div style={{ 
                  fontSize: "10pt", 
                  marginBottom: "5px", 
                  color: selectedTheme.text,
                  lineHeight: "1.3"
                }}>
                  {project.description}
                </div>
              )}
              
              {project.bullets && project.bullets.length > 0 && (
                <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                  {project.bullets.map((bullet, i) => (
                    <li 
                      key={i} 
                      style={{
                        fontSize: "10pt", 
                        marginBottom: "3px", 
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
              fontSize: "22px",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "6px",
              borderBottom: `2px solid ${selectedTheme.secondary}`,
              fontWeight: 600,
            }}
          >
            {getSectionTitle("education")}
          </h2>
          
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "5px" 
              }}>
                <div className="font-bold" style={{ 
                  fontSize: "18px", 
                  fontWeight: 600, 
                  color: selectedTheme.primary 
                }}>
                  {edu.institution}
                </div>
                <div>{edu.location}</div>
              </div>
              
              <div style={{ 
                fontWeight: 500, 
                color: selectedTheme.secondary, 
                marginBottom: "5px" 
              }}>
                {edu.degree}
                {edu.field && <span> in {edu.field}</span>}
              </div>
              
              {edu.gpa && (
                <div style={{ 
                  fontSize: "14px", 
                  color: selectedTheme.textLight,
                  marginBottom: "5px"
                }}>
                  GPA: {edu.gpa}
                </div>
              )}
              
              {edu.details && edu.details.length > 0 && (
                <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                  {edu.details.map((detail, i) => (
                    <li key={i} style={{ 
                      fontSize: "10pt", 
                      marginBottom: "2px", 
                      color: selectedTheme.text 
                    }}>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                fontSize: "14px", 
                color: selectedTheme.textLight 
              }}>
                <div></div>
                <div>{edu.startDate} – {edu.endDate}</div>
              </div>
            </div>
          ))}
        </section>
      ),

      additional: (
        <section key="additional" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "22px",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "6px",
              borderBottom: `2px solid ${selectedTheme.secondary}`,
              fontWeight: 600,
            }}
          >
            {getSectionTitle("additional")}
          </h2>
          
          {/* Technical Skills */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ 
                fontWeight: 600, 
                color: selectedTheme.primary, 
                marginBottom: "5px",
                fontSize: "16px"
              }}>
                Technical Skills:
              </div>
              <div style={{ 
                fontSize: "10pt", 
                color: selectedTheme.text, 
                lineHeight: "1.5"
              }}>
                {resumeData.skills.map((skillGroup, index) => (
                  <span key={index}>
                    {formatSkills(skillGroup.items)}
                    {index < resumeData.skills.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ 
                fontWeight: 600, 
                color: selectedTheme.primary, 
                marginBottom: "5px",
                fontSize: "16px"
              }}>
                Certifications:
              </div>
              <div style={{ 
                fontSize: "10pt", 
                color: selectedTheme.text, 
                lineHeight: "1.5"
              }}>
                {resumeData.certifications.map((cert, index) => (
                  <div key={index}>
                    {cert.name}{cert.date && ` (${cert.date})`}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Awards */}
          {resumeData.awards && resumeData.awards.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <div style={{ 
                fontWeight: 600, 
                color: selectedTheme.primary, 
                marginBottom: "5px",
                fontSize: "16px"
              }}>
                Awards:
              </div>
              <div style={{ 
                fontSize: "10pt", 
                color: selectedTheme.text, 
                lineHeight: "1.5"
              }}>
                {resumeData.awards.map((award, index) => (
                  <div key={index}>
                    {award.name}{award.date && ` — ${award.date}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ),

      achievements: resumeData.achievements && resumeData.achievements.length > 0 && (
        <section key="achievements" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "22px",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "6px",
              borderBottom: `2px solid ${selectedTheme.secondary}`,
              fontWeight: 600,
            }}
          >
            {getSectionTitle("achievements")}
          </h2>
          <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
            {resumeData.achievements.map((achievement, index) => (
              <li
                key={index}
                style={{
                  fontSize: "10pt",
                  marginBottom: "3px",
                  color: selectedTheme.text,
                  lineHeight: "1.3",
                }}
              >
                {achievement}
              </li>
            ))}
          </ul>
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
                      fontSize: "22px",
                      color: selectedTheme.primary,
                      marginBottom: "12px",
                      paddingBottom: "6px",
                      borderBottom: `2px solid ${selectedTheme.secondary}`,
                      fontWeight: 600,
                    }}
                  >
                    {section.title.toUpperCase()}
                  </h2>
                  <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        style={{
                          fontSize: "10pt",
                          marginBottom: "3px",
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
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header with dark background */}
      <header style={{ 
        backgroundColor: selectedTheme.primary,
        color: "white",
        padding: "20px 30px",
        margin: "-20px -30px 15px -30px"
      }}>
        <div style={{ 
          borderBottom: `2px solid ${selectedTheme.secondary}`,
          paddingBottom: "10px",
          marginBottom: "10px"
        }}>
          <h1
            className="font-bold"
            style={{
              fontSize: "32px",
              marginBottom: "5px",
              letterSpacing: "1px",
              fontWeight: 700,
            }}
          >
            {resumeData.name || "FIRST LAST NAME"}
          </h1>
          
          <div
            style={{
              fontSize: "20px",
              fontWeight: 400,
              color: "#ecf0f1",
            }}
          >
            {resumeData.title || "Senior Social Media Manager"}
          </div>
        </div>
        
        {/* Contact info with icons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            fontSize: "15px",
            color: "#bdc3c7",
          }}
        >
          {resumeData.contact?.location && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📍</span>
              <span>{resumeData.contact.location}</span>
            </div>
          )}
          
          {resumeData.contact?.email && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>✉️</span>
              <a
                href={`mailto:${resumeData.contact.email}`}
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                }}
              >
                {resumeData.contact.email}
              </a>
            </div>
          )}
          
          {resumeData.contact?.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📱</span>
              <span>{resumeData.contact.phone}</span>
            </div>
          )}
          
          {resumeData.contact?.linkedin && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💼</span>
              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                }}
              >
                LinkedIn
              </a>
            </div>
          )}
          
          {resumeData.contact?.github && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>👤</span>
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                }}
              >
                GitHub
              </a>
            </div>
          )}
          
          {resumeData.contact?.website && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🌐</span>
              <a
                href={resumeData.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                }}
              >
                Website
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Dynamic sections based on sectionOrder */}
      <div style={{ padding: "0 10px" }}>
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  );
});

SocialMediaTemplate.displayName = "SocialMediaTemplate";

export default SocialMediaTemplate;