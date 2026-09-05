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
import { InterviewerGraphic, CandidateGraphic } from "@/components/interview/InterviewerGraphic";

export default function InterviewPreviewPage() {
  // Playground state controls
  const [phase, setPhase] = useState("asking"); // "greeting" | "asking" | "waiting" | "processing" | "evaluation"
  const [sampleQuestionNum, setSampleQuestionNum] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState("shubh");
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
              onClick={() => setSelectedVoice("shubh")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                selectedVoice === "shubh"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              👨‍💼 Shubh (Male Lead)
            </button>
            <button
              onClick={() => setSelectedVoice("rachel")}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                selectedVoice === "rachel"
                  ? "bg-indigo-600 text-white shadow-sm font-semibold"
                  : isDarkMode ? "text-gray-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              👩‍💼 Rachel (Female Lead)
            </button>
          </div>

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
                Evaluator: {selectedVoice === "shubh" ? "Shubh (Senior Engineering Lead)" : "Rachel (Lead Engineering Assessor)"} • Question {sampleQuestionNum} of 5
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

        {/* CENTER VIDEO/VOICE STAGE (Single Focused Studio View) */}
        <main className="flex-1 flex flex-col justify-center my-6 gap-6 max-w-4xl mx-auto w-full">
          {/* INTERVIEWER PARTICIPANT CARD */}
          <div
            className={`relative rounded-3xl transition-all duration-500 p-6 sm:p-8 flex flex-col justify-between min-h-[340px] shadow-lg dark:shadow-2xl ${
              isDarkMode
                ? `bg-[#121420] border ${
                    isAISpeaking
                      ? "border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/30"
                      : isCandidateSpeaking
                        ? "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/30"
                        : "border-white/10"
                  }`
                : `bg-white border ${
                    isAISpeaking
                      ? "border-indigo-500 shadow-[0_4px_30px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/20"
                      : isCandidateSpeaking
                        ? "border-emerald-500 shadow-[0_4px_30px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/20"
                        : "border-slate-200/80"
                  }`
            }`}
          >
            {/* Card top: Speaker tag & Phase Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isAISpeaking
                      ? "bg-indigo-600 dark:bg-indigo-400 animate-pulse ring-4 ring-indigo-500/20"
                      : isCandidateSpeaking
                        ? "bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"
                        : "bg-slate-400 dark:bg-gray-500"
                  }`}
                />
                <span className={`text-xs sm:text-sm font-bold ${isDarkMode ? "text-gray-200" : "text-slate-800"}`}>
                  {selectedVoice === "shubh" ? "Shubh • Senior Engineering Lead" : "Rachel • Technical Interviewer"}
                </span>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all shadow-sm ${
                  isAISpeaking
                    ? isDarkMode
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold"
                      : "bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold"
                    : isCandidateSpeaking
                      ? isDarkMode
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold animate-pulse"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold animate-pulse"
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
                  ? "Interviewer Speaking..."
                  : phase === "greeting"
                    ? "Starting Interview..."
                    : phase === "waiting"
                      ? "Your Turn • Mic Active"
                      : phase === "processing"
                        ? "Synthesizing Analysis..."
                        : "Listening"}
              </span>
            </div>

            {/* Card Center: Bespoke Vector Graphic */}
            <div className="flex flex-col items-center justify-center my-6">
              <InterviewerGraphic
                isSpeaking={isAISpeaking}
                isThinking={phase === "processing"}
                isDark={isDarkMode}
                voice={selectedVoice}
              />

              <div className="text-center mt-4">
                <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {selectedVoice === "shubh" ? "Shubh" : "Rachel"}
                </h3>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
                  {selectedVoice === "shubh" ? "Senior Engineering Lead" : "Lead Engineering Assessor"}
                </p>
              </div>
            </div>

            {/* Card Bottom: Multi-State Live Equalizer & Mic Controls */}
            <div className={`flex items-center justify-between gap-3 h-12 rounded-2xl px-5 border ${isDarkMode ? "bg-black/25 border-white/5" : "bg-slate-50 border-slate-200/80"}`}>
              {isAISpeaking ? (
                <div className="flex items-center justify-center gap-1.5 w-full">
                  {[16, 28, 38, 22, 42, 28, 36, 18, 32, 16, 24, 34, 20, 30, 26].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse shadow-sm shadow-indigo-400"
                      style={{
                        height: `${h * 0.55}px`,
                        animationDuration: `${0.3 + (i % 3) * 0.15}s`,
                        animationDelay: `${i * 45}ms`,
                      }}
                    />
                  ))}
                  <span className={`text-xs font-semibold ml-3 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                    Interviewer Speaking
                  </span>
                </div>
              ) : isCandidateSpeaking ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                    <div className="flex items-center gap-1">
                      {(micFrequencyBins?.length ? micFrequencyBins : [12, 24, 16, 28, 14, 22, 16, 20, 14, 18]).map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-75 ease-out shadow-sm shadow-emerald-500/40"
                          style={{ height: `${Math.max(6, Math.min(34, h * 0.8))}px` }}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ${isDarkMode ? "text-emerald-300" : "text-emerald-700"} font-bold ml-1.5`}>
                      {isLiveMicActive ? "Live Audio Active • Speak freely" : "Microphone Active • Speak your answer"}
                    </span>
                  </div>

                  <button
                    onClick={() => setPhase("processing")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Done Speaking</span>
                    <span>✓</span>
                  </button>
                </>
              ) : phase === "processing" ? (
                <div className={`flex items-center justify-center gap-2 ${isDarkMode ? "text-amber-300" : "text-amber-700"} text-xs font-semibold w-full`}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating technical response...</span>
                </div>
              ) : (
                <div className={`flex items-center justify-center gap-2 text-xs ${isDarkMode ? "text-gray-400" : "text-slate-400"} w-full opacity-60`}>
                  <div className="flex items-center gap-1">
                    {[4, 4, 4, 4, 4, 4, 4, 4].map((_, i) => (
                      <div key={i} className={`w-1 h-1.5 rounded-full ${isDarkMode ? "bg-gray-600" : "bg-slate-300"}`} />
                    ))}
                  </div>
                  <span className="font-medium ml-1">Standing by</span>
                </div>
              )}
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
