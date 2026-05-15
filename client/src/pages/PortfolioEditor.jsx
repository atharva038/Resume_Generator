import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Eye,
  Globe2,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import {portfolioAPI} from "@/api/portfolio.api";

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

const PortfolioEditor = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(null);
  const [newProject, setNewProject] = useState(blankProject);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      setPortfolio(response.data.portfolio);
      setProjects(response.data.projects || []);
      setForm(response.data.portfolio);
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

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await portfolioAPI.update(id, form);
      setPortfolio(response.data.portfolio);
      setForm(response.data.portfolio);
      toast.success("Portfolio saved");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save portfolio");
      console.error(error);
    } finally {
      setSaving(false);
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
            <Link
              to={`/portfolio/${id}/preview`}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 font-semibold"
            >
              <Eye className="w-5 h-5" />
              Preview
            </Link>
            <button
              type="button"
              onClick={handleSave}
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
            <section className="border border-gray-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-950">
              <h2 className="text-xl font-bold mb-5">Profile</h2>
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
              <label className="block mt-4">
                <span className="text-sm font-semibold">About</span>
                <textarea
                  value={form.about || ""}
                  onChange={(event) => updateField("about", event.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
                />
              </label>
            </section>

            <section className="border border-gray-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-950">
              <h2 className="text-xl font-bold mb-5">Contact</h2>
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
            </section>

            <section className="border border-gray-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-950">
              <h2 className="text-xl font-bold mb-5">Projects</h2>
              <div className="space-y-3 mb-6">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 dark:border-zinc-800 p-4"
                  >
                    <div>
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {project.shortDescription || "No description yet"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(project._id)}
                      aria-label="Delete project"
                      className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
            </section>
          </div>

          <aside className="space-y-6">
            <section className="border border-gray-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-950">
              <h2 className="text-xl font-bold mb-5">Theme</h2>
              <select
                value={form.themeId || "minimalDeveloper"}
                onChange={(event) => updateField("themeId", event.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black px-3 py-3"
              >
                <option value="minimalDeveloper">Minimal Developer</option>
                <option value="modernFresher">Modern Fresher</option>
                <option value="professionalCorporate">
                  Professional Corporate
                </option>
              </select>
            </section>

            <section className="border border-gray-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-950">
              <h2 className="text-xl font-bold mb-5">Sections</h2>
              <div className="space-y-3">
                {[
                  ["showAbout", "About"],
                  ["showSkills", "Skills"],
                  ["showProjects", "Projects"],
                  ["showExperience", "Experience"],
                  ["showEducation", "Education"],
                  ["showCertifications", "Certifications"],
                  ["showAchievements", "Achievements"],
                  ["showContact", "Contact"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between gap-3 text-sm font-semibold"
                  >
                    {label}
                    <input
                      type="checkbox"
                      checked={form.sections?.[key] !== false}
                      onChange={(event) =>
                        updateSection(key, event.target.checked)
                      }
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="border border-gray-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-950">
              <h2 className="text-xl font-bold mb-5">SEO</h2>
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
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;
