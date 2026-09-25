import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Briefcase,
  Sparkles,
  Flame,
} from "lucide-react";
import { OPEN_ROLES } from "./careersData";

export default function CareersOpenings({ onSelectJob, onApplyJob }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const departments = ["All", "Marketing & Growth", "Business & Strategy", "Engineering"];

  const filteredRoles = useMemo(() => {
    return OPEN_ROLES.filter((role) => {
      // Department filter
      if (selectedDepartment !== "All" && role.department !== selectedDepartment) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = role.title.toLowerCase().includes(q);
        const matchesSummary = role.summary.toLowerCase().includes(q);
        const matchesTags = role.tags?.some((t) => t.toLowerCase().includes(q));
        const matchesDept = role.department.toLowerCase().includes(q);
        return matchesTitle || matchesSummary || matchesTags || matchesDept;
      }
      return true;
    });
  }, [searchQuery, selectedDepartment, selectedLocation]);

  return (
    <section id="openings" className="py-20 sm:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-zinc-200 dark:border-zinc-700">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Founding Openings</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-950 dark:text-white">
            Find Your{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
              Founding Calling
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            Join our early-stage founding circle. Work directly with the technical founders, lead your domain, and shape the company from the ground up.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/10 backdrop-blur-xl shadow-2xs mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, area (e.g. Marketing, Growth, Figma, React), or keyword..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 text-sm sm:text-base transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-2 hidden sm:inline">
              Area:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedDepartment === dept
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs font-semibold"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Roles Listing Grid */}
        <div className="space-y-4 sm:space-y-5">
          <AnimatePresence>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => {
                const isHot = role.tags?.includes("Core Founding Role") || role.tags?.includes("Founding Partner");

                return (
                  <motion.div
                    key={role.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-400 dark:hover:border-zinc-600 backdrop-blur-md shadow-2xs hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left Details */}
                      <div className="space-y-3 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            {role.department}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                            {role.experience}
                          </span>
                          {isHot && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Key Founding Role
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => onSelectJob(role)}
                          className="text-xl sm:text-2xl font-medium tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors cursor-pointer"
                        >
                          {role.title}
                        </h3>

                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                          {role.summary}
                        </p>

                        {/* Meta Tags (Location, Type, Salary) */}
                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 pt-1 font-light">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{role.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{role.type}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {role.tags && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {role.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-white/5">
                        <button
                          onClick={() => onApplyJob(role)}
                          className="px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-sm font-medium shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectJob(role)}
                          className="px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              /* Empty State */
              <div className="p-12 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10">
                <Briefcase className="w-12 h-12 text-zinc-400 mx-auto mb-3 opacity-50" />
                <h4 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
                  No positions found matching your filter
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                  Try clearing your search query or area filter, or submit a general wildcard application!
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDepartment("All");
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Wildcard Application Card */}
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wildcard Inquiries</span>
            </div>
            <h3 className="text-2xl font-light text-zinc-900 dark:text-white">
              Have a superpower not listed above?
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 font-light max-w-xl">
              We are constantly seeking brilliant operators, creators, and marketers. Pitch us how you'd like to collaborate and make an impact.
            </p>
          </div>

          <button
            onClick={() => onApplyJob(null)}
            className="px-6 py-3 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 font-medium text-sm shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            Pitch Yourself →
          </button>
        </div>
      </div>
    </section>
  );
}
