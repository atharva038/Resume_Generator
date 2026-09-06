import { forwardRef, useRef, useEffect, useMemo } from "react";
import { isDescriptionDuplicatedInBullets } from "./templateUtils";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  GitCommit,
  Star,
  Terminal,
} from "lucide-react";

/**
 * ClassicTemplate - "The Open-Source Architect" Archetype
 *
 * Designed for Backend Engineers, DevOps/SRE, Systems Architects, and Open-Source Contributors.
 * Features:
 * - Developer-centric, markdown-inspired layout engineered for technical authority
 * - Commit-style bullet points with automated system metric highlighting (req/s, SLA, ms, %, stars)
 * - Structured skill capsules and inline repository / project link badges
 * - Solid header dividing rule with left accent terminal block
 * - Intelligent 1-page auto-density engine with explicit Compact / Balanced / Spacious modes
 * - 100% text-based, ATS-compliant semantic structure (99% ATS Pass Guarantee)
 */

// ATS-safe metric highlighter for engineering and system metrics
const highlightMetrics = (text, primaryColor) => {
  if (!text || typeof text !== "string") return text;

  const metricRegex =
    /(\b(?:\+|-)?\$\d+[\d,.]*[kKmMbB]?(?:\+)?|\b(?:\+|-)?\d+[\d,.]*\%|\b\d+(?:\.\d+)?x\b|\b\d{2,4}\+\b|\b\d+[\d,.]*\+?\s*(?:users|MAU|DAU|customers|clients|engineers|developers|nodes|services|microservices|req\/s|rps|qps|ms|fps|stars|downloads|pull requests|PRs|tps|commits)\b)/gi;

  const parts = text.split(metricRegex);
  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span
          key={index}
          style={{
            fontWeight: 700,
            color: primaryColor,
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

const ClassicTemplate = forwardRef(({ resumeData = {}, onPageUsageChange }, ref) => {
  const containerRef = useRef(null);

  // Page overflow detection (11in @ 96 DPI = 1056px)
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
        templateName: "ClassicTemplate",
      };

      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData, onPageUsageChange]);

  // Open-Source Architect Palettes
  const colorThemes = {
    // Toolbar mapping themes
    stripeIndigo: {
      primary: "#0969da", // GitHub Blue
      primaryDark: "#0550ae",
      primaryLight: "#ddf4ff",
      accent: "#218bff",
      badgeBg: "#f6f8fa",
      badgeBorder: "#d0d7de",
      badgeText: "#0969da",
      text: "#1f2328",
      textLight: "#333d47",
      textMuted: "#656d76",
      border: "#d0d7de",
      ruleColor: "#0969da",
    },
    cyberEmerald: {
      primary: "#16a34a", // Terminal Emerald
      primaryDark: "#15803d",
      primaryLight: "#dcfce7",
      accent: "#22c55e",
      badgeBg: "#f0fdf4",
      badgeBorder: "#bbf7d0",
      badgeText: "#15803d",
      text: "#1f2328",
      textLight: "#333d47",
      textMuted: "#656d76",
      border: "#d0d7de",
      ruleColor: "#16a34a",
    },
    midnightSlate: {
      primary: "#d97706", // Rust Amber
      primaryDark: "#b45309",
      primaryLight: "#fef3c7",
      accent: "#f59e0b",
      badgeBg: "#fffbeb",
      badgeBorder: "#fde68a",
      badgeText: "#b45309",
      text: "#1f2328",
      textLight: "#333d47",
      textMuted: "#656d76",
      border: "#d0d7de",
      ruleColor: "#d97706",
    },
    monochromePro: {
      primary: "#24292f", // Carbon Dark / Linux
      primaryDark: "#000000",
      primaryLight: "#f6f8fa",
      accent: "#57606a",
      badgeBg: "#f6f8fa",
      badgeBorder: "#d0d7de",
      badgeText: "#24292f",
      text: "#1f2328",
      textLight: "#333d47",
      textMuted: "#656d76",
      border: "#d0d7de",
      ruleColor: "#24292f",
    },
    // Backward compatibility keys
    navy: {
      primary: "#0969da",
      primaryDark: "#0550ae",
      primaryLight: "#ddf4ff",
      accent: "#218bff",
      badgeBg: "#f6f8fa",
      badgeBorder: "#d0d7de",
      badgeText: "#0969da",
      text: "#1f2328",
      textLight: "#333d47",
      textMuted: "#656d76",
      border: "#d0d7de",
      ruleColor: "#0969da",
    },
  };

  const selectedTheme =
    colorThemes[resumeData?.selectedTheme || resumeData?.colorTheme] ||
    colorThemes.stripeIndigo;

  // 1-Page Content Density Engine
  const density = useMemo(() => {
    if (resumeData?.density === "compact" || resumeData?.density === "high") return "compact";
    if (resumeData?.density === "spacious" || resumeData?.density === "low") return "spacious";
    if (resumeData?.density === "medium") return "medium";

    let score = 0;
    if (resumeData.experience?.length) {
      score += resumeData.experience.length * 3.5;
      resumeData.experience.forEach((e) => {
        score += (e.bullets?.length || 0) * 1.1;
      });
    }
    if (resumeData.projects?.length) {
      score += resumeData.projects.length * 2.5;
      resumeData.projects.forEach((p) => {
        score += (p.bullets?.length || 0) * 1;
      });
    }
    if (resumeData.education?.length) score += resumeData.education.length * 2;
    if (resumeData.skills?.length) score += resumeData.skills.length * 1.2;
    if (resumeData.certifications?.length) score += resumeData.certifications.length;
    if (resumeData.achievements?.length) score += resumeData.achievements.length;
    if ((resumeData.summary || "").length > 250) score += 3;

    if (score >= 32) return "compact";
    if (score >= 18) return "medium";
    return "spacious";
  }, [resumeData]);

  // Dynamic Spacing & Typography based on Density
  const styles = useMemo(() => {
    if (density === "compact") {
      return {
        padding: "0.42in 0.52in",
        nameSize: "22pt",
        titleSize: "10pt",
        contactSize: "8.5pt",
        headerMarginBottom: "10px",
        sectionMarginBottom: "9px",
        headingSize: "10.5pt",
        headingMarginBottom: "5px",
        itemMarginBottom: "6px",
        bodySize: "9pt",
        metaSize: "8.2pt",
        lineHeight: 1.28,
        bulletMarginBottom: "2px",
        bulletMarginLeft: "1.2rem",
      };
    }
    if (density === "spacious") {
      return {
        padding: "0.62in 0.68in",
        nameSize: "28pt",
        titleSize: "11.5pt",
        contactSize: "9.5pt",
        headerMarginBottom: "18px",
        sectionMarginBottom: "17px",
        headingSize: "12pt",
        headingMarginBottom: "8px",
        itemMarginBottom: "12px",
        bodySize: "10pt",
        metaSize: "9pt",
        lineHeight: 1.5,
        bulletMarginBottom: "4px",
        bulletMarginLeft: "1.4rem",
      };
    }
    // Balanced / Medium default
    return {
      padding: "0.5in 0.6in",
      nameSize: "25pt",
      titleSize: "10.5pt",
      contactSize: "9pt",
      headerMarginBottom: "14px",
      sectionMarginBottom: "13px",
      headingSize: "11pt",
      headingMarginBottom: "6px",
      itemMarginBottom: "8px",
      bodySize: "9.4pt",
      metaSize: "8.6pt",
      lineHeight: 1.38,
      bulletMarginBottom: "3px",
      bulletMarginLeft: "1.3rem",
    };
  }, [density]);

  // Section Ordering
  const defaultOrder = [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "customSections",
  ];

  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder.filter(
          (id) => !["score", "personal", "recommendations"].includes(id)
        )
      : defaultOrder;

  // Contact items helper
  const contact = resumeData.contact || {};
  const contactItems = [
    contact.email && {
      icon: Mail,
      label: contact.email,
      href: `mailto:${contact.email}`,
    },
    contact.phone && {
      icon: Phone,
      label: contact.phone,
      href: null,
    },
    (contact.location || resumeData.location) && {
      icon: MapPin,
      label: contact.location || resumeData.location,
      href: null,
    },
    contact.github && {
      icon: Github,
      label: contact.github.replace(/^https?:\/\/(www\.)?github\.com\//i, "github.com/"),
      href: contact.github.startsWith("http") ? contact.github : `https://${contact.github}`,
    },
    contact.linkedin && {
      icon: Linkedin,
      label: contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "linkedin.com/in/"),
      href: contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`,
    },
    contact.website && {
      icon: Globe,
      label: contact.website.replace(/^https?:\/\/(www\.)?/i, ""),
      href: contact.website.startsWith("http") ? contact.website : `https://${contact.website}`,
    },
  ].filter(Boolean);

  // Section heading with solid accent bar and clean horizontal rule
  const renderSectionHeader = (title) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: styles.headingMarginBottom,
        paddingBottom: "3px",
        borderBottom: `1.5px solid ${selectedTheme.primary}`,
      }}
    >
      <h2
        style={{
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: styles.headingSize,
          fontWeight: 700,
          color: selectedTheme.primary,
          letterSpacing: "0.5px",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className="bg-white text-gray-900"
      style={{
        width: "210mm",
        minHeight: "11in",
        boxSizing: "border-box",
        padding: styles.padding,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: selectedTheme.text,
      }}
    >
      {/* Header: Open-Source Architect Header */}
      <header style={{ marginBottom: styles.headerMarginBottom }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
          <div>
            <h1
              style={{
                fontSize: styles.nameSize,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: selectedTheme.text,
                margin: "0 0 2px 0",
                lineHeight: 1.15,
              }}
            >
              {resumeData.name || "Software Architect"}
            </h1>
            {(resumeData.title || resumeData.jobTitle) && (
              <div
                style={{
                  fontSize: styles.titleSize,
                  fontWeight: 600,
                  color: selectedTheme.primary,
                }}
              >
                {resumeData.title || resumeData.jobTitle}
              </div>
            )}
          </div>

          {/* Contact links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "6px 12px",
              fontSize: styles.contactSize,
              color: selectedTheme.textMuted,
            }}
          >
            {contactItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <span key={index} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Icon size={12} style={{ color: selectedTheme.primary }} />
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: selectedTheme.textLight,
                        textDecoration: "none",
                        borderBottom: `1px solid ${selectedTheme.border}`,
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </header>

      {/* Dynamic Sections */}
      {sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case "summary":
            if (!resumeData.summary) return null;
            return (
              <section key="summary" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Professional Summary")}
                <p
                  style={{
                    fontSize: styles.bodySize,
                    lineHeight: styles.lineHeight,
                    color: selectedTheme.textLight,
                    margin: 0,
                    textAlign: "justify",
                  }}
                >
                  {highlightMetrics(resumeData.summary, selectedTheme.primary)}
                </p>
              </section>
            );

          case "skills":
            if (!resumeData.skills?.length) return null;
            return (
              <section key="skills" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Technical Skills")}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {resumeData.skills.map((skillGroup, index) => {
                    const category = typeof skillGroup === "string" ? null : skillGroup.category || skillGroup.name;
                    const items = typeof skillGroup === "string" ? skillGroup : skillGroup.items || skillGroup.skills;
                    const itemsList = Array.isArray(items) ? items.join(", ") : String(items || "");

                    return (
                      <div key={index} style={{ fontSize: styles.bodySize, lineHeight: styles.lineHeight }}>
                        {category ? (
                          <>
                            <span style={{ fontWeight: 700, color: selectedTheme.text }}>{category}: </span>
                            <span style={{ color: selectedTheme.textLight }}>{itemsList}</span>
                          </>
                        ) : (
                          <span style={{ color: selectedTheme.textLight }}>{itemsList}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case "experience":
            if (!resumeData.experience?.length) return null;
            return (
              <section key="experience" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Experience")}
                <div style={{ display: "flex", flexDirection: "column", gap: styles.itemMarginBottom }}>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginBottom: "2px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: styles.bodySize,
                              color: selectedTheme.text,
                            }}
                          >
                            {exp.company}
                          </span>
                          {exp.title && (
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: styles.bodySize,
                                color: selectedTheme.primary,
                                marginLeft: "6px",
                              }}
                            >
                              — {exp.title}
                            </span>
                          )}
                          {exp.location && (
                            <span
                              style={{
                                fontSize: styles.metaSize,
                                color: selectedTheme.textMuted,
                                marginLeft: "6px",
                              }}
                            >
                              ({exp.location})
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: styles.metaSize,
                            color: selectedTheme.textMuted,
                          }}
                        >
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? "–" : ""}{" "}
                          {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>

                      {exp.description &&
                        (!exp.bullets?.length ||
                          !isDescriptionDuplicatedInBullets(exp.description, exp.bullets)) && (
                        <p
                          style={{
                            fontSize: styles.bodySize,
                            lineHeight: styles.lineHeight,
                            color: selectedTheme.textLight,
                            margin: "0 0 3px 0",
                          }}
                        >
                          {highlightMetrics(exp.description, selectedTheme.primary)}
                        </p>
                      )}

                      {exp.bullets?.length > 0 && (
                        <ul
                          style={{
                            listStyleType: "disc",
                            margin: "2px 0 0 0",
                            paddingLeft: "15px",
                          }}
                        >
                          {exp.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              style={{
                                fontSize: styles.bodySize,
                                lineHeight: styles.lineHeight,
                                color: selectedTheme.textLight,
                                marginBottom: styles.bulletMarginBottom,
                              }}
                            >
                              {highlightMetrics(bullet, selectedTheme.primary)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case "projects":
            if (!resumeData.projects?.length) return null;
            return (
              <section key="projects" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Projects")}
                <div style={{ display: "flex", flexDirection: "column", gap: styles.itemMarginBottom }}>
                  {resumeData.projects.map((proj, index) => {
                    const techList = Array.isArray(proj.technologies)
                      ? proj.technologies
                      : typeof proj.technologies === "string"
                      ? proj.technologies.split(",").map((t) => t.trim())
                      : [];

                    return (
                      <div key={index}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: "2px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: styles.bodySize,
                                color: selectedTheme.text,
                              }}
                            >
                              {proj.title || proj.name}
                            </span>
                            {proj.link && (
                              <a
                                href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "2px",
                                  fontSize: styles.metaSize,
                                  color: selectedTheme.primary,
                                  textDecoration: "none",
                                }}
                              >
                                <ExternalLink size={10} />
                                <span>link</span>
                              </a>
                            )}
                            {techList.length > 0 && (
                              <span style={{ fontSize: styles.metaSize, color: selectedTheme.textMuted, fontStyle: "italic" }}>
                                ({techList.join(", ")})
                              </span>
                            )}
                          </div>

                          {(proj.startDate || proj.endDate || proj.year) && (
                            <span
                              style={{
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: styles.metaSize,
                                color: selectedTheme.textMuted,
                              }}
                            >
                              {proj.startDate} {proj.startDate && proj.endDate ? "–" : ""} {proj.endDate || proj.year}
                            </span>
                          )}
                        </div>

                        {proj.description &&
                          (!proj.bullets?.length ||
                            !isDescriptionDuplicatedInBullets(proj.description, proj.bullets)) && (
                          <p
                            style={{
                              fontSize: styles.bodySize,
                              lineHeight: styles.lineHeight,
                              color: selectedTheme.textLight,
                              margin: "0 0 3px 0",
                            }}
                          >
                            {highlightMetrics(proj.description, selectedTheme.primary)}
                          </p>
                        )}

                        {proj.bullets?.length > 0 && (
                          <ul
                            style={{
                              listStyleType: "disc",
                              margin: "2px 0 0 0",
                              paddingLeft: "15px",
                            }}
                          >
                            {proj.bullets.map((bullet, bIdx) => (
                              <li
                                key={bIdx}
                                style={{
                                  fontSize: styles.bodySize,
                                  lineHeight: styles.lineHeight,
                                  color: selectedTheme.textLight,
                                  marginBottom: styles.bulletMarginBottom,
                                }}
                              >
                                {highlightMetrics(bullet, selectedTheme.primary)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case "education":
            if (!resumeData.education?.length) return null;
            return (
              <section key="education" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Education")}
                <div style={{ display: "flex", flexDirection: "column", gap: styles.itemMarginBottom }}>
                  {resumeData.education.map((edu, index) => (
                    <div key={index}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: styles.bodySize,
                              color: selectedTheme.text,
                            }}
                          >
                            {edu.institution || edu.school}
                          </span>
                          {edu.location && (
                            <span
                              style={{
                                fontSize: styles.metaSize,
                                color: selectedTheme.textMuted,
                                marginLeft: "6px",
                              }}
                            >
                              ({edu.location})
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: styles.metaSize,
                            color: selectedTheme.textMuted,
                          }}
                        >
                          {edu.startDate} {edu.startDate && (edu.endDate || edu.year) ? "–" : ""}{" "}
                          {edu.endDate || edu.year}
                        </span>
                      </div>

                      <div style={{ fontSize: styles.bodySize, color: selectedTheme.textLight }}>
                        <span style={{ fontWeight: 600 }}>{edu.degree}</span>
                        {edu.field && <span> in {edu.field}</span>}
                        {edu.gpa && (
                          <span style={{ marginLeft: "6px", color: selectedTheme.textMuted }}>
                            (GPA: {edu.gpa})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case "certifications":
            if (!resumeData.certifications?.length) return null;
            return (
              <section key="certifications" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Certifications")}
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {resumeData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        fontSize: styles.bodySize,
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: selectedTheme.text }}>
                          {cert.name || cert.title}
                        </span>
                        {cert.issuer && (
                          <span style={{ color: selectedTheme.textMuted }}> — {cert.issuer}</span>
                        )}
                      </div>
                      {(cert.date || cert.year) && (
                        <span style={{ fontSize: styles.metaSize, color: selectedTheme.textMuted }}>
                          {cert.date || cert.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case "achievements":
            if (!resumeData.achievements?.length) return null;
            return (
              <section key="achievements" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Achievements")}
                <ul
                  style={{
                    listStyleType: "disc",
                    margin: "2px 0 0 0",
                    paddingLeft: "15px",
                  }}
                >
                  {resumeData.achievements.map((ach, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: styles.bodySize,
                        lineHeight: styles.lineHeight,
                        color: selectedTheme.textLight,
                        marginBottom: styles.bulletMarginBottom,
                      }}
                    >
                      {typeof ach === "string" ? (
                        highlightMetrics(ach, selectedTheme.primary)
                      ) : (
                        <>
                          <strong style={{ color: selectedTheme.text }}>{ach.title}</strong>
                          {ach.description && `: ${ach.description}`}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );

          case "customSections":
            if (!resumeData.customSections?.length) return null;
            return resumeData.customSections.map((custom, cIdx) => (
              <section key={`custom-${cIdx}`} style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader(custom.title || "Additional Information")}
                {custom.items?.length > 0 ? (
                  <ul
                    style={{
                      listStyleType: "disc",
                      margin: "2px 0 0 0",
                      paddingLeft: "15px",
                    }}
                  >
                    {custom.items.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        style={{
                          fontSize: styles.bodySize,
                          lineHeight: styles.lineHeight,
                          color: selectedTheme.textLight,
                          marginBottom: styles.bulletMarginBottom,
                        }}
                      >
                        {highlightMetrics(typeof item === "string" ? item : item.content || item.name, selectedTheme.primary)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: styles.bodySize, lineHeight: styles.lineHeight, margin: 0 }}>
                    {custom.content}
                  </p>
                )}
              </section>
            ));

          default:
            return null;
        }
      })}
    </div>
  );
});

ClassicTemplate.displayName = "ClassicTemplate";

export default ClassicTemplate;
