import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Instagram,
  Sun,
  Moon,
  X,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import "@/styles/magazine-theme.css";
import { resolveImageUrl } from "@/utils/imageUrlResolver";
import { magazineData as defaultData } from "@/data/magazinePortfolioData";

export default function MagazineTheme({
  data = {},
  isDarkMode: propDarkMode,
  toggleDarkMode: propToggleDarkMode,
  accentColor: propAccentColor,
}) {
  const [localDarkMode, setLocalDarkMode] = useState(false);
  const isDark = propDarkMode !== undefined ? propDarkMode : localDarkMode;
  const toggleDark =
    propToggleDarkMode || (() => setLocalDarkMode((prev) => !prev));

  // Interactive UI States
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", note: "" });
  const [transmitting, setTransmitting] = useState(false);

  // 1. Data Destructuring & Fallbacks
  const {
    profile = {},
    skills: rawSkills = [],
    projects: rawProjects = [],
    experience: rawExperience = [],
    education: rawEducation = [],
    links: rawLinks = [],
    actions = {},
    themeAccent,
  } = data || {};

  // 2. Profile Resolution
  const name = profile?.name || defaultData.profile.name;
  const rawTitle = profile?.title || profile?.professionalTitle || profile?.role || "";
  const role = rawTitle || defaultData.profile.role;
  const bio = profile?.about || profile?.bio || profile?.summary || defaultData.profile.biography.join(" ");
  const location = profile?.location || data?.contact?.location || defaultData.profile.location;
  const email = profile?.email || data?.contact?.email || defaultData.profile.email;
  const resumeUrl = actions?.resumeDownloadUrl || profile?.resumeUrl || "";
  const headline = profile?.headline || defaultData.profile.tagline;
  const portraitImg = resolveImageUrl(profile?.profileImage || profile?.heroImage || defaultData.profile.portraitImage);
  const heroCoverImg = resolveImageUrl(profile?.heroImage || defaultData.profile.heroImage);
  const socialLinks = useMemo(() => {
    const list = Array.isArray(rawLinks) ? rawLinks : [];
    const findUrl = (platform) => {
      const item = list.find(
        (l) =>
          (l.platform && l.platform.toLowerCase().includes(platform)) ||
          (l.name && l.name.toLowerCase().includes(platform)) ||
          (l.url && l.url.toLowerCase().includes(platform))
      );
      return item?.url || profile?.[platform] || profile?.socials?.[platform] || "";
    };
    return {
      email: email || "",
      github: findUrl("github"),
      linkedin: findUrl("linkedin"),
      twitter: findUrl("twitter") || findUrl("x"),
      instagram: findUrl("instagram"),
    };
  }, [rawLinks, profile, email]);

  const hasAnySocial = useMemo(() => {
    return Boolean(
      socialLinks.email ||
      socialLinks.github ||
      socialLinks.linkedin ||
      socialLinks.twitter ||
      socialLinks.instagram
    );
  }, [socialLinks]);

  // 3. Normalization for Projects
  const projects = useMemo(() => {
    if (Array.isArray(rawProjects) && rawProjects.length > 0) {
      return rawProjects.map((p, idx) => ({
        id: p.id || p._id || `proj-${idx}`,
        number: String(idx + 1).padStart(2, "0"),
        badge: idx === 0 ? "THIS WEEK'S HOT LIST" : `FEATURE / 0${idx + 1}`,
        title: p.title || p.name || "Untitled Production",
        subtitle: p.shortDescription || p.description || p.tagline || "Engineered digital product.",
        category: p.category || (p.tags && p.tags[0]) || "LIFESTYLE / TECH",
        year: p.year || "2026",
        image: resolveImageUrl(p.image || p.imageUrl || defaultData.featureProjects[idx % 3]?.image),
        liveUrl: p.liveUrl || p.url || p.links?.live || "",
        githubUrl: p.githubUrl || p.links?.github || "",
        idea: p.problem || p.idea || p.description || defaultData.featureProjects[idx % 3]?.idea,
        build: p.solution || p.build || "Architected with modern component systems, optimized rendering pipelines, and scalable APIs.",
        result: p.impact || p.result || "Shipped to production scale with verified latency benchmarks and resilient uptime.",
        technologies: Array.isArray(p.technologies)
          ? p.technologies
          : Array.isArray(p.tags)
          ? p.tags
          : typeof p.technologies === "string"
          ? p.technologies.split(",").map((t) => t.trim())
          : ["TypeScript", "React", "Design"],
      }));
    }
    return defaultData.featureProjects.map((p, idx) => ({
      ...p,
      badge: idx === 0 ? "THIS WEEK'S HOT LIST" : `FEATURE / 0${idx + 1}`,
    }));
  }, [rawProjects]);

  // Main Featured Hero Story & 3-Column Sub-Features
  const heroProject = projects[0] || defaultData.featureProjects[0];
  const subFeatureProjects = useMemo(() => {
    if (projects.length > 1) {
      return projects.slice(1, 4);
    }
    return [
      {
        id: "sub-1",
        title: "How To Build Scalable Micro-Services In 6 Easy Steps",
        category: "ENGINEERING",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
        subtitle: "A practical guide to resilient cloud microservices and event-driven architecture.",
      },
      {
        id: "sub-2",
        title: "Systems Architecture Review: A Deep Dive Into Distributed State",
        category: "ARCHITECTURE",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        subtitle: "Analyzing latency benchmarks and consensus protocols across real-time nodes.",
      },
      {
        id: "sub-3",
        title: "5 Core UI/UX Principles You Can Apply To All Your Digital Products",
        category: "DESIGN & UI",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
        subtitle: "Crafting interfaces that are intuitive, accessible, and delightful to use.",
      },
    ];
  }, [projects]);

  // 4. Normalization for Experience
  const experience = useMemo(() => {
    if (Array.isArray(rawExperience) && rawExperience.length > 0) {
      return rawExperience.map((exp) => ({
        period: exp.dateRange || exp.period || "2024 — PRESENT",
        year: exp.year || "2026",
        role: exp.role || exp.position || exp.title || "Senior Software Engineer",
        company: exp.company || exp.organization || "Independent Studio",
        location: exp.location || location,
        description: exp.description || exp.summary || "Led architecture and development for digital platforms.",
        contributions: Array.isArray(exp.contributions) && exp.contributions.length > 0
          ? exp.contributions
          : Array.isArray(exp.bullets) && exp.bullets.length > 0
          ? exp.bullets
          : Array.isArray(exp.highlights) && exp.highlights.length > 0
          ? exp.highlights
          : Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0
          ? exp.responsibilities
          : typeof exp.description === "string" && (exp.description.includes("•") || exp.description.includes("\n"))
          ? exp.description.split(/[\n•]/).filter(Boolean).map((s) => s.replace(/^[-*]\s*/, "").trim()).filter(Boolean)
          : [],
      }));
    }
    return defaultData.experience;
  }, [rawExperience, location]);

  // 4.5. Normalization for Education
  const educationList = useMemo(() => {
    if (Array.isArray(rawEducation) && rawEducation.length > 0) {
      return rawEducation.map((edu, idx) => ({
        id: idx,
        degree: edu.degree || edu.fieldOfStudy || edu.major || edu.field || "",
        institution: edu.institution || edu.school || edu.university || "",
        gpa: edu.gpa || edu.cgpa || edu.grade || edu.percentage || edu.score || "",
        location: edu.location || "",
        period: edu.dateRange || `${edu.startDate || ""} ${edu.startDate && edu.endDate ? "—" : ""} ${edu.endDate || ""}`.trim() || edu.year || "",
      }));
    }
    return [
      {
        id: 0,
        degree: "B.S. in Computer Science & Media Studies",
        institution: "University Institute of Art & Technology",
        gpa: "3.9 / 4.0",
        location: "New York, NY",
        period: "2018 — 2022",
      },
    ];
  }, [rawEducation]);

  // 5. Normalization for Skills
  const categorizedSkills = useMemo(() => {
    if (Array.isArray(rawSkills) && rawSkills.length > 0) {
      const result = {
        development: [],
        design: [],
        tools: [],
      };
      rawSkills.forEach((item) => {
        const skillName = typeof item === "string" ? item : item.name || item.skill || "";
        const category = (typeof item === "object" ? item.category || "" : "").toLowerCase();
        const entry = { name: skillName, level: "Core Discipline" };

        if (category.includes("design") || category.includes("ui") || category.includes("ux") || category.includes("art")) {
          result.design.push(entry);
        } else if (category.includes("tool") || category.includes("cloud") || category.includes("devops") || category.includes("git")) {
          result.tools.push(entry);
        } else {
          result.development.push(entry);
        }
      });
      if (result.development.length === 0) result.development = defaultData.toolbox.brandIdentity.map(s => ({ name: s.name, level: s.spec }));
      if (result.design.length === 0) result.design = defaultData.toolbox.editorialPrint.map(s => ({ name: s.name, level: s.spec }));
      if (result.tools.length === 0) result.tools = defaultData.toolbox.creativeTech.map(s => ({ name: s.name, level: s.spec }));
      return result;
    }
    return {
      development: defaultData.toolbox.brandIdentity.map(s => ({ name: s.name, level: s.spec })),
      design: defaultData.toolbox.editorialPrint.map(s => ({ name: s.name, level: s.spec })),
      tools: defaultData.toolbox.creativeTech.map(s => ({ name: s.name, level: s.spec })),
    };
  }, [rawSkills]);

  // Handle Contact Dispatch
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      if (email) {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(
          `MAGAZINE INQUIRY: ${contactForm.name || "New Message"}`
        )}&body=${encodeURIComponent(
          `From: ${contactForm.name} (${contactForm.email})\n\nMessage:\n${contactForm.note}`
        )}`;
      }
      toast.success("MESSAGE SENT TO EDITORIAL DESK", {
        style: {
          background: isDark ? "#1c1c1f" : "#ffffff",
          color: isDark ? "#f5f5f7" : "#111111",
          border: "1px solid #ff007f",
          fontFamily: "var(--mag-font-serif)",
          fontSize: "13px",
        },
      });
      setContactForm({ name: "", email: "", note: "" });
    }, 450);
  };

  const accent = propAccentColor || themeAccent || "#ff007f";

  return (
    <div
      className={`magazine-theme w-full min-h-screen ${isDark ? "dark-mode" : "light-mode"}`}
      data-mag-mode={isDark ? "dark" : "light"}
      style={{
        "--mag-accent-pink": accent,
      }}
    >
      {/* ==========================================================================
         1. TOP BOXED TAB UTILITY & NAVIGATION BAR (MATCHING REFERENCE)
         ========================================================================== */}
      <div className="mag-top-bar w-full border-b border-[var(--mag-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left Category Tabs */}
          <nav className="flex items-center overflow-x-auto w-full md:w-auto">
            <a href="#work" className="mag-nav-tab">WORK</a>
            <a href="#about" className="mag-nav-tab">ABOUT</a>
            <a href="#skills" className="mag-nav-tab">SKILLS</a>
            <a href="#experience" className="mag-nav-tab">EXPERIENCE</a>
            <a href="#education" className="mag-nav-tab">EDUCATION</a>
            <a href="#journal" className="mag-nav-tab">JOURNAL</a>
            <a href="#contact" className="mag-nav-tab">CONTACT</a>
          </nav>

          {/* Right Socials & Edition Toggle */}
          <div className="flex items-center gap-3 py-1.5 font-sans text-xs">
            {/* Social Icons (Only render if links are inserted) */}
            {hasAnySocial && (
              <div className="flex items-center gap-2.5 text-[var(--mag-text-muted)] border-r border-[var(--mag-border)] pr-3">
                {socialLinks.email && (
                  <a href={`mailto:${socialLinks.email}`} title="Email" className="hover:text-[var(--mag-accent-pink)] transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialLinks.github && (
                  <a href={socialLinks.github} target="_blank" rel="noreferrer" title="GitHub" className="hover:text-[var(--mag-accent-pink)] transition-colors">
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-[var(--mag-accent-pink)] transition-colors">
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noreferrer" title="Twitter" className="hover:text-[var(--mag-accent-pink)] transition-colors">
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram" className="hover:text-[var(--mag-accent-pink)] transition-colors">
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Day/Night Edition Toggle */}
            <button
              type="button"
              onClick={toggleDark}
              title="Toggle Day/Night Edition"
              className="p-1.5 border border-[var(--mag-border)] hover:border-[var(--mag-accent-pink)] text-[var(--mag-text-primary)] transition-colors cursor-pointer ml-1"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-[var(--mag-accent-pink)]" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         2. GIANT SCRIPT MASTHEAD (THE STYLE SPY SIGNATURE)
         ========================================================================== */}
      <div className="w-full bg-[var(--mag-bg-card)] border-b border-[var(--mag-border)] py-8 sm:py-12 lg:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a href="#hero" className="mag-masthead-script inline-block hover:opacity-90 transition-opacity">
            the style spy
          </a>
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--mag-text-muted)] mt-2">
            {name.toUpperCase()} • {role} • ISSUE 01 / 2026
          </div>
        </div>
      </div>

      {/* ==========================================================================
         MAIN MAGAZINE SPREAD
         ========================================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20">

        {/* ==========================================================================
           3. HERO / THIS WEEK'S HOT LIST FEATURE (EXACT MATCH TO REFERENCE)
           ========================================================================== */}
        <section id="hero" className="space-y-0">
          {/* Hot Pink Ribbon Flag */}
          <div className="flex items-center -mb-px">
            <span className="mag-ribbon-hot">
              {heroProject.badge || "THIS WEEK'S HOT LIST"}
            </span>
          </div>

          {/* Split Hero Card: Black Box on Left, Editorial Image on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-[var(--mag-border)] bg-[var(--mag-bg-card)] shadow-sm overflow-hidden">
            {/* Left Black Content Box */}
            <div className="lg:col-span-5 mag-hero-dark-box space-y-4">
              <div className="space-y-3">
                <div className="font-mono text-[10px] tracking-widest text-[var(--mag-accent-pink)] uppercase font-bold">
                  {heroProject.category} • FEATURED
                </div>
                <h2 className="mag-hero-headline">
                  {heroProject.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                {heroProject.subtitle || headline}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProject(heroProject)}
                  className="mag-view-link cursor-pointer"
                >
                  <span>+ View Post</span>
                </button>
              </div>
            </div>

            {/* Right Editorial Image Frame */}
            <div className="lg:col-span-7 relative overflow-hidden bg-[var(--mag-bg)] min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
              <img
                src={heroProject.image || heroCoverImg}
                alt={heroProject.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </section>

        {/* ==========================================================================
           4. 3-COLUMN SUB-FEATURE MAGAZINE STORY ROW (MATCHING REFERENCE)
           ========================================================================== */}
        <section id="work" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-[var(--mag-border)] pb-2">
            <h2 className="mag-section-script-title">
              featured stories &amp; productions
            </h2>
            <span className="font-mono text-xs text-[var(--mag-text-muted)]">CURATED ARCHIVE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {subFeatureProjects.map((item, idx) => (
              <article
                key={item.id || idx}
                onClick={() => setSelectedProject(item)}
                className="mag-sub-card flex flex-col cursor-pointer group"
              >
                {/* Image Frame */}
                <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 border-b border-[var(--mag-border)]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Italic Pink Headline & Caption */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h3 className="mag-sub-headline">
                    {item.title}
                  </h3>

                  <div className="pt-2 border-t border-[var(--mag-border)] flex items-center justify-between text-xs font-serif italic text-[var(--mag-text-muted)]">
                    <span className="font-mono text-[10px] tracking-wider uppercase">{item.category}</span>
                    <span className="text-[var(--mag-accent-pink)] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      + View Post
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ==========================================================================
           5. ABOUT THE EDITOR / DESIGNER
           ========================================================================== */}
        <section id="about" className="border border-[var(--mag-border)] bg-[var(--mag-bg-card)] p-6 sm:p-10 space-y-8">
          <div className="flex items-baseline justify-between border-b border-[var(--mag-border)] pb-2">
            <h2 className="mag-section-script-title">
              meet the creator
            </h2>
            <span className="font-mono text-xs text-[var(--mag-text-muted)]">ISSUE 01 // EDITORIAL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Portrait Photo Frame */}
            <div className="md:col-span-4 aspect-[4/5] border border-[var(--mag-border)] overflow-hidden bg-gray-100">
              <img
                src={portraitImg}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Narrative Bio & Details */}
            <div className="md:col-span-8 space-y-4">
              <div className="font-serif text-3xl sm:text-4xl font-normal text-[var(--mag-text-primary)]">
                {name}
              </div>
              <div className="font-mono text-xs uppercase text-[var(--mag-accent-pink)] font-semibold tracking-wider">
                {role} • {location}
              </div>

              <p className="text-sm sm:text-base text-[var(--mag-text-secondary)] font-sans leading-relaxed">
                {bio}
              </p>

              <blockquote className="font-serif italic text-lg sm:text-xl text-[var(--mag-text-primary)] border-l-2 border-[var(--mag-accent-pink)] pl-4 py-1">
                “{headline}”
              </blockquote>

              {resumeUrl && (
                <div className="pt-2">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--mag-bg-dark-box)] text-white hover:bg-[var(--mag-accent-pink)] font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Curriculum Vitae</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================================================
           6. SKILLS & TOOLBOX INDEX
           ========================================================================== */}
        <section id="skills" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-[var(--mag-border)] pb-2">
            <h2 className="mag-section-script-title">
              the toolbox &amp; craft
            </h2>
            <span className="font-mono text-xs text-[var(--mag-text-muted)]">DISCIPLINES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[var(--mag-border)] bg-[var(--mag-bg-card)] p-5 space-y-3">
              <div className="font-serif font-bold text-lg text-[var(--mag-text-primary)] border-b border-[var(--mag-border)] pb-2">
                01. ENGINEERING
              </div>
              <div className="space-y-2 text-xs font-mono">
                {categorizedSkills.development.map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                    <span>{s.name}</span>
                    <span className="text-[var(--mag-text-muted)]">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[var(--mag-border)] bg-[var(--mag-bg-card)] p-5 space-y-3">
              <div className="font-serif font-bold text-lg text-[var(--mag-text-primary)] border-b border-[var(--mag-border)] pb-2">
                02. DESIGN &amp; UI
              </div>
              <div className="space-y-2 text-xs font-mono">
                {categorizedSkills.design.map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                    <span>{s.name}</span>
                    <span className="text-[var(--mag-text-muted)]">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[var(--mag-border)] bg-[var(--mag-bg-card)] p-5 space-y-3">
              <div className="font-serif font-bold text-lg text-[var(--mag-text-primary)] border-b border-[var(--mag-border)] pb-2">
                03. TOOLS &amp; STACK
              </div>
              <div className="space-y-2 text-xs font-mono">
                {categorizedSkills.tools.map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                    <span>{s.name}</span>
                    <span className="text-[var(--mag-text-muted)]">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           7. CAREER TIMELINE & EXPERIENCE
           ========================================================================== */}
        <section id="experience" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-[var(--mag-border)] pb-2">
            <h2 className="mag-section-script-title">
              career chronicle &amp; timeline
            </h2>
            <span className="font-mono text-xs text-[var(--mag-text-muted)]">2018 — 2026</span>
          </div>

          <div className="border border-[var(--mag-border)] bg-[var(--mag-bg-card)] divide-y divide-[var(--mag-border)]">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-4 font-mono text-xs text-[var(--mag-accent-pink)] font-semibold">
                  {exp.period}
                </div>
                <div className="md:col-span-8 space-y-2">
                  <div className="font-serif text-xl font-bold text-[var(--mag-text-primary)]">
                    {exp.role} — <span className="font-normal text-[var(--mag-text-secondary)]">{exp.company}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--mag-text-secondary)] font-sans leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
           7.5. ACADEMIC QUALIFICATIONS / EDUCATION
           ========================================================================== */}
        {educationList.length > 0 && (
          <section id="education" className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-[var(--mag-border)] pb-2">
              <h2 className="mag-section-script-title">
                academic background &amp; qualifications
              </h2>
              <span className="font-mono text-xs text-[var(--mag-text-muted)]">
                {educationList.length} {educationList.length === 1 ? "DEGREE" : "DEGREES"}
              </span>
            </div>

            <div className="border border-[var(--mag-border)] bg-[var(--mag-bg-card)] divide-y divide-[var(--mag-border)]">
              {educationList.map((edu, idx) => (
                <div key={idx} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4">
                    <span className="font-mono text-xs text-[var(--mag-accent-pink)] font-semibold block">
                      {edu.period}
                    </span>
                    {edu.location && (
                      <span className="text-[11px] text-[var(--mag-text-muted)] block mt-0.5 font-sans">
                        {edu.location}
                      </span>
                    )}
                  </div>
                  <div className="md:col-span-8 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-serif text-xl font-bold text-[var(--mag-text-primary)]">
                        {edu.degree}
                      </div>
                      {edu.gpa && (
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-[var(--mag-accent-pink)]/40 bg-[var(--mag-accent-pink)]/10 text-[var(--mag-accent-pink)] font-bold">
                          CGPA / GRADE: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--mag-text-secondary)] font-sans">
                      {edu.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================================================================
           8. EDITORIAL JOURNAL / ARTICLES
           ========================================================================== */}
        <section id="journal" className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-[var(--mag-border)] pb-2">
            <h2 className="mag-section-script-title">
              the journal &amp; essays
            </h2>
            <span className="font-mono text-xs text-[var(--mag-text-muted)]">EDITORIAL WRITING</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {defaultData.journalNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedArticle(note)}
                className="mag-sub-card p-5 space-y-3 cursor-pointer group"
              >
                <div className="font-mono text-[10px] text-[var(--mag-accent-pink)] font-bold uppercase">
                  {note.tag || note.date}
                </div>
                <h3 className="mag-sub-headline">
                  {note.title}
                </h3>
                <p className="text-xs text-[var(--mag-text-secondary)] leading-relaxed font-sans">
                  {note.excerpt}
                </p>
                <div className="pt-2 border-t border-[var(--mag-border)] font-serif italic text-xs text-[var(--mag-accent-pink)] flex items-center gap-1">
                  <span>+ Read Full Essay</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
           9. CONTACT & EDITORIAL INQUIRY
           ========================================================================== */}
        <section id="contact" className="border border-[var(--mag-border)] bg-[var(--mag-bg-card)] p-6 sm:p-10 space-y-8">
          <div className="space-y-1 text-center max-w-xl mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--mag-accent-pink)]">
              CORRESPONDENCE // BACK COVER
            </span>
            <h2 className="mag-section-script-title">
              let&apos;s collaborate on something beautiful
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mag-text-secondary)] font-sans">
              For project inquiries, design commissions, and engineering advisory:
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto space-y-4 font-sans text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[var(--mag-text-muted)] uppercase mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="e.g. Eleanor Vance"
                className="w-full px-3 py-2 border border-[var(--mag-border)] bg-[var(--mag-bg)] text-[var(--mag-text-primary)] outline-none focus:border-[var(--mag-accent-pink)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--mag-text-muted)] uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="eleanor@example.com"
                className="w-full px-3 py-2 border border-[var(--mag-border)] bg-[var(--mag-bg)] text-[var(--mag-text-primary)] outline-none focus:border-[var(--mag-accent-pink)]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--mag-text-muted)] uppercase mb-1">
                Project Message
              </label>
              <textarea
                rows={4}
                required
                value={contactForm.note}
                onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
                placeholder="Tell me about your project, timeline, and goals..."
                className="w-full px-3 py-2 border border-[var(--mag-border)] bg-[var(--mag-bg)] text-[var(--mag-text-primary)] outline-none focus:border-[var(--mag-accent-pink)] resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={transmitting}
              className="w-full py-3 bg-[var(--mag-accent-pink)] hover:bg-[var(--mag-accent-pink-hover)] text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              {transmitting ? "Sending..." : "Submit Inquiry →"}
            </button>
          </form>
        </section>

        {/* ==========================================================================
           10. COLOPHON & FOOTER
           ========================================================================== */}
        <footer className="pt-6 border-t border-[var(--mag-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--mag-text-muted)] pb-12">
          <div>
            <span>THE STYLE SPY // SMARTNSHINE PORTFOLIO EDITION</span>
          </div>

          <div>
            &copy; 2026 {name.toUpperCase()} • ALL RIGHTS RESERVED
          </div>
        </footer>
      </main>

      {/* ==========================================================================
         CASE STUDY MODAL
         ========================================================================== */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="mag-modal-overlay"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="mag-modal-box p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--mag-border)] font-mono text-xs">
                <span className="text-[var(--mag-accent-pink)] font-bold">{selectedProject.category}</span>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="p-1 border border-[var(--mag-border)] hover:border-[var(--mag-accent-pink)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedProject.image && (
                <div className="aspect-video w-full overflow-hidden border border-[var(--mag-border)] bg-gray-100">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--mag-text-primary)]">
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-[var(--mag-text-secondary)] font-sans leading-relaxed">
                  {selectedProject.longDescription || selectedProject.description || selectedProject.subtitle}
                </p>
              </div>

              {(selectedProject.idea || selectedProject.build || selectedProject.result) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[var(--mag-border)] text-xs font-mono">
                  {selectedProject.idea && (
                    <div>
                      <div className="font-bold text-[var(--mag-accent-pink)] uppercase">01. THE IDEA</div>
                      <p className="text-[var(--mag-text-secondary)] font-sans mt-1">{selectedProject.idea}</p>
                    </div>
                  )}
                  {selectedProject.build && (
                    <div>
                      <div className="font-bold text-[var(--mag-accent-pink)] uppercase">02. THE BUILD</div>
                      <p className="text-[var(--mag-text-secondary)] font-sans mt-1">{selectedProject.build}</p>
                    </div>
                  )}
                  {selectedProject.result && (
                    <div>
                      <div className="font-bold text-[var(--mag-accent-pink)] uppercase">03. THE RESULT</div>
                      <p className="text-[var(--mag-text-secondary)] font-sans mt-1">{selectedProject.result}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-[var(--mag-border)] flex flex-wrap gap-3 font-mono text-xs">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[var(--mag-accent-pink)] text-white font-bold hover:opacity-90 inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live Post</span>
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 border border-[var(--mag-border)] hover:border-[var(--mag-accent-pink)] inline-flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Source Code</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================================================
         JOURNAL ARTICLE MODAL
         ========================================================================== */}
      <AnimatePresence>
        {selectedArticle && (
          <div
            className="mag-modal-overlay"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="mag-modal-box p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--mag-border)] font-mono text-xs">
                <span className="text-[var(--mag-accent-pink)] font-bold">{selectedArticle.tag || selectedArticle.date}</span>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="p-1 border border-[var(--mag-border)] hover:border-[var(--mag-accent-pink)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--mag-text-primary)]">
                  {selectedArticle.title}
                </h3>
                <div className="font-mono text-xs text-[var(--mag-text-muted)] uppercase">
                  BY {name.toUpperCase()} • ESSAYS // 2026
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--mag-border)] text-sm text-[var(--mag-text-secondary)] font-sans leading-relaxed space-y-3">
                <p>{selectedArticle.content}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

MagazineTheme.propTypes = {
  data: PropTypes.object,
  isDarkMode: PropTypes.bool,
  toggleDarkMode: PropTypes.func,
  accentColor: PropTypes.string,
};
