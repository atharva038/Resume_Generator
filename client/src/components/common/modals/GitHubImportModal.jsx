import {useState, useEffect} from "react";
import {
  X,
  Github,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Code,
  Briefcase,
  Star,
  Plus,
  RefreshCw,
  Sparkles,
  Award,
} from "lucide-react";
import axios from "axios";
import {useToggle} from "@/hooks";
import {storage, STORAGE_KEYS} from "@/utils/storage";

const GitHubImportModal = ({isOpen, onClose, onImport, currentResume}) => {
  const [step, setStep] = useState("confirm"); // confirm, fetch, select, merge
  const [username, setUsername] = useState("");
  const [loading, toggleLoading, setLoadingTrue, setLoadingFalse] =
    useToggle(false);
  const [error, setError] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [selectedItems, setSelectedItems] = useState({
    profile: false,
    projects: [],
    skills: [],
    experience: [],
    certifications: [],
  });
  const [activeTab, setActiveTab] = useState("projects");
  const [mergeOptions, setMergeOptions] = useState({
    projects: "add", // add, replace, skip
    skills: "add",
    experience: "add",
    certifications: "add",
  });

  // Load cached GitHub data from storage
  useEffect(() => {
    const cachedData = storage.get("githubData");
    const cachedUsername = storage.get("githubUsername");

    if (cachedData && cachedUsername) {
      try {
        setGithubData(cachedData);
        setUsername(cachedUsername);
        // Auto-proceed to selection if data exists
        if (isOpen && step === "confirm") {
          setStep("select");
        }
      } catch (error) {
        console.error("Error loading cached GitHub data:", error);
        storage.remove("githubData");
        storage.remove("githubUsername");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes (but keep cached data)
      setStep("confirm");
      setSelectedItems({
        profile: false,
        projects: [],
        skills: [],
        experience: [],
        certifications: [],
      });
      setError(null);
    }
  }, [isOpen]);

  const handleFetchGithubData = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username");
      return;
    }

    setLoadingTrue();
    setError(null);

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/github/${username.trim()}`
      );

      if (response.data.success) {
        const fetchedData = response.data.data;
        console.log("✅ GitHub data fetched successfully:", fetchedData);
        console.log("📊 Data breakdown:");
        console.log(
          "  - Top Repositories:",
          fetchedData.topRepositories?.length || 0
        );
        console.log(
          "  - Skills/Languages:",
          fetchedData.skills?.languages?.length || 0
        );
        console.log(
          "  - Experience items:",
          fetchedData.experience?.length || 0
        );
        console.log(
          "  - Certifications:",
          fetchedData.certifications?.length || 0
        );

        setGithubData(fetchedData);
        // Cache the data in localStorage
        localStorage.setItem("githubData", JSON.stringify(fetchedData));
        localStorage.setItem("githubUsername", username.trim());
        setStep("select");
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

  const toggleProjectSelection = (index) => {
    setSelectedItems((prev) => {
      const projects = [...prev.projects];
      if (projects.includes(index)) {
        return {...prev, projects: projects.filter((i) => i !== index)};
      } else {
        return {...prev, projects: [...projects, index]};
      }
    });
  };

  const toggleSkillSelection = (index) => {
    setSelectedItems((prev) => {
      const skills = [...prev.skills];
      if (skills.includes(index)) {
        return {...prev, skills: skills.filter((i) => i !== index)};
      } else {
        return {...prev, skills: [...skills, index]};
      }
    });
  };

  const selectAllProjects = () => {
    if (githubData) {
      const allIndexes = githubData.topRepositories.map((_, idx) => idx);
      setSelectedItems((prev) => ({...prev, projects: allIndexes}));
    }
  };

  const selectAllSkills = () => {
    if (githubData) {
      const allIndexes = githubData.skills.languages.map((_, idx) => idx);
      setSelectedItems((prev) => ({...prev, skills: allIndexes}));
    }
  };

  const toggleExperienceSelection = (index) => {
    setSelectedItems((prev) => {
      const experience = [...prev.experience];
      if (experience.includes(index)) {
        return {...prev, experience: experience.filter((i) => i !== index)};
      } else {
        return {...prev, experience: [...experience, index]};
      }
    });
  };

  const selectAllExperience = () => {
    if (githubData && githubData.experience) {
      const allIndexes = githubData.experience.map((_, idx) => idx);
      setSelectedItems((prev) => ({...prev, experience: allIndexes}));
    }
  };

  const toggleCertificationSelection = (index) => {
    setSelectedItems((prev) => {
      const certifications = [...prev.certifications];
      if (certifications.includes(index)) {
        return {
          ...prev,
          certifications: certifications.filter((i) => i !== index),
        };
      } else {
        return {...prev, certifications: [...certifications, index]};
      }
    });
  };

  const selectAllCertifications = () => {
    if (githubData && githubData.certifications) {
      const allIndexes = githubData.certifications.map((_, idx) => idx);
      setSelectedItems((prev) => ({...prev, certifications: allIndexes}));
    }
  };

  const handleImport = () => {
    if (!githubData) return;

    const importedData = {
      profile: selectedItems.profile ? githubData.profile : null,
      projects: selectedItems.projects.map(
        (idx) => githubData.topRepositories[idx]
      ),
      skills: selectedItems.skills.map(
        (idx) => githubData.skills.languages[idx].name
      ),
      experience: selectedItems.experience.map(
        (idx) => githubData.experience[idx]
      ),
      certifications: selectedItems.certifications.map(
        (idx) => githubData.certifications[idx]
      ),
      stats: githubData.stats,
      mergeOptions,
    };

    onImport(importedData);
    onClose();
  };

  const hasSelections = () => {
    return (
      selectedItems.profile ||
      selectedItems.projects.length > 0 ||
      selectedItems.skills.length > 0 ||
      selectedItems.experience.length > 0 ||
      selectedItems.certifications.length > 0
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Github className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Import GitHub Data
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add projects and skills to your resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Confirmation */}
          {step === "confirm" && (
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <Github className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Import GitHub Profile
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fetch your GitHub profile, projects, and skills. You can
                  choose which items to add to your resume.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-left">
                  GitHub Username
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleFetchGithubData()
                    }
                    placeholder="e.g., octocat"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors text-gray-900 dark:text-white"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFetchGithubData}
                  disabled={loading || !username.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
            </div>
          )}

          {/* Step 2: Selection */}
          {step === "select" && githubData && (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`px-4 py-2 font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "projects"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Code className="w-4 h-4 inline mr-2" />
                  Projects
                  <span
                    className={
                      selectedItems.projects.length > 0
                        ? "text-purple-600 dark:text-purple-400"
                        : ""
                    }
                  >
                    ({selectedItems.projects.length}/
                    {githubData.topRepositories?.length || 0})
                  </span>
                  {activeTab === "projects" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-4 py-2 font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "skills"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Skills
                  <span
                    className={
                      selectedItems.skills.length > 0
                        ? "text-purple-600 dark:text-purple-400"
                        : ""
                    }
                  >
                    ({selectedItems.skills.length}/
                    {githubData.skills?.languages?.length || 0})
                  </span>
                  {activeTab === "skills" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("experience")}
                  className={`px-4 py-2 font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "experience"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Experience
                  <span
                    className={
                      selectedItems.experience.length > 0
                        ? "text-purple-600 dark:text-purple-400"
                        : ""
                    }
                  >
                    ({selectedItems.experience.length}/
                    {githubData.experience?.length || 0})
                  </span>
                  {activeTab === "experience" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("certifications")}
                  className={`px-4 py-2 font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "certifications"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-2" />
                  Achievements
                  <span
                    className={
                      selectedItems.certifications.length > 0
                        ? "text-purple-600 dark:text-purple-400"
                        : ""
                    }
                  >
                    ({selectedItems.certifications.length}/
                    {githubData.certifications?.length || 0})
                  </span>
                  {activeTab === "certifications" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2 font-semibold transition-colors relative whitespace-nowrap ${
                    activeTab === "profile"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Profile
                  {activeTab === "profile" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  )}
                </button>
              </div>

              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Select Projects to Add
                    </h3>
                    <button
                      onClick={selectAllProjects}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      Select All
                    </button>
                  </div>

                  {/* Merge Options */}
                  {currentResume?.projects?.length > 0 && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        You have {currentResume.projects.length} existing
                        project(s)
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setMergeOptions((prev) => ({
                              ...prev,
                              projects: "add",
                            }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            mergeOptions.projects === "add"
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          ➕ Add New
                        </button>
                        <button
                          onClick={() =>
                            setMergeOptions((prev) => ({
                              ...prev,
                              projects: "replace",
                            }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            mergeOptions.projects === "replace"
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          🔁 Replace All
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {githubData.topRepositories.map((repo, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedItems.projects.includes(idx)
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-600"
                        }`}
                        onClick={() => toggleProjectSelection(idx)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.projects.includes(idx)}
                            onChange={() => toggleProjectSelection(idx)}
                            className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {repo.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {repo.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
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
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Select Skills to Add
                    </h3>
                    <button
                      onClick={selectAllSkills}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      Select All
                    </button>
                  </div>

                  {/* Merge Options */}
                  {currentResume?.skills?.length > 0 && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        You have {currentResume.skills.length} existing skill(s)
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setMergeOptions((prev) => ({
                              ...prev,
                              skills: "add",
                            }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            mergeOptions.skills === "add"
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          ➕ Add New
                        </button>
                        <button
                          onClick={() =>
                            setMergeOptions((prev) => ({
                              ...prev,
                              skills: "replace",
                            }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            mergeOptions.skills === "replace"
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          🔁 Replace All
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {githubData.skills.languages.map((lang, idx) => (
                      <div
                        key={idx}
                        className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedItems.skills.includes(idx)
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-600"
                        }`}
                        onClick={() => toggleSkillSelection(idx)}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.skills.includes(idx)}
                            onChange={() => toggleSkillSelection(idx)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {lang.name}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              {lang.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && githubData.experience && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Select Experience to Add
                    </h3>
                    <button
                      onClick={selectAllExperience}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      Select All
                    </button>
                  </div>

                  {/* Merge Options */}
                  {currentResume?.experience?.length > 0 && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        You have {currentResume.experience.length} existing
                        experience(s)
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setMergeOptions((prev) => ({
                              ...prev,
                              experience: "add",
                            }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            mergeOptions.experience === "add"
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          ➕ Add New
                        </button>
                        <button
                          onClick={() =>
                            setMergeOptions((prev) => ({
                              ...prev,
                              experience: "replace",
                            }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            mergeOptions.experience === "replace"
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          🔁 Replace All
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {githubData.experience.map((exp, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedItems.experience.includes(idx)
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-600"
                        }`}
                        onClick={() => toggleExperienceSelection(idx)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.experience.includes(idx)}
                            onChange={() => toggleExperienceSelection(idx)}
                            className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {exp.position}
                            </h4>
                            <p className="text-sm text-purple-600 dark:text-purple-400">
                              {exp.company}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {exp.description}
                            </p>
                            {exp.highlights && exp.highlights.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {exp.highlights.map((highlight, hIdx) => (
                                  <li
                                    key={hIdx}
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                  >
                                    • {highlight}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications/Achievements Tab */}
              {activeTab === "certifications" && githubData.certifications && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Select Achievements to Add
                    </h3>
                    <button
                      onClick={selectAllCertifications}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      Select All
                    </button>
                  </div>

                  {/* Merge Options */}
                  {currentResume?.certifications?.length > 0 && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        You have {currentResume.certifications.length} existing
                        certification(s)
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setMergeOptions((prev) => ({
                              ...prev,
                              certifications: "add",
                            }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            mergeOptions.certifications === "add"
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          ➕ Add New
                        </button>
                        <button
                          onClick={() =>
                            setMergeOptions((prev) => ({
                              ...prev,
                              certifications: "replace",
                            }))
                          }
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            mergeOptions.certifications === "replace"
                              ? "bg-purple-600 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          🔁 Replace All
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {githubData.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedItems.certifications.includes(idx)
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-600"
                        }`}
                        onClick={() => toggleCertificationSelection(idx)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.certifications.includes(idx)}
                            onChange={() => toggleCertificationSelection(idx)}
                            className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {cert.title}
                                </h4>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {cert.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {cert.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Profile Information
                  </h3>
                  <div
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedItems.profile
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-purple-300 dark:hover:border-purple-600"
                    }`}
                    onClick={() =>
                      setSelectedItems((prev) => ({
                        ...prev,
                        profile: !prev.profile,
                      }))
                    }
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.profile}
                        onChange={() =>
                          setSelectedItems((prev) => ({
                            ...prev,
                            profile: !prev.profile,
                          }))
                        }
                        className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <img
                        src={githubData.profile.avatar}
                        alt={githubData.profile.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {githubData.profile.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          @{githubData.profile.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {githubData.profile.bio}
                        </p>
                        {githubData.profile.location && (
                          <p className="text-sm text-gray-500 mt-1">
                            📍 {githubData.profile.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "select" && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {hasSelections() ? (
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {selectedItems.projects.length} project(s),{" "}
                    {selectedItems.skills.length} skill(s),{" "}
                    {selectedItems.experience.length} experience(s),{" "}
                    {selectedItems.certifications.length} achievement(s)
                    selected
                  </span>
                ) : (
                  <span>Select items to add to your resume</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep("confirm");
                    // Allow re-fetch by clearing cached data
                    localStorage.removeItem("githubData");
                    localStorage.removeItem("githubUsername");
                    setGithubData(null);
                    setUsername("");
                  }}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Re-fetch
                </button>
                <button
                  onClick={handleImport}
                  disabled={!hasSelections()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Add to Resume
                </button>
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
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GitHubImportModal;
