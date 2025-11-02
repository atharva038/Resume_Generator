/**
 * Experience Components Index
 * Export all experience section variants
 */

import ExperienceTimeline from "./ExperienceTimeline";
import ExperienceCards from "./ExperienceCards";
import ExperienceList from "./ExperienceList";

export {ExperienceTimeline, ExperienceCards, ExperienceList};

// Experience registry for dynamic selection
export const experiences = {
  timeline: ExperienceTimeline,
  cards: ExperienceCards,
  list: ExperienceList,
};

// Get experience component by name
export const getExperienceComponent = (componentName) => {
  return experiences[componentName] || experiences.list;
};

// Available experience components with metadata
export const availableExperienceComponents = [
  {
    id: "timeline",
    name: "Timeline",
    description: "Visual timeline with connecting lines",
    bestFor: "Modern, Tech, Creative templates",
    features: [
      "Timeline dots",
      "Connecting line",
      "Duration display",
      "Tech badges",
    ],
  },
  {
    id: "cards",
    name: "Cards",
    description: "Card-based layout with hover effects",
    bestFor: "Creative, Modern, Portfolio-style",
    features: ["Card design", "Hover effects", "Date badges", "Color accents"],
  },
  {
    id: "list",
    name: "List",
    description: "Traditional list format (ATS-friendly)",
    bestFor: "Professional, Executive, Conservative",
    features: [
      "Clean layout",
      "ATS-friendly",
      "Compact option",
      "Bullet points",
    ],
  },
];

export default {
  ExperienceTimeline,
  ExperienceCards,
  ExperienceList,
  experiences,
  getExperienceComponent,
  availableExperienceComponents,
};
