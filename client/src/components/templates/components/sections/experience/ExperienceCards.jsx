/**
 * ExperienceCards Component
 * Card-based layout with hover effects
 * Best for: Creative, Modern, Portfolio-style templates
 */

import React from "react";
import {
  formatDateRange,
  calculateDuration,
} from "../../../utils/templateHelpers";

const ExperienceCards = ({experiences, theme, showDuration = true}) => {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section style={{marginBottom: theme.spacing.section}}>
      <h2
        style={{
          fontSize: theme.fonts.sizes.heading,
          fontFamily: theme.fonts.heading,
          fontWeight: theme.fonts.weights.bold,
          color: theme.colors.primary,
          marginBottom: theme.spacing.element,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        EXPERIENCE
      </h2>

      <div
        style={{
          display: "grid",
          gap: theme.spacing.element,
        }}
      >
        {experiences.map((exp, index) => (
          <div
            key={index}
            style={{
              backgroundColor: theme.colors.backgroundAlt,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borders.radius.md,
              padding: theme.spacing.element,
              transition: "all 0.3s ease",
              borderLeft: `4px solid ${theme.colors.primary}`,
            }}
            className="experience-card"
          >
            {/* Header: Position and Company */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: theme.spacing.tight,
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div style={{flex: 1}}>
                <h3
                  style={{
                    fontSize: theme.fonts.sizes.subheading,
                    fontFamily: theme.fonts.body,
                    fontWeight: theme.fonts.weights.bold,
                    color: theme.colors.text,
                    marginBottom: "2px",
                  }}
                >
                  {exp.position || exp.role || exp.title}
                </h3>
                <div
                  style={{
                    fontSize: theme.fonts.sizes.body,
                    fontFamily: theme.fonts.body,
                    color: theme.colors.primary,
                    fontWeight: theme.fonts.weights.semibold,
                  }}
                >
                  {exp.company || exp.organization}
                </div>
              </div>

              {/* Date Badge */}
              <div
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "#ffffff",
                  padding: "4px 12px",
                  borderRadius: theme.borders.radius.sm,
                  fontSize: theme.fonts.sizes.small,
                  fontFamily: theme.fonts.body,
                  fontWeight: theme.fonts.weights.medium,
                  whiteSpace: "nowrap",
                }}
              >
                {formatDateRange(
                  exp.startDate,
                  exp.endDate,
                  exp.current ? "Present" : undefined
                )}
              </div>
            </div>

            {/* Duration and Location */}
            {(showDuration || exp.location) && (
              <div
                style={{
                  fontSize: theme.fonts.sizes.small,
                  fontFamily: theme.fonts.body,
                  color: theme.colors.textLight,
                  marginBottom: theme.spacing.tight,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                {showDuration && exp.startDate && (
                  <span style={{fontStyle: "italic"}}>
                    {calculateDuration(
                      exp.startDate,
                      exp.endDate || new Date()
                    )}
                  </span>
                )}
                {exp.location && (
                  <>
                    {showDuration && exp.startDate && <span>•</span>}
                    <span>📍 {exp.location}</span>
                  </>
                )}
              </div>
            )}

            {/* Description */}
            {exp.description && (
              <p
                style={{
                  fontSize: theme.fonts.sizes.body,
                  fontFamily: theme.fonts.body,
                  color: theme.colors.text,
                  lineHeight: "1.6",
                  marginBottom: theme.spacing.tight,
                  textAlign: "justify",
                }}
              >
                {exp.description}
              </p>
            )}

            {/* Achievements/Responsibilities */}
            {exp.achievements && exp.achievements.length > 0 && (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  fontSize: theme.fonts.sizes.body,
                  fontFamily: theme.fonts.body,
                  color: theme.colors.text,
                  lineHeight: "1.6",
                  marginBottom: exp.technologies ? theme.spacing.tight : 0,
                }}
              >
                {exp.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom:
                        idx === exp.achievements.length - 1 ? 0 : "4px",
                    }}
                  >
                    {achievement}
                  </li>
                ))}
              </ul>
            )}

            {/* Technologies/Skills used */}
            {exp.technologies && exp.technologies.length > 0 && (
              <div
                style={{
                  marginTop: theme.spacing.tight,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                {exp.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: theme.fonts.sizes.small,
                      fontFamily: theme.fonts.body,
                      color: theme.colors.primary,
                      backgroundColor: theme.colors.background,
                      padding: "3px 10px",
                      borderRadius: theme.borders.radius.sm,
                      border: `1px solid ${theme.colors.border}`,
                      fontWeight: theme.fonts.weights.medium,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .experience-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </section>
  );
};

export default ExperienceCards;
