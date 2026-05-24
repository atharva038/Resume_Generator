const hasItems = (items) => Array.isArray(items) && items.length > 0;

const DEFAULT_SECTION_ORDER = [
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
  "achievements",
  "customSections",
  "contact",
];

const normalizeSections = (sections = {}) => ({
  showAbout: sections.showAbout !== false,
  showSkills: sections.showSkills !== false,
  showProjects: sections.showProjects !== false,
  showExperience: sections.showExperience !== false,
  showEducation: sections.showEducation !== false,
  showCertifications: sections.showCertifications !== false,
  showAchievements: sections.showAchievements !== false,
  showCustomSections: sections.showCustomSections !== false,
  showContact: sections.showContact !== false,
});

const getDateRange = (item = {}) => {
  const start = item.startDate || "";
  const end = item.current ? "Present" : item.endDate || "";

  return [start, end].filter(Boolean).join(" - ");
};

const pickArray = (primary, fallback) => {
  return Array.isArray(primary) ? primary : fallback || [];
};

const normalizeProject = (project = {}) => ({
  id: project._id || project.id || project.title,
  title: project.title || "Untitled Project",
  description:
    project.shortDescription ||
    project.description ||
    project.longDescription ||
    "",
  longDescription: project.longDescription || "",
  problem: project.problem || "",
  solution: project.solution || "",
  impact: project.impact || "",
  technologies: project.technologies || [],
  highlights: project.highlights || [],
  featured: Boolean(project.featured),
  links: project.links || {},
  images: project.images || [],
});

export const adaptPortfolioData = ({
  portfolio = {},
  resume = {},
  projects = [],
  mode = "public",
  onContactClick,
  onProjectClick,
  onResumeClick,
} = {}) => {
  const sections = normalizeSections(portfolio.sections);
  const sectionOrder = [
    ...new Set([
      ...(Array.isArray(portfolio.sectionOrder) ? portfolio.sectionOrder : []),
      ...DEFAULT_SECTION_ORDER,
    ]),
  ].filter((section) => DEFAULT_SECTION_ORDER.includes(section));
  const visibleProjects = projects
    .filter((project) => project.visible !== false)
    .map(normalizeProject);
  const featuredProjects = visibleProjects.filter((project) => project.featured);

  return {
    mode,
    portfolio,
    sections,
    sectionOrder,
    themeId: portfolio.themeId || 'minimalDeveloper',
    themeAccent: portfolio.themeAccent || '',
    settings: portfolio.settings || {},
    profile: {
      name: resume?.name || portfolio.title || "Portfolio",
      title: portfolio.professionalTitle || "",
      tagline: portfolio.tagline || resume?.summary || "",
      about: portfolio.about || resume?.summary || "",
      location: portfolio.location || "",
      email: portfolio.contact?.email || "",
      phone: portfolio.contact?.phone || "",
      showEmail: portfolio.contact?.showEmail !== false,
      showPhone: Boolean(portfolio.contact?.showPhone),
      profileImage: portfolio.profileImage || "",
      heroImage: portfolio.heroImage || "",
    },
    links: portfolio.socialLinks || [],
    skills: pickArray(portfolio.skills, resume?.skills),
    projects: visibleProjects,
    featuredProjects: hasItems(featuredProjects)
      ? featuredProjects
      : visibleProjects.slice(0, 3),
    experience: pickArray(portfolio.experience, resume?.experience).map((item) => ({
      ...item,
      dateRange: getDateRange(item),
    })),
    education: pickArray(portfolio.education, resume?.education).map((item) => ({
      ...item,
      dateRange: getDateRange(item),
    })),
    certifications: pickArray(portfolio.certifications, resume?.certifications),
    achievements: pickArray(portfolio.achievements, resume?.achievements),
    customSections: pickArray(portfolio.customSections, resume?.customSections),
    actions: {
      onContactClick,
      onProjectClick,
      onResumeClick,
    },
  };
};

export default adaptPortfolioData;
