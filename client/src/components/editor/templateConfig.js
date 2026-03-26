import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import ProfessionalV2Template from "@/components/templates/ProfessionalV2Template";
import Professional2Template from "@/components/templates/Professional2Template";
import TechTemplate from "@/components/templates/TechTemplate";
import Creative2Template from "@/components/templates/Creative2Template";
import StrategicLeadershipTemplate from "@/components/templates/StrategicLeadershipTemplate";
import ImpactProTemplate from "@/components/templates/ImpactProTemplate";
import GitHubStyleTemplate from "@/components/templates/GitHubStyleTemplate";
import StructuredPhotoTemplate from "@/components/templates/StructuredPhotoTemplate";

export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    component: ClassicTemplate,
    category: "Professional",
    emoji: "📋",
    atsScore: 95,
  },
  {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
    category: "Professional",
    emoji: "🎨",
    atsScore: 92,
  },
  {
    id: "minimal",
    name: "Minimal",
    component: MinimalTemplate,
    category: "Professional",
    emoji: "✨",
    atsScore: 98,
  },
  {
    id: "professional",
    name: "Professional",
    component: ProfessionalTemplate,
    category: "Professional",
    emoji: "💼",
    atsScore: 94,
  },
  {
    id: "professional-v2",
    name: "Professional V2",
    component: ProfessionalV2Template,
    category: "Professional",
    emoji: "📄",
    atsScore: 96,
  },
  {
    id: "professional2",
    name: "Professional Elite",
    component: Professional2Template,
    category: "Professional",
    emoji: "🏆",
    atsScore: 98,
  },
  {
    id: "tech",
    name: "Tech Developer",
    component: TechTemplate,
    category: "Tech",
    emoji: "💻",
    atsScore: 93,
  },
  {
    id: "GitHubStyle",
    name: "Metro Grid Narrative",
    component: GitHubStyleTemplate,
    category: "Professional",
    emoji: "🏙️",
    atsScore: 96,
  },
  {
    id: "creative2",
    name: "Creative Designer Pro",
    component: Creative2Template,
    category: "Creative",
    emoji: "🎨",
    atsScore: 94,
  },
  {
    id: "strategic-leader",
    name: "Strategic Leadership",
    component: StrategicLeadershipTemplate,
    category: "Leadership",
    emoji: "🎯",
    atsScore: 97,
  },
  {
    id: "impact-pro",
    name: "Impact Pro",
    component: ImpactProTemplate,
    category: "Professional",
    emoji: "⚡",
    atsScore: 98,
  },
  {
    id: "structured-photo",
    name: "Structured Photo Pro",
    component: StructuredPhotoTemplate,
    category: "Creative",
    emoji: "📸",
    atsScore: 95,
  },
];

export const TEMPLATE_COLOR_THEMES = {
  classic: [
    {id: "navy", name: "Navy Blue", primary: "#0066cc", emoji: "💼"},
    {id: "burgundy", name: "Burgundy", primary: "#8b1a1a", emoji: "🍷"},
    {id: "forest", name: "Forest Green", primary: "#1b5e20", emoji: "🌲"},
    {id: "charcoal", name: "Charcoal", primary: "#2d3748", emoji: "⚫"},
  ],
  modern: [
    {id: "blue", name: "Blue", primary: "#2563eb", emoji: "💙"},
    {id: "purple", name: "Purple", primary: "#7c3aed", emoji: "💜"},
    {id: "teal", name: "Teal", primary: "#0d9488", emoji: "🌊"},
    {id: "orange", name: "Orange", primary: "#ea580c", emoji: "🧡"},
  ],
  minimal: [
    {id: "charcoal", name: "Charcoal", primary: "#2d3748", emoji: "⚫"},
    {id: "navy", name: "Navy", primary: "#1e40af", emoji: "💼"},
    {id: "slate", name: "Slate", primary: "#475569", emoji: "🌑"},
    {id: "graphite", name: "Graphite", primary: "#18181b", emoji: "⬛"},
  ],
  professional: [
    {id: "navy", name: "Navy Blue", primary: "#1e3a8a", emoji: "💼"},
    {id: "burgundy", name: "Burgundy", primary: "#881337", emoji: "🍷"},
    {id: "forest", name: "Forest Green", primary: "#065f46", emoji: "🌲"},
    {id: "gray", name: "Gray", primary: "#374151", emoji: "⚪"},
  ],
  "professional-v2": [
    {id: "blue", name: "Blue", primary: "#1d4ed8", emoji: "💙"},
    {id: "purple", name: "Purple", primary: "#7e22ce", emoji: "💜"},
    {id: "teal", name: "Teal", primary: "#0f766e", emoji: "🌊"},
    {id: "burgundy", name: "Burgundy", primary: "#9f1239", emoji: "🍷"},
  ],
  executive: [
    {id: "navy", name: "Navy Blue", primary: "#1e40af", emoji: "💼"},
    {id: "burgundy", name: "Burgundy", primary: "#7f1d1d", emoji: "🍷"},
    {id: "charcoal", name: "Charcoal", primary: "#1f2937", emoji: "⚫"},
    {id: "forest", name: "Forest Green", primary: "#14532d", emoji: "🌲"},
  ],
  tech: [
    {id: "black", name: "Black", primary: "#0f172a", emoji: "⚫"},
    {id: "blue", name: "Tech Blue", primary: "#1e3a8a", emoji: "🤖"},
    {id: "purple", name: "Purple", primary: "#6d28d9", emoji: "🔮"},
    {id: "teal", name: "Teal", primary: "#0e7490", emoji: "🌊"},
  ],
  GitHubStyle: [
    {id: "metroNavy", name: "Metro Navy", primary: "#13315c", emoji: "🏙️"},
    {
      id: "metroTeal",
      name: "Metro Teal",
      primary: "#0f4c5c",
      emoji: "🌆",
    },
    {
      id: "metroBurgundy",
      name: "Metro Burgundy",
      primary: "#5e2129",
      emoji: "🏢",
    },
  ],
  creative2: [
    {id: "purple", name: "Purple", primary: "#8b5cf6", emoji: "💜"},
    {id: "coral", name: "Coral", primary: "#f97316", emoji: "🧡"},
    {id: "teal", name: "Teal", primary: "#14b8a6", emoji: "🌊"},
    {id: "rose", name: "Rose", primary: "#e11d48", emoji: "🌹"},
    {id: "indigo", name: "Indigo", primary: "#4f46e5", emoji: "🦄"},
    {id: "cyan", name: "Cyan", primary: "#0891b2", emoji: "💎"},
  ],
  "strategic-leader": [
    {id: "teal", name: "Teal", primary: "#0d7377", emoji: "🌊"},
    {id: "purple", name: "Purple", primary: "#6b46c1", emoji: "🔮"},
    {id: "burgundy", name: "Burgundy", primary: "#9b2c2c", emoji: "🍷"},
    {id: "navy", name: "Navy", primary: "#1e3a8a", emoji: "💼"},
  ],
  "impact-pro": [
    {id: "emerald", name: "Emerald", primary: "#047857", emoji: "💚"},
    {id: "blue", name: "Blue", primary: "#1e40af", emoji: "💙"},
    {id: "purple", name: "Purple", primary: "#7e22ce", emoji: "💜"},
    {id: "orange", name: "Orange", primary: "#c2410c", emoji: "🧡"},
  ],
  "structured-photo": [
    {id: "coral", name: "Coral", primary: "#e05c5c", emoji: "🟥"},
    {
      id: "terracotta",
      name: "Terracotta",
      primary: "#d9694f",
      emoji: "🟧",
    },
    {id: "rose", name: "Rose", primary: "#db5d74", emoji: "🌹"},
  ],
};
