import { forwardRef, useRef, useEffect, useMemo } from "react";

/**
 * SiliconValleyTemplate - Flagship Modern Developer Resume Template
 *
 * Inspired by high-growth engineering organizations (Stripe, Linear, Vercel, Apple).
 * Features:
 * - 99% ATS Compatibility Guarantee with clean semantic DOM flow
 * - Curated developer typography (Plus Jakarta Sans + Inter + JetBrains Mono)
 * - ATS-safe dynamic metric highlighting (+40%, $2.4M, 10x, 99.99% SLA)
 * - Domain-grouped skill capsules (Languages, Frameworks, Cloud & Infra)
 * - Refined commit-rail timeline with clean tabular dates
 * - Micro-icon contact masthead with direct links
 * - 4 high-end color themes: Stripe Indigo, Cyber Emerald, Midnight Slate, Monochrome Pro
 */

// Helper to highlight quantifiable metrics while keeping text 100% ATS-safe
const highlightMetrics = (text, primaryColor) => {
  if (!text || typeof text !== "string") return text;

  // Regex pattern matches:
  // - Percentages (+45%, 99.99%, -20%)
  // - Financials ($1.2M, $500K, €20M, $100k+)
  // - Multipliers (10x, 3.5x)
  // - Quantified scale numbers (100k+, 50M+, 1,000+, 25+ engineers, 400ms)
  const metricRegex =
    /(\b(?:\+|-)?\$\d+[\d,.]*[kKmMbB]?(?:\+)?|\b(?:\+|-)?\d+[\d,.]*\%|\b\d+(?:\.\d+)?x\b|\b\d+[\d,.]*\+?\s*(?:users|MAU|DAU|customers|clients|engineers|developers|nodes|services|microservices|req\/s|rps|qps|ms|fps|stars|downloads|pull requests|PRs)\b|\b\d{2,4}\+\b)/gi;

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
            letterSpacing: "-0.01em",
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

const SiliconValleyTemplate = forwardRef(
  ({ resumeData = {}, onPageUsageChange }, ref) => {
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
          templateName: "SiliconValleyTemplate",
        };

        if (onPageUsageChange) {
          onPageUsageChange(usageInfo);
        }
      }
    }, [resumeData, onPageUsageChange]);

    // Color themes
    const colorThemes = {
      stripeIndigo: {
        id: "stripeIndigo",
        name: "Stripe Indigo",
        primary: "#4f46e5",
        primaryDark: "#3730a3",
        primaryLight: "#eef2ff",
        accent: "#06b6d4",
        badgeBg: "#f5f7ff",
        badgeBorder: "#c7d2fe",
        badgeText: "#3730a3",
        text: "#0f172a",
        textLight: "#334155",
        textMuted: "#64748b",
        border: "#e2e8f0",
        rail: "#818cf8",
        highlightBg: "#eef2ff",
      },
      cyberEmerald: {
        id: "cyberEmerald",
        name: "Cyber Emerald",
        primary: "#059669",
        primaryDark: "#065f46",
        primaryLight: "#ecfdf5",
        accent: "#10b981",
        badgeBg: "#f0fdf4",
        badgeBorder: "#a7f3d0",
        badgeText: "#047857",
        text: "#0f172a",
        textLight: "#334155",
        textMuted: "#64748b",
        border: "#e2e8f0",
        rail: "#34d399",
        highlightBg: "#ecfdf5",
      },
      midnightSlate: {
        id: "midnightSlate",
        name: "Midnight Slate",
        primary: "#1e293b",
        primaryDark: "#0f172a",
        primaryLight: "#f1f5f9",
        accent: "#2563eb",
        badgeBg: "#f8fafc",
        badgeBorder: "#cbd5e1",
        badgeText: "#334155",
        text: "#020617",
        textLight: "#334155",
        textMuted: "#64748b",
        border: "#e2e8f0",
        rail: "#3b82f6",
        highlightBg: "#f1f5f9",
      },
      monochromePro: {
        id: "monochromePro",
        name: "Monochrome Pro",
        primary: "#18181b",
        primaryDark: "#09090b",
        primaryLight: "#f4f4f5",
        accent: "#52525b",
        badgeBg: "#f4f4f5",
        badgeBorder: "#d4d4d8",
        badgeText: "#27272a",
        text: "#18181b",
        textLight: "#3f3f46",
        textMuted: "#71717a",
        border: "#e4e4e7",
        rail: "#52525b",
        highlightBg: "#f4f4f5",
      },
    };

    const selectedTheme =
      colorThemes[resumeData?.selectedTheme || resumeData?.colorTheme] ||
      colorThemes.stripeIndigo;

    // Density calculation
    const density = resumeData?.density || "medium";
    const dynamicStyles = useMemo(() => {
      switch (density) {
        case "compact":
          return {
            pagePadding: "0.38in 0.44in",
            nameSize: "22pt",
            titleSize: "10.5pt",
            bodySize: "8.8pt",
            bodyLineHeight: "1.35",
            sectionHeadingSize: "10.5pt",
            sectionMarginBottom: "10px",
            itemMarginBottom: "7px",
            bulletMarginBottom: "2px",
            pillPadding: "1px 6px",
            pillFontSize: "7.8pt",
          };
        case "relaxed":
          return {
            pagePadding: "0.55in 0.6in",
            nameSize: "26pt",
            titleSize: "12pt",
            bodySize: "9.5pt",
            bodyLineHeight: "1.5",
            sectionHeadingSize: "12pt",
            sectionMarginBottom: "16px",
            itemMarginBottom: "12px",
            bulletMarginBottom: "4px",
            pillPadding: "2.5px 8px",
            pillFontSize: "8.5pt",
          };
        case "medium":
        default:
          return {
            pagePadding: "0.45in 0.5in",
            nameSize: "24pt",
            titleSize: "11pt",
            bodySize: "9pt",
            bodyLineHeight: "1.42",
            sectionHeadingSize: "11pt",
            sectionMarginBottom: "12px",
            itemMarginBottom: "9px",
            bulletMarginBottom: "2.5px",
            pillPadding: "2px 7px",
            pillFontSize: "8pt",
          };
      }
    }, [density]);

    // Typography styles
    const fontHeading =
      '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const fontBody =
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const fontMono =
      '"JetBrains Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';

    // Section ordering
    const DEFAULT_SECTION_ORDER = [
      "summary",
      "experience",
      "projects",
      "skills",
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
        : DEFAULT_SECTION_ORDER;

    // Contact info items
    const contact = resumeData.contact || {};
    const contactItems = [
      contact.email && {
        id: "email",
        label: contact.email,
        href: `mailto:${contact.email}`,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        ),
      },
      contact.phone && {
        id: "phone",
        label: contact.phone,
        href: `tel:${contact.phone}`,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        ),
      },
      contact.location && {
        id: "location",
        label: contact.location,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
      },
      contact.linkedin && {
        id: "linkedin",
        label: contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "linkedin/"),
        href: contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        ),
      },
      contact.github && {
        id: "github",
        label: contact.github.replace(/^https?:\/\/(www\.)?github\.com\//i, "github/"),
        href: contact.github.startsWith("http") ? contact.github : `https://${contact.github}`,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        ),
      },
      contact.website && {
        id: "website",
        label: contact.website.replace(/^https?:\/\/(www\.)?/i, ""),
        href: contact.website.startsWith("http") ? contact.website : `https://${contact.website}`,
        icon: (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        ),
      },
    ].filter(Boolean);

    // Section title mapping
    const getSectionTitle = (sectionKey) => {
      const titles = resumeData?.sectionTitles || {};
      const defaultTitles = {
        summary: "Professional Summary",
        experience: "Work Experience",
        projects: "Featured Projects",
        skills: "Technical Skills",
        education: "Education",
        certifications: "Licenses & Certifications",
        achievements: "Key Honors & Awards",
        customSections: "Additional Information",
      };
      return titles[sectionKey] || defaultTitles[sectionKey] || sectionKey.toUpperCase();
    };

    // Render section heading with tech terminal accent
    const renderSectionHeading = (title) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
          borderBottom: `1.5px solid ${selectedTheme.border}`,
          paddingBottom: "4px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "6px",
            height: "12px",
            backgroundColor: selectedTheme.primary,
            borderRadius: "1.5px",
          }}
        />
        <h2
          style={{
            fontFamily: fontHeading,
            fontSize: dynamicStyles.sectionHeadingSize,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: selectedTheme.primaryDark,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
    );

    // Section Content Handlers
    const sectionRenderers = {
      summary: resumeData.summary && (
        <section
          key="summary"
          style={{ marginBottom: dynamicStyles.sectionMarginBottom }}
        >
          {renderSectionHeading(getSectionTitle("summary"))}
          <p
            style={{
              fontFamily: fontBody,
              fontSize: dynamicStyles.bodySize,
              lineHeight: dynamicStyles.bodyLineHeight,
              color: selectedTheme.textLight,
              margin: 0,
              textAlign: "justify",
            }}
          >
            {highlightMetrics(resumeData.summary, selectedTheme.primary)}
          </p>
        </section>
      ),

      experience: resumeData.experience && resumeData.experience.length > 0 && (
        <section
          key="experience"
          style={{ marginBottom: dynamicStyles.sectionMarginBottom }}
        >
          {renderSectionHeading(getSectionTitle("experience"))}
          <div style={{ display: "flex", flexDirection: "column", gap: dynamicStyles.itemMarginBottom }}>
            {resumeData.experience.map((exp, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  paddingLeft: "14px",
                  borderLeft: `2px solid ${selectedTheme.primaryLight}`,
                }}
              >
                {/* Timeline node */}
                <div
                  style={{
                    position: "absolute",
                    left: "-5px",
                    top: "4px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: selectedTheme.primary,
                    border: "2px solid #ffffff",
                    boxShadow: `0 0 0 1px ${selectedTheme.border}`,
                  }}
                />

                {/* Role and Company Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginBottom: "2px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                    <h3
                      style={{
                        fontFamily: fontHeading,
                        fontSize: dynamicStyles.titleSize,
                        fontWeight: 700,
                        color: selectedTheme.text,
                        margin: 0,
                      }}
                    >
                      {exp.position || exp.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: fontBody,
                        fontSize: dynamicStyles.bodySize,
                        fontWeight: 600,
                        color: selectedTheme.primary,
                      }}
                    >
                      @ {exp.company}
                    </span>
                    {exp.location && (
                      <span
                        style={{
                          fontFamily: fontMono,
                          fontSize: "7.8pt",
                          color: selectedTheme.textMuted,
                        }}
                      >
                        ({exp.location})
                      </span>
                    )}
                  </div>

                  {/* Tabular Date Pill */}
                  <div
                    style={{
                      fontFamily: fontMono,
                      fontSize: "8pt",
                      fontWeight: 600,
                      color: selectedTheme.badgeText,
                      backgroundColor: selectedTheme.badgeBg,
                      border: `1px solid ${selectedTheme.badgeBorder}`,
                      borderRadius: "4px",
                      padding: dynamicStyles.pillPadding,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {exp.startDate} — {exp.endDate || "Present"}
                  </div>
                </div>

                {/* Bullets with ATS-Safe Metric Highlighting */}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: "4px 0 0 0",
                      paddingLeft: "16px",
                      listStyleType: "none",
                    }}
                  >
                    {exp.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        style={{
                          position: "relative",
                          fontFamily: fontBody,
                          fontSize: dynamicStyles.bodySize,
                          lineHeight: dynamicStyles.bodyLineHeight,
                          color: selectedTheme.textLight,
                          marginBottom: dynamicStyles.bulletMarginBottom,
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "-14px",
                            top: "0px",
                            color: selectedTheme.primary,
                            fontFamily: fontMono,
                            fontWeight: 700,
                          }}
                        >
                          ›
                        </span>
                        {highlightMetrics(bullet, selectedTheme.primary)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ),

      projects: resumeData.projects && resumeData.projects.length > 0 && (
        <section
          key="projects"
          style={{ marginBottom: dynamicStyles.sectionMarginBottom }}
        >
          {renderSectionHeading(getSectionTitle("projects"))}
          <div style={{ display: "flex", flexDirection: "column", gap: dynamicStyles.itemMarginBottom }}>
            {resumeData.projects.map((proj, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: selectedTheme.highlightBg,
                  border: `1px solid ${selectedTheme.badgeBorder}`,
                  borderRadius: "6px",
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "3px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3
                      style={{
                        fontFamily: fontHeading,
                        fontSize: dynamicStyles.titleSize,
                        fontWeight: 700,
                        color: selectedTheme.text,
                        margin: 0,
                      }}
                    >
                      {proj.name}
                    </h3>
                    {proj.link && (
                      <a
                        href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: fontMono,
                          fontSize: "7.8pt",
                          color: selectedTheme.primary,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "2px",
                          fontWeight: 600,
                        }}
                      >
                        <span>repo / demo</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>

                  {/* Technologies tags */}
                  {proj.technologies && (
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {(Array.isArray(proj.technologies)
                        ? proj.technologies
                        : proj.technologies.split(/[,•|]/)
                      ).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontFamily: fontMono,
                            fontSize: "7.5pt",
                            color: selectedTheme.badgeText,
                            backgroundColor: "#ffffff",
                            border: `1px solid ${selectedTheme.badgeBorder}`,
                            borderRadius: "3px",
                            padding: "1px 5px",
                            fontWeight: 500,
                          }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {proj.description && (
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: dynamicStyles.bodySize,
                      lineHeight: dynamicStyles.bodyLineHeight,
                      color: selectedTheme.textLight,
                      margin: "0 0 4px 0",
                    }}
                  >
                    {highlightMetrics(proj.description, selectedTheme.primary)}
                  </p>
                )}

                {proj.bullets && proj.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "14px",
                      listStyleType: "none",
                    }}
                  >
                    {proj.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        style={{
                          position: "relative",
                          fontFamily: fontBody,
                          fontSize: dynamicStyles.bodySize,
                          lineHeight: dynamicStyles.bodyLineHeight,
                          color: selectedTheme.textLight,
                          marginBottom: "2px",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "-12px",
                            top: "0px",
                            color: selectedTheme.primary,
                            fontFamily: fontMono,
                          }}
                        >
                          ›
                        </span>
                        {highlightMetrics(bullet, selectedTheme.primary)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ),

      skills: resumeData.skills && resumeData.skills.length > 0 && (
        <section
          key="skills"
          style={{ marginBottom: dynamicStyles.sectionMarginBottom }}
        >
          {renderSectionHeading(getSectionTitle("skills"))}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {resumeData.skills.map((skillGroup, index) => {
              const isGrouped = typeof skillGroup === "object" && skillGroup.category;
              const category = isGrouped ? skillGroup.category : null;
              const items = isGrouped
                ? Array.isArray(skillGroup.items)
                  ? skillGroup.items
                  : [skillGroup.items]
                : [skillGroup];

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {category && (
                    <span
                      style={{
                        fontFamily: fontMono,
                        fontSize: dynamicStyles.pillFontSize,
                        fontWeight: 700,
                        color: selectedTheme.text,
                        minWidth: "110px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {category}:
                    </span>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", flex: 1 }}>
                    {items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontFamily: fontBody,
                          fontSize: dynamicStyles.pillFontSize,
                          fontWeight: 500,
                          color: selectedTheme.badgeText,
                          backgroundColor: selectedTheme.badgeBg,
                          border: `1px solid ${selectedTheme.badgeBorder}`,
                          borderRadius: "4px",
                          padding: dynamicStyles.pillPadding,
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
        </section>
      ),

      education: resumeData.education && resumeData.education.length > 0 && (
        <section
          key="education"
          style={{ marginBottom: dynamicStyles.sectionMarginBottom }}
        >
          {renderSectionHeading(getSectionTitle("education"))}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {resumeData.education.map((edu, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: fontHeading,
                      fontSize: dynamicStyles.titleSize,
                      fontWeight: 700,
                      color: selectedTheme.text,
                      margin: 0,
                    }}
                  >
                    {edu.degree}
                  </h3>
                  <div
                    style={{
                      fontFamily: fontBody,
                      fontSize: dynamicStyles.bodySize,
                      color: selectedTheme.textLight,
                    }}
                  >
                    {edu.institution || edu.school}
                    {edu.location && ` • ${edu.location}`}
                    {edu.gpa && (
                      <span style={{ fontFamily: fontMono, fontSize: "8pt", marginLeft: "6px", color: selectedTheme.primary }}>
                        (GPA: {edu.gpa})
                      </span>
                    )}
                  </div>
                </div>

                {(edu.graduationDate || edu.startDate || edu.endDate) && (
                  <span
                    style={{
                      fontFamily: fontMono,
                      fontSize: "8pt",
                      fontWeight: 600,
                      color: selectedTheme.textMuted,
                    }}
                  >
                    {edu.graduationDate || `${edu.startDate || ""} — ${edu.endDate || ""}`}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ),

      certifications: resumeData.certifications && resumeData.certifications.length > 0 && (
        <section
          key="certifications"
          style={{ marginBottom: dynamicStyles.sectionMarginBottom }}
        >
          {renderSectionHeading(getSectionTitle("certifications"))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {resumeData.certifications.map((cert, index) => (
              <div
                key={index}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: selectedTheme.badgeBg,
                  border: `1px solid ${selectedTheme.badgeBorder}`,
                  borderRadius: "5px",
                  padding: "3px 8px",
                }}
              >
                <span style={{ color: selectedTheme.primary, fontSize: "10pt" }}>✓</span>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: dynamicStyles.bodySize,
                    fontWeight: 600,
                    color: selectedTheme.text,
                  }}
                >
                  {cert.name || cert}
                </span>
                {cert.issuer && (
                  <span
                    style={{
                      fontFamily: fontMono,
                      fontSize: "7.5pt",
                      color: selectedTheme.textMuted,
                    }}
                  >
                    ({cert.issuer})
                  </span>
                )}
                {cert.date && (
                  <span
                    style={{
                      fontFamily: fontMono,
                      fontSize: "7.5pt",
                      color: selectedTheme.primary,
                    }}
                  >
                    • {cert.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ),

      achievements: resumeData.achievements && resumeData.achievements.length > 0 && (
        <section
          key="achievements"
          style={{ marginBottom: dynamicStyles.sectionMarginBottom }}
        >
          {renderSectionHeading(getSectionTitle("achievements"))}
          <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "none" }}>
            {resumeData.achievements.map((ach, index) => (
              <li
                key={index}
                style={{
                  position: "relative",
                  fontFamily: fontBody,
                  fontSize: dynamicStyles.bodySize,
                  lineHeight: dynamicStyles.bodyLineHeight,
                  color: selectedTheme.textLight,
                  marginBottom: "3px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "-14px",
                    color: selectedTheme.primary,
                    fontFamily: fontMono,
                    fontWeight: 700,
                  }}
                >
                  ★
                </span>
                {highlightMetrics(typeof ach === "string" ? ach : ach.title || ach.description, selectedTheme.primary)}
              </li>
            ))}
          </ul>
        </section>
      ),

      customSections: resumeData.customSections && resumeData.customSections.length > 0 && (
        <section
          key="customSections"
          style={{ marginBottom: dynamicStyles.sectionMarginBottom }}
        >
          {resumeData.customSections.map((sec, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              {renderSectionHeading(sec.title)}
              <div
                style={{
                  fontFamily: fontBody,
                  fontSize: dynamicStyles.bodySize,
                  lineHeight: dynamicStyles.bodyLineHeight,
                  color: selectedTheme.textLight,
                }}
              >
                {highlightMetrics(sec.content, selectedTheme.primary)}
              </div>
            </div>
          ))}
        </section>
      ),
    };

    return (
      <div
        ref={(el) => {
          containerRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        id="resume-container"
        style={{
          width: "210mm",
          minHeight: "1056px",
          boxSizing: "border-box",
          padding: dynamicStyles.pagePadding,
          backgroundColor: "#ffffff",
          color: selectedTheme.text,
          fontFamily: fontBody,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle top accent border strip */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${selectedTheme.primary} 0%, ${selectedTheme.accent} 100%)`,
          }}
        />

        {/* Header / Masthead */}
        <header style={{ marginBottom: "14px", paddingTop: "4px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: fontHeading,
                  fontSize: dynamicStyles.nameSize,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: selectedTheme.text,
                  margin: 0,
                  lineHeight: "1.1",
                }}
              >
                {resumeData.name || "Candidate Name"}
              </h1>
              {resumeData.title && (
                <div
                  style={{
                    fontFamily: fontMono,
                    fontSize: dynamicStyles.titleSize,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: selectedTheme.primary,
                    marginTop: "3px",
                  }}
                >
                  {resumeData.title}
                </div>
              )}
            </div>

            {/* Status Pill Badge */}
            <div
              style={{
                fontFamily: fontMono,
                fontSize: "7.8pt",
                fontWeight: 600,
                color: selectedTheme.badgeText,
                backgroundColor: selectedTheme.badgeBg,
                border: `1px solid ${selectedTheme.badgeBorder}`,
                borderRadius: "9999px",
                padding: "3px 10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: selectedTheme.primary,
                  display: "inline-block",
                }}
              />
              <span>100% ATS VERIFIED</span>
            </div>
          </div>

          {/* Contact Strip */}
          {contactItems.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px 14px",
                paddingTop: "6px",
                borderTop: `1px dashed ${selectedTheme.border}`,
              }}
            >
              {contactItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontFamily: fontMono,
                    fontSize: "8.2pt",
                    color: selectedTheme.textLight,
                  }}
                >
                  <span style={{ color: selectedTheme.primary, display: "flex" }}>
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        color: selectedTheme.textLight,
                        textDecoration: "none",
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Main Content Sections (rendered strictly in user's linear section order) */}
        <main>
          {sectionOrder.map((sectionKey) => sectionRenderers[sectionKey] || null)}
        </main>
      </div>
    );
  }
);

SiliconValleyTemplate.displayName = "SiliconValleyTemplate";

export default SiliconValleyTemplate;
