import {useEffect, useRef} from "react";
import {MapPin, Zap} from "lucide-react";
import {
  ContactActions,
  CustomSections,
  ProjectLinks,
  SkillPills,
  SocialLinks,
  hasItems,
} from "./themeElements";

/* ─── Tilt effect on project cards ─── */
const useTiltEffect = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.02)`;
    };
    const onLeave = () => {
      el.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale(1)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
};

/* ─── Skill pill ─── */
const CyberSkillPill = ({skill}) => (
  <span
    style={{
      background: "var(--pt-accent-dim)",
      color: "var(--pt-accent)",
      border: "1px solid var(--pt-accent)",
      borderRadius: "4px",
      fontFamily: "var(--pt-heading-font)",
      fontSize: "0.7rem",
      padding: "2px 10px",
      fontWeight: 700,
      letterSpacing: "0.05em",
    }}
  >
    {skill}
  </span>
);

/* ─── Project card ─── */
const CyberProjectCard = ({project, onProjectClick}) => {
  const ref = useRef(null);
  useTiltEffect(ref);

  return (
    <article
      ref={ref}
      className="pt-tilt-card"
      style={{
        background: "var(--pt-surface)",
        border: "1px solid var(--pt-border)",
        borderRadius: "var(--pt-radius)",
        padding: "1.25rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
      }}
    >
      {/* Neon corner accent */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "3px",
          height: "100%",
          background: "var(--pt-accent)",
          boxShadow: "0 0 12px var(--pt-accent)",
          borderRadius: "4px 0 0 4px",
        }}
      />
      <h3
        style={{
          fontFamily: "var(--pt-heading-font)",
          color: "var(--pt-accent)",
          fontSize: "1rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          paddingLeft: "0.75rem",
        }}
      >
        {project.title}
      </h3>
      {project.description && (
        <p
          style={{
            color: "var(--pt-text-muted)",
            fontSize: "0.875rem",
            lineHeight: 1.7,
            marginBottom: "1rem",
            paddingLeft: "0.75rem",
          }}
        >
          {project.description}
        </p>
      )}
      {hasItems(project.technologies) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            paddingLeft: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          {project.technologies.map((tech) => (
            <CyberSkillPill key={tech} skill={tech} />
          ))}
        </div>
      )}
      <ProjectLinks
        project={project}
        onClick={onProjectClick}
        className="pl-3"
      />
    </article>
  );
};

/* ─── Section heading ─── */
const CyberSectionHeading = ({eyebrow, title, description}) => (
  <div style={{marginBottom: "1.5rem"}}>
    {eyebrow && (
      <p
        style={{
          fontFamily: "var(--pt-heading-font)",
          color: "var(--pt-accent)",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: "0.25rem",
        }}
      >
        {`// ${eyebrow}`}
      </p>
    )}
    <h2
      style={{
        fontFamily: "var(--pt-heading-font)",
        color: "var(--pt-text)",
        fontSize: "clamp(1.4rem, 4vw, 2rem)",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      }}
    >
      {title}
      <span style={{color: "var(--pt-accent)"}}>()</span>
    </h2>
    {description && (
      <p
        style={{
          color: "var(--pt-text-muted)",
          fontSize: "0.9rem",
          marginTop: "0.4rem",
        }}
      >
        {description}
      </p>
    )}
  </div>
);

/* ─── Main Theme ─── */
const CyberDevTheme = ({data}) => {
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
          <CyberSectionHeading
            eyebrow="builds"
            title="Projects"
            description="Selected builds — click through to see them live."
          />
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {featuredProjects.map((project) => (
              <CyberProjectCard
                key={project.id}
                project={project}
                onProjectClick={actions.onProjectClick}
              />
            ))}
          </div>
        </section>
      ) : null,

    skills:
      sections.showSkills && hasItems(skills) ? (
        <section key="skills">
          <CyberSectionHeading eyebrow="stack" title="Skills" />
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {skills.map((group, i) => (
              <div
                key={`${group.category}-${i}`}
                style={{
                  background: "var(--pt-surface)",
                  border: "1px solid var(--pt-border)",
                  borderRadius: "var(--pt-radius)",
                  padding: "1rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--pt-heading-font)",
                    color: "var(--pt-accent)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {group.category || "Skills"}
                </p>
                <div style={{display: "flex", flexWrap: "wrap", gap: "0.4rem"}}>
                  {(group.items || []).map((skill) => (
                    <CyberSkillPill key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null,

    about:
      sections.showAbout && profile.about ? (
        <section key="about">
          <CyberSectionHeading eyebrow="whoami" title="About" />
          <div
            style={{
              background: "var(--pt-surface)",
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius)",
              padding: "1.5rem",
              borderLeft: "3px solid var(--pt-accent)",
              boxShadow: "0 0 24px var(--pt-accent-dim)",
            }}
          >
            <p
              style={{
                color: "var(--pt-text)",
                lineHeight: 1.9,
                fontSize: "1rem",
              }}
            >
              {profile.about}
            </p>
          </div>
        </section>
      ) : null,

    experience:
      sections.showExperience && hasItems(experience) ? (
        <section key="experience">
          <CyberSectionHeading eyebrow="history" title="Experience" />
          <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            {experience.map((item, i) => (
              <div
                key={`${item.company}-${i}`}
                style={{
                  background: "var(--pt-surface)",
                  border: "1px solid var(--pt-border)",
                  borderRadius: "var(--pt-radius)",
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--pt-heading-font)",
                        color: "var(--pt-text)",
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{color: "var(--pt-accent)", fontSize: "0.875rem"}}>
                      {item.company}
                    </p>
                  </div>
                  {item.dateRange && (
                    <span
                      style={{
                        fontFamily: "var(--pt-heading-font)",
                        background: "var(--pt-accent-dim)",
                        color: "var(--pt-accent)",
                        border: "1px solid var(--pt-accent)",
                        borderRadius: "4px",
                        padding: "2px 10px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {item.dateRange}
                    </span>
                  )}
                </div>
                {hasItems(item.bullets) && (
                  <ul style={{paddingLeft: "1rem", color: "var(--pt-text-muted)"}}>
                    {item.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        style={{
                          fontSize: "0.875rem",
                          lineHeight: 1.7,
                          marginBottom: "0.25rem",
                          listStyleType: "none",
                          paddingLeft: "0.5rem",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--pt-accent)",
                            marginRight: "0.5rem",
                            fontFamily: "var(--pt-heading-font)",
                          }}
                        >
                          &gt;
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,

    education:
      sections.showEducation && hasItems(education) ? (
        <section key="education">
          <CyberSectionHeading eyebrow="init" title="Education" />
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            }}
          >
            {education.map((item, i) => (
              <div
                key={`${item.institution}-${i}`}
                style={{
                  background: "var(--pt-surface)",
                  border: "1px solid var(--pt-border)",
                  borderRadius: "var(--pt-radius)",
                  padding: "1.25rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--pt-heading-font)",
                    color: "var(--pt-text)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.institution}
                </h3>
                <p style={{color: "var(--pt-text-muted)", fontSize: "0.85rem"}}>
                  {[item.degree, item.field].filter(Boolean).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null,

    certifications:
      sections.showCertifications && hasItems(certifications) ? (
        <section key="certifications">
          <CyberSectionHeading eyebrow="verified" title="Certifications" />
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {certifications.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                style={{
                  background: "var(--pt-surface)",
                  border: "1px solid var(--pt-border)",
                  borderRadius: "var(--pt-radius)",
                  padding: "1rem",
                }}
              >
                <Zap
                  style={{
                    width: "1rem",
                    height: "1rem",
                    color: "var(--pt-accent)",
                    marginBottom: "0.5rem",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "var(--pt-heading-font)",
                    color: "var(--pt-text)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {item.name}
                </h3>
                <p style={{color: "var(--pt-text-muted)", fontSize: "0.8rem"}}>
                  {item.issuer}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null,

    achievements:
      sections.showAchievements && hasItems(achievements) ? (
        <section key="achievements">
          <CyberSectionHeading eyebrow="log" title="Achievements" />
          <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
            {achievements.map((achievement) => (
              <div
                key={achievement}
                style={{
                  background: "var(--pt-surface)",
                  border: "1px solid var(--pt-border)",
                  borderLeft: "2px solid var(--pt-accent)",
                  borderRadius: "var(--pt-radius)",
                  padding: "0.75rem 1rem",
                  color: "var(--pt-text-muted)",
                  fontSize: "0.875rem",
                }}
              >
                <span
                  style={{
                    color: "var(--pt-accent)",
                    fontFamily: "var(--pt-heading-font)",
                    marginRight: "0.5rem",
                  }}
                >
                  $
                </span>
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
      <section
        key="contact"
        id="contact"
        style={{
          borderTop: "1px solid var(--pt-border)",
          paddingTop: "2.5rem",
        }}
      >
        <CyberSectionHeading eyebrow="connect" title="Contact" />
        <SocialLinks links={links} onClick={actions.onContactClick} />
      </section>
    ) : null,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--pt-bg)",
        color: "var(--pt-text)",
        fontFamily: "var(--pt-body-font)",
      }}
    >
      {/* ─── Hero ─── */}
      <header
        style={{
          borderBottom: "1px solid var(--pt-border)",
          background: "var(--pt-surface)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Scanline overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            padding: "4rem 1.5rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Status badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--pt-accent-dim)",
              border: "1px solid var(--pt-accent)",
              borderRadius: "4px",
              padding: "0.25rem 0.75rem",
              marginBottom: "1.5rem",
              fontFamily: "var(--pt-heading-font)",
              fontSize: "0.7rem",
              color: "var(--pt-accent)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--pt-accent)",
                boxShadow: "0 0 6px var(--pt-accent)",
                display: "inline-block",
              }}
            />
            AVAILABLE_FOR_HIRE
          </div>

          <h1
            className="pt-cursor-blink"
            style={{
              fontFamily: "var(--pt-heading-font)",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              fontWeight: 700,
              color: "var(--pt-text)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            {profile.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--pt-heading-font)",
              color: "var(--pt-accent)",
              fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            {`> ${profile.title || "Software Engineer"}`}
          </p>

          {profile.tagline && (
            <p
              style={{
                color: "var(--pt-text-muted)",
                maxWidth: "560px",
                lineHeight: 1.7,
                fontSize: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {profile.tagline}
            </p>
          )}

          <div style={{display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center"}}>
            <ContactActions
              profile={profile}
              settings={settings}
              actions={actions}
              primaryClassName="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded transition-all"
              secondaryClassName="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded border transition-all"
            />
            {profile.location && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  color: "var(--pt-text-muted)",
                  fontSize: "0.875rem",
                  fontFamily: "var(--pt-heading-font)",
                }}
              >
                <MapPin style={{width: "0.875rem", height: "0.875rem"}} />
                {profile.location}
              </span>
            )}
          </div>
        </div>

        {/* Terminal mini card */}
        {hasItems(skills) && (
          <div
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "var(--pt-bg)",
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius)",
              padding: "1rem",
              maxWidth: "240px",
              display: "none",
            }}
            className="lg:block"
          >
            <div
              style={{
                display: "flex",
                gap: "0.3rem",
                marginBottom: "0.75rem",
              }}
            >
              {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: c,
                    display: "inline-block",
                  }}
                />
              ))}
            </div>
            <SkillPills
              skills={skills.slice(0, 2)}
              pillClassName="rounded px-2 py-0.5 text-xs font-bold"
            />
          </div>
        )}
      </header>

      {/* ─── Sections ─── */}
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "3.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
        }}
      >
        {sectionOrder.map((section) => sectionBlocks[section])}
      </div>
    </main>
  );
};

export default CyberDevTheme;
