import {Link, useLocation} from "react-router-dom";
import {BlockableLink} from "@/components/auth";
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
  TrendingUp,
  UserCircle,
  Tag,
  Mic,
} from "lucide-react";
import {useAuth} from "@/context/AuthContext";

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
    // {
    //   name: "AI Interview",
    //   path: "/interview",
    //   icon: Mic,
    //   description: "Practice mock interviews",
    //   badge: "NEW",
    // },
    {
      name: "My Resumes",
      path: "/my-resumes",
      icon: LayoutDashboard,
      description: "Manage your resumes",
    },
    // Temporarily disabled - Advanced Analytics
    // {
    //   name: "Analytics",
    //   path: "/analytics",
    //   icon: TrendingUp,
    //   description: "Advanced insights",
    //   badge: "PRO",
    // },
    {
      name: "Profile",
      path: "/profile",
      icon: UserCircle,
      description: "Profile & Subscription",
      requiresAuth: true,
    },
    {
      name: "Pricing",
      path: "/pricing",
      icon: Tag,
      description: "View Pricing",
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
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-black border-r border-gray-200 dark:border-zinc-800 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0 lg:w-20"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-zinc-800">
            {/* Expanded Logo */}
            {isOpen && (
              <Link
                to="/"
                className="flex items-center text-xl font-bold group"
              >
                <img
                  src="/Logo_Main.png"
                  alt="SmartNShine"
                  className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300 -mr-1"
                />
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  SmartNShine
                </span>
              </Link>
            )}

            {/* Collapsed Logo Icon */}
            {!isOpen && (
              <Link
                to="/"
                className="hidden lg:flex items-center justify-center w-full group"
              >
                <img
                  src="/Logo_Main.png"
                  alt="SmartNShine"
                  className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}

            {/* Toggle Button (Desktop) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-600 dark:text-gray-400 transition-all duration-200"
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
          <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col">
            <div className="space-y-1 flex-1">
              {/* Admin Panel Link */}
              {user && user.role === "admin" && (
                <BlockableLink
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    location.pathname.startsWith("/admin")
                      ? "bg-purple-950/30 text-purple-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-200"
                  }`}
                  title={!isOpen ? "Admin Panel" : ""}
                >
                  <Shield
                    className={`w-5 h-5 flex-shrink-0 ${
                      location.pathname.startsWith("/admin")
                        ? ""
                        : "group-hover:scale-110 transition-transform duration-200"
                    }`}
                  />
                  {isOpen && (
                    <span className="font-medium text-sm">Admin Panel</span>
                  )}
                  {isOpen && location.pathname.startsWith("/admin") && (
                    <span className="ml-auto bg-purple-900/30 text-purple-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                      Active
                    </span>
                  )}
                </BlockableLink>
              )}

              {/* Regular Navigation Links */}
              {navLinks.slice(0, -3).map((link) => {
                // Skip links that require auth when user is not logged in
                if (link.requiresAuth && !user) return null;

                const Icon = link.icon;
                const isActive = isActivePath(link.path);

                const linkClass = `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-950/30 text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white"
                }`;

                const content = (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        !isActive &&
                        "group-hover:scale-110 transition-transform duration-200"
                      }`}
                    />
                    {isOpen && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium text-sm">{link.name}</span>
                        {link.badge && (
                          <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                            {link.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                );

                return link.isHash ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={linkClass}
                    title={!isOpen ? link.name : ""}
                  >
                    {content}
                  </a>
                ) : (
                  <BlockableLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={linkClass}
                    title={!isOpen ? link.name : ""}
                  >
                    {content}
                  </BlockableLink>
                );
              })}
            </div>

            {/* Bottom Navigation Links (Profile, Pricing & Contact) */}
            <div className="space-y-1 mt-auto pt-2 border-t border-gray-200 dark:border-zinc-800">
              {navLinks.slice(-3).map((link) => {
                // Skip Profile link if user is not logged in
                if (link.requiresAuth && !user) return null;

                const Icon = link.icon;
                const isActive = isActivePath(link.path);

                const linkClass = `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-950/30 text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-gray-900 dark:hover:text-white"
                }`;

                const content = (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        !isActive &&
                        "group-hover:scale-110 transition-transform duration-200"
                      }`}
                    />
                    {isOpen && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium text-sm">{link.name}</span>
                        {link.badge && (
                          <span className="bg-primary-900/30 text-primary-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                            {link.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                );

                return (
                  <BlockableLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={linkClass}
                    title={!isOpen ? link.name : ""}
                  >
                    {content}
                  </BlockableLink>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          {isOpen && (
            <div className="border-t border-gray-200 dark:border-zinc-800 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center font-medium">
                © 2025 SmartNShine
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
