/**
 * Minimal Theme - Modern Startups, Tech Companies
 * Best for: Minimalist design, Modern tech roles
 */
export const minimalTheme = {
  name: "Minimal",
  colors: {
    primary: "#000000", // Black
    secondary: "#6b7280", // Gray
    accent: "#3b82f6", // Blue accent
    text: "#1f2937",
    textLight: "#9ca3af",
    background: "#ffffff",
    backgroundAlt: "#f9fafb",
    border: "#e5e7eb",
    success: "#10b981",
    warning: "#f59e0b",
  },
  fonts: {
    heading: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    body: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    sizes: {
      name: "26pt",
      title: "13pt",
      heading: "11pt",
      subheading: "10pt",
      body: "10pt",
      small: "9pt",
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    section: "18px",
    element: "8px",
    tight: "4px",
    loose: "24px",
  },
  borders: {
    radius: {
      none: "0",
      sm: "0",
      md: "0",
      lg: "0",
    },
    width: {
      thin: "1px",
      medium: "1px",
      thick: "2px",
    },
  },
  layout: {
    maxWidth: "800px",
    padding: "40px",
    columnGap: "30px",
  },
};

export default minimalTheme;
