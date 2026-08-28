import { BriefcaseBusiness, CheckCircle2, MapPin, Sparkles } from "lucide-react";
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

const ProfessionalCorporateTheme = ({ data }) => {
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
    experience:
      sections.showExperience && hasItems(experience) ? (
        <section key="experience" id="experience" className="scroll-mt-24 space-y-6">
          <SectionHeading
            eyebrow="Career History"
            title="Professional Experience"
            description="A structured view of roles, leadership responsibilities, and quantified impact."
          />
          <div className="space-y-5">
            {experience.map((item, index) => (
              <motion.article
                key={`${item.company}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 sm:p-7 shadow-sm transition-all"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="break-words text-xl font-black text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="break-words text-sm font-semibold text-stone-600 dark:text-stone-400">
                      {item.company}
                      {item.location ? ` • ${item.location}` : ""}
                    </p>
                  </div>
                  {item.dateRange && (
                    <span className="rounded-full bg-stone-100 dark:bg-zinc-800 px-3 py-1 text-xs font-bold text-stone-700 dark:text-stone-300 w-fit">
                      {item.dateRange}
                    </span>
                  )}
                </div>
                {hasItems(item.bullets) && (
                  <ul className="mt-4 grid gap-2.5 md:grid-cols-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex min-w-0 gap-2.5 text-sm text-gray-700 dark:text-zinc-300">
                        <CheckCircle2 className="pt-accent-text mt-0.5 h-4 w-4 shrink-0 text-[var(--pt-accent)]" />
                        <span className="break-words leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    achievements:
      sections.showAchievements && hasItems(achievements) ? (
        <section key="achievements" id="achievements" className="scroll-mt-24 rounded-3xl bg-stone-900 dark:bg-black p-6 sm:p-8 text-white shadow-xl space-y-4 border border-stone-800">
          <h2 className="text-xl sm:text-2xl font-black">Executive Highlights & Key Achievements</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement}
                className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 break-words text-sm text-stone-200 leading-relaxed"
              >
                {achievement}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    skills:
      sections.showSkills && hasItems(skills) ? (
        <section key="skills" id="skills" className="scroll-mt-24 space-y-6">
          <SectionHeading title="Executive Capabilities & Skills" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, index) => (
              <motion.article
                key={`${group.category}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
              >
                <h3 className="break-words font-black text-base text-gray-900 dark:text-white">
                  {group.category || "Skills"}
                </h3>
                <SkillPills
                  skills={[group]}
                  className="mt-4"
                  pillClassName="rounded-full bg-stone-100 dark:bg-zinc-800 px-3 py-1 text-xs font-bold text-stone-800 dark:text-zinc-200 border border-stone-200/60 dark:border-white/5"
                />
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    projects:
      sections.showProjects && hasItems(projects) ? (
        <section key="projects" id="projects" className="scroll-mt-24 space-y-6">
          <SectionHeading
            eyebrow="Initiatives"
            title="Featured Projects & Strategic Initiatives"
            description="Projects and deliverables demonstrating technical and business leadership."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <motion.article
                key={project.id}
                whileHover={{ y: -3 }}
                className="min-w-0 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 sm:p-7 shadow-sm flex flex-col justify-between"
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
                          className="rounded-full bg-stone-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-stone-800 dark:text-zinc-300 border border-stone-200/50 dark:border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <ProjectLinks
                    project={project}
                    onClick={actions.onProjectClick}
                    className="text-stone-950 dark:text-white pt-2 border-t border-stone-100 dark:border-white/5"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      ) : null,
    education:
      sections.showEducation && hasItems(education) ? (
        <section key="education" id="education" className="scroll-mt-24 space-y-6">
          <SectionHeading title="Education & Academic Credentials" />
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((item, index) => (
              <motion.article
                key={`${item.institution}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
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
          <SectionHeading title="Professional Certifications" />
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((item, index) => (
              <motion.article
                key={`${item.name}-${index}`}
                whileHover={{ y: -2 }}
                className="min-w-0 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
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
    about:
      sections.showAbout && profile.about ? (
        <section key="about" id="about" className="scroll-mt-24 rounded-3xl bg-white dark:bg-zinc-900/90 border border-stone-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
          <SectionHeading title="Executive Summary & About" />
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
          cardClassName="min-w-0 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 p-6 shadow-sm"
        />
      ) : null,
    contact: sections.showContact ? (
      <section key="contact" id="contact" className="scroll-mt-24 border-t border-stone-200/80 dark:border-white/10 pt-12 space-y-6">
        <SectionHeading title="Executive Contact & Inquiries" description="Get in touch for advisory roles, leadership opportunities, or technical inquiries." />
        <SocialLinks
          links={links}
          onClick={actions.onContactClick}
          itemClassName="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-semibold text-stone-950 dark:text-zinc-100 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors sm:justify-start"
        />
      </section>
    ) : null,
  };

  return (
    <main className="min-h-screen bg-stone-50/60 dark:bg-zinc-950 text-gray-950 dark:text-zinc-100 transition-colors duration-200">
      <section id="hero" className="border-b border-stone-200/80 dark:border-white/10 bg-white dark:bg-zinc-900/70 py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_300px] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-white/5 px-3.5 py-1.5 text-xs font-bold text-stone-700 dark:text-zinc-300 shadow-xs">
              <Sparkles className="pt-accent-text h-3.5 w-3.5 text-[var(--pt-accent)]" />
              <span>Professional Portfolio</span>
            </div>
            <h1 className="break-words text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
              {profile.name}
            </h1>
            <p className="text-xl font-bold text-stone-800 dark:text-stone-300">
              {profile.title || "Professional"}
            </p>
            {profile.about && (
              <p className="max-w-3xl break-words text-base leading-relaxed text-gray-600 dark:text-zinc-300">
                {profile.about}
              </p>
            )}
            <div className="pt-3">
              <ContactActions
                profile={profile}
                settings={settings}
                actions={actions}
                primaryClassName="bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-gray-100 transition-colors"
                secondaryClassName="border-stone-300 dark:border-white/10 text-stone-950 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              />
            </div>
          </div>

          <aside className="rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200">
              <BriefcaseBusiness className="h-4 w-4" />
              <span>Experience Snapshot</span>
            </div>
            <div className="space-y-4 text-sm">
              {profile.location && (
                <div className="pb-3 border-b border-stone-100 dark:border-white/5">
                  <p className="text-xs font-bold text-stone-400 dark:text-zinc-500 uppercase">Location</p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                    <MapPin className="h-4 w-4 text-rose-500" />
                    <span>{profile.location}</span>
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-100 dark:border-white/5">
                  <p className="text-xs text-stone-500 dark:text-zinc-400 font-bold">Experience</p>
                  <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{experience.length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-100 dark:border-white/5">
                  <p className="text-xs text-stone-500 dark:text-zinc-400 font-bold">Skills</p>
                  <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
                    {skills.reduce(
                      (count, group) => count + (group.items?.length || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-5 py-14 sm:px-8">
        {sectionOrder.map((section) => sectionBlocks[section])}
      </div>
    </main>
  );
};

export default ProfessionalCorporateTheme;
