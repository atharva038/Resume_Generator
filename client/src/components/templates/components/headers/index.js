/**
 * Header Components Index
 * Export all header component variants
 */

import HeaderModern from "./HeaderModern";
import HeaderClassic from "./HeaderClassic";
import HeaderMinimal from "./HeaderMinimal";
import HeaderSidebar from "./HeaderSidebar";
import HeaderCentered from "./HeaderCentered";

export {
  HeaderModern,
  HeaderClassic,
  HeaderMinimal,
  HeaderSidebar,
  HeaderCentered,
};

// Header registry for dynamic selection
export const headers = {
  modern: HeaderModern,
  classic: HeaderClassic,
  minimal: HeaderMinimal,
  sidebar: HeaderSidebar,
  centered: HeaderCentered,
};

// Get header component by name
export const getHeader = (headerName) => {
  return headers[headerName] || headers.modern;
};

// Available headers with metadata
export const availableHeaders = [
  {
    id: "modern",
    name: "Modern",
    description: "Gradient header with bold styling",
    bestFor: "Tech, Creative, Modern roles",
    features: ["Gradient background", "Large name", "Icon contact info"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered header",
    bestFor: "Corporate, Conservative roles",
    features: ["Centered text", "Decorative lines", "Bullet separators"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean single-line header",
    bestFor: "Modern startups, Minimalist design",
    features: ["Space efficient", "Single line", "Ultra clean"],
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Vertical sidebar with photo",
    bestFor: "Sidebar layouts, Creative roles",
    features: ["Photo/initials", "Vertical layout", "Full height"],
  },
  {
    id: "centered",
    name: "Centered",
    description: "Elegant centered with tagline",
    bestFor: "Executive, Professional services",
    features: ["Decorative dividers", "Optional tagline", "Elegant spacing"],
  },
];
