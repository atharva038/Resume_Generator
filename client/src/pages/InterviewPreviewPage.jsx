import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import {
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneOff,
  SkipForward,
  ChevronRight,
  ShieldCheck,
  Award,
  Loader2,
  User,
  Sun,
  Moon,
} from "lucide-react";

// Ultra-Detailed, Realistic & Animated SVG Portrait: Rachel (Senior Technical Interviewer)
const InterviewerGraphic = ({ isSpeaking, isThinking, isDark = false }) => (
  <div className="relative flex items-center justify-center">
    {/* Ambient Studio Lighting Glow */}
    <div
      className={`absolute -inset-5 rounded-full transition-all duration-700 blur-2xl ${
        isSpeaking
          ? isDark ? "bg-indigo-500/30 scale-110" : "bg-indigo-500/20 scale-110"
          : isThinking
            ? isDark ? "bg-amber-500/25 scale-100" : "bg-amber-500/15 scale-100"
            : isDark ? "bg-indigo-500/10 scale-90" : "bg-indigo-500/5 scale-90"
      }`}
    />

    {/* Concentric Pulse Wave Rings on Speaking */}
    {isSpeaking && (
      <>
        <div className="absolute -inset-3 rounded-full border-2 border-indigo-400/30 animate-ping" style={{ animationDuration: "2.5s" }} />
        <div className="absolute -inset-6 rounded-full border border-indigo-500/15 animate-ping" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }} />
      </>
    )}

    {/* Portrait Container */}
    <div className={`relative z-10 w-36 h-36 rounded-2xl p-1 ${isDark ? "bg-gradient-to-b from-indigo-400/40 via-white/10 to-transparent shadow-2xl border border-white/15" : "bg-gradient-to-b from-indigo-100 via-slate-50 to-white shadow-xl border border-slate-200/80"} transition-all duration-500 ${isSpeaking ? "scale-105" : ""}`}>
      <div className={`w-full h-full rounded-2xl ${isDark ? "bg-gradient-to-b from-[#141624] via-[#0E101A] to-[#080910]" : "bg-gradient-to-b from-[#EDF2F7] via-[#F8FAFC] to-[#FFFFFF]"} flex items-center justify-center overflow-hidden shadow-inner relative group`}>
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Embedded Human Animations: Gaze, Blink, Breathing & Cadenced Speech */}
            <style>{`
              @keyframes humanBlink {
                0%, 88%, 94%, 100% { transform: scaleY(1); }
                91% { transform: scaleY(0.08); }
              }
              @keyframes eyeGaze {
                0%, 100% { transform: translate(0px, 0px); }
                20% { transform: translate(-1px, 0.5px); }
                45% { transform: translate(0px, 0px); }
                65% { transform: translate(1.2px, -0.5px); }
                85% { transform: translate(0px, 0px); }
              }
              @keyframes conversationalSpeech {
                0%, 100% { transform: scale(1, 0.4); }
                20% { transform: scale(1.06, 1.35); }
                40% { transform: scale(0.95, 0.55); }
                60% { transform: scale(1.08, 1.45); }
                80% { transform: scale(0.98, 0.7); }
              }
              @keyframes studioMicGlow {
                0%, 100% { r: 3.5; opacity: 0.85; filter: drop-shadow(0 0 3px #818CF8); }
                50% { r: 4.8; opacity: 1; filter: drop-shadow(0 0 8px #6366F1); }
              }
              @keyframes subtleInhale {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-1.2px); }
              }
              .rachel-blink {
                transform-origin: 100px 65px;
                animation: humanBlink 5.5s infinite ease-in-out;
              }
              .pupil-gaze {
                animation: eyeGaze 7s infinite ease-in-out;
              }
              .cadenced-mouth {
                transform-origin: 100px 93px;
                animation: conversationalSpeech 0.42s infinite ease-in-out;
              }
              .mic-live-pulse {
                animation: studioMicGlow 1.4s infinite ease-in-out;
              }
              .breathing-body {
                animation: subtleInhale 5.5s infinite ease-in-out;
              }
            `}</style>

            {/* Rich Natural Skin Tone Gradients */}
            <linearGradient id="rachelSkinGrad" x1="100" y1="35" x2="100" y2="125" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FEE6D6" />
              <stop offset="45%" stopColor="#F8CFAF" />
              <stop offset="100%" stopColor="#E5A682" />
            </linearGradient>
            <linearGradient id="rachelJawShadowGrad" x1="100" y1="75" x2="100" y2="118" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D98A62" stopOpacity="0" />
              <stop offset="100%" stopColor="#B35F35" stopOpacity="0.55" />
            </linearGradient>
            <radialGradient id="rachelCheekGlowGrad" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
            </radialGradient>

            {/* Sleek, Tailored Brunette Hair System */}
            <linearGradient id="rachelHairSleek" x1="50" y1="18" x2="150" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#321D12" />
              <stop offset="40%" stopColor="#201108" />
              <stop offset="100%" stopColor="#0F0804" />
            </linearGradient>
            <linearGradient id="rachelHairShine" x1="70" y1="20" x2="130" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5E3823" />
              <stop offset="50%" stopColor="#3E2214" />
              <stop offset="100%" stopColor="#201108" stopOpacity="0" />
            </linearGradient>

            {/* Hazel Eye Depth */}
            <radialGradient id="rachelHazelIris" cx="0.4" cy="0.4" r="0.6">
              <stop offset="0%" stopColor="#A16207" />
              <stop offset="50%" stopColor="#713F12" />
              <stop offset="90%" stopColor="#291505" />
            </radialGradient>

            {/* Executive Tailored Blazer */}
            <linearGradient id="rachelBlazerGrad" x1="40" y1="130" x2="160" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2B3252" />
              <stop offset="60%" stopColor="#1A1F36" />
              <stop offset="100%" stopColor="#0F1222" />
            </linearGradient>
            <linearGradient id="rachelLapelsGrad" x1="70" y1="140" x2="130" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3C4573" />
              <stop offset="100%" stopColor="#1E2340" />
            </linearGradient>
            <linearGradient id="rachelBlouseGrad" x1="100" y1="130" x2="100" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>

          {/* BACKGROUND AMBIENT DOME */}
          <circle cx="100" cy="100" r="92" fill={isDark ? "#0E101A" : "#EEF2F6"} />
          <circle cx="100" cy="85" r="72" fill={isDark ? "#181D33" : "#E2E8F0"} fillOpacity={isDark ? "0.4" : "0.6"} />

          {/* BREATHING AVATAR BODY */}
          <g className="breathing-body">
            
            {/* SLEEK PROFESSIONAL BACK HAIR (Clean bob silhouette) */}
            <path d="M52 64C48 88 50 118 54 144C62 150 72 154 82 154C66 132 62 100 64 74Z" fill="url(#rachelHairSleek)" />
            <path d="M148 64C152 88 150 118 146 144C138 150 128 154 118 154C134 132 138 100 136 74Z" fill="url(#rachelHairSleek)" />
            <path d="M52 54C48 78 48 118 56 148C70 156 130 156 144 148C152 118 152 78 148 54C140 24 60 24 52 54Z" fill="url(#rachelHairSleek)" />

            {/* SHOULDERS & BLAZER (Back) */}
            <path d="M26 195C26 156 50 138 82 135L100 152L118 135C150 138 174 156 174 195V200H26V195Z" fill="url(#rachelBlazerGrad)" />
            
            {/* CRISP WHITE SHIRT / BLOUSE */}
            <path d="M82 135L100 174L118 135H82Z" fill="url(#rachelBlouseGrad)" />
            <path d="M99 135L100 172L101 135H99Z" stroke="#CBD5E1" strokeWidth="1" />

            {/* NECK & SHADOW */}
            <path d="M86 96V132C86 140 92 145 100 145C108 145 114 140 114 132V96H86Z" fill="url(#rachelSkinGrad)" />
            <path d="M86 104C92 118 108 118 114 104V130C114 138 108 143 100 143C92 143 86 138 86 130V104Z" fill="url(#rachelJawShadowGrad)" />

            {/* BLAZER LAPELS & TAILORING (Front) */}
            <path d="M50 146L80 135L96 182L66 196C54 190 50 172 50 146Z" fill="url(#rachelLapelsGrad)" />
            <path d="M150 146L120 135L104 182L134 196C146 190 150 172 150 146Z" fill="url(#rachelLapelsGrad)" />

            {/* EARS & PEARL EARRINGS */}
            <path d="M64 74C61 74 59 80 60 86C61 92 64 95 67 94L68 80L64 74Z" fill="#F8CFAF" />
            <path d="M136 74C139 74 141 80 140 86C139 92 136 95 133 94L132 80L136 74Z" fill="#F8CFAF" />
            <circle cx="63" cy="88" r="2.8" fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />
            <circle cx="137" cy="88" r="2.8" fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />

            {/* NATURAL PROPORTIONAL JAWLINE & FOREHEAD */}
            <path d="M68 54C68 36 80 28 100 28C120 28 132 36 132 54C132 82 121 106 100 106C79 106 68 82 68 54Z" fill="url(#rachelSkinGrad)" />
            <path d="M71 86C79 100 89 106 100 106C111 106 121 100 129 86C121 98 111 104 100 104C89 104 79 98 71 86Z" fill="url(#rachelJawShadowGrad)" />

            {/* SOFT CHEEK RADIANCE */}
            <ellipse cx="79" cy="76" rx="8" ry="4.5" fill="url(#rachelCheekGlowGrad)" />
            <ellipse cx="121" cy="76" rx="8" ry="4.5" fill="url(#rachelCheekGlowGrad)" />

            {/* EYEBROWS */}
            <path d="M75 52C81 48 88 49 93 53" stroke="#221108" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M125 52C119 48 112 49 107 53" stroke="#221108" strokeWidth="2.2" strokeLinecap="round" />

            {/* NATURAL EYES WITH LIFE-LIKE GAZE & BLINK */}
            <g className="rachel-blink">
              {/* Left Eye */}
              <path d="M75 63C79 58 87 58 92 63" stroke="#1A0D07" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M76 63C80 68 87 68 91 63" fill="#FFFFFF" />
              <g className="pupil-gaze">
                <circle cx="83.5" cy="63" r="4" fill="url(#rachelHazelIris)" />
                <circle cx="83.5" cy="63" r="2.1" fill="#0D0603" />
                <circle cx="82" cy="61.5" r="1.2" fill="#FFFFFF" />
                <circle cx="85" cy="64.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
              </g>
              <path d="M74 62L71 60M93 62L96 60" stroke="#1A0D07" strokeWidth="1" strokeLinecap="round" />

              {/* Right Eye */}
              <path d="M108 63C113 58 121 58 125 63" stroke="#1A0D07" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M109 63C113 68 120 68 124 63" fill="#FFFFFF" />
              <g className="pupil-gaze">
                <circle cx="116.5" cy="63" r="4" fill="url(#rachelHazelIris)" />
                <circle cx="116.5" cy="63" r="2.1" fill="#0D0603" />
                <circle cx="115" cy="61.5" r="1.2" fill="#FFFFFF" />
                <circle cx="118" cy="64.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
              </g>
              <path d="M107 62L104 60M126 62L129 60" stroke="#1A0D07" strokeWidth="1" strokeLinecap="round" />
            </g>

            {/* REFINED SLENDER NOSE */}
            <path d="M100 56V75L96 78H104" stroke="#C97A52" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* NATURAL LIP SHAPE & CONVERSATIONAL ARTICULATION */}
            {isSpeaking ? (
              <g className="cadenced-mouth">
                {/* Lip background & inner oral cavity */}
                <path d="M90 91C93 88 97 89 100 90C103 89 107 88 110 91C108 97 92 97 90 91Z" fill="#D95C5C" />
                <ellipse cx="100" cy="94" rx="7" ry="4.5" fill="#4C0519" />
                <path d="M93.5 91.5H106.5C104.5 93.5 95.5 93.5 93.5 91.5Z" fill="#FFFFFF" />
                <path d="M92 95C95 98 105 98 108 95" stroke="#BE123C" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              <g>
                <path d="M91 91C94 89 97 90 100 91C103 90 106 89 109 91C107 95 93 95 91 91Z" fill="#D95C5C" />
                <path d="M92 92C95 94.5 105 94.5 108 92" stroke="#881337" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                <path d="M95 92.5C97 93.5 103 93.5 105 92.5" fill="#FFFFFF" />
              </g>
            )}

            {/* SLEEK, PROFESSIONAL STYLED HAIR (BALANCED & ELEGANT, NOT TOO MUCH HAIR) */}
            {/* 1. Crown Contour */}
            <path d="M64 50C62 34 74 20 100 18C126 20 138 34 136 50C130 26 118 22 100 22C82 22 70 26 64 50Z" fill="url(#rachelHairSleek)" />
            
            {/* 2. Sleek Side-Parted Fringe (Natural proportioned hairline from y=36 to y=44) */}
            <path d="M66 48C74 36 88 28 104 28C122 28 132 36 134 48C128 38 116 32 102 32C84 32 72 38 66 48Z" fill="url(#rachelHairShine)" />
            <path d="M66 46C76 40 90 38 102 42C116 38 128 40 134 48C128 42 114 36 100 36C84 36 72 42 66 46Z" fill="url(#rachelHairSleek)" />

            {/* 3. Sleek Face-Framing Tresses (Clean, soft edge) */}
            <path d="M65 48C63 66 65 88 70 104C73 107 75 105 74 100C70 84 68 66 69 48Z" fill="url(#rachelHairSleek)" />
            <path d="M135 48C137 66 135 88 130 104C127 107 125 105 126 100C130 84 132 66 131 48Z" fill="url(#rachelHairSleek)" />

            {/* SLEEK STUDIO HEADSET & MIC */}
            <path d="M63 64C63 36 78 20 100 20C122 20 137 36 137 64" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <rect x="58" y="60" width="5.5" height="16" rx="2.75" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
            <path d="M61 72C56 90 62 104 84 100" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="85" cy="100" r="3.5" fill="#6366F1" stroke="#A5B4FC" strokeWidth="1.5" className={isSpeaking ? "mic-live-pulse" : ""} />
          </g>
        </svg>

        {isSpeaking && (
          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-indigo-600/95 backdrop-blur-md border border-indigo-400/40 text-[9px] font-mono font-bold text-white flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            SPEAKING
          </div>
        )}
      </div>
    </div>
  </div>
);

// Ultra-Detailed, Realistic & Animated SVG Portrait: Candidate (You) with real mic frequency binding
const CandidateGraphic = ({ isSpeaking, isDark = false, frequencyBins = [] }) => (
  <div className="relative flex items-center justify-center">
    {/* Ambient Glow */}
    <div
      className={`absolute -inset-5 rounded-full transition-all duration-700 blur-2xl ${
        isSpeaking
          ? isDark ? "bg-emerald-500/30 scale-110" : "bg-emerald-500/20 scale-110"
          : isDark ? "bg-emerald-500/10 scale-90" : "bg-emerald-500/5 scale-90"
      }`}
    />

    {/* Concentric Pulse Wave Rings */}
    {isSpeaking && (
      <>
        <div className="absolute -inset-3 rounded-full border-2 border-emerald-400/30 animate-ping" style={{ animationDuration: "2.5s" }} />
        <div className="absolute -inset-6 rounded-full border border-emerald-500/15 animate-ping" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }} />
      </>
    )}

    {/* Portrait Container with subtle breathing */}
    <div className={`relative z-10 w-36 h-36 rounded-2xl p-1 ${isDark ? "bg-gradient-to-b from-emerald-400/40 via-white/10 to-transparent shadow-2xl border border-white/15" : "bg-gradient-to-b from-emerald-100 via-slate-50 to-white shadow-xl border border-slate-200/80"} transition-all duration-500 ${isSpeaking ? "scale-105" : ""}`}>
      <div className={`w-full h-full rounded-2xl ${isDark ? "bg-gradient-to-b from-[#12221C] via-[#0C1613] to-[#060B0A]" : "bg-gradient-to-b from-[#EDF2F7] via-[#F8FAFC] to-[#FFFFFF]"} flex items-center justify-center overflow-hidden shadow-inner relative group`}>
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>{`
              @keyframes candBlinkAnim {
                0%, 88%, 94%, 100% { transform: scaleY(1); }
                91% { transform: scaleY(0.08); }
              }
              @keyframes candGazeAnim {
                0%, 100% { transform: translate(0px, 0px); }
                25% { transform: translate(1px, -0.4px); }
                55% { transform: translate(0px, 0px); }
                75% { transform: translate(-1.2px, 0.4px); }
              }
              @keyframes candTalkCadence {
                0% { transform: scaleY(0.3); }
                20% { transform: scaleY(1); }
                40% { transform: scaleY(0.35); }
                60% { transform: scaleY(0.8); }
                80% { transform: scaleY(0.25); }
                100% { transform: scaleY(0.3); }
              }
              .cand-blink-class {
                transform-origin: 100px 63px;
                animation: candBlinkAnim 5.8s infinite ease-in-out;
              }
              .cand-gaze-class {
                animation: candGazeAnim 7.5s infinite ease-in-out;
              }
              .cand-mouth-cadence {
                transform-origin: 100px 92px;
                animation: candTalkCadence 0.9s infinite ease-in-out;
              }
              .cand-breathing-class {
                animation: subtleInhale 5.8s infinite ease-in-out;
              }
            `}</style>

            {/* Skin Gradients */}
            <linearGradient id="candSkinNew" x1="100" y1="35" x2="100" y2="125" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFE6D4" />
              <stop offset="45%" stopColor="#F7CBAE" />
              <stop offset="100%" stopColor="#E2A682" />
            </linearGradient>
            <linearGradient id="candJawShadowNew" x1="100" y1="75" x2="100" y2="118" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D98A62" stopOpacity="0" />
              <stop offset="100%" stopColor="#B35F35" stopOpacity="0.55" />
            </linearGradient>

            {/* Hair Gradients */}
            <linearGradient id="candHairNew" x1="60" y1="15" x2="140" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2B2623" />
              <stop offset="50%" stopColor="#1A1614" />
              <stop offset="100%" stopColor="#0A0807" />
            </linearGradient>

            {/* Jacket & Shirt */}
            <linearGradient id="candJacketNew" x1="40" y1="130" x2="160" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1F2630" />
              <stop offset="50%" stopColor="#11171F" />
              <stop offset="100%" stopColor="#070A0E" />
            </linearGradient>
            <linearGradient id="candInnerNew" x1="100" y1="130" x2="100" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
          </defs>

          {/* STUDIO AMBIENT BACKDROP */}
          <circle cx="100" cy="100" r="92" fill={isDark ? "#0B120F" : "#EDF5F2"} />
          <circle cx="100" cy="85" r="72" fill={isDark ? "#112920" : "#D1FAE5"} fillOpacity={isDark ? "0.4" : "0.5"} />

          {/* ALIVE CHARACTER CONTAINER */}
          <g className="cand-breathing-class">
            {/* SHOULDERS & JACKET */}
            <path d="M26 195C26 156 50 138 82 135L100 152L118 135C150 138 174 156 174 195V200H26V195Z" fill="url(#candJacketNew)" />
            {/* T-Shirt */}
            <path d="M82 135L100 172L118 135H82Z" fill="url(#candInnerNew)" />

            {/* NECK */}
            <path d="M84 96V132C84 140 91 145 100 145C109 145 116 140 116 132V96H84Z" fill="url(#candSkinNew)" />
            <path d="M84 104C92 118 108 118 116 104V130C116 138 109 143 100 143C91 143 84 138 84 130V104Z" fill="url(#candJawShadowNew)" />

            {/* EARS */}
            <path d="M62 72C59 72 57 78 58 84C59 90 62 93 65 92L66 78L62 72Z" fill="#F7CBAE" />
            <path d="M138 72C141 72 143 78 142 84C141 90 138 93 135 92L134 78L138 72Z" fill="#F7CBAE" />

            {/* FACE SHAPE */}
            <path d="M66 56C66 36 78 26 100 26C122 26 134 36 134 56C134 80 124 106 100 106C76 106 66 80 66 56Z" fill="url(#candSkinNew)" />
            <path d="M70 86C78 100 89 106 100 106C111 106 122 100 130 86C124 98 113 104 100 104C87 104 76 98 70 86Z" fill="url(#candJawShadowNew)" />

            {/* EYEBROWS */}
            <path d="M75 50C80 46 88 46 93 50" stroke="#1A1614" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M125 50C120 46 112 46 107 50" stroke="#1A1614" strokeWidth="2.6" strokeLinecap="round" />

            {/* ANIMATED BLINKING & GAZE TRACKING EYES */}
            <g className="cand-blink-class">
              {/* Left Eye */}
              <path d="M75 61C79 57 87 57 91 61" stroke="#0A0807" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M76 61C79 65 87 65 90 61" fill="#FFFFFF" />
              <g className="cand-gaze-class">
                <circle cx="83.5" cy="61" r="3.8" fill="#1A1614" />
                <circle cx="82.5" cy="59.5" r="1.2" fill="#FFFFFF" />
              </g>

              {/* Right Eye */}
              <path d="M109 61C113 57 121 57 125 61" stroke="#0A0807" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M110 61C113 65 121 65 124 61" fill="#FFFFFF" />
              <g className="cand-gaze-class">
                <circle cx="116.5" cy="61" r="3.8" fill="#1A1614" />
                <circle cx="115.5" cy="59.5" r="1.2" fill="#FFFFFF" />
              </g>
            </g>

            {/* NOSE */}
            <path d="M100 58V75L95 78H105" stroke="#C97A52" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* MOUTH / LIVE CANDIDATE SPEAKING */}
            {isSpeaking ? (
              <g>
                <path d="M89 90C94 94 106 94 111 90" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <ellipse cx="100" cy="92" rx="6.5" ry="3" fill="#4C0519" className="cand-mouth-cadence" />
              </g>
            ) : (
              <path d="M89 90C94 94 106 94 111 90" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            )}

            {/* MODERN FADE HAIR */}
            <path d="M64 50C62 34 72 16 100 14C128 16 138 34 136 50C130 28 118 20 100 20C82 20 70 28 64 50Z" fill="url(#candHairNew)" />
            <path d="M64 50C64 38 76 26 96 24C116 22 132 30 136 46C132 36 120 30 102 30C84 30 70 38 64 50Z" fill="#3B342F" />

            {/* STUDIO OVER-EAR HEADPHONES */}
            <path d="M59 64C59 36 76 20 100 20C124 20 141 36 141 64" stroke="#10B981" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <rect x="54" y="60" width="6.5" height="19" rx="3.25" fill="#047857" stroke="#34D399" strokeWidth="1.3" />
            <rect x="139.5" y="60" width="6.5" height="19" rx="3.25" fill="#047857" stroke="#34D399" strokeWidth="1.3" />
          </g>
        </svg>

        {isSpeaking && (
          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-emerald-600/95 backdrop-blur-md border border-emerald-400/40 text-[9px] font-mono font-bold text-white flex items-center gap-1.5 shadow-md">
            <div className="flex items-center gap-0.5">
              {(frequencyBins?.length ? frequencyBins.slice(0, 4) : [8, 14, 10, 6]).map((h, i) => (
                <span
                  key={i}
                  className="w-0.5 bg-white rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(3, Math.min(12, h * 0.25))}px` }}
                />
              ))}
            </div>
            <span>MIC</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function InterviewPreviewPage() {
  // Playground state controls
  const [phase, setPhase] = useState("asking"); // "greeting" | "asking" | "waiting" | "processing" | "evaluation"
  const [sampleQuestionNum, setSampleQuestionNum] = useState(1);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Real Microphone & Barge-in States
  const [isLiveMicActive, setIsLiveMicActive] = useState(false);
  const [micFrequencyBins, setMicFrequencyBins] = useState([10, 10, 10, 10, 10, 10, 10, 10]);
  const [bargeInNotice, setBargeInNotice] = useState(false);

  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const animFrameIdRef = React.useRef(null);
  const bargeInCountRef = React.useRef(0);

  // Toggle Live Microphone input
  const toggleLiveMic = async () => {
    if (isLiveMicActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      setIsLiveMicActive(false);
      setMicFrequencyBins([10, 10, 10, 10, 10, 10, 10, 10]);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        setIsLiveMicActive(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Microphone permission was denied or is unavailable.");
      }
    }
  };

  // Continuous 60fps sampling loop for visualizer and barge-in
  useEffect(() => {
    let isRunning = true;

    const sampleAudio = () => {
      if (!isRunning) return;

      if (analyserRef.current && isLiveMicActive) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // 8 frequency bands
        const binCount = 8;
        const binSize = Math.max(1, Math.floor(bufferLength / binCount));
        const levels = [];
        let totalSum = 0;

        for (let i = 0; i < binCount; i++) {
          let sum = 0;
          for (let j = 0; j < binSize; j++) {
            sum += dataArray[i * binSize + j] || 0;
          }
          const avg = sum / binSize;
          totalSum += avg;
          const normalized = Math.max(8, Math.min(46, Math.round((avg / 255) * 40) + 8));
          levels.push(normalized);
        }

        setMicFrequencyBins(levels);

        // Barge-in detection in asking phase (requires vocal frequency energy > 38 and total avg > 36 to ignore fan noise)
        const avgVol = totalSum / binCount;
        const vocalEnergy = (levels[2] + levels[3] + levels[4] + levels[5]) / 4;
        if (phase === "asking" && vocalEnergy > 38 && avgVol > 36) {
          bargeInCountRef.current += 1;
          if (bargeInCountRef.current >= 5) {
            console.log("⚡ Barge-in triggered in preview!");
            bargeInCountRef.current = 0;
            setBargeInNotice(true);
            setTimeout(() => setBargeInNotice(false), 3000);
            setPhase("waiting");
          }
        } else {
          bargeInCountRef.current = Math.max(0, bargeInCountRef.current - 1);
        }
      } else if (!isLiveMicActive) {
        // Subtle simulated idle bounce if not in real mic mode
        setMicFrequencyBins([12, 20, 16, 26, 14, 22, 18, 14]);
      }

      animFrameIdRef.current = requestAnimationFrame(sampleAudio);
    };

    animFrameIdRef.current = requestAnimationFrame(sampleAudio);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isLiveMicActive, phase]);

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const sampleQuestions = [
    {
      number: 1,
      type: "Technical Architecture",
      leadAck: "",
      text: "Could you walk me through the architecture of a high-traffic full-stack application you designed, and how you handled database scaling, caching, and state management?",
    },
    {
      number: 2,
      type: "System Design & Concurrency",
      leadAck: "Got it. Moving on to the next scenario,",
      text: "How would you design a real-time collaborative code editor supporting 50,000 concurrent users with Conflict-free Replicated Data Types (CRDTs) and WebSocket sync?",
    },
    {
      number: 3,
      type: "Engineering Leadership",
      leadAck: "Understood. Shifting gears slightly,",
      text: "Tell me about a time when you had a strong technical disagreement with a team lead regarding an architectural decision. How did you resolve it constructively?",
    },
  ];

  const currentQ = sampleQuestions[sampleQuestionNum - 1];
  const isAISpeaking = phase === "asking" || phase === "greeting";
  const isCandidateSpeaking = phase === "waiting";

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#090A10] text-gray-100" : "bg-[#F8FAFC] text-slate-800"} flex flex-col font-sans select-none transition-colors duration-300`}>
      {/* TOP PLAYGROUND CONTROLLER (For testing states & themes without spending credits) */}
      <div className={`${isDarkMode ? "bg-[#11131E] border-b border-white/10 shadow-md" : "bg-white border-b border-slate-200 shadow-sm"} px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-50 transition-colors`}>
        <div className="flex items-center gap-3">
          <div className={`px-2.5 py-1 rounded-md ${isDarkMode ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300" : "bg-indigo-50 border border-indigo-200 text-indigo-700"} font-mono text-xs font-semibold flex items-center gap-1.5`}>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            0-CREDIT UI PLAYGROUND
          </div>
          <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
            Test interview stages, live audio reactions & themes:
          </span>
        </div>

        {/* Phase switcher tabs, Live Mic & Theme Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Live Mic Toggle */}
          <button
            onClick={toggleLiveMic}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isLiveMicActive
                ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/30 animate-pulse"
                : isDarkMode
                  ? "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
            }`}
            title="Connect your actual microphone to test live frequency waves and barge-in"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isLiveMicActive ? "Live Mic Connected (Talk now!)" : "Test Real Mic"}</span>
          </button>

          <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDarkMode ? "bg-black/40 border-white/10" : "bg-slate-100 border-slate-200"}`}>
            <button
              onClick={() => setPhase("greeting")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                phase === "greeting"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              1. Intro
            </button>
            <button
              onClick={() => setPhase("asking")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                phase === "asking"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              2. AI Speaking
            </button>
            <button
              onClick={() => setPhase("waiting")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                phase === "waiting"
                  ? "bg-emerald-600 text-white shadow-sm font-semibold"
                  : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              3. Candidate Speaking
            </button>
            <button
              onClick={() => setPhase("processing")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                phase === "processing"
                  ? "bg-amber-600 text-white shadow-sm font-semibold"
                  : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              4. AI Thinking
            </button>
            <button
              onClick={() => setPhase("evaluation")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                phase === "evaluation"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              5. Evaluated
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
            }`}
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>

        {/* Question Selector */}
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>Question:</span>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              onClick={() => setSampleQuestionNum(num)}
              className={`w-7 h-7 text-xs rounded-lg font-bold border transition-all ${
                sampleQuestionNum === num
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                  : !isDarkMode
                    ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              Q{num}
            </button>
          ))}
        </div>
      </div>

      {/* Barge-In Interruption Live Feedback Notification Banner */}
      {bargeInNotice && (
        <div className="mx-6 sm:mx-10 mt-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Interruption Detected: Rachel yielded speaking to listen to your response.</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">Hands-Free Barge-In</span>
        </div>
      )}

      {/* FULLSCREEN IMMERSIVE EXECUTIVE INTERVIEW STAGE */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 max-w-6xl mx-auto w-full relative">
        {/* TOP STATUS BAR */}
        <header className={`flex items-center justify-between gap-4 py-3 border-b ${isDarkMode ? "border-white/5" : "border-slate-200/80"}`}>
          {/* Left: Meeting context */}
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-xl ${isDarkMode ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" : "bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm"} flex items-center justify-center`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"} tracking-wide`}>
                  Senior Full Stack Engineer Technical Round
                </h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isDarkMode ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30" : "bg-indigo-50 text-indigo-700 border border-indigo-200"}`}>
                  LIVE INTERVIEW
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-0.5`}>
                Evaluator: Rachel (Senior Engineering Lead) • Question {sampleQuestionNum} of 5
              </p>
            </div>
          </div>

          {/* Center: Progress tracker */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((q) => (
                <div
                  key={q}
                  className={`h-1.5 rounded-full transition-all ${
                    q === sampleQuestionNum
                      ? "w-8 bg-indigo-600 shadow-sm shadow-indigo-500/50"
                      : q < sampleQuestionNum
                        ? isDarkMode ? "w-4 bg-indigo-400/40" : "w-4 bg-indigo-300"
                        : isDarkMode ? "w-4 bg-white/10" : "w-4 bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-mono font-semibold ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
              Q{sampleQuestionNum}/5
            </span>
          </div>

          {/* Right: Timer & End Meeting */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border ${isDarkMode ? "bg-[#141622] border-white/10 text-gray-200" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}>
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-mono font-semibold tracking-wider">
                12:45 remaining
              </span>
            </div>

            <button className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${isDarkMode ? "bg-red-500/10 hover:bg-red-500/20 border-red-500/25 text-red-300" : "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"}`}>
              <PhoneOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">End Meeting</span>
            </button>
          </div>
        </header>

        {/* CENTER EXECUTIVE VIDEO/VOICE STAGE (Split Participant Cards) */}
        <main className="flex-1 flex flex-col justify-center my-6 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* 1. INTERVIEWER PARTICIPANT CARD */}
            <div
              className={`relative rounded-2xl transition-all duration-500 p-6 flex flex-col justify-between min-h-[300px] ${
                isDarkMode
                  ? `bg-[#121420] border shadow-2xl ${
                      isAISpeaking
                        ? "border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30"
                        : "border-white/10"
                    }`
                  : `bg-white border shadow-md ${
                      isAISpeaking
                        ? "border-indigo-500 shadow-[0_4px_24px_rgba(99,102,241,0.18)] ring-2 ring-indigo-500/20"
                        : "border-slate-200/80"
                    }`
              }`}
            >
              {/* Card top: Speaker tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isAISpeaking
                        ? "bg-indigo-600 dark:bg-indigo-400 animate-pulse"
                        : "bg-slate-400 dark:bg-gray-500"
                    }`}
                  />
                  <span className={`text-xs font-bold ${isDarkMode ? "text-gray-200" : "text-slate-800"}`}>
                    Rachel • Technical Interviewer
                  </span>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                    isAISpeaking
                      ? isDarkMode
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : phase === "processing"
                        ? isDarkMode
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                        : isDarkMode
                          ? "bg-white/5 text-gray-400 border border-white/5"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {phase === "asking"
                    ? "Speaking..."
                    : phase === "greeting"
                      ? "Starting Interview..."
                      : phase === "processing"
                        ? "Synthesizing Analysis..."
                        : "Listening"}
                </span>
              </div>

              {/* Card Center: Bespoke Vector Graphic */}
              <div className="flex flex-col items-center justify-center my-4">
                <InterviewerGraphic
                  isSpeaking={isAISpeaking}
                  isThinking={phase === "processing"}
                  isDark={isDarkMode}
                />

                <div className="text-center mt-3">
                  <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Rachel</h3>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>Lead Engineering Assessor</p>
                </div>
              </div>

              {/* Card Bottom: Reactive Live Soundwave Equalizer */}
              <div className={`flex items-center justify-center gap-1.5 h-9 rounded-xl px-4 border ${isDarkMode ? "bg-black/25 border-white/5" : "bg-slate-50 border-slate-200/80"}`}>
                {isAISpeaking ? (
                  [16, 28, 38, 22, 42, 28, 36, 18, 32, 16, 24, 34].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse shadow-sm shadow-indigo-400"
                      style={{
                        height: `${h * 0.55}px`,
                        animationDuration: `${0.3 + (i % 3) * 0.15}s`,
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  ))
                ) : phase === "processing" ? (
                  <div className={`flex items-center gap-2 ${isDarkMode ? "text-amber-300" : "text-amber-700"} text-xs font-semibold`}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating technical response...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 opacity-50">
                    {[4, 4, 4, 4, 4, 4, 4, 4].map((_, i) => (
                      <div key={i} className={`w-1 h-1.5 rounded-full ${isDarkMode ? "bg-gray-600" : "bg-slate-300"}`} />
                    ))}
                    <span className={`text-[11px] font-medium ml-1.5 ${isDarkMode ? "text-gray-400" : "text-slate-400"}`}>Standing by</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. CANDIDATE PARTICIPANT CARD WITH REAL MICROPHONE WAVEFORM BINDING */}
            <div
              className={`relative rounded-2xl transition-all duration-500 p-6 flex flex-col justify-between min-h-[300px] ${
                isDarkMode
                  ? `bg-[#121420] border shadow-2xl ${
                      isCandidateSpeaking
                        ? "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                        : "border-white/10"
                    }`
                  : `bg-white border shadow-md ${
                      isCandidateSpeaking
                        ? "border-emerald-500 shadow-[0_4px_24px_rgba(16,185,129,0.18)] ring-2 ring-emerald-500/20"
                        : "border-slate-200/80"
                    }`
              }`}
            >
              {/* Card top: Speaker tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isCandidateSpeaking ? "bg-emerald-600 dark:bg-emerald-400 animate-pulse" : "bg-slate-400 dark:bg-gray-500"
                    }`}
                  />
                  <span className={`text-xs font-bold ${isDarkMode ? "text-gray-200" : "text-slate-800"}`}>
                    Candidate (You)
                  </span>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                    isCandidateSpeaking
                      ? isDarkMode
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isDarkMode
                        ? "bg-white/5 text-gray-400 border border-white/5"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {isCandidateSpeaking ? "Your Turn • Mic Active" : "Muted / Listening"}
                </span>
              </div>

              {/* Card Center: Bespoke Vector Graphic */}
              <div className="flex flex-col items-center justify-center my-4">
                <CandidateGraphic
                  isSpeaking={isCandidateSpeaking}
                  isDark={isDarkMode}
                  frequencyBins={micFrequencyBins}
                />

                <div className="text-center mt-3">
                  <h3 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Full Stack Candidate</h3>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
                    {isLiveMicActive ? "Live Microphone Input" : "Microphone Input"}
                  </p>
                </div>
              </div>

              {/* Card Bottom: Candidate Mic Level / Done Speaking Action */}
              <div className={`flex items-center justify-between gap-3 h-10 rounded-xl px-4 border ${isDarkMode ? "bg-black/25 border-white/5" : "bg-slate-50 border-slate-200/80"}`}>
                {isCandidateSpeaking ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                      <div className="flex items-center gap-1">
                        {(micFrequencyBins?.length ? micFrequencyBins : [12, 24, 16, 28, 14, 22, 16, 20]).map((h, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-75 ease-out shadow-sm shadow-emerald-500/40"
                            style={{ height: `${Math.max(6, Math.min(32, h * 0.75))}px` }}
                          />
                        ))}
                      </div>
                      <span className={`text-[11px] ${isDarkMode ? "text-emerald-300" : "text-emerald-700"} font-bold ml-1`}>
                        {isLiveMicActive ? "Live Audio Active" : "Speaking..."}
                      </span>
                    </div>

                    <button
                      onClick={() => setPhase("processing")}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1"
                    >
                      <span>Done Speaking</span>
                      <span>✓</span>
                    </button>
                  </>
                ) : (
                  <div className={`flex items-center gap-2 text-[11px] ${isDarkMode ? "text-gray-400" : "text-slate-400"} mx-auto`}>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Microphone will activate when interviewer finishes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QUESTION & LIVE TRANSCRIPT CARD */}
          <div className={`rounded-2xl p-6 shadow-sm border ${isDarkMode ? "bg-[#121420] border-white/10" : "bg-white border-slate-200/80"}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isDarkMode ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" : "bg-indigo-50 border border-indigo-200 text-indigo-600"}`}>
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                    Question {sampleQuestionNum} • {currentQ.type}
                  </span>
                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-slate-400"}`}>Live Transcription</span>
                </div>
                <p className={`text-base sm:text-lg leading-relaxed font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {currentQ.leadAck && (
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium italic block mb-1">
                      "{currentQ.leadAck}"
                    </span>
                  )}
                  <span>"{currentQ.text}"</span>
                </p>

                {phase === "waiting" && (
                  <div className={`mt-3 pt-3 border-t flex items-center gap-2 text-xs font-semibold ${isDarkMode ? "border-white/5 text-emerald-400" : "border-slate-100 text-emerald-700"}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Speak naturally into your microphone. Your answer is evaluated in real-time.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* BOTTOM FLOATING CONTROL DOCK WITH LIVE EQUALIZER */}
        <footer className={`flex items-center justify-between gap-4 py-4 border-t ${isDarkMode ? "border-white/5" : "border-slate-200/80"}`}>
          {/* Live Reactive Audio Bar */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
              <span className={`w-2 h-2 rounded-full ${isAISpeaking ? "bg-indigo-600 dark:bg-indigo-400 animate-pulse" : isCandidateSpeaking ? "bg-emerald-600 dark:bg-emerald-400 animate-pulse" : "bg-slate-400 dark:bg-gray-500"}`} />
              
              {/* Dynamic Waveform Reactor */}
              {isAISpeaking ? (
                <div className="flex items-center gap-0.5 px-1">
                  {[12, 20, 28, 16, 24, 14, 26, 18].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse shadow-sm shadow-indigo-400"
                      style={{
                        height: `${h * 0.55}px`,
                        animationDuration: `${0.35 + (i % 3) * 0.12}s`,
                        animationDelay: `${i * 40}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : isCandidateSpeaking ? (
                <div className="flex items-center gap-0.5 px-1">
                  {(micFrequencyBins?.length ? micFrequencyBins : [14, 24, 30, 18, 26, 16, 22, 14]).map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-emerald-600 dark:bg-emerald-400 rounded-full transition-all duration-75 ease-out"
                      style={{
                        height: `${Math.max(4, Math.min(26, h * 0.6))}px`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1 px-1">
                  {[3, 3, 3, 3, 3].map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-gray-600" : "bg-slate-300"}`} />
                  ))}
                </div>
              )}

              <span className={`text-xs font-semibold ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>
                {phase === "asking"
                  ? "Interviewer Speaking"
                  : phase === "waiting"
                    ? "Candidate Speaking"
                    : phase === "processing"
                      ? "Evaluating Response"
                      : "Session Ready"}
              </span>
            </div>
          </div>

          {/* Action pills */}
          <div className="flex items-center gap-3">
            <button className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${isDarkMode ? "bg-white/5 hover:bg-white/10 border-white/10 text-gray-300" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"}`}>
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip Question</span>
            </button>

            <button
              onClick={() => {
                const nextPhase = phase === "asking" ? "waiting" : phase === "waiting" ? "processing" : "asking";
                setPhase(nextPhase);
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <span>Next Phase Test</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
