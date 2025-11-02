/**
 * SidebarRight Layout
 * Main content with right sidebar
 * Best for: Tech resumes, modern professional layouts
 */

import React from "react";

const SidebarRight = ({
  children,
  sidebar,
  theme = {},
  sidebarWidth = "280px",
  sidebarBackground,
  mainBackground,
  containerPadding = "0",
  sidebarPadding = "2rem",
  mainPadding = "2rem",
}) => {
  // Default theme values
  const defaultTheme = {
    colors: {
      background: "#ffffff",
      backgroundSecondary: "#f3f4f6",
    },
  };

  const mergedTheme = {
    colors: {...defaultTheme.colors, ...theme.colors},
  };

  const sidebarBg = sidebarBackground || mergedTheme.colors.backgroundSecondary;
  const mainBg = mainBackground || mergedTheme.colors.background;

  return (
    <div
      className="sidebar-right-layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        padding: containerPadding,
      }}
    >
      {/* Main Content */}
      <main
        className="main-content-left"
        style={{
          flex: 1,
          backgroundColor: mainBg,
          padding: mainPadding,
        }}
      >
        {children}
      </main>

      {/* Right Sidebar */}
      <aside
        className="sidebar-right"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          backgroundColor: sidebarBg,
          padding: sidebarPadding,
        }}
      >
        {sidebar}
      </aside>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-right-layout {
            flex-direction: column !important;
          }

          .sidebar-right {
            width: 100% !important;
            min-width: 100% !important;
            order: 2;
          }

          .main-content-left {
            order: 1;
          }
        }

        @media print {
          .sidebar-right-layout {
            padding: 0 !important;
          }

          .sidebar-right {
            min-width: 200px !important;
            width: 200px !important;
            padding: 1rem !important;
          }

          .main-content-left {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarRight;
