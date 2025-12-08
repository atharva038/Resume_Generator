import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {GitHubExtractor} from "../components/features/github";
import {CheckCircle} from "lucide-react";

const GitHubImport = () => {
  const navigate = useNavigate();
  const [extracted, setExtracted] = useState(false);

  const handleDataExtracted = (githubData) => {
    // Store the GitHub data in localStorage or state management
    localStorage.setItem("githubData", JSON.stringify(githubData));
    setExtracted(true);

    // Show success message and redirect after 2 seconds
    setTimeout(() => {
      navigate("/upload");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 py-20 px-4">
      <div className="container mx-auto">
        <GitHubExtractor onDataExtracted={handleDataExtracted} />

        {/* Success Modal */}
        {extracted && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-900 dark:text-white mb-2">
                Data Extracted Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-600 dark:text-gray-400 mb-4">
                Redirecting to AI Resume Builder...
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-full animate-progress"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        
        .animate-progress {
          animation: progress 2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GitHubImport;
