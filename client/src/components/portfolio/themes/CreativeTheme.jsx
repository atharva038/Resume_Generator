import { useEffect, useRef, useState } from "react";
import { ExternalLink, Palette, Sparkles, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  CustomSections,
  ProjectLinks,
  SectionHeading,
  SocialLinks,
  hasItems,
  getSocialIcon,
} from "./themeElements";

/* ─── Floating blob decoration ─── */
const Blob = ({ style }) => (
  <div
    aria-hidden="true"
    className="pt-blob"
    style={{
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(80px)",
      opacity: 0.35,
      pointerEvents: "none",
      background: "var(--pt-gradient, var(--pt-accent))",
      ...style,
    }}
  />
);

/* ─── Magnetic Button Component ─── */
const MagneticButton = ({ children, onClick, href, className, target, rel }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      style={{ display: "inline-block" }}
    >
      {children}
    </Component>
  );
};

/* ─── Marquee Component ─── */
const Marquee = ({ children, speed = 40, direction = "left" }) => {
  const xStart = direction === "left" ? "0%" : "-100%";
  const xEnd = direction === "left" ? "-100%" : "0%";

  return (
    <div style={{ overflow: "hidden", display: "flex", whiteSpace: "nowrap", position: "relative" }}>
      <motion.div
        initial={{ x: xStart }}
        animate={{ x: xEnd }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
        style={{ display: "flex", flexShrink: 0, paddingRight: direction === "left" ? "1rem" : 0, paddingLeft: direction === "right" ? "1rem" : 0 }}
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ x: xStart }}
        animate={{ x: xEnd }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
        style={{ display: "flex", flexShrink: 0, paddingRight: direction === "left" ? "1rem" : 0, paddingLeft: direction === "right" ? "1rem" : 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ─── Project Card (Bento/Slider style) ─── */
const CreativeProjectCard = ({ project, onProjectClick }) => {
  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        background: "var(--pt-surface)",
        border: "1px solid var(--pt-border)",
        borderRadius: "var(--pt-radius)",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minWidth: "300px",
        height: "100%",
        flex: "0 0 auto",
        scrollSnapAlign: "start",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "var(--pt-gradient, var(--pt-accent))",
        }}
      />
      <div>
        <h3
          style={{
            color: "var(--pt-text)",
            fontFamily: "var(--pt-heading-font)",
            fontSize: "1.25rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
            marginTop: "0.5rem",
          }}
        >
          {project.title}
        </h3>
        {project.description && (
          <p
            style={{
              color: "var(--pt-text-muted)",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {project.description}
          </p>
        )}
      </div>

      <div>
        {hasItems(project.technologies) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                style={{
                  background: "var(--pt-accent-dim)",
                  color: "var(--pt-text)",
                  borderRadius: "1rem",
                  fontSize: "0.75rem",
                  padding: "4px 10px",
                  fontWeight: 600,
                }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span style={{ fontSize: "0.75rem", color: "var(--pt-text-muted)", padding: "4px" }}>
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
        <ProjectLinks project={project} onClick={onProjectClick} />
      </div>
    </motion.article>
  );
};

/* ─── Main Theme ─── */
const CreativeTheme = ({ data }) => {
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
    about: sections.showAbout && profile.about ? (
      <section key="about" className="pt-section">
        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: "var(--pt-surface)",
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius)",
              padding: "2rem",
              position: "relative",
              overflow: "hidden",
              gridColumn: "1 / -1"
            }}
          >
            <SectionHeading eyebrow="My Story" title="About" />
            <p
              style={{
                color: "var(--pt-text)",
                lineHeight: 1.9,
                fontSize: "1.1rem",
                maxWidth: "800px"
              }}
            >
              {profile.about}
            </p>
          </motion.div>
        </div>
      </section>
    ) : null,

    skills: sections.showSkills && hasItems(skills) ? (() => {
      const allSkills = skills.flatMap((group) => group.items || []);
      if (allSkills.length === 0) return null;
      
      // Only one line if less than 6 skills
      const isSingleLine = allSkills.length < 6;
      const midpoint = isSingleLine ? allSkills.length : Math.ceil(allSkills.length / 2);
      const row1 = allSkills.slice(0, midpoint);
      const row2 = allSkills.slice(midpoint);

      return (
        <section key="skills" className="pt-section" style={{ overflow: "hidden", padding: "2rem 0" }}>
          <SectionHeading eyebrow="Toolkit" title="Skills & Tech" style={{ paddingLeft: "1.5rem", marginBottom: "2rem" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Marquee speed={35} direction="left">
              {row1.map((skill, j) => (
                <div
                  key={`${skill}-${j}`}
                  style={{
                    background: "var(--pt-surface)",
                    border: "1px solid var(--pt-border)",
                    borderRadius: "2rem",
                    padding: "0.6rem 1.25rem",
                    marginRight: "1rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--pt-text)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Sparkles style={{ width: "0.9rem", height: "0.9rem", color: "var(--pt-accent)" }} />
                  {skill}
                </div>
              ))}
            </Marquee>
            {row2.length > 0 && (
              <Marquee speed={40} direction="right">
                {row2.map((skill, j) => (
                  <div
                    key={`${skill}-${j}`}
                    style={{
                      background: "var(--pt-surface)",
                      border: "1px solid var(--pt-border)",
                      borderRadius: "2rem",
                      padding: "0.6rem 1.25rem",
                      marginLeft: "1rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--pt-text)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <Sparkles style={{ width: "0.9rem", height: "0.9rem", color: "var(--pt-accent)" }} />
                    {skill}
                  </div>
                ))}
              </Marquee>
            )}
          </div>
        </section>
      );
    })() : null,

    projects: sections.showProjects && hasItems(projects) ? (
      <section key="projects" className="pt-section">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects"
          description="Swipe through some of my favorite builds and experiments."
        />
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "1.5rem",
            padding: "1rem 0 2rem",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none", // Hide scrollbar in Firefox
          }}
          className="scrollbar-hide"
        >
          {featuredProjects.map((project) => (
            <CreativeProjectCard
              key={project.id}
              project={project}
              onProjectClick={actions.onProjectClick}
            />
          ))}
        </div>
      </section>
    ) : null,

    experience: sections.showExperience && hasItems(experience) ? (
      <section key="experience" className="pt-section">
        <SectionHeading eyebrow="Journey" title="Experience" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {experience.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={`${item.company}-${i}`}
              style={{
                background: "var(--pt-surface)",
                border: "1px solid var(--pt-border)",
                borderRadius: "var(--pt-radius)",
                padding: "1.5rem",
                borderLeft: "4px solid var(--pt-accent)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--pt-heading-font)",
                      color: "var(--pt-text)",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: "var(--pt-accent)", fontSize: "0.95rem", fontWeight: 600 }}>
                    {item.company}
                  </p>
                </div>
                {item.dateRange && (
                  <span
                    style={{
                      background: "var(--pt-accent-dim)",
                      color: "var(--pt-text)",
                      border: "1px solid var(--pt-border)",
                      borderRadius: "var(--pt-radius)",
                      padding: "4px 12px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      height: "fit-content",
                    }}
                  >
                    {item.dateRange}
                  </span>
                )}
              </div>
              {hasItems(item.bullets) && (
                <ul style={{ paddingLeft: "1.2rem", color: "var(--pt-text-muted)" }}>
                  {item.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    ) : null,

    education: sections.showEducation && hasItems(education) ? (
      <section key="education" className="pt-section">
        <SectionHeading eyebrow="Foundation" title="Education" />
        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {education.map((item, i) => (
            <motion.div
              whileHover={{ scale: 1.03 }}
              key={`${item.institution}-${i}`}
              style={{
                background: "var(--pt-surface)",
                border: "1px solid var(--pt-border)",
                borderRadius: "var(--pt-radius)",
                padding: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--pt-heading-font)",
                  color: "var(--pt-text)",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  marginBottom: "0.5rem",
                }}
              >
                {item.institution}
              </h3>
              <p style={{ color: "var(--pt-text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
                {[item.degree, item.field].filter(Boolean).join(", ")}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    ) : null,

    contact: sections.showContact ? (
      <section
        key="contact"
        id="contact"
        style={{
          borderTop: "1px solid var(--pt-border)",
          paddingTop: "4rem",
          paddingBottom: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <SectionHeading eyebrow="Get in Touch" title="Let's build something." style={{ alignItems: "center" }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
          {(links || []).map((link) => (
            <MagneticButton
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={actions.onContactClick}
              className="group"
            >
              <div style={{
                background: "var(--pt-surface)",
                border: "1px solid var(--pt-border)",
                padding: "0.75rem 1.5rem",
                borderRadius: "3rem",
                color: "var(--pt-text)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "background 0.2s"
              }}>
                <ArrowRight className="w-4 h-4 group-hover:text-[var(--pt-accent)] transition-colors" />
                {link.label || link.type}
              </div>
            </MagneticButton>
          ))}
        </div>
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
        overflowX: "hidden"
      }}
    >
      {/* ─── Bento Hero ─── */}
      <header
        style={{
          position: "relative",
          padding: "4rem 1.5rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridAutoRows: "minmax(120px, auto)",
          zIndex: 1,
        }}
      >
        <Blob style={{ width: "600px", height: "600px", top: "-200px", right: "-100px", opacity: 0.15 }} />
        <Blob style={{ width: "400px", height: "400px", bottom: "10%", left: "-150px", opacity: 0.2, animationDelay: "2s" }} />

        {/* Main Title Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "var(--pt-surface)",
            border: "1px solid var(--pt-border)",
            borderRadius: "var(--pt-radius)",
            padding: "3rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden"
          }}
          className="col-span-12 md:col-span-8"
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--pt-accent-dim)",
              border: "1px solid var(--pt-border)",
              borderRadius: "2rem",
              padding: "0.375rem 1rem",
              marginBottom: "1.5rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--pt-accent)",
              textTransform: "uppercase",
              width: "fit-content"
            }}
          >
            <Palette style={{ width: "1rem", height: "1rem" }} />
            Creative Profile
          </div>

          <h1
            style={{
              fontFamily: "var(--pt-heading-font)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: "1rem",
              background: "var(--pt-gradient, var(--pt-accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {profile.name}
          </h1>

          <p
            style={{
              fontFamily: "var(--pt-heading-font)",
              fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
              fontWeight: 600,
              color: "var(--pt-text)",
            }}
          >
            {profile.title || "Creative Professional"}
          </p>

          {/* Social Links Row in Title Card */}
          {hasItems(links) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
              {links.map((link) => {
                const Icon = getSocialIcon(link.type);
                return (
                  <a
                    key={`${link.type}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "var(--pt-accent-dim)",
                      color: "var(--pt-text)",
                      border: "1px solid var(--pt-border)",
                      transition: "all 0.2s"
                    }}
                    className="hover:bg-[var(--pt-accent)] hover:text-white hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Action/CTA Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "var(--pt-gradient, var(--pt-accent))",
            borderRadius: "var(--pt-radius)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.25rem",
            color: "white",
            position: "relative",
            overflow: "hidden"
          }}
          className="col-span-12 md:col-span-4"
        >
          {/* Decorative subtle visual bloom inside gradient card */}
          <div 
            style={{
              position: "absolute",
              top: "-20%",
              right: "-20%",
              width: "120px",
              height: "120px",
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              filter: "blur(20px)",
              pointerEvents: "none"
            }}
          />

          <p style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.9, fontWeight: 700, marginBottom: "-0.25rem" }}>
            Get in touch
          </p>

          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0.75rem", width: "100%" }}>
            {settings?.showResumeDownload && (
              <MagneticButton onClick={actions.onResumeClick}>
                <div style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", textAlign: "center", fontSize: "0.9rem", fontWeight: 700, transition: "all 0.2s" }} className="hover:bg-white hover:text-black hover:scale-105 border border-white/10">
                  View Resume
                </div>
              </MagneticButton>
            )}
            {profile.email && profile.showEmail && (
              <MagneticButton href={`mailto:${profile.email}`}>
                <div style={{ background: "white", color: "#111827", padding: "0.65rem 1.25rem", borderRadius: "0.5rem", textAlign: "center", fontSize: "0.9rem", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", transition: "all 0.2s" }} className="hover:scale-105 hover:bg-gray-100 shadow-md">
                  <Mail className="w-4 h-4" /> Say Hello
                </div>
              </MagneticButton>
            )}
          </div>
        </motion.div>

        {/* Tagline Box */}
        {profile.tagline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "var(--pt-surface)",
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius)",
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className={profile.location ? "col-span-12 md:col-span-8" : "col-span-12"}
          >
            <p
              style={{
                color: "var(--pt-text-muted)",
                lineHeight: 1.8,
                fontSize: "1.1rem",
                fontWeight: 500,
                textAlign: "center",
                maxWidth: "800px",
                margin: "0 auto"
              }}
            >
              "{profile.tagline}"
            </p>
          </motion.div>
        )}

        {/* Location/Status Card */}
        {profile.location && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: "var(--pt-surface)",
              border: "1px solid var(--pt-border)",
              borderRadius: "var(--pt-radius)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
            className="col-span-12 md:col-span-4"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div 
                style={{ 
                  background: "var(--pt-accent-dim)", 
                  padding: "0.5rem", 
                  borderRadius: "0.5rem",
                  color: "var(--pt-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--pt-text-muted)", fontWeight: 700 }}>Based In</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--pt-text)", marginTop: "0.1rem" }}>
                  {profile.location}
                </p>
              </div>
            </div>
            
            {/* Pulsing Status Dot Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--pt-text-muted)" }}>
              <span style={{ position: "relative", display: "flex", width: "8px", height: "8px" }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Open to new opportunities
            </div>
          </motion.div>
        )}
      </header>

      {/* ─── Main Content ─── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem 4rem",
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

export default CreativeTheme;
