import { useState, useRef, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";
import { useMediaQuery } from "@/hooks";

const FullPreviewModal = ({
  isOpen,
  onClose,
  title = "Resume Full Preview",
  onDownload,
  children,
}) => {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // Initialize optimal scale on open
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined") {
        const winWidth = window.innerWidth;
        if (winWidth < 640) {
          setScale(0.48);
        } else if (winWidth < 1024) {
          setScale(0.72);
        } else if (winWidth < 1440) {
          setScale(0.9);
        } else {
          setScale(1.0);
        }
      }
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

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

  const handleZoomIn = () => {
    setScale((prev) => Math.min(1.5, Math.round((prev + 0.1) * 10) / 10));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.4, Math.round((prev - 0.1) * 10) / 10));
  };

  const handleResetZoom = () => {
    if (typeof window !== "undefined") {
      const winWidth = window.innerWidth;
      if (winWidth < 640) setScale(0.48);
      else if (winWidth < 1024) setScale(0.72);
      else if (winWidth < 1440) setScale(0.9);
      else setScale(1.0);
    } else {
      setScale(1.0);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === containerRef.current || e.target.id === "modal-scroll-wrapper") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      id="modal-scroll-wrapper"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md overflow-y-auto scrollbar-thin select-none animate-fadeIn"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Floating Glass Controls Header Bar */}
      <div className="sticky top-4 z-[10000] max-w-4xl mx-auto px-4 pointer-events-none flex items-center justify-between gap-3">
        {/* Left: Document Badge */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 text-zinc-200 border border-zinc-700/60 shadow-xl backdrop-blur-xl text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate max-w-[200px]">{title}</span>
        </div>

        {/* Center / Right: Zoom Controls + Action Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-900/95 text-white border border-zinc-700/60 shadow-2xl backdrop-blur-xl mx-auto sm:mx-0">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.4}
            className="p-2 rounded-full hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-zinc-300 hover:text-white"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2.5 py-1 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 rounded-md transition-colors tabular-nums min-w-[48px] text-center"
            title="Reset Zoom"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 1.5}
            className="p-2 rounded-full hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-zinc-300 hover:text-white"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>

          <div className="w-px h-5 bg-zinc-700/60 mx-1" />

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95"
              title="Download PDF"
            >
              <Download size={13} />
              <span className="hidden xs:inline">Download</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-500/20 hover:text-rose-400 text-zinc-300 transition-colors ml-1"
            title="Close (Esc)"
            aria-label="Close Preview"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Resume Sheet Container — Scrollable with top/bottom breathing room */}
      <div
        id="modal-scroll-wrapper"
        onClick={handleBackdropClick}
        className="w-full flex flex-col items-center justify-start pt-6 pb-20 px-2 sm:px-4"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div
          ref={contentRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            marginBottom: `${(scale - 1) * 600}px`, // Adjust vertical spacing when scaled up
          }}
          className="relative transition-shadow duration-300"
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FullPreviewModal;
