/**
 * SkillsBar Component
 * Displays skills with animated progress bars showing proficiency levels
 * Best for: Professional, Executive, Technical templates
 * Features: Progress bars, percentage display, categories, animations
 */

import React from "react";

const SkillsBar = ({
  skills = [],
  theme = {},
  showPercentage = true,
  animated = true,
  groupByCategory = false,
}) => {
  // Default theme values
  const defaultTheme = {
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
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

  const currentTheme = {...defaultTheme, ...theme};
  const mergedTheme = {
    colors: {...defaultTheme.colors, ...theme.colors},
    typography: {
      ...defaultTheme.typography,
      ...theme.typography,
      sizes: {...defaultTheme.typography.sizes, ...theme.typography?.sizes},
    },
  };

  // Flatten skills if they're in nested structure {category, items}
  const flattenSkills = (skillsArray) => {
    if (!Array.isArray(skillsArray) || skillsArray.length === 0) return [];

    // Check if first item has nested structure
    if (skillsArray[0]?.items && Array.isArray(skillsArray[0].items)) {
      // Flatten nested structure and add category to each item
      return skillsArray.flatMap((group) =>
        (group.items || []).map((item) => ({
          ...item,
          category: item.category || group.category,
        }))
      );
    }

    // Already flat
    return skillsArray;
  };

  // Get flattened skills
  const flatSkills = flattenSkills(skills);

  // Group skills by category if needed
  const groupedSkills = groupByCategory
    ? flatSkills.reduce((acc, skill) => {
        const category = skill.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill);
        return acc;
      }, {})
    : {Skills: flatSkills};

  // Render a single skill bar
  const renderSkillBar = (skill, index) => {
    const level = skill.level || skill.proficiency || 80;
    const animationDelay = animated ? `${index * 0.1}s` : "0s";

    return (
      <div key={`skill-${index}`} className="mb-4">
        {/* Skill name and percentage */}
        <div className="flex justify-between items-center mb-2">
          <span
            className="font-medium"
            style={{
              color: mergedTheme.colors.text,
              fontSize: mergedTheme.typography.sizes.small,
            }}
          >
            {skill.name || skill.skill}
          </span>
          {showPercentage && (
            <span
              className="text-sm"
              style={{
                color: mergedTheme.colors.textSecondary,
                fontSize: mergedTheme.typography.sizes.xs,
              }}
            >
              {level}%
            </span>
          )}
        </div>

        {/* Progress bar background */}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{
            backgroundColor: mergedTheme.colors.border,
            height: "8px",
          }}
        >
          {/* Progress bar fill */}
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: animated ? `${level}%` : "0%",
              backgroundColor: mergedTheme.colors.primary,
              animationDelay,
              animation: animated ? "slideIn 1s ease-out forwards" : "none",
            }}
          />
        </div>
      </div>
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
                className="text-lg font-semibold mb-4"
                style={{
                  color: mergedTheme.colors.text,
                  fontFamily: mergedTheme.typography.bodyFont,
                }}
              >
                {category}
              </h3>
            )}

            {/* Skill bars */}
            <div className="space-y-3">
              {categorySkills.map((skill, index) =>
                renderSkillBar(skill, index)
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Animation keyframes */}
      {animated && (
        <style jsx>{`
          @keyframes slideIn {
            from {
              width: 0%;
            }
            to {
              width: var(--final-width);
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default SkillsBar;
