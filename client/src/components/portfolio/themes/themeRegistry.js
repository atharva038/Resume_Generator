import MinimalDeveloperTheme from "./MinimalDeveloperTheme";
import ModernFresherTheme from "./ModernFresherTheme";
import ProfessionalCorporateTheme from "./ProfessionalCorporateTheme";
import CyberDevTheme from "./CyberDevTheme";
import CreativeTheme from "./CreativeTheme";
import TechPortfolioTheme from "./TechPortfolioTheme";
import GlassmorphismTheme from "./GlassmorphismTheme";
import SmartNShineTheme from "./SmartNShineTheme";

export const portfolioThemes = {
  smartnshine: {
    id: "smartnshine",
    name: "SmartNShine Editorial",
    category: "Editorial",
    badge: "Signature",
    subtitle: "Quiet luxury × Editorial typography × Modern minimalist product design.",
    description: "High-fashion editorial aesthetic featuring bold serif headlines, refined spacing, and split-screen hero layout.",
    tags: ["Editorial", "Quiet Luxury", "Split Hero", "Modern"],
    component: SmartNShineTheme,
    allowedTiers: ["free", "one-time", "pro"],
    accentPresets: ["#b8943f", "#c9a853", "#10b981", "#3b82f6", "#f43f5e"],
  },
  glassmorphism: {
    id: "glassmorphism",
    name: "Aura Glass",
    category: "Glassmorphism",
    badge: "Popular",
    subtitle: "Ultra-sleek frosted glassmorphism with ambient glowing aurora.",
    description: "Translucent frosted glass cards, dynamic floating gradients, and glowing iridescent highlights.",
    tags: ["Glassmorphism", "Aurora Glow", "Dark & Light", "Modern"],
    component: GlassmorphismTheme,
    allowedTiers: ["free", "one-time", "pro"],
    accentPresets: ["#06b6d4", "#8b5cf6", "#10b981", "#f43f5e", "#3b82f6", "#f59e0b"],
  },
  techPortfolio: {
    id: "techPortfolio",
    name: "Tech Portfolio",
    category: "Developer",
    badge: "Tech Clean",
    subtitle: "Futuristic glassmorphism & code-first layout for developers.",
    description: "Structured architecture, interactive tech stack cards, and prominent live project showcases.",
    tags: ["Full Stack", "Developer", "Interactive", "Clean"],
    component: TechPortfolioTheme,
    allowedTiers: ["free", "one-time", "pro"],
    accentPresets: ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"],
  },
  minimalDeveloper: {
    id: "minimalDeveloper",
    name: "Minimal Developer",
    category: "Developer",
    badge: "Minimalist",
    subtitle: "High-signal technical layout for software engineers.",
    description: "Ultra clean monospace accents, zero fluff, instant access to GitHub repositories and live deployments.",
    tags: ["Minimalist", "Software Engineer", "High Signal"],
    component: MinimalDeveloperTheme,
    allowedTiers: ["free", "one-time", "pro"],
    accentPresets: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
  },
  modernFresher: {
    id: "modernFresher",
    name: "Modern Fresher",
    category: "Fresher",
    badge: "Fresher Pick",
    subtitle: "Education, skills, and project-forward layout for early career roles.",
    description: "Vibrant visual hierarchy showcasing university achievements, coursework, and personal projects.",
    tags: ["Early Career", "Graduate", "Projects", "Vibrant"],
    component: ModernFresherTheme,
    allowedTiers: ["free", "one-time", "pro"],
    accentPresets: ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#ec4899"],
  },
  professionalCorporate: {
    id: "professionalCorporate",
    name: "Professional Corporate",
    category: "Corporate",
    badge: "Executive",
    subtitle: "Experience-led layout for business leaders, PMs, and executives.",
    description: "Sophisticated corporate styling emphasizing career trajectory, quantifiable metrics, and leadership impact.",
    tags: ["Executive", "Product Manager", "Leadership", "Business"],
    component: ProfessionalCorporateTheme,
    allowedTiers: ["one-time", "pro"],
    accentPresets: ["#1c1917", "#1e3a5f", "#374151", "#4a5568", "#2d3748"],
  },
  cyberDev: {
    id: "cyberDev",
    name: "Cyber Dev",
    category: "Developer",
    badge: "Cyberpunk",
    subtitle: "Neon dark-mode terminal & hacker aesthetic.",
    description: "High-contrast glowing neon borders, terminal command prompts, and high-energy developer aesthetics.",
    tags: ["Cyberpunk", "Dark Mode", "Terminal", "Neon"],
    component: CyberDevTheme,
    allowedTiers: ["one-time", "pro"],
    accentPresets: ["#00ff88", "#00d4ff", "#ff006e", "#ffbe0b", "#fb5607"],
  },
  creative: {
    id: "creative",
    name: "Creative Canvas",
    category: "Creative",
    badge: "Design",
    subtitle: "Expressive layout with bold typography & vibrant accents for designers.",
    description: "Asymmetric grid, rich media showcases, and artistic styling for UI/UX designers and artists.",
    tags: ["Design", "UI/UX", "Artistic", "Bold"],
    component: CreativeTheme,
    allowedTiers: ["one-time", "pro"],
    accentPresets: ["#7c3aed", "#db2777", "#ea580c", "#0284c7", "#059669"],
  },
};

export const getPortfolioTheme = (themeId) => {
  return portfolioThemes[themeId] || portfolioThemes.glassmorphism || portfolioThemes.minimalDeveloper;
};

export const portfolioThemeList = Object.values(portfolioThemes);

