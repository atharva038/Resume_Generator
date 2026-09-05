import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import SEO from "@/components/common/SEO";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Eye,
  Globe2,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  User,
  Phone,
  Rocket,
  Briefcase,
  GraduationCap,
  Trophy,
  Layers,
  Award,
  Palette,
  Sliders,
  Search,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { portfolioAPI } from "@/api/portfolio.api";
import { portfolioThemeList } from "@/components/portfolio/themes/themeRegistry";
import { useAuth } from "@/hooks/useAuth";
import { useNavigationBlocker } from "@/context/NavigationBlockerContext";
import PortfolioEditorHeader from "@/components/portfolio/PortfolioEditorHeader";
import PortfolioPanel from "@/components/portfolio/PortfolioPanel";

const blankProject = {
  title: "",
  shortDescription: "",
  longDescription: "",
  problem: "",
  solution: "",
  impact: "",
  role: "",
  duration: "",
  technologies: [],
  links: {
    live: "",
    github: "",
    caseStudy: "",
    video: "",
  },
  images: [],
  highlights: [],
  featured: false,
  visible: true,
};

const socialLinkTypes = [
  "linkedin",
  "github",
  "twitter",
  "website",
  "leetcode",
  "behance",
  "dribbble",
  "other",
];

const getProjectDescriptionPreview = (project) => {
  return (
    project.shortDescription ||
    project.longDescription ||
    project.highlights?.join(" ") ||
    "No description yet"
  );
};

const getProjectTechnologiesText = (project) => {
  if (project.technologiesText !== undefined) return project.technologiesText;
  return (project.technologies || []).join(", ");
};

const getProjectHighlightsText = (project) => {
  if (project.highlightsText !== undefined) return project.highlightsText;
  return (project.highlights || []).join("\n");
};

const getProjectImagesText = (project) => {
  if (project.imagesText !== undefined) return project.imagesText;
  return (project.images || [])
    .map((image) => [image.url, image.alt].filter(Boolean).join(" | "))
    .join("\n");
};

const imageLinesToArray = (value) =>
  String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [url, ...altParts] = line.split("|").map((part) => part.trim());

      return {
        url,
        alt: altParts.join(" | "),
        isCover: index === 0,
      };
    });

const getProjectUpdatePayload = (project) => ({
  title: project.title,
  shortDescription: project.shortDescription || "",
  longDescription: project.longDescription || "",
  problem: project.problem || "",
  solution: project.solution || "",
  impact: project.impact || "",
  role: project.role || "",
  duration: project.duration || "",
  technologies: getProjectTechnologiesText(project)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  links: {
    live: project.links?.live || "",
    github: project.links?.github || "",
    caseStudy: project.links?.caseStudy || "",
    video: project.links?.video || "",
  },
  images: imageLinesToArray(getProjectImagesText(project)),
  highlights: linesToArray(getProjectHighlightsText(project)),
  featured: Boolean(project.featured),
  visible: project.visible !== false,
});

const getExistingOrFallback = (existing, fallback) => {
  return Array.isArray(existing) ? existing : fallback || [];
};

const linesToArray = (value) => {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const commaToArray = (value) => {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const stableStringify = (value) => JSON.stringify(value || null);

const getEditorSnapshot = ({ form, projects }) =>
  stableStringify({
    form,
    projects: (projects || [])
      .filter((project) => project._id)
      .map((project) => getProjectUpdatePayload(project)),
  });

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

const sectionLabels = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  certifications: "Certifications",
  achievements: "Achievements",
  customSections: "Custom Sections",
  contact: "Contact",
};

const normalizeSectionOrder = (sectionOrder) =>
  [
    ...new Set([
      ...(Array.isArray(sectionOrder) ? sectionOrder : []),
      ...DEFAULT_SECTION_ORDER,
    ]),
  ].filter((section) => DEFAULT_SECTION_ORDER.includes(section));

export default function PortfolioEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { blockNavigation, unblockNavigation } = useNavigationBlocker();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [newProject, setNewProject] = useState(blankProject);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiAction, setAiAction] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [panelControl, setPanelControl] = useState({
    version: 0,
    open: null,
  });

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const publicUrl = useMemo(() => {
    if (!portfolio?.slug) return "";
    return `${window.location.origin}/u/${portfolio.slug}`;
  }, [portfolio?.slug]);

  const userTier =
    user?.role === "admin" ? "pro" : user?.subscription?.tier || "free";
  const isThemeAllowed = (theme) => theme.allowedTiers?.includes(userTier);

  const currentSnapshot = useMemo(
    () => (form ? getEditorSnapshot({ form, projects }) : ""),
    [form, projects]
  );
  const hasUnsavedChanges = Boolean(
    form && savedSnapshot && currentSnapshot !== savedSnapshot
  );

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (hasUnsavedChanges) {
      blockNavigation(() =>
        window.confirm("You have unsaved portfolio changes. Leave anyway?")
      );
    } else {
      unblockNavigation();
    }

    return () => {
      unblockNavigation();
    };
  }, [blockNavigation, hasUnsavedChanges, unblockNavigation]);

  const confirmUnsavedNavigation = () => {
    return (
      !hasUnsavedChanges ||
      window.confirm("You have unsaved portfolio changes. Leave anyway?")
    );
  };

  const navigateWithUnsavedCheck = (to) => {
    if (confirmUnsavedNavigation()) {
      unblockNavigation();
      navigate(to);
    }
  };

  const setAllPanelsOpen = (open) => {
    setPanelControl((current) => ({
      version: current.version + 1,
      open,
    }));
  };

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getById(id);
      const portfolioData = response.data.portfolio;
      const resumeSnapshot = response.data.resume || {};
      const hydratedPortfolio = {
        ...portfolioData,
        sectionOrder: normalizeSectionOrder(portfolioData.sectionOrder),
        skills: getExistingOrFallback(
          portfolioData.skills,
          resumeSnapshot.skills
        ),
        experience: getExistingOrFallback(
          portfolioData.experience,
          resumeSnapshot.experience
        ),
        education: getExistingOrFallback(
          portfolioData.education,
          resumeSnapshot.education
        ),
        certifications: getExistingOrFallback(
          portfolioData.certifications,
          resumeSnapshot.certifications
        ),
        achievements: getExistingOrFallback(
          portfolioData.achievements,
          resumeSnapshot.achievements
        ),
        customSections: getExistingOrFallback(
          portfolioData.customSections,
          resumeSnapshot.customSections
        ),
      };

      setPortfolio(portfolioData);
      setProjects(response.data.projects || []);
      setForm(hydratedPortfolio);
      setSavedSnapshot(
        getEditorSnapshot({
          form: hydratedPortfolio,
          projects: response.data.projects || [],
        })
      );
    } catch (error) {
      toast.error("Failed to load portfolio");
      console.error(error);
      navigate("/portfolio");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateNestedField = (group, field, value) => {
    setForm((current) => ({
      ...current,
      [group]: {
        ...(current[group] || {}),
        [field]: value,
      },
    }));
  };

  const updateSection = (field, value) => {
    setForm((current) => ({
      ...current,
      sections: {
        ...(current.sections || {}),
        [field]: value,
      },
    }));
  };

  const moveSection = (section, direction) => {
    setForm((current) => {
      const sectionOrder = normalizeSectionOrder(current.sectionOrder);
      const index = sectionOrder.indexOf(section);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= sectionOrder.length) {
        return current;
      }

      const nextOrder = [...sectionOrder];
      [nextOrder[index], nextOrder[nextIndex]] = [
        nextOrder[nextIndex],
        nextOrder[index],
      ];

      return { ...current, sectionOrder: nextOrder };
    });
  };

  const updateSocialLink = (index, field, value) => {
    setForm((current) => ({
      ...current,
      socialLinks: (current.socialLinks || []).map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addSocialLink = () => {
    setForm((current) => ({
      ...current,
      socialLinks: [
        ...(current.socialLinks || []),
        { label: "", type: "website", url: "" },
      ],
    }));
  };

  const removeSocialLink = (index) => {
    setForm((current) => ({
      ...current,
      socialLinks: (current.socialLinks || []).filter(
        (_, linkIndex) => linkIndex !== index
      ),
    }));
  };

  const updateProjectDraft = (projectId, updater) => {
    setProjects((items) =>
      items.map((item) =>
        item._id === projectId
          ? {
              ...item,
              ...(typeof updater === "function" ? updater(item) : updater),
            }
          : item
      )
    );
  };

  const updatePortfolioArrayItem = (section, index, updates) => {
    setForm((current) => ({
      ...current,
      [section]: (current[section] || []).map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ...updates,
            }
          : item
      ),
    }));
  };

  const addPortfolioArrayItem = (section, item) => {
    setForm((current) => ({
      ...current,
      [section]: [...(current[section] || []), item],
    }));
  };

  const removePortfolioArrayItem = (section, index) => {
    setForm((current) => ({
      ...current,
      [section]: (current[section] || []).filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const handleSave = async ({ silent = false } = {}) => {
    setSaving(true);

    try {
      const [response, projectResponses] = await Promise.all([
        portfolioAPI.update(id, form),
        Promise.all(
          projects
            .filter((project) => project._id && project.title?.trim())
            .map((project) =>
              portfolioAPI.updateProject(
                id,
                project._id,
                getProjectUpdatePayload(project)
              )
            )
        ),
      ]);
      setPortfolio(response.data.portfolio);
      setForm(response.data.portfolio);
      setProjects(projectResponses.map((item) => item.data.project));
      setSavedSnapshot(
        getEditorSnapshot({
          form: response.data.portfolio,
          projects: projectResponses.map((item) => item.data.project),
        })
      );
      if (!silent) {
        toast.success("Portfolio saved successfully!");
      }
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save portfolio");
      console.error(error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    const saved = await handleSave({ silent: true });
    if (saved) {
      unblockNavigation();
      navigate(`/portfolio/${id}/preview`);
    }
  };

  const handlePublishToggle = async () => {
    try {
      const response =
        portfolio.status === "published"
          ? await portfolioAPI.unpublish(id)
          : await portfolioAPI.publish(id);

      setPortfolio(response.data.portfolio);
      setForm(response.data.portfolio);
      setSavedSnapshot(
        getEditorSnapshot({
          form: response.data.portfolio,
          projects,
        })
      );
      toast.success(
        response.data.portfolio.status === "published"
          ? "🎉 Portfolio published live!"
          : "Portfolio unpublished"
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Publish action failed");
      console.error(error);
    }
  };

  const handleGenerateAbout = async () => {
    setAiAction("about");

    try {
      const response = await portfolioAPI.generateAbout(id, {
        targetRole: form.professionalTitle,
      });
      updateField("about", response.data.about);
      toast.success("AI generated your About section!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate about");
      console.error(error);
    } finally {
      setAiAction("");
    }
  };

  const handleGenerateSeo = async () => {
    setAiAction("seo");

    try {
      const response = await portfolioAPI.generateSeo(id);
      updateNestedField("seo", "title", response.data.seo?.title || "");
      updateNestedField(
        "seo",
        "description",
        response.data.seo?.description || ""
      );
      updateNestedField("seo", "keywords", response.data.seo?.keywords || []);
      toast.success("SEO metadata generated by AI!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to generate SEO");
      console.error(error);
    } finally {
      setAiAction("");
    }
  };

  const handleImproveProject = async (project) => {
    setAiAction(`project:${project._id}`);

    try {
      const response = await portfolioAPI.improveProjectDescription(id, {
        projectId: project._id,
        currentTitle: project.title,
        currentShortDescription: project.shortDescription,
        currentLongDescription: project.longDescription,
      });
      updateProjectDraft(project._id, {
        shortDescription: response.data.improved?.shortDescription,
        longDescription: response.data.improved?.longDescription,
      });
      toast.success("Project description improved by AI!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to improve project");
      console.error(error);
    } finally {
      setAiAction("");
    }
  };

  const handleSaveProject = async (project) => {
    try {
      const response = await portfolioAPI.updateProject(
        id,
        project._id,
        getProjectUpdatePayload(project)
      );
      setProjects((items) =>
        items.map((item) =>
          item._id === project._id ? response.data.project : item
        )
      );
      setSavedSnapshot(
        getEditorSnapshot({
          form,
          projects: projects.map((item) =>
            item._id === project._id ? response.data.project : item
          ),
        })
      );
      toast.success("Project saved!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save project");
      console.error(error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    try {
      const payload = {
        ...newProject,
        technologies: commaToArray(newProject.technologiesText),
        highlights: linesToArray(newProject.highlightsText),
        images: imageLinesToArray(newProject.imagesText),
      };
      delete payload.technologiesText;
      delete payload.highlightsText;
      delete payload.imagesText;

      const response = await portfolioAPI.createProject(id, payload);
      const nextProjects = [...projects, response.data.project];
      setProjects(nextProjects);
      setSavedSnapshot(getEditorSnapshot({ form, projects: nextProjects }));
      setNewProject(blankProject);
      toast.success("Project created!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add project");
      console.error(error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await portfolioAPI.deleteProject(id, projectId);
      const nextProjects = projects.filter((item) => item._id !== projectId);
      setProjects(nextProjects);
      setSavedSnapshot(getEditorSnapshot({ form, projects: nextProjects }));
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    }
  };

  const handleCopyPublicLink = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    toast.success("Copied live portfolio link!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-3 border-gray-200 dark:border-zinc-800 border-t-emerald-600 dark:border-t-emerald-500 rounded-full animate-spin"></div>
            <Globe2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm text-gray-600 dark:text-zinc-300 font-semibold tracking-wide uppercase">
            Loading Portfolio Editor...
          </p>
        </div>
      </div>
    );
  }

  const isPublished = portfolio.status === "published";

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <SEO
        title={`Editing: ${form.title || "Portfolio"} | SmartNShine`}
        description="Edit, design, and configure your live developer portfolio website."
        noindex={true}
      />

      {/* Top Header */}
      <PortfolioEditorHeader
        onGoBack={() => navigateWithUnsavedCheck("/portfolio")}
        hasUnsavedChanges={hasUnsavedChanges}
        saving={saving}
        onSave={() => handleSave()}
        onPreview={handlePreview}
        onPublishToggle={handlePublishToggle}
        isPublished={isPublished}
        publicUrl={publicUrl}
        slug={portfolio.slug}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-[1600px] w-full mx-auto space-y-8">
        {/* Hero Section Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/90 dark:border-white/[0.1] bg-white dark:bg-gradient-to-b dark:from-zinc-900/95 dark:to-zinc-950/95 p-6 sm:p-8 shadow-sm dark:shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                    isPublished
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  <span>{isPublished ? "Published & Live" : "Draft (Unpublished)"}</span>
                </span>
                {form.themeId && (
                  <span className="text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-white/[0.08] capitalize">
                    Theme: {form.themeId}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {form.title || "Untitled Portfolio"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
                {form.professionalTitle || "Configure details, proof links, theme colors, and SEO."}
              </p>
            </div>

            {/* Public Link Pill Card */}
            {isPublished && (
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-500/30 shadow-xs">
                <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-950 dark:text-emerald-200">
                  <Globe2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-mono text-xs sm:text-sm truncate max-w-xs sm:max-w-md">{publicUrl}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={handleCopyPublicLink}
                    className="p-2 rounded-xl bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-white/10 transition-all cursor-pointer shadow-2xs"
                    title="Copy live link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs"
                    title="Open live website in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Toolbar & Panel Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Content Panels (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Expand / Collapse Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200/90 dark:border-white/[0.1] bg-white dark:bg-zinc-950 px-6 py-4 shadow-xs">
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-300">
                  Content Sections
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                  Click any card to expand or edit fields.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setAllPanelsOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <ArrowDown className="h-4 w-4" />
                  <span>Expand All</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAllPanelsOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span>Collapse All</span>
                </button>
              </div>
            </div>

            {/* Profile Panel */}
            <PortfolioPanel
              title="Profile & Bio"
              description="Portfolio title, role headline, slug, and bio narrative."
              icon={User}
              defaultOpen={true}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2 block">
                    Portfolio Title
                  </label>
                  <input
                    value={form.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm sm:text-base font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2 block">
                    Professional Title / Headline
                  </label>
                  <input
                    value={form.professionalTitle || ""}
                    onChange={(e) => updateField("professionalTitle", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm sm:text-base font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2 block">
                    Custom URL Slug
                  </label>
                  <input
                    value={form.slug || ""}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2 block">
                    Location
                  </label>
                  <input
                    value={form.location || ""}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm sm:text-base font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200">
                      Profile Photo URL
                    </label>
                    {form.profileImage && (
                      <button
                        type="button"
                        onClick={() => updateField("profileImage", "")}
                        className="text-xs text-red-500 hover:text-red-600 font-bold cursor-pointer"
                      >
                        Remove Photo (Switch to Text-First)
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {form.profileImage ? (
                      <img
                        src={form.profileImage}
                        alt="Profile preview"
                        className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0 border border-dashed border-gray-300 dark:border-zinc-700">
                        No Photo
                      </div>
                    )}
                    <input
                      value={form.profileImage || ""}
                      onChange={(e) => updateField("profileImage", e.target.value)}
                      placeholder="https://example.com/headshot.jpg (leave empty for text-first theme)"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-gray-500 dark:text-zinc-400">
                    {form.profileImage
                      ? "✓ Photo-based layout active. Headshot and avatar ring will be displayed."
                      : "✓ Text-first layout active. Clean, commanded typography without empty photo placeholders."}
                  </p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2 block">
                    Hero Banner Image URL (Optional)
                  </label>
                  <input
                    value={form.heroImage || ""}
                    onChange={(e) => updateField("heroImage", e.target.value)}
                    placeholder="https://example.com/hero-banner.jpg"
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2 block">
                  Tagline / Elevator Pitch
                </label>
                <textarea
                  value={form.tagline || ""}
                  onChange={(e) => updateField("tagline", e.target.value)}
                  rows={2}
                  className="w-full p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm sm:text-base leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200">
                    About / Executive Summary
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAbout}
                    disabled={Boolean(aiAction)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm font-bold hover:bg-blue-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{aiAction === "about" ? "Generating..." : "Generate with AI"}</span>
                  </button>
                </div>
                <textarea
                  value={form.about || ""}
                  onChange={(e) => updateField("about", e.target.value)}
                  rows={6}
                  className="w-full p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm sm:text-base leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </PortfolioPanel>

            {/* Contact Panel */}
            <PortfolioPanel
              title="Contact & Social Links"
              description="Public contact details and social media profiles."
              icon={Phone}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2 block">
                    Public Email
                  </label>
                  <input
                    value={form.contact?.email || ""}
                    onChange={(e) => updateNestedField("contact", "email", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-2 block">
                    Public Phone
                  </label>
                  <input
                    value={form.contact?.phone || ""}
                    onChange={(e) => updateNestedField("contact", "phone", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-gray-200/90 dark:border-white/[0.1] text-xs sm:text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.contact?.showEmail !== false}
                    onChange={(e) => updateNestedField("contact", "showEmail", e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Show email publicly</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-gray-200/90 dark:border-white/[0.1] text-xs sm:text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(form.contact?.showPhone)}
                    onChange={(e) => updateNestedField("contact", "showPhone", e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Show phone publicly</span>
                </label>
              </div>

              <div className="pt-5 border-t border-gray-100 dark:border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-300">
                    Social & Portfolio Links
                  </h3>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(form.socialLinks || []).map((link, index) => (
                    <div
                      key={`social-${index}`}
                      className="grid gap-3 rounded-2xl border border-gray-200/90 dark:border-white/[0.1] p-4 bg-white dark:bg-zinc-950 md:grid-cols-[160px_1fr_1.5fr_auto] items-center shadow-2xs"
                    >
                      <select
                        value={link.type || "other"}
                        onChange={(e) => updateSocialLink(index, "type", e.target.value)}
                        className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 px-3.5 py-3 text-xs sm:text-sm font-semibold capitalize"
                      >
                        {socialLinkTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        value={link.label || ""}
                        onChange={(e) => updateSocialLink(index, "label", e.target.value)}
                        placeholder="Label (e.g. GitHub)"
                        className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 px-3.5 py-3 text-xs sm:text-sm font-medium"
                      />
                      <input
                        value={link.url || ""}
                        onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                        placeholder="https://..."
                        className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 px-3.5 py-3 text-xs sm:text-sm font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Remove social link"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </PortfolioPanel>

            {/* Projects Panel */}
            <PortfolioPanel
              title="Projects"
              description="Detailed project cards, live demos, and case studies."
              icon={Rocket}
              badge={`${projects.length} items`}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
            >
              <div className="space-y-6">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-3xl border border-gray-200/90 dark:border-white/[0.1] p-6 bg-white dark:bg-zinc-950 space-y-5 shadow-xs"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <input
                        value={project.title || ""}
                        onChange={(e) => updateProjectDraft(project._id, { title: e.target.value })}
                        className="flex-1 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 px-4 py-3 text-sm sm:text-base font-bold text-gray-900 dark:text-white"
                        placeholder="Project title"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleImproveProject(project)}
                          disabled={Boolean(aiAction)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm font-bold hover:bg-blue-100 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{aiAction === `project:${project._id}` ? "Improving..." : "AI Improve"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveProject(project)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project._id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Short Overview
                        </label>
                        <textarea
                          value={project.shortDescription || ""}
                          onChange={(e) => updateProjectDraft(project._id, { shortDescription: e.target.value })}
                          rows={2}
                          className="w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Detailed Description
                        </label>
                        <textarea
                          value={project.longDescription || ""}
                          onChange={(e) => updateProjectDraft(project._id, { longDescription: e.target.value })}
                          rows={4}
                          className="w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Role
                        </label>
                        <input
                          value={project.role || ""}
                          onChange={(e) => updateProjectDraft(project._id, { role: e.target.value })}
                          placeholder="e.g. Lead Architect"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Duration
                        </label>
                        <input
                          value={project.duration || ""}
                          onChange={(e) => updateProjectDraft(project._id, { duration: e.target.value })}
                          placeholder="e.g. Jan 2026 - Mar 2026"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Technologies (comma-separated)
                        </label>
                        <input
                          value={getProjectTechnologiesText(project)}
                          onChange={(e) => updateProjectDraft(project._id, { technologiesText: e.target.value })}
                          placeholder="React, Node.js, MongoDB"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Live URL
                        </label>
                        <input
                          value={project.links?.live || ""}
                          onChange={(e) =>
                            updateProjectDraft(project._id, (cur) => ({
                              links: { ...(cur.links || {}), live: e.target.value },
                            }))
                          }
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-xs sm:text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          GitHub URL
                        </label>
                        <input
                          value={project.links?.github || ""}
                          onChange={(e) =>
                            updateProjectDraft(project._id, (cur) => ({
                              links: { ...(cur.links || {}), github: e.target.value },
                            }))
                          }
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-xs sm:text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Case Study URL
                        </label>
                        <input
                          value={project.links?.caseStudy || ""}
                          onChange={(e) =>
                            updateProjectDraft(project._id, (cur) => ({
                              links: { ...(cur.links || {}), caseStudy: e.target.value },
                            }))
                          }
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-xs sm:text-sm font-mono"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center gap-6 pt-3">
                        <label className="flex items-center gap-2.5 text-xs sm:text-sm font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={project.visible !== false}
                            onChange={(e) =>
                              updateProjectDraft(project._id, { visible: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-emerald-600"
                          />
                          <span>Visible in Portfolio</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-xs sm:text-sm font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(project.featured)}
                            onChange={(e) =>
                              updateProjectDraft(project._id, { featured: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-emerald-600"
                          />
                          <span>Featured Hero Project ⭐</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Project Box */}
              <div className="p-6 rounded-3xl bg-gray-50/90 dark:bg-zinc-900/60 border border-gray-200/90 dark:border-white/[0.1] space-y-4">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-300">
                  Add New Project
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Project title *"
                    value={newProject.title}
                    onChange={(e) => setNewProject((cur) => ({ ...cur, title: e.target.value }))}
                    className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-sm sm:text-base font-bold"
                  />
                  <input
                    placeholder="Technologies (e.g. React, Node.js)"
                    value={newProject.technologiesText || ""}
                    onChange={(e) => setNewProject((cur) => ({ ...cur, technologiesText: e.target.value }))}
                    className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-sm font-medium"
                  />
                  <input
                    placeholder="Live URL"
                    value={newProject.links.live}
                    onChange={(e) =>
                      setNewProject((cur) => ({ ...cur, links: { ...cur.links, live: e.target.value } }))
                    }
                    className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-xs sm:text-sm font-mono"
                  />
                  <input
                    placeholder="GitHub URL"
                    value={newProject.links.github}
                    onChange={(e) =>
                      setNewProject((cur) => ({ ...cur, links: { ...cur.links, github: e.target.value } }))
                    }
                    className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-xs sm:text-sm font-mono"
                  />
                </div>
                <textarea
                  placeholder="Short project overview description..."
                  value={newProject.shortDescription}
                  onChange={(e) => setNewProject((cur) => ({ ...cur, shortDescription: e.target.value }))}
                  rows={2}
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-sm sm:text-base leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleCreateProject}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>
            </PortfolioPanel>

            {/* Experience Panel */}
            <PortfolioPanel
              title="Experience"
              description="Portfolio copy of your career work experience."
              icon={Briefcase}
              badge={`${(form.experience || []).length} roles`}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
              actions={
                <button
                  type="button"
                  onClick={() =>
                    addPortfolioArrayItem("experience", {
                      title: "",
                      company: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      current: false,
                      bullets: [],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Role</span>
                </button>
              }
            >
              <div className="space-y-5">
                {(form.experience || []).map((item, index) => (
                  <div
                    key={`exp-${index}`}
                    className="rounded-3xl border border-gray-200/90 dark:border-white/[0.1] p-6 bg-white dark:bg-zinc-950 space-y-4 shadow-xs"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Role Title
                        </label>
                        <input
                          value={item.title || ""}
                          onChange={(e) => updatePortfolioArrayItem("experience", index, { title: e.target.value })}
                          placeholder="e.g. Full Stack Intern"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-bold text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Company Name
                        </label>
                        <input
                          value={item.company || ""}
                          onChange={(e) => updatePortfolioArrayItem("experience", index, { company: e.target.value })}
                          placeholder="e.g. Acme Technologies"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-medium text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Location
                        </label>
                        <input
                          value={item.location || ""}
                          onChange={(e) => updatePortfolioArrayItem("experience", index, { location: e.target.value })}
                          placeholder="e.g. Remote / San Francisco, CA"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                            Start Date
                          </label>
                          <input
                            value={item.startDate || ""}
                            onChange={(e) => updatePortfolioArrayItem("experience", index, { startDate: e.target.value })}
                            placeholder="e.g. Apr 2025"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                            End Date
                          </label>
                          <input
                            value={item.endDate || ""}
                            onChange={(e) => updatePortfolioArrayItem("experience", index, { endDate: e.target.value })}
                            placeholder="e.g. Jun 2025"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                        Bullet Points (1 per line)
                      </label>
                      <textarea
                        value={(item.bullets || []).join("\n")}
                        onChange={(e) => updatePortfolioArrayItem("experience", index, { bullets: linesToArray(e.target.value) })}
                        rows={4}
                        className="w-full p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base leading-relaxed text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePortfolioArrayItem("experience", index)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Experience</span>
                    </button>
                  </div>
                ))}
              </div>
            </PortfolioPanel>

            {/* Education Panel */}
            <PortfolioPanel
              title="Education"
              description="Degrees, universities, and graduation credentials."
              icon={GraduationCap}
              badge={`${(form.education || []).length} items`}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
              actions={
                <button
                  type="button"
                  onClick={() =>
                    addPortfolioArrayItem("education", {
                      institution: "",
                      degree: "",
                      field: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      gpa: "",
                      bullets: [],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education</span>
                </button>
              }
            >
              <div className="space-y-5">
                {(form.education || []).map((item, index) => (
                  <div
                    key={`edu-${index}`}
                    className="rounded-3xl border border-gray-200/90 dark:border-white/[0.1] p-6 bg-white dark:bg-zinc-950 space-y-4 shadow-xs"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Institution / University
                        </label>
                        <input
                          value={item.institution || ""}
                          onChange={(e) => updatePortfolioArrayItem("education", index, { institution: e.target.value })}
                          placeholder="e.g. Stanford University"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                          Degree / Major
                        </label>
                        <input
                          value={item.degree || ""}
                          onChange={(e) => updatePortfolioArrayItem("education", index, { degree: e.target.value })}
                          placeholder="e.g. B.S. in Computer Science"
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-medium"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePortfolioArrayItem("education", index)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Education</span>
                    </button>
                  </div>
                ))}
              </div>
            </PortfolioPanel>

            {/* Skills Panel */}
            <PortfolioPanel
              title="Skills"
              description="Categorized skills groups shown on your portfolio."
              icon={Sparkles}
              badge={`${(form.skills || []).length} groups`}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
              actions={
                <button
                  type="button"
                  onClick={() => addPortfolioArrayItem("skills", { category: "", items: [] })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Group</span>
                </button>
              }
            >
              <div className="space-y-4">
                {(form.skills || []).map((group, index) => (
                  <div
                    key={`skills-${index}`}
                    className="grid gap-4 rounded-2xl border border-gray-200/90 dark:border-white/[0.1] p-5 bg-white dark:bg-zinc-950 md:grid-cols-[220px_1fr_auto] items-center"
                  >
                    <input
                      value={group.category || ""}
                      onChange={(e) => updatePortfolioArrayItem("skills", index, { category: e.target.value })}
                      placeholder="Category (e.g. Frontend)"
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-bold"
                    />
                    <input
                      value={(group.items || []).join(", ")}
                      onChange={(e) => updatePortfolioArrayItem("skills", index, { items: commaToArray(e.target.value) })}
                      placeholder="React, TypeScript, Next.js, Tailwind CSS"
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => removePortfolioArrayItem("skills", index)}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </PortfolioPanel>

            {/* Achievements Panel */}
            <PortfolioPanel
              title="Achievements & Honors"
              description="Competition wins, rankings, and awards (1 per line)."
              icon={Trophy}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
            >
              <textarea
                value={(form.achievements || []).join("\n")}
                onChange={(e) => updateField("achievements", linesToArray(e.target.value))}
                rows={5}
                className="w-full p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-sm sm:text-base leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="• Winner - Smart India Hackathon 2025&#10;• AWS Certified Solutions Architect"
              />
            </PortfolioPanel>

            {/* Custom Sections */}
            <PortfolioPanel
              title="Custom Sections"
              description="Unique custom sections for open-source, hackathons, publications."
              icon={Layers}
              badge={`${(form.customSections || []).length} custom`}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
              actions={
                <button
                  type="button"
                  onClick={() =>
                    addPortfolioArrayItem("customSections", {
                      id: `custom-${Date.now()}`,
                      title: "",
                      items: [],
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Section</span>
                </button>
              }
            >
              <div className="space-y-5">
                {(form.customSections || []).map((item, index) => (
                  <div
                    key={item.id || `custom-section-${index}`}
                    className="rounded-3xl border border-gray-200/90 dark:border-white/[0.1] p-6 bg-white dark:bg-zinc-950 space-y-4 shadow-xs"
                  >
                    <input
                      value={item.title || ""}
                      onChange={(e) => updatePortfolioArrayItem("customSections", index, { title: e.target.value })}
                      placeholder="Section Title (e.g. Open Source Contributions)"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base font-bold"
                    />
                    <div>
                      <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                        Items (1 per line)
                      </label>
                      <textarea
                        value={(item.items || []).join("\n")}
                        onChange={(e) => updatePortfolioArrayItem("customSections", index, { items: linesToArray(e.target.value) })}
                        rows={4}
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 text-sm sm:text-base leading-relaxed"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePortfolioArrayItem("customSections", index)}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Section</span>
                    </button>
                  </div>
                ))}
              </div>
            </PortfolioPanel>
          </div>

          {/* Right Column: Settings & Customization Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 sticky top-20">
            {/* Theme Customizer Panel */}
            <PortfolioPanel
              title="Theme Design"
              description="Choose aesthetic style & accent colors."
              icon={Palette}
              defaultOpen={true}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
            >
              <div className="space-y-3.5">
                {portfolioThemeList.map((theme) => {
                  const allowed = isThemeAllowed(theme);
                  const isSelected = form.themeId === theme.id;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => allowed && updateField("themeId", theme.id)}
                      disabled={!allowed}
                      className={`w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30"
                          : "border-gray-200 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-zinc-900"
                      } ${!allowed ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm sm:text-base">{theme.name}</span>
                        {!allowed && (
                          <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                            Upgrade
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                        {theme.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Accent Colour Customizer */}
              {(() => {
                const activeTheme = portfolioThemeList.find(
                  (t) => t.id === (form.themeId || "minimalDeveloper")
                );
                const presets = activeTheme?.accentPresets || [];
                const currentAccent = form.themeAccent || "";

                return (
                  <div className="pt-5 border-t border-gray-100 dark:border-white/[0.08] space-y-2.5">
                    <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200">
                      Theme Accent Color
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {presets.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          title={hex}
                          onClick={() => updateField("themeAccent", hex)}
                          style={{ background: hex }}
                          className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                            currentAccent === hex
                              ? "border-gray-900 dark:border-white scale-110 ring-2 ring-offset-1 ring-emerald-500"
                              : "border-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </PortfolioPanel>

            {/* Sections Visibility & Ordering Panel */}
            <PortfolioPanel
              title="Sections Ordering"
              description="Toggle visibility and rearrange sections."
              icon={Sliders}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
            >
              <div className="space-y-2.5">
                {normalizeSectionOrder(form.sectionOrder).map((section, index) => {
                  const visibilityKey = `show${section.charAt(0).toUpperCase() + section.slice(1)}`;

                  return (
                    <div
                      key={section}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200/90 dark:border-white/[0.1] p-3.5 bg-white dark:bg-zinc-950"
                    >
                      <label className="flex items-center gap-3 text-xs sm:text-sm font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.sections?.[visibilityKey] !== false}
                          onChange={(e) => updateSection(visibilityKey, e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600"
                        />
                        <span>{sectionLabels[section] || section}</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveSection(section, -1)}
                          disabled={index === 0}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(section, 1)}
                          disabled={index === normalizeSectionOrder(form.sectionOrder).length - 1}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </PortfolioPanel>

            {/* SEO Panel */}
            <PortfolioPanel
              title="SEO Metadata"
              description="Search engine and social preview tags."
              icon={Search}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
              actions={
                <button
                  type="button"
                  onClick={handleGenerateSeo}
                  disabled={Boolean(aiAction)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm font-bold hover:bg-blue-100 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{aiAction === "seo" ? "Generating..." : "AI SEO"}</span>
                </button>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                    Meta Title
                  </label>
                  <input
                    value={form.seo?.title || ""}
                    onChange={(e) => updateNestedField("seo", "title", e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                    Meta Description
                  </label>
                  <textarea
                    value={form.seo?.description || ""}
                    onChange={(e) => updateNestedField("seo", "description", e.target.value)}
                    rows={3}
                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-sm leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                    Social Sharing Image URL (Open Graph / Twitter Card)
                  </label>
                  <div className="flex items-center gap-3">
                    {form.seo?.ogImage && (
                      <img
                        src={form.seo.ogImage}
                        alt="OG Preview"
                        className="w-12 h-8 rounded-lg object-cover border border-gray-200 dark:border-white/10 shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <input
                      value={form.seo?.ogImage || ""}
                      onChange={(e) => updateNestedField("seo", "ogImage", e.target.value)}
                      placeholder="https://example.com/og-banner.png"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-xs sm:text-sm font-mono"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-zinc-400">
                    Preview image shown when your portfolio link is shared on LinkedIn, Twitter, WhatsApp, etc.
                  </p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 dark:text-zinc-200 mb-1.5 block">
                    Custom Favicon Icon URL
                  </label>
                  <div className="flex items-center gap-3">
                    {form.seo?.favicon && (
                      <img
                        src={form.seo.favicon}
                        alt="Favicon Preview"
                        className="w-7 h-7 rounded-md object-contain border border-gray-200 dark:border-white/10 shrink-0 p-0.5"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <input
                      value={form.seo?.favicon || ""}
                      onChange={(e) => updateNestedField("seo", "favicon", e.target.value)}
                      placeholder="https://example.com/favicon.ico or .png"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 text-xs sm:text-sm font-mono"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500 dark:text-zinc-400">
                    Browser tab icon for your custom portfolio domain/page.
                  </p>
                </div>
              </div>
            </PortfolioPanel>

            {/* Publish Settings Panel */}
            <PortfolioPanel
              title="Publish Settings"
              description="Control recruiter downloads and indexing."
              icon={Globe2}
              forceState={panelControl.open}
              forceVersion={panelControl.version}
            >
              <div className="space-y-3.5">
                <label className="flex items-start gap-3 text-xs sm:text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.settings?.showResumeDownload !== false}
                    onChange={(e) => updateNestedField("settings", "showResumeDownload", e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 mt-0.5"
                  />
                  <span>Show "Download Resume" button</span>
                </label>
                <label className="flex items-start gap-3 text-xs sm:text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.settings?.allowIndexing !== false}
                    onChange={(e) => updateNestedField("settings", "allowIndexing", e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 mt-0.5"
                  />
                  <span>Allow Google & search engine indexing</span>
                </label>
                <label className="flex items-start gap-3 text-xs sm:text-sm font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.settings?.showSmartNShineBranding !== false}
                    onChange={(e) => updateNestedField("settings", "showSmartNShineBranding", e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 mt-0.5"
                  />
                  <span>Show SmartNShine badge</span>
                </label>
              </div>
            </PortfolioPanel>
          </aside>
        </div>
      </main>
    </div>
  );
}
