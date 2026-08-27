import { useEffect } from "react";

let activeLocks = 0;
let originalOverflow = "";

export default function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLocks === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    activeLocks += 1;

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks === 0) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [isLocked]);
}
