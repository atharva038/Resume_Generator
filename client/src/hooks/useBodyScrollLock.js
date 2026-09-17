import { useEffect } from "react";

let activeLocks = 0;
let originalBodyOverflow = "";
let originalHtmlOverflow = "";
let originalBodyPaddingRight = "";

/**
 * Custom hook to lock background/body and root HTML scrolling when modals or previews are open.
 * Handles scrollbar layout shift, overscroll bounce, and multi-modal nesting safely.
 *
 * @param {boolean} isLocked - Whether scrolling should be locked
 */
export default function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLocks === 0) {
      // Calculate scrollbar width to prevent page jitter/layout shift
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      originalBodyOverflow = document.body.style.overflow;
      originalHtmlOverflow = document.documentElement.style.overflow;
      originalBodyPaddingRight = document.body.style.paddingRight;

      // Lock both HTML and BODY to ensure no background scrolling on desktop or mobile
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.overscrollBehavior = "none";
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";

      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }
    activeLocks += 1;

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks === 0) {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.style.overscrollBehavior = "";
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.overscrollBehavior = "";
        document.body.style.paddingRight = originalBodyPaddingRight;
      }
    };
  }, [isLocked]);
}
