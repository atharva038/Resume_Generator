import {Code2, MapPin, Terminal} from "lucide-react";
import {
  ContactActions,
  CustomSections,
  ProjectLinks,
  SectionHeading,
  SkillPills,
  SocialLinks,
  hasItems,
} from "./themeElements";

const MinimalDeveloperTheme = ({data}) => {
  const {
    profile,
    settings,
    actions,
    sections,
    sectionOrder,
    links,
    skills,
    projects,
    featuredProjects,
    experience,
    education,
    certifications,
    achievements,
    customSections,
  } = data;

  const sectionBlocks = {
    projects:
      sections.showProjects && hasItems(projects) ? (
        <section key="projects">
          <SectionHeading
            eyebrow="Selected Builds"
            title="Projects"
            description="Featured work with practical links, stacks, and outcomes."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article
                key={project.id}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
              >
                <h3 className="break-words text-xl font-black">{project.title}</h3>
                {project.description && (
                  <p className="mt-3 break-words leading-7 text-gray-700">
                    {project.description}
                  </p>
                )}
                {hasItems(project.technologies) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <ProjectLinks
                  project={project}
                  onClick={actions.onProjectClick}
                  className="mt-5 text-gray-950"
                />
              </article>
            ))}
          </div>
        </section>
      ) : null,
    skills:
      sections.showSkills && hasItems(skills) ? (
        <section key="skills">
          <SectionHeading title="Skills" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, index) => (
              <article
                key={`${group.category}-${index}`}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
              >
                <h3 className="break-words font-black">
                  {group.category || "Skills"}
                </h3>
                <SkillPills
                  skills={[group]}
                  className="mt-4"
                  pillClassName="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800"
                />
              </article>
            ))}
          </div>
        </section>
      ) : null,
    about:
      sections.showAbout && profile.about ? (
        <section key="about" className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <SectionHeading title="About" />
          <p className="max-w-3xl break-words text-base leading-8 text-gray-700 sm:text-lg">
            {profile.about}
          </p>
        </section>
      ) : null,
    experience:
      sections.showExperience && hasItems(experience) ? (
        <section key="experience">
          <SectionHeading title="Experience" />
          <div className="space-y-5">
            {experience.map((item, index) => (
              <article
                key={`${item.company}-${index}`}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="break-words text-lg font-black">{item.title}</h3>
                    <p className="break-words text-gray-600">{item.company}</p>
                  </div>
                  {item.dateRange && (
                    <span className="text-sm font-semibold text-gray-500">
                      {item.dateRange}
                    </span>
                  )}
                </div>
                {hasItems(item.bullets) && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null,
    education:
      sections.showEducation && hasItems(education) ? (
        <section key="education">
          <SectionHeading title="Education" />
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((item, index) => (
              <article
                key={`${item.institution}-${index}`}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
              >
                <h3 className="break-words font-black">{item.institution}</h3>
                <p className="mt-1 text-gray-700">
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null,
    certifications:
      sections.showCertifications && hasItems(certifications) ? (
        <section key="certifications">
          <SectionHeading title="Certifications" />
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((item, index) => (
              <article
                key={`${item.name}-${index}`}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
              >
                <h3 className="break-words font-black">{item.name}</h3>
                <p className="mt-1 break-words text-gray-700">{item.issuer}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null,
    achievements:
      sections.showAchievements && hasItems(achievements) ? (
        <section key="achievements">
          <SectionHeading title="Achievements" />
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 break-words text-gray-700"
              >
                {achievement}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    customSections:
      sections.showCustomSections && hasItems(customSections) ? (
        <CustomSections key="customSections" sections={customSections} />
      ) : null,
    contact: sections.showContact ? (
      <section key="contact" id="contact" className="border-t border-gray-200 pt-10">
        <SectionHeading title="Connect" />
        <SocialLinks links={links} onClick={actions.onContactClick} />
      </section>
    ) : null,
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700">
              <Terminal className="h-4 w-4" />
              {profile.title || "Portfolio"}
            </div>
            <h1 className="max-w-3xl break-words text-3xl font-black sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
            {profile.tagline && (
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
                {profile.tagline}
              </p>
            )}
            <div className="mt-8">
              <ContactActions profile={profile} settings={settings} actions={actions} />
            </div>
          </div>

          <aside className="rounded-lg border border-gray-200 bg-gray-950 p-5 text-white">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-300">
              <Code2 className="h-4 w-4" />
              Stack Snapshot
            </div>
            <SkillPills
              skills={skills.slice(0, 3)}
              pillClassName="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white"
            />
            {profile.location && (
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </p>
            )}
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-5 py-14 sm:px-8">
        {sectionOrder.map((section) => sectionBlocks[section])}
      </div>
    </main>
  );
};

export default MinimalDeveloperTheme;
