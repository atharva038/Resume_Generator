/**
 * Responsive Utilities
 * Hooks and helpers for responsive design in templates
 */

import {useState, useEffect} from "react";

/**
 * Breakpoints (matches Tailwind CSS defaults)
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * useMediaQuery Hook
 * Usage: const isMobile = useMediaQuery('(max-width: 640px)');
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

/**
 * useBreakpoint Hook
 * Returns current breakpoint name
 * Usage: const breakpoint = useBreakpoint();
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("xl");

  useEffect(() => {
    const getBreakpoint = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) return "xs";
      if (width < breakpoints.md) return "sm";
      if (width < breakpoints.lg) return "md";
      if (width < breakpoints.xl) return "lg";
      if (width < breakpoints["2xl"]) return "xl";
      return "2xl";
    };

    setBreakpoint(getBreakpoint());

    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};

/**
 * useIsMobile Hook
 * Returns true if viewport is mobile size
 */
export const useIsMobile = () => {
  return useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
};

/**
 * useIsTablet Hook
 * Returns true if viewport is tablet size
 */
export const useIsTablet = () => {
  const isSmall = useMediaQuery(`(min-width: ${breakpoints.md}px)`);
  const isLarge = useMediaQuery(`(max-width: ${breakpoints.lg - 1}px)`);
  return isSmall && isLarge;
};

/**
 * useIsDesktop Hook
 * Returns true if viewport is desktop size
 */
export const useIsDesktop = () => {
  return useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
};

/**
 * Responsive class helper
 * Returns different classes based on screen size
 */
export const responsiveClasses = (mobile, tablet, desktop) => {
  return {
    mobile: mobile || "",
    tablet: tablet || mobile || "",
    desktop: desktop || tablet || mobile || "",
  };
};

/**
 * Get responsive value
 * Returns different values based on current breakpoint
 */
export const getResponsiveValue = (values, breakpoint) => {
  const order = ["xs", "sm", "md", "lg", "xl", "2xl"];
  const currentIndex = order.indexOf(breakpoint);

  // Find the closest value for current breakpoint or lower
  for (let i = currentIndex; i >= 0; i--) {
    const key = order[i];
    if (values[key] !== undefined) {
      return values[key];
    }
  }

  // If no value found, return the first available
  return Object.values(values)[0];
};

/**
 * Check if device is touch-enabled
 */
export const isTouchDevice = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Get print-friendly styles
 */
export const getPrintStyles = () => ({
  "@media print": {
    padding: 0,
    margin: 0,
    backgroundColor: "#ffffff",
    color: "#000000",
    boxShadow: "none",
    border: "none",
  },
});

export default {
  breakpoints,
  useMediaQuery,
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  responsiveClasses,
  getResponsiveValue,
  isTouchDevice,
  getPrintStyles,
};
