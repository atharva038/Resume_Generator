import {useState, useEffect} from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  ExternalLink,
  Calendar,
  Building2,
  Filter,
  Loader2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: "software developer",
    location: "in", // Default to India
    workType: "all", // all, remote, onsite, hybrid
    page: 1,
  });
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Load 10 pages of results

  // Backend API URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Work type options
  const workTypes = [
    {value: "all", label: "All Jobs", icon: "💼"},
    {value: "remote", label: "Remote", icon: "🏠"},
    {value: "onsite", label: "On-site", icon: "🏢"},
    {value: "hybrid", label: "Hybrid", icon: "🔄"},
  ];

  const searchJobs = async () => {
    if (!searchParams.query.trim()) {
      toast.error("Please enter a job title or keyword", {
        icon: "🔍",
        duration: 2500,
      });
      return;
    }

    setLoading(true);
    setCurrentPage(1); // Reset to page 1 when searching

    try {
      // Load 10 pages of results
      const allJobs = [];
      const promises = [];

      for (let page = 1; page <= totalPages; page++) {
        const url = `${API_BASE_URL}/jobs/adzuna?query=${encodeURIComponent(
          searchParams.query
        )}&country=${searchParams.location}&page=${page}`;

        promises.push(
          fetch(url)
            .then((res) => res.json())
            .then((data) => ({
              page,
              results: data.results || [],
              mean: data.mean,
            }))
        );
      }

      const results = await Promise.all(promises);

      // Combine all results
      results.forEach((result) => {
        allJobs.push(...result.results);
      });

      // Use the mean from first page for stats
      const meanSalary = results[0]?.mean || 0;

      // Filter jobs based on work type
      let filteredJobs = allJobs;
      if (searchParams.workType !== "all") {
        filteredJobs = filteredJobs.filter((job) => {
          const title = job.title?.toLowerCase() || "";
          const description = job.description?.toLowerCase() || "";
          const combined = title + " " + description;

          if (searchParams.workType === "remote") {
            return (
              combined.includes("remote") ||
              combined.includes("work from home") ||
              combined.includes("wfh")
            );
          } else if (searchParams.workType === "onsite") {
            return (
              !combined.includes("remote") &&
              !combined.includes("work from home") &&
              !combined.includes("hybrid")
            );
          } else if (searchParams.workType === "hybrid") {
            return combined.includes("hybrid");
          }
          return true;
        });
      }

      setJobs(filteredJobs);
      setStats({
        count: filteredJobs.length,
        mean: meanSalary,
      });

      if (filteredJobs.length === 0) {
        toast("No jobs found. Try different keywords or work type!", {
          icon: "🔍",
          duration: 3000,
        });
      } else {
        toast.success(`Found ${filteredJobs.length} jobs in India!`, {
          icon: "✨",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(
        "Failed to fetch jobs. Please check your API credentials in .env file.",
        {
          icon: "❌",
          duration: 4000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchJobs();
  }, [searchParams.workType]); // Re-fetch when work type changes

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({...searchParams, page: 1});
    searchJobs();
  };

  const getWorkTypeFromJob = (job) => {
    const title = job.title?.toLowerCase() || "";
    const description = job.description?.toLowerCase() || "";
    const combined = title + " " + description;

    if (
      combined.includes("remote") ||
      combined.includes("work from home") ||
      combined.includes("wfh")
    ) {
      return {
        label: "Remote",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        icon: "🏠",
      };
    } else if (combined.includes("hybrid")) {
      return {
        label: "Hybrid",
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        icon: "🔄",
      };
    } else {
      return {
        label: "On-site",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        icon: "🏢",
      };
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) {
      return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString(
        "en-IN"
      )}`;
    }
    return min
      ? `₹${min.toLocaleString("en-IN")}+`
      : `Up to ₹${max.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            <Briefcase className="inline-block w-10 h-10 mr-3 text-blue-600" />
            Job Search in India 🇮🇳
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find your dream job in India - Remote, On-site, or Hybrid positions
          </p>
        </div>

        {/* Work Type Tabs */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            {workTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setSearchParams({
                    ...searchParams,
                    workType: type.value,
                    page: 1,
                  });
                  setActiveTab(type.value);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === type.value
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
                }`}
              >
                <span className="text-xl">{type.icon}</span>
                <span>{type.label}</span>
                {activeTab === type.value && stats && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {stats.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-5xl mx-auto mb-8">
          <form
            onSubmit={handleSearch}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* Job Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Search className="inline w-4 h-4 mr-2" />
                  Job Title or Keywords
                </label>
                <input
                  type="text"
                  value={searchParams.query}
                  onChange={(e) =>
                    setSearchParams({...searchParams, query: e.target.value})
                  }
                  placeholder="e.g., Software Developer, Marketing Manager"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Searching in India...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Jobs in India
                </>
              )}
            </button>
          </form>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Jobs Found
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.count.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Average Salary (Est.)
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{Math.round(stats.mean).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Job Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="space-y-4">
              {jobs
                .slice((currentPage - 1) * 10, currentPage * 10) // Show 10 jobs per page
                .map((job, index) => (
                  <div
                    key={job.id || index}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        {/* Job Title */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {job.title}
                        </h3>

                        {/* Company */}
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <Building2 className="w-4 h-4 mr-2" />
                          <span className="font-medium">
                            {job.company?.display_name ||
                              "Company not specified"}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>
                            {job.location?.display_name ||
                              "Location not specified"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                          {job.description
                            ?.replace(/<[^>]*>/g, "")
                            .substring(0, 200)}
                          ...
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {/* Work Type Badge */}
                          {(() => {
                            const workType = getWorkTypeFromJob(job);
                            return (
                              <span
                                className={`px-3 py-1 ${workType.color} text-xs font-medium rounded-full flex items-center gap-1`}
                              >
                                <span>{workType.icon}</span>
                                <span>{workType.label}</span>
                              </span>
                            );
                          })()}
                          {job.category?.label && (
                            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                              {job.category.label}
                            </span>
                          )}
                          {job.contract_time && (
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
                              {job.contract_time}
                            </span>
                          )}
                          {job.contract_type && (
                            <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full">
                              {job.contract_type}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Side - Salary & Actions */}
                      <div className="flex flex-col items-end space-y-3">
                        {/* Salary */}
                        <div className="text-right">
                          <div className="flex items-center text-green-600 dark:text-green-400 font-semibold text-lg">
                            <DollarSign className="w-5 h-5 mr-1" />
                            {formatSalary(job.salary_min, job.salary_max)}
                          </div>
                        </div>

                        {/* Date Posted */}
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(job.created)}
                        </div>

                        {/* Apply Button */}
                        <a
                          href={job.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* No Results */}
            {jobs.length === 0 && !loading && (
              <div className="text-center py-20">
                <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or location
                </p>
              </div>
            )}

            {/* Pagination */}
            {jobs.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                {/* Previous Button */}
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                      window.scrollTo({top: 0, behavior: "smooth"});
                    }
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from(
                  {length: Math.min(totalPages, Math.ceil(jobs.length / 10))},
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({top: 0, behavior: "smooth"});
                    }}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent font-semibold shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => {
                    const maxPage = Math.ceil(jobs.length / 10);
                    if (currentPage < maxPage) {
                      setCurrentPage(currentPage + 1);
                      window.scrollTo({top: 0, behavior: "smooth"});
                    }
                  }}
                  disabled={currentPage >= Math.ceil(jobs.length / 10)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="max-w-5xl mx-auto mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Powered by{" "}
            <a
              href="https://developer.adzuna.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Adzuna API
            </a>
            . Job listings are updated in real-time from thousands of sources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
