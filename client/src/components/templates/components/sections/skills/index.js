/**
 * Skills Components Index
 * Export all skills section variants
 */

import SkillsBar from "./SkillsBar";
import SkillsPills from "./SkillsPills";
import SkillsGrid from "./SkillsGrid";
import SkillsCloud from "./SkillsCloud";

export {SkillsBar, SkillsPills, SkillsGrid, SkillsCloud};

// Skills registry for dynamic selection
export const skills = {
  bar: SkillsBar,
  pills: SkillsPills,
  grid: SkillsGrid,
  cloud: SkillsCloud,
};

// Get skills component by name
export const getSkillsComponent = (componentName) => {
  return skills[componentName] || skills.grid;
};

// Available skills components with metadata
export const availableSkillsComponents = [
  {
    id: "bar",
    name: "Progress Bars",
    description: "Animated progress bars with proficiency levels",
    bestFor: "Professional, Executive, Technical",
    features: [
      "Progress bars",
      "Percentage display",
      "Categories",
      "Animations",
    ],
  },
  {
    id: "pills",
    name: "Pills/Badges",
    description: "Compact badge-style layout",
    bestFor: "Creative, Modern, Minimal",
    features: [
      "Compact layout",
      "Color coding",
      "Hover effects",
      "Flexible wrapping",
    ],
  },
  {
    id: "grid",
    name: "Grid Layout",
    description: "Structured grid with categories",
    bestFor: "Professional, Tech, Executive",
    features: ["Grid layout", "Category grouping", "Level indicators", "Icons"],
  },
  {
    id: "cloud",
    name: "Word Cloud",
    description: "Visual word cloud with size variations",
    bestFor: "Creative, Modern, Portfolio",
    features: [
      "Size variations",
      "Color coding",
      "Visual emphasis",
      "Hover effects",
    ],
  },
];

export default {
  SkillsBar,
  SkillsPills,
  SkillsGrid,
  SkillsCloud,
  skills,
  getSkillsComponent,
  availableSkillsComponents,
};
