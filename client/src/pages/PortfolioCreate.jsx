import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {ArrowRight, FileText, Globe2} from "lucide-react";
import {resumeAPI} from "@/api/api";
import {portfolioAPI} from "@/api/portfolio.api";

const PortfolioCreate = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingId, setCreatingId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.list();
      setResumes(response.data.resumes || []);
    } catch (error) {
      toast.error("Failed to load resumes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (resumeId) => {
    setCreatingId(resumeId);

    try {
      const response = await portfolioAPI.createFromResume(resumeId);
      toast.success("Portfolio draft created");
      navigate(`/portfolio/${response.data.portfolio._id}/edit`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create portfolio");
      console.error(error);
    } finally {
      setCreatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 mb-4">
            <Globe2 className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Create Portfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Choose a saved resume. SmartNShine will create a draft portfolio
            with your profile, skills, experience, and projects.
          </p>
        </div>

        {loading ? (
          <div className="text-gray-600 dark:text-gray-400">
            Loading resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="border border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-bold mb-2">No resumes found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create or upload a resume first, then come back here to generate
              your portfolio.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {resumes.map((resume) => (
              <article
                key={resume._id}
                className="border border-gray-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-950 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-zinc-900">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      {resume.resumeTitle || resume.name || "Untitled Resume"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Updated{" "}
                      {resume.updatedAt
                        ? new Date(resume.updatedAt).toLocaleDateString()
                        : "recently"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={creatingId === resume._id}
                  onClick={() => handleCreate(resume._id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {creatingId === resume._id ? "Creating..." : "Use Resume"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioCreate;
