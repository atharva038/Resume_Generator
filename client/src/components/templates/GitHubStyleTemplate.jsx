import {forwardRef, useRef, useEffect, useState} from "react";

const GitHubStyleTemplate = forwardRef(({resumeData, onPageUsageChange}, ref) => {
  // Page overflow detection state
  const containerRef = useRef(null);
  const [pageOverflowInfo, setPageOverflowInfo] = useState({
    isOverflowing: false,
    currentHeight: 0,
    maxHeight: 1056, // Standard A4 page height at 96 DPI (11 inches * 96)
    overflowPercentage: 0,
    templateName: "GitHubStyleTemplate",
  });

  // Detect page overflow whenever resumeData changes
  useEffect(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.scrollHeight;
      const maxHeight = 1056; // A4 page height
      const isOverflowing = currentHeight > maxHeight;
      const overflowPercentage = isOverflowing
        ? Math.round(((currentHeight - maxHeight) / maxHeight) * 100)
        : 0;

      const usageInfo = {
        isOverflowing,
        currentHeight,
        maxHeight,
        overflowPercentage,
        percentage: Math.round((currentHeight / maxHeight) * 100), // Allow > 100% for overflow
        templateName: "GitHubStyleTemplate",
      };

      setPageOverflowInfo(usageInfo);

      // Log overflow information for testing
      if (isOverflowing) {
        console.log(
          `⚠️ GitHubStyleTemplate: Page overflow detected! Current height: ${currentHeight}px, Max: ${maxHeight}px, Overflow: ${overflowPercentage}%`
        );
      } else {
        console.log(
          `✅ GitHubStyleTemplate: Content fits on one page. Height: ${currentHeight}px / ${maxHeight}px (${usageInfo.percentage}% filled)`
        );
      }

      // Pass data to parent component if callback provided
      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData]);

  // Color Themes - GitHub style
  const colorThemes = {
    github: {
      primary: "#24292e", // GitHub dark gray
      secondary: "#0366d6", // GitHub blue
      text: "#24292e",
      textLight: "#586069",
      textMuted: "#6a737d",
      border: "#e1e4e8",
      bg: "#ffffff",
    },
    dark: {
      primary: "#0d1117", // GitHub dark mode
      secondary: "#58a6ff",
      text: "#c9d1d9",
      textLight: "#8b949e",
      textMuted: "#6e7681",
      border: "#30363d",
      bg: "#0d1117",
    },
    blue: {
      primary: "#0366d6",
      secondary: "#1a73e8",
      text: "#202124",
      textLight: "#5f6368",
      textMuted: "#80868b",
      border: "#dadce0",
      bg: "#ffffff",
    },
    green: {
      primary: "#22863a", // GitHub green
      secondary: "#28a745",
      text: "#24292e",
      textLight: "#586069",
      textMuted: "#6a737d",
      border: "#e1e4e8",
      bg: "#ffffff",
    },
  };

  // Select theme based on resumeData or default to github
  const selectedTheme = colorThemes[resumeData?.colorTheme] || colorThemes.github;

  // Default section order for GitHub style format
  const DEFAULT_SECTION_ORDER = [
    "summary",
    "experience",
    "projects",
    "education",
    "publications",
    "skills",
  ];

  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder.filter(
          (id) => !["certifications", "achievements", "personal"].includes(id)
        )
      : DEFAULT_SECTION_ORDER;

  // Get custom section titles or use defaults
  const getSectionTitle = (sectionId) => {
    const customTitles = resumeData.sectionTitles || {};
    const defaultTitles = {
      summary: "SUMMARY",
      experience: "WORK EXPERIENCE",
      projects: "PROJECTS",
      education: "EDUCATION",
      publications: "PUBLICATIONS",
      skills: "SKILLS",
    };
    return (
      customTitles[sectionId] ||
      defaultTitles[sectionId] ||
      sectionId
    ).toUpperCase();
  };

  // Helper function to format contact items
  const formatContactItem = (item, icon) => {
    if (!item) return null;
    
    if (item.startsWith('http')) {
      return (
        <a
          href={item}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: selectedTheme.secondary,
            textDecoration: "none",
          }}
        >
          {icon} {item}
        </a>
      );
    }
    
    if (item.includes('@')) {
      return (
        <a
          href={`mailto:${item}`}
          style={{
            color: selectedTheme.secondary,
            textDecoration: "none",
          }}
        >
          {icon} {item}
        </a>
      );
    }
    
    return <span>{icon} {item}</span>;
  };

  // Render section helper function
  const renderSection = (sectionId) => {
    // Common style to prevent page breaks inside sections
    const sectionStyle = {
      marginBottom: "20px",
      pageBreakInside: "avoid",
      breakInside: "avoid",
    };

    const sections = {
      summary: resumeData.summary && (
        <section key="summary" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "14pt",
              color: selectedTheme.primary,
              marginBottom: "8px",
              paddingBottom: "4px",
              borderBottom: `1px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("summary")}
          </h2>
          <p style={{fontSize: "10pt", color: selectedTheme.text, lineHeight: "1.5"}}>
            {resumeData.summary}
          </p>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section key="experience" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "14pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `1px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("experience")}
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} style={{marginBottom: "16px"}}>
              <div style={{marginBottom: "8px"}}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold" style={{fontSize: "11pt", color: selectedTheme.primary}}>
                    {exp.title || "Designation"}
                  </span>
                  <span style={{fontSize: "10pt", color: selectedTheme.textMuted, whiteSpace: "nowrap"}}>
                    {exp.startDate} - {exp.current ? "present" : exp.endDate}
                  </span>
                </div>
                {exp.company && (
                  <div style={{fontSize: "10pt", color: selectedTheme.textLight, marginTop: "2px"}}>
                    {exp.company}
                  </div>
                )}
              </div>
              {exp.description && (
                <div style={{fontSize: "10pt", color: selectedTheme.text, lineHeight: "1.5"}}>
                  {exp.description}
                </div>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul style={{marginTop: "8px", paddingLeft: "20px"}}>
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "10pt", marginBottom: "4px", color: selectedTheme.text, lineHeight: "1.5"}}>
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
        <section key="projects" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "14pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `1px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("projects")}
          </h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} style={{marginBottom: "16px"}}>
              <div style={{marginBottom: "6px"}}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold" style={{fontSize: "11pt", color: selectedTheme.primary}}>
                    {project.name || "Project Name"}
                  </span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "10pt",
                        color: selectedTheme.secondary,
                        textDecoration: "none",
                      }}
                    >
                      Link to Demo
                    </a>
                  )}
                </div>
                {project.technologies && (
                  <div style={{fontSize: "9pt", color: selectedTheme.textMuted, marginTop: "2px"}}>
                    {Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies}
                  </div>
                )}
              </div>
              {project.description && (
                <div style={{fontSize: "10pt", color: selectedTheme.text, lineHeight: "1.5"}}>
                  {project.description}
                </div>
              )}
              {project.bullets && project.bullets.length > 0 && (
                <ul style={{marginTop: "6px", paddingLeft: "20px"}}>
                  {project.bullets.map((bullet, i) => (
                    <li key={i} style={{fontSize: "10pt", marginBottom: "3px", color: selectedTheme.text, lineHeight: "1.5"}}>
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
              fontSize: "14pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `1px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("education")}
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} style={{marginBottom: "12px"}}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold" style={{fontSize: "10pt", color: selectedTheme.primary}}>
                    {edu.degree} {edu.field && `(${edu.field})`}
                  </span>
                  {edu.institution && (
                    <span style={{fontSize: "10pt", color: selectedTheme.primary}}>
                      {" "}at <strong>{edu.institution}</strong>
                    </span>
                  )}
                </div>
                <div style={{fontSize: "9pt", color: selectedTheme.textMuted}}>
                  {edu.startDate} - {edu.endDate || "present"}
                </div>
              </div>
              {(edu.gpa || edu.grades) && (
                <div style={{fontSize: "10pt", color: selectedTheme.textLight, marginTop: "2px"}}>
                  {edu.gpa && `GPA: ${edu.gpa}`}
                  {edu.grades && `Grades: ${edu.grades}`}
                </div>
              )}
              {edu.location && (
                <div style={{fontSize: "9pt", color: selectedTheme.textMuted, marginTop: "1px"}}>
                  {edu.location}
                </div>
              )}
            </div>
          ))}
        </section>
      ),

      publications: resumeData.publications && resumeData.publications.length > 0 && (
        <section key="publications" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "14pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `1px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("publications")}
          </h2>
          {resumeData.publications.map((pub, index) => (
            <div key={index} style={{marginBottom: "12px", fontSize: "9.5pt", color: selectedTheme.text, lineHeight: "1.5"}}>
              {pub.authors && <span>{pub.authors} </span>}
              {pub.date && <span>({pub.date}). </span>}
              {pub.title && <span>"<strong>{pub.title}</strong>". </span>}
              {pub.journal && <span>In: <em>{pub.journal}</em> </span>}
              {pub.volume && <span>{pub.volume}</span>}
              {pub.pages && <span>, pp. {pub.pages}. </span>}
              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: selectedTheme.secondary,
                    textDecoration: "none",
                  }}
                >
                  url: {pub.url}
                </a>
              )}
            </div>
          ))}
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section key="skills" style={sectionStyle}>
          <h2
            className="font-bold"
            style={{
              fontSize: "14pt",
              color: selectedTheme.primary,
              marginBottom: "12px",
              paddingBottom: "4px",
              borderBottom: `1px solid ${selectedTheme.border}`,
            }}
          >
            {getSectionTitle("skills")}
          </h2>
          {resumeData.skills.map((skillGroup, index) => (
            <div key={index} style={{marginBottom: "10px"}}>
              <div className="font-bold" style={{fontSize: "10pt", color: selectedTheme.textLight, marginBottom: "4px"}}>
                {skillGroup.category}
              </div>
              <div style={{fontSize: "10pt", color: selectedTheme.text}}>
                {Array.isArray(skillGroup.items) 
                  ? skillGroup.items.join(", ")
                  : skillGroup.items}
              </div>
            </div>
          ))}
        </section>
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
        padding: "0.75in",
        fontSize: "10.5pt",
        lineHeight: "1.4",
        color: selectedTheme.text,
        backgroundColor: selectedTheme.bg,
      }}
    >
      {/* Header - GitHub Style */}
      <header style={{marginBottom: "24px", textAlign: "center"}}>
        <h1
          className="font-bold"
          style={{
            fontSize: "22pt",
            marginBottom: "8px",
            color: selectedTheme.primary,
          }}
        >
          {resumeData.name || "Your Name"}
        </h1>
        
        <div
          style={{
            fontSize: "10pt",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "12px",
            color: selectedTheme.textLight,
            marginTop: "8px",
          }}
        >
          {resumeData.contact?.github && formatContactItem(resumeData.contact.github, "👤")}
          {resumeData.contact?.linkedin && formatContactItem(resumeData.contact.linkedin, "💼")}
          {resumeData.contact?.website && formatContactItem(resumeData.contact.website, "🌐")}
          {resumeData.contact?.email && formatContactItem(resumeData.contact.email, "✉️")}
          {resumeData.contact?.phone && formatContactItem(resumeData.contact.phone, "📱")}
        </div>
      </header>

      {/* Dynamic sections based on sectionOrder */}
      {sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
});

GitHubStyleTemplate.displayName = "GitHubStyleTemplate";

export default GitHubStyleTemplate;