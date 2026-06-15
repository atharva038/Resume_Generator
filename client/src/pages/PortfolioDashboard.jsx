import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import {
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  Globe2,
  Plus,
  Trash2,
} from "lucide-react";
import {portfolioAPI} from "@/api/portfolio.api";

const getPublicUrl = (slug) => `${window.location.origin}/u/${slug}`;

const PortfolioDashboard = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await portfolioAPI.list();
      setPortfolios(response.data.portfolios || []);
    } catch (error) {
      toast.error("Failed to load portfolios");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (slug) => {
    await navigator.clipboard.writeText(getPublicUrl(slug));
    toast.success("Portfolio link copied");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this portfolio?")) return;

    try {
      await portfolioAPI.delete(id);
      setPortfolios((items) => items.filter((item) => item._id !== id));
      toast.success("Portfolio deleted");
    } catch (error) {
      toast.error("Failed to delete portfolio");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 dark:border-zinc-800 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading portfolios...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              My Portfolios
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create public career websites from your resume data.
            </p>
          </div>
          <Link
            to="/portfolio/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Portfolio
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-10 text-center">
            <Globe2 className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold mb-2">
              No portfolios created yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start with one of your saved resumes and publish a shareable
              portfolio link.
            </p>
            <Link
              to="/portfolio/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black font-semibold"
            >
              <Plus className="w-5 h-5" />
              Choose Resume
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {portfolios.map((portfolio) => (
              <article
                key={portfolio._id}
                className="border border-gray-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 capitalize">
                      {portfolio.status}
                    </span>
                    <h2 className="text-xl font-bold mt-3">
                      {portfolio.title || "Untitled Portfolio"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {portfolio.professionalTitle || portfolio.themeId}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(portfolio._id)}
                    aria-label="Delete portfolio"
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                  <div className="rounded-lg bg-gray-50 dark:bg-zinc-900 p-3">
                    <div className="text-gray-500 dark:text-gray-400">
                      Views
                    </div>
                    <div className="text-xl font-bold">
                      {portfolio.analytics?.totalViews || 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-zinc-900 p-3">
                    <div className="text-gray-500 dark:text-gray-400">
                      Resume clicks
                    </div>
                    <div className="text-xl font-bold">
                      {portfolio.analytics?.resumeDownloads || 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-zinc-900 p-3">
                    <div className="text-gray-500 dark:text-gray-400">
                      Contact clicks
                    </div>
                    <div className="text-xl font-bold">
                      {portfolio.analytics?.contactClicks || 0}
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-zinc-900 p-3">
                    <div className="text-gray-500 dark:text-gray-400">
                      Project clicks
                    </div>
                    <div className="text-xl font-bold">
                      {portfolio.analytics?.projectClicks || 0}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  <Link
                    to={`/portfolio/${portfolio._id}/edit`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black text-sm font-semibold"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Link>
                  <Link
                    to={`/portfolio/${portfolio._id}/preview`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Link>
                  {portfolio.status === "published" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCopy(portfolio.slug)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-semibold"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                      <a
                        href={`/u/${portfolio.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm font-semibold"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </a>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDashboard;
