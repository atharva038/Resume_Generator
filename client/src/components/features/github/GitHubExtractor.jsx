import {useState} from "react";
import {
  Github,
  Sparkles,
  Star,
  GitFork,
  MapPin,
  Users,
  Code,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Briefcase,
  Award,
} from "lucide-react";
import axios from "axios";
import {useToggle} from "@/hooks";

const GitHubExtractor = ({onDataExtracted}) => {
  const [username, setUsername] = useState("");
  const [loading, toggleLoading, setLoadingTrue, setLoadingFalse] =
    useToggle(false);
  const [error, setError] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [
    showResults,
    toggleShowResults,
    setShowResultsTrue,
    setShowResultsFalse,
  ] = useToggle(false);

  const handleFetch = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoadingTrue();
    setError(null);
    setShowResultsFalse();
    setGithubData(null);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/github/${username.trim()}`
      );

      if (response.data.success) {
        setGithubData(response.data.data);
        setShowResultsTrue();
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("User not found. Please check the username and try again.");
      } else if (err.response?.status === 429) {
        setError("GitHub API rate limit exceeded. Please try again later.");
      } else {
        setError("Failed to fetch GitHub data. Please try again.");
      }
    } finally {
      setLoadingFalse();
    }
  };

  const handleUseData = () => {
    if (githubData && onDataExtracted) {
      onDataExtracted(githubData);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFetch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
          <Github className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
            GitHub Data Extraction
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Import Your GitHub Profile
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Automatically extract your projects, skills, experience, and
          achievements from GitHub
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          GitHub Username
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., octocat"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-400"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Fetch Data
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {showResults && githubData && (
        <div className="animate-fade-in-up">
          {/* Profile Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 mb-6">
            <div className="flex items-start gap-6 mb-6">
              <img
                src={githubData.profile.avatar}
                alt={githubData.profile.name}
                className="w-24 h-24 rounded-2xl shadow-lg ring-4 ring-purple-100 dark:ring-purple-900/50"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {githubData.profile.name}
                </h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">
                  @{githubData.profile.username}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {githubData.profile.bio}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {githubData.profile.location && (
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {githubData.profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    {githubData.profile.followers} followers
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Code className="w-4 h-4" />
                    {githubData.profile.publicRepos} repositories
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  {githubData.stats.totalStars}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total Stars
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  <GitFork className="w-5 h-5 text-blue-500" />
                  {githubData.stats.totalForks}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total Forks
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  <Code className="w-5 h-5 text-green-500" />
                  {githubData.stats.totalRepos}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Repositories
                </p>
              </div>
            </div>
          </div>

          {/* Top Repositories */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Repositories
              </h3>
            </div>
            <div className="space-y-4">
              {githubData.topRepositories.map((repo, idx) => (
                <div
                  key={idx}
                  className="group p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                      >
                        {repo.name}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {repo.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-500">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          {repo.forks}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills / Languages */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Skills & Technologies
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {githubData.skills.languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-700/50"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {lang.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    ({lang.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          {githubData.experience && githubData.experience.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Experience & Contributions
                </h3>
              </div>
              <div className="space-y-4">
                {githubData.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {exp.position}
                        </h4>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                          {exp.company}
                        </p>
                        {exp.period && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exp.period}
                          </p>
                        )}
                      </div>
                      {exp.url && (
                        <a
                          href={exp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {exp.description}
                    </p>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="space-y-1">
                        {exp.highlights.map((highlight, hIdx) => (
                          <li
                            key={hIdx}
                            className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2"
                          >
                            <span className="text-purple-600 dark:text-purple-400 mt-0.5">
                              •
                            </span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications/Achievements Section */}
          {githubData.certifications &&
            githubData.certifications.length > 0 && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Achievements & Recognition
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {githubData.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/50"
                    >
                      <div className="flex items-start gap-3">
                        <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {cert.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {cert.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {cert.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Use This Data Button */}
          <div className="text-center">
            <button
              onClick={handleUseData}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Use This Data for My Resume
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              This data will be used to enhance your resume with AI
            </p>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GitHubExtractor;
