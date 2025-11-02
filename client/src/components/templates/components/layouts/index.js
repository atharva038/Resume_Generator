/**
 * Layout Components Index
 * Export all layout wrapper components
 */

import SingleColumn from "./SingleColumn";
import TwoColumn from "./TwoColumn";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

export {SingleColumn, TwoColumn, SidebarLeft, SidebarRight};

// Layout registry for dynamic selection
export const layouts = {
  singleColumn: SingleColumn,
  twoColumn: TwoColumn,
  sidebarLeft: SidebarLeft,
  sidebarRight: SidebarRight,
};

// Get layout component by name
export const getLayout = (layoutName) => {
  return layouts[layoutName] || layouts.singleColumn;
};

// Available layouts with metadata
export const availableLayouts = [
  {
    id: "singleColumn",
    name: "Single Column",
    description: "Full-width single column layout",
    bestFor: "Professional, ATS-friendly, Traditional",
    features: [
      "Simple structure",
      "Maximum readability",
      "ATS-optimized",
      "Print-friendly",
    ],
    columns: 1,
  },
  {
    id: "twoColumn",
    name: "Two Column",
    description: "Flexible two-column layout with sidebar",
    bestFor: "Modern, Balanced, Versatile",
    features: [
      "Sidebar support",
      "Configurable widths",
      "Left/right positioning",
      "Responsive",
    ],
    columns: 2,
  },
  {
    id: "sidebarLeft",
    name: "Sidebar Left",
    description: "Left sidebar with main content",
    bestFor: "Creative, Portfolio, Modern",
    features: [
      "Colored sidebar",
      "Photo-friendly",
      "Eye-catching",
      "Modern design",
    ],
    columns: 2,
  },
  {
    id: "sidebarRight",
    name: "Sidebar Right",
    description: "Main content with right sidebar",
    bestFor: "Tech, Professional, Clean",
    features: [
      "Focus on content",
      "Skills sidebar",
      "Professional look",
      "Scannable",
    ],
    columns: 2,
  },
];

export default {
  SingleColumn,
  TwoColumn,
  SidebarLeft,
  SidebarRight,
  layouts,
  getLayout,
  availableLayouts,
};
