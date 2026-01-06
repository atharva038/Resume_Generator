import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {useAuth} from "@/context/AuthContext";
import {resumeAPI} from "@/api/api";
import {parseValidationErrors} from "@/utils/errorHandler";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Calendar,
  User,
  Sparkles,
  FolderOpen,
  Download,
  Edit3,
  X,
} from "lucide-react";

const Dashboard = () => {
  const {user} = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingResume, setEditingResume] = useState(null);
  const [editForm, setEditForm] = useState({name: "", description: ""});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchResumes();
  }, [user, navigate]);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.list();
      setResumes(response.data.resumes);
    } catch (err) {
      setError("Failed to load resumes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await resumeAPI.delete(id);
      setResumes(resumes.filter((r) => r._id !== id));
      toast.success("Resume deleted successfully!", {
        icon: "🗑️",
        duration: 2000,
      });
    } catch (err) {
      toast.error("Failed to delete resume", {
        icon: "❌",
        duration: 3000,
      });
      console.error(err);
    }
  };

  const handleLoad = async (id) => {
    try {
      const response = await resumeAPI.getById(id);
      navigate("/editor", {state: {resumeData: response.data}});
    } catch (err) {
      toast.error("Failed to load resume", {
        icon: "❌",
        duration: 3000,
      });
      console.error(err);
    }
  };

  const handleEditInfo = (resume) => {
    setEditingResume(resume);
    setEditForm({
      name: resume.resumeTitle || resume.name || "Untitled Resume",
      description: resume.description || "",
    });
  };

  const handleSaveInfo = async () => {
    if (!editForm.name.trim()) {
      toast.error("Resume title is required", {
        icon: "📝",
        duration: 2000,
      });
      return;
    }

    try {
      await resumeAPI.update(editingResume._id, {
        resumeTitle: editForm.name,
        description: editForm.description,
      });
      setResumes(
        resumes.map((r) =>
          r._id === editingResume._id
            ? {
                ...r,
                resumeTitle: editForm.name,
                description: editForm.description,
              }
            : r
        )
      );
      setEditingResume(null);
      setEditForm({name: "", description: ""});
      toast.success("Resume info updated successfully!", {
        icon: "✅",
        duration: 2000,
      });
    } catch (err) {
      toast.error(
        "Failed to update resume info: " + parseValidationErrors(err),
        {
          icon: "❌",
          duration: 4000,
        }
      );
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-gray-200 dark:border-zinc-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Loading your resumes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-gray-900 dark:text-white tracking-tight">
                  My Resumes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome back,{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </span>
                </p>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                <Plus className="w-4 h-4" />
                Create New Resume
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-xs font-bold">
                      !
                    </span>
                  </div>
                </div>
                <p className="text-sm text-red-800 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 dark:text-gray-500 dark:text-gray-500 mb-1 font-medium">
                    Total Resumes
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {resumes.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 font-medium">
                    Last Updated
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {resumes.length > 0
                      ? new Date(resumes[0].updatedAt).toLocaleDateString(
                          "en-US",
                          {month: "short", day: "numeric"}
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 font-medium">
                    AI Enhanced
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {resumes.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Resume Grid */}
          {resumes.length === 0 ? (
            <div className="bg-white dark:bg-zinc-950 rounded-2xl p-12 sm:p-16 text-center border border-gray-200 dark:border-zinc-800">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                No Resumes Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm">
                Upload your first resume to get started with AI-powered
                optimization and ATS analysis
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Upload Your First Resume
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="group bg-white dark:bg-zinc-950 rounded-xl p-6 border border-gray-200 dark:border-zinc-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200"
                >
                  {/* Resume Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditInfo(resume)}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit name & description"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Resume Info */}
                  <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white line-clamp-1">
                    {resume.resumeTitle || resume.name || "Untitled Resume"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 line-clamp-1">
                    {resume.name}
                  </p>
                  {resume.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {resume.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 mb-5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoad(resume._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="px-3 py-2 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all duration-200"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Name & Description Modal */}
      {editingResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Resume Info
              </h2>
              <button
                onClick={() => setEditingResume(null)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume Title *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({...editForm, name: e.target.value})
                  }
                  placeholder="e.g., Software Engineer Resume - FAANG"
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                  This is for your reference only (not shown on the resume)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({...editForm, description: e.target.value})
                  }
                  placeholder="e.g., Tailored for FAANG applications with emphasis on system design"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5">
                  Add notes to help you remember this resume's purpose
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingResume(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInfo}
                className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
