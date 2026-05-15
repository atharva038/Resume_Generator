import {Award, BookOpen, GraduationCap, Sparkles} from "lucide-react";
import {
  ContactActions,
  CustomSections,
  ProjectLinks,
  SectionHeading,
  SkillPills,
  SocialLinks,
  hasItems,
} from "./themeElements";

const ModernFresherTheme = ({data}) => {
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
        <section key="education">
          <SectionHeading
            eyebrow="Foundation"
            title="Education"
            description="Academic background and learning path."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((item, index) => (
              <article
                key={`${item.institution}-${index}`}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
              >
                <BookOpen className="mb-4 h-6 w-6 text-sky-700" />
                <h3 className="break-words text-lg font-black">
                  {item.institution}
                </h3>
                <p className="mt-2 text-gray-700">
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
                {item.dateRange && (
                  <p className="mt-3 text-sm font-semibold text-gray-500">
                    {item.dateRange}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null,
    skills:
      sections.showSkills && hasItems(skills) ? (
        <section key="skills" className="rounded-lg bg-white p-5 sm:p-6">
          <SectionHeading
            eyebrow="Toolkit"
            title="Skills"
            description="Tools and concepts ready for internships and junior roles."
          />
          <SkillPills
            skills={skills}
            pillClassName="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-950"
          />
        </section>
      ) : null,
    projects:
      sections.showProjects && hasItems(projects) ? (
        <section key="projects">
          <SectionHeading
            eyebrow="Practice"
            title="Projects"
            description="Hands-on work that shows learning, execution, and curiosity."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project, index) => (
              <article
                key={project.id}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
              >
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sm font-black text-sky-900">
                  {index + 1}
                </div>
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
                        className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <ProjectLinks
                  project={project}
                  onClick={actions.onProjectClick}
                  className="mt-5"
                />
              </article>
            ))}
          </div>
        </section>
      ) : null,
    experience:
      sections.showExperience && hasItems(experience) ? (
        <section key="experience">
          <SectionHeading
            eyebrow="Experience"
            title="Work & Internships"
            description="Roles, internships, and hands-on professional exposure."
          />
          <div className="space-y-4">
            {experience.map((item, index) => (
              <article
                key={`${item.company}-${index}`}
                className="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-black">{item.title}</h3>
                    <p className="break-words text-gray-700">{item.company}</p>
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
                      <li key={bullet} className="break-words">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
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
                <Award className="mb-3 h-5 w-5 text-amber-700" />
                <h3 className="break-words font-black">{item.name}</h3>
                <p className="mt-1 break-words text-gray-600">{item.issuer}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null,
    achievements:
      sections.showAchievements && hasItems(achievements) ? (
        <section key="achievements" className="rounded-lg bg-gray-950 p-6 text-white">
          <h2 className="text-2xl font-black">Highlights</h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <li key={achievement} className="rounded-lg bg-white/10 p-4 break-words">
                {achievement}
              </li>
            ))}
          </ul>
        </section>
      ) : null,
    about:
      sections.showAbout && profile.about ? (
        <section key="about">
          <SectionHeading title="About" />
          <p className="max-w-3xl break-words text-base leading-8 text-gray-700 sm:text-lg">
            {profile.about}
          </p>
        </section>
      ) : null,
    customSections:
      sections.showCustomSections && hasItems(customSections) ? (
        <CustomSections
          key="customSections"
          sections={customSections}
          cardClassName="min-w-0 rounded-lg border border-gray-200 bg-white p-5"
        />
      ) : null,
    contact: sections.showContact ? (
      <section key="contact" id="contact" className="border-t border-gray-200 pt-10">
        <SectionHeading title="Connect" />
        <SocialLinks links={links} onClick={actions.onContactClick} />
      </section>
    ) : null,
  };

  return (
    <main className="min-h-screen bg-[#f8fbff] text-gray-950">
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-900">
                <Sparkles className="h-4 w-4" />
                Open to opportunities
              </div>
              <h1 className="break-words text-3xl font-black sm:text-5xl lg:text-6xl">
                {profile.name}
              </h1>
              <p className="mt-4 text-xl font-bold text-sky-800">
                {profile.title || "Early Career Professional"}
              </p>
              {profile.tagline && (
                <p className="mt-5 max-w-2xl break-words text-base leading-8 text-gray-700 sm:text-lg">
                  {profile.tagline}
                </p>
              )}
              <div className="mt-8">
                <ContactActions
                  profile={profile}
                  settings={settings}
                  actions={actions}
                  primaryClassName="bg-sky-700 text-white hover:bg-sky-800"
                  secondaryClassName="border-gray-300 text-gray-950 hover:bg-gray-50"
                />
              </div>
            </div>

            <aside className="rounded-lg border border-sky-100 bg-sky-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-black text-sky-900">
                <GraduationCap className="h-5 w-5" />
                Learning Profile
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-4">
                  <div className="text-2xl font-black">{education.length}</div>
                  <div className="text-sm text-gray-600">Education</div>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <div className="text-2xl font-black">{projects.length}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <div className="text-2xl font-black">{certifications.length}</div>
                  <div className="text-sm text-gray-600">Certificates</div>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <div className="text-2xl font-black">
                    {skills.reduce(
                      (count, group) => count + (group.items?.length || 0),
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Skills</div>
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
