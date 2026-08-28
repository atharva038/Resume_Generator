import { Award, BookOpen, GraduationCap, Sparkles } from "lucide-react";
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

const ModernFresherTheme = ({ data }) => {
  const {
    profile,
    settings,
    actions,
    sections,
    sectionOrder,
    links,
    skills,
    projects,
    experience,
    education,
    certifications,
    achievements,
    customSections,
  } = data;

  const sectionBlocks = {
    education:
      sections.showEducation && hasItems(education) ? (
        <section key="education" id="education" className="scroll-mt-24 space-y-6">
          <SectionHeading
            eyebrow="Foundation"
            title="Education"
            description="Academic background and learning path."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((item, index) => (
              <motion.article
                key={`${item.institution}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
              >
                <BookOpen className="pt-accent-text mb-4 h-6 w-6 text-[var(--pt-accent)]" />
                <h3 className="break-words text-lg font-black text-gray-900 dark:text-white">
                  {item.institution}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-zinc-300 font-medium">
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
                {item.dateRange && (
                  <p className="mt-3 text-xs font-semibold text-gray-400 dark:text-zinc-500">
                    {item.dateRange}
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    skills:
      sections.showSkills && hasItems(skills) ? (
        <section key="skills" id="skills" className="scroll-mt-24 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
          <SectionHeading
            eyebrow="Toolkit"
            title="Skills"
            description="Tools and concepts ready for internships and junior roles."
          />
          <SkillPills
            skills={skills}
            pillClassName="pt-accent-surface pt-accent-text rounded-full bg-[var(--pt-accent-dim)] px-3.5 py-1.5 text-xs font-black text-[var(--pt-accent)] border border-[var(--pt-accent)]"
          />
        </section>
      ) : null,
    projects:
      sections.showProjects && hasItems(projects) ? (
        <section key="projects" id="projects" className="scroll-mt-24 space-y-6">
          <SectionHeading
            eyebrow="Practice"
            title="Projects"
            description="Hands-on work that shows learning, execution, and curiosity."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                whileHover={{ y: -3 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="pt-accent-surface pt-accent-text inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--pt-accent-dim)] text-xs font-black text-[var(--pt-accent)]">
                    {index + 1}
                  </div>
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
                          className="rounded-full bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-gray-700 dark:text-zinc-300 border border-gray-200/50 dark:border-white/5"
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
    experience:
      sections.showExperience && hasItems(experience) ? (
        <section key="experience" id="experience" className="scroll-mt-24 space-y-6">
          <SectionHeading
            eyebrow="Exposure"
            title="Experience"
            description="Internships, projects, and early professional roles."
          />
          <div className="space-y-4">
            {experience.map((item, index) => (
              <motion.article
                key={`${item.company}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 sm:p-7 shadow-sm space-y-3"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
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
    certifications:
      sections.showCertifications && hasItems(certifications) ? (
        <section key="certifications" id="certifications" className="scroll-mt-24 space-y-6">
          <SectionHeading
            eyebrow="Validation"
            title="Certifications"
            description="Certificates and verified course completions."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((item, index) => (
              <motion.article
                key={`${item.name}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
              >
                <Award className="pt-accent-text mb-4 h-6 w-6 text-[var(--pt-accent)]" />
                <h3 className="break-words text-base font-black text-gray-900 dark:text-white">
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
        <section key="achievements" id="achievements" className="scroll-mt-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-lg space-y-4">
          <h2 className="text-xl sm:text-2xl font-black">Highlights & Achievements</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <li key={achievement} className="rounded-2xl bg-white/10 backdrop-blur-xs p-4 break-words text-sm font-medium border border-white/10">
                {achievement}
              </li>
            ))}
          </ul>
        </section>
      ) : null,
    about:
      sections.showAbout && profile.about ? (
        <section key="about" id="about" className="scroll-mt-24 rounded-3xl bg-white dark:bg-zinc-900/90 border border-gray-200/90 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
          <SectionHeading title="About" />
          <p className="max-w-3xl break-words text-base leading-relaxed text-gray-700 dark:text-zinc-300 font-normal">
            {profile.about}
          </p>
        </section>
      ) : null,
    customSections:
      sections.showCustomSections && hasItems(customSections) ? (
        <CustomSections
          key="customSections"
          sections={customSections}
          cardClassName="min-w-0 rounded-2xl border border-gray-200/90 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
        />
      ) : null,
    contact: sections.showContact ? (
      <section key="contact" id="contact" className="scroll-mt-24 border-t border-gray-200/80 dark:border-white/10 pt-12 space-y-6">
        <SectionHeading title="Connect & Inquire" description="Feel free to reach out for roles, projects, or questions." />
        <SocialLinks links={links} onClick={actions.onContactClick} />
      </section>
    ) : null,
  };

  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-950 dark:text-zinc-100 transition-colors duration-200">
      <section id="hero" className="border-b border-gray-200/80 dark:border-white/10 bg-white dark:bg-zinc-900/70 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="space-y-5">
              <div className="pt-accent-surface pt-accent-text inline-flex items-center gap-2 rounded-full bg-[var(--pt-accent-dim)] border border-[var(--pt-accent)] px-3.5 py-1.5 text-xs font-bold text-[var(--pt-accent)] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[var(--pt-accent)]" />
                <span>Open to opportunities</span>
              </div>
              <h1 className="break-words text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
                {profile.name}
              </h1>
              <p className="pt-accent-text text-lg sm:text-xl font-bold text-[var(--pt-accent)]">
                {profile.title || "Early Career Professional"}
              </p>
              {profile.tagline && (
                <p className="max-w-2xl break-words text-base leading-relaxed text-gray-600 dark:text-zinc-300">
                  {profile.tagline}
                </p>
              )}
              <div className="pt-3">
                <ContactActions
                  profile={profile}
                  settings={settings}
                  actions={actions}
                  primaryClassName="pt-accent-fill bg-[var(--pt-accent)] text-[var(--pt-accent-text)] hover:opacity-90"
                  secondaryClassName="border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
                />
              </div>
            </div>

            <aside className="pt-accent-surface rounded-3xl border border-[var(--pt-accent)] bg-[var(--pt-accent-dim)] p-6 sm:p-7 shadow-sm space-y-4">
              <div className="pt-accent-text flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--pt-accent)]">
                <GraduationCap className="h-4 w-4" />
                <span>Learning & Profile Snapshot</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-gray-200/60 dark:border-white/5 shadow-2xs">
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{education.length}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400">Education</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-gray-200/60 dark:border-white/5 shadow-2xs">
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{projects.length}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400">Projects</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-gray-200/60 dark:border-white/5 shadow-2xs">
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{certifications.length}</div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400">Certificates</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-zinc-900 p-4 border border-gray-200/60 dark:border-white/5 shadow-2xs">
                  <div className="text-2xl font-black text-gray-900 dark:text-white">
                    {skills.reduce(
                      (count, group) => count + (group.items?.length || 0),
                      0
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-zinc-400">Skills</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-5 py-14 sm:px-8">
        {sectionOrder.map((section) => sectionBlocks[section])}
      </div>
    </main>
  );
};

export default ModernFresherTheme;
