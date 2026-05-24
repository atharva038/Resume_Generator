import MinimalDeveloperTheme from "./MinimalDeveloperTheme";
import ModernFresherTheme from "./ModernFresherTheme";
import ProfessionalCorporateTheme from "./ProfessionalCorporateTheme";
import CyberDevTheme from "./CyberDevTheme";
import CreativeTheme from "./CreativeTheme";

export const portfolioThemes = {
  minimalDeveloper: {
    id: "minimalDeveloper",
    name: "Minimal Developer",
    description: "Technical, project-first layout for software roles.",
    component: MinimalDeveloperTheme,
    allowedTiers: ["free", "one-time", "pro"],
    accentPresets: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
  },
  modernFresher: {
    id: "modernFresher",
    name: "Modern Fresher",
    description: "Education, skills, and project-forward layout for freshers.",
    component: ModernFresherTheme,
    allowedTiers: ["free", "one-time", "pro"],
    accentPresets: ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#ec4899"],
  },
  professionalCorporate: {
    id: "professionalCorporate",
    name: "Professional Corporate",
    description: "Experience-led layout for business and professional roles.",
    component: ProfessionalCorporateTheme,
    allowedTiers: ["one-time", "pro"],
    accentPresets: ["#1c1917", "#1e3a5f", "#374151", "#4a5568", "#2d3748"],
  },
  cyberDev: {
    id: "cyberDev",
    name: "Cyber Dev",
    description: "Neon dark-mode hacker aesthetic for developers.",
    component: CyberDevTheme,
    allowedTiers: ["one-time", "pro"],
    accentPresets: ["#00ff88", "#00d4ff", "#ff006e", "#ffbe0b", "#fb5607"],
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Bold gradients and expressive layout for designers and creatives.",
    component: CreativeTheme,
    allowedTiers: ["one-time", "pro"],
    accentPresets: ["#7c3aed", "#db2777", "#ea580c", "#0284c7", "#059669"],
  },
};

export const getPortfolioTheme = (themeId) => {
  return portfolioThemes[themeId] || portfolioThemes.minimalDeveloper;
};

export const portfolioThemeList = Object.values(portfolioThemes);
