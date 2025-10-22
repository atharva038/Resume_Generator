import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {resumeAPI} from "../services/api";
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
} from "lucide-react";

const Dashboard = () => {
  const {user} = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
    } catch (err) {
      alert("Failed to delete resume");
      console.error(err);
    }
  };

  const handleLoad = async (id) => {
    try {
      const response = await resumeAPI.getById(id);
      navigate("/editor", {state: {resumeData: response.data}});
    } catch (err) {
      alert("Failed to load resume");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            Loading your resumes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                  <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    Your Workspace
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Resumes
                </h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <User className="w-5 h-5" />
                  <p className="text-lg">
                    Welcome back,{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {user?.name}
                    </span>
                    !
                  </p>
                </div>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create New Resume
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg dark:bg-red-900/20 dark:border-red-500">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-sm">
                      !
                    </span>
                  </div>
                </div>
                <p className="text-red-800 dark:text-red-300 font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Resumes
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {resumes.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
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
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    AI Enhanced
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {resumes.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-100 mb-1">Quick Actions</p>
                  <Link
                    to="/upload"
                    className="text-lg font-bold hover:underline"
                  >
                    + New Resume
                  </Link>
                </div>
                <Plus className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Resume Grid */}
          {resumes.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-16 text-center shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                <FileText className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                No Resumes Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Upload your first resume to get started with AI-powered
                optimization and ATS analysis
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Upload Your First Resume
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Resume Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  </div>

                  {/* Resume Info */}
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1">
                    {resume.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                    {resume.contact?.name || "Unnamed Resume"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Updated{" "}
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
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="px-4 py-2.5 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 dark:hover:border-red-500 transition-all duration-200"
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
    </div>
  );
};

export default Dashboard;
