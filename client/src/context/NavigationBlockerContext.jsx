import {createContext, useContext, useState, useCallback} from "react";

const NavigationBlockerContext = createContext(null);

export const NavigationBlockerProvider = ({children}) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [onNavigateCallback, setOnNavigateCallback] = useState(null);

  const blockNavigation = useCallback((callback) => {
    setIsBlocked(true);
    setOnNavigateCallback(() => callback);
  }, []);

  const unblockNavigation = useCallback(() => {
    setIsBlocked(false);
    setOnNavigateCallback(null);
  }, []);

  const attemptNavigation = useCallback(
    (to) => {
      if (isBlocked && onNavigateCallback) {
        return onNavigateCallback(to);
      }
      return true; // Allow navigation
    },
    [isBlocked, onNavigateCallback]
  );

  return (
    <NavigationBlockerContext.Provider
      value={{
        isBlocked,
        blockNavigation,
        unblockNavigation,
        attemptNavigation,
      }}
    >
      {children}
    </NavigationBlockerContext.Provider>
  );
};

export const useNavigationBlocker = () => {
  const context = useContext(NavigationBlockerContext);
  if (!context) {
    throw new Error(
      "useNavigationBlocker must be used within NavigationBlockerProvider"
    );
  }
  return context;
};
