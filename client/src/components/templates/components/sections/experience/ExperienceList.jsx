/**
 * ExperienceList Component
 * Traditional list layout - highly ATS-friendly
 * Best for: Professional, Executive, Conservative templates
 */

import React from "react";
import {formatDateRange} from "../../../utils/templateHelpers";

const ExperienceList = ({experiences, theme, compact = false}) => {
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
          paddingBottom: "4px",
          borderBottom: `2px solid ${theme.colors.primary}`,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        PROFESSIONAL EXPERIENCE
      </h2>

      <div>
        {experiences.map((exp, index) => (
          <div
            key={index}
            style={{
              marginBottom:
                index === experiences.length - 1
                  ? 0
                  : compact
                  ? theme.spacing.element
                  : theme.spacing.section,
            }}
          >
            {/* Position and Date on same line */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "2px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <h3
                style={{
                  fontSize: theme.fonts.sizes.subheading,
                  fontFamily: theme.fonts.body,
                  fontWeight: theme.fonts.weights.bold,
                  color: theme.colors.text,
                  margin: 0,
                }}
              >
                {exp.position || exp.role || exp.title}
              </h3>
              <span
                style={{
                  fontSize: theme.fonts.sizes.body,
                  fontFamily: theme.fonts.body,
                  color: theme.colors.textLight,
                  fontWeight: theme.fonts.weights.normal,
                  whiteSpace: "nowrap",
                }}
              >
                {formatDateRange(
                  exp.startDate,
                  exp.endDate,
                  exp.current ? "Present" : undefined
                )}
              </span>
            </div>

            {/* Company and Location */}
            <div
              style={{
                fontSize: theme.fonts.sizes.body,
                fontFamily: theme.fonts.body,
                color: theme.colors.textLight,
                marginBottom: compact ? "4px" : theme.spacing.tight,
                fontStyle: "italic",
              }}
            >
              {exp.company || exp.organization}
              {exp.location && ` • ${exp.location}`}
            </div>

            {/* Description */}
            {!compact && exp.description && (
              <p
                style={{
                  fontSize: theme.fonts.sizes.body,
                  fontFamily: theme.fonts.body,
                  color: theme.colors.text,
                  lineHeight: "1.6",
                  marginBottom: theme.spacing.tight,
                  marginTop: theme.spacing.tight,
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
                  marginTop: compact ? "4px" : theme.spacing.tight,
                  paddingLeft: "20px",
                  fontSize: theme.fonts.sizes.body,
                  fontFamily: theme.fonts.body,
                  color: theme.colors.text,
                  lineHeight: "1.6",
                }}
              >
                {exp.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom:
                        idx === exp.achievements.length - 1 ? 0 : "3px",
                    }}
                  >
                    {achievement}
                  </li>
                ))}
              </ul>
            )}

            {/* Technologies/Skills used (inline style) */}
            {exp.technologies && exp.technologies.length > 0 && (
              <div
                style={{
                  marginTop: theme.spacing.tight,
                  fontSize: theme.fonts.sizes.body,
                  fontFamily: theme.fonts.body,
                  color: theme.colors.textLight,
                }}
              >
                <strong style={{color: theme.colors.text}}>
                  Technologies:
                </strong>{" "}
                {exp.technologies.join(" • ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceList;
