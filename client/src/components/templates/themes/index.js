/**
 * Theme Registry
 * Export all available themes for resume templates
 */

import professionalTheme from "./professional";
import creativeTheme from "./creative";
import minimalTheme from "./minimal";
import techTheme from "./tech";
import executiveTheme from "./executive";

export {
  professionalTheme,
  creativeTheme,
  minimalTheme,
  techTheme,
  executiveTheme,
};

// Theme selector helper
export const getTheme = (themeName) => {
  const themes = {
    professional: professionalTheme,
    creative: creativeTheme,
    minimal: minimalTheme,
    tech: techTheme,
    executive: executiveTheme,
  };

  return themes[themeName] || themes.professional;
};

// List all available themes
export const availableThemes = [
  {
    id: "professional",
    name: "Professional",
    description: "Corporate & Traditional Roles",
  },
  {id: "creative", name: "Creative", description: "Design, Marketing, Media"},
  {id: "minimal", name: "Minimal", description: "Modern Startups, Tech"},
  {id: "tech", name: "Tech", description: "Software Engineering, IT"},
  {
    id: "executive",
    name: "Executive",
    description: "Senior Leadership, C-Suite",
  },
];
