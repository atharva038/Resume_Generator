import MinimalDeveloperTheme from "./MinimalDeveloperTheme";
import ModernFresherTheme from "./ModernFresherTheme";
import ProfessionalCorporateTheme from "./ProfessionalCorporateTheme";

export const portfolioThemes = {
  minimalDeveloper: {
    id: "minimalDeveloper",
    name: "Minimal Developer",
    description: "Technical, project-first layout for software roles.",
    component: MinimalDeveloperTheme,
    allowedTiers: ["free", "one-time", "pro"],
  },
  modernFresher: {
    id: "modernFresher",
    name: "Modern Fresher",
    description: "Education, skills, and project-forward layout for freshers.",
    component: ModernFresherTheme,
    allowedTiers: ["free", "one-time", "pro"],
  },
  professionalCorporate: {
    id: "professionalCorporate",
    name: "Professional Corporate",
    description: "Experience-led layout for business and professional roles.",
    component: ProfessionalCorporateTheme,
    allowedTiers: ["one-time", "pro"],
  },
};

export const getPortfolioTheme = (themeId) => {
  return portfolioThemes[themeId] || portfolioThemes.minimalDeveloper;
};

export const portfolioThemeList = Object.values(portfolioThemes);
