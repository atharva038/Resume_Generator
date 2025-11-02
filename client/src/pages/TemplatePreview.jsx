/**
 * Template Preview Page
 * Test and preview new modular template components
 */

import React, {useState} from "react";
import {ArrowLeft} from "lucide-react";
import {Link} from "react-router-dom";

// Import components
import HeaderModern from "../components/templates/components/headers/HeaderModern";

// Import themes
import {
  professionalTheme,
  creativeTheme,
  minimalTheme,
  techTheme,
  executiveTheme,
} from "../components/templates/themes";

const TemplatePreview = () => {
  const [selectedTheme, setSelectedTheme] = useState("tech");

  const themes = {
    professional: professionalTheme,
    creative: creativeTheme,
    minimal: minimalTheme,
    tech: techTheme,
    executive: executiveTheme,
  };

  const themeList = [
    {id: "professional", name: "Professional", desc: "Corporate Blue"},
    {id: "creative", name: "Creative", desc: "Purple/Pink"},
    {id: "minimal", name: "Minimal", desc: "Black & White"},
    {id: "tech", name: "Tech", desc: "Cyan Blue"},
    {id: "executive", name: "Executive", desc: "Dark Slate"},
  ];

  // Sample data
  const sampleData = {
    name: "Atharva Sachin Joshi",
    title: "Full Stack Developer & UI/UX Designer",
    email: "atharvasjoshi2005@gmail.com",
    phone: "555-123-4567",
    location: "Mumbai, India",
    linkedin: "https://linkedin.com/in/atharva-joshi",
    github: "https://github.com/atharva038",
    portfolio: "https://atharva-portfolio.com",
  };

  const currentTheme = themes[selectedTheme];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎨 Template Component Preview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Preview the new modular template components with different themes
          </p>
        </div>

        {/* Theme Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Theme
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {themeList.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTheme === theme.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div
                  className="w-full h-12 rounded mb-2"
                  style={{backgroundColor: themes[theme.id].colors.primary}}
                />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {theme.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {theme.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Component Preview */}
        <div className="space-y-8">
          {/* HeaderModern Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                HeaderModern Component
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Modern gradient header with contact info and social links
              </p>
            </div>

            {/* Preview Area */}
            <div className="bg-white">
              <HeaderModern
                name={sampleData.name}
                title={sampleData.title}
                email={sampleData.email}
                phone={sampleData.phone}
                location={sampleData.location}
                linkedin={sampleData.linkedin}
                github={sampleData.github}
                portfolio={sampleData.portfolio}
                theme={currentTheme}
              />
            </div>
          </div>

          {/* Theme Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Current Theme Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colors */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Colors
                </h4>
                <div className="space-y-2">
                  {Object.entries(currentTheme.colors)
                    .slice(0, 6)
                    .map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded border border-gray-200 dark:border-gray-600"
                          style={{backgroundColor: value}}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {key}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Fonts */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Typography
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Heading Font
                    </div>
                    <div
                      className="text-lg mt-1"
                      style={{fontFamily: currentTheme.fonts.heading}}
                    >
                      {currentTheme.fonts.heading
                        .split(",")[0]
                        .replace(/'/g, "")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      Body Font
                    </div>
                    <div
                      className="text-lg mt-1"
                      style={{fontFamily: currentTheme.fonts.body}}
                    >
                      {currentTheme.fonts.body.split(",")[0].replace(/'/g, "")}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Name: {currentTheme.fonts.sizes.name} • Heading:{" "}
                      {currentTheme.fonts.sizes.heading} • Body:{" "}
                      {currentTheme.fonts.sizes.body}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🚀 Coming Soon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  Header Components
                </div>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>✅ HeaderModern (Ready!)</li>
                  <li>⏳ HeaderClassic</li>
                  <li>⏳ HeaderMinimal</li>
                  <li>⏳ HeaderSidebar</li>
                  <li>⏳ HeaderCentered</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  Section Components
                </div>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>⏳ ExperienceTimeline</li>
                  <li>⏳ ExperienceCards</li>
                  <li>⏳ SkillsBar</li>
                  <li>⏳ SkillsPills</li>
                  <li>⏳ And more...</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
