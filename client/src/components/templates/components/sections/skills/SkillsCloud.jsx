/**
 * SkillsCloud Component
 * Displays skills as a word cloud with size variations based on proficiency
 * Best for: Creative, Modern, Portfolio templates
 * Features: Size variations, hover effects, dynamic layout, visual emphasis
 */

import React from "react";

const SkillsCloud = ({
  skills = [],
  theme = {},
  colorful = true,
  minSize = 14,
  maxSize = 32,
  showLevel = false,
}) => {
  // Default theme values
  const defaultTheme = {
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#8b5cf6",
      text: "#1f2937",
      textSecondary: "#6b7280",
    },
    typography: {
      headingFont: "Inter, sans-serif",
      bodyFont: "Inter, sans-serif",
    },
  };

  const mergedTheme = {
    colors: {...defaultTheme.colors, ...theme.colors},
    typography: {...defaultTheme.typography, ...theme.typography},
  };

  // Calculate font size based on proficiency level
  const getFontSize = (skill) => {
    const level = skill.level || skill.proficiency || 50;
    const range = maxSize - minSize;
    const size = minSize + (level / 100) * range;
    return `${size}px`;
  };

  // Get color based on proficiency or index
  const getColor = (skill, index) => {
    if (!colorful) {
      return mergedTheme.colors.text;
    }

    const level = skill.level || skill.proficiency || 50;

    // Color intensity based on level
    if (level >= 80) return mergedTheme.colors.primary;
    if (level >= 60) return mergedTheme.colors.secondary;
    if (level >= 40) return mergedTheme.colors.accent;

    // Fallback to color rotation
    const colors = [
      mergedTheme.colors.primary,
      mergedTheme.colors.secondary,
      mergedTheme.colors.accent,
      "#10b981", // Green
      "#f59e0b", // Orange
      "#8b5cf6", // Purple
      "#ec4899", // Pink
    ];

    return colors[index % colors.length];
  };

  // Get font weight based on level
  const getFontWeight = (skill) => {
    const level = skill.level || skill.proficiency || 50;
    if (level >= 80) return "bold";
    if (level >= 60) return "600";
    if (level >= 40) return "500";
    return "normal";
  };

  // Sort skills by level (highest first) for better visual hierarchy
  const sortedSkills = [...skills].sort((a, b) => {
    const levelA = a.level || a.proficiency || 50;
    const levelB = b.level || b.proficiency || 50;
    return levelB - levelA;
  });

  return (
    <div className="mb-8">
      {/* Section title */}
      <h2
        className="text-2xl font-bold mb-6 pb-2 border-b-2"
        style={{
          color: mergedTheme.colors.primary,
          fontFamily: mergedTheme.typography.headingFont,
          borderColor: mergedTheme.colors.primary,
        }}
      >
        Skills
      </h2>

      {/* Cloud container */}
      <div
        className="flex flex-wrap items-center justify-center gap-4 py-4"
        style={{
          minHeight: "200px",
          textAlign: "center",
        }}
      >
        {sortedSkills.map((skill, index) => {
          const level = skill.level || skill.proficiency;

          return (
            <span
              key={`skill-${index}`}
              className="transition-all duration-300 hover:scale-110 cursor-default inline-flex items-baseline"
              style={{
                color: getColor(skill, index),
                fontSize: getFontSize(skill),
                fontWeight: getFontWeight(skill),
                fontFamily: mergedTheme.typography.bodyFont,
                lineHeight: "1.2",
              }}
            >
              {skill.name || skill.skill}
              {showLevel && level && (
                <span
                  className="ml-1 opacity-60"
                  style={{
                    fontSize: `${parseInt(getFontSize(skill)) * 0.5}px`,
                    fontWeight: "normal",
                  }}
                >
                  {level}%
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Legend (if colorful) */}
      {colorful && (
        <div
          className="mt-4 flex items-center justify-center gap-4 text-xs"
          style={{color: mergedTheme.colors.textSecondary}}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{backgroundColor: mergedTheme.colors.primary}}
            />
            <span>Expert (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{backgroundColor: mergedTheme.colors.secondary}}
            />
            <span>Advanced (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{backgroundColor: mergedTheme.colors.accent}}
            />
            <span>Intermediate (40-59%)</span>
          </div>
        </div>
      )}

      {/* Print optimization */}
      <style jsx>{`
        @media print {
          .flex-wrap {
            display: block;
          }
          span {
            display: inline;
            margin-right: 0.5rem;
          }
          span:hover {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SkillsCloud;
