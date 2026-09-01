import React from "react";
import { INTERVIEWER_VOICES } from "./constants";

// Ultra-Detailed, Realistic & Masculine Executive Portrait: Shubh (Senior Tech Lead)
export const ShubhInterviewerGraphic = ({ isSpeaking, isThinking, isDark = false }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>{`
        @keyframes executiveBlink {
          0%, 93%, 97%, 100% { opacity: 0; }
          95% { opacity: 1; }
        }
        @keyframes dynamicEyeGaze {
          0%, 25% { transform: translate(0px, 0px); }
          32%, 50% { transform: translate(-2.5px, 1.2px); } /* Reading candidate code / resume */
          58%, 75% { transform: translate(0px, 0px); } /* Direct attentive eye contact */
          82%, 92% { transform: translate(2.2px, -0.8px); } /* Analytical evaluation */
          98%, 100% { transform: translate(0px, 0px); }
        }
        @keyframes speechMouthCadence {
          0%, 100% { transform: scale(1, 0.5); }
          22% { transform: scale(1.04, 1.22); }
          44% { transform: scale(0.96, 0.65); }
          66% { transform: scale(1.05, 1.3); }
          84% { transform: scale(0.98, 0.75); }
        }
        @keyframes micPulseGlow {
          0%, 100% { r: 3.5; opacity: 0.85; filter: drop-shadow(0 0 3px #818CF8); }
          50% { r: 4.8; opacity: 1; filter: drop-shadow(0 0 8px #6366F1); }
        }
        @keyframes torsoBreathing {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1.2px); }
        }
        .shubh-eyelid-blink {
          animation: executiveBlink 4.6s infinite ease-in-out;
        }
        .shubh-pupil-gaze {
          animation: dynamicEyeGaze 6.5s infinite ease-in-out;
        }
        .shubh-mouth-anim {
          transform-origin: 100px 98px;
          animation: speechMouthCadence 0.42s infinite ease-in-out;
        }
        .shubh-mic-indicator {
          animation: micPulseGlow 1.4s infinite ease-in-out;
        }
        .shubh-torso-anim {
          animation: torsoBreathing 5s infinite ease-in-out;
        }
      `}</style>

      {/* Masculine Skin Tones */}
      <linearGradient id="shubhSkinGradMaster" x1="100" y1="30" x2="100" y2="135" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F5D0B5" />
        <stop offset="40%" stopColor="#E5B292" />
        <stop offset="85%" stopColor="#CE906D" />
        <stop offset="100%" stopColor="#B5714C" />
      </linearGradient>
      <linearGradient id="shubhForeheadHighlight" x1="100" y1="32" x2="100" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF0E5" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#F5D0B5" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="shubhJawUnderShadow" x1="100" y1="95" x2="100" y2="128" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#964C27" stopOpacity="0" />
        <stop offset="100%" stopColor="#6E3113" stopOpacity="0.65" />
      </linearGradient>

      {/* Textured Hair Layers */}
      <linearGradient id="shubhHairMain" x1="60" y1="8" x2="140" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2C2018" />
        <stop offset="50%" stopColor="#1A120D" />
        <stop offset="100%" stopColor="#0D0805" />
      </linearGradient>
      <linearGradient id="shubhHairVolHighlight" x1="75" y1="10" x2="125" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#523C2E" />
        <stop offset="50%" stopColor="#33241A" />
        <stop offset="100%" stopColor="#1A120D" stopOpacity="0" />
      </linearGradient>

      {/* Iris Gradient */}
      <radialGradient id="shubhIrisMaster" cx="0.42" cy="0.42" r="0.58">
        <stop offset="0%" stopColor="#78401C" />
        <stop offset="50%" stopColor="#4A240C" />
        <stop offset="85%" stopColor="#220D04" />
        <stop offset="100%" stopColor="#080301" />
      </radialGradient>

      {/* Suiting Gradients */}
      <linearGradient id="shubhNavyBlazer" x1="20" y1="120" x2="180" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E283C" />
        <stop offset="50%" stopColor="#111827" />
        <stop offset="100%" stopColor="#0A0F1A" />
      </linearGradient>
      <linearGradient id="shubhBlazerLapels" x1="65" y1="130" x2="135" y2="195" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2D3A54" />
        <stop offset="100%" stopColor="#162032" />
      </linearGradient>
      <linearGradient id="shubhTieGrad" x1="100" y1="140" x2="100" y2="195" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="60%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
    </defs>

    {/* BACKGROUND AMBIENT DOME */}
    <circle cx="100" cy="100" r="92" fill={isDark ? "#0A0D16" : "#F1F5F9"} />
    <circle cx="100" cy="85" r="75" fill={isDark ? "#161C2E" : "#E2E8F0"} fillOpacity={isDark ? "0.45" : "0.6"} />

    {/* CHARACTER CONTAINER */}
    <g className="shubh-torso-anim">
      {/* BROAD MASCULINE SHOULDERS & BLAZER (Back Body) */}
      <path d="M16 196C16 148 44 128 78 124L100 144L122 124C156 128 184 148 184 196V200H16V196Z" fill="url(#shubhNavyBlazer)" />

      {/* CRISP WHITE SPREAD COLLAR SHIRT */}
      <path d="M78 124L100 166L122 124H78Z" fill="#FFFFFF" />
      {/* Shirt Collar Flaps */}
      <polygon points="76,124 94,142 82,142" fill="#E2E8F0" />
      <polygon points="124,124 106,142 118,142" fill="#E2E8F0" />

      {/* SILK TIE WITH KNOT */}
      <polygon points="95,138 105,138 103,146 97,146" fill="#1D4ED8" />
      <path d="M96 146L100 152L104 146L103 195H97L96 146Z" fill="url(#shubhTieGrad)" />

      {/* PROPORTIONAL MASCULINE NECK & SHADOW (Integrated with Jaw) */}
      <path d="M80 88V126C80 134 89 138 100 138C111 138 120 134 120 126V88H80Z" fill="url(#shubhSkinGradMaster)" />
      {/* Sternocleidomastoid Muscle & Jaw Shadow */}
      <path d="M80 96C88 114 112 114 120 96V124C120 132 111 136 100 136C89 136 80 132 80 124V96Z" fill="url(#shubhJawUnderShadow)" />

      {/* BLAZER LAPELS (Sharp Tailored Cut) */}
      <path d="M40 142L78 124L96 178L58 196C46 188 40 168 40 142Z" fill="url(#shubhBlazerLapels)" />
      <path d="M160 142L122 124L104 178L142 196C154 188 160 168 160 142Z" fill="url(#shubhBlazerLapels)" />

      {/* MASCULINE EARS */}
      <path d="M59 66C56 66 54 72 55 80C56 86 59 90 62 88L64 74L59 66Z" fill="#E5B292" />
      <path d="M141 66C144 66 146 72 145 80C144 86 141 90 138 88L136 74L141 66Z" fill="#E5B292" />

      {/* CHISELED MASCULINE HEAD & JAW STRUCTURE */}
      <path d="M63 50C63 30 75 22 100 22C125 22 137 30 137 50C137 76 126 106 100 106C74 106 63 76 63 50Z" fill="url(#shubhSkinGradMaster)" />
      <path d="M63 50C63 30 75 22 100 22C125 22 137 30 137 50C137 60 130 65 100 65C70 65 63 60 63 50Z" fill="url(#shubhForeheadHighlight)" />

      {/* JAWLINE CONTOUR & SHADOW */}
      <path d="M66 84C76 98 88 106 100 106C112 106 124 98 134 84C124 98 112 104 100 104C88 104 76 98 66 84Z" fill="url(#shubhJawUnderShadow)" />

      {/* GROOMED DESIGNER STUBBLE (Natural Jaw & Upper Lip Shade) */}
      <path d="M66 78C66 96 78 106 100 106C122 106 134 96 134 78C132 89 125 100 114 103C108 105 92 105 86 103C75 100 68 89 66 78Z" fill="#1A120D" fillOpacity="0.28" />
      <path d="M91 87C94 85 106 85 109 87C107 90 93 90 91 87Z" fill="#1A120D" fillOpacity="0.2" />

      {/* BOLD STRAIGHT MASCULINE EYEBROWS */}
      <path d="M70 51H94" stroke="#120D09" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M130 51H106" stroke="#120D09" strokeWidth="3.2" strokeLinecap="round" />

      {/* HIGH-DEFINITION MASCULINE EYES */}
      <g>
        {/* Left Eye White & Socket */}
        <path d="M72 63C77 58 89 58 94 63C89 68 77 68 72 63Z" fill="#FFFFFF" />
        <path d="M71 62.5C76 57.5 90 57.5 95 62.5" stroke="#140E0A" strokeWidth="2" strokeLinecap="round" />
        <path d="M73 63.5C78 68 88 68 93 63.5" stroke="#BA714C" strokeWidth="0.8" strokeLinecap="round" fill="none" />

        {/* Left Pupil with Dynamic Gaze */}
        <g className="shubh-pupil-gaze">
          <circle cx="83" cy="63" r="4.2" fill="url(#shubhIrisMaster)" />
          <circle cx="83" cy="63" r="2.2" fill="#000000" />
          <circle cx="81.5" cy="61.5" r="1.2" fill="#FFFFFF" />
          <circle cx="84.5" cy="64.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
        </g>

        {/* Right Eye White & Socket */}
        <path d="M106 63C111 58 123 58 128 63C123 68 111 68 106 63Z" fill="#FFFFFF" />
        <path d="M105 62.5C110 57.5 124 57.5 129 62.5" stroke="#140E0A" strokeWidth="2" strokeLinecap="round" />
        <path d="M107 63.5C112 68 122 68 127 63.5" stroke="#BA714C" strokeWidth="0.8" strokeLinecap="round" fill="none" />

        {/* Right Pupil with Dynamic Gaze */}
        <g className="shubh-pupil-gaze">
          <circle cx="117" cy="63" r="4.2" fill="url(#shubhIrisMaster)" />
          <circle cx="117" cy="63" r="2.2" fill="#000000" />
          <circle cx="115.5" cy="61.5" r="1.2" fill="#FFFFFF" />
          <circle cx="118.5" cy="64.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
        </g>

        {/* Natural Eyelid Blink Overlay (Smooth Blink) */}
        <g className="shubh-eyelid-blink">
          <path d="M70 61C76 66 90 66 96 61" stroke="#BA714C" strokeWidth="3" strokeLinecap="round" />
          <path d="M104 61C110 66 124 66 130 61" stroke="#BA714C" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* DEFINED NOSE WITH BRIDGE HIGHLIGHT */}
      <path d="M100 52V75L95 78H105" stroke="#A85B35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M99 55V73" stroke="#FFF0E5" strokeWidth="1" opacity="0.5" strokeLinecap="round" />

      {/* NATURAL MASCULINE LIPS & ARTICULATION */}
      {isSpeaking ? (
        <g className="shubh-mouth-anim">
          <path d="M90 93C94 90 106 90 110 93C108 99 92 99 90 93Z" fill="#9C5A42" />
          <ellipse cx="100" cy="95.5" rx="6.5" ry="3.5" fill="#2E1007" />
          <path d="M94 93.5H106C104 95 96 95 94 93.5Z" fill="#F1F5F9" />
          <path d="M91 96.5C95 98.5 105 98.5 109 96.5" stroke="#662E1A" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <path d="M90 93C94 91 106 91 110 93C108 96 92 96 90 93Z" fill="#9C5A42" />
          <path d="M91 94C95 95.5 105 95.5 109 94" stroke="#5E2714" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* LAYERED EXECUTIVE POMPADOUR / TEXTURED CROP */}
      <path d="M58 46C56 22 72 8 100 6C128 8 144 22 142 46C135 18 120 12 100 12C80 12 65 18 58 46Z" fill="url(#shubhHairMain)" />
      <path d="M60 40C70 20 86 12 104 12C126 12 134 20 138 40C130 22 116 16 100 16C84 16 70 22 60 40Z" fill="url(#shubhHairVolHighlight)" />
      {/* Precision Side Tapers */}
      <path d="M60 42C59 52 59 64 62 70C63 72 64 70 63 66C61 60 61 50 62 42Z" fill="url(#shubhHairMain)" />
      <path d="M140 42C141 52 141 64 138 70C137 72 136 70 137 66C139 60 139 50 138 42Z" fill="url(#shubhHairMain)" />

      {/* ULTRA-SLEEK STUDIO HEADSET & GLOWING MIC */}
      <path d="M56 62C56 30 74 14 100 14C126 14 144 30 144 62" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="52" y="58" width="5.5" height="16" rx="2.75" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
      <path d="M55 70C50 88 56 102 78 98" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="79" cy="98" r="3.5" fill="#6366F1" stroke="#A5B4FC" strokeWidth="1.5" className={isSpeaking ? "shubh-mic-indicator" : ""} />
    </g>
  </svg>
);

// Ultra-Detailed, Realistic & Animated SVG Portrait: Rachel / Anushka (Senior Technical Interviewer - Female)
export const RachelInterviewerGraphic = ({ isSpeaking, isThinking, isDark = false }) => (
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
      <linearGradient id="rachelSkinGradAi" x1="100" y1="35" x2="100" y2="125" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEE6D6" />
        <stop offset="45%" stopColor="#F8CFAF" />
        <stop offset="100%" stopColor="#E5A682" />
      </linearGradient>
      <linearGradient id="rachelJawShadowGradAi" x1="100" y1="75" x2="100" y2="118" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D98A62" stopOpacity="0" />
        <stop offset="100%" stopColor="#B35F35" stopOpacity="0.55" />
      </linearGradient>
      <radialGradient id="rachelCheekGlowGradAi" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#F472B6" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
      </radialGradient>

      {/* Sleek, Tailored Brunette Hair System */}
      <linearGradient id="rachelHairSleekAi" x1="50" y1="18" x2="150" y2="150" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#321D12" />
        <stop offset="40%" stopColor="#201108" />
        <stop offset="100%" stopColor="#0F0804" />
      </linearGradient>
      <linearGradient id="rachelHairShineAi" x1="70" y1="20" x2="130" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5E3823" />
        <stop offset="50%" stopColor="#3E2214" />
        <stop offset="100%" stopColor="#201108" stopOpacity="0" />
      </linearGradient>

      {/* Hazel Eye Depth */}
      <radialGradient id="rachelHazelIrisAi" cx="0.4" cy="0.4" r="0.6">
        <stop offset="0%" stopColor="#A16207" />
        <stop offset="50%" stopColor="#713F12" />
        <stop offset="90%" stopColor="#291505" />
      </radialGradient>

      {/* Executive Tailored Blazer */}
      <linearGradient id="rachelBlazerGradAi" x1="40" y1="130" x2="160" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2B3252" />
        <stop offset="60%" stopColor="#1A1F36" />
        <stop offset="100%" stopColor="#0F1222" />
      </linearGradient>
      <linearGradient id="rachelLapelsGradAi" x1="70" y1="140" x2="130" y2="190" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3C4573" />
        <stop offset="100%" stopColor="#1E2340" />
      </linearGradient>
      <linearGradient id="rachelBlouseGradAi" x1="100" y1="130" x2="100" y2="180" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
    </defs>

    {/* BACKGROUND AMBIENT DOME */}
    <circle cx="100" cy="100" r="92" fill={isDark ? "#0E101A" : "#EEF2F6"} />
    <circle cx="100" cy="85" r="72" fill={isDark ? "#181D33" : "#E2E8F0"} fillOpacity={isDark ? "0.4" : "0.6"} />

    {/* BREATHING AVATAR BODY */}
    <g className="breathing-body">
      {/* SLEEK PROFESSIONAL BACK HAIR */}
      <path d="M52 64C48 88 50 118 54 144C62 150 72 154 82 154C66 132 62 100 64 74Z" fill="url(#rachelHairSleekAi)" />
      <path d="M148 64C152 88 150 118 146 144C138 150 128 154 118 154C134 132 138 100 136 74Z" fill="url(#rachelHairSleekAi)" />
      <path d="M52 54C48 78 48 118 56 148C70 156 130 156 144 148C152 118 152 78 148 54C140 24 60 24 52 54Z" fill="url(#rachelHairSleekAi)" />

      {/* SHOULDERS & BLAZER (Back) */}
      <path d="M26 195C26 156 50 138 82 135L100 152L118 135C150 138 174 156 174 195V200H26V195Z" fill="url(#rachelBlazerGradAi)" />
      
      {/* CRISP WHITE SHIRT / BLOUSE */}
      <path d="M82 135L100 174L118 135H82Z" fill="url(#rachelBlouseGradAi)" />
      <path d="M99 135L100 172L101 135H99Z" stroke="#CBD5E1" strokeWidth="1" />

      {/* NECK & SHADOW */}
      <path d="M86 96V132C86 140 92 145 100 145C108 145 114 140 114 132V96H86Z" fill="url(#rachelSkinGradAi)" />
      <path d="M86 104C92 118 108 118 114 104V130C114 138 108 143 100 143C92 143 86 138 86 130V104Z" fill="url(#rachelJawShadowGradAi)" />

      {/* BLAZER LAPELS & TAILORING (Front) */}
      <path d="M50 146L80 135L96 182L66 196C54 190 50 172 50 146Z" fill="url(#rachelLapelsGradAi)" />
      <path d="M150 146L120 135L104 182L134 196C146 190 150 172 150 146Z" fill="url(#rachelLapelsGradAi)" />

      {/* EARS & PEARL EARRINGS */}
      <path d="M64 74C61 74 59 80 60 86C61 92 64 95 67 94L68 80L64 74Z" fill="#F8CFAF" />
      <path d="M136 74C139 74 141 80 140 86C139 92 136 95 133 94L132 80L136 74Z" fill="#F8CFAF" />
      <circle cx="63" cy="88" r="2.8" fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />
      <circle cx="137" cy="88" r="2.8" fill="#FFFFFF" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />

      {/* NATURAL PROPORTIONAL JAWLINE & FOREHEAD */}
      <path d="M68 54C68 36 80 28 100 28C120 28 132 36 132 54C132 82 121 106 100 106C79 106 68 82 68 54Z" fill="url(#rachelSkinGradAi)" />
      <path d="M71 86C79 100 89 106 100 106C111 106 121 100 129 86C121 98 111 104 100 104C89 104 79 98 71 86Z" fill="url(#rachelJawShadowGradAi)" />

      {/* SOFT CHEEK RADIANCE */}
      <ellipse cx="79" cy="76" rx="8" ry="4.5" fill="url(#rachelCheekGlowGradAi)" />
      <ellipse cx="121" cy="76" rx="8" ry="4.5" fill="url(#rachelCheekGlowGradAi)" />

      {/* EYEBROWS */}
      <path d="M75 52C81 48 88 49 93 53" stroke="#221108" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M125 52C119 48 112 49 107 53" stroke="#221108" strokeWidth="2.2" strokeLinecap="round" />

      {/* NATURAL EYES WITH LIFE-LIKE GAZE & BLINK */}
      <g className="rachel-blink">
        <path d="M75 63C79 58 87 58 92 63" stroke="#1A0D07" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M76 63C80 68 87 68 91 63" fill="#FFFFFF" />
        <g className="pupil-gaze">
          <circle cx="83.5" cy="63" r="4" fill="url(#rachelHazelIrisAi)" />
          <circle cx="83.5" cy="63" r="2.1" fill="#0D0603" />
          <circle cx="82" cy="61.5" r="1.2" fill="#FFFFFF" />
          <circle cx="85" cy="64.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
        </g>
        <path d="M74 62L71 60M93 62L96 60" stroke="#1A0D07" strokeWidth="1" strokeLinecap="round" />

        <path d="M108 63C113 58 121 58 125 63" stroke="#1A0D07" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M109 63C113 68 120 68 124 63" fill="#FFFFFF" />
        <g className="pupil-gaze">
          <circle cx="116.5" cy="63" r="4" fill="url(#rachelHazelIrisAi)" />
          <circle cx="116.5" cy="63" r="2.1" fill="#0D0603" />
          <circle cx="115" cy="61.5" r="1.2" fill="#FFFFFF" />
          <circle cx="118" cy="64.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
        </g>
        <path d="M107 62L104 60M126 62L129 60" stroke="#1A0D07" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* REFINED SLENDER NOSE */}
      <path d="M100 56V75L96 78H104" stroke="#C97A52" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* NATURAL LIP SHAPE */}
      {isSpeaking ? (
        <g className="cadenced-mouth">
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

      {/* SLEEK HAIR */}
      <path d="M64 50C62 34 74 20 100 18C126 20 138 34 136 50C130 26 118 22 100 22C82 22 70 26 64 50Z" fill="url(#rachelHairSleekAi)" />
      <path d="M66 48C74 36 88 28 104 28C122 28 132 36 134 48C128 38 116 32 102 32C84 32 72 38 66 48Z" fill="url(#rachelHairShineAi)" />
      <path d="M66 46C76 40 90 38 102 42C116 38 128 40 134 48C128 42 114 36 100 36C84 36 72 42 66 46Z" fill="url(#rachelHairSleekAi)" />
      <path d="M65 48C63 66 65 88 70 104C73 107 75 105 74 100C70 84 68 66 69 48Z" fill="url(#rachelHairSleekAi)" />
      <path d="M135 48C137 66 135 88 130 104C127 107 125 105 126 100C130 84 132 66 131 48Z" fill="url(#rachelHairSleekAi)" />

      {/* SLEEK STUDIO HEADSET & MIC */}
      <path d="M63 64C63 36 78 20 100 20C122 20 137 36 137 64" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <rect x="58" y="60" width="5.5" height="16" rx="2.75" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
      <path d="M61 72C56 90 62 104 84 100" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="85" cy="100" r="3.5" fill="#6366F1" stroke="#A5B4FC" strokeWidth="1.5" className={isSpeaking ? "mic-live-pulse" : ""} />
    </g>
  </svg>
);

// Unified Interviewer Graphic with Male (Shubh) / Female (Anushka/Rachel) Persona Switching
export const InterviewerGraphic = ({
  isSpeaking,
  isThinking,
  isDark = false,
  voice = "shubh",
  size = "md",
  className = "",
}) => {
  const voiceMeta = INTERVIEWER_VOICES[voice] || INTERVIEWER_VOICES.shubh;
  const isMale = voiceMeta.gender === "male";

  const dimensionClass =
    className ||
    (size === "sm"
      ? "w-24 h-24"
      : size === "xs"
      ? "w-20 h-20"
      : size === "lg"
      ? "w-44 h-44"
      : "w-36 h-36");

  return (
    <div className="relative flex items-center justify-center shrink-0">
      {/* Ambient Studio Lighting Glow */}
      <div
        className={`absolute -inset-4 rounded-full transition-all duration-700 blur-xl ${
          isSpeaking
            ? isDark
              ? "bg-indigo-500/30 scale-110"
              : "bg-indigo-500/20 scale-110"
            : isThinking
            ? isDark
              ? "bg-amber-500/25 scale-100"
              : "bg-amber-500/15 scale-100"
            : isDark
            ? "bg-indigo-500/10 scale-90"
            : "bg-indigo-500/5 scale-90"
        }`}
      />

      {/* Concentric Pulse Wave Rings on Speaking */}
      {isSpeaking && (
        <>
          <div
            className="absolute -inset-2.5 rounded-full border-2 border-indigo-400/30 animate-ping"
            style={{ animationDuration: "2.5s" }}
          />
          <div
            className="absolute -inset-5 rounded-full border border-indigo-500/15 animate-ping"
            style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
          />
        </>
      )}

      {/* Portrait Container */}
      <div
        className={`relative z-10 ${dimensionClass} rounded-2xl p-1 ${
          isDark
            ? "bg-gradient-to-b from-indigo-400/40 via-white/10 to-transparent shadow-xl border border-white/15"
            : "bg-gradient-to-b from-indigo-100 via-slate-50 to-white shadow-md border border-slate-200/80"
        } transition-all duration-500 ${isSpeaking ? "scale-105" : ""}`}
      >
        <div
          className={`w-full h-full rounded-2xl ${
            isDark
              ? "bg-gradient-to-b from-[#141624] via-[#0E101A] to-[#080910]"
              : "bg-gradient-to-b from-[#EDF2F7] via-[#F8FAFC] to-[#FFFFFF]"
          } flex items-center justify-center overflow-hidden shadow-inner relative group`}
        >
          {isMale ? (
            <ShubhInterviewerGraphic
              isSpeaking={isSpeaking}
              isThinking={isThinking}
              isDark={isDark}
            />
          ) : (
            <RachelInterviewerGraphic
              isSpeaking={isSpeaking}
              isThinking={isThinking}
              isDark={isDark}
            />
          )}

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
};

// Ultra-Detailed, Realistic & Animated SVG Portrait: Candidate (You) with real mic frequency binding
export const CandidateGraphic = ({ isSpeaking, isDark = false, frequencyBins = [] }) => (
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
            <linearGradient id="candSkinNewAi" x1="100" y1="35" x2="100" y2="125" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFE6D4" />
              <stop offset="45%" stopColor="#F7CBAE" />
              <stop offset="100%" stopColor="#E2A682" />
            </linearGradient>
            <linearGradient id="candJawShadowNewAi" x1="100" y1="75" x2="100" y2="118" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D98A62" stopOpacity="0" />
              <stop offset="100%" stopColor="#B35F35" stopOpacity="0.55" />
            </linearGradient>

            {/* Hair Gradients */}
            <linearGradient id="candHairNewAi" x1="60" y1="15" x2="140" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2B2623" />
              <stop offset="50%" stopColor="#1A1614" />
              <stop offset="100%" stopColor="#0A0807" />
            </linearGradient>

            {/* Jacket & Shirt */}
            <linearGradient id="candJacketNewAi" x1="40" y1="130" x2="160" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1F2630" />
              <stop offset="50%" stopColor="#11171F" />
              <stop offset="100%" stopColor="#070A0E" />
            </linearGradient>
            <linearGradient id="candInnerNewAi" x1="100" y1="130" x2="100" y2="180" gradientUnits="userSpaceOnUse">
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
            <path d="M26 195C26 156 50 138 82 135L100 152L118 135C150 138 174 156 174 195V200H26V195Z" fill="url(#candJacketNewAi)" />
            {/* T-Shirt */}
            <path d="M82 135L100 172L118 135H82Z" fill="url(#candInnerNewAi)" />

            {/* NECK */}
            <path d="M84 96V132C84 140 91 145 100 145C109 145 116 140 116 132V96H84Z" fill="url(#candSkinNewAi)" />
            <path d="M84 104C92 118 108 118 116 104V130C116 138 109 143 100 143C91 143 84 138 84 130V104Z" fill="url(#candJawShadowNewAi)" />

            {/* EARS */}
            <path d="M62 72C59 72 57 78 58 84C59 90 62 93 65 92L66 78L62 72Z" fill="#F7CBAE" />
            <path d="M138 72C141 72 143 78 142 84C141 90 138 93 135 92L134 78L138 72Z" fill="#F7CBAE" />

            {/* FACE SHAPE */}
            <path d="M66 56C66 36 78 26 100 26C122 26 134 36 134 56C134 80 124 106 100 106C76 106 66 80 66 56Z" fill="url(#candSkinNewAi)" />
            <path d="M70 86C78 100 89 106 100 106C111 106 122 100 130 86C124 98 113 104 100 104C87 104 76 98 70 86Z" fill="url(#candJawShadowNewAi)" />

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
            <path d="M64 50C62 34 72 16 100 14C128 16 138 34 136 50C130 28 118 20 100 20C82 20 70 28 64 50Z" fill="url(#candHairNewAi)" />
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
