import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useToggle} from "@/hooks";

const PageTransition = ({children}) => {
  const location = useLocation();
  const [
    isTransitioning,
    toggleTransitioning,
    setIsTransitioningTrue,
    setIsTransitioningFalse,
  ] = useToggle(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Start exit animation
      setIsTransitioningTrue();

      // After exit animation, update the location
      const exitTimeout = setTimeout(() => {
        setDisplayLocation(location);
        // Reset for enter animation
        setTimeout(() => {
          setIsTransitioningFalse();
        }, 50);
      }, 200);

      return () => clearTimeout(exitTimeout);
    }
  }, [
    location,
    displayLocation,
    setIsTransitioningTrue,
    setIsTransitioningFalse,
  ]);

  return (
    <div
      className={`page-transition ${
        isTransitioning ? "page-transition-exit" : "page-transition-enter"
      }`}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
