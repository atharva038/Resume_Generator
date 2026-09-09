import { useRef, useEffect } from "react";

/**
 * KineticFluidShader
 * High-performance generative fluid light & organic wave distortion canvas.
 * Reacts subtly to cursor coordinates, scroll velocity, and theme mode.
 */
export default function KineticFluidShader({
  isDark = false,
  accentColor = "#2563eb",
  className = "",
}) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);
  const isVisible = useRef(true);
  const mousePos = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const scrollData = useRef({ y: 0, lastY: 0, speed: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || 600;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (rect.width || 1);
      const y = (e.clientY - rect.top) / (rect.height || 1);
      mousePos.current.targetX = Math.max(0, Math.min(1, x));
      mousePos.current.targetY = Math.max(0, Math.min(1, y));
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = Math.abs(currentY - scrollData.current.lastY);
      scrollData.current.speed = Math.min(diff * 0.05, 2.0);
      scrollData.current.lastY = currentY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Pause canvas when scrolled outside viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let time = 0;

    const render = () => {
      if (isVisible.current) {
        time += 0.008 + scrollData.current.speed * 0.004;
        scrollData.current.speed *= 0.92; // decay scroll velocity

        // Smooth mouse interpolation
        mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
        mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

        ctx.clearRect(0, 0, width, height);

        // Palette setup
        const isDarkMode = isDark;
        const waveColor1 = isDarkMode
          ? "rgba(56, 189, 248, 0.04)"
          : "rgba(37, 99, 235, 0.035)";
        const waveColor2 = isDarkMode
          ? "rgba(99, 102, 241, 0.03)"
          : "rgba(79, 70, 229, 0.025)";
        const waveColor3 = isDarkMode
          ? "rgba(14, 165, 233, 0.025)"
          : "rgba(14, 116, 144, 0.02)";

        // Draw soft ambient generative wave flows
        const drawFluidWave = (color, freqX, freqY, amp, speedOffset, yOffsetRatio) => {
          ctx.beginPath();
          const baseCenterY = height * yOffsetRatio;
          const mx = mousePos.current.x;
          const my = mousePos.current.y;

          ctx.moveTo(0, height);
          ctx.lineTo(0, baseCenterY);

          const step = Math.max(16, width / 40);
          for (let x = 0; x <= width + step; x += step) {
            const nx = x / width;
            const distToMouse = Math.abs(nx - mx);
            const mouseInfluence = Math.exp(-distToMouse * 3.5) * (my - 0.5) * 60;

            const wave =
              Math.sin(nx * freqX + time * speedOffset) * amp +
              Math.cos(nx * freqY - time * (speedOffset * 0.7)) * (amp * 0.5) +
              mouseInfluence;

            ctx.lineTo(x, baseCenterY + wave);
          }

          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        };

        drawFluidWave(waveColor1, 4.2, 2.1, 45, 1.2, 0.35);
        drawFluidWave(waveColor2, 5.5, 3.4, 55, 0.9, 0.55);
        drawFluidWave(waveColor3, 3.1, 4.8, 40, 1.4, 0.75);

        // Subtle atmospheric light beam focus
        const grad = ctx.createRadialGradient(
          width * mousePos.current.x,
          height * mousePos.current.y,
          20,
          width * mousePos.current.x,
          height * mousePos.current.y,
          width * 0.45
        );
        grad.addColorStop(
          0,
          isDarkMode ? "rgba(56, 189, 248, 0.06)" : "rgba(37, 99, 235, 0.05)"
        );
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [isDark, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-90 transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    />
  );
}
