/**
 * Resume Templates Index
 * Export all complete resume templates
 */

import CorporateProfessional from "./CorporateProfessional";
import ModernTech from "./ModernTech";
import CreativePortfolio from "./CreativePortfolio";

export {CorporateProfessional, ModernTech, CreativePortfolio};

// Template registry
export const templates = {
  corporateProfessional: CorporateProfessional,
  modernTech: ModernTech,
  creativePortfolio: CreativePortfolio,
};

// Get template by name
export const getTemplate = (templateName) => {
  return templates[templateName] || templates.corporateProfessional;
};

// Available templates with metadata
export const availableTemplates = [
  {
    id: "corporateProfessional",
    name: "Corporate Professional",
    description: "Clean, ATS-friendly template for corporate roles",
    theme: "professional",
    layout: "singleColumn",
    header: "classic",
    experience: "list",
    skills: "grid",
    bestFor: ["Finance", "Consulting", "Legal", "Executive", "Management"],
    features: [
      "ATS-optimized",
      "Traditional layout",
      "Print-friendly",
      "Professional styling",
    ],
    atsScore: 95,
  },
  {
    id: "modernTech",
    name: "Modern Tech",
    description: "Modern, visually appealing template for tech professionals",
    theme: "tech",
    layout: "twoColumn",
    header: "modern",
    experience: "timeline",
    skills: "bar",
    bestFor: ["Software Engineering", "Development", "IT", "Tech Startups"],
    features: [
      "Visual timeline",
      "Skill bars",
      "Two-column layout",
      "Modern design",
    ],
    atsScore: 85,
  },
  {
    id: "creativePortfolio",
    name: "Creative Portfolio",
    description: "Visually striking template for creative professionals",
    theme: "creative",
    layout: "sidebarLeft",
    header: "centered",
    experience: "cards",
    skills: "cloud",
    bestFor: ["Design", "Marketing", "Creative", "Arts", "Media"],
    features: [
      "Colored sidebar",
      "Card layout",
      "Photo support",
      "Eye-catching design",
    ],
    atsScore: 75,
  },
];

// Get template recommendations based on job role
export const getRecommendedTemplate = (jobRole = "") => {
  const role = jobRole.toLowerCase();

  // Tech roles
  if (
    role.includes("developer") ||
    role.includes("engineer") ||
    role.includes("programmer")
  ) {
    return "modernTech";
  }

  // Creative roles
  if (
    role.includes("design") ||
    role.includes("creative") ||
    role.includes("artist") ||
    role.includes("marketing")
  ) {
    return "creativePortfolio";
  }

  // Default to corporate professional
  return "corporateProfessional";
};

export default {
  CorporateProfessional,
  ModernTech,
  CreativePortfolio,
  templates,
  getTemplate,
  availableTemplates,
  getRecommendedTemplate,
};
