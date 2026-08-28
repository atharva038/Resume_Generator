import { Code2, MapPin, Terminal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  ContactActions,
  CustomSections,
  ProjectLinks,
  SectionHeading,
  SkillPills,
  SocialLinks,
  hasItems,
} from "./themeElements";

const MinimalDeveloperTheme = ({ data }) => {
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
        <section key="projects" id="projects" className="scroll-mt-24 space-y-6">
          <SectionHeading
            eyebrow="Selected Builds"
            title="Projects"
            description="Featured work with practical links, stacks, and outcomes."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <motion.article
                key={project.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h3 className="break-words text-xl font-black text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="break-words text-sm leading-relaxed text-gray-600 dark:text-zinc-300">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 space-y-4">
                  {hasItems(project.technologies) && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="pt-accent-surface pt-accent-text rounded-full bg-[var(--pt-accent-dim)] px-2.5 py-1 text-xs font-bold text-[var(--pt-accent)] border border-[var(--pt-accent)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <ProjectLinks
                    project={project}
                    onClick={actions.onProjectClick}
                    className="text-gray-950 dark:text-white pt-2 border-t border-gray-100 dark:border-white/5"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    skills:
      sections.showSkills && hasItems(skills) ? (
        <section key="skills" id="skills" className="scroll-mt-24 space-y-6">
          <SectionHeading title="Skills & Capabilities" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, index) => (
              <motion.article
                key={`${group.category}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
              >
                <h3 className="break-words font-black text-base text-gray-900 dark:text-white">
                  {group.category || "Skills"}
                </h3>
                <SkillPills
                  skills={[group]}
                  className="mt-4"
                  pillClassName="rounded-full bg-gray-100 dark:bg-zinc-800 px-3 py-1 text-xs font-bold text-gray-800 dark:text-zinc-200 border border-gray-200/50 dark:border-white/5"
                />
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    about:
      sections.showAbout && profile.about ? (
        <section key="about" id="about" className="scroll-mt-24 grid gap-6 lg:grid-cols-[240px_1fr] p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/10 shadow-sm">
          <SectionHeading title="About" />
          <p className="max-w-3xl break-words text-base leading-relaxed text-gray-700 dark:text-zinc-300 font-normal">
            {profile.about}
          </p>
        </section>
      ) : null,
    experience:
      sections.showExperience && hasItems(experience) ? (
        <section key="experience" id="experience" className="scroll-mt-24 space-y-6">
          <SectionHeading title="Experience" />
          <div className="space-y-4">
            {experience.map((item, index) => (
              <motion.article
                key={`${item.company}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 sm:p-7 shadow-sm space-y-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="break-words text-lg font-black text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="pt-accent-text break-words text-sm font-semibold text-[var(--pt-accent)]">
                      {item.company}
                    </p>
                  </div>
                  {item.dateRange && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-600 dark:text-zinc-400 w-fit">
                      {item.dateRange}
                    </span>
                  )}
                </div>
                {hasItems(item.bullets) && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600 dark:text-zinc-300">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    education:
      sections.showEducation && hasItems(education) ? (
        <section key="education" id="education" className="scroll-mt-24 space-y-6">
          <SectionHeading title="Education" />
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((item, index) => (
              <motion.article
                key={`${item.institution}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
              >
                <h3 className="break-words font-black text-base text-gray-900 dark:text-white">
                  {item.institution}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-zinc-300 font-medium">
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
                {item.dateRange && (
                  <p className="mt-3 text-xs font-bold text-gray-400 dark:text-zinc-500">
                    {item.dateRange}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    certifications:
      sections.showCertifications && hasItems(certifications) ? (
        <section key="certifications" id="certifications" className="scroll-mt-24 space-y-6">
          <SectionHeading title="Certifications" />
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((item, index) => (
              <motion.article
                key={`${item.name}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
              >
                <h3 className="break-words font-black text-base text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="mt-1 break-words text-sm text-gray-600 dark:text-zinc-400">
                  {item.issuer}
                </p>
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    achievements:
      sections.showAchievements && hasItems(achievements) ? (
        <section key="achievements" id="achievements" className="scroll-mt-24 space-y-6">
          <SectionHeading title="Achievements & Honors" />
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-5 break-words text-sm text-gray-700 dark:text-zinc-300 shadow-xs"
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
      <section key="contact" id="contact" className="scroll-mt-24 border-t border-gray-200/80 dark:border-white/10 pt-12 space-y-6">
        <SectionHeading title="Connect & Collaborate" description="Let's discuss opportunities, projects, or questions." />
        <SocialLinks links={links} onClick={actions.onContactClick} />
      </section>
    ) : null,
  };

  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-950 dark:text-zinc-100 transition-colors duration-200">
      {/* Hero Section */}
      <section id="hero" className="border-b border-gray-200/80 dark:border-white/10 bg-white dark:bg-zinc-900/70 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_320px] lg:items-center">
          <div className="space-y-6">
            <div className="pt-accent-surface pt-accent-text inline-flex items-center gap-2 rounded-full bg-[var(--pt-accent-dim)] border border-[var(--pt-accent)] px-3.5 py-1.5 text-xs font-bold text-[var(--pt-accent)] shadow-xs">
              <Terminal className="h-3.5 w-3.5" />
              <span>{profile.title || "Software Engineer"}</span>
            </div>
            <h1 className="max-w-3xl break-words text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
              {profile.name}
            </h1>
            {profile.tagline && (
              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-gray-600 dark:text-zinc-300">
                {profile.tagline}
              </p>
            )}
            <div className="pt-2">
              <ContactActions profile={profile} settings={settings} actions={actions} />
            </div>
          </div>

          <aside className="rounded-3xl border border-gray-200/90 dark:border-white/10 bg-gray-900 dark:bg-black p-6 text-white shadow-xl space-y-4">
            <div className="pt-accent-text flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--pt-accent)]">
              <Code2 className="h-4 w-4" />
              <span>Stack Snapshot</span>
            </div>
            <SkillPills
              skills={skills.slice(0, 3)}
              pillClassName="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white border border-white/10"
            />
            {profile.location && (
              <p className="pt-2 border-t border-white/10 inline-flex items-center gap-2 text-xs font-medium text-gray-400">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>{profile.location}</span>
              </p>
            )}
          </aside>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="mx-auto max-w-6xl space-y-16 px-5 py-14 sm:px-8">
        {sectionOrder.map((section) => sectionBlocks[section])}
      </div>
    </main>
  );
};

export default MinimalDeveloperTheme;
