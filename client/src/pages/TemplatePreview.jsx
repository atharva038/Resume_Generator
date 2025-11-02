/**
 * Template Preview Page
 * Preview and test all 3 complete resume templates
 */

import React, {useState} from "react";
import {ArrowLeft, ZoomIn, ZoomOut, Printer, Download} from "lucide-react";
import {Link} from "react-router-dom";

// Import complete templates
import {
  CorporateProfessional,
  ModernTech,
  CreativePortfolio,
  availableTemplates,
} from "../components/templates";

// Import themes
import {
  professionalTheme,
  creativeTheme,
  minimalTheme,
  techTheme,
  executiveTheme,
} from "../components/templates/themes";

const TemplatePreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(
    "corporateProfessional"
  );
  const [zoomLevel, setZoomLevel] = useState(100);

  const themes = {
    professional: professionalTheme,
    creative: creativeTheme,
    minimal: minimalTheme,
    tech: techTheme,
    executive: executiveTheme,
  };

  // Comprehensive sample resume data
  const sampleData = {
    // Personal Information
    name: "Sarah Johnson",
    title: "Senior Full Stack Developer",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/sarahjohnson",
    github: "github.com/sarahjohnson",
    portfolio: "sarahjohnson.dev",
    photo: null, // Optional photo URL
    tagline: "Building scalable web applications with modern technologies",

    // Professional Summary
    summary:
      "Passionate Full Stack Developer with 6+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Led multiple high-impact projects resulting in 40% performance improvements and $2M in cost savings.",

    // Work Experience
    experience: [
      {
        company: "Tech Innovations Inc.",
        position: "Senior Full Stack Developer",
        location: "San Francisco, CA",
        startDate: "2021-03",
        endDate: null, // Current job
        current: true,
        achievements: [
          "Led development of microservices architecture serving 1M+ daily users",
          "Reduced application load time by 40% through performance optimization",
          "Mentored team of 5 junior developers, improving code quality by 35%",
          "Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
        ],
        technologies: ["React", "Node.js", "AWS", "Docker", "PostgreSQL"],
      },
      {
        company: "Digital Solutions Ltd.",
        position: "Full Stack Developer",
        location: "San Francisco, CA",
        startDate: "2019-06",
        endDate: "2021-02",
        current: false,
        achievements: [
          "Developed customer portal handling 500K+ transactions monthly",
          "Integrated payment gateway increasing revenue by $2M annually",
          "Built RESTful APIs consumed by 10+ client applications",
          "Reduced server costs by 30% through AWS optimization",
        ],
        technologies: ["Vue.js", "Express", "MongoDB", "Redis", "Kubernetes"],
      },
      {
        company: "StartupLabs",
        position: "Junior Developer",
        location: "San Jose, CA",
        startDate: "2018-01",
        endDate: "2019-05",
        current: false,
        achievements: [
          "Built responsive web applications used by 50K+ users",
          "Collaborated with designers to implement pixel-perfect UIs",
          "Wrote comprehensive unit tests achieving 90% code coverage",
        ],
        technologies: ["JavaScript", "React", "Python", "Django"],
      },
    ],

    // Education
    education: [
      {
        school: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        location: "Berkeley, CA",
        startDate: "2014-09",
        endDate: "2018-05",
        gpa: "3.8",
        achievements: [
          "Dean's List all semesters",
          "President of Computer Science Club",
          "Graduated with Honors",
        ],
      },
    ],

    // Skills
    skills: [
      {
        category: "Frontend",
        items: [
          {name: "React", level: 95},
          {name: "Vue.js", level: 85},
          {name: "TypeScript", level: 90},
          {name: "HTML/CSS", level: 95},
          {name: "Tailwind CSS", level: 90},
        ],
      },
      {
        category: "Backend",
        items: [
          {name: "Node.js", level: 90},
          {name: "Express", level: 85},
          {name: "Python", level: 80},
          {name: "Django", level: 75},
          {name: "RESTful APIs", level: 90},
        ],
      },
      {
        category: "Database",
        items: [
          {name: "PostgreSQL", level: 85},
          {name: "MongoDB", level: 80},
          {name: "Redis", level: 75},
          {name: "MySQL", level: 80},
        ],
      },
      {
        category: "DevOps & Cloud",
        items: [
          {name: "AWS", level: 85},
          {name: "Docker", level: 90},
          {name: "Kubernetes", level: 75},
          {name: "CI/CD", level: 85},
          {name: "Git", level: 95},
        ],
      },
    ],

    // Projects
    projects: [
      {
        name: "E-Commerce Platform",
        description:
          "Built scalable e-commerce platform handling 100K+ daily transactions",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
        link: "github.com/sarahjohnson/ecommerce",
      },
      {
        name: "Real-time Analytics Dashboard",
        description:
          "Developed real-time analytics dashboard for monitoring KPIs",
        technologies: ["Vue.js", "WebSocket", "Redis", "Chart.js"],
        link: "github.com/sarahjohnson/analytics",
      },
    ],

    // Certifications
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-06",
        id: "AWS-SA-2023-12345",
      },
      {
        name: "Professional Scrum Master I",
        issuer: "Scrum.org",
        date: "2022-03",
        id: "PSM-I-2022-67890",
      },
    ],

    // Languages
    languages: [
      {name: "English", level: "Native"},
      {name: "Spanish", level: "Professional"},
      {name: "French", level: "Basic"},
    ],

    // Awards
    awards: [
      {
        title: "Employee of the Year",
        organization: "Tech Innovations Inc.",
        year: "2023",
      },
      {
        title: "Best Innovation Award",
        organization: "Digital Solutions Ltd.",
        year: "2020",
      },
    ],
  };

  // Template components mapping
  const templateComponents = {
    corporateProfessional: CorporateProfessional,
    modernTech: ModernTech,
    creativePortfolio: CreativePortfolio,
  };

  const currentTemplateData = availableTemplates.find(
    (t) => t.id === selectedTemplate
  );
  const TemplateComponent = templateComponents[selectedTemplate];
  const currentTheme = themes[currentTemplateData?.theme || "professional"];

  // Zoom controls
  const handleZoomIn = () => {
    if (zoomLevel < 150) setZoomLevel(zoomLevel + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) setZoomLevel(zoomLevel - 10);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 print:hidden">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📄 Complete Template Preview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Preview all 3 production-ready resume templates with full sample
            data
          </p>
        </div>

        {/* Template Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 print:hidden">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-5 rounded-lg border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded">
                    <span>ATS</span>
                    <span>{template.atsScore}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.features.slice(0, 2).map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Controls:
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 150}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                📊 Template Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    ATS Score:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {currentTemplateData?.atsScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Layout:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {currentTemplateData?.layout.replace(/([A-Z])/g, " $1")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Theme:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {currentTemplateData?.theme}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                ✨ Features
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {currentTemplateData?.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                🎯 Best For
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentTemplateData?.bestFor.slice(0, 4).map((role, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
          <div
            className="bg-white transition-transform origin-top"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top center",
            }}
          >
            {TemplateComponent && (
              <TemplateComponent resumeData={sampleData} theme={currentTheme} />
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 print:hidden">
          <p>
            💡 Tip: Use the zoom controls to adjust the preview size, or click
            "Print / Save PDF" to download
          </p>
          <p className="mt-2">
            📝 This is sample data. Your actual resume will use your information
            from the resume builder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
