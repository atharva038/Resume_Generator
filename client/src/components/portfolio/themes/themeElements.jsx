import {
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

export const hasItems = (items) => Array.isArray(items) && items.length > 0;

export const getSocialIcon = (type) => {
  if (type === "github") return Github;
  if (type === "linkedin") return Linkedin;
  return ExternalLink;
};

export const ContactActions = ({
  profile,
  settings,
  actions,
  dark = false,
  primaryClassName = "",
  secondaryClassName = "",
}) => {
  const primary =
    primaryClassName ||
    (dark
      ? "bg-white text-gray-950 hover:bg-gray-100"
      : "bg-gray-950 text-white hover:bg-gray-800");
  const secondary =
    secondaryClassName ||
    (dark
      ? "border-white/20 text-white hover:bg-white/10"
      : "border-gray-300 text-gray-950 hover:bg-gray-50");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {profile.email && profile.showEmail && (
        <a
          href={`mailto:${profile.email}`}
          onClick={actions.onContactClick}
          className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors sm:justify-start ${primary}`}
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
      )}
      {profile.phone && profile.showPhone && (
        <a
          href={`tel:${profile.phone}`}
          onClick={actions.onContactClick}
          className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors sm:justify-start ${secondary}`}
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
      )}
      {settings.showResumeDownload !== false &&
        (actions.resumeDownloadUrl ? (
          <a
            href={actions.resumeDownloadUrl}
            download
            onClick={actions.onResumeClick}
            className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors sm:justify-start ${secondary}`}
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
        ) : (
          <button
            type="button"
            onClick={actions.onResumeClick}
            className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors sm:justify-start ${secondary}`}
          >
            <Download className="h-4 w-4" />
            Resume
          </button>
        ))}
    </div>
  );
};

export const SocialLinks = ({
  links = [],
  onClick,
  className = "",
  itemClassName = "",
}) => {
  if (!hasItems(links)) return null;

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}
    >
      {links.map((link) => {
        const Icon = getSocialIcon(link.type);

        return (
          <a
            key={`${link.type}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            onClick={onClick}
            className={
              itemClassName ||
              "inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-50 sm:justify-start"
            }
          >
            <Icon className="h-4 w-4" />
            {link.label || link.type}
          </a>
        );
      })}
    </div>
  );
};

export const ProjectLinks = ({project, onClick, className = ""}) => {
  const links = [
    ["Live", project.links?.live],
    ["GitHub", project.links?.github],
    ["Case Study", project.links?.caseStudy],
    ["Video", project.links?.video],
  ].filter(([, url]) => url);

  if (!hasItems(links)) return null;

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}
    >
      {links.map(([label, url]) => (
        <a
          key={`${project.id}-${label}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={onClick}
          className="inline-flex min-w-0 items-center gap-1.5 break-words text-sm font-bold"
        >
          {label}
          <ExternalLink className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
};

export const SkillPills = ({
  skills = [],
  className = "",
  pillClassName = "",
}) => {
  if (!hasItems(skills)) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {skills.flatMap((group) =>
        (group.items || []).map((skill) => (
          <span
            key={`${group.category}-${skill}`}
            className={
              pillClassName ||
              "rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
            }
          >
            {skill}
          </span>
        ))
      )}
    </div>
  );
};

export const CustomSections = ({
  sections = [],
  cardClassName = "min-w-0 rounded-lg border border-gray-200 bg-white p-5",
  textClassName = "text-gray-700",
}) => {
  if (!hasItems(sections)) return null;

  return (
    <>
      {sections.map((section, index) => (
        <section key={section.id || `${section.title}-${index}`}>
          <SectionHeading title={section.title || "More"} />
          <div className="grid gap-3 md:grid-cols-2">
            {(section.items || []).map((item) => (
              <div
                key={item}
                className={`${cardClassName} break-words ${textClassName}`}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  className = "",
}) => (
  <div className={`mb-6 min-w-0 ${className}`}>
    {eyebrow && (
      <p className="mb-2 text-xs font-bold uppercase text-gray-500">
        {eyebrow}
      </p>
    )}
    <h2 className="break-words text-2xl font-black text-gray-950 sm:text-3xl">
      {title}
    </h2>
    {description && (
      <p className="mt-2 max-w-2xl text-gray-600">{description}</p>
    )}
  </div>
);
