/**
 * TwoColumn Layout
 * Two-column layout with main content and sidebar
 * Best for: Modern resumes with skills/info sidebar
 */

import React from "react";

const TwoColumn = ({
  children,
  sidebar,
  theme = {},
  sidebarWidth = "35%",
  mainWidth = "65%",
  sidebarPosition = "left", // 'left' or 'right'
  gap = "2rem",
  padding = "2rem",
  sidebarBackground,
  mainBackground,
}) => {
  // Default theme values
  const defaultTheme = {
    colors: {
      background: "#ffffff",
      backgroundSecondary: "#f9fafb",
    },
  };

  const mergedTheme = {
    colors: {...defaultTheme.colors, ...theme.colors},
  };

  const sidebarBg = sidebarBackground || mergedTheme.colors.backgroundSecondary;
  const mainBg = mainBackground || mergedTheme.colors.background;

  // Determine flex direction based on sidebar position
  const flexDirection = sidebarPosition === "left" ? "row" : "row-reverse";

  return (
    <div
      className="two-column-layout"
      style={{
        display: "flex",
        flexDirection,
        minHeight: "100vh",
        gap,
      }}
    >
      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: sidebarWidth,
          minWidth: "250px",
          backgroundColor: sidebarBg,
          padding,
        }}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <main
        className="main-content"
        style={{
          width: mainWidth,
          flex: 1,
          backgroundColor: mainBg,
          padding,
        }}
      >
        {children}
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .two-column-layout {
            flex-direction: column !important;
          }

          .sidebar,
          .main-content {
            width: 100% !important;
            min-width: 100% !important;
          }
        }

        @media print {
          .two-column-layout {
            gap: 0 !important;
          }

          .sidebar,
          .main-content {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TwoColumn;
