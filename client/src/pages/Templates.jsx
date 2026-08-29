import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SEO from "@/components/common/SEO";
import TemplateSchema from "@/components/common/TemplateSchema";
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
import { resumeAPI } from "@/api/api";
import {
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Zap,
  FileCheck,
  Award,
} from "lucide-react";

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
};

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  "professional-2": Professional2Template,
  tech: TechTemplate,
  "creative-2": Creative2Template,
  "strategic-leader": StrategicLeadershipTemplate,
  "impact-pro": ImpactProTemplate,
  "github-style": GitHubStyleTemplate,
  "structured-photo": StructuredPhotoTemplate,
};

const BASE_TEMPLATE_LIST = [
  {
    id: "classic",
    name: "Classic",
    component: ClassicTemplate,
    category: "Professional",
    atsScore: 98,
    description:
      "Traditional serif design with clear hierarchy and timeless appeal",
    features: ["Serif Typography", "Traditional", "Maximum Compatibility"],
    colors: ["#2d3748", "#1a365d", "#742a2a", "#1c4532"],
  },
  {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
    category: "Modern",
    atsScore: 95,
    description:
      "Contemporary two-column layout with left sidebar and high visual appeal",
    features: ["Two Column", "Sidebar Layout", "Visual Appeal"],
    colors: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"],
  },
  {
    id: "minimal",
    name: "Minimal",
    component: MinimalTemplate,
    category: "Minimal",
    atsScore: 99,
    description:
      "Ultra-clean black & white design with generous whitespace and modern typography",
    features: ["Single Column", "Generous Spacing", "99% ATS Friendly"],
    colors: ["#18181b", "#3f3f46", "#0284c7"],
  },
  {
    id: "professional",
    name: "Professional Elite",
    component: ProfessionalTemplate,
    category: "Professional",
    atsScore: 97,
    description:
      "Balanced and structured layout ideal for corporate and enterprise roles",
    features: ["Corporate Standard", "Clean Sections", "Balanced Spacing"],
    colors: ["#0284c7", "#0d9488", "#4f46e5", "#be185d"],
  },
  {
    id: "professional-2",
    name: "Executive Minimalist",
    component: Professional2Template,
    category: "Professional",
    atsScore: 96,
    description:
      "Clean single-column executive design focusing on career milestones and leadership",
    features: ["Executive Format", "Single Column", "Timeline Highlights"],
    colors: ["#1e293b", "#0f766e", "#1d4ed8", "#991b1b"],
  },
  {
    id: "tech",
    name: "Developer Tech",
    component: TechTemplate,
    category: "Tech",
    atsScore: 95,
    description:
      "Terminal-inspired modern format emphasizing tech stacks, tools, and GitHub repos",
    features: ["Tech Stack Focus", "Developer Style", "Skills Grid"],
    colors: ["#10b981", "#06b6d4", "#6366f1", "#ec4899"],
  },
  {
    id: "creative-2",
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

const CATEGORIES = ["All", "Professional", "Leadership", "Tech", "Creative", "Modern", "Minimal"];

export default function Templates() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const templateParam = searchParams.get("template");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activePreviewTemplate, setActivePreviewTemplate] = useState(null);
  const [selectedColorTheme, setSelectedColorTheme] = useState(null);
  const [templatesList, setTemplatesList] = useState(BASE_TEMPLATE_LIST);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Sync category param
  useEffect(() => {
    if (categoryParam) {
      const matched = CATEGORIES.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matched) setSelectedCategory(matched);
    }
  }, [categoryParam]);

  // Fetch dynamic templates & SEO from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await resumeAPI.getPublicTemplates();
        const serverTemplates = res.data?.data || [];
        if (serverTemplates.length > 0) {
          // Merge server configs (SEO, badges, atsScore, names) with client components
          const merged = serverTemplates.map((st) => {
            const clientBase =
              BASE_TEMPLATE_LIST.find(
                (b) =>
                  b.id === st.templateId ||
                  b.name.toLowerCase() === st.name.toLowerCase()
              ) || BASE_TEMPLATE_LIST[0];

            return {
              ...clientBase,
              id: st.templateId || clientBase.id,
              name: st.name || clientBase.name,
              category: st.category || clientBase.category,
              emoji: st.emoji || "📄",
              atsScore: st.atsScore ?? clientBase.atsScore,
              tier: st.tier || "free",
              badge: st.badge || "",
              description: st.description || clientBase.description,
              tags: st.tags || clientBase.features,
              component:
                TEMPLATE_COMPONENTS[st.templateId] || clientBase.component,
              seo: st.seo || {},
            };
          });

          setTemplatesList(merged);

          // Handle query param for template
          if (templateParam) {
            const target = merged.find(
              (m) =>
                m.id === templateParam ||
                m.id.toLowerCase() === templateParam.toLowerCase()
            );
            if (target) {
              setActivePreviewTemplate(target);
            }
          }
        }
      } catch (err) {
        console.warn("Using fallback local templates catalog:", err.message);
      }
    };

    fetchTemplates();
  }, [templateParam]);

  const filteredTemplates =
    selectedCategory === "All"
      ? templatesList
      : templatesList.filter(
          (t) =>
            t.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

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

  // Dynamic High-CTR Meta Tags tailored for top Google Ranking
  const dynamicMetaTitle =
    selectedCategory === "All"
      ? "Professional Resume Templates (98% ATS Pass Rate) | Free & Pro | SmartNShine"
      : `${selectedCategory} Resume Templates - ATS-Optimized Professional Format | SmartNShine`;

  const dynamicMetaDescription =
    selectedCategory === "All"
      ? "Build an interview-ready resume with 12+ top-rated ATS resume templates. Engineered for Taleo, Workday & Greenhouse. Instant PDF download & real-time ATS scoring."
      : `Explore top ${selectedCategory.toLowerCase()} ATS resume templates. High recruiter callback rate, clean single & two-column formats, and 1-click PDF download.`;

  const dynamicKeywords =
    "resume, professional resume, ATS resume templates, free resume templates, modern CV format, ATS resume maker, executive resume template, software engineer resume format, download resume PDF";

  // Google Rich Snippet FAQs for public page
  const pageFaqs = [
    {
      question: "Why are SmartNShine resume templates 100% ATS-friendly?",
      answer:
        "Our resume templates use clean HTML5/CSS structured hierarchy, standard font typography, and zero unreadable nested tables, ensuring 100% readability across Taleo, Workday, and Greenhouse ATS scanners.",
    },
    {
      question: "Can I customize colors, fonts, and section ordering?",
      answer:
        "Yes! Every template features multiple color schemes, flexible typography scaling, and drag-and-drop section reordering with real-time live preview.",
    },
    {
      question: "Is there a free resume template available for freshers?",
      answer:
        "Yes, our Classic and Minimal Starter templates are 100% free with unlimited edits, AI assistance, and instant high-resolution PDF downloads.",
    },
    {
      question: "Which resume format is best for senior professionals and tech roles?",
      answer:
        "For Tech roles, the Developer Tech and GitHub Style templates highlight repositories and skills matrices. For leadership roles, Strategic Leadership and Impact Pro focus on quantifiable metrics and revenue achievements.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Dynamic SEO Meta Tags */}
      <SEO
        title={dynamicMetaTitle}
        description={dynamicMetaDescription}
        keywords={dynamicKeywords}
        url={`https://www.smartnshine.app/templates${
          selectedCategory !== "All"
            ? `?category=${selectedCategory.toLowerCase()}`
            : ""
        }`}
      />

      {/* Dynamic Schema.org JSON-LD (ItemList, FAQPage, Breadcrumbs, Product) */}
      <TemplateSchema
        templates={filteredTemplates}
        activeCategory={selectedCategory}
        activeTemplate={activePreviewTemplate}
        customFaqs={pageFaqs}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* Top Hero Banner with Category Filters */}
        <TemplatesBanner
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat);
            if (cat === "All") {
              searchParams.delete("category");
            } else {
              searchParams.set("category", cat.toLowerCase());
            }
            setSearchParams(searchParams);
          }}
          totalTemplates={templatesList.length}
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

        {/* HIGH-VALUE SEO ON-PAGE SECTION (Search Intent Optimization) */}
        <section className="mt-16 pt-12 border-t border-gray-200 dark:border-white/10 space-y-12">
          {/* Key Advantages Grid */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-xs font-bold border border-blue-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>Engineered for 98%+ ATS Compatibility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Why Top Recruiters Prefer SmartNShine ATS Templates
            </h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              Over 75% of resumes get rejected by automated applicant tracking systems before a human ever reads them. Our templates are designed specifically to pass Taleo, Greenhouse, and Workday filters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                Machine-Readable Semantic Layout
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Standard headers, single/clean multi-column grids, and zero complex graphic artifacts that corrupt resume text extractors.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                Instant PDF & Color Customization
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Export vector-crisp PDF documents tailored for enterprise job boards with curated color palettes that match your industry.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900/80 p-6 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                Built-in AI Bullet Optimization
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Pair your chosen template with our GPT-4o AI engine to enhance bullet points, add action verbs, and match job descriptions.
              </p>
            </div>
          </div>

          {/* Interactive FAQ Section (Matches FAQPage Schema) */}
          <div className="max-w-3xl mx-auto space-y-6 pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Frequently Asked Questions About Resume Templates
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Everything you need to know about ATS compliance, formatting, and downloads
              </p>
            </div>

            <div className="space-y-3">
              {pageFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-blue-600 dark:text-cyan-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-600 dark:text-zinc-300 leading-relaxed border-t border-gray-100 dark:border-white/5 animate-fadeIn">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
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
