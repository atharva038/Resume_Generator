import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Eye,
  Globe2,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import {portfolioAPI} from "@/api/portfolio.api";
import {portfolioThemeList} from "@/components/portfolio/themes/themeRegistry";

const blankProject = {
  title: "",
  shortDescription: "",
  technologies: [],
  links: {
    live: "",
    github: "",
  },
  featured: false,
  visible: true,
};

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

const getProjectUpdatePayload = (project) => ({
  title: project.title,
  shortDescription: project.shortDescription || "",
  longDescription: project.longDescription || "",
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
  featured: Boolean(project.featured),
  visible: project.visible !== false,
});

const useExistingOrFallback = (existing, fallback) => {
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

const normalizeSectionOrder = (sectionOrder) => [
  ...new Set([
    ...(Array.isArray(sectionOrder) ? sectionOrder : []),
    ...DEFAULT_SECTION_ORDER,
  ]),
].filter((section) => DEFAULT_SECTION_ORDER.includes(section));

const CollapsiblePanel = ({
  title,
  description,
  defaultOpen = false,
  actions = null,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
      >
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 flex-shrink-0 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 dark:border-zinc-800 p-5">
          {actions && <div className="mb-5 flex justify-end">{actions}</div>}
          {children}
        </div>
      )}
    </section>
  );
};

const PortfolioEditor = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(null);
  const [newProject, setNewProject] = useState(blankProject);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiAction, setAiAction] = useState("");

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const publicUrl = useMemo(() => {
    if (!portfolio?.slug) return "";
    return `${window.location.origin}/u/${portfolio.slug}`;
  }, [portfolio?.slug]);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getById(id);
      const portfolioData = response.data.portfolio;
      const resumeSnapshot = response.data.resume || {};
      const hydratedPortfolio = {
        ...portfolioData,
        sectionOrder: normalizeSectionOrder(portfolioData.sectionOrder),
        skills: useExistingOrFallback(portfolioData.skills, resumeSnapshot.skills),
        experience: useExistingOrFallback(
          portfolioData.experience,
          resumeSnapshot.experience
        ),
        education: useExistingOrFallback(
          portfolioData.education,
          resumeSnapshot.education
        ),
        certifications: useExistingOrFallback(
          portfolioData.certifications,
          resumeSnapshot.certifications
        ),
        achievements: useExistingOrFallback(
          portfolioData.achievements,
          resumeSnapshot.achievements
        ),
        customSections: useExistingOrFallback(
          portfolioData.customSections,
          resumeSnapshot.customSections
        ),
      };

      setPortfolio(portfolioData);
      setProjects(response.data.projects || []);
      setForm(hydratedPortfolio);
    } catch (error) {
      toast.error("Failed to load portfolio");
      console.error(error);
      navigate("/portfolio");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((current) => ({...current, [field]: value}));
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

      return {...current, sectionOrder: nextOrder};
    });
  };

  const updateFirstSocialLink = (field, value) => {
    setForm((current) => {
      const socialLinks = current.socialLinks?.length
        ? [...current.socialLinks]
        : [{label: "Website", type: "website", url: ""}];

      socialLinks[0] = {
        ...socialLinks[0],
        [field]: value,
      };

      return {...current, socialLinks};
    });
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

  const handleSave = async ({silent = false} = {}) => {
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
      if (!silent) {
        toast.success("Portfolio saved");
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
    const saved = await handleSave({silent: true});
    if (saved) {
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
      toast.success(
        response.data.portfolio.status === "published"
          ? "Portfolio published"
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
      toast.success("About section generated");
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
      toast.success("SEO metadata generated");
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
      });
      const improved = response.data.project || {};
      const updatePayload = {
        shortDescription:
          improved.shortDescription || project.shortDescription || "",
        longDescription:
          improved.longDescription || project.longDescription || "",
        highlights: improved.highlights || project.highlights || [],
      };
      const updateResponse = await portfolioAPI.updateProject(
        id,
        project._id,
        updatePayload
      );

      setProjects((items) =>
        items.map((item) =>
          item._id === project._id ? updateResponse.data.project : item
        )
      );
      toast.success("Project description improved");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to improve project description"
      );
      console.error(error);
    } finally {
      setAiAction("");
    }
  };

  const handleSaveProject = async (project) => {
    if (!project.title?.trim()) {
      toast.error("Project title is required");
      return;
    }

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
      toast.success("Portfolio project saved");
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
        technologies: newProject.technologiesText
          ? newProject.technologiesText
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      };
      delete payload.technologiesText;

      const response = await portfolioAPI.createProject(id, payload);
      setProjects((items) => [...items, response.data.project]);
      setNewProject(blankProject);
      toast.success("Project added");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add project");
      console.error(error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Delete this project?")) return;

    try {
      await portfolioAPI.deleteProject(id, projectId);
      setProjects((items) => items.filter((item) => item._id !== projectId));
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Loading portfolio editor...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to portfolios
            </Link>
            <h1 className="text-4xl font-black tracking-tight">
              Portfolio Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Status: <span className="capitalize">{portfolio.status}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 font-semibold"
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black font-semibold disabled:opacity-60"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handlePublishToggle}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              {portfolio.status === "published" ? (
                <Globe2 className="w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {portfolio.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>

        {portfolio.status === "published" && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 p-4">
            Public link:{" "}
            <a href={publicUrl} className="font-semibold underline">
              {publicUrl}
            </a>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <CollapsiblePanel
              title="Profile"
              description="Portfolio title, role, slug, and about copy."
              defaultOpen
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold">Title</span>
                  <input
                    value={form.title || ""}
                    onChange={(event) => updateField("title", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">
                    Professional title
                  </span>
                  <input
                    value={form.professionalTitle || ""}
                    onChange={(event) =>
                      updateField("professionalTitle", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Slug</span>
                  <input
                    value={form.slug || ""}
                    onChange={(event) => updateField("slug", event.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Location</span>
                  <input
                    value={form.location || ""}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </label>
              </div>
              <label className="block mt-4">
                <span className="text-sm font-semibold">Tagline</span>
                <textarea
                  value={form.tagline || ""}
                  onChange={(event) => updateField("tagline", event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                />
              </label>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">About</span>
                <button
                  type="button"
                  onClick={handleGenerateAbout}
                  disabled={Boolean(aiAction)}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60 dark:border-blue-500/30 dark:text-blue-300 dark:hover:bg-blue-500/10"
                >
                  <Sparkles className="w-4 h-4" />
                  {aiAction === "about" ? "Generating..." : "Generate"}
                </button>
              </div>
              <label className="block">
                <textarea
                  value={form.about || ""}
                  onChange={(event) => updateField("about", event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                />
              </label>
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Contact"
              description="Public contact details and primary social link."
              defaultOpen
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold">Email</span>
                  <input
                    value={form.contact?.email || ""}
                    onChange={(event) =>
                      updateNestedField("contact", "email", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Phone</span>
                  <input
                    value={form.contact?.phone || ""}
                    onChange={(event) =>
                      updateNestedField("contact", "phone", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={form.contact?.showEmail !== false}
                    onChange={(event) =>
                      updateNestedField(
                        "contact",
                        "showEmail",
                        event.target.checked
                      )
                    }
                  />
                  Show email publicly
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={Boolean(form.contact?.showPhone)}
                    onChange={(event) =>
                      updateNestedField(
                        "contact",
                        "showPhone",
                        event.target.checked
                      )
                    }
                  />
                  Show phone publicly
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <label className="block">
                  <span className="text-sm font-semibold">
                    Primary social label
                  </span>
                  <input
                    value={form.socialLinks?.[0]?.label || ""}
                    onChange={(event) =>
                      updateFirstSocialLink("label", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">
                    Primary social URL
                  </span>
                  <input
                    value={form.socialLinks?.[0]?.url || ""}
                    onChange={(event) =>
                      updateFirstSocialLink("url", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </label>
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Projects"
              description="Portfolio-only project copy, links, visibility, and featured status."
              defaultOpen
            >
              <div className="space-y-4 mb-6">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-lg border border-gray-200 dark:border-zinc-800 p-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <input
                          value={project.title || ""}
                          onChange={(event) =>
                            updateProjectDraft(project._id, {
                              title: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-bold dark:border-zinc-700 dark:bg-black"
                          placeholder="Project title"
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                          Preview: {getProjectDescriptionPreview(project)}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveProject(project)}
                          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImproveProject(project)}
                          disabled={Boolean(aiAction)}
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60 dark:border-blue-500/30 dark:text-blue-300 dark:hover:bg-blue-500/10"
                        >
                          <Sparkles className="w-4 h-4" />
                          {aiAction === `project:${project._id}`
                            ? "Improving..."
                            : "AI"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project._id)}
                          aria-label="Delete project"
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="block md:col-span-2">
                        <span className="text-sm font-semibold">
                          Short description
                        </span>
                        <textarea
                          value={project.shortDescription || ""}
                          onChange={(event) =>
                            updateProjectDraft(project._id, {
                              shortDescription: event.target.value,
                            })
                          }
                          rows={3}
                          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                        />
                      </label>
                      <label className="block md:col-span-2">
                        <span className="text-sm font-semibold">
                          Detailed description
                        </span>
                        <textarea
                          value={project.longDescription || ""}
                          onChange={(event) =>
                            updateProjectDraft(project._id, {
                              longDescription: event.target.value,
                            })
                          }
                          rows={4}
                          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold">
                          Tech stack
                        </span>
                        <input
                          value={getProjectTechnologiesText(project)}
                          onChange={(event) =>
                            updateProjectDraft(project._id, {
                              technologiesText: event.target.value,
                            })
                          }
                          placeholder="React, Node.js, MongoDB"
                          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold">Live URL</span>
                        <input
                          value={project.links?.live || ""}
                          onChange={(event) =>
                            updateProjectDraft(project._id, (current) => ({
                              links: {
                                ...(current.links || {}),
                                live: event.target.value,
                              },
                            }))
                          }
                          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold">
                          GitHub URL
                        </span>
                        <input
                          value={project.links?.github || ""}
                          onChange={(event) =>
                            updateProjectDraft(project._id, (current) => ({
                              links: {
                                ...(current.links || {}),
                                github: event.target.value,
                              },
                            }))
                          }
                          className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                        />
                      </label>
                      <div className="flex flex-wrap items-center gap-4 pt-7">
                        <label className="flex items-center gap-2 text-sm font-semibold">
                          <input
                            type="checkbox"
                            checked={project.visible !== false}
                            onChange={(event) =>
                              updateProjectDraft(project._id, {
                                visible: event.target.checked,
                              })
                            }
                          />
                          Visible
                        </label>
                        <label className="flex items-center gap-2 text-sm font-semibold">
                          <input
                            type="checkbox"
                            checked={Boolean(project.featured)}
                            onChange={(event) =>
                              updateProjectDraft(project._id, {
                                featured: event.target.checked,
                              })
                            }
                          />
                          Featured
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-gray-50 dark:bg-zinc-900 p-4">
                <h3 className="font-bold mb-4">Add project</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Project title"
                    value={newProject.title}
                    onChange={(event) =>
                      setNewProject((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                  <input
                    placeholder="Tech stack, comma separated"
                    value={newProject.technologiesText || ""}
                    onChange={(event) =>
                      setNewProject((current) => ({
                        ...current,
                        technologiesText: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                  <input
                    placeholder="Live URL"
                    value={newProject.links.live}
                    onChange={(event) =>
                      setNewProject((current) => ({
                        ...current,
                        links: {...current.links, live: event.target.value},
                      }))
                    }
                    className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                  <input
                    placeholder="GitHub URL"
                    value={newProject.links.github}
                    onChange={(event) =>
                      setNewProject((current) => ({
                        ...current,
                        links: {...current.links, github: event.target.value},
                      }))
                    }
                    className="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                  />
                </div>
                <textarea
                  placeholder="Short project description"
                  value={newProject.shortDescription}
                  onChange={(event) =>
                    setNewProject((current) => ({
                      ...current,
                      shortDescription: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-4 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                />
                <button
                  type="button"
                  onClick={handleCreateProject}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-3 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Add Project
                </button>
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Experience"
              description="Portfolio-only copy of your resume experience."
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
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-zinc-700"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              }
            >
              <div className="space-y-4">
                {(form.experience || []).map((item, index) => (
                  <div
                    key={`experience-${index}`}
                    className="rounded-lg border border-gray-200 p-4 dark:border-zinc-800"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={item.title || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("experience", index, {
                            title: event.target.value,
                          })
                        }
                        placeholder="Role title"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <input
                        value={item.company || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("experience", index, {
                            company: event.target.value,
                          })
                        }
                        placeholder="Company"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <input
                        value={item.location || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("experience", index, {
                            location: event.target.value,
                          })
                        }
                        placeholder="Location"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={item.startDate || ""}
                          onChange={(event) =>
                            updatePortfolioArrayItem("experience", index, {
                              startDate: event.target.value,
                            })
                          }
                          placeholder="Start date"
                          className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                        />
                        <input
                          value={item.endDate || ""}
                          onChange={(event) =>
                            updatePortfolioArrayItem("experience", index, {
                              endDate: event.target.value,
                            })
                          }
                          placeholder="End date"
                          className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                        />
                      </div>
                    </div>
                    <label className="mt-4 block">
                      <span className="text-sm font-semibold">
                        Bullet points
                      </span>
                      <textarea
                        value={(item.bullets || []).join("\n")}
                        onChange={(event) =>
                          updatePortfolioArrayItem("experience", index, {
                            bullets: linesToArray(event.target.value),
                          })
                        }
                        rows={4}
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        removePortfolioArrayItem("experience", index)
                      }
                      className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Education"
              description="Edit the education shown only on this portfolio."
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
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-zinc-700"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              }
            >
              <div className="space-y-4">
                {(form.education || []).map((item, index) => (
                  <div
                    key={`education-${index}`}
                    className="rounded-lg border border-gray-200 p-4 dark:border-zinc-800"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={item.institution || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("education", index, {
                            institution: event.target.value,
                          })
                        }
                        placeholder="Institution"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <input
                        value={item.degree || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("education", index, {
                            degree: event.target.value,
                          })
                        }
                        placeholder="Degree"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <input
                        value={item.field || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("education", index, {
                            field: event.target.value,
                          })
                        }
                        placeholder="Field"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <input
                        value={item.location || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("education", index, {
                            location: event.target.value,
                          })
                        }
                        placeholder="Location"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removePortfolioArrayItem("education", index)
                      }
                      className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Skills"
              description="Edit the skill groups shown in your portfolio."
            >
              <div className="space-y-4">
                {(form.skills || []).map((group, index) => (
                  <div
                    key={`skills-${index}`}
                    className="rounded-lg border border-gray-200 p-4 dark:border-zinc-800"
                  >
                    <div className="grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-start">
                      <input
                        value={group.category || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("skills", index, {
                            category: event.target.value,
                          })
                        }
                        placeholder="Category"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <input
                        value={(group.items || []).join(", ")}
                        onChange={(event) =>
                          updatePortfolioArrayItem("skills", index, {
                            items: commaToArray(event.target.value),
                          })
                        }
                        placeholder="React, Node.js, MongoDB"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => removePortfolioArrayItem("skills", index)}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  addPortfolioArrayItem("skills", {category: "", items: []})
                }
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-zinc-700"
              >
                <Plus className="w-4 h-4" />
                Add Skill Group
              </button>
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Achievements"
              description="One achievement per line."
            >
              <textarea
                value={(form.achievements || []).join("\n")}
                onChange={(event) =>
                  updateField("achievements", linesToArray(event.target.value))
                }
                rows={6}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                placeholder="One achievement per line"
              />
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Custom Sections"
              description="Extra portfolio-only sections imported from the resume or added manually."
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
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-zinc-700"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              }
            >
              <div className="space-y-4">
                {(form.customSections || []).map((item, index) => (
                  <div
                    key={item.id || `custom-section-${index}`}
                    className="rounded-lg border border-gray-200 p-4 dark:border-zinc-800"
                  >
                    <input
                      value={item.title || ""}
                      onChange={(event) =>
                        updatePortfolioArrayItem("customSections", index, {
                          title: event.target.value,
                        })
                      }
                      placeholder="Section title"
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-bold dark:border-zinc-700 dark:bg-black"
                    />
                    <label className="mt-4 block">
                      <span className="text-sm font-semibold">
                        Items, one per line
                      </span>
                      <textarea
                        value={(item.items || []).join("\n")}
                        onChange={(event) =>
                          updatePortfolioArrayItem("customSections", index, {
                            items: linesToArray(event.target.value),
                          })
                        }
                        rows={5}
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        removePortfolioArrayItem("customSections", index)
                      }
                      className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Certifications"
              description="Portfolio-only certification list."
              actions={
                <button
                  type="button"
                  onClick={() =>
                    addPortfolioArrayItem("certifications", {
                      name: "",
                      issuer: "",
                      date: "",
                      credentialId: "",
                      link: "",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-zinc-700"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              }
            >
              <div className="space-y-4">
                {(form.certifications || []).map((item, index) => (
                  <div
                    key={`certification-${index}`}
                    className="rounded-lg border border-gray-200 p-4 dark:border-zinc-800"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={item.name || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("certifications", index, {
                            name: event.target.value,
                          })
                        }
                        placeholder="Certification name"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                      <input
                        value={item.issuer || ""}
                        onChange={(event) =>
                          updatePortfolioArrayItem("certifications", index, {
                            issuer: event.target.value,
                          })
                        }
                        placeholder="Issuer"
                        className="rounded-lg border border-gray-300 bg-white px-3 py-3 dark:border-zinc-700 dark:bg-black"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removePortfolioArrayItem("certifications", index)
                      }
                      className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </CollapsiblePanel>
          </div>

          <aside className="space-y-6">
            <CollapsiblePanel
              title="Theme"
              description="Choose how this portfolio is presented."
              defaultOpen
            >
              <select
                value={form.themeId || "minimalDeveloper"}
                onChange={(event) => updateField("themeId", event.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
              >
                {portfolioThemeList.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
              <div className="mt-4 space-y-3">
                {portfolioThemeList.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => updateField("themeId", theme.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      form.themeId === theme.id
                        ? "border-blue-600 bg-blue-50 text-blue-950 dark:bg-blue-500/10 dark:text-blue-100"
                        : "border-gray-200 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className="font-bold">{theme.name}</div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {theme.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* ─── Accent colour customizer ─── */}
              {(() => {
                const activeTheme = portfolioThemeList.find(
                  (t) => t.id === (form.themeId || "minimalDeveloper")
                );
                const presets = activeTheme?.accentPresets || [];
                const currentAccent = form.themeAccent || "";

                return (
                  <div className="mt-5 border-t border-gray-100 dark:border-zinc-800 pt-4">
                    <p className="mb-2 text-sm font-semibold">
                      Accent colour
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {presets.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          title={hex}
                          onClick={() => updateField("themeAccent", hex)}
                          style={{background: hex}}
                          className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                            currentAccent === hex
                              ? "border-gray-900 dark:border-white scale-110 ring-2 ring-offset-1 ring-gray-400"
                              : "border-transparent"
                          }`}
                        />
                      ))}
                      {/* Custom colour input */}
                      <label
                        className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-gray-400 dark:border-zinc-600 hover:border-gray-600 transition-colors"
                        title="Custom colour"
                      >
                        <input
                          type="color"
                          value={currentAccent || (presets[0] ?? "#6366f1")}
                          onChange={(e) =>
                            updateField("themeAccent", e.target.value)
                          }
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                        <span
                          className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500 dark:text-zinc-400"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </label>
                      {currentAccent && (
                        <button
                          type="button"
                          onClick={() => updateField("themeAccent", "")}
                          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    {currentAccent && (
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                        {currentAccent}
                      </p>
                    )}
                  </div>
                );
              })()}
            </CollapsiblePanel>

            <CollapsiblePanel
              title="Sections"
              description="Control visibility and public ordering."
              defaultOpen
            >
              <div className="space-y-2">
                {normalizeSectionOrder(form.sectionOrder).map((section, index) => {
                  const visibilityKey = `show${
                    section.charAt(0).toUpperCase() + section.slice(1)
                  }`;

                  return (
                    <div
                      key={section}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-zinc-800"
                    >
                      <label className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                        <input
                          type="checkbox"
                          checked={form.sections?.[visibilityKey] !== false}
                          onChange={(event) =>
                            updateSection(visibilityKey, event.target.checked)
                          }
                        />
                        <span className="break-words">
                          {sectionLabels[section]}
                        </span>
                      </label>
                      <div className="flex flex-shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveSection(section, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${sectionLabels[section]} up`}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(section, 1)}
                          disabled={
                            index === normalizeSectionOrder(form.sectionOrder).length - 1
                          }
                          aria-label={`Move ${sectionLabels[section]} down`}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel
              title="SEO"
              description="Search and social preview metadata."
              actions={
                <button
                  type="button"
                  onClick={handleGenerateSeo}
                  disabled={Boolean(aiAction)}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60 dark:border-blue-500/30 dark:text-blue-300 dark:hover:bg-blue-500/10"
                >
                  <Sparkles className="w-4 h-4" />
                  {aiAction === "seo" ? "Generating..." : "Generate"}
                </button>
              }
            >
              <label className="block">
                <span className="text-sm font-semibold">SEO title</span>
                <input
                  value={form.seo?.title || ""}
                  onChange={(event) =>
                    updateNestedField("seo", "title", event.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                />
              </label>
              <label className="block mt-4">
                <span className="text-sm font-semibold">SEO description</span>
                <textarea
                  value={form.seo?.description || ""}
                  onChange={(event) =>
                    updateNestedField("seo", "description", event.target.value)
                  }
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                />
              </label>
            </CollapsiblePanel>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;
