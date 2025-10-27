import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

const PageTransition = ({children}) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Start exit animation
      setIsTransitioning(true);

      // After exit animation, update the location
      const exitTimeout = setTimeout(() => {
        setDisplayLocation(location);
        // Reset for enter animation
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 200);

      return () => clearTimeout(exitTimeout);
    }
  }, [location, displayLocation]);

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
