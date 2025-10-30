import {Link, useLocation} from "react-router-dom";
import BlockableLink from "./BlockableLink";
import {useState} from "react";
import {
  Home,
  Grid,
  Palette,
  Wand2,
  Target,
  Mail,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import {useAuth} from "../context/AuthContext";

const Sidebar = ({isOpen, setIsOpen}) => {
  const location = useLocation();
  const {user} = useAuth();

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      description: "Back to homepage",
    },
    {
      name: "Features",
      path: "/#features",
      icon: Grid,
      description: "Explore features",
      isHash: true,
    },
    {
      name: "Templates",
      path: "/templates",
      icon: Palette,
      description: "Browse templates",
    },
    {
      name: "AI Enhancer",
      path: "/upload",
      icon: Wand2,
      description: "Build resume with AI",
    },
    {
      name: "ATS Analyzer",
      path: "/ats-analyzer",
      icon: Target,
      description: "Check ATS compatibility",
    },
    {
      name: "Job Search",
      path: "/job-search",
      icon: Briefcase,
      description: "Find jobs with Adzuna",
    },
    {
      name: "My Resumes",
      path: "/dashboard",
      icon: LayoutDashboard,
      description: "Manage your resumes",
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: MessageCircle,
      description: "Share your feedback",
    },
    {
      name: "Contact",
      path: "/contact",
      icon: Mail,
      description: "Get in touch",
    },
  ];

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("/#")) return false;
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0 lg:w-20"
        } overflow-hidden ${isOpen ? "lg:pr-4" : ""}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle Section */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 relative">
            {/* Brand Name/Logo */}
            <Link
              to="/"
              className={`flex items-center gap-2 text-xl font-bold group transition-all duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 lg:opacity-0"
              }`}
            >
              <div className="relative">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                SmartNShine
              </span>
            </Link>

            {/* Logo Icon Only - When Collapsed (Desktop) */}
            <div
              className={`hidden lg:flex items-center justify-center transition-all duration-300 ${
                isOpen ? "opacity-0 w-0" : "opacity-100 w-full"
              }`}
            >
              <Link to="/" className="relative group">
                <Sparkles className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>

            {/* Toggle Button - Desktop (Top, next to logo) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 z-60 border-4 border-white dark:border-gray-900 absolute top-1/2 -translate-y-1/2
                ${isOpen ? "right-0 ml-2" : "right-0 -translate-x-1/2"}`}
              style={{boxShadow: "0 2px 12px 0 rgba(59,130,246,0.25)"}}
              title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-2">
              {/* Admin Panel Link - Only for Admin Users */}
              {user && user.role === "admin" && (
                <BlockableLink
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ease-out relative overflow-hidden ${
                    location.pathname.startsWith("/admin")
                      ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 dark:hover:from-purple-900/10 dark:hover:to-blue-900/10 hover:translate-x-1"
                  }`}
                  title={!isOpen ? "Admin Panel" : ""}
                >
                  {/* Active indicator bar */}
                  {location.pathname.startsWith("/admin") && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 active-indicator"></span>
                  )}

                  <Shield
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                      location.pathname.startsWith("/admin")
                        ? "scale-110"
                        : "group-hover:scale-110 group-hover:rotate-3"
                    }`}
                  />
                  <span
                    className={`font-medium whitespace-nowrap transition-all duration-300 ${
                      isOpen
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4 lg:hidden"
                    }`}
                  >
                    Admin Panel
                  </span>
                  {location.pathname.startsWith("/admin") && (
                    <span
                      className={`ml-auto bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-2 py-0.5 rounded-full font-semibold transition-all duration-300 ${
                        isOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4 lg:hidden"
                      }`}
                    >
                      Active
                    </span>
                  )}
                </BlockableLink>
              )}

              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = isActivePath(link.path);

                return link.isHash ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ease-out relative overflow-hidden ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"
                    }`}
                    title={!isOpen ? link.name : ""}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 active-indicator"></span>
                    )}

                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                        isActive
                          ? "scale-110"
                          : "group-hover:scale-110 group-hover:rotate-3"
                      }`}
                    />
                    <span
                      className={`font-medium whitespace-nowrap transition-all duration-300 ${
                        isOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4 lg:hidden"
                      }`}
                    >
                      {link.name}
                    </span>
                  </a>
                ) : (
                  <BlockableLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ease-out relative overflow-hidden ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"
                    }`}
                    title={!isOpen ? link.name : ""}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 active-indicator"></span>
                    )}

                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                        isActive
                          ? "scale-110"
                          : "group-hover:scale-110 group-hover:rotate-3"
                      }`}
                    />
                    <span
                      className={`font-medium whitespace-nowrap transition-all duration-300 ${
                        isOpen
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4 lg:hidden"
                      }`}
                    >
                      {link.name}
                    </span>
                  </BlockableLink>
                );
              })}
            </div>
          </nav>

          {/* Footer Section */}
          <div
            className={`border-t border-gray-200 dark:border-gray-800 p-4 transition-all duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 lg:opacity-0"
            }`}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2025 SmartNShine
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
