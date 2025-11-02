/**
 * Corporate Professional Template
 * A clean, ATS-friendly resume template for corporate professionals
 * Uses: HeaderClassic, SingleColumn, ExperienceList, SkillsGrid
 * Best for: Finance, Consulting, Legal, Executive roles
 */

import React from "react";
import {HeaderClassic} from "./components/headers";
import {ExperienceList} from "./components/sections/experience";
import {SkillsGrid} from "./components/sections/skills";
import {SingleColumn} from "./components/layouts";
import {professionalTheme} from "./themes";

const CorporateProfessional = ({resumeData = {}}) => {
  // Use professional theme
  const theme = professionalTheme;

  // Extract data with defaults
  const {
    name = "John Doe",
    title = "Professional",
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
    certifications = [],
  } = resumeData;

  return (
    <SingleColumn theme={theme} maxWidth="850px" padding="3rem">
      {/* Header Section */}
      <HeaderClassic
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

      {/* Professional Summary */}
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
            Professional Summary
          </h2>
          <p
            className="leading-relaxed"
            style={{
              color: theme.colors.text,
              fontFamily: theme.typography.bodyFont,
              fontSize: theme.typography.sizes.base,
              textAlign: "justify",
            }}
          >
            {summary}
          </p>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <ExperienceList
          experiences={experience}
          theme={theme}
          compact={false}
        />
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section className="mb-8">
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
                <div className="flex justify-between items-start mb-1">
                  <h3
                    className="font-bold"
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.typography.bodyFont,
                      fontSize: theme.typography.sizes.base,
                    }}
                  >
                    {edu.degree}
                  </h3>
                  <span
                    className="text-sm"
                    style={{
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.bodyFont,
                      fontSize: theme.typography.sizes.small,
                    }}
                  >
                    {edu.year}
                  </span>
                </div>
                <div
                  className="italic mb-1"
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.bodyFont,
                    fontSize: theme.typography.sizes.small,
                  }}
                >
                  {edu.institution}
                  {edu.location && ` • ${edu.location}`}
                </div>
                {edu.gpa && (
                  <div
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.typography.bodyFont,
                      fontSize: theme.typography.sizes.small,
                    }}
                  >
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <SkillsGrid
          skills={skills}
          theme={theme}
          columns={3}
          showLevel={true}
          showIcons={false}
          compact={false}
        />
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-bold mb-4 pb-2 border-b-2"
            style={{
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont,
              borderColor: theme.colors.primary,
            }}
          >
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <span
                    className="font-semibold"
                    style={{
                      color: theme.colors.text,
                      fontFamily: theme.typography.bodyFont,
                      fontSize: theme.typography.sizes.base,
                    }}
                  >
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <span
                      className="ml-2"
                      style={{
                        color: theme.colors.textSecondary,
                        fontFamily: theme.typography.bodyFont,
                        fontSize: theme.typography.sizes.small,
                      }}
                    >
                      • {cert.issuer}
                    </span>
                  )}
                </div>
                {cert.year && (
                  <span
                    style={{
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.bodyFont,
                      fontSize: theme.typography.sizes.small,
                    }}
                  >
                    {cert.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Print styles */}
      <style jsx>{`
        @media print {
          section {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          h2 {
            break-after: avoid;
            page-break-after: avoid;
          }
        }
      `}</style>
    </SingleColumn>
  );
};

export default CorporateProfessional;
