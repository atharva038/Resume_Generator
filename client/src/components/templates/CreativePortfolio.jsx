/**
 * Creative Portfolio Template
 * A visually striking template for creative professionals
 * Uses: HeaderCentered, ExperienceCards, SkillsCloud, SidebarLeft
 * Best for: Designers, Artists, Marketers, Creative roles
 */

import React from "react";
import {HeaderCentered} from "./components/headers";
import {ExperienceCards} from "./components/sections/experience";
import {SkillsCloud} from "./components/sections/skills";
import {SidebarLeft} from "./components/layouts";
import {creativeTheme} from "./themes";

const CreativePortfolio = ({resumeData = {}}) => {
  // Use creative theme
  const theme = creativeTheme;

  // Extract data with defaults
  const {
    name = "Creative Professional",
    title = "Designer",
    tagline = "Creating beautiful experiences",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    github = "",
    portfolio = "",
    photo = "",
    summary = "",
    experience = [],
    skills = [],
    awards = [],
  } = resumeData;

  // Sidebar content (will be dark/colored background)
  const sidebarContent = (
    <div style={{color: "#ffffff"}}>
      {/* Photo */}
      {photo && (
        <div className="mb-6 text-center">
          <img
            src={photo}
            alt={name}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4"
            style={{borderColor: theme.colors.secondary}}
          />
        </div>
      )}

      {/* Contact Info */}
      <div className="mb-8">
        <h3
          className="text-lg font-bold mb-4"
          style={{
            color: "#ffffff",
            fontFamily: theme.typography.headingFont,
            borderBottom: "2px solid rgba(255,255,255,0.3)",
            paddingBottom: "0.5rem",
          }}
        >
          Contact
        </h3>
        <div className="space-y-2 text-sm">
          {email && <div>📧 {email}</div>}
          {phone && <div>📱 {phone}</div>}
          {location && <div>📍 {location}</div>}
          {portfolio && (
            <div>
              🌐{" "}
              <a href={portfolio} className="underline">
                {portfolio.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Skills Cloud */}
      {skills && skills.length > 0 && (
        <div className="mb-8">
          <h3
            className="text-lg font-bold mb-4"
            style={{
              color: "#ffffff",
              fontFamily: theme.typography.headingFont,
              borderBottom: "2px solid rgba(255,255,255,0.3)",
              paddingBottom: "0.5rem",
            }}
          >
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => {
              // Handle nested structure {category, items} or flat array
              if (skill.items && Array.isArray(skill.items)) {
                // Nested structure - render all items from this category
                return skill.items.map((item, itemIndex) => (
                  <span
                    key={`${index}-${itemIndex}`}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    {item.name || item}
                  </span>
                ));
              }
              // Flat structure - render skill directly
              return (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {skill.name || skill}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Awards */}
      {awards && awards.length > 0 && (
        <div className="mb-8">
          <h3
            className="text-lg font-bold mb-4"
            style={{
              color: "#ffffff",
              fontFamily: theme.typography.headingFont,
              borderBottom: "2px solid rgba(255,255,255,0.3)",
              paddingBottom: "0.5rem",
            }}
          >
            Awards & Recognition
          </h3>
          <div className="space-y-3 text-sm">
            {awards.map((award, index) => (
              <div key={index}>
                <div className="font-semibold">{award.title}</div>
                <div className="text-xs opacity-80">
                  {award.year} • {award.issuer}
                </div>
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
      <HeaderCentered
        name={name}
        title={title}
        tagline={tagline}
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
            className="text-2xl font-bold mb-4 text-center"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont,
            }}
          >
            About Me
          </h2>
          <p
            className="leading-relaxed text-center max-w-2xl mx-auto"
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

      {/* Experience Cards */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-2xl font-bold mb-6 text-center"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont,
            }}
          >
            Experience
          </h2>
          <ExperienceCards
            experiences={experience}
            theme={theme}
            showDuration={true}
          />
        </div>
      )}

      {/* Skills Showcase (if many skills) */}
      {(() => {
        // Calculate total skill count (handle nested structure)
        const totalSkills = skills.reduce((count, skill) => {
          if (skill.items && Array.isArray(skill.items)) {
            return count + skill.items.length;
          }
          return count + 1;
        }, 0);

        return (
          totalSkills > 15 && (
            <div className="mb-8">
              <SkillsCloud
                skills={skills}
                theme={theme}
                colorful={true}
                minSize={16}
                maxSize={36}
              />
            </div>
          )
        );
      })()}
    </div>
  );

  return (
    <SidebarLeft
      sidebar={sidebarContent}
      sidebarWidth="300px"
      sidebarBackground={`linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`}
      mainBackground={theme.colors.background}
      sidebarPadding="2.5rem"
      mainPadding="3rem"
      theme={theme}
    >
      {mainContent}
    </SidebarLeft>
  );
};

export default CreativePortfolio;
