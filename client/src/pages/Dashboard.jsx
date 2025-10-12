import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {resumeAPI} from "../services/api";

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
      navigate("/editor", {state: {resumeData: response.data.resume}});
    } catch (err) {
      alert("Failed to load resume");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 dark:text-gray-100">
              My Resumes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}!
            </p>
          </div>
          <Link to="/upload" className="btn-primary">
            Create New Resume
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              No resumes yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload your first resume to get started with AI optimization
            </p>
            <Link to="/upload" className="btn-primary">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="card p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
                  {resume.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoad(resume._id)}
                    className="flex-1 btn-primary"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
