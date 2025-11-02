/**
 * Template Components Demo
 * Preview all template components with sample data
 */

import React, {useState} from "react";
import {
  HeaderModern,
  HeaderClassic,
  HeaderMinimal,
  HeaderSidebar,
  HeaderCentered,
} from "../components/templates/components/headers";
import {
  ExperienceTimeline,
  ExperienceCards,
  ExperienceList,
} from "../components/templates/components/sections/experience";
import {
  SkillsBar,
  SkillsPills,
  SkillsGrid,
  SkillsCloud,
} from "../components/templates/components/sections/skills";
import {
  professionalTheme,
  creativeTheme,
  minimalTheme,
  techTheme,
  executiveTheme,
} from "../components/templates/themes";

// Sample resume data
const sampleData = {
  name: "John Anderson",
  title: "Senior Software Engineer",
  tagline: "Building innovative solutions that make a difference",
  email: "john.anderson@email.com",
  phone: "5551234567",
  location: "San Francisco, CA",
  linkedin: "https://linkedin.com/in/johnanderson",
  github: "https://github.com/johnanderson",
  portfolio: "https://johnanderson.com",

  // Experience data
  experience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "2021-03",
      endDate: null,
      description:
        "Leading development of cloud-based solutions and mentoring junior developers.",
      achievements: [
        "Architected and deployed microservices reducing latency by 40%",
        "Led team of 5 engineers delivering $2M product on schedule",
        "Implemented CI/CD pipeline improving deployment speed by 60%",
      ],
      technologies: ["React", "Node.js", "AWS", "Docker", "MongoDB"],
    },
    {
      position: "Full Stack Developer",
      company: "StartUp Labs",
      location: "Austin, TX",
      startDate: "2019-01",
      endDate: "2021-02",
      description:
        "Built responsive web applications and RESTful APIs for e-commerce platform.",
      achievements: [
        "Developed payment gateway integration processing $500K monthly",
        "Optimized database queries improving response time by 50%",
        "Mentored 3 junior developers in best practices",
      ],
      technologies: ["JavaScript", "Python", "PostgreSQL", "Redis"],
    },
    {
      position: "Junior Developer",
      company: "Digital Agency",
      location: "Remote",
      startDate: "2017-06",
      endDate: "2018-12",
      description:
        "Developed client websites and maintained existing web applications.",
      achievements: [
        "Built 15+ responsive websites using modern frameworks",
        "Improved site performance scores from 60 to 95",
      ],
      technologies: ["HTML", "CSS", "JavaScript", "WordPress"],
    },
  ],

  // Skills data
  skills: [
    {name: "React", category: "Frontend", level: 95},
    {name: "Node.js", category: "Backend", level: 90},
    {name: "TypeScript", category: "Languages", level: 85},
    {name: "Python", category: "Languages", level: 80},
    {name: "AWS", category: "Cloud", level: 85},
    {name: "Docker", category: "DevOps", level: 80},
    {name: "MongoDB", category: "Database", level: 85},
    {name: "PostgreSQL", category: "Database", level: 80},
    {name: "GraphQL", category: "Backend", level: 75},
    {name: "Redux", category: "Frontend", level: 90},
    {name: "Jest", category: "Testing", level: 85},
    {name: "Git", category: "Tools", level: 95},
  ],
};

const ComponentsDemo = () => {
  const [selectedTheme, setSelectedTheme] = useState("professional");
  const [activeTab, setActiveTab] = useState("headers");

  const themes = {
    professional: professionalTheme,
    creative: creativeTheme,
    minimal: minimalTheme,
    tech: techTheme,
    executive: executiveTheme,
  };

  const currentTheme = themes[selectedTheme];

  const headers = [
    {
      name: "Modern",
      component: HeaderModern,
      description: "Gradient header with bold styling",
    },
    {
      name: "Classic",
      component: HeaderClassic,
      description: "Traditional centered header",
    },
    {
      name: "Minimal",
      component: HeaderMinimal,
      description: "Clean single-line header",
    },
    {
      name: "Sidebar",
      component: HeaderSidebar,
      description: "Vertical sidebar with photo",
    },
    {
      name: "Centered",
      component: HeaderCentered,
      description: "Elegant centered with tagline",
    },
  ];

  const experienceComponents = [
    {
      name: "Timeline",
      component: ExperienceTimeline,
      description: "Visual timeline with connecting line and dots",
      bestFor: "Modern, Tech, Creative templates",
    },
    {
      name: "Cards",
      component: ExperienceCards,
      description: "Card-based layout with hover effects",
      bestFor: "Creative, Modern, Portfolio-style",
    },
    {
      name: "List",
      component: ExperienceList,
      description: "Traditional list format (ATS-friendly)",
      bestFor: "Professional, Executive, Conservative",
    },
  ];

  const skillsComponents = [
    {
      name: "Bar",
      component: SkillsBar,
      description: "Animated progress bars with proficiency levels",
      bestFor: "Professional, Executive, Technical",
    },
    {
      name: "Pills",
      component: SkillsPills,
      description: "Compact badge-style layout",
      bestFor: "Creative, Modern, Minimal",
    },
    {
      name: "Grid",
      component: SkillsGrid,
      description: "Structured grid with categories",
      bestFor: "Professional, Tech, Executive",
    },
    {
      name: "Cloud",
      component: SkillsCloud,
      description: "Visual word cloud with size variations",
      bestFor: "Creative, Modern, Portfolio",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎨 Template Components Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Preview all template components with different themes
          </p>

          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {Object.keys(themes).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => setSelectedTheme(themeKey)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedTheme === themeKey
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
                }`}
              >
                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            {["headers", "experience", "skills"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "headers" && (
          <div className="space-y-12">
            {headers.map(({name, component: HeaderComponent, description}) => (
              <div
                key={name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">Header{name}</h2>
                  <p className="text-blue-100">{description}</p>
                </div>
                <div className="p-8 bg-white dark:bg-gray-900">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <HeaderComponent {...sampleData} theme={currentTheme} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "experience" && (
          <div className="space-y-12">
            {experienceComponents.map(
              ({
                name,
                component: ExperienceComponent,
                description,
                bestFor,
              }) => (
                <div
                  key={name}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
                    <h2 className="text-2xl font-bold mb-2">
                      Experience{name}
                    </h2>
                    <p className="text-green-100">{description}</p>
                    <p className="text-green-200 text-sm mt-2">
                      ✨ Best for: {bestFor}
                    </p>
                  </div>
                  <div className="p-8 bg-white dark:bg-gray-900">
                    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                      <ExperienceComponent
                        experiences={sampleData.experience}
                        theme={currentTheme}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-12">
            {skillsComponents.map(
              ({name, component: SkillsComponent, description, bestFor}) => (
                <div
                  key={name}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
                    <h2 className="text-2xl font-bold mb-2">Skills{name}</h2>
                    <p className="text-orange-100">{description}</p>
                    <p className="text-orange-200 text-sm mt-2">
                      ✨ Best for: {bestFor}
                    </p>
                  </div>
                  <div className="p-8 bg-white dark:bg-gray-900">
                    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                      <SkillsComponent
                        skills={sampleData.skills}
                        theme={currentTheme}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            ✅ Template System Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div>
              <div className="text-4xl font-bold">5</div>
              <div className="text-purple-100">Header Variants</div>
            </div>
            <div>
              <div className="text-4xl font-bold">3</div>
              <div className="text-purple-100">Experience Layouts</div>
            </div>
            <div>
              <div className="text-4xl font-bold">4</div>
              <div className="text-purple-100">Skills Displays</div>
            </div>
            <div>
              <div className="text-4xl font-bold">5</div>
              <div className="text-purple-100">Professional Themes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsDemo;
