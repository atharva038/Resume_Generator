import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Globe,
  Mic,
  Database,
  Cpu,
  Zap,
} from "lucide-react";

// Interactive Wavy Fluid Shader Canvas
const WavyShaderCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    let t = 0;
    const waveCount = 5;

    const render = () => {
      t += 0.007;
      ctx.clearRect(0, 0, width, height);

      // Radial ambient center glow
      const cx = width / 2;
      const cy = height / 2;
      const radGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(width, height) * 0.7);
      radGrad.addColorStop(0, "rgba(6, 182, 212, 0.14)");
      radGrad.addColorStop(0.35, "rgba(59, 130, 246, 0.08)");
      radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      // Flowing undulating wave lines
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        const baseAlpha = 0.12 + (i / waveCount) * 0.22;
        const colorGrad = ctx.createLinearGradient(0, 0, width, 0);
        colorGrad.addColorStop(0, "rgba(59, 130, 246, 0)");
        colorGrad.addColorStop(0.3, `rgba(6, 182, 212, ${baseAlpha})`);
        colorGrad.addColorStop(0.7, `rgba(99, 102, 241, ${baseAlpha})`);
        colorGrad.addColorStop(1, "rgba(59, 130, 246, 0)");

        ctx.strokeStyle = colorGrad;
        ctx.lineWidth = 1.2 + (i % 2) * 0.6;

        const yOffset = cy + (i - waveCount / 2) * 42;
        const freq = 0.0022 + i * 0.0005;
        const amp = 35 + i * 16;

        for (let x = 0; x <= width; x += 6) {
          const y = yOffset + Math.sin(x * freq + t * (1.1 + i * 0.25)) * amp + Math.cos(x * 0.0012 - t * 0.7) * 18;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// Organic 3D Neural Particle Core Canvas
const NeuralSynapseCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const size = 260;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 85;

    // Generate 3D spherical particle cloud
    const nodeCount = 55;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      nodes.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        baseX: radius * Math.cos(theta) * Math.sin(phi),
        baseY: radius * Math.sin(theta) * Math.sin(phi),
        baseZ: radius * Math.cos(phi),
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let rotX = 0;
    let rotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      rotX += 0.007;
      rotY += 0.009;

      // Rotate nodes in 3D
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const projected = nodes.map((node) => {
        // Y-axis rotation
        let x1 = node.baseX * cosY - node.baseZ * sinY;
        let z1 = node.baseZ * cosY + node.baseX * sinY;
        // X-axis rotation
        let y1 = node.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.baseY * sinX;

        const scale = 220 / (220 + z2);
        const px = cx + x1 * scale;
        const py = cy + y1 * scale;
        const alpha = Math.max(0.1, (z2 + radius) / (2 * radius));

        return { px, py, scale, alpha, z: z2 };
      });

      // Draw Synaptic Connection Lines
      ctx.lineWidth = 0.75;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 38) {
            const lineAlpha = (1 - dist / 38) * projected[i].alpha * 0.45;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.strokeStyle = `rgba(34, 211, 238, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw Neural Nodes / Energy Particles
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(1, 2.2 * p.scale), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${Math.min(1, p.alpha * 1.2)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="w-[260px] h-[260px] pointer-events-none" />;
};

export const HolographicCareerHub = () => {
  return (
    <div className="relative w-full py-8 lg:py-12 overflow-hidden">
      {/* Background Wavy Ambient Fluid Shader */}
      <WavyShaderCanvas />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[580px] lg:min-h-[520px] flex items-center justify-center">
          
          {/* Holographic Glowing SVG Laser Beams */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block overflow-visible opacity-80">
            <defs>
              <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.85" />
              </linearGradient>
              <filter id="neonLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Laser Conduits with Smooth Animated Dash Flow */}
            <path
              d="M 330 130 L 460 210 L 530 260"
              stroke="url(#laserBeamGrad)"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
              filter="url(#neonLaserGlow)"
              className="animate-[dash_15s_linear_infinite]"
            />
            <path
              d="M 810 130 L 680 210 L 610 260"
              stroke="url(#laserBeamGrad)"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
              filter="url(#neonLaserGlow)"
              className="animate-[dash_15s_linear_infinite]"
            />
            <path
              d="M 330 390 L 460 310 L 530 260"
              stroke="url(#laserBeamGrad)"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
              filter="url(#neonLaserGlow)"
              className="animate-[dash_15s_linear_infinite]"
            />
            <path
              d="M 810 390 L 680 310 L 610 260"
              stroke="url(#laserBeamGrad)"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
              filter="url(#neonLaserGlow)"
              className="animate-[dash_15s_linear_infinite]"
            />
          </svg>

          {/* 4 Satellite Floating Glass Cards */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-y-20 gap-x-28 lg:gap-x-44 relative z-10">
            
            {/* SATELLITE 1: Vector ATS Resume Optimizer */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-zinc-950/85 dark:bg-black/85 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] backdrop-blur-2xl group hover:border-cyan-400 transition-all text-left space-y-3.5"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/15 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  1. Vector ATS Resume Optimizer
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 text-[10px] font-black tracking-tight">
                  98% ATS MATCH
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                    Optimize Resume
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Workday, Greenhouse & Lever Scanner Ready
                  </p>
                </div>
              </div>

              <Link
                to="/ats-analyzer"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Analyze Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* SATELLITE 2: Live Hosted Web Portfolio */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-zinc-950/85 dark:bg-black/85 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.12)] backdrop-blur-2xl group hover:border-blue-400 transition-all text-left space-y-3.5"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/15 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider text-blue-400 uppercase">
                  2. Live Hosted Web Portfolio
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/40 text-[10px] font-mono font-bold">
                  yourname.com custom domain
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-base font-black text-white group-hover:text-blue-300 transition-colors">
                    Build Portfolio
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Deploy reactive personal website in 1 click
                  </p>
                </div>
              </div>

              <Link
                to="/portfolio"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Publish Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* SATELLITE 3: Real-Time AI Mock Interview */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-zinc-950/85 dark:bg-black/85 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.12)] backdrop-blur-2xl group hover:border-indigo-400 transition-all text-left space-y-3.5"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/15 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider text-indigo-400 uppercase">
                  3. Real-Time AI Mock Interview
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 text-[10px] font-black tracking-tight">
                  TECHNICAL SCORE: 86%
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                    Practice Interview
                  </h4>
                  {/* Waveform Equalizer */}
                  <div className="flex items-center gap-1 h-3 pt-0.5">
                    {[6, 14, 8, 20, 12, 18, 5, 15, 22, 10, 16, 7].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={{ height: [`${h}px`, `${24 - h}px`, `${h}px`] }}
                        transition={{ repeat: Infinity, duration: 0.7 + i * 0.08, ease: "easeInOut" }}
                        className="w-1 bg-cyan-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Link
                to="/career-qa"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Practice Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* SATELLITE 4: 1-Click Master Profile */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-zinc-950/85 dark:bg-black/85 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] backdrop-blur-2xl group hover:border-cyan-400 transition-all text-left space-y-3.5"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/15 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                  4. 1-Click Master Profile
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 text-[10px] font-black tracking-tight">
                  CAREER HUB
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Database className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                    Manage Master Profile
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Sync experience across resumes & portfolios
                  </p>
                </div>
              </div>

              <Link
                to="/career-profile"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Sync Career Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Central Authentic 3D Neural Synapse Core */}
          <div className="my-8 lg:my-0 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-30 flex items-center justify-center pointer-events-none">
            <div className="relative w-[260px] h-[260px] flex items-center justify-center">
              
              {/* Radial Cyan Particle Aura */}
              <div className="absolute inset-4 rounded-full bg-radial from-cyan-500/30 via-blue-600/15 to-transparent blur-2xl animate-pulse" />

              {/* 3D Organic Neural Synapse Particle Cloud */}
              <div className="absolute inset-0 flex items-center justify-center">
                <NeuralSynapseCanvas />
              </div>

              {/* Central Dark Obsidian Iris Core */}
              <motion.div
                animate={{
                  scale: [0.97, 1.03, 0.97],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative z-10 w-24 h-24 rounded-full bg-black/85 border border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.6)] backdrop-blur-2xl flex flex-col items-center justify-center text-center p-2"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping mb-1" />
                <span className="text-[11px] font-black tracking-widest text-white uppercase drop-shadow-sm">
                  AI
                </span>
                <span className="text-[7.5px] font-mono font-bold tracking-tight text-cyan-300">
                  NEURAL CORE
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Telemetry Metric Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-10 sm:pt-12 relative z-10 text-xs">
          <div className="px-4 py-2 rounded-xl bg-zinc-950/85 dark:bg-black/85 border border-emerald-500/30 shadow-lg shadow-emerald-500/5 flex items-center gap-2 font-bold backdrop-blur-md">
            <span className="text-emerald-400 font-black text-sm">+38%</span>
            <span className="text-zinc-300">Interview Callbacks</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-zinc-950/85 dark:bg-black/85 border border-cyan-500/30 shadow-lg shadow-cyan-500/5 flex items-center gap-2 font-bold backdrop-blur-md">
            <span className="text-cyan-400 font-black text-sm">11+</span>
            <span className="text-zinc-300">ATS Templates</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-zinc-950/85 dark:bg-black/85 border border-blue-500/30 shadow-lg shadow-blue-500/5 flex items-center gap-2 font-bold backdrop-blur-md">
            <span className="text-blue-400 font-black text-sm">95%</span>
            <span className="text-zinc-300">User Success Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicCareerHub;
