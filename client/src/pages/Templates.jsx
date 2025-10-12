import {useState} from "react";
import {useNavigate} from "react-router-dom";
import ClassicTemplate from "../components/templates/ClassicTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import ExecutiveTemplate from "../components/templates/ExecutiveTemplate";
import TechTemplate from "../components/templates/TechTemplate";
import CreativeTemplate from "../components/templates/CreativeTemplate";
import AcademicTemplate from "../components/templates/AcademicTemplate";

// Sample resume data for preview
const sampleResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234-567-8900",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
  },
  summary:
    "Experienced professional with 5+ years in the field, dedicated to excellence and innovation.",
  skills: [
    {category: "Technical", items: ["JavaScript", "React", "Node.js"]},
    {
      category: "Soft Skills",
      items: ["Leadership", "Communication", "Problem Solving"],
    },
  ],
  experience: [
    {
      position: "Senior Developer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "Jan 2020",
      endDate: "Present",
      achievements: [
        "Led team of 5 developers in building scalable applications",
        "Improved system performance by 40%",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of California",
      location: "Berkeley, CA",
      graduationDate: "2019",
      gpa: "3.8/4.0",
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce solution",
      technologies: "React, Node.js, MongoDB",
      date: "2023",
    },
  ],
  certifications: [
    {name: "AWS Certified Developer", issuer: "Amazon", date: "2022"},
  ],
  achievements: ["Employee of the Year 2022", "Published 3 technical articles"],
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Resume Template
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select from 8 professionally designed templates, each optimized for
            ATS systems and tailored to different career paths
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-10 flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md"
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
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Template Preview */}
              <div className="relative h-72 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <div
                  className="absolute inset-0 scale-[0.28] origin-top-left pointer-events-none"
                  style={{
                    transformOrigin: "top left",
                    width: "210mm",
                    height: "297mm",
                  }}
                >
                  <template.component resumeData={sampleResumeData} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Overlay Preview Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-xl transform hover:scale-110 transition-transform">
                    👁️ Preview
                  </button>
                </div>

                {/* ATS Score Badge */}
                <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
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
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Color Palette */}
                <div className="flex gap-2 mb-4">
                  {template.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                      style={{backgroundColor: color}}
                    />
                  ))}
                </div>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template.id);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Use This Template
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedTemplate.name} Template
                  </h2>
                  <p className="text-blue-100">
                    {selectedTemplate.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body - Template Preview */}
              <div className="overflow-auto max-h-[60vh] p-6 bg-gray-100 dark:bg-gray-900">
                <div
                  className="scale-75 origin-top mx-auto"
                  style={{width: "210mm"}}
                >
                  <selectedTemplate.component resumeData={sampleResumeData} />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      ATS Score:
                    </span>
                    <span
                      className={`text-2xl font-bold ${
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
                  <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                    {selectedTemplate.category}
                  </span>
                </div>
                <button
                  onClick={() => handleSelectTemplate(selectedTemplate.id)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Use This Template →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why Our Templates Stand Out
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ATS-Optimized
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All templates score 85%+ on ATS systems, ensuring your resume
                gets past automated screening
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Diverse Designs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                From corporate executive to creative designer, find the perfect
                match for your career path
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
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
