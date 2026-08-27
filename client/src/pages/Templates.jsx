import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/common/SEO";
import {
  TEMPLATES,
  TEMPLATE_COLOR_THEMES,
} from "@/components/editor/templateConfig";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import Professional2Template from "@/components/templates/Professional2Template";
import TechTemplate from "@/components/templates/TechTemplate";
import Creative2Template from "@/components/templates/Creative2Template";
import StrategicLeadershipTemplate from "@/components/templates/StrategicLeadershipTemplate";
import ImpactProTemplate from "@/components/templates/ImpactProTemplate";
import GitHubStyleTemplate from "@/components/templates/GitHubStyleTemplate";
import StructuredPhotoTemplate from "@/components/templates/StructuredPhotoTemplate";
import {
  TemplatesBanner,
  TemplateCard,
  TemplatePreviewModal,
} from "@/components/templatesGallery";

// Sample resume data for preview
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
        "Mentored junior developers and conducted technical interviews",
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
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022",
    },
  ],
  achievements: [
    "Employee of the Year 2022 - Recognized for exceptional performance and leadership",
    "Winner of National Hackathon 2021 (1st place out of 100 teams)",
  ],
};

const TEMPLATE_LIST = [
  {
    id: "classic",
    name: "Classic",
    component: ClassicTemplate,
    category: "Professional",
    atsScore: 95,
    description:
      "Traditional layout with clean structure, perfect for corporate and conservative industries",
    features: ["4 Color Themes", "Clean Header", "Traditional Structure"],
    colors: ["#0066cc", "#8b1a1a", "#1b5e20", "#2d3748"],
  },
  {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
    category: "Professional",
    atsScore: 92,
    description:
      "Contemporary design with modern aesthetics for forward-thinking companies",
    features: ["4 Color Themes", "Modern Typography", "Timeline Layout"],
    colors: ["#2563eb", "#7c3aed", "#0d9488", "#ea580c"],
  },
  {
    id: "minimal",
    name: "Minimal",
    component: MinimalTemplate,
    category: "Professional",
    atsScore: 98,
    description:
      "Minimalist approach focusing on content clarity and maximum readability",
    features: ["Highest ATS Score", "4 Color Themes", "Compact Layout"],
    colors: ["#2d3748", "#1e40af", "#475569", "#18181b"],
  },
  {
    id: "professional",
    name: "Professional",
    component: ProfessionalTemplate,
    category: "Professional",
    atsScore: 94,
    description:
      "Balanced professional design suitable for all industries and career levels",
    features: ["4 Color Themes", "Sidebar Layout", "Skills Highlight"],
    colors: ["#1e3a8a", "#881337", "#065f46", "#374151"],
  },
  {
    id: "professional-v2",
    name: "Professional Elite",
    component: Professional2Template,
    category: "Professional",
    atsScore: 98,
    description:
      "Elite layout with refined typography and ATS-optimized section hierarchy",
    features: ["Single Column", "Refined Typography", "Elite Hierarchy"],
    colors: ["#1d4ed8", "#7e22ce", "#0f766e", "#9f1239"],
  },
  {
    id: "tech",
    name: "Technical Pro",
    component: TechTemplate,
    category: "Tech",
    atsScore: 93,
    description:
      "Designed specifically for software engineers and IT professionals",
    features: ["Tech-Focused", "Project Highlights", "4 Color Themes"],
    colors: ["#0f172a", "#1e40af", "#7e22ce", "#0f766e"],
  },
  {
    id: "creative-v2",
    name: "Creative 2.0",
    component: Creative2Template,
    category: "Creative",
    atsScore: 94,
    description:
      "Vibrant modern creative template with dynamic layouts and ATS optimization",
    features: ["Dynamic Layout", "All Sections", "Visual Appeal"],
    colors: ["#8b5cf6", "#ec4899", "#ffffff"],
  },
  {
    id: "strategic-leader",
    name: "Strategic Leadership",
    component: StrategicLeadershipTemplate,
    category: "Leadership",
    atsScore: 97,
    description:
      "Leadership-focused layout emphasizing strategic impact and results",
    features: ["Impact-Driven", "Two-Column Layout", "Achievement Focus"],
    colors: ["#0d7377", "#6b46c1", "#9b2c2c", "#2c5282"],
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
    colors: ["#047857", "#1e40af", "#7e22ce", "#c2410c"],
  },
  {
    id: "github-style",
    name: "GitHub Style",
    component: GitHubStyleTemplate,
    category: "Tech",
    atsScore: 92,
    description:
      "Clean GitHub-style resume optimized for developers and tech professionals",
    features: ["GitHub Format", "Developer Friendly", "Clean Layout"],
    colors: ["#000000", "#1a237e", "#ff9933", "#1b5e20"],
  },
  {
    id: "structured-photo",
    name: "Structured Photo Pro",
    component: StructuredPhotoTemplate,
    category: "Professional",
    atsScore: 90,
    description:
      "A structured, elegant template with distinctive section layouts and modern typography.",
    features: ["Dual Column", "Elegant", "Modern Typography"],
    colors: ["#2f678e", "#e05c5c", "#ffffff"],
  },
];

const CATEGORIES = ["All", "Professional", "Leadership", "Tech", "Creative"];

export default function Templates() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePreviewTemplate, setActivePreviewTemplate] = useState(null);
  const [selectedColorTheme, setSelectedColorTheme] = useState(null);

  const filteredTemplates =
    selectedCategory === "All"
      ? TEMPLATE_LIST
      : TEMPLATE_LIST.filter((t) => t.category === selectedCategory);

  const handleOpenPreview = (template) => {
    setActivePreviewTemplate(template);
    const themes = TEMPLATE_COLOR_THEMES[template.id];
    if (themes && themes.length > 0) {
      setSelectedColorTheme(themes[0].id);
    } else {
      setSelectedColorTheme(null);
    }
  };

  const handleUseTemplate = (templateId) => {
    localStorage.setItem("selectedTemplate", templateId);
    if (selectedColorTheme) {
      localStorage.setItem("selectedColorTheme", selectedColorTheme);
    }
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 transition-colors duration-200">
      <SEO
        title="Professional Resume Templates - ATS-Optimized Designs | SmartNShine"
        description="Choose from 11+ professional, ATS-optimized resume templates. Modern, classic, creative, and technical designs to match your career goals."
        keywords="resume templates, professional resume, ATS templates, CV templates, modern resume design, resume layout, professional CV"
        url="https://www.smartnshine.app/templates"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Hero Banner with Filter */}
        <TemplatesBanner
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          totalTemplates={TEMPLATE_LIST.length}
        />

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              sampleResumeData={sampleResumeData}
              onOpenPreview={handleOpenPreview}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Interactive Preview Modal */}
      <TemplatePreviewModal
        template={activePreviewTemplate}
        sampleResumeData={sampleResumeData}
        selectedColorTheme={selectedColorTheme}
        setSelectedColorTheme={setSelectedColorTheme}
        colorThemes={
          activePreviewTemplate
            ? TEMPLATE_COLOR_THEMES[activePreviewTemplate.id] || []
            : []
        }
        onClose={() => setActivePreviewTemplate(null)}
        onApply={handleUseTemplate}
      />
    </div>
  );
}
