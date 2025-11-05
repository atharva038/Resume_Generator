import {useState} from "react";
import {useNavigate} from "react-router-dom";
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
import ClassicTemplate from "../components/templates/ClassicTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import ExecutiveTemplate from "../components/templates/ExecutiveTemplate";
import TechTemplate from "../components/templates/TechTemplate";
import CreativeTemplate from "../components/templates/CreativeTemplate";
import AcademicTemplate from "../components/templates/AcademicTemplate";
// New Modular Templates
import CorporateProfessional from "../components/templates/CorporateProfessional";
import ModernTech from "../components/templates/ModernTech";
import CreativePortfolio from "../components/templates/CreativePortfolio";

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
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2022",
    },
    {name: "React Professional Certification", issuer: "Meta", date: "2023"},
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
    id: "executive",
    name: "Executive",
    component: ExecutiveTemplate,
    category: "Leadership",
    atsScore: 96,
    description:
      "Premium formal template for senior leadership and executive positions",
    features: ["Formal", "Leadership-Focused", "Achievement-Driven"],
    colors: ["#2c3e50", "#ffffff"],
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
    id: "creative",
    name: "Creative Designer",
    component: CreativeTemplate,
    category: "Creative",
    atsScore: 88,
    description:
      "Vibrant creative template with visual appeal while maintaining ATS compatibility",
    features: ["Colorful", "Visual Appeal", "Portfolio Ready"],
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
  // New Modular Templates
  {
    id: "corporate-professional",
    name: "Corporate Professional",
    component: CorporateProfessional,
    category: "Modular",
    atsScore: 95,
    description:
      "Clean, modular ATS-friendly template perfect for corporate roles with traditional layout",
    features: ["Modular Components", "ATS-Optimized", "Single Column Layout"],
    colors: ["#1e40af", "#ffffff"],
  },
  {
    id: "modern-tech",
    name: "Modern Tech",
    component: ModernTech,
    category: "Modular",
    atsScore: 90,
    description:
      "Modern, visually appealing modular template designed for tech professionals with timeline layout",
    features: ["Visual Timeline", "Skill Bars", "Two-Column Layout"],
    colors: ["#0ea5e9", "#0f172a"],
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    component: CreativePortfolio,
    category: "Modular",
    atsScore: 88,
    description:
      "Visually striking modular template for creative professionals with sidebar layout and card design",
    features: ["Colored Sidebar", "Card Layout", "Eye-Catching Design"],
    colors: ["#8b5cf6", "#ec4899"],
  },
];

const Templates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const categories = [
    "All",
    "Professional",
    "Leadership",
    "Tech",
    "Creative",
    "Academic",
    "Modular",
  ];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleSelectTemplate = (templateId) => {
    // Store selected template in localStorage
    localStorage.setItem("selectedTemplate", templateId);
    // Navigate to editor
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
            <Layout className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              11 Professional Templates
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                  : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md border border-gray-200 dark:border-gray-700"
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
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 border border-gray-200 dark:border-gray-700"
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Template Preview */}
              <div
                className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-t-xl overflow-hidden"
                style={{height: "420px"}}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Overlay Preview Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-xl transform hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                </div>

                {/* ATS Score Badge */}
                <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
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
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
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
                      className="inline-flex items-center gap-1 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-medium"
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
                        style={{backgroundColor: color}}
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
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTemplate(null)}
          >
            <div
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedTemplate.name} Template
                  </h2>
                  <p className="text-indigo-100">
                    {selectedTemplate.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Modal Body - Template Preview */}
              <div className="overflow-auto max-h-[60vh] p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div
                  className="scale-75 origin-top mx-auto"
                  style={{width: "210mm"}}
                >
                  <selectedTemplate.component resumeData={sampleResumeData} />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Target className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                    {selectedTemplate.category}
                  </span>
                </div>
                <button
                  onClick={() => handleSelectTemplate(selectedTemplate.id)}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Use This Template
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Why Our Templates Stand Out
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Professionally crafted templates designed to help you land your
            dream job
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
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
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
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
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
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
