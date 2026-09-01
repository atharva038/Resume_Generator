import React from "react";
import { INTERVIEWER_VOICES } from "./constants";

// Ultra-Detailed, Realistic & Animated SVG Portrait: Shubh (Senior Technical Interviewer - Male)
export const ShubhInterviewerGraphic = ({ isSpeaking, isThinking, isDark = false }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>{`
        @keyframes shubhBlink {
          0%, 88%, 94%, 100% { transform: scaleY(1); }
          91% { transform: scaleY(0.08); }
        }
        @keyframes shubhGaze {
          0%, 100% { transform: translate(0px, 0px); }
          20% { transform: translate(-1px, 0.5px); }
          45% { transform: translate(0px, 0px); }
          65% { transform: translate(1.2px, -0.5px); }
          85% { transform: translate(0px, 0px); }
        }
        @keyframes shubhSpeechCadence {
          0%, 100% { transform: scale(1, 0.4); }
          20% { transform: scale(1.06, 1.35); }
          40% { transform: scale(0.95, 0.55); }
          60% { transform: scale(1.08, 1.45); }
          80% { transform: scale(0.98, 0.7); }
        }
        @keyframes shubhMicGlow {
          0%, 100% { r: 3.5; opacity: 0.85; filter: drop-shadow(0 0 3px #818CF8); }
          50% { r: 4.8; opacity: 1; filter: drop-shadow(0 0 8px #6366F1); }
        }
        @keyframes shubhInhale {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1.2px); }
        }
        .shubh-blink {
          transform-origin: 100px 65px;
          animation: shubhBlink 5.2s infinite ease-in-out;
        }
        .shubh-pupil-gaze {
          animation: shubhGaze 6.8s infinite ease-in-out;
        }
        .shubh-cadenced-mouth {
          transform-origin: 100px 95px;
          animation: shubhSpeechCadence 0.42s infinite ease-in-out;
        }
        .shubh-mic-pulse {
          animation: shubhMicGlow 1.4s infinite ease-in-out;
        }
        .shubh-breathing {
          animation: shubhInhale 5.2s infinite ease-in-out;
        }
      `}</style>

      {/* Male Skin Tone Gradients */}
      <linearGradient id="shubhSkinGrad" x1="100" y1="30" x2="100" y2="130" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E6A582" />
        <stop offset="45%" stopColor="#D48B63" />
        <stop offset="100%" stopColor="#B3653C" />
      </linearGradient>
      <linearGradient id="shubhJawShadow" x1="100" y1="75" x2="100" y2="125" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B3653C" stopOpacity="0" />
        <stop offset="100%" stopColor="#7E3A19" stopOpacity="0.65" />
      </linearGradient>

      {/* Hair Gradients (Textured Fade) */}
      <linearGradient id="shubhHairGrad" x1="50" y1="12" x2="150" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E1916" />
        <stop offset="60%" stopColor="#120D0A" />
        <stop offset="100%" stopColor="#080604" />
      </linearGradient>
      <linearGradient id="shubhHairShine" x1="70" y1="14" x2="130" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3E3028" />
        <stop offset="100%" stopColor="#1E1916" stopOpacity="0" />
      </linearGradient>

      {/* Eye Gradients */}
      <radialGradient id="shubhIrisGrad" cx="0.4" cy="0.4" r="0.6">
        <stop offset="0%" stopColor="#5A341A" />
        <stop offset="60%" stopColor="#321A0A" />
        <stop offset="100%" stopColor="#100702" />
      </radialGradient>

      {/* Suiting */}
      <linearGradient id="shubhBlazerGrad" x1="40" y1="130" x2="160" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E2640" />
        <stop offset="60%" stopColor="#141B2D" />
        <stop offset="100%" stopColor="#0A0E18" />
      </linearGradient>
      <linearGradient id="shubhLapelsGrad" x1="70" y1="138" x2="130" y2="195" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2B3658" />
        <stop offset="100%" stopColor="#171E32" />
      </linearGradient>
      <linearGradient id="shubhShirtGrad" x1="100" y1="135" x2="100" y2="185" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>

    {/* BACKGROUND AMBIENT DOME */}
    <circle cx="100" cy="100" r="92" fill={isDark ? "#0E101A" : "#EEF2F6"} />
    <circle cx="100" cy="85" r="72" fill={isDark ? "#181D33" : "#E2E8F0"} fillOpacity={isDark ? "0.4" : "0.6"} />

    {/* BREATHING AVATAR BODY */}
    <g className="shubh-breathing">
      {/* SHOULDERS & BLAZER (Back) */}
      <path d="M22 196C22 152 48 135 80 132L100 152L120 132C152 135 178 152 178 196V200H22V196Z" fill="url(#shubhBlazerGrad)" />

      {/* INNER CREW-NECK TEE */}
      <path d="M80 132C80 132 88 156 100 156C112 156 120 132 120 132V175H80V132Z" fill="url(#shubhShirtGrad)" />
      <path d="M84 132C88 144 112 144 116 132" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* NECK & SHADOW */}
      <path d="M84 94V134C84 142 91 148 100 148C109 148 116 142 116 134V94H84Z" fill="url(#shubhSkinGrad)" />
      <path d="M84 102C91 116 109 116 116 102V132C116 140 109 146 100 146C91 146 84 140 84 132V102Z" fill="url(#shubhJawShadow)" />

      {/* BLAZER LAPELS & STRUCTURE */}
      <path d="M46 144L78 132L94 182L62 198C50 192 46 172 46 144Z" fill="url(#shubhLapelsGrad)" />
      <path d="M154 144L122 132L106 182L138 198C150 192 154 172 154 144Z" fill="url(#shubhLapelsGrad)" />

      {/* EARS */}
      <path d="M62 70C59 70 57 76 58 84C59 90 62 94 65 92L67 78L62 70Z" fill="#D48B63" />
      <path d="M138 70C141 70 143 76 142 84C141 90 138 94 135 92L133 78L138 70Z" fill="#D48B63" />

      {/* JAWLINE & HEAD STRUCTURE (Strong, masculine jaw) */}
      <path d="M66 50C66 32 78 24 100 24C122 24 134 32 134 50C134 78 124 108 100 108C76 108 66 78 66 50Z" fill="url(#shubhSkinGrad)" />
      <path d="M69 84C77 100 88 108 100 108C112 108 123 100 131 84C123 98 112 106 100 106C88 106 77 98 69 84Z" fill="url(#shubhJawShadow)" />

      {/* GROOMED BEARD / STUBBLE (Natural stylish Indian facial hair) */}
      <path d="M68 76C68 96 80 110 100 110C120 110 132 96 132 76C131 86 126 98 116 104C108 108 92 108 84 104C74 98 69 86 68 76Z" fill="#1A120D" fillOpacity="0.45" />
      <path d="M88 88C92 85 97 86 100 87C103 86 108 85 112 88C108 91 104 90 100 90.5C96 90 92 91 88 88Z" fill="#1A120D" fillOpacity="0.55" />

      {/* EYEBROWS (Defined, masculine) */}
      <path d="M72 49C78 44 87 45 93 49" stroke="#140E0A" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M128 49C122 44 113 45 107 49" stroke="#140E0A" strokeWidth="2.8" strokeLinecap="round" />

      {/* EYES WITH BLINK & GAZE */}
      <g className="shubh-blink">
        {/* Left Eye */}
        <path d="M74 61C78 56 87 56 92 61" stroke="#100A06" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M75 61C79 66 86 66 91 61" fill="#FFFFFF" />
        <g className="shubh-pupil-gaze">
          <circle cx="83.5" cy="61" r="4.1" fill="url(#shubhIrisGrad)" />
          <circle cx="83.5" cy="61" r="2.2" fill="#0A0502" />
          <circle cx="82" cy="59.5" r="1.2" fill="#FFFFFF" />
          <circle cx="85" cy="62.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
        </g>

        {/* Right Eye */}
        <path d="M108 61C113 56 122 56 126 61" stroke="#100A06" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M109 61C114 66 121 66 125 61" fill="#FFFFFF" />
        <g className="shubh-pupil-gaze">
          <circle cx="116.5" cy="61" r="4.1" fill="url(#shubhIrisGrad)" />
          <circle cx="116.5" cy="61" r="2.2" fill="#0A0502" />
          <circle cx="115" cy="59.5" r="1.2" fill="#FFFFFF" />
          <circle cx="118" cy="62.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
        </g>
      </g>

      {/* NOSE */}
      <path d="M100 52V73L95 76H105" stroke="#9A502A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* CONVERSATIONAL SPEAKING MOUTH */}
      {isSpeaking ? (
        <g className="shubh-cadenced-mouth">
          <path d="M89 93C93 90 97 91 100 92C103 91 107 90 111 93C109 99 91 99 89 93Z" fill="#C45656" />
          <ellipse cx="100" cy="95.5" rx="7.5" ry="4" fill="#3B0712" />
          <path d="M93 93.5H107C105 95 95 95 93 93.5Z" fill="#FFFFFF" />
          <path d="M91 96.5C94 99.5 106 99.5 109 96.5" stroke="#9F1239" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        <g>
          <path d="M90 93C93 91 97 92 100 93C103 92 107 91 110 93C108 96.5 92 96.5 90 93Z" fill="#C45656" />
          <path d="M91 94C94 96 106 96 109 94" stroke="#7A132B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M94.5 94.2C96.5 95 103.5 95 105.5 94.2" fill="#FFFFFF" />
        </g>
      )}

      {/* CONTEMPORARY INDIAN MALE FADE / POMPADOUR HAIRSTYLE */}
      <path d="M64 52C62 30 76 14 100 12C124 14 138 30 136 52C130 24 116 18 100 18C84 18 70 24 64 52Z" fill="url(#shubhHairGrad)" />
      <path d="M62 46C64 26 78 12 100 10C122 12 136 26 138 46C134 22 120 16 100 16C80 16 66 22 62 46Z" fill="url(#shubhHairGrad)" />
      <path d="M68 40C76 26 90 18 106 18C124 18 132 26 134 40C128 28 116 22 102 22C84 22 74 28 68 40Z" fill="url(#shubhHairShine)" />
      <path d="M64 48C63 56 63 68 66 74C67 76 68 74 67 70C65 64 65 54 66 48Z" fill="url(#shubhHairGrad)" />
      <path d="M136 48C137 56 137 68 134 74C133 76 132 74 133 70C135 64 135 54 134 48Z" fill="url(#shubhHairGrad)" />

      {/* STUDIO HEADSET & GLOWING MIC */}
      <path d="M61 62C61 34 76 18 100 18C124 18 139 34 139 62" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <rect x="56" y="58" width="5.5" height="16" rx="2.75" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
      <path d="M59 70C54 88 60 102 82 98" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="83" cy="98" r="3.5" fill="#6366F1" stroke="#A5B4FC" strokeWidth="1.5" className={isSpeaking ? "shubh-mic-pulse" : ""} />
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
export const InterviewerGraphic = ({ isSpeaking, isThinking, isDark = false, voice = "shubh" }) => {
  const voiceMeta = INTERVIEWER_VOICES[voice] || INTERVIEWER_VOICES.shubh;
  const isMale = voiceMeta.gender === "male";

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient Studio Lighting Glow */}
      <div
        className={`absolute -inset-5 rounded-full transition-all duration-700 blur-2xl ${
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
            className="absolute -inset-3 rounded-full border-2 border-indigo-400/30 animate-ping"
            style={{ animationDuration: "2.5s" }}
          />
          <div
            className="absolute -inset-6 rounded-full border border-indigo-500/15 animate-ping"
            style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
          />
        </>
      )}

      {/* Portrait Container */}
      <div
        className={`relative z-10 w-36 h-36 rounded-2xl p-1 ${
          isDark
            ? "bg-gradient-to-b from-indigo-400/40 via-white/10 to-transparent shadow-2xl border border-white/15"
            : "bg-gradient-to-b from-indigo-100 via-slate-50 to-white shadow-xl border border-slate-200/80"
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
