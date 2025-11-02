/**
 * ExperienceTimeline Component
 * Visual timeline layout with connecting lines and icons
 * Best for: Modern, Tech, Creative templates
 */

import React from "react";
import {
  formatDateRange,
  calculateDuration,
} from "../../../utils/templateHelpers";

const ExperienceTimeline = ({experiences, theme, showDuration = true}) => {
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

      <div style={{position: "relative", paddingLeft: "40px"}}>
        {/* Timeline vertical line */}
        <div
          style={{
            position: "absolute",
            left: "15px",
            top: "12px",
            bottom: "12px",
            width: "2px",
            background: `linear-gradient(to bottom, ${theme.colors.primary}, ${theme.colors.secondary})`,
          }}
        />

        {experiences.map((exp, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              marginBottom:
                index === experiences.length - 1 ? 0 : theme.spacing.section,
            }}
          >
            {/* Timeline dot */}
            <div
              style={{
                position: "absolute",
                left: "-33px",
                top: "6px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: theme.colors.primary,
                border: `3px solid ${theme.colors.background}`,
                boxShadow: `0 0 0 2px ${theme.colors.primary}`,
                zIndex: 1,
              }}
            />

            {/* Content */}
            <div>
              {/* Position and Company */}
              <div style={{marginBottom: theme.spacing.tight}}>
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

              {/* Date and Duration */}
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
                <span>
                  {formatDateRange(
                    exp.startDate,
                    exp.endDate,
                    exp.current ? "Present" : undefined
                  )}
                </span>
                {showDuration && exp.startDate && (
                  <>
                    <span>•</span>
                    <span style={{fontStyle: "italic"}}>
                      {calculateDuration(
                        exp.startDate,
                        exp.endDate || new Date()
                      )}
                    </span>
                  </>
                )}
                {exp.location && (
                  <>
                    <span>•</span>
                    <span>📍 {exp.location}</span>
                  </>
                )}
              </div>

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
                        backgroundColor: theme.colors.backgroundAlt,
                        padding: "2px 8px",
                        borderRadius: theme.borders.radius.sm,
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceTimeline;
