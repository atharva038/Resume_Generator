/**
 * SingleColumn Layout
 * Full-width single column layout for traditional resumes
 * Best for: Professional, ATS-friendly, text-heavy resumes
 */

import React from "react";

const SingleColumn = ({
  children,
  theme = {},
  maxWidth = "800px",
  padding = "2rem",
  backgroundColor = "#ffffff",
}) => {
  // Default theme values
  const defaultTheme = {
    colors: {
      background: "#ffffff",
    },
  };

  const mergedTheme = {
    colors: {...defaultTheme.colors, ...theme.colors},
  };

  return (
    <div
      className="single-column-layout"
      style={{
        maxWidth,
        margin: "0 auto",
        padding,
        backgroundColor: backgroundColor || mergedTheme.colors.background,
        minHeight: "100vh",
      }}
    >
      {/* Content wrapper */}
      <div className="w-full">{children}</div>

      {/* Print optimization */}
      <style>{`
        @media print {
          .single-column-layout {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SingleColumn;
