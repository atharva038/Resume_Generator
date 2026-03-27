import {forwardRef, useRef, useEffect, useMemo} from "react";

/**
 * Metro Grid Narrative template
 *
 * A modular, ATS-safe design direction with rail markers, split masthead,
 * and matrix-style section rhythm.
 */
const GitHubStyleTemplate = forwardRef(
  ({resumeData, onPageUsageChange}, ref) => {
    const containerRef = useRef(null);

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
          percentage: Math.round((currentHeight / maxHeight) * 100), // Allow > 100% for overflow
          templateName: "GitHubStyleTemplate",
        };

        if (onPageUsageChange) {
          onPageUsageChange(usageInfo);
        }
      }
    }, [resumeData, onPageUsageChange]);

    const colorThemes = {
      metroNavy: {
        primary: "#13315c",
        accent: "#1d4e89",
        rail: "#2f6690",
        badgeText: "#ffffff",
        text: "#111827",
        textLight: "#374151",
        textMuted: "#4b5563",
        border: "#d1d5db",
        panelBg: "#f8fafc",
        bg: "#ffffff",
      },
      metroTeal: {
        primary: "#0f4c5c",
        accent: "#157a6e",
        rail: "#1b9aaa",
        badgeText: "#ffffff",
        text: "#111827",
        textLight: "#334155",
        textMuted: "#475569",
        border: "#d4d4d8",
        panelBg: "#f8fafc",
        bg: "#ffffff",
      },
      metroBurgundy: {
        primary: "#5e2129",
        accent: "#8b2635",
        rail: "#b23a48",
        badgeText: "#ffffff",
        text: "#1f2937",
        textLight: "#374151",
        textMuted: "#6b7280",
        border: "#d4d4d8",
        panelBg: "#faf7f7",
        bg: "#ffffff",
      },
    };

    const selectedTheme =
      colorThemes[resumeData?.selectedTheme || resumeData?.colorTheme] ||
      colorThemes.metroNavy;

    const headingFont =
      '"Avenir Next", "Montserrat", "Segoe UI", sans-serif';
    const bodyFont =
      '"Source Sans 3", "Calibri", "Trebuchet MS", sans-serif';

    const isDenseContent = useMemo(() => {
      let score = 0;
      score += (resumeData?.experience?.length || 0) * 3;
      score += (resumeData?.projects?.length || 0) * 2;
      score += (resumeData?.education?.length || 0) * 1.5;
      score += (resumeData?.skills?.length || 0) * 1.5;
      score += (resumeData?.certifications?.length || 0) * 1;
      score += (resumeData?.achievements?.length || 0) * 1;
      score += (resumeData?.publications?.length || 0) * 1;
      if (resumeData?.summary?.length > 220) score += 2;
      return score >= 24;
    }, [resumeData]);

    const compact = {
      pagePadding: isDenseContent ? "0.44in" : "0.5in",
      bandMarginSmall: isDenseContent ? "6px" : "8px",
      bandMarginLarge: isDenseContent ? "8px" : "10px",
      panelPadding: isDenseContent ? "6px 7px" : "8px 9px",
      railWidth: isDenseContent ? "5px" : "6px",
      headingSize: isDenseContent ? "10pt" : "10.8pt",
      bodySize: isDenseContent ? "8.8pt" : "9.3pt",
      smallText: isDenseContent ? "8pt" : "8.5pt",
    };

    const DEFAULT_SECTION_ORDER = [
      "summary",
      "experience",
      "projects",
      "skills",
      "education",
      "certifications",
      "achievements",
      "publications",
      "customSections",
    ];

    const sectionOrder =
      resumeData.sectionOrder && resumeData.sectionOrder.length > 0
        ? resumeData.sectionOrder.filter(
            (id) => !["score", "personal", "recommendations"].includes(id)
          )
        : DEFAULT_SECTION_ORDER;

    const getSectionTitle = (sectionId) => {
      const customTitles = resumeData.sectionTitles || {};
      const defaultTitles = {
        summary: "Professional Summary",
        experience: "Experience",
        projects: "Projects",
        skills: "Skills Matrix",
        education: "Education",
        certifications: "Certifications",
        achievements: "Achievements",
        publications: "Publications",
        customSections: "Additional Information",
      };
      return customTitles[sectionId] || defaultTitles[sectionId] || sectionId;
    };

    const formatContactItem = (label, value) => {
      if (!value) return null;

      let href = null;
      if (value.includes("@")) {
        href = `mailto:${value}`;
      } else if (value.startsWith("http")) {
        href = value;
      } else if (
        label === "LinkedIn" ||
        label === "GitHub" ||
        label === "Website"
      ) {
        href = value.startsWith("www.") ? `https://${value}` : `https://${value}`;
      }

      if (!href) {
        return (
          <span style={{fontSize: "9pt", color: selectedTheme.textLight}}>
            {label}: {value}
          </span>
        );
      }

      return (
        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
          style={{
            fontSize: "9pt",
            color: selectedTheme.accent,
            textDecoration: "none",
          }}
        >
          {label}: {value}
        </a>
      );
    };

    const renderBandHeader = (label, index) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "5px",
        }}
      >
        <span
          style={{
            backgroundColor: selectedTheme.rail,
            color: selectedTheme.badgeText,
            fontSize: "7.8pt",
            fontWeight: "700",
            padding: "1px 6px",
            borderRadius: "4px",
            letterSpacing: "0.3px",
            minWidth: "20px",
            textAlign: "center",
            fontFamily: headingFont,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2
          style={{
            margin: 0,
            color: selectedTheme.primary,
            fontFamily: headingFont,
            fontSize: compact.headingSize,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            fontWeight: "700",
          }}
        >
          {label}
        </h2>
      </div>
    );

    const renderBand = (sectionId, sectionIndex, content) => {
      if (!content) return null;
      return (
        <section
          key={sectionId}
          style={{
            marginBottom:
              sectionIndex % 2 === 0
                ? compact.bandMarginSmall
                : compact.bandMarginLarge,
            pageBreakInside: "auto",
            breakInside: "auto",
            display: "grid",
            gridTemplateColumns: `${compact.railWidth} 1fr`,
              gap: "6px",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: compact.railWidth,
              borderRadius: "3px",
              background: `linear-gradient(180deg, ${selectedTheme.rail}, ${selectedTheme.accent})`,
            }}
          />
          <div
            style={{
              border: `1px solid ${selectedTheme.border}`,
              backgroundColor:
                sectionIndex % 2 === 0 ? selectedTheme.panelBg : selectedTheme.bg,
              borderRadius: "6px",
              padding: compact.panelPadding,
            }}
          >
            {renderBandHeader(getSectionTitle(sectionId), sectionIndex)}
            {content}
          </div>
        </section>
      );
    };

    const toArray = (value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return [];
    };

    const renderSectionContent = (sectionId) => {
      const data = resumeData || {};

      if (sectionId === "summary" && data.summary) {
        return (
          <p
            style={{
              margin: 0,
              fontSize: compact.bodySize,
              lineHeight: "1.4",
              color: selectedTheme.text,
              fontFamily: bodyFont,
              textAlign: "justify",
            }}
          >
            {data.summary}
          </p>
        );
      }

      if (sectionId === "experience" && data.experience?.length) {
        return data.experience.map((exp, index) => (
          <div key={index} style={{marginBottom: index === data.experience.length - 1 ? 0 : "7px"}}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                alignItems: "baseline",
                marginBottom: "3px",
              }}
            >
              <span
                style={{
                  color: selectedTheme.primary,
                  fontSize: compact.bodySize,
                  fontWeight: "700",
                  fontFamily: headingFont,
                }}
              >
                {exp.title || "Role"}
                {exp.company ? `, ${exp.company}` : ""}
              </span>
              <span style={{fontSize: compact.smallText, color: selectedTheme.textMuted}}>
                {exp.startDate || ""} - {exp.current ? "Present" : exp.endDate || "Present"}
              </span>
            </div>
            {exp.location && (
              <div
                style={{
                  marginBottom: "3px",
                  fontSize: compact.smallText,
                  color: selectedTheme.textLight,
                  fontFamily: bodyFont,
                }}
              >
                {exp.location}
              </div>
            )}
            {exp.description && (
              <p
                style={{
                  margin: "0 0 3px 0",
                  fontSize: compact.bodySize,
                  lineHeight: "1.35",
                  color: selectedTheme.text,
                  fontFamily: bodyFont,
                }}
              >
                {exp.description}
              </p>
            )}
            {exp.bullets?.length > 0 && (
              <ul style={{margin: "0", paddingLeft: "18px"}}>
                {exp.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    style={{
                      marginBottom: "1px",
                      color: selectedTheme.text,
                      fontSize: compact.bodySize,
                      lineHeight: "1.3",
                      fontFamily: bodyFont,
                    }}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ));
      }

      if (sectionId === "projects" && data.projects?.length) {
        return data.projects.map((project, index) => (
          <div key={index} style={{marginBottom: index === data.projects.length - 1 ? 0 : "7px"}}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                alignItems: "baseline",
                marginBottom: "3px",
              }}
            >
              <span
                style={{
                  color: selectedTheme.primary,
                  fontSize: compact.bodySize,
                  fontWeight: "700",
                  fontFamily: headingFont,
                }}
              >
                {project.name || "Project"}
              </span>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: selectedTheme.accent,
                    fontSize: compact.smallText,
                    textDecoration: "none",
                  }}
                >
                  Project Link
                </a>
              )}
            </div>
            {project.technologies && (
              <div
                style={{
                  marginBottom: "3px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                {toArray(project.technologies).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    style={{
                      backgroundColor: selectedTheme.bg,
                      border: `1px solid ${selectedTheme.border}`,
                      padding: "1px 5px",
                      borderRadius: "12px",
                      fontSize: "7.8pt",
                      color: selectedTheme.textLight,
                      fontFamily: headingFont,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {project.description && (
              <p
                style={{
                  margin: "0 0 3px 0",
                  fontSize: compact.bodySize,
                  lineHeight: "1.32",
                  color: selectedTheme.text,
                  fontFamily: bodyFont,
                }}
              >
                {project.description}
              </p>
            )}
            {project.bullets?.length > 0 && (
              <ul style={{margin: 0, paddingLeft: "18px"}}>
                {project.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    style={{
                      marginBottom: "1px",
                      color: selectedTheme.text,
                      fontSize: compact.bodySize,
                      lineHeight: "1.3",
                      fontFamily: bodyFont,
                    }}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ));
      }

      if (sectionId === "skills" && data.skills?.length) {
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                data.skills.length >= 6
                  ? "repeat(3, minmax(0, 1fr))"
                  : "repeat(2, minmax(0, 1fr))",
              gap: "6px 8px",
            }}
          >
            {data.skills.map((skillGroup, index) => (
              <div
                key={index}
                style={{
                  border: `1px solid ${selectedTheme.border}`,
                  backgroundColor: selectedTheme.bg,
                  borderRadius: "4px",
                  padding: "5px 6px",
                }}
              >
                <div
                  style={{
                    fontSize: compact.smallText,
                    fontWeight: "700",
                    marginBottom: "2px",
                    color: selectedTheme.primary,
                    fontFamily: headingFont,
                  }}
                >
                  {skillGroup.category || "Category"}
                </div>
                <div
                  style={{
                    fontSize: compact.smallText,
                    lineHeight: "1.25",
                    color: selectedTheme.text,
                    fontFamily: bodyFont,
                  }}
                >
                  {toArray(skillGroup.items).join(", ") || "-"}
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (sectionId === "education" && data.education?.length) {
        return data.education.map((edu, index) => (
          <div key={index} style={{marginBottom: index === data.education.length - 1 ? 0 : "5px"}}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "10px",
              }}
            >
              <span
                style={{
                  color: selectedTheme.primary,
                  fontSize: compact.bodySize,
                  fontWeight: "700",
                  fontFamily: headingFont,
                }}
              >
                {edu.degree || "Degree"}
                {edu.field ? ` (${edu.field})` : ""}
              </span>
              <span style={{fontSize: compact.smallText, color: selectedTheme.textMuted}}>
                {edu.startDate || ""} - {edu.endDate || "Present"}
              </span>
            </div>
            {edu.institution && (
              <div style={{fontSize: compact.smallText, color: selectedTheme.textLight}}>
                {edu.institution}
              </div>
            )}
            {(edu.gpa || edu.grades) && (
              <div style={{fontSize: compact.smallText, color: selectedTheme.textMuted}}>
                {edu.gpa ? `GPA: ${edu.gpa}` : ""}
                {edu.grades ? ` ${edu.grades}` : ""}
              </div>
            )}
          </div>
        ));
      }

      if (sectionId === "certifications" && data.certifications?.length) {
        return (
          <ul style={{margin: 0, paddingLeft: "18px"}}>
            {data.certifications.map((cert, index) => (
              <li key={index} style={{marginBottom: "1px", fontSize: compact.bodySize, color: selectedTheme.text}}>
                <span style={{fontWeight: "700", color: selectedTheme.primary}}>
                  {cert.name || cert.title || cert}
                </span>
                {(cert.issuer || cert.date) && (
                  <span style={{color: selectedTheme.textLight}}>
                    {cert.issuer ? ` - ${cert.issuer}` : ""}
                    {cert.date ? ` (${cert.date})` : ""}
                  </span>
                )}
              </li>
            ))}
          </ul>
        );
      }

      if (sectionId === "achievements" && data.achievements?.length) {
        return (
          <ul style={{margin: 0, paddingLeft: "18px"}}>
            {data.achievements.map((achievement, index) => (
              <li key={index} style={{marginBottom: "1px", fontSize: compact.bodySize, color: selectedTheme.text}}>
                {typeof achievement === "string"
                  ? achievement
                  : achievement.title || achievement.description || "Achievement"}
              </li>
            ))}
          </ul>
        );
      }

      if (sectionId === "publications" && data.publications?.length) {
        return data.publications.map((pub, index) => (
          <div key={index} style={{marginBottom: index === data.publications.length - 1 ? 0 : "4px"}}>
            <span style={{fontSize: compact.bodySize, color: selectedTheme.text}}>
              {pub.authors ? `${pub.authors}. ` : ""}
              {pub.date ? `(${pub.date}). ` : ""}
              {pub.title ? `\"${pub.title}.\" ` : ""}
              {pub.journal ? `${pub.journal}. ` : ""}
              {pub.pages ? `pp. ${pub.pages}. ` : ""}
            </span>
            {pub.url && (
              <a
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{fontSize: compact.smallText, color: selectedTheme.accent, textDecoration: "none"}}
              >
                {pub.url}
              </a>
            )}
          </div>
        ));
      }

      if (sectionId === "customSections" && data.customSections?.length) {
        return data.customSections.map((section, index) => (
          <div key={index} style={{marginBottom: index === data.customSections.length - 1 ? 0 : "4px"}}>
            <div style={{fontSize: compact.bodySize, fontWeight: "700", color: selectedTheme.primary}}>
              {section.title || "Additional"}
            </div>
            {section.content && (
              <p style={{margin: "1px 0 0", fontSize: compact.bodySize, color: selectedTheme.text}}>
                {section.content}
              </p>
            )}
            {section.items?.length > 0 && (
              <ul style={{margin: "3px 0 0", paddingLeft: "18px"}}>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{fontSize: compact.bodySize, color: selectedTheme.text}}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ));
      }

      return null;
    };

    const contacts = [
      ["Email", resumeData?.contact?.email],
      ["Phone", resumeData?.contact?.phone],
      ["Location", resumeData?.contact?.location],
      ["LinkedIn", resumeData?.contact?.linkedin],
      ["GitHub", resumeData?.contact?.github],
      ["Website", resumeData?.contact?.website],
    ]
      .map(([label, value]) => {
        const item = formatContactItem(label, value);
        if (!item) return null;
        return <span key={`${label}-${value}`}>{item}</span>;
      })
      .filter(Boolean);

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
        className="resume-preview"
        style={{
          minHeight: "11in",
          padding: compact.pagePadding,
          color: selectedTheme.text,
          backgroundColor: selectedTheme.bg,
          fontFamily: bodyFont,
        }}
      >
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "10px",
            marginBottom: "8px",
            borderBottom: `1px solid ${selectedTheme.border}`,
            paddingBottom: "5px",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 2px 0",
                color: selectedTheme.primary,
                fontSize: isDenseContent ? "18pt" : "20pt",
                lineHeight: "1.1",
                fontWeight: "800",
                letterSpacing: "0.4px",
                fontFamily: headingFont,
              }}
            >
              {resumeData?.name || "Your Name"}
            </h1>
            <div
              style={{
                fontSize: compact.smallText,
                color: selectedTheme.textLight,
                fontFamily: headingFont,
                fontWeight: "600",
                letterSpacing: "0.3px",
              }}
            >
              METRO GRID NARRATIVE PROFILE
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "2px",
              border: `1px solid ${selectedTheme.border}`,
              borderRadius: "6px",
              padding: "5px 7px",
              backgroundColor: selectedTheme.panelBg,
              minHeight: "fit-content",
            }}
          >
            <div
              style={{
                color: selectedTheme.primary,
                fontWeight: "700",
                fontSize: compact.smallText,
                fontFamily: headingFont,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "1px",
              }}
            >
              Contact
            </div>
            {contacts.length > 0 ? (
              contacts
            ) : (
              <span style={{fontSize: compact.smallText, color: selectedTheme.textMuted}}>
                Add contact details in the editor.
              </span>
            )}
          </div>
        </header>

        {sectionOrder.map((sectionId, index) =>
          renderBand(sectionId, index, renderSectionContent(sectionId))
        )}
      </div>
    );
  }
);

GitHubStyleTemplate.displayName = "GitHubStyleTemplate";

export default GitHubStyleTemplate;
