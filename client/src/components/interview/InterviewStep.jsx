import React from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import {
  Sparkles,
  Volume2,
  Mic,
  Loader2,
  CheckCircle,
  Award,
  ShieldCheck,
  Zap,
  Radio,
  RefreshCw,
  Sun,
  Moon,
  Clock,
  PhoneOff,
  MicOff,
  SkipForward,
  ChevronRight,
} from "lucide-react";
import { INTERVIEWER_VOICES } from "./constants";
import { InterviewerGraphic, CandidateGraphic } from "./InterviewerGraphic";

// Interview Step Component
export const InterviewStep = ({
  currentQuestion,
  progress,
  elapsedTime,
  formatTime,
  interviewDuration,
  answer,
  setAnswer,
  evaluation,
  selectedMode,
  isRecording,
  isSubmitting,
  isPlayingAudio,
  isSpeaking,
  voiceEngine = "auto",
  onSetVoiceEngine,
  voiceProviders,
  selectedVoice = "shubh",
  isProduction = false,
  interviewPhase,
  conversationPhase,
  aiMessage,
  isMuted,
  micFrequencyBins = [],
  bargeInNotice = false,
  onToggleMute,
  onSubmitAnswer,
  onStartRecording,
  onStopRecording,
  onSkip,
  onAbandon,
  onStopAudio,
}) => {
  const currentInterviewer =
    INTERVIEWER_VOICES[selectedVoice] || INTERVIEWER_VOICES.shubh;

  // Calculate remaining time for live mode
  const totalSeconds = interviewDuration * 60;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedTime);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const isTimeWarning = remainingSeconds <= 120 && remainingSeconds > 0;

  // Helper to get phase status message - more natural for live mode
  const getPhaseStatus = () => {
    if (selectedMode !== "live") return null;

    switch (interviewPhase) {
      case "greeting":
        return {
          icon: Sparkles,
          text: "Preparing your interview session...",
          bgClass: "bg-purple-500/10 border-purple-500/20",
          iconClass: "text-purple-400 animate-spin",
          textClass: "text-purple-300",
        };
      case "asking":
        return {
          icon: Volume2,
          text: "Interviewer is speaking...",
          bgClass: "bg-purple-500/15 border-purple-500/30",
          iconClass: "text-purple-400 animate-pulse",
          textClass: "text-purple-300",
        };
      case "waiting":
        return {
          icon: Mic,
          text: "Listening to your answer...",
          bgClass: "bg-emerald-500/15 border-emerald-500/30",
          iconClass: "text-emerald-400 animate-pulse",
          textClass: "text-emerald-300",
        };
      case "processing":
        return {
          icon: Loader2,
          text: "Processing response...",
          bgClass: "bg-blue-500/15 border-blue-500/30",
          iconClass: "text-blue-400 animate-spin",
          textClass: "text-blue-300",
        };
      case "evaluation":
        return {
          icon: CheckCircle,
          text: "Evaluation complete",
          bgClass: "bg-green-500/15 border-green-500/30",
          iconClass: "text-green-400",
          textClass: "text-green-300",
        };
      case "closing":
        return {
          icon: Award,
          text: "Interview concluding...",
          bgClass: "bg-purple-500/10 border-purple-500/20",
          iconClass: "text-purple-400 animate-pulse",
          textClass: "text-purple-300",
        };
      default:
        return null;
    }
  };

  const phaseStatus = getPhaseStatus();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const isAISpeaking = isPlayingAudio;
  const isCandidateSpeaking = isRecording && interviewPhase === "waiting";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090A10] text-slate-800 dark:text-gray-100 flex flex-col font-sans select-none transition-colors duration-300">
      {/* TOP STATUS BAR */}
      <header className="flex items-center justify-between gap-4 py-4 px-6 sm:px-10 border-b border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#11131E] shadow-sm">
        {/* Left: Meeting context */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                {currentQuestion?.category || "Technical Engineering Round"}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                LIVE INTERVIEW
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Evaluator: {currentInterviewer.name} ({currentInterviewer.title}) • Question {progress.current} of {progress.total}
            </p>
          </div>
        </div>

        {/* Center: Progress tracker */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: progress.total }, (_, i) => {
              const qNum = i + 1;
              return (
                <div
                  key={qNum}
                  className={`h-1.5 rounded-full transition-all ${
                    qNum === progress.current
                      ? "w-8 bg-indigo-600 shadow-sm shadow-indigo-500/50"
                      : qNum < progress.current
                        ? "w-4 bg-indigo-300 dark:bg-indigo-400/40"
                        : "w-4 bg-slate-200 dark:bg-white/10"
                  }`}
                />
              );
            })}
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-gray-400">
            Q{progress.current}/{progress.total}
          </span>
        </div>

        {/* Right: Voice Engine Pill & Timer & Theme Toggle & End Meeting */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Voice Engine Live Switcher Pill (Dev Mode Only) */}
          {!isProduction && onSetVoiceEngine && (
            <button
              onClick={() => {
                const nextEngine =
                  voiceEngine === "sarvam"
                    ? "local"
                    : voiceEngine === "local"
                    ? "auto"
                    : "sarvam";
                onSetVoiceEngine(nextEngine);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all shadow-sm"
              title={`Click to switch Voice Engine (Current: ${voiceEngine.toUpperCase()})`}
            >
              {voiceEngine === "sarvam" ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-mono text-[11px] hidden sm:inline">
                    Sarvam
                  </span>
                </>
              ) : voiceEngine === "local" ? (
                <>
                  <Radio className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-indigo-700 dark:text-indigo-300 font-mono text-[11px] hidden sm:inline">
                    Local
                  </span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  <span className="text-purple-700 dark:text-purple-300 font-mono text-[11px] hidden sm:inline">
                    Auto
                  </span>
                </>
              )}
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#141622] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-200 shadow-sm">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-mono font-semibold tracking-wider">
              {remainingMinutes}:{String(remainingSeconds % 60).padStart(2, "0")} remaining
            </span>
          </div>

          <button
            onClick={onAbandon}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/25 text-red-700 dark:text-red-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            title="Leave Interview"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Meeting</span>
          </button>
        </div>
      </header>

      {/* Barge-In Interruption Live Feedback Notification Banner */}
      {bargeInNotice && (
        <div className="mx-6 sm:mx-10 mt-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Interruption Detected: {currentInterviewer.name} yielded speaking to listen to your response.</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded border border-amber-500/30">Hands-Free Barge-In</span>
        </div>
      )}

      {/* CENTER EXECUTIVE VIDEO/VOICE STAGE (Split Participant Cards) */}
      <main className="flex-1 flex flex-col justify-center my-6 gap-6 px-6 sm:px-10 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* 1. INTERVIEWER PARTICIPANT CARD */}
          <div
            className={`relative rounded-2xl bg-white dark:bg-[#121420] border transition-all duration-500 p-6 flex flex-col justify-between min-h-[300px] shadow-md dark:shadow-2xl ${
              isAISpeaking
                ? "border-indigo-500 shadow-[0_4px_24px_rgba(99,102,241,0.18)] dark:shadow-[0_0_40px_rgba(99,102,241,0.15)] ring-2 ring-indigo-500/20 dark:ring-indigo-500/30"
                : "border-slate-200/80 dark:border-white/10"
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
                <span className="text-xs font-bold text-slate-800 dark:text-gray-200">
                  {currentInterviewer.name} • {currentInterviewer.title}
                </span>
              </div>

              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                  isAISpeaking
                    ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                    : interviewPhase === "greeting"
                      ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                      : interviewPhase === "processing"
                        ? "bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/5"
                }`}
              >
                {isPlayingAudio || interviewPhase === "asking"
                  ? "Speaking..."
                  : interviewPhase === "greeting"
                    ? "Starting Interview..."
                    : interviewPhase === "processing"
                      ? "Synthesizing Analysis..."
                      : "Listening"}
              </span>
            </div>

            {/* Card Center: Bespoke Vector Graphic */}
            <div className="flex flex-col items-center justify-center my-4">
              <InterviewerGraphic
                isSpeaking={isAISpeaking}
                isThinking={interviewPhase === "processing"}
                isDark={isDarkMode}
                voice={selectedVoice}
              />

              <div className="text-center mt-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{currentInterviewer.name}</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">{currentInterviewer.title}</p>
              </div>
            </div>

            {/* Card Bottom: Clean Soundwave Equalizer */}
            <div className="flex items-center justify-center gap-1.5 h-9 bg-slate-50 dark:bg-black/25 rounded-xl px-4 border border-slate-200/80 dark:border-white/5">
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
              ) : interviewPhase === "processing" ? (
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating technical response...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 opacity-50">
                  {[4, 4, 4, 4, 4, 4, 4, 4].map((_, i) => (
                    <div key={i} className="w-1 h-1.5 rounded-full bg-slate-300 dark:bg-gray-600" />
                  ))}
                  <span className="text-[11px] font-medium ml-1.5 text-slate-400 dark:text-gray-400">Standing by</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. CANDIDATE PARTICIPANT CARD WITH REAL MICROPHONE WAVEFORM BINDING */}
          <div
            className={`relative rounded-2xl bg-white dark:bg-[#121420] border transition-all duration-500 p-6 flex flex-col justify-between min-h-[300px] shadow-md dark:shadow-2xl ${
              isCandidateSpeaking
                ? "border-emerald-500 shadow-[0_4px_24px_rgba(16,185,129,0.18)] dark:shadow-[0_0_40px_rgba(16,185,129,0.15)] ring-2 ring-emerald-500/20 dark:ring-emerald-500/30"
                : "border-slate-200/80 dark:border-white/10"
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
                <span className="text-xs font-bold text-slate-800 dark:text-gray-200">
                  Candidate (You)
                </span>
              </div>

              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                  isCandidateSpeaking
                    ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-semibold"
                    : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/5"
                }`}
              >
                {isCandidateSpeaking ? "Your Turn • Mic Active" : "Muted / Listening"}
              </span>
            </div>

            {/* Card Center: Bespoke Vector Graphic bound to real audio frequency data */}
            <div className="flex flex-col items-center justify-center my-4">
              <CandidateGraphic
                isSpeaking={isCandidateSpeaking}
                isDark={isDarkMode}
                frequencyBins={micFrequencyBins}
              />

              <div className="text-center mt-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Full Stack Candidate</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">Microphone Input</p>
              </div>
            </div>

            {/* Card Bottom: Candidate Live Mic Equalizer reacting to real vocal volume */}
            <div className="flex items-center justify-between gap-3 h-10 bg-slate-50 dark:bg-black/25 rounded-xl px-4 border border-slate-200/80 dark:border-white/5">
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
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold ml-1">
                      Live Mic Input
                    </span>
                  </div>

                  <button
                    onClick={onStopRecording}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1"
                  >
                    <span>Done Speaking</span>
                    <span>✓</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-gray-400 mx-auto">
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Microphone will activate when interviewer finishes</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QUESTION & LIVE TRANSCRIPT CARD */}
        <div className="bg-white dark:bg-[#121420] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  Question {progress.current} • {currentQuestion?.type || "Technical Question"}
                </span>
                <span className="text-xs text-slate-400 dark:text-gray-400">Live Transcription</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base sm:text-lg leading-relaxed font-semibold">
                {interviewPhase === "processing"
                  ? `${currentInterviewer.name} is reviewing your answer and preparing the next question...`
                  : (aiMessage || currentQuestion?.text || "Welcome to the interview session. Preparing your first question...")}
              </p>

              {isRecording && interviewPhase === "waiting" && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Speak naturally into your microphone. Click Finish Answer when you are done.</span>
                  </div>
                  <button
                    onClick={onStopRecording}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 shrink-0"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Finish Answer</span>
                    <span>✓</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM FLOATING CONTROL DOCK WITH LIVE EQUALIZER */}
      <footer className="flex items-center justify-between gap-4 py-4 px-6 sm:px-10 border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#11131E] shadow-sm">
        {/* Live Reactive Audio Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-white dark:bg-[#141622] border-slate-200 dark:border-white/10 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${isAISpeaking ? "bg-indigo-600 dark:bg-indigo-400 animate-pulse" : isCandidateSpeaking ? "bg-emerald-600 dark:bg-emerald-400 animate-pulse" : "bg-slate-400 dark:bg-gray-500"}`} />
            
            {/* Dynamic Waveform Reactor */}
            {isAISpeaking ? (
              <div className="flex items-center gap-0.5 px-1">
                {[12, 20, 28, 16, 24, 14, 26, 18].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"
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
                  <div key={i} className="w-1 h-1 rounded-full bg-slate-300 dark:bg-gray-600" />
                ))}
              </div>
            )}

            <span className="text-xs font-semibold text-slate-700 dark:text-gray-300">
              {isAISpeaking
                ? "Interviewer is speaking"
                : isRecording
                  ? "Listening to candidate"
                  : interviewPhase === "processing"
                    ? "Evaluating response"
                    : "Session Ready"}
            </span>
          </div>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-3">
          {isRecording && (
            <button
              onClick={onStopRecording}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/40"
            >
              <Mic className="w-4 h-4" />
              <span>Finish Answer & Submit</span>
              <span>✓</span>
            </button>
          )}
          {isPlayingAudio && (
            <button
              onClick={onStopAudio}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-gray-300 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip Audio</span>
            </button>
          )}
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Skip Question</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
