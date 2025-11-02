/**
 * SidebarLeft Layout
 * Left sidebar with main content area
 * Best for: Creative resumes, portfolio-style layouts
 */

import React from "react";

const SidebarLeft = ({
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
      primary: "#1e40af",
    },
  };

  const mergedTheme = {
    colors: {...defaultTheme.colors, ...theme.colors},
  };

  const sidebarBg = sidebarBackground || mergedTheme.colors.primary;
  const mainBg = mainBackground || mergedTheme.colors.background;

  return (
    <div
      className="sidebar-left-layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        padding: containerPadding,
      }}
    >
      {/* Left Sidebar */}
      <aside
        className="sidebar-left"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          backgroundColor: sidebarBg,
          padding: sidebarPadding,
          color: "#ffffff",
        }}
      >
        {sidebar}
      </aside>

      {/* Main Content */}
      <main
        className="main-content-right"
        style={{
          flex: 1,
          backgroundColor: mainBg,
          padding: mainPadding,
        }}
      >
        {children}
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-left-layout {
            flex-direction: column !important;
          }

          .sidebar-left {
            width: 100% !important;
            min-width: 100% !important;
          }
        }

        @media print {
          .sidebar-left-layout {
            padding: 0 !important;
          }

          .sidebar-left {
            min-width: 200px !important;
            width: 200px !important;
            padding: 1rem !important;
          }

          .main-content-right {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarLeft;
