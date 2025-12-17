import {useState, useRef, useEffect} from "react";
import {useToggle, useMediaQuery} from "@/hooks";

const FullPreviewModal = ({isOpen, onClose, children}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [isDragging, toggleDragging, setIsDraggingTrue, setIsDraggingFalse] =
    useToggle(false);
  const [dragStart, setDragStart] = useState({x: 0, y: 0});
  const isMobile = useMediaQuery("(max-width: 1023px)"); // lg breakpoint
  const [isPinching, togglePinching, setIsPinchingTrue, setIsPinchingFalse] =
    useToggle(false);
  const containerRef = useRef(null);
  const lastTouchDistance = useRef(null);
  const rafRef = useRef(null); // For requestAnimationFrame

  // Check if content is zoomed beyond initial scale
  const isZoomed = isMobile ? scale > 0.45 : scale > 1;

  // Reset zoom and position when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Set initial scale based on device type
      // Mobile: fit to screen width (~0.45), Desktop: full size (1)
      const initialScale = isMobile ? 0.45 : 1;
      setScale(initialScale);
      setPosition({x: 0, y: 0});
    }
  }, [isOpen, isMobile]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Add wheel event listener with passive: false for mobile zoom
  useEffect(() => {
    if (!isOpen || !isMobile || !containerRef.current) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)));
    };

    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, {passive: false});

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen, isMobile]);

  // Add touch event listeners with passive: false for smooth zoom/drag
  useEffect(() => {
    if (!isOpen || !isMobile || !containerRef.current) return;

    const container = containerRef.current;

    const handleTouchStartDom = (e) => {
      if (e.touches.length === 2) {
        // Two fingers - pinch to zoom
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastTouchDistance.current = distance;
        setIsPinchingTrue();
      } else if (e.touches.length === 1 && isZoomed) {
        // One finger and zoomed - enable dragging
        setIsDraggingTrue();
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }
    };

    const handleTouchMoveDom = (e) => {
      // Only prevent default for zoom/drag gestures
      if (e.touches.length === 2 || (isDragging && isZoomed)) {
        e.preventDefault();
      }

      if (e.touches.length === 2 && lastTouchDistance.current) {
        // Pinch-to-zoom with 2 fingers
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = (distance - lastTouchDistance.current) * 0.015;

        // Use RAF for smoother updates
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setScale((prev) => Math.max(0.45, Math.min(2, prev + delta)));
        });

        lastTouchDistance.current = distance;
      } else if (e.touches.length === 1 && isDragging && isZoomed) {
        // Drag with 1 finger when zoomed
        const newX = e.touches[0].clientX - dragStart.x;
        const newY = e.touches[0].clientY - dragStart.y;

        // Use RAF for 60fps smooth dragging
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          setPosition({x: newX, y: newY});
        });
      }
    };

    const handleTouchEndDom = () => {
      setIsDraggingFalse();
      setIsPinchingFalse();
      lastTouchDistance.current = null;

      // Clean up any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    // Add event listeners with passive: false
    container.addEventListener("touchstart", handleTouchStartDom, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMoveDom, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEndDom, {passive: false});

    return () => {
      container.removeEventListener("touchstart", handleTouchStartDom);
      container.removeEventListener("touchmove", handleTouchMoveDom);
      container.removeEventListener("touchend", handleTouchEndDom);
    };
  }, [isOpen, isMobile, isZoomed, isDragging, position, dragStart]);

  // Reset position when zoom returns to initial scale
  useEffect(() => {
    if (!isZoomed) {
      setPosition({x: 0, y: 0});
    }
  }, [isZoomed]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  // Handle backdrop click (tap outside to close)
  const handleBackdropClick = (e) => {
    // Only close if clicking directly on backdrop, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[10000] w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-2xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center group border-2 border-gray-200 dark:border-gray-600 hover:scale-110"
        aria-label="Close preview"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Preview Container */}
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden flex items-center justify-center p-4 ${
          isZoomed ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={{
          touchAction: isMobile && isZoomed ? "none" : "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`${
            isMobile
              ? "transition-none"
              : "transition-transform duration-200 ease-out"
          }`}
          style={{
            transform: isMobile
              ? `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`
              : "none",
            transformOrigin: "center center",
            willChange:
              isMobile && (isDragging || isPinching) ? "transform" : "auto",
            backfaceVisibility: "hidden", // Prevent flickering
            WebkitBackfaceVisibility: "hidden", // Safari
            perspective: 1000, // Enable 3D rendering
            WebkitPerspective: 1000, // Safari
          }}
        >
          {children}
        </div>
      </div>

      {/* Instructions - Mobile Only */}
      {isMobile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl border-2 border-gray-200 dark:border-gray-600 pointer-events-none">
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
            {isZoomed
              ? "🤏 Pinch to zoom • 👆 Drag to pan • Tap outside to close"
              : "🤏 Pinch to zoom • Tap outside to close"}
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FullPreviewModal;
