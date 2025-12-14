import {useEffect} from "react";

/**
 * Custom hook for detecting clicks outside a referenced element
 * @param {React.RefObject} ref - The ref of the element to detect clicks outside of
 * @param {Function} handler - The callback function to execute on outside click
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
