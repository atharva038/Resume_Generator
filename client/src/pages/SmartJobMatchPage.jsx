import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {SmartJobMatch} from "../components/features/job-match";
import {Loader2, AlertCircle, Plus} from "lucide-react";
import toast from "react-hot-toast";

const SmartJobMatchPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch user's resumes
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token exists:", !!token);

      if (!token) {
        console.log("❌ No token, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("🌐 Fetching resumes from:", `${API_BASE_URL}/resume/list`);
      const response = await fetch(`${API_BASE_URL}/resume/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log("🚫 Unauthorized, redirecting to login");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch resumes");
      }

      const data = await response.json();
      console.log("� Raw API response:", data);

      // Handle different response structures
      const resumeList = Array.isArray(data)
        ? data
        : data.resumes || data.data || [];
      console.log("�📄 Resumes loaded:", resumeList.length, "resumes");
      setResumes(resumeList);

      // Auto-select first resume if available
      if (resumeList.length > 0 && !selectedResume) {
        console.log("✅ Auto-selecting first resume:", resumeList[0]._id);
        loadResumeDetails(resumeList[0]._id);
      }
    } catch (error) {
      console.error("❌ Error fetching resumes:", error);
      toast.error("Failed to load resumes");
    } finally {
      console.log("🏁 Loading complete");
      setLoading(false);
    }
  };

  const loadResumeDetails = async (resumeId) => {
    try {
      console.log("📥 Loading resume details for ID:", resumeId);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Resume details response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to load resume details");
      }

      const data = await response.json();
      console.log("✅ Resume loaded:", data.resumeTitle || data.name);
      console.log("📋 Resume data:", data);
      setSelectedResume(data);
      toast.success(`Loaded resume: ${data.resumeTitle || data.name}`);
    } catch (error) {
      console.error("❌ Error loading resume:", error);
      toast.error("Failed to load resume details");
    }
  };

  if (loading) {
    console.log("⏳ Still loading...");
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading your resumes...
          </p>
        </div>
      </div>
    );
  }

  if (resumes.length === 0) {
    console.log("📭 No resumes found, showing empty state");
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Resumes Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              To use Smart Job Match, you need to create a resume first. Our AI
              will analyze your resume and find the perfect job matches for you!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Resume
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold py-3 px-8 rounded-lg transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("🎯 Rendering Smart Job Match with", resumes.length, "resume(s)");
  console.log(
    "📌 Selected resume:",
    selectedResume ? selectedResume._id : "none"
  );

  return (
    <div>
      {/* Resume Selector */}
      {resumes.length > 1 && (
        <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Select Resume:
              </label>
              <select
                value={selectedResume?._id || ""}
                onChange={(e) => loadResumeDetails(e.target.value)}
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.resumeTitle || resume.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Manage Resumes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Job Match Component */}
      {selectedResume && <SmartJobMatch resumeData={selectedResume} />}
    </div>
  );
};

export default SmartJobMatchPage;
