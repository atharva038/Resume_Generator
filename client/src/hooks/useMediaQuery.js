import {useState, useEffect} from "react";

/**
 * Custom hook for tracking media query matches
 * Returns a boolean indicating whether the media query currently matches
 *
 * @param {string} query - The media query string (e.g., "(min-width: 768px)")
 * @returns {boolean} Whether the media query currently matches
 *
 * @example
 * // Responsive layout based on screen size
 * function ResponsiveLayout() {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 *   const isDesktop = useMediaQuery('(min-width: 1025px)');
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isTablet && <TabletView />}
 *       {isDesktop && <DesktopView />}
 *     </div>
 *   );
 * }
 *
 * @example
 * // Dark mode detection
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Update state when media query changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};
