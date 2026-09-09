import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Compass } from "lucide-react";

/**
 * KineticPersistentTravelingObject
 * Persistent 3D kinetic object that travels down the page with the user.
 * - Front side: Vibrant, full-color image showcase.
 * - Minimal back side: Clean, pure typography seal (no icons, no fields).
 * - On scroll: Flips in 3D but completes full rotations back to the colorful front side.
 * - In Hero: Fits above the name typography.
 * - In Contact: Docks pixel-perfect right inside the landing slot above "LET'S BUILD".
 */
export default function KineticPersistentTravelingObject({
  name = "",
  role = "",
  profileImage = "",
}) {
  const [manualFlip, setManualFlip] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Global scroll progress across the whole page [0 -> 1]
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.0005,
  });

  // 1. ROTATION:
  // Starts at 0° (Front Colorful Image) in Hero stage.
  // Flips smoothly through 180° mid-transition, then completes 360° revolution back to Front in Work.
  // Continues another smooth 360° turn through Trajectory/About, landing at 720° (Front Colorful Image) in Contact.
  const baseRotateY = useTransform(
    smoothProgress,
    [0, 0.15, 0.35, 0.65, 0.88, 1],
    [0, 180, 360, 540, 720, 720]
  );
  const rotateY = useTransform(baseRotateY, (val) => val + (manualFlip ? 180 : 0));

  const rotateX = useTransform(
    smoothProgress,
    [0, 0.12, 0.35, 0.65, 0.88, 1],
    [0, 6, -3, 5, -2, 0]
  );

  const rotateZ = useTransform(
    smoothProgress,
    [0, 0.15, 0.35, 0.65, 0.88, 1],
    [0, -2, 1.5, -2, 1, 0]
  );

  // 2. SCALE:
  // Hero: 1.02 in center stage
  // Mid sections (Work, Trajectory, About): 0.68 compact spatial companion
  // Contact: 0.80 (docks with generous clearance above LET'S BUILD)
  const scale = useTransform(
    smoothProgress,
    [0, 0.10, 0.22, 0.80, 0.92, 1],
    isDesktop
      ? [1.02, 1.05, 0.68, 0.68, 0.84, 0.80]
      : [0.92, 0.92, 0.52, 0.52, 0.78, 0.74]
  );

  // 3. HORIZONTAL TRAJECTORY (X Position)
  // Hero (0.0): Centered in Tri-Column Stage (0vw)
  // Work, Trajectory & About (0.24 - 0.80): Glides to side rail (36vw)
  // Contact (0.92 - 1.0): Returns to center (0vw) to dock directly above "LET'S BUILD."
  const xPos = useTransform(
    smoothProgress,
    [0, 0.12, 0.24, 0.80, 0.92, 1],
    isDesktop
      ? ["0vw", "16vw", "36vw", "36vw", "0vw", "0vw"]
      : isTablet
      ? ["0vw", "14vw", "32vw", "32vw", "0vw", "0vw"]
      : ["0vw", "0vw", "26vw", "26vw", "0vw", "0vw"]
  );

  // 4. VERTICAL TRAJECTORY (Y Position)
  // Hero (0.0): 0vh (centered in the Hero between Left Name and Right Description)
  // Middle sections (0.24 - 0.80): 0vh (floats comfortably on side rail)
  // Contact (0.92 - 1.0): -21vh (docked with ample space above LET'S text)
  const yPos = useTransform(
    smoothProgress,
    [0, 0.12, 0.24, 0.80, 0.92, 1],
    isDesktop
      ? ["0vh", "0vh", "0vh", "0vh", "-12vh", "-21vh"]
      : isTablet
      ? ["0vh", "0vh", "0vh", "0vh", "-11vh", "-19vh"]
      : ["0vh", "4vh", "18vh", "18vh", "-10vh", "-18vh"]
  );

  // Active section indicator badge
  const sectionLabel = useTransform(smoothProgress, (p) => {
    if (p < 0.15) return "00 // STAGE";
    if (p < 0.48) return "01 // WORK";
    if (p < 0.72) return "02 // TRAJECTORY";
    if (p < 0.88) return "03 // ABOUT";
    return "04 // CONVERGE";
  });

  const defaultVisual =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center overflow-visible"
      aria-hidden="false"
      style={{ willChange: "transform" }}
    >
      <div className="perspective-container relative">
        <motion.div
          style={{
            x: xPos,
            y: yPos,
            rotateY,
            rotateX,
            rotateZ,
            scale,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setManualFlip((prev) => !prev);
          }}
          whileHover={{ scale: (scale.get() || 1) * 1.04 }}
          className="pointer-events-auto preserve-3d relative cursor-pointer group select-none transition-shadow"
          role="button"
          tabIndex={0}
          title="Click to flip 3D Kinetic Object"
        >
          {/* Card Shell: Refined Proportions */}
          <div className="relative h-[260px] w-[190px] sm:h-[290px] sm:w-[215px] md:h-[310px] md:w-[230px] preserve-3d">
            
            {/* FRONT FACE: Vibrant, Full-Color Image Showcase (Clean & Minimal) */}
            <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-surface)] p-2 shadow-2xl transition-all duration-300 group-hover:border-[var(--kn-accent)] group-hover:shadow-[var(--kn-accent-glow)]">
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/5">
                <img
                  src={profileImage || defaultVisual}
                  alt={name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                
                {/* Subtle surface lighting sheen */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-30" />
              </div>
            </div>

            {/* BACK FACE: Minimal Clean Seal */}
            <div className="card-back-face backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-[var(--kn-border-strong)] bg-[var(--kn-bg-surface-elevated)] p-6 shadow-2xl text-center space-y-2">
              <span className="kn-mono text-sm font-bold tracking-[0.25em] text-[var(--kn-text-primary)] uppercase">
                {name}
              </span>
              <span className="h-px w-8 bg-[var(--kn-accent)]" />
              <span className="kn-meta-tag text-[9px] text-[var(--kn-text-muted)] tracking-widest uppercase">
                {role || "PORTFOLIO"}
              </span>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
