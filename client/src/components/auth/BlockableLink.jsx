import {Link, useNavigate} from "react-router-dom";
import {useNavigationBlocker} from "@/context/NavigationBlockerContext";

/**
 * BlockableLink - A Link component that respects navigation blocking
 * Use this instead of regular Link when navigation might need to be blocked
 */
const BlockableLink = ({to, children, onClick, ...props}) => {
  const navigate = useNavigate();
  const {attemptNavigation} = useNavigationBlocker();

  const handleClick = (e) => {
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Only handle internal navigation (not hash links)
    if (to && !to.startsWith("#") && !to.startsWith("/#")) {
      e.preventDefault();

      // Check if navigation is blocked
      const canNavigate = attemptNavigation(to);

      if (canNavigate) {
        navigate(to);
      }
      // If blocked, the navigation blocker will handle showing the modal
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default BlockableLink;
