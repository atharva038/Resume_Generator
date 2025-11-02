/**
 * SkillsPills Component
 * Displays skills as colorful badges/pills
 * Best for: Creative, Modern, Minimal templates
 * Features: Compact layout, color coding, flexible wrapping, hover effects
 */

import React from "react";

const SkillsPills = ({
  skills = [],
  theme = {},
  colorful = true,
  size = "medium", // small, medium, large
  groupByCategory = false,
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
      border: "#e5e7eb",
      background: "#ffffff",
    },
    typography: {
      headingFont: "Inter, sans-serif",
      bodyFont: "Inter, sans-serif",
      sizes: {
        xs: "0.75rem",
        small: "0.875rem",
        base: "1rem",
      },
    },
  };

  const mergedTheme = {
    colors: {...defaultTheme.colors, ...theme.colors},
    typography: {
      ...defaultTheme.typography,
      ...theme.typography,
      sizes: {...defaultTheme.typography.sizes, ...theme.typography?.sizes},
    },
  };

  // Size configurations
  const sizeConfig = {
    small: {
      padding: "px-2 py-1",
      fontSize: mergedTheme.typography.sizes.xs,
      gap: "gap-1",
    },
    medium: {
      padding: "px-3 py-1.5",
      fontSize: mergedTheme.typography.sizes.small,
      gap: "gap-2",
    },
    large: {
      padding: "px-4 py-2",
      fontSize: mergedTheme.typography.sizes.base,
      gap: "gap-3",
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Get pill color based on category or level
  const getPillColor = (skill, index) => {
    if (!colorful) {
      return {
        background: mergedTheme.colors.background,
        text: mergedTheme.colors.primary,
        border: mergedTheme.colors.primary,
      };
    }

    // Color palette
    const colors = [
      {bg: mergedTheme.colors.primary, text: "#ffffff"},
      {bg: mergedTheme.colors.secondary, text: "#ffffff"},
      {bg: mergedTheme.colors.accent, text: "#ffffff"},
      {bg: "#10b981", text: "#ffffff"}, // Green
      {bg: "#f59e0b", text: "#ffffff"}, // Orange
      {bg: "#8b5cf6", text: "#ffffff"}, // Purple
      {bg: "#ec4899", text: "#ffffff"}, // Pink
    ];

    // Rotate through colors
    const colorIndex = index % colors.length;
    return {
      background: colors[colorIndex].bg,
      text: colors[colorIndex].text,
      border: colors[colorIndex].bg,
    };
  };

  // Group skills by category if needed
  const groupedSkills = groupByCategory
    ? skills.reduce((acc, skill) => {
        const category = skill.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
      }, {})
    : {Skills: skills};

  // Render a single pill
  const renderPill = (skill, index) => {
    const colors = getPillColor(skill, index);
    const level = skill.level || skill.proficiency;

    return (
      <span
        key={`skill-${index}`}
        className={`${config.padding} rounded-full font-medium transition-all duration-200 hover:scale-105 hover:shadow-md inline-flex items-center`}
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          fontSize: config.fontSize,
          fontFamily: mergedTheme.typography.bodyFont,
        }}
      >
        {skill.name || skill.skill}
        {showLevel && level && (
          <span className="ml-1 opacity-80 text-xs">({level}%)</span>
        )}
      </span>
    );
  };

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

      {/* Skills by category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            {/* Category title (if grouped) */}
            {groupByCategory && (
              <h3
                className="text-lg font-semibold mb-3"
                style={{
                  color: mergedTheme.colors.text,
                  fontFamily: mergedTheme.typography.bodyFont,
                }}
              >
                {category}
              </h3>
            )}

            {/* Pills container */}
            <div className={`flex flex-wrap ${config.gap}`}>
              {categorySkills.map((skill, index) => renderPill(skill, index))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPills;
