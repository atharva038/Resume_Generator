import { forwardRef, useRef, useEffect, useMemo } from "react";
import { isDescriptionDuplicatedInBullets } from "./templateUtils";

/**
 * ExecutiveTemplate - "The Wall Street / Ivy League" Archetype
 *
 * Designed for Finance, Investment Banking, Management Consulting, Big Law, and C-Suite Leadership.
 * Features:
 * - Authoritative Ivy League typography with classic centered masthead
 * - Oxford double-rule border styling beneath small-caps section headers
 * - Deal, financial, and executive metric highlighter ($120M, +45%, 250+, 99.9%)
 * - Intelligent 1-page auto-density engine with explicit Compact / Balanced / Spacious modes
 * - 100% text-based, ATS-compliant semantic structure
 */

// ATS-safe metric highlighter for financial deals, percentages, and leadership scale
const highlightMetrics = (text, primaryColor) => {
  if (!text || typeof text !== "string") return text;

  const metricRegex =
    /(\b(?:\+|-)?\$\d+[\d,.]*[kKmMbB]?(?:\+)?|\b(?:\+|-)?\d+[\d,.]*\%|\b\d+(?:\.\d+)?x\b|\b\d{2,4}\+\b|\b\d+[\d,.]*\+?\s*(?:clients|deals|acquisitions|stakeholders|engineers|teams|direct reports|accounts|funds|AUM|revenue|EBITDA|portfolio)\b)/gi;

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

const ExecutiveTemplate = forwardRef(({ resumeData = {}, onPageUsageChange }, ref) => {
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
        templateName: "ExecutiveTemplate",
      };

      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData, onPageUsageChange]);

  // Executive Palettes (Wall Street, Oxford & Ivy League Inspired)
  const colorThemes = {
    // Toolbar mapping themes
    stripeIndigo: {
      primary: "#1e3a8a", // Bespoke Navy
      secondary: "#172554",
      accent: "#2563eb",
      text: "#0f172a",
      textLight: "#334155",
      textMuted: "#64748b",
      border: "#1e3a8a",
      ruleColor: "#93c5fd",
    },
    cyberEmerald: {
      primary: "#065f46", // Oxford Forest / Private Equity
      secondary: "#022c22",
      accent: "#059669",
      text: "#0f172a",
      textLight: "#334155",
      textMuted: "#64748b",
      border: "#065f46",
      ruleColor: "#a7f3d0",
    },
    midnightSlate: {
      primary: "#1e293b", // Wall Street Slate
      secondary: "#0f172a",
      accent: "#334155",
      text: "#09090b",
      textLight: "#27272a",
      textMuted: "#71717a",
      border: "#1e293b",
      ruleColor: "#cbd5e1",
    },
    monochromePro: {
      primary: "#111827", // Classic Onyx / Big Law
      secondary: "#030712",
      accent: "#374151",
      text: "#000000",
      textLight: "#1f2937",
      textMuted: "#4b5563",
      border: "#111827",
      ruleColor: "#d1d5db",
    },
    // Legacy theme keys
    navy: {
      primary: "#1e3a8a",
      secondary: "#172554",
      accent: "#2563eb",
      text: "#0f172a",
      textLight: "#334155",
      textMuted: "#64748b",
      border: "#1e3a8a",
      ruleColor: "#93c5fd",
    },
    burgundy: {
      primary: "#831843", // Burgundy Crimson
      secondary: "#500724",
      accent: "#9d174d",
      text: "#0f172a",
      textLight: "#334155",
      textMuted: "#64748b",
      border: "#831843",
      ruleColor: "#fbcfe8",
    },
    forest: {
      primary: "#065f46",
      secondary: "#022c22",
      accent: "#059669",
      text: "#0f172a",
      textLight: "#334155",
      textMuted: "#64748b",
      border: "#065f46",
      ruleColor: "#a7f3d0",
    },
    charcoal: {
      primary: "#1f2937",
      secondary: "#111827",
      accent: "#374151",
      text: "#000000",
      textLight: "#1f2937",
      textMuted: "#4b5563",
      border: "#1f2937",
      ruleColor: "#d1d5db",
    },
    slate: {
      primary: "#1e293b",
      secondary: "#0f172a",
      accent: "#334155",
      text: "#09090b",
      textLight: "#27272a",
      textMuted: "#71717a",
      border: "#1e293b",
      ruleColor: "#cbd5e1",
    },
    teal: {
      primary: "#115e59",
      secondary: "#042f2e",
      accent: "#0f766e",
      text: "#0f172a",
      textLight: "#334155",
      textMuted: "#64748b",
      border: "#115e59",
      ruleColor: "#99f6e4",
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

    // Auto-calculate content score if not specified
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
        nameTracking: "0.5px",
        titleSize: "10pt",
        contactSize: "8.5pt",
        headerMarginBottom: "10px",
        sectionMarginBottom: "9px",
        headingSize: "11pt",
        headingPaddingBottom: "2px",
        headingMarginBottom: "5px",
        itemMarginBottom: "5px",
        bodySize: "9pt",
        dateSize: "8.5pt",
        lineHeight: 1.28,
        bulletMarginBottom: "2px",
        bulletMarginLeft: "1.15rem",
      };
    }
    if (density === "spacious") {
      return {
        padding: "0.62in 0.68in",
        nameSize: "28pt",
        nameTracking: "1.2px",
        titleSize: "11.5pt",
        contactSize: "9.5pt",
        headerMarginBottom: "18px",
        sectionMarginBottom: "17px",
        headingSize: "13pt",
        headingPaddingBottom: "4px",
        headingMarginBottom: "8px",
        itemMarginBottom: "11px",
        bodySize: "10.2pt",
        dateSize: "9.5pt",
        lineHeight: 1.5,
        bulletMarginBottom: "4px",
        bulletMarginLeft: "1.35rem",
      };
    }
    // Balanced / Medium default
    return {
      padding: "0.5in 0.6in",
      nameSize: "25pt",
      nameTracking: "0.8px",
      titleSize: "10.8pt",
      contactSize: "9pt",
      headerMarginBottom: "14px",
      sectionMarginBottom: "13px",
      headingSize: "12pt",
      headingPaddingBottom: "3px",
      headingMarginBottom: "6px",
      itemMarginBottom: "8px",
      bodySize: "9.6pt",
      dateSize: "9pt",
      lineHeight: 1.38,
      bulletMarginBottom: "3px",
      bulletMarginLeft: "1.25rem",
    };
  }, [density]);

  // Section Ordering
  const defaultOrder = [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
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
      : defaultOrder;

  // Contact items helper
  const contact = resumeData.contact || {};
  const contactParts = [
    contact.phone,
    contact.email && { label: contact.email, href: `mailto:${contact.email}` },
    contact.location || resumeData.location,
    contact.linkedin && {
      label: contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "linkedin.com/in/"),
      href: contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`,
    },
    contact.website && {
      label: contact.website.replace(/^https?:\/\/(www\.)?/i, ""),
      href: contact.website.startsWith("http") ? contact.website : `https://${contact.website}`,
    },
    contact.github && {
      label: contact.github.replace(/^https?:\/\/(www\.)?github\.com\//i, "github.com/"),
      href: contact.github.startsWith("http") ? contact.github : `https://${contact.github}`,
    },
  ].filter(Boolean);

  // Section heading Oxford Double-Rule
  const renderSectionHeader = (title) => (
    <div style={{ marginBottom: styles.headingMarginBottom }}>
      <h2
        style={{
          fontFamily: '"Newsreader", "Playfair Display", Georgia, serif',
          fontSize: styles.headingSize,
          fontWeight: 700,
          fontVariant: "small-caps",
          letterSpacing: "1.2px",
          color: selectedTheme.primary,
          margin: 0,
          paddingBottom: styles.headingPaddingBottom,
          textTransform: "uppercase",
        }}
      >
        {title}
      </h2>
      {/* Oxford Rule: primary bar followed by subtle secondary hairline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5px", marginTop: "2px" }}>
        <div style={{ height: "1.5px", backgroundColor: selectedTheme.primary, width: "100%" }} />
        <div style={{ height: "0.5px", backgroundColor: selectedTheme.ruleColor, width: "100%" }} />
      </div>
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
        fontFamily: '"Newsreader", "Playfair Display", Georgia, Cambria, serif',
        color: selectedTheme.text,
      }}
    >
      {/* Header: Centered Classic Ivy League Masthead */}
      <header
        style={{
          textAlign: "center",
          marginBottom: styles.headerMarginBottom,
        }}
      >
        <h1
          style={{
            fontFamily: '"Newsreader", "Playfair Display", Georgia, serif',
            fontSize: styles.nameSize,
            fontWeight: 700,
            letterSpacing: styles.nameTracking,
            color: selectedTheme.primary,
            margin: "0 0 2px 0",
            lineHeight: 1.15,
            textTransform: "uppercase",
          }}
        >
          {resumeData.name || "Executive Candidate"}
        </h1>

        {(resumeData.title || resumeData.jobTitle) && (
          <div
            style={{
              fontSize: styles.titleSize,
              fontStyle: "italic",
              fontWeight: 500,
              color: selectedTheme.textLight,
              marginBottom: "6px",
              letterSpacing: "0.4px",
            }}
          >
            {resumeData.title || resumeData.jobTitle}
          </div>
        )}

        {/* Centered Diamond-Divided Contact Row */}
        {contactParts.length > 0 && (
          <div
            className="flex flex-wrap items-center justify-center"
            style={{
              fontSize: styles.contactSize,
              color: selectedTheme.textMuted,
              gap: "6px 8px",
              lineHeight: 1.4,
            }}
          >
            {contactParts.map((item, index) => (
              <span key={index} className="inline-flex items-center">
                {typeof item === "object" ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: selectedTheme.textLight,
                      textDecoration: "none",
                      borderBottom: `1px dotted ${selectedTheme.ruleColor}`,
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span>{item}</span>
                )}
                {index < contactParts.length - 1 && (
                  <span
                    style={{
                      marginLeft: "8px",
                      color: selectedTheme.ruleColor,
                      fontSize: "7.5pt",
                    }}
                  >
                    ◆
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Dynamic Sections */}
      {sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case "summary":
            if (!resumeData.summary) return null;
            return (
              <section key="summary" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Executive Summary")}
                <p
                  style={{
                    fontSize: styles.bodySize,
                    lineHeight: styles.lineHeight,
                    color: selectedTheme.text,
                    margin: 0,
                    textAlign: "justify",
                  }}
                >
                  {highlightMetrics(resumeData.summary, selectedTheme.primary)}
                </p>
              </section>
            );

          case "experience":
            if (!resumeData.experience?.length) return null;
            return (
              <section key="experience" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Professional Leadership")}
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
                          {exp.location && (
                            <span
                              style={{
                                fontStyle: "italic",
                                fontSize: styles.dateSize,
                                color: selectedTheme.textMuted,
                                marginLeft: "6px",
                              }}
                            >
                              — {exp.location}
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: styles.dateSize,
                            fontVariant: "tabular-nums",
                            color: selectedTheme.textMuted,
                            fontStyle: "italic",
                          }}
                        >
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.current) ? "–" : ""}{" "}
                          {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>

                      {exp.title && (
                        <div
                          style={{
                            fontStyle: "italic",
                            fontSize: styles.bodySize,
                            color: selectedTheme.textLight,
                            marginBottom: "3px",
                            fontWeight: 600,
                          }}
                        >
                          {exp.title}
                        </div>
                      )}

                      {exp.description &&
                        (!exp.bullets?.length ||
                          !isDescriptionDuplicatedInBullets(exp.description, exp.bullets)) && (
                        <p
                          style={{
                            fontSize: styles.bodySize,
                            lineHeight: styles.lineHeight,
                            color: selectedTheme.text,
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
                                color: selectedTheme.text,
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

          case "education":
            if (!resumeData.education?.length) return null;
            return (
              <section key="education" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Education & Credentials")}
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
                                fontStyle: "italic",
                                fontSize: styles.dateSize,
                                color: selectedTheme.textMuted,
                                marginLeft: "6px",
                              }}
                            >
                              — {edu.location}
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: styles.dateSize,
                            fontVariant: "tabular-nums",
                            color: selectedTheme.textMuted,
                            fontStyle: "italic",
                          }}
                        >
                          {edu.startDate} {edu.startDate && (edu.endDate || edu.year) ? "–" : ""}{" "}
                          {edu.endDate || edu.year}
                        </span>
                      </div>

                      <div
                        style={{
                          fontStyle: "italic",
                          fontSize: styles.bodySize,
                          color: selectedTheme.textLight,
                        }}
                      >
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                        {edu.gpa && (
                          <span style={{ fontStyle: "normal", marginLeft: "8px", color: selectedTheme.textMuted }}>
                            (GPA: {edu.gpa})
                          </span>
                        )}
                      </div>

                      {edu.honors && (
                        <div style={{ fontSize: styles.dateSize, color: selectedTheme.textMuted, fontStyle: "italic" }}>
                          Honors: {edu.honors}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case "skills":
            if (!resumeData.skills?.length) return null;
            return (
              <section key="skills" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Core Competencies & Expertise")}
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

          case "projects":
            if (!resumeData.projects?.length) return null;
            return (
              <section key="projects" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Strategic Initiatives & Projects")}
                <div style={{ display: "flex", flexDirection: "column", gap: styles.itemMarginBottom }}>
                  {resumeData.projects.map((proj, index) => (
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
                            {proj.title || proj.name}
                          </span>
                          {proj.link && (
                            <a
                              href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                marginLeft: "8px",
                                fontSize: styles.dateSize,
                                color: selectedTheme.primary,
                                textDecoration: "none",
                              }}
                            >
                              ↗ View
                            </a>
                          )}
                        </div>
                        {(proj.startDate || proj.endDate || proj.year) && (
                          <span
                            style={{
                              fontSize: styles.dateSize,
                              color: selectedTheme.textMuted,
                              fontStyle: "italic",
                            }}
                          >
                            {proj.startDate} {proj.startDate && proj.endDate ? "–" : ""} {proj.endDate || proj.year}
                          </span>
                        )}
                      </div>

                      {proj.technologies && (
                        <div
                          style={{
                            fontSize: styles.dateSize,
                            fontStyle: "italic",
                            color: selectedTheme.textMuted,
                            marginBottom: "2px",
                          }}
                        >
                          Technologies: {Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}
                        </div>
                      )}

                      {proj.description &&
                        (!proj.bullets?.length ||
                          !isDescriptionDuplicatedInBullets(proj.description, proj.bullets)) && (
                        <p
                          style={{
                            fontSize: styles.bodySize,
                            lineHeight: styles.lineHeight,
                            color: selectedTheme.text,
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
                                color: selectedTheme.text,
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

          case "certifications":
            if (!resumeData.certifications?.length) return null;
            return (
              <section key="certifications" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Certifications & Governance")}
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
                        <span style={{ fontSize: styles.dateSize, color: selectedTheme.textMuted, fontStyle: "italic" }}>
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
                {renderSectionHeader("Key Honours & Distinctions")}
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
                        color: selectedTheme.text,
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

          case "publications":
            if (!resumeData.publications?.length) return null;
            return (
              <section key="publications" style={{ marginBottom: styles.sectionMarginBottom }}>
                {renderSectionHeader("Publications & Thought Leadership")}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {resumeData.publications.map((pub, index) => (
                    <div key={index} style={{ fontSize: styles.bodySize }}>
                      <span style={{ fontWeight: 600, color: selectedTheme.text }}>{pub.title}</span>
                      {pub.publisher && <span style={{ fontStyle: "italic", color: selectedTheme.textLight }}>, {pub.publisher}</span>}
                      {pub.date && <span style={{ color: selectedTheme.textMuted }}> ({pub.date})</span>}
                    </div>
                  ))}
                </div>
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
                          color: selectedTheme.text,
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

ExecutiveTemplate.displayName = "ExecutiveTemplate";

export default ExecutiveTemplate;
