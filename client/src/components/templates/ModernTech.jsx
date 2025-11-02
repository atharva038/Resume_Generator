/**
 * Modern Tech Template
 * A modern, visually appealing template for tech professionals
 * Uses: HeaderModern, TwoColumn, ExperienceTimeline, SkillsBar
 * Best for: Software Engineers, Developers, Tech roles
 */

import React from "react";
import {HeaderModern} from "./components/headers";
import {ExperienceTimeline} from "./components/sections/experience";
import {SkillsBar} from "./components/sections/skills";
import {TwoColumn} from "./components/layouts";
import {techTheme} from "./themes";

const ModernTech = ({resumeData = {}}) => {
  // Use tech theme
  const theme = techTheme;

  // Extract data with defaults
  const {
    name = "Jane Developer",
    title = "Software Engineer",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    portfolio = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
    languages = [],
    projects = [],
  } = resumeData;

  // Sidebar content
  const sidebarContent = (
    <div>
      {/* Skills in sidebar */}
      {skills && skills.length > 0 && (
        <div className="mb-8">
          <SkillsBar
            skills={skills}
            theme={theme}
            showPercentage={true}
            animated={true}
            groupByCategory={true}
          />
        </div>
      )}

      {/* Education in sidebar */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont,
              borderColor: theme.colors.primary,
            }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <h3
                  className="font-bold text-sm mb-1"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.typography.bodyFont,
                  }}
                >
                  {edu.degree}
                </h3>
                <div
                  className="text-xs mb-1"
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.bodyFont,
                  }}
                >
                  {edu.institution}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.bodyFont,
                  }}
                >
                  {edu.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont,
              borderColor: theme.colors.primary,
            }}
          >
            Languages
          </h2>
          <div className="space-y-2">
            {languages.map((lang, index) => (
              <div key={index} className="flex justify-between items-center">
                <span
                  className="text-sm"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.typography.bodyFont,
                  }}
                >
                  {lang.language}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.bodyFont,
                  }}
                >
                  {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Main content
  const mainContent = (
    <div>
      {/* Header */}
      <HeaderModern
        name={name}
        title={title}
        email={email}
        phone={phone}
        location={location}
        linkedin={linkedin}
        github={github}
        portfolio={portfolio}
        theme={theme}
      />

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <h2
            className="text-xl font-bold mb-3 pb-2 border-b-2"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont,
              borderColor: theme.colors.primary,
            }}
          >
            About Me
          </h2>
          <p
            className="leading-relaxed"
            style={{
              color: theme.colors.text,
              fontFamily: theme.typography.bodyFont,
              fontSize: theme.typography.sizes.base,
            }}
          >
            {summary}
          </p>
        </section>
      )}

      {/* Experience Timeline */}
      {experience && experience.length > 0 && (
        <ExperienceTimeline
          experiences={experience}
          theme={theme}
          showDuration={true}
        />
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont,
              borderColor: theme.colors.primary,
            }}
          >
            Featured Projects
          </h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <h3
                  className="font-bold mb-2"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.typography.bodyFont,
                    fontSize: theme.typography.sizes.base,
                  }}
                >
                  {project.name}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-sm"
                      style={{color: theme.colors.primary}}
                    >
                      🔗
                    </a>
                  )}
                </h3>
                <p
                  className="mb-2"
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.typography.bodyFont,
                    fontSize: theme.typography.sizes.small,
                  }}
                >
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: "#ffffff",
                          fontFamily: theme.typography.bodyFont,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  return (
    <TwoColumn
      sidebar={sidebarContent}
      sidebarPosition="right"
      sidebarWidth="35%"
      mainWidth="65%"
      gap="2rem"
      theme={theme}
    >
      {mainContent}
    </TwoColumn>
  );
};

export default ModernTech;
