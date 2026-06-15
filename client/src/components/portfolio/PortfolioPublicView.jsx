import {
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const getSocialIcon = (type) => {
  if (type === "github") return Github;
  if (type === "linkedin") return Linkedin;
  return ExternalLink;
};

const hasItems = (items) => Array.isArray(items) && items.length > 0;

const PortfolioPublicView = ({
  portfolio,
  resume,
  projects = [],
  onContactClick,
  onProjectClick,
  onResumeClick,
  resumeDownloadUrl,
}) => {
  const sections = portfolio?.sections || {};

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
              {portfolio?.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {portfolio.location}
                </span>
              )}
              <span>{portfolio?.professionalTitle}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
              {resume?.name || portfolio?.title || "Portfolio"}
            </h1>
            {portfolio?.tagline && (
              <p className="mt-6 text-lg sm:text-xl text-gray-700 leading-8">
                {portfolio.tagline}
              </p>
            )}
            <div className="flex flex-wrap gap-3 mt-8">
              {portfolio?.contact?.email && (
                <a
                  href={`mailto:${portfolio.contact.email}`}
                  onClick={onContactClick}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-950 text-white font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              )}
              {portfolio?.contact?.phone && (
                <a
                  href={`tel:${portfolio.contact.phone}`}
                  onClick={onContactClick}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
              {portfolio?.settings?.showResumeDownload &&
                (resumeDownloadUrl ? (
                  <a
                    href={resumeDownloadUrl}
                    download
                    onClick={onResumeClick}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onResumeClick}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </button>
                ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16 space-y-16">
        {sections.showAbout !== false && portfolio?.about && (
          <section>
            <h2 className="text-2xl font-black mb-4">About</h2>
            <p className="text-gray-700 leading-8 max-w-3xl">
              {portfolio.about}
            </p>
          </section>
        )}

        {sections.showSkills !== false && hasItems(resume?.skills) && (
          <section>
            <h2 className="text-2xl font-black mb-6">Skills</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {resume.skills.map((group, index) => (
                <div
                  key={`${group.category}-${index}`}
                  className="border border-gray-200 rounded-lg p-5"
                >
                  <h3 className="font-bold mb-3">
                    {group.category || "Skills"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(group.items || []).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-gray-100 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sections.showProjects !== false && hasItems(projects) && (
          <section>
            <h2 className="text-2xl font-black mb-6">Projects</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project._id}
                  className="border border-gray-200 rounded-lg p-5"
                >
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  {project.shortDescription && (
                    <p className="text-gray-700 mt-3 leading-7">
                      {project.shortDescription}
                    </p>
                  )}
                  {hasItems(project.technologies) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-full bg-gray-100 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 mt-5">
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer"
                        onClick={onProjectClick}
                        className="inline-flex items-center gap-2 text-sm font-semibold"
                      >
                        Live <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={onProjectClick}
                        className="inline-flex items-center gap-2 text-sm font-semibold"
                      >
                        GitHub <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {sections.showExperience !== false && hasItems(resume?.experience) && (
          <section>
            <h2 className="text-2xl font-black mb-6">Experience</h2>
            <div className="space-y-5">
              {resume.experience.map((item, index) => (
                <article
                  key={`${item.company}-${index}`}
                  className="border-l-2 border-gray-900 pl-5"
                >
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.company} {item.location ? `- ${item.location}` : ""}
                  </p>
                  {hasItems(item.bullets) && (
                    <ul className="list-disc pl-5 mt-3 text-gray-700 space-y-2">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {sections.showEducation !== false && hasItems(resume?.education) && (
          <section>
            <h2 className="text-2xl font-black mb-6">Education</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {resume.education.map((item, index) => (
                <article
                  key={`${item.institution}-${index}`}
                  className="border border-gray-200 rounded-lg p-5"
                >
                  <h3 className="font-bold">{item.institution}</h3>
                  <p className="text-gray-700">
                    {[item.degree, item.field].filter(Boolean).join(", ")}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {sections.showContact !== false && (
          <section id="contact" className="border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-black mb-5">Connect</h2>
            <div className="flex flex-wrap gap-3">
              {(portfolio?.socialLinks || []).map((link) => {
                const Icon = getSocialIcon(link.type);
                return (
                  <a
                    key={`${link.type}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onContactClick}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 font-semibold"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label || link.type}
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default PortfolioPublicView;
