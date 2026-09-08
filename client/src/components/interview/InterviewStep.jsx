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
  selectedRole,
  user,
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
  onSkipQuestion,
  onAbandon,
  onAbandonInterview,
  onStopAudio,
}) => {
  const handleEndMeeting = onAbandon || onAbandonInterview;
  const handleSkip = onSkip || onSkipQuestion;
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
          bgClass: "bg-indigo-500/10 border-indigo-500/20",
          iconClass: "text-indigo-400 animate-spin",
          textClass: "text-indigo-300",
        };
      case "asking":
        return {
          icon: Volume2,
          text: "Interviewer is speaking...",
          bgClass: "bg-blue-500/15 border-blue-500/30",
          iconClass: "text-blue-400 animate-pulse",
          textClass: "text-blue-300",
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
          bgClass: "bg-indigo-500/10 border-indigo-500/20",
          iconClass: "text-indigo-400 animate-pulse",
          textClass: "text-indigo-300",
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
                  <RefreshCw className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 font-mono text-[11px] hidden sm:inline">
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
            onClick={handleEndMeeting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/25 text-red-700 dark:text-red-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
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

      {/* CENTER EXECUTIVE VIDEO/VOICE STAGE (Single Focused Interviewer Studio) */}
      <main className="flex-1 flex flex-col justify-center my-6 gap-6 px-6 sm:px-10 max-w-4xl mx-auto w-full">
        {/* INTERVIEWER STUDIO CARD */}
        <div
            className={`relative rounded-3xl bg-white dark:bg-[#121420] border transition-all duration-500 p-6 sm:p-8 flex flex-col justify-between min-h-[340px] shadow-lg dark:shadow-2xl ${
              isAISpeaking
                ? "border-indigo-500 shadow-[0_4px_30px_rgba(99,102,241,0.2)] dark:shadow-[0_0_50px_rgba(99,102,241,0.2)] ring-2 ring-indigo-500/20 dark:ring-indigo-500/30"
                : isCandidateSpeaking
                  ? "border-emerald-500 shadow-[0_4px_30px_rgba(16,185,129,0.2)] dark:shadow-[0_0_50px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/20 dark:ring-emerald-500/30"
                  : "border-slate-200/80 dark:border-white/10"
            }`}
          >
            {/* Card top: Speaker tag & Status */}
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
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200">
                  {currentInterviewer.name} • {currentInterviewer.title}
                </span>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all shadow-sm ${
                  isAISpeaking
                    ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-bold"
                    : isCandidateSpeaking
                      ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-bold animate-pulse"
                      : interviewPhase === "greeting"
                        ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                        : interviewPhase === "processing"
                          ? "bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
                          : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/5"
                }`}
              >
                {isAISpeaking
                  ? "Interviewer Speaking..."
                  : isCandidateSpeaking
                    ? "Your Turn • Mic Active"
                    : interviewPhase === "greeting"
                      ? "Starting Interview..."
                      : interviewPhase === "processing"
                        ? "Synthesizing Analysis..."
                        : "Listening"}
              </span>
            </div>

            {/* Card Center: Bespoke Vector Graphic with Dynamic Studio Glow */}
            <div className="flex flex-col items-center justify-center my-6">
              <InterviewerGraphic
                isSpeaking={isAISpeaking}
                isThinking={interviewPhase === "processing"}
                isDark={isDarkMode}
                voice={selectedVoice}
              />

              <div className="text-center mt-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{currentInterviewer.name}</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">{currentInterviewer.title}</p>
              </div>
            </div>

            {/* Card Bottom: Live Multi-State Audio Equalizer & Mic Controls */}
            <div className="flex items-center justify-between gap-3 h-12 bg-slate-50 dark:bg-black/25 rounded-2xl px-5 border border-slate-200/80 dark:border-white/5">
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
                  <span className="text-xs font-semibold ml-3 text-indigo-600 dark:text-indigo-400">
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
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold ml-1.5">
                      Your Microphone is Live • Speak freely
                    </span>
                  </div>

                  <button
                    onClick={onStopRecording}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Done Speaking</span>
                    <span>✓</span>
                  </button>
                </>
              ) : interviewPhase === "processing" ? (
                <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-semibold w-full">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating your technical response...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-gray-400 w-full opacity-60">
                  <div className="flex items-center gap-1">
                    {[4, 4, 4, 4, 4, 4, 4, 4].map((_, i) => (
                      <div key={i} className="w-1 h-1.5 rounded-full bg-slate-300 dark:bg-gray-600" />
                    ))}
                  </div>
                  <span className="font-medium ml-1">Standing by</span>
                </div>
              )}
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
            onClick={handleSkip}
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
