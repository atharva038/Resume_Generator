import {BriefcaseBusiness, CheckCircle2, MapPin} from "lucide-react";
import {
  ContactActions,
  CustomSections,
  ProjectLinks,
  SectionHeading,
  SocialLinks,
  hasItems,
} from "./themeElements";

const ProfessionalCorporateTheme = ({data}) => {
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
        <section key="experience">
          <SectionHeading
            eyebrow="Career"
            title="Experience"
            description="A structured view of roles, responsibilities, and impact."
          />
          <div className="space-y-5">
            {experience.map((item, index) => (
              <article
                key={`${item.company}-${index}`}
                className="min-w-0 rounded-lg border border-stone-300 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="break-words text-xl font-black">{item.title}</h3>
                    <p className="break-words text-gray-700">
                      {item.company}
                      {item.location ? `, ${item.location}` : ""}
                    </p>
                  </div>
                  {item.dateRange && (
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-stone-700">
                      {item.dateRange}
                    </span>
                  )}
                </div>
                {hasItems(item.bullets) && (
                  <ul className="mt-5 grid gap-3 md:grid-cols-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex min-w-0 gap-3 text-gray-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                        <span className="break-words">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null,
    achievements:
      sections.showAchievements && hasItems(achievements) ? (
        <section key="achievements" className="rounded-lg bg-stone-900 p-6 text-white">
          <h2 className="text-2xl font-black">Key Achievements</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement}
                className="min-w-0 rounded-lg border border-white/15 p-4 break-words"
              >
                {achievement}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    skills:
      sections.showSkills && hasItems(skills) ? (
        <section key="skills">
          <SectionHeading title="Capabilities" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, index) => (
              <article
                key={`${group.category}-${index}`}
                className="min-w-0 rounded-lg border border-stone-300 bg-white p-5"
              >
                <h3 className="break-words font-black">
                  {group.category || "Skills"}
                </h3>
                <ul className="mt-4 space-y-2 text-gray-700">
                  {(group.items || []).map((skill) => (
                    <li key={skill} className="break-words">
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null,
    projects:
      sections.showProjects && hasItems(projects) ? (
        <section key="projects">
          <SectionHeading
            title="Selected Work"
            description="Projects, case work, and practical examples."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="min-w-0 rounded-lg border border-stone-300 bg-white p-5"
              >
                <h3 className="break-words text-xl font-black">{project.title}</h3>
                {project.description && (
                  <p className="mt-3 break-words leading-7 text-gray-700">
                    {project.description}
                  </p>
                )}
                {project.impact && (
                  <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-900 break-words">
                    {project.impact}
                  </p>
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
    education:
      sections.showEducation && hasItems(education) ? (
        <section key="education">
          <SectionHeading title="Education" />
          <div className="space-y-4">
            {education.map((item, index) => (
              <article
                key={`${item.institution}-${index}`}
                className="min-w-0 rounded-lg border border-stone-300 bg-white p-5"
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
          <div className="space-y-4">
            {certifications.map((item, index) => (
              <article
                key={`${item.name}-${index}`}
                className="min-w-0 rounded-lg border border-stone-300 bg-white p-5"
              >
                <h3 className="break-words font-black">{item.name}</h3>
                <p className="mt-1 break-words text-gray-700">{item.issuer}</p>
              </article>
            ))}
          </div>
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
          cardClassName="min-w-0 rounded-lg border border-stone-300 bg-white p-5"
        />
      ) : null,
    contact: sections.showContact ? (
      <section key="contact" id="contact" className="border-t border-stone-300 pt-10">
        <SectionHeading title="Contact" />
        <SocialLinks
          links={links}
          onClick={actions.onContactClick}
          itemClassName="inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-950 hover:bg-stone-50 sm:justify-start"
        />
      </section>
    ) : null,
  };

  return (
    <main className="min-h-screen bg-[#f7f7f3] text-gray-950">
      <section className="border-b border-stone-300 bg-[#fbfbf8]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase text-stone-600">
              Professional Portfolio
            </p>
            <h1 className="break-words text-3xl font-black sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-4 text-xl font-bold text-stone-800">
              {profile.title || "Professional"}
            </p>
            {profile.about && (
              <p className="mt-6 max-w-3xl break-words text-base leading-8 text-gray-700 sm:text-lg">
                {profile.about}
              </p>
            )}
            <div className="mt-8">
              <ContactActions
                profile={profile}
                settings={settings}
                actions={actions}
                primaryClassName="bg-stone-900 text-white hover:bg-stone-800"
                secondaryClassName="border-stone-300 text-stone-950 hover:bg-white"
              />
            </div>
          </div>

          <aside className="rounded-lg border border-stone-300 bg-white p-5">
            <BriefcaseBusiness className="mb-4 h-7 w-7 text-stone-800" />
            <div className="space-y-4 text-sm">
              {profile.location && (
                <div>
                  <p className="font-bold text-stone-500">Location</p>
                  <p className="mt-1 inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </p>
                </div>
              )}
              <div>
                <p className="font-bold text-stone-500">Experience Entries</p>
                <p className="mt-1 text-2xl font-black">{experience.length}</p>
              </div>
              <div>
                <p className="font-bold text-stone-500">Core Skills</p>
                <p className="mt-1 text-2xl font-black">
                  {skills.reduce(
                    (count, group) => count + (group.items?.length || 0),
                    0
                  )}
                </p>
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
