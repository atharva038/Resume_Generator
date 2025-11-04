/**
 * SkillsGrid Component
 * Displays skills in a structured grid layout with categories
 * Best for: Professional, Tech, Executive templates
 * Features: Grid layout, category grouping, icons, proficiency indicators
 */

import React from "react";

const SkillsGrid = ({
  skills = [],
  theme = {},
  columns = 3, // 2, 3, or 4
  showLevel = true,
  showIcons = false,
  compact = false,
}) => {
  // Default theme values
  const defaultTheme = {
    colors: {
      primary: "#1e40af",
      text: "#1f2937",
      border: "#e5e7eb",
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

  // Group skills by category
  const groupedSkills = flatSkills.reduce((acc, skill) => {
    const category = skill.category || "Other Skills";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  // Get level indicator
  const getLevelIndicator = (level) => {
    if (!level) return null;

    const normalizedLevel = typeof level === "number" ? level : parseInt(level);
    const dots = Math.ceil(normalizedLevel / 25); // 1-4 dots based on 0-100 scale

    return (
      <div className="flex gap-1 ml-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor:
                i <= dots
                  ? mergedTheme.colors.primary
                  : mergedTheme.colors.border,
            }}
          />
        ))}
      </div>
    );
  };

  // Get grid columns class
  const getGridClass = () => {
    const colMap = {
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };
    return colMap[columns] || colMap[3];
  };

  // Render a single skill item
  const renderSkillItem = (skill, index) => {
    const level = skill.level || skill.proficiency;

    return (
      <div
        key={`skill-${index}`}
        className={`flex items-center ${compact ? "mb-1" : "mb-2"}`}
      >
        {/* Icon (if enabled) */}
        {showIcons && (
          <div
            className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
            style={{backgroundColor: mergedTheme.colors.primary}}
          />
        )}

        {/* Skill name */}
        <span
          className="flex-1"
          style={{
            color: mergedTheme.colors.text,
            fontSize: compact
              ? mergedTheme.typography.sizes.xs
              : mergedTheme.typography.sizes.small,
            fontFamily: mergedTheme.typography.bodyFont,
          }}
        >
          {skill.name || skill.skill}
        </span>

        {/* Level indicator */}
        {showLevel && level && getLevelIndicator(level)}
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

      {/* Grid layout */}
      <div className={`grid ${getGridClass()} gap-6`}>
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className={compact ? "space-y-2" : "space-y-3"}>
            {/* Category title */}
            <h3
              className="font-bold mb-3 pb-1 border-b"
              style={{
                color: mergedTheme.colors.primary,
                fontSize: mergedTheme.typography.sizes.base,
                fontFamily: mergedTheme.typography.bodyFont,
                borderColor: mergedTheme.colors.border,
              }}
            >
              {category}
            </h3>

            {/* Skills in category */}
            <div>
              {categorySkills.map((skill, index) =>
                renderSkillItem(skill, index)
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add empty columns for balanced layout */}
      <style jsx>{`
        @media print {
          .grid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default SkillsGrid;
