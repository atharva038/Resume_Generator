import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Sparkles,
  Palette,
  Zap,
  CheckCircle,
  Layout,
  Eye,
  ArrowRight,
  X,
  Filter,
} from "lucide-react";
<<<<<<< HEAD
import ClassicTemplate from "../components/templates/ClassicTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import ExecutiveTemplate from "../components/templates/ExecutiveTemplate";
import TechTemplate from "../components/templates/TechTemplate";
import CreativeTemplate from "../components/templates/CreativeTemplate";
import AcademicTemplate from "../components/templates/AcademicTemplate";
import CorporateEliteTemplate from "../components/templates/CorporateEliteTemplate";
import StrategicLeaderTemplate from "../components/templates/StrategicLeaderTemplate";
import ImpactProTemplate from "../components/templates/ImpactProTemplate";
import GitHubStyleTemplate from "../components/templates/GitHubStyleTemplate";
import DataAnalystTemplate from "../components/templates/DataAnalystTemplate";
import SocialMediaTemplate from "../components/templates/Social-MediaTemplate";
import MarketingDirectorTemplate from "../components/templates/MarketingDirectorTemplate"; 
import SoftwareEngineeringLeadTemplate from "../components/templates/SoftwareEngineeringLeadTemplate";
=======
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import Professional2Template from "@/components/templates/Professional2Template";
import TechTemplate from "@/components/templates/TechTemplate";
import Creative2Template from "@/components/templates/Creative2Template";
import AcademicTemplate from "@/components/templates/AcademicTemplate";
import CorporateEliteTemplate from "@/components/templates/CorporateEliteTemplate";
import StrategicLeaderTemplate from "@/components/templates/StrategicLeaderTemplate";
import ImpactProTemplate from "@/components/templates/ImpactProTemplate";
import GitHubStyleTemplate from "@/components/templates/GitHubStyleTemplate";
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c

// Sample resume data for preview - matches template structure
const sampleResumeData = {
  name: "John Doe",
  contact: {
    email: "john.doe@email.com",
    phone: "+1 (234) 567-8900",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
  summary:
    "Experienced professional with 5+ years in the field, dedicated to excellence and innovation. Proven track record of delivering high-quality solutions and leading successful teams.",
  skills: [
    {
      category: "Technical Skills",
      items: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    },
    {
      category: "Soft Skills",
      items: [
        "Leadership",
        "Communication",
        "Problem Solving",
        "Team Collaboration",
      ],
    },
  ],
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "Jan 2020",
      endDate: "Present",
      bullets: [
        "Led team of 5 developers in building scalable web applications serving 100K+ users",
        "Improved system performance by 40% through code optimization and architecture redesign",
        "Mentored  developers and conducted technical interviews",
      ],
    },
    {
      position: "Software Engineer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "Jun 2018",
      endDate: "Dec 2019",
      bullets: [
        "Developed RESTful APIs and microservices using Node.js and Express",
        "Collaborated with cross-functional teams to deliver features on time",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of California",
      location: "Berkeley, CA",
      graduationDate: "2018",
      gpa: "3.8/4.0",
      bullets: ["Dean's List", "CS Club President"],
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description:
        "Built a full-stack e-commerce solution with payment integration",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      date: "2023",
      url: "https://github.com/johndoe/ecommerce",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2022",
    },
    { name: "React Professional Certification", issuer: "Meta", date: "2023" },
  ],
  achievements: [
    "Employee of the Year 2022 - Tech Corp",
    "Published 3 technical articles with 10K+ views",
    "Speaker at React Conference 2023",
  ],
};

const templates = [
  {
    id: "classic",
    name: "Classic",
    component: ClassicTemplate,
    category: "Professional",
    atsScore: 95,
    description:
      "Traditional layout with clean structure, perfect for corporate roles",
    features: ["ATS-Optimized", "Clean Design", "Easy to Read"],
    colors: ["#000000", "#ffffff"],
  },
  {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
    category: "Professional",
    atsScore: 92,
    description:
      "Contemporary design with modern aesthetics for forward-thinking companies",
    features: ["Modern Layout", "Professional", "Eye-catching"],
    colors: ["#2563eb", "#ffffff"],
  },
  {
    id: "minimal",
    name: "Minimal",
    component: MinimalTemplate,
    category: "Professional",
    atsScore: 98,
    description:
      "Minimalist approach focusing on content clarity and readability",
    features: ["Ultra-Clean", "Maximum ATS", "Simple"],
    colors: ["#1f2937", "#ffffff"],
  },
  {
    id: "professional",
    name: "Professional",
    component: ProfessionalTemplate,
    category: "Professional",
    atsScore: 94,
    description: "Balanced professional design suitable for all industries",
    features: ["Versatile", "Professional", "Balanced"],
    colors: ["#059669", "#ffffff"],
  },
  {
    id: "professional2",
    name: "Professional Elite",
    component: Professional2Template,
    category: "Professional",
    atsScore: 98,
    description:
      "Premium ATS-optimized template with dynamic content density and all sections included",
    features: [
      "Highest ATS Score",
      "All Sections",
      "Dynamic Layout",
      "6 Color Themes",
    ],
    colors: ["#1e3a8a", "#ffffff"],
  },
  {
    id: "tech",
    name: "Tech Developer",
    component: TechTemplate,
    category: "Tech",
    atsScore: 93,
    description:
      "Developer-focused design with code aesthetics and tech-friendly layout",
    features: ["Tech-Focused", "Projects First", "Modern Code Style"],
    colors: ["#0ea5e9", "#0f172a"],
  },
  {
    id: "GitHubStyle",
    name: "GitHub Style",
    component: GitHubStyleTemplate,
    category: "Tech",
    atsScore: 93,
    description:
      "GitHub-inspired template with clean code aesthetics and developer-friendly layout",
    features: ["GitHub Theme", "Developer Focus", "Clean Design"],
    colors: ["#0ea5e9", "#0f172a"],
  },
  {
    id: "creative2",
    name: "Creative Designer Pro",
    component: Creative2Template,
    category: "Creative",
    atsScore: 94,
    description:
      "Vibrant modern creative template with dynamic layouts and ATS optimization",
    features: [
      "6 Color Themes",
      "Dynamic Layout",
      "All Sections",
      "Visual Appeal",
    ],
    colors: ["#8b5cf6", "#ec4899", "#ffffff"],
  },
  {
    id: "academic",
    name: "Academic Research",
    component: AcademicTemplate,
    category: "Academic",
    atsScore: 97,
    description:
      "Scholarly CV format for academics, researchers, and PhD candidates",
    features: ["Publication-Ready", "Research-Focused", "Extended Format"],
    colors: ["#1a202c", "#ffffff"],
  },
  {
    id: "corporate-elite",
    name: "Corporate Elite",
    component: CorporateEliteTemplate,
    category: "Professional",
    atsScore: 99,
    description:
      "Ultra-professional Fortune 500 template with sophisticated navy accents",
    features: ["Fortune 500 Ready", "Maximum ATS", "Executive Polish"],
    colors: ["#1e3a5f", "#ffffff"],
  },
  {
    id: "strategic-leader",
    name: "Strategic Leader",
    component: StrategicLeaderTemplate,
    category: "Leadership",
    atsScore: 97,
    description:
      "Leadership-focused layout emphasizing strategic impact and results",
    features: ["Impact-Driven", "Two-Column Layout", "Achievement Focus"],
    colors: ["#0d7377", "#f7fafc"],
  },
  {
    id: "impact-pro",
    name: "Impact Pro",
    component: ImpactProTemplate,
    category: "Professional",
    atsScore: 98,
    description:
      "Bold results-driven template highlighting quantifiable achievements",
    features: ["Metrics-First", "Bold Design", "Results-Focused"],
    colors: ["#047857", "#ffffff"],
  },
  {
    id: "github-style",
    name: "GitHub Style",
    component: GitHubStyleTemplate,
    category: "Tech",
    atsScore: 92,
    description:
      "Clean GitHub-style resume optimized for developers and tech professionals",
    features: [
      "GitHub Format",
      "Developer Friendly",
      "Publication Support",
      "Clean Layout",
    ],
    colors: ["#24292e", "#ffffff"],
  },
<<<<<<< HEAD
  {
  id: "data-analyst",
  name: "Data Analyst",
  component: DataAnalystTemplate,
  category: "Professional",
  atsScore: 96,
  description: "Quantitative results-driven template optimized for data professionals",
  features: ["Metrics-Focused", "Results-Driven", "Table Layout", "Clean Structure"],
  colors: ["#1a73e8", "#ffffff"],
},
{
  id: "social-media",
  name: "Social Media",
  component: SocialMediaTemplate,
  category: "Creative",
  atsScore: 85,
  description: "Modern, visually distinct template optimized for social media and marketing professionals",
  features: ["Project Highlights", "Visual Hierarchy", "Results-Focused", "Professional Layout"],
  colors: ["#2c3e50", "#3498db", "#ffffff"],
},
{
  id: "marketing-director",
  name: "Marketing Director",
  component: MarketingDirectorTemplate,
  category: "Creative",
  atsScore: 88,
  description: "Bold, all-caps header template for marketing leadership positions",
  features: ["All-Caps Header", "Multi-Column Skills", "Compact Layout", "Leadership Focus"],
  colors: ["#000000", "#ffffff"],
},
{
  id: "software-engineering-lead",
  name: "Software Engineering Lead",
  component: SoftwareEngineeringLeadTemplate,
  category: "Professional",
  atsScore: 90,
  description: "Technical leadership template with thick section dividers and skill categories",
  features: ["Technical Leadership", "Thick Dividers", "Skill Categories", "Engineering Focus"],
  colors: ["#000000", "#ffffff"],
}
=======
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
];

// Color theme configurations (same as Editor.jsx)
const TEMPLATE_COLOR_THEMES = {
  classic: [
    { id: "navy", name: "Navy Blue", primary: "#0066cc" },
    { id: "burgundy", name: "Burgundy", primary: "#8b1a1a" },
    { id: "forest", name: "Forest Green", primary: "#1b5e20" },
    { id: "charcoal", name: "Charcoal", primary: "#2d3748" },
  ],
  modern: [
    { id: "blue", name: "Blue", primary: "#2563eb" },
    { id: "purple", name: "Purple", primary: "#7c3aed" },
    { id: "teal", name: "Teal", primary: "#0d9488" },
    { id: "orange", name: "Orange", primary: "#ea580c" },
  ],
  minimal: [
    { id: "charcoal", name: "Charcoal", primary: "#2d3748" },
    { id: "navy", name: "Navy", primary: "#1e40af" },
    { id: "slate", name: "Slate", primary: "#475569" },
    { id: "graphite", name: "Graphite", primary: "#18181b" },
  ],
  professional: [
    { id: "navy", name: "Navy Blue", primary: "#1e3a8a" },
    { id: "burgundy", name: "Burgundy", primary: "#881337" },
    { id: "forest", name: "Forest Green", primary: "#065f46" },
    { id: "gray", name: "Gray", primary: "#374151" },
  ],
  "professional-v2": [
    { id: "blue", name: "Blue", primary: "#1d4ed8" },
    { id: "purple", name: "Purple", primary: "#7e22ce" },
    { id: "teal", name: "Teal", primary: "#0f766e" },
    { id: "burgundy", name: "Burgundy", primary: "#9f1239" },
  ],
  "corporate-elite": [
    { id: "navy", name: "Navy Blue", primary: "#1e3a5f" },
    { id: "burgundy", name: "Burgundy", primary: "#7c2d41" },
    { id: "forest", name: "Forest Green", primary: "#1e5f4d" },
    { id: "charcoal", name: "Charcoal", primary: "#2d3748" },
  ],
  "strategic-leader": [
    { id: "teal", name: "Teal", primary: "#0d7377" },
    { id: "purple", name: "Purple", primary: "#6b46c1" },
    { id: "burgundy", name: "Burgundy", primary: "#9b2c2c" },
    { id: "navy", name: "Navy Blue", primary: "#2c5282" },
  ],
  "impact-pro": [
    { id: "emerald", name: "Emerald", primary: "#047857" },
    { id: "blue", name: "Blue", primary: "#1e40af" },
    { id: "purple", name: "Purple", primary: "#7e22ce" },
    { id: "orange", name: "Orange", primary: "#c2410c" },
  ],
  tech: [
    { id: "black", name: "Tech Black", primary: "#0f172a" },
    { id: "blue", name: "Solid Blue", primary: "#1e40af" },
    { id: "purple", name: "Solid Purple", primary: "#7e22ce" },
    { id: "teal", name: "Solid Teal", primary: "#0f766e" },
  ],
  "github-style": [
<<<<<<< HEAD
  { id: "classic", name: "Classic Black", primary: "#000000" },
  { id: "indigo", name: "Deep Indigo", primary: "#1a237e" },
  { id: "saffron", name: "Saffron", primary: "#ff9933" },
  { id: "forest", name: "Forest Green", primary: "#1b5e20" },
  { id: "maroon", name: "Maroon", primary: "#880e4f" },
  { id: "navy", name: "Navy Blue", primary: "#003366" },
],

"data-analyst": [
  { id: "blue", name: "Professional Blue", primary: "#1a73e8" },
  { id: "teal", name: "Analytical Teal", primary: "#00796b" },
  { id: "indigo", name: "Data Indigo", primary: "#303f9f" },
  { id: "gray", name: "Analyst Gray", primary: "#37474f" },
],

=======
    {id: "classic", name: "Classic Black", primary: "#000000"},
    {id: "indigo", name: "Deep Indigo", primary: "#1a237e"},
    {id: "saffron", name: "Saffron", primary: "#ff9933"},
    {id: "forest", name: "Forest Green", primary: "#1b5e20"},
    {id: "maroon", name: "Maroon", primary: "#880e4f"},
    {id: "navy", name: "Navy Blue", primary: "#003366"},
  ],
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
};

const Templates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedColorTheme, setSelectedColorTheme] = useState(null);

  const categories = [
    "All",
    "Professional",
    "Leadership",
    "Tech",
    "Creative",
    "Academic",
  ];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleSelectTemplate = (templateId) => {
    // Store selected template and color theme in localStorage
    localStorage.setItem("selectedTemplate", templateId);
    if (selectedColorTheme) {
      localStorage.setItem("selectedColorTheme", selectedColorTheme);
    }
    // Navigate to editor
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-900 rounded-full mb-4 border border-gray-200 dark:border-zinc-800">
            <Layout className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
<<<<<<< HEAD
             16 Professional Templates
=======
              11 Professional Templates
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Choose Your Resume Template
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select from professionally designed templates, each optimized for
            ATS systems and tailored to different career paths
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-10 flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 mr-2">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filter:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-zinc-900 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:shadow-md border border-gray-200 dark:border-zinc-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200 overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedTemplate(template);
                // Set default color theme for this template
                const themes = TEMPLATE_COLOR_THEMES[template.id];
                if (themes && themes.length > 0) {
                  setSelectedColorTheme(themes[0].id);
                } else {
                  setSelectedColorTheme(null);
                }
              }}
            >
              {/* Template Preview */}
              <div
                className="relative bg-gray-50 dark:bg-zinc-900 overflow-hidden"
<<<<<<< HEAD
                style={{ height: "420px" }}
=======
                style={{height: "420px"}}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{
                    width: "210mm",
                    height: "297mm",
                    transform: "translateX(-50%) scale(0.35)",
                    transformOrigin: "top center",
                  }}
                >
                  <template.component resumeData={sampleResumeData} />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                {/* Overlay Preview Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                </div>

                {/* ATS Score Badge */}
                <div className="absolute top-3 right-3 bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      ATS
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        template.atsScore >= 95
                          ? "text-green-500"
                          : template.atsScore >= 90
                            ? "text-blue-500"
                            : "text-orange-500"
                      }`}
                    >
                      {template.atsScore}%
                    </span>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg">
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-medium border border-gray-200 dark:border-zinc-800"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Color Palette */}
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div className="flex gap-2">
                    {template.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Use Template
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTemplate(null)}
          >
            <div
              className="bg-white dark:bg-zinc-950 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-white dark:bg-zinc-950 p-6 flex justify-between items-center border-b border-gray-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {selectedTemplate.name} Template
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedTemplate.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 p-2 rounded-lg transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Color Theme Selector - Show if template supports color themes */}
              {TEMPLATE_COLOR_THEMES[selectedTemplate.id] && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      🎨 Color Theme:
                    </span>
                    {TEMPLATE_COLOR_THEMES[selectedTemplate.id].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedColorTheme(theme.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          selectedColorTheme === theme.id
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                            : "bg-white dark:bg-zinc-950 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800"
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-zinc-700"
<<<<<<< HEAD
                          style={{ backgroundColor: theme.primary }}
=======
                          style={{backgroundColor: theme.primary}}
>>>>>>> a85e817e4d9eaea89f7e0b07440cb935ef505c6c
                        />
                        <span className="text-sm font-medium">
                          {theme.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Body - Template Preview */}
              <div className="overflow-auto max-h-[60vh] p-6 bg-gray-50 dark:bg-zinc-900">
                <div
                  className="scale-75 origin-top mx-auto"
                  style={{ width: "210mm" }}
                >
                  <selectedTemplate.component
                    resumeData={{
                      ...sampleResumeData,
                      colorTheme: selectedColorTheme,
                    }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
                    <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      ATS Score:
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        selectedTemplate.atsScore >= 95
                          ? "text-green-500"
                          : selectedTemplate.atsScore >= 90
                            ? "text-blue-500"
                            : "text-orange-500"
                      }`}
                    >
                      {selectedTemplate.atsScore}%
                    </span>
                  </div>
                  <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg">
                    {selectedTemplate.category}
                  </span>
                </div>
                <button
                  onClick={() => handleSelectTemplate(selectedTemplate.id)}
                  className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Use This Template
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white dark:bg-zinc-950 rounded-xl p-8 sm:p-12 border border-gray-200 dark:border-zinc-800">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center text-gray-900 dark:text-white">
            Why Our Templates Stand Out
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Professionally crafted templates designed to help you land your
            dream job
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ATS-Optimized
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All templates score 85%+ on ATS systems, ensuring your resume
                gets past automated screening
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Diverse Designs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                From corporate executive to creative designer, find the perfect
                match for your career path
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Instant Switching
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try different templates with one click - your content stays,
                only the design changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
