import {forwardRef, useEffect, useMemo, useRef} from "react";

/**
 * Strategic Leadership Template
 * Leadership-focused two-column layout with adaptive density controls.
 */
const StrategicLeadershipTemplate = forwardRef(
  ({resumeData, onPageUsageChange}, ref) => {
    const containerRef = useRef(null);

    const colorThemes = {
      teal: {
        primary: "#0d7377",
        secondary: "#14919b",
        accent: "#2c3e50",
        sidebar: "#f7fafc",
        text: "#1f2937",
        textLight: "#4b5563",
        textMuted: "#6b7280",
        border: "#dbe4ea",
      },
      purple: {
        primary: "#6b46c1",
        secondary: "#805ad5",
        accent: "#44337a",
        sidebar: "#faf5ff",
        text: "#1f2937",
        textLight: "#4b5563",
        textMuted: "#6b7280",
        border: "#e9d8fd",
      },
      burgundy: {
        primary: "#9b2c2c",
        secondary: "#c53030",
        accent: "#742a2a",
        sidebar: "#fff5f5",
        text: "#1f2937",
        textLight: "#4b5563",
        textMuted: "#6b7280",
        border: "#fed7d7",
      },
      navy: {
        primary: "#2c5282",
        secondary: "#2b6cb0",
        accent: "#1a365d",
        sidebar: "#eff6ff",
        text: "#1f2937",
        textLight: "#4b5563",
        textMuted: "#6b7280",
        border: "#cfe0f7",
      },
    };

    const selectedTheme =
      colorThemes[resumeData?.colorTheme] || colorThemes.teal;

    const sectionVolume = useMemo(() => {
      const experienceItems = resumeData?.experience || [];
      const projectItems = resumeData?.projects || [];
      const skillsGroups = resumeData?.skills || [];
      const achievements = resumeData?.achievements || [];
      const certifications = resumeData?.certifications || [];
      const customSections = resumeData?.customSections || [];

      const expBullets = experienceItems.reduce(
        (sum, item) => sum + (item?.bullets?.length || 0),
        0
      );
      const projectBullets = projectItems.reduce(
        (sum, item) => sum + (item?.bullets?.length || 0),
        0
      );
      const skillItems = skillsGroups.reduce((sum, group) => {
        if (Array.isArray(group?.items)) return sum + group.items.length;
        if (typeof group?.items === "string") {
          return sum + group.items.split(",").filter(Boolean).length;
        }
        return sum;
      }, 0);

      const summaryLength = (resumeData?.summary || "").length;

      return (
        experienceItems.length * 5 +
        expBullets * 3 +
        projectItems.length * 4 +
        projectBullets * 2 +
        achievements.length * 2 +
        skillItems +
        certifications.length * 2 +
        customSections.length * 4 +
        Math.ceil(summaryLength / 200)
      );
    }, [resumeData]);

    const density = useMemo(() => {
      if (sectionVolume >= 90) return "compact";
      if (sectionVolume >= 55) return "balanced";
      return "comfortable";
    }, [sectionVolume]);

    const stylePack = useMemo(() => {
      if (density === "compact") {
        return {
          containerPadding: "6.5mm 8mm",
          sectionGap: "8px",
          itemGap: "6px",
          headingFont: "11pt",
          bodyFont: "9pt",
          tinyFont: "8.2pt",
          lineHeight: 1.32,
          bulletLineHeight: 1.3,
          chipFont: "8.2pt",
        };
      }

      if (density === "balanced") {
        return {
          containerPadding: "7.5mm 9mm",
          sectionGap: "10px",
          itemGap: "7px",
          headingFont: "11.5pt",
          bodyFont: "9.2pt",
          tinyFont: "8.4pt",
          lineHeight: 1.38,
          bulletLineHeight: 1.35,
          chipFont: "8.4pt",
        };
      }

      return {
        containerPadding: "8mm 10mm",
        sectionGap: "12px",
        itemGap: "8px",
        headingFont: "12pt",
        bodyFont: "9.5pt",
        tinyFont: "8.6pt",
        lineHeight: 1.42,
        bulletLineHeight: 1.38,
        chipFont: "8.5pt",
      };
    }, [density]);

    const formatSkills = (items) => {
      if (Array.isArray(items)) return items;
      if (typeof items === "string") {
        return items
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    };

    useEffect(() => {
      if (!containerRef.current || !onPageUsageChange) return undefined;

      const maxHeight = 1056;
      let rafId;

      const measure = () => {
        if (!containerRef.current) return;

        const currentHeight = containerRef.current.scrollHeight;
        const isOverflowing = currentHeight > maxHeight;
        const overflowPercentage = isOverflowing
          ? Math.round(((currentHeight - maxHeight) / maxHeight) * 100)
          : 0;

        onPageUsageChange({
          isOverflowing,
          currentHeight,
          maxHeight,
          overflowPercentage,
          percentage: Math.round((currentHeight / maxHeight) * 100),
          templateName: "StrategicLeadershipTemplate",
        });
      };

      const queueMeasure = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(measure);
      };

      queueMeasure();

      let observer;
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(queueMeasure);
        observer.observe(containerRef.current);
      }

      return () => {
        cancelAnimationFrame(rafId);
        if (observer) observer.disconnect();
      };
    }, [resumeData, onPageUsageChange, density]);

    const mainSections = [];

    if (resumeData?.summary) {
      mainSections.push(
        <section key="summary" style={{marginBottom: stylePack.sectionGap}}>
          <h2
            style={{
              fontSize: stylePack.headingFont,
              fontWeight: "700",
              color: "white",
              backgroundColor: selectedTheme.primary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              padding: "2px 8px",
              display: "inline-block",
            }}
          >
            Strategic Profile
          </h2>
          <p
            style={{
              fontSize: stylePack.bodyFont,
              lineHeight: stylePack.lineHeight,
              color: selectedTheme.text,
              textAlign: "justify",
              margin: 0,
            }}
          >
            {resumeData.summary}
          </p>
        </section>
      );
    }

    if (resumeData?.experience?.length) {
      mainSections.push(
        <section key="experience" style={{marginBottom: stylePack.sectionGap}}>
          <h2
            style={{
              fontSize: stylePack.headingFont,
              fontWeight: "700",
              color: "white",
              backgroundColor: selectedTheme.primary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              padding: "2px 8px",
              display: "inline-block",
            }}
          >
            Leadership Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div
              key={index}
              style={{
                marginBottom: stylePack.itemGap,
                paddingBottom: "6px",
                borderBottom:
                  index < resumeData.experience.length - 1
                    ? `1px solid ${selectedTheme.border}`
                    : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "8px",
                  marginBottom: "2px",
                }}
              >
                <div
                  style={{
                    fontSize: "10.3pt",
                    fontWeight: "700",
                    color: "#111827",
                    lineHeight: 1.2,
                  }}
                >
                  {exp.title}
                </div>
                <div
                  style={{
                    fontSize: stylePack.tinyFont,
                    color: selectedTheme.textMuted,
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                  }}
                >
                  {exp.startDate} - {exp.endDate || "Present"}
                </div>
              </div>

              <div
                style={{
                  fontSize: stylePack.bodyFont,
                  fontWeight: "600",
                  color: selectedTheme.primary,
                  marginBottom: "4px",
                  lineHeight: 1.2,
                }}
              >
                {exp.company}
                {exp.location && (
                  <span
                    style={{
                      fontWeight: "500",
                      color: selectedTheme.textMuted,
                      fontSize: stylePack.tinyFont,
                    }}
                  >
                    {" "}• {exp.location}
                  </span>
                )}
              </div>

              {exp?.bullets?.length > 0 && (
                <ul
                  style={{
                    margin: "2px 0 0 16px",
                    padding: 0,
                    fontSize: stylePack.bodyFont,
                    lineHeight: stylePack.bulletLineHeight,
                  }}
                >
                  {exp.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      style={{marginBottom: "1px", color: selectedTheme.text}}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      );
    }

    if (resumeData?.projects?.length) {
      mainSections.push(
        <section key="projects" style={{marginBottom: stylePack.sectionGap}}>
          <h2
            style={{
              fontSize: stylePack.headingFont,
              fontWeight: "700",
              color: "white",
              backgroundColor: selectedTheme.primary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              padding: "2px 8px",
              display: "inline-block",
            }}
          >
            Strategic Initiatives
          </h2>
          {resumeData.projects.map((project, index) => (
            <div
              key={index}
              style={{marginBottom: stylePack.itemGap, breakInside: "avoid"}}
            >
              <div
                style={{
                  fontSize: "10pt",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "2px",
                }}
              >
                {project.name}
              </div>

              {project?.bullets?.length > 0 && (
                <ul
                  style={{
                    margin: "0 0 0 16px",
                    padding: 0,
                    fontSize: stylePack.bodyFont,
                    lineHeight: stylePack.bulletLineHeight,
                  }}
                >
                  {project.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      style={{marginBottom: "1px", color: selectedTheme.text}}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {project.technologies && (
                <div
                  style={{
                    fontSize: stylePack.tinyFont,
                    color: selectedTheme.textMuted,
                    marginTop: "2px",
                    lineHeight: 1.25,
                  }}
                >
                  <span style={{fontWeight: "600"}}>Technologies:</span>{" "}
                  {project.technologies}
                </div>
              )}
            </div>
          ))}
        </section>
      );
    }

    if (resumeData?.achievements?.length) {
      mainSections.push(
        <section key="achievements" style={{marginBottom: stylePack.sectionGap}}>
          <h2
            style={{
              fontSize: stylePack.headingFont,
              fontWeight: "700",
              color: "white",
              backgroundColor: selectedTheme.primary,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              padding: "2px 8px",
              display: "inline-block",
            }}
          >
            Key Achievements
          </h2>
          <ul
            style={{
              margin: "0 0 0 16px",
              padding: 0,
              fontSize: stylePack.bodyFont,
              lineHeight: stylePack.bulletLineHeight,
            }}
          >
            {resumeData.achievements.map((achievement, index) => (
              <li
                key={index}
                style={{marginBottom: "1px", color: selectedTheme.text}}
              >
                {achievement}
              </li>
            ))}
          </ul>
        </section>
      );
    }

    if (resumeData?.customSections?.length) {
      mainSections.push(
        ...resumeData.customSections.map((section, index) => (
          <section
            key={`custom-${index}`}
            style={{marginBottom: stylePack.sectionGap, breakInside: "avoid"}}
          >
            <h2
              style={{
                fontSize: stylePack.headingFont,
                fontWeight: "700",
                color: selectedTheme.primary,
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                borderLeft: `3px solid ${selectedTheme.primary}`,
                paddingLeft: "7px",
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                fontSize: stylePack.bodyFont,
                color: selectedTheme.text,
                lineHeight: stylePack.lineHeight,
                whiteSpace: "pre-wrap",
              }}
            >
              {section.content}
            </div>
          </section>
        ))
      );
    }

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
        style={{
          width: "210mm",
          minHeight: "11in",
          backgroundColor: "white",
          fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#000000",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <aside
          style={{
            width: "31%",
            backgroundColor: selectedTheme.sidebar,
            padding: stylePack.containerPadding,
            borderRight: `2px solid ${selectedTheme.primary}`,
          }}
        >
          <div style={{marginBottom: stylePack.sectionGap}}>
            <h1
              style={{
                fontSize: density === "compact" ? "17pt" : "19pt",
                fontWeight: "700",
                margin: "0 0 4px 0",
                color: "#111827",
                lineHeight: 1.1,
                wordBreak: "break-word",
              }}
            >
              {resumeData?.name || "Your Name"}
            </h1>
          </div>

          <div style={{marginBottom: stylePack.sectionGap}}>
            <h3
              style={{
                fontSize: "9.6pt",
                fontWeight: "700",
                color: "white",
                backgroundColor: selectedTheme.primary,
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "5px",
                padding: "2px 7px",
                display: "inline-block",
              }}
            >
              Contact
            </h3>
            <div
              style={{
                fontSize: stylePack.bodyFont,
                color: selectedTheme.text,
                lineHeight: stylePack.lineHeight,
              }}
            >
              {resumeData?.contact?.email && (
                <div style={{marginBottom: "2px", wordBreak: "break-word"}}>
                  {resumeData.contact.email}
                </div>
              )}
              {resumeData?.contact?.phone && (
                <div style={{marginBottom: "2px"}}>{resumeData.contact.phone}</div>
              )}
              {resumeData?.contact?.location && (
                <div style={{marginBottom: "2px"}}>
                  {resumeData.contact.location}
                </div>
              )}
              {resumeData?.contact?.linkedin && (
                <div style={{marginBottom: "2px", wordBreak: "break-word"}}>
                  {resumeData.contact.linkedin}
                </div>
              )}
              {resumeData?.contact?.github && (
                <div style={{wordBreak: "break-word"}}>{resumeData.contact.github}</div>
              )}
            </div>
          </div>

          {resumeData?.skills?.length > 0 && (
            <div style={{marginBottom: stylePack.sectionGap}}>
              <h3
                style={{
                  fontSize: "9.6pt",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: selectedTheme.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  marginBottom: "5px",
                  padding: "2px 7px",
                  display: "inline-block",
                }}
              >
                Core Skills
              </h3>
              {resumeData.skills.map((skillGroup, index) => {
                const items = formatSkills(skillGroup.items);
                if (!items.length) return null;

                return (
                  <div key={index} style={{marginBottom: "6px"}}>
                    <div
                      style={{
                        fontSize: stylePack.bodyFont,
                        fontWeight: "600",
                        color: selectedTheme.text,
                        marginBottom: "3px",
                      }}
                    >
                      {skillGroup.category}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "3px",
                      }}
                    >
                      {items.map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: stylePack.chipFont,
                            lineHeight: 1.2,
                            color: selectedTheme.textLight,
                            border: `1px solid ${selectedTheme.border}`,
                            padding: "1px 5px",
                            borderRadius: "9px",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {resumeData?.education?.length > 0 && (
            <div style={{marginBottom: stylePack.sectionGap}}>
              <h3
                style={{
                  fontSize: "9.6pt",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: selectedTheme.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  marginBottom: "5px",
                  padding: "2px 7px",
                  display: "inline-block",
                }}
              >
                Education
              </h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} style={{marginBottom: "6px"}}>
                  <div
                    style={{
                      fontSize: stylePack.bodyFont,
                      fontWeight: "600",
                      color: selectedTheme.text,
                      lineHeight: 1.2,
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      fontSize: stylePack.tinyFont,
                      color: selectedTheme.textLight,
                      marginTop: "1px",
                    }}
                  >
                    {edu.institution}
                  </div>
                  <div
                    style={{
                      fontSize: stylePack.tinyFont,
                      color: selectedTheme.textMuted,
                      marginTop: "1px",
                    }}
                  >
                    {edu.graduationDate}
                    {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}

          {resumeData?.certifications?.length > 0 && (
            <div style={{marginBottom: stylePack.sectionGap}}>
              <h3
                style={{
                  fontSize: "9.6pt",
                  fontWeight: "700",
                  color: "white",
                  backgroundColor: selectedTheme.primary,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  marginBottom: "5px",
                  padding: "2px 7px",
                  display: "inline-block",
                }}
              >
                Certifications
              </h3>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} style={{marginBottom: "6px"}}>
                  <div
                    style={{
                      fontSize: stylePack.bodyFont,
                      fontWeight: "600",
                      color: selectedTheme.text,
                      lineHeight: 1.2,
                    }}
                  >
                    {cert.name}
                  </div>
                  {cert.issuer && (
                    <div
                      style={{
                        fontSize: stylePack.tinyFont,
                        color: selectedTheme.textLight,
                        marginTop: "1px",
                      }}
                    >
                      {cert.issuer}
                    </div>
                  )}
                  {cert.date && (
                    <div
                      style={{
                        fontSize: stylePack.tinyFont,
                        color: selectedTheme.textMuted,
                        marginTop: "1px",
                      }}
                    >
                      {cert.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>

        <main
          style={{
            width: "69%",
            padding: stylePack.containerPadding,
          }}
        >
          {mainSections}
        </main>
      </div>
    );
  }
);

StrategicLeadershipTemplate.displayName = "StrategicLeadershipTemplate";

export default StrategicLeadershipTemplate;
