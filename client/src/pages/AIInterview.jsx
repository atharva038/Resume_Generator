import {useState, useEffect, useCallback, useRef} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {useAuth} from "@/context/AuthContext";
import {resumeAPI} from "@/api/api";
import interviewAPI from "@/api/interview.api";
import {useDarkMode} from "@/context/DarkModeContext";
import {
  Mic,
  MicOff,
  MessageSquare,
  Play,
  ChevronRight,
  Clock,
  Target,
  Award,
  BookOpen,
  Briefcase,
  Code,
  Users,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  XCircle,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2,
  FileText,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Star,
  User,
  Bot,
  PhoneOff,
  Timer,
  Radio,
  History,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";

// Interview type icons
const typeIcons = {
  "resume-based": FileText,
  "job-description": Briefcase,
  technical: Code,
  behavioral: Users,
  mixed: Sparkles,
};

// Conversation phases for natural interview flow
const CONVERSATION_PHASES = {
  IDLE: "idle",
  INTRODUCTION: "introduction",
  WARM_UP: "warm_up",
  CORE_INTERVIEW: "core_interview",
  WRAP_UP: "wrap_up",
  COMPLETED: "completed",
};

// Human Voice Activity & Silence detection settings (Tuned for fan/ambient noise resilience)
const SILENCE_THRESHOLD = 32; // Audio level below this is considered silence (avoids fan/AC false triggers)
const VOCAL_SPEECH_THRESHOLD = 38; // Vocal presence required to confirm user is speaking
const SILENCE_DURATION = 2200; // 2.2 seconds of silence to automatically end recording
const MIN_RECORDING_DURATION = 1800; // 1.8s minimum recording duration
const EXTENDED_SILENCE_DURATION = 12000; // 12 seconds - user hasn't said anything at all
const MAX_WAITING_SILENCE = 16000; // 16 seconds - max time to wait before prompting again

const AIInterview = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  // State
  const [config, setConfig] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("setup"); // setup, interview, result

  // Setup state
  const [selectedType, setSelectedType] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("mid");
  const [selectedMode, setSelectedMode] = useState("text");
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewDuration, setInterviewDuration] = useState(10); // Duration in minutes

  // Interview state
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [progress, setProgress] = useState({current: 0, total: 10});

  // Turn-based interview phase state
  // Phases: 'idle' -> 'asking' -> 'waiting' -> 'processing' -> 'evaluation' -> 'asking'
  const [interviewPhase, setInterviewPhase] = useState("idle");
  // idle: No interview in progress or completed
  // asking: AI is asking/speaking question
  // waiting: Waiting for user response
  // processing: Processing/analyzing user's answer
  // evaluation: Showing evaluation feedback

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [serverTtsAvailable, setServerTtsAvailable] = useState(false); // Chatterbox running?
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRef, setAudioRef] = useState(null);
  const audioElementRef = useRef(null);
  const speechRunRef = useRef(0);
  const speechTimeoutsRef = useRef(new Set());
  const [isMuted, setIsMuted] = useState(false); // Mute AI speech
  const isMutedRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // AI is currently speaking (even if muted)
  const [isTestingVoice, setIsTestingVoice] = useState(false); // Testing voice

  // Result state
  const [result, setResult] = useState(null);

  // Timer state
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Natural conversation state for live mode
  const [conversationPhase, setConversationPhase] = useState(
    CONVERSATION_PHASES.IDLE
  );
  const [conversationHistory, setConversationHistory] = useState([]);
  const [aiMessage, setAiMessage] = useState(""); // Current AI message being displayed
  const [questionCount, setQuestionCount] = useState(0);

  // Audio analysis refs for silence detection & real-time waveform visualization
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceStartRef = useRef(null);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const silenceCheckIntervalRef = useRef(null);
  const hasUserSpokenRef = useRef(false); // Track if user has spoken at all during this recording
  const silencePromptCountRef = useRef(0); // Track how many times we've prompted for silence
  const startRecordingRef = useRef(null); // Stable ref for startRecording to avoid stale closures

  // Live real-time audio waveform binding and barge-in interruption detection
  const [micFrequencyBins, setMicFrequencyBins] = useState([10, 10, 10, 10, 10, 10, 10, 10]);
  const [bargeInNotice, setBargeInNotice] = useState(false);
  const bargeInCountRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const speechConsecutiveFramesRef = useRef(0);

  // Session and question refs for immediate access in callbacks
  const sessionRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const startTimeRef = useRef(null);

  // Flag to track if interview is still active (prevents processing after end)
  const isInterviewActiveRef = useRef(false);

  // Helper functions to update both state and ref
  const updateSession = (newSession) => {
    setSession(newSession);
    sessionRef.current = newSession;
  };

  const updateCurrentQuestion = (newQuestion) => {
    setCurrentQuestion(newQuestion);
    currentQuestionRef.current = newQuestion;
    // Reset silence prompt counter when moving to a new question
    silencePromptCountRef.current = 0;
    hasUserSpokenRef.current = false;
  };

  // Load config and resumes on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [configRes, resumesRes, voiceRes, ttsRes] = await Promise.all([
          interviewAPI.getInterviewConfig(),
          resumeAPI.list(),
          interviewAPI
            .checkVoiceAvailability()
            .catch(() => ({data: {available: false}})),
          interviewAPI
            .checkTTSAvailability()
            .catch(() => ({data: {available: false}})),
        ]);

        const configData = configRes.data || configRes;
        const voiceData = voiceRes.data || voiceRes;
        const ttsData = ttsRes.data || ttsRes;
        const isVoiceAvailable =
          voiceData?.available || voiceData?.whisper_available || false;
        const isTtsAvailable =
          ttsData?.available ||
          ttsData?.providers?.browser?.available ||
          configData?.ttsAvailable ||
          false;

        setConfig(configData);
        setResumes(resumesRes.data.resumes || []);
        setVoiceAvailable(isVoiceAvailable);
        setTtsAvailable(isTtsAvailable);
        setServerTtsAvailable(
          ttsData?.providers?.chatterbox?.available || false
        );

        // Set defaults
        if (configData?.experienceLevels?.length > 0) {
          setSelectedLevel(configData.experienceLevels[2]?.id || "mid");
        }
      } catch (error) {
        console.error("Failed to load interview config:", error);
        toast.error("Failed to load interview settings");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // Preload browser speech synthesis voices (for TTS fallback)
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // Load voices - some browsers require this to be called
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log(
            `🗣️ Browser TTS voices loaded: ${voices.length} available`
          );
        }
      };

      // Load immediately and on voiceschanged event
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Timer effect with time-based phase transitions
  useEffect(() => {
    let interval;
    if (step === "interview" && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);

        // Time-based phase transitions for live mode
        if (selectedMode === "live") {
          const totalDurationSec = interviewDuration * 60;
          const remainingTime = totalDurationSec - elapsed;

          // Transition to wrap-up phase when ~2 minutes remaining
          if (
            remainingTime <= 120 &&
            remainingTime > 30 &&
            conversationPhase === CONVERSATION_PHASES.CORE_INTERVIEW
          ) {
            setConversationPhase(CONVERSATION_PHASES.WRAP_UP);
          }

          // Warning toast at 30 seconds remaining
          if (remainingTime === 30) {
            toast("30 seconds remaining! Wrapping up soon...", {
              icon: "⏰",
              duration: 5000,
            });
          }

          // Auto-complete when time is up (with 15s grace period for active recording/processing)
          if (
            remainingTime <= 0 &&
            conversationPhase !== CONVERSATION_PHASES.COMPLETED &&
            !isCompletingRef.current
          ) {
            const isActivelyWorking =
              isRecording ||
              interviewPhase === "processing" ||
              interviewPhase === "asking";

            // Allow up to 15s grace period if user is mid-recording or answer is processing
            if (!isActivelyWorking || remainingTime <= -15) {
              clearInterval(interval);
              handleCompleteInterview();
            }
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, startTime, selectedMode, interviewDuration, conversationPhase, isRecording, interviewPhase]);

  // Cleanup audio resources on unmount
  useEffect(() => {
    return () => {
      speechRunRef.current += 1;
      speechTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      speechTimeoutsRef.current.clear();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = "";
        audioElementRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close().catch(() => {});
        } catch (_) {}
        audioContextRef.current = null;
        analyserRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (silenceCheckIntervalRef.current) {
        clearInterval(silenceCheckIntervalRef.current);
      }
    };
  }, []);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate concise, fast-speaking introduction for live mode
  const generateIntroduction = useCallback(() => {
    const quickIntros = [
      `Hi, welcome! To start, could you give a brief introduction about yourself and your experience in ${selectedRole}?`,
      `Hello! Great to meet you. Let's begin with a quick introduction about your background in ${selectedRole}.`,
      `Hi there! Welcome to your interview. Tell me a bit about yourself and what you've been working on.`,
    ];

    return quickIntros[Math.floor(Math.random() * quickIntros.length)];
  }, [selectedRole]);

  const clearSpeechTimeouts = useCallback(() => {
    speechTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    speechTimeoutsRef.current.clear();
  }, []);

  const setManagedSpeechTimeout = useCallback((callback, delay) => {
    const timeoutId = setTimeout(() => {
      speechTimeoutsRef.current.delete(timeoutId);
      callback();
    }, delay);

    speechTimeoutsRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  const stopLocalAudio = useCallback(
    ({advanceToListening = false} = {}) => {
      speechRunRef.current += 1;
      clearSpeechTimeouts();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
        audioElementRef.current.src = "";
        audioElementRef.current = null;
      }

      setAudioRef(null);
      setIsPlayingAudio(false);
      setIsSpeaking(false);

      if (advanceToListening && isInterviewActiveRef.current) {
        setInterviewPhase("waiting");
        if (selectedMode === "live" && voiceAvailable) {
          setManagedSpeechTimeout(() => startRecordingRef.current?.(true), 300);
        }
      }
    },
    [clearSpeechTimeouts, selectedMode, setManagedSpeechTimeout, voiceAvailable]
  );

  // Real-time 60fps audio waveform sampling & Barge-In Interruption Detection
  useEffect(() => {
    let isRunning = true;

    const sampleAudioLevels = () => {
      if (!isRunning) return;

      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Extract 8 distributed frequency bands from low bass to high treble
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
          // Scale to height percentage (8px to 46px)
          const normalized = Math.max(8, Math.min(46, Math.round((avg / 255) * 40) + 8));
          levels.push(normalized);
        }

        setMicFrequencyBins(levels);

        // ⚡ Interruption Handling (Barge-In):
        // MUST only trigger when audio element is actually playing (not loading), after initial 600ms grace period,
        // and with real vocal presence (> 38) and volume (> 36) sustained for >= 5 frames (~350ms) to ignore fan/computer noise.
        const isActuallyPlaying =
          isPlayingAudio &&
          audioElementRef.current &&
          !audioElementRef.current.paused &&
          audioElementRef.current.currentTime > 0.6;

        const vocalEnergy = (levels[2] + levels[3] + levels[4] + levels[5]) / 4;

        if (isActuallyPlaying && isInterviewActiveRef.current && selectedMode === "live" && vocalEnergy > 38 && avgVol > 36) {
          bargeInCountRef.current += 1;
          if (bargeInCountRef.current >= 5) {
            console.log("⚡ Barge-in: Candidate interrupted AI speech. Yielding speaking turn.");
            bargeInCountRef.current = 0;
            setBargeInNotice(true);
            setTimeout(() => setBargeInNotice(false), 3000);
            stopLocalAudio({ advanceToListening: true });
          }
        } else {
          bargeInCountRef.current = Math.max(0, bargeInCountRef.current - 1);
        }
      } else {
        setMicFrequencyBins([8, 8, 8, 8, 8, 8, 8, 8]);
      }

      animFrameIdRef.current = requestAnimationFrame(sampleAudioLevels);
    };

    animFrameIdRef.current = requestAnimationFrame(sampleAudioLevels);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlayingAudio, isRecording, selectedMode, stopLocalAudio]);

  const splitSpeechIntoChunks = useCallback((text) => {
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    if (sentences.length <= 1) return [text];

    const chunks = [];
    let currentChunk = "";

    sentences.forEach((sentence) => {
      const nextChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
      if (nextChunk.length > 130 && currentChunk) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk = nextChunk;
      }
    });

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  }, []);

  // Speak text and then trigger callback (for continuous conversation flow)
  const speakAndListen = useCallback(
    async (text, onComplete) => {
      console.log(
        "🔊 speakAndListen called with:",
        text?.substring(0, 50) + "..."
      );

      // Cancel any in-progress audio to prevent overlapping playback
      stopLocalAudio();

      const speechRunId = speechRunRef.current + 1;
      speechRunRef.current = speechRunId;

      const isCurrentSpeech = () =>
        speechRunRef.current === speechRunId && isInterviewActiveRef.current;

      const completeSpeech = () => {
        if (!isCurrentSpeech()) return;
        setIsPlayingAudio(false);
        setIsSpeaking(false);
        if (onComplete) onComplete();
      };

      const playChatterboxChunk = async (chunkText) => {
        console.log(
          "📡 Calling Chatterbox TTS API (binary):",
          chunkText.substring(0, 50) + "..."
        );
        // Timeout after 3.5s so we instantly fall back to browser TTS if Chatterbox lags
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Chatterbox TTS timeout (> 3.5s)")), 3500)
        );
        const audioBlob = await Promise.race([
          interviewAPI.synthesizeSpeech(chunkText),
          timeoutPromise,
        ]);

        console.log("📡 TTS Response - Blob received:", {
          type: audioBlob?.type,
          size: audioBlob?.size,
          isBlob: audioBlob instanceof Blob,
        });

        if (!audioBlob || !(audioBlob instanceof Blob) || audioBlob.size === 0) {
          throw new Error("Empty Chatterbox audio response");
        }

        if (!isCurrentSpeech()) return;

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audioElementRef.current = audio;
        setAudioRef(audio);

        await new Promise((resolve, reject) => {
          audio.onplay = () => {
            if (isCurrentSpeech()) {
              setIsPlayingAudio(true);
              setIsSpeaking(true);
              setInterviewPhase("asking");
            }
          };

          audio.onended = () => {
            console.log("🔊 Chatterbox audio chunk ended");
            URL.revokeObjectURL(audioUrl);
            if (audioElementRef.current === audio) {
              audioElementRef.current = null;
              setAudioRef(null);
            }
            resolve();
          };

          audio.onerror = (e) => {
            console.error("❌ Chatterbox audio playback failed:", e);
            URL.revokeObjectURL(audioUrl);
            if (audioElementRef.current === audio) {
              audioElementRef.current = null;
              setAudioRef(null);
            }
            reject(new Error("Chatterbox audio playback failed"));
          };

          console.log("▶️ Playing Chatterbox audio chunk...");
          audio.play().catch(reject);
        });
      };

      const playChatterboxText = async () => {
        // For standard interview questions (< 450 chars), synthesize in a single pass with zero pauses
        if (text.length <= 450) {
          if (!isCurrentSpeech()) return;
          await playChatterboxChunk(text);
          completeSpeech();
          return;
        }

        // For longer text, pipeline chunks so next chunk is fetched in background during playback
        const chunks = splitSpeechIntoChunks(text);
        console.log(`🎙️ Chatterbox pipelined playback: ${chunks.length} chunk(s)`);

        let nextChunkPromise = interviewAPI.synthesizeSpeech(chunks[0]);

        for (let i = 0; i < chunks.length; i++) {
          if (!isCurrentSpeech()) return;

          const currentBlob = await nextChunkPromise;

          // Start pre-fetching the next chunk ahead of time
          if (i + 1 < chunks.length) {
            nextChunkPromise = interviewAPI.synthesizeSpeech(chunks[i + 1]);
          }

          if (!currentBlob || !(currentBlob instanceof Blob) || currentBlob.size === 0) {
            continue;
          }

          if (!isCurrentSpeech()) return;

          const audioUrl = URL.createObjectURL(currentBlob);
          const audio = new Audio(audioUrl);
          audioElementRef.current = audio;
          setAudioRef(audio);

          await new Promise((resolve, reject) => {
            audio.onplay = () => {
              if (isCurrentSpeech()) {
                setIsPlayingAudio(true);
                setIsSpeaking(true);
                setInterviewPhase("asking");
              }
            };
            audio.onended = () => {
              URL.revokeObjectURL(audioUrl);
              if (audioElementRef.current === audio) {
                audioElementRef.current = null;
                setAudioRef(null);
              }
              resolve();
            };
            audio.onerror = (e) => {
              URL.revokeObjectURL(audioUrl);
              reject(e);
            };
            audio.play().catch(reject);
          });
        }

        completeSpeech();
      };

      // Always show the message as subtitle, even when muted
      setAiMessage(text);

      try {
        // Check live ref to ensure unmuting takes effect immediately
        if (isMutedRef.current) {
          console.log("🔇 Muted - showing subtitle only");
          setIsPlayingAudio(true);
          setIsSpeaking(true);
          setInterviewPhase("asking");

          // Calculate reading time (~150 words per minute)
          const wordCount = text.split(" ").length;
          const readingTimeMs = Math.max(3000, (wordCount / 150) * 60 * 1000);

          setManagedSpeechTimeout(completeSpeech, readingTimeMs);
          return;
        }

        try {
          if (!serverTtsAvailable) {
            throw new Error("Chatterbox not running, using browser TTS");
          }

          await playChatterboxText();
          return;
        } catch (ttsError) {
          console.warn(
            "⚠️ Server TTS unavailable or timed out, using instant browser TTS:",
            ttsError.message
          );
        }

        // Fallback: Use browser's built-in Text-to-Speech (Web Speech API)
        if ("speechSynthesis" in window) {
          console.log("🗣️ Using browser TTS as fallback...");

          return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);

            utterance.onstart = () => {
              if (isCurrentSpeech()) {
                setIsPlayingAudio(true);
                setIsSpeaking(true);
                setInterviewPhase("asking");
              }
            };

            // Configure voice - prefer natural, high-quality voices
            const voices = window.speechSynthesis.getVoices();

            // Priority list for natural-sounding voices
            const preferredVoices = [
              // Google voices (best quality)
              "Google UK English Female",
              "Google US English",
              "Google UK English Male",
              // Microsoft/Edge voices (very good)
              "Microsoft Zira - English (United States)",
              "Microsoft David - English (United States)",
              "Microsoft Aria - English (United States)",
              // Apple voices (macOS/iOS)
              "Samantha",
              "Alex",
              "Karen",
              "Moira",
              "Tessa",
              // Generic fallbacks
              "English United States",
              "en-US",
            ];

            // Find the best available voice
            let selectedVoice = null;
            for (const preferred of preferredVoices) {
              selectedVoice = voices.find(
                (v) =>
                  v.name === preferred ||
                  v.name.includes(preferred) ||
                  (v.lang.startsWith("en-") &&
                    v.name.toLowerCase().includes("female"))
              );
              if (selectedVoice) {
                console.log(
                  `🎙️ Using voice: ${selectedVoice.name} (${selectedVoice.lang})`
                );
                break;
              }
            }

            // Fallback to any English voice
            if (!selectedVoice) {
              selectedVoice =
                voices.find((v) => v.lang.startsWith("en-")) || voices[0];
            }

            if (selectedVoice) {
              utterance.voice = selectedVoice;
            }

            // Optimized settings for natural speech
            utterance.rate = 0.95; // Slightly slower for clarity
            utterance.pitch = 1.05; // Slightly higher for warmth
            utterance.volume = 1.0; // Full volume

            utterance.onend = () => {
              if (!isCurrentSpeech()) {
                resolve();
                return;
              }

              console.log("🗣️ Browser TTS ended");
              completeSpeech();
              resolve();
            };

            utterance.onerror = (e) => {
              if (!isCurrentSpeech()) {
                resolve();
                return;
              }

              console.error("❌ Browser TTS error:", e);
              completeSpeech();
              resolve();
            };

            if (!isCurrentSpeech()) {
              resolve();
              return;
            }

            window.speechSynthesis.speak(utterance);
          });
        }

        // Last resort: show subtitle for reading time
        console.warn("⚠️ No TTS available, showing subtitle only");
        const wordCount = text.split(" ").length;
        const readingTimeMs = Math.max(3000, (wordCount / 150) * 60 * 1000);

        setManagedSpeechTimeout(completeSpeech, readingTimeMs);
      } catch (error) {
        console.error("❌ TTS error:", error);
        // On error, show subtitle for a few seconds then proceed
        setManagedSpeechTimeout(completeSpeech, 4000);
      }
    },
    [
      isMuted,
      selectedMode,
      serverTtsAvailable,
      setManagedSpeechTimeout,
      splitSpeechIntoChunks,
      stopLocalAudio,
    ]
  );

  // Generate professional, natural conversational transitions (neutral & authentic, zero false praise)
  const generateAcknowledgment = useCallback(() => {
    const neutralTransitions = [
      "Got it. Next up,",
      "Understood. Moving on to the next question,",
      "Noted. Let's look at another area,",
      "Thanks for explaining. Let's shift gears slightly,",
      "Got it. Moving forward to the next scenario,",
      "Understood. For the next question,",
      "Noted. Let's dive into the next topic,",
      "Okay, moving forward,",
    ];

    return neutralTransitions[Math.floor(Math.random() * neutralTransitions.length)];
  }, []);

  // Play audio from base64 data (for questions with pre-generated audio)
  const playQuestionAudio = useCallback(
    async (audioData, questionText = "") => {
      const autoStartRecording = () => {
        if (selectedMode === "live" && voiceAvailable) {
          setTimeout(() => startRecordingRef.current?.(true), 300);
        }
      };

      if (!audioData?.audioBase64) {
        console.warn("⚠️ No audio data, falling back to TTS");
        if (questionText) {
          speakAndListen(questionText, () => {
            setInterviewPhase("waiting");
            autoStartRecording();
          });
        }
        return;
      }

      try {
        console.log("🔊 Playing question audio...");
        setIsPlayingAudio(true);
        setIsSpeaking(true);
        if (questionText) setAiMessage(questionText);

        const audioBlob = new Blob(
          [
            Uint8Array.from(atob(audioData.audioBase64), (c) =>
              c.charCodeAt(0)
            ),
          ],
          {type: audioData.contentType || "audio/mpeg"}
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audioElementRef.current = audio;
        setAudioRef(audio);

        audio.onended = () => {
          if (!isInterviewActiveRef.current) return;
          console.log("🔊 Question audio ended");
          setIsPlayingAudio(false);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          if (audioElementRef.current === audio) {
            audioElementRef.current = null;
            setAudioRef(null);
          }
          setInterviewPhase("waiting");
          autoStartRecording();
        };

        audio.onerror = () => {
          if (!isInterviewActiveRef.current) return;
          console.error("❌ Question audio playback failed");
          setIsPlayingAudio(false);
          setIsSpeaking(false);
          if (audioElementRef.current === audio) {
            audioElementRef.current = null;
            setAudioRef(null);
          }
          setInterviewPhase("waiting");
          autoStartRecording();
        };

        await audio.play();
      } catch (error) {
        console.error("❌ Audio playback error:", error);
        setIsPlayingAudio(false);
        setIsSpeaking(false);
        setInterviewPhase("waiting");
        autoStartRecording();
      }
    },
    [selectedMode, voiceAvailable, speakAndListen]
  );

  // Stop any in-progress audio playback (prevents race conditions from overlapping audio)
  const stopAudio = () => {
    stopLocalAudio({advanceToListening: true});
  };

  // Test voice - play sample to hear how AI interviewer sounds
  // Uses browser TTS directly (ElevenLabs disabled)
  const handleTestVoice = async (preset = "greeting") => {
    if (isTestingVoice || isPlayingAudio) return;

    setIsTestingVoice(true);
    try {
      console.log("🎙️ Testing voice with preset:", preset);

      // Sample phrases for different presets
      const samplePhrases = {
        greeting:
          "Hello! I'm your AI interviewer. I'm excited to learn more about your background and experience today.",
        question:
          "Can you tell me about a challenging project you worked on recently and how you approached solving the problems you encountered?",
        acknowledgment:
          "That's a great answer! I really appreciate the detail you provided. It gives me excellent insight into your problem-solving approach.",
        closing:
          "Thank you so much for your time today. You've shared some really valuable insights. We'll be in touch soon with next steps.",
      };

      const testText = samplePhrases[preset] || samplePhrases.greeting;

      if (serverTtsAvailable) {
        try {
          console.log("📡 Testing Chatterbox voice...");
          const audioBlob = await interviewAPI.synthesizeSpeech(testText);

          if (audioBlob && audioBlob instanceof Blob && audioBlob.size > 0) {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            audioElementRef.current = audio;
            setAudioRef(audio);
            setIsPlayingAudio(true);

            audio.onended = () => {
              URL.revokeObjectURL(audioUrl);
              if (audioElementRef.current === audio) {
                audioElementRef.current = null;
                setAudioRef(null);
              }
              setIsPlayingAudio(false);
              setIsTestingVoice(false);
              toast.success("Chatterbox voice test completed!");
            };

            audio.onerror = (e) => {
              console.error("❌ Chatterbox voice test error:", e);
              URL.revokeObjectURL(audioUrl);
              if (audioElementRef.current === audio) {
                audioElementRef.current = null;
                setAudioRef(null);
              }
              setIsPlayingAudio(false);
              setIsTestingVoice(false);
              toast.error("Chatterbox voice test failed");
            };

            await audio.play();
            toast.success(`Testing ${preset} voice with Chatterbox...`);
            return;
          }
        } catch (serverTtsError) {
          console.warn(
            "⚠️ Chatterbox voice test unavailable, using browser TTS:",
            serverTtsError.message
          );
        }
      }

      // Browser TTS fallback
      if (!window.speechSynthesis) {
        throw new Error("Browser TTS not supported");
      }

      // Get voices
      const voices = window.speechSynthesis.getVoices();
      console.log(`🎙️ Testing with ${voices.length} available voices`);

      // Preferred voices (same as interview)
      const preferredVoices = [
        "Google UK English Female",
        "Google US English Female",
        "Microsoft Aria Online (Natural) - English (United States)",
        "Microsoft Zira - English (United States)",
        "Samantha",
        "Victoria",
        "Karen",
        "Fiona",
        "Google UK English Male",
        "Google US English Male",
        "Microsoft Guy Online (Natural) - English (United States)",
        "Microsoft David - English (United States)",
        "Daniel",
        "Alex",
        "Fred",
      ];

      // Find best available voice
      let selectedVoice = null;
      for (const preferredName of preferredVoices) {
        selectedVoice = voices.find((v) => v.name === preferredName);
        if (selectedVoice) break;
      }

      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => v.lang.startsWith("en"));
      }

      if (selectedVoice) {
        console.log(
          `🎙️ Testing voice: ${selectedVoice.name} (${selectedVoice.lang})`
        );
      }

      // Create and configure utterance
      const utterance = new SpeechSynthesisUtterance(testText);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      setIsPlayingAudio(true);

      utterance.onend = () => {
        console.log("✅ Voice test completed");
        setIsPlayingAudio(false);
        setIsTestingVoice(false);
        toast.success("Voice test completed!");
      };

      utterance.onerror = (e) => {
        console.error("❌ Voice test error:", e);
        setIsPlayingAudio(false);
        setIsTestingVoice(false);
        toast.error("Voice test failed: " + e.error);
      };

      // Play the test
      window.speechSynthesis.cancel(); // Clear any pending speech
      window.speechSynthesis.speak(utterance);
      toast.success(`Testing ${preset} voice...`);
    } catch (error) {
      console.error("❌ Voice test failed:", error);
      toast.error(error.message || "Failed to test voice");
      setIsTestingVoice(false);
      setIsPlayingAudio(false);
    }
  };

  // Start interview with natural conversation flow
  const handleStartInterview = async () => {
    // Validation
    if (!selectedType) {
      toast.error("Please select an interview type");
      return;
    }
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    if (selectedType === "resume-based" && !selectedResume) {
      toast.error("Please select a resume for resume-based interview");
      return;
    }
    if (
      selectedType === "job-description" &&
      (!jobDescription || jobDescription.length < 50)
    ) {
      toast.error("Please enter a job description (at least 50 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate estimated questions based on duration (roughly 1-2 min per question)
      const estimatedQuestions = Math.floor(interviewDuration * 0.8); // ~1.25 min per question average

      // Create session with time-based settings
      const createRes = await interviewAPI.createSession({
        interviewType: selectedType,
        role: selectedRole,
        experienceLevel: selectedLevel,
        mode: selectedMode,
        resumeId: selectedResume || undefined,
        jobDescription:
          selectedType === "job-description" ? jobDescription : undefined,
        totalQuestions: Math.max(5, Math.min(15, estimatedQuestions)),
        interviewDuration: interviewDuration, // Pass duration to backend
      });

      if (!createRes.success) {
        throw new Error(createRes.error || "Failed to create session");
      }

      // Start session
      const startRes = await interviewAPI.startSession(
        createRes.data.sessionId
      );

      if (!startRes.success) {
        throw new Error(startRes.error || "Failed to start session");
      }

      // Set session and current question using helpers (updates both state and ref)
      const sessionData = {id: createRes.data.sessionId, ...createRes.data};
      updateSession(sessionData);
      updateCurrentQuestion(startRes.data.currentQuestion);

      // Mark interview as active
      isInterviewActiveRef.current = true;

      setProgress(startRes.data.progress);
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;
      setStep("interview");
      setQuestionCount(1);

      // Different flow for live mode (natural conversation) vs other modes
      if (selectedMode === "live") {
        console.log("🎙️ LIVE MODE: Starting natural conversation flow");
        // Natural, human-like interview flow
        setConversationPhase(CONVERSATION_PHASES.INTRODUCTION);
        setInterviewPhase("greeting");

        // Generate warm, conversational introduction with warm-up question
        const introductionText = generateIntroduction();
        console.log("🎙️ LIVE MODE: Generated intro:", introductionText);
        setAiMessage(introductionText);

        // Add to conversation history
        setConversationHistory([
          {
            role: "ai",
            type: "introduction",
            content: introductionText,
            timestamp: Date.now(),
          },
        ]);

        console.log("🎙️ LIVE MODE: Calling speakAndListen...");
        // Speak the introduction, then wait for user's self-introduction
        speakAndListen(introductionText, () => {
          console.log("🎙️ LIVE MODE: speakAndListen callback - intro complete");
          // After introduction (which includes warm-up question),
          // wait for user's self-introduction - NOT the technical question yet
          setConversationPhase(CONVERSATION_PHASES.WARM_UP);
          setInterviewPhase("waiting");

          // Start listening for user's self-introduction response
          setTimeout(() => {
            console.log("🎙️ LIVE MODE: Starting recording for user response");
            startRecording(true);
          }, 500);
        });
      } else {
        // Traditional flow for text/voice modes
        setInterviewPhase("greeting");
        toast.success("Interview started! Good luck! 🎯");
        setTimeout(() => setInterviewPhase("waiting"), 1500);
      }
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast.error(error.message || "Failed to start interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit text answer
  const handleSubmitAnswer = async () => {
    if (!answer.trim() || answer.length < 10) {
      toast.error(
        "Please provide a more detailed answer (at least 10 characters)"
      );
      return;
    }

    setIsSubmitting(true);
    setEvaluation(null);
    setInterviewPhase("processing"); // Show processing state

    try {
      const response = await interviewAPI.submitAnswer(session.id, {
        answer: answer.trim(),
        questionNumber: currentQuestion.number,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to submit answer");
      }

      setEvaluation(response.data.evaluation);
      setProgress(response.data.progress);
      setInterviewPhase("evaluation"); // Show evaluation phase

      // Check if complete
      if (response.data.isComplete) {
        toast.success("Interview complete! Generating your report...");
        setInterviewPhase("idle");
        await handleCompleteInterview();
      } else if (response.data.nextQuestion) {
        // Show evaluation briefly, then move to next question with natural transition
        const showEvalDuration = selectedMode === "live" ? 2500 : 3000;

        setTimeout(async () => {
          // Add natural AI transition for live mode
          if (selectedMode === "live") {
            const acknowledgments =
              response.data.evaluation.score >= 70
                ? [
                    "Great answer! Let me move to the next question.",
                    "That's a solid response. Here's your next question.",
                  ]
                : response.data.evaluation.score >= 50
                  ? [
                      "Thank you for that response. Let's continue.",
                      "Noted. Here's the next question for you.",
                    ]
                  : [
                      "I appreciate your answer. Let's try another question.",
                      "Okay, let's continue with the next one.",
                    ];

            const randomAck =
              acknowledgments[
                Math.floor(Math.random() * acknowledgments.length)
              ];

            setInterviewPhase("transitioning");
            speakAndListen(randomAck, () => {
              updateCurrentQuestion(response.data.nextQuestion);
              setAnswer("");
              setEvaluation(null);
              setInterviewPhase("asking");

              if (response.data.nextQuestion?.text) {
                speakAndListen(response.data.nextQuestion.text, () => {
                  setInterviewPhase("waiting");
                  setTimeout(() => startRecording(true), 500);
                });
              }
            });
          } else {
            // Non-live mode
            updateCurrentQuestion(response.data.nextQuestion);
            setAnswer("");
            setEvaluation(null);
            setInterviewPhase("waiting");
          }
        }, showEvalDuration);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error(error.message || "Failed to submit answer");
      setInterviewPhase("waiting"); // Go back to waiting state on error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voice recording handlers with silence detection for natural conversation
  const startRecording = async (autoStart = false) => {
    // Check if interview is still active
    if (!isInterviewActiveRef.current) {
      console.log("⚠️ Interview ended, not starting recording");
      return;
    }

    // Phase guard: Only allow recording when waiting for user's answer
    if (interviewPhase !== "waiting" && !autoStart) {
      console.log("⚠️ Cannot start recording - current phase:", interviewPhase);
      if (interviewPhase === "asking") {
        toast("Please wait for the question to finish", {icon: "⏳"});
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      streamRef.current = stream;

      // Set up audio analysis for silence detection in live mode
      if (selectedMode === "live") {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) {
            console.warn("AudioContext not supported, silence detection disabled");
          } else {
            audioContextRef.current = new AudioCtx();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
          }
        } catch (audioCtxError) {
          console.warn("AudioContext creation failed, silence detection disabled:", audioCtxError.message);
          // Silence detection won't work, but recording will still function with manual stop
        }

        silenceStartRef.current = null;
        recordingStartTimeRef.current = Date.now();
        hasUserSpokenRef.current = false; // Reset spoken flag for new recording
      }

      // Check supported mimeTypes
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      console.log("🎙️ Starting recording with mimeType:", mimeType);

      const recorder = new MediaRecorder(stream, {mimeType});
      const chunks = [];

      recorder.ondataavailable = (e) => {
        console.log("📦 Audio chunk received:", e.data.size, "bytes");
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        console.log("🛑 Recording stopped. Total chunks:", chunks.length);
        const totalSize = chunks.reduce((acc, chunk) => acc + chunk.size, 0);
        console.log("📊 Total audio size:", totalSize, "bytes");

        // Clean up silence detection interval
        if (silenceCheckIntervalRef.current) {
          clearInterval(silenceCheckIntervalRef.current);
          silenceCheckIntervalRef.current = null;
        }

        const blob = new Blob(chunks, {type: mimeType});

        // Only stop stream if not in live mode (live mode keeps listening)
        if (selectedMode !== "live") {
          stream.getTracks().forEach((track) => track.stop());
        }

        if (blob.size === 0) {
          toast.error("No audio was recorded. Please try again.");
          // In live mode, restart listening after error
          if (selectedMode === "live" && interviewPhase === "waiting") {
            setTimeout(() => startRecording(true), 500);
          }
          return;
        }

        await handleVoiceSubmit(blob);
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);

      // Start with timeslice to get data during recording
      recorder.start(1000); // Get data every second
      setIsRecording(true);

      console.log("✅ Recording started");

      // Set up silence detection for live mode
      if (selectedMode === "live") {
        silenceCheckIntervalRef.current = setInterval(() => {
          // Stop checking if interview is no longer active
          if (!isInterviewActiveRef.current) {
            clearInterval(silenceCheckIntervalRef.current);
            silenceCheckIntervalRef.current = null;
            return;
          }
          checkSilence(recorder);
        }, 100); // Check every 100ms
      }

      // Auto-stop after 90 seconds for non-live mode
      if (selectedMode !== "live") {
        setTimeout(() => {
          if (recorder.state === "recording" && isInterviewActiveRef.current) {
            recorder.stop();
            setIsRecording(false);
            toast("Recording stopped (90 second limit)");
          }
        }, 90000);
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Microphone access denied or not available");
    }
  };

  // Keep ref in sync for stable access in useCallback closures
  startRecordingRef.current = startRecording;

  // Handle extended silence - when user hasn't responded at all
  const handleExtendedSilence = useCallback(async () => {
    // Don't prompt if not in live mode or interview isn't active
    if (selectedMode !== "live" || !isInterviewActiveRef.current) {
      return;
    }

    // Stop current recording
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    // Clean up silence detection
    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }

    const promptCount = silencePromptCountRef.current;
    silencePromptCountRef.current = promptCount + 1;

    // Different responses based on how many times we've prompted
    const firstPrompts = [
      "Hey, are you still there? Take your time if you need to think about it!",
      "I'm here whenever you're ready! No rush at all.",
      "I noticed it's quiet. Would you like me to repeat the question?",
      "Still with me? Feel free to take a moment to gather your thoughts!",
    ];

    const secondPrompts = [
      "No worries if you need more time! Let me know if you'd like me to clarify anything.",
      "I'm still here! Would you like to skip this question and move to another one?",
      "Take all the time you need. If you're not sure, just share what comes to mind!",
    ];

    const thirdPrompts = [
      "It seems like you might be having trouble with this one. Should we try a different question?",
      "That's okay! Not every question needs a perfect answer. Want to move on?",
      "No pressure at all! We can skip this if you'd like, or I can give you a hint.",
    ];

    let silenceResponse;
    if (promptCount === 0) {
      silenceResponse =
        firstPrompts[Math.floor(Math.random() * firstPrompts.length)];
    } else if (promptCount === 1) {
      silenceResponse =
        secondPrompts[Math.floor(Math.random() * secondPrompts.length)];
    } else {
      silenceResponse =
        thirdPrompts[Math.floor(Math.random() * thirdPrompts.length)];
    }

    console.log("🔇 Extended silence - prompting user:", silenceResponse);
    setInterviewPhase("transitioning");

    // Speak the prompt, then restart listening
    await speakAndListen(silenceResponse, () => {
      // Reset for next recording
      hasUserSpokenRef.current = false;
      setInterviewPhase("waiting");

      // Restart recording after a brief pause
      setTimeout(() => {
        if (isInterviewActiveRef.current) {
          startRecording(true);
        }
      }, 500);
    });
  }, [selectedMode, mediaRecorder, speakAndListen]);

  // Check audio levels for silence detection
  const checkSilence = (recorder) => {
    // Don't process if interview is no longer active
    if (!isInterviewActiveRef.current) {
      return;
    }

    if (!analyserRef.current || !recorder || recorder.state !== "recording") {
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate overall average and middle vocal frequency energy (300Hz-3400Hz)
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const binCount = 8;
    const binSize = Math.max(1, Math.floor(dataArray.length / binCount));
    let vocalSum = 0;
    for (let i = 2; i <= 5; i++) {
      let bandSum = 0;
      for (let j = 0; j < binSize; j++) {
        bandSum += dataArray[i * binSize + j] || 0;
      }
      vocalSum += bandSum / binSize;
    }
    const vocalEnergy = vocalSum / 4;

    const now = Date.now();
    const recordingDuration = now - (recordingStartTimeRef.current || now);

    // Only check for silence after minimum recording duration
    if (recordingDuration < MIN_RECORDING_DURATION) {
      return;
    }

    // A user is vocalizing if vocal energy crosses speech threshold (ignores low fan hum & high white noise)
    const isVocalizing = vocalEnergy > VOCAL_SPEECH_THRESHOLD || average > (SILENCE_THRESHOLD + 12);

    if (!isVocalizing) {
      speechConsecutiveFramesRef.current = 0;
      /* NOTE: Auto-detection commented out as requested. Candidate controls submission via "Finish Answer" button.
      if (!silenceStartRef.current) {
        silenceStartRef.current = now;
        console.log("🔇 Silence detected (vocal energy below threshold), starting timer...");
      } else {
        const silenceDuration = now - silenceStartRef.current;

        // Check for extended silence (user hasn't spoken at all)
        if (
          !hasUserSpokenRef.current &&
          silenceDuration >= EXTENDED_SILENCE_DURATION
        ) {
          console.log(
            "🔇 Extended silence - user hasn't responded, prompting..."
          );
          handleExtendedSilence();
          return;
        }

        // Regular silence detection (user spoke, then stopped)
        if (hasUserSpokenRef.current && silenceDuration >= SILENCE_DURATION) {
          console.log(
            "✅ Silence threshold reached, stopping recording automatically"
          );
          if (recorder.state === "recording") {
            recorder.stop();
            setIsRecording(false);
          }
        }
      }
      */
    } else {
      // User is confirmed speaking (must sustain for >= 2 frames to avoid transient pop/clack)
      speechConsecutiveFramesRef.current += 1;
      if (speechConsecutiveFramesRef.current >= 2) {
        if (!hasUserSpokenRef.current) {
          console.log("🎤 Confirmed human speech detected!");
          hasUserSpokenRef.current = true;
        }
        if (silenceStartRef.current) {
          console.log("🎤 Human speech active, resetting silence timer");
        }
        silenceStartRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    // Clean up silence detection
    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceSubmit = async (audioBlob) => {
    // Check if interview is still active (prevent processing after end)
    if (!isInterviewActiveRef.current) {
      console.log("⚠️ Interview ended, ignoring voice submission");
      return;
    }

    // Use refs for immediate access (state may be stale in callback chains)
    const currentSession = sessionRef.current;
    const currentQ = currentQuestionRef.current;

    console.log("🎤 handleVoiceSubmit called");
    console.log("  - audioBlob:", audioBlob);
    console.log("  - audioBlob.size:", audioBlob?.size);
    console.log("  - audioBlob.type:", audioBlob?.type);
    console.log("  - sessionRef.current:", currentSession);
    console.log("  - session.id:", currentSession?.id);
    console.log("  - currentQuestionRef.current:", currentQ?.number);

    if (!audioBlob || audioBlob.size === 0) {
      // In live mode, restart listening only if interview is still active
      if (selectedMode === "live" && isInterviewActiveRef.current) {
        setInterviewPhase("waiting");
        setTimeout(() => startRecording(true), 500);
      }
      return;
    }

    if (!currentSession?.id) {
      console.log("⚠️ No session, ignoring voice submission");
      return;
    }

    setIsSubmitting(true);
    setInterviewPhase("processing");

    try {
      const mimeType = audioBlob.type || "audio/webm";
      const extension = mimeType.includes("webm")
        ? "webm"
        : mimeType.includes("mp4")
          ? "m4a"
          : "webm";

      const audioFile = new File([audioBlob], `answer.${extension}`, {
        type: mimeType,
      });

      // ============================================
      // WARM-UP PHASE: Handle self-introduction separately
      // ============================================
      if (
        conversationPhase === CONVERSATION_PHASES.WARM_UP &&
        selectedMode === "live"
      ) {
        console.log("🌟 Processing warm-up response (self-introduction)");

        // Just transcribe - don't evaluate as a technical answer
        const transcribeResponse =
          await interviewAPI.transcribeAudioOnly(audioFile);

        if (!transcribeResponse.success) {
          throw new Error(
            transcribeResponse.error || "Failed to transcribe audio"
          );
        }

        const selfIntroText = transcribeResponse.data.text;
        console.log("📝 Self-introduction transcribed:", selfIntroText);

        // Add to conversation history
        setConversationHistory((prev) => [
          ...prev,
          {
            role: "user",
            type: "self-introduction",
            content: selfIntroText,
            timestamp: Date.now(),
          },
        ]);

        // Generate concise, natural acknowledgment for the self-introduction
        const warmAcknowledgments = [
          `Great introduction! Let's dive right into your first question.`,
          `Thanks for sharing that background! Let's get started.`,
          `Awesome! Let's jump into the first question for the ${selectedRole} role.`,
        ];

        const randomAck =
          warmAcknowledgments[
            Math.floor(Math.random() * warmAcknowledgments.length)
          ];
        const firstQText = currentQ?.text || "Let's start with the first question.";
        const fullIntroSpeech = `${randomAck} ${firstQText}`;

        // Transition to core interview
        setConversationPhase(CONVERSATION_PHASES.CORE_INTERVIEW);
        setInterviewPhase("asking");

        // Add to history
        setConversationHistory((prev) => [
          ...prev,
          {
            role: "ai",
            type: "question",
            content: fullIntroSpeech,
            timestamp: Date.now(),
          },
        ]);

        // Speak acknowledgment and first question in one continuous audio stream
        await speakAndListen(fullIntroSpeech, () => {
          setInterviewPhase("waiting");
          setTimeout(() => startRecording(true), 500);
        });

        setIsSubmitting(false);
        return; // Don't continue to regular submission flow
      }

      // ============================================
      // LIVE MODE: Check for user queries or submit answer directly
      // ============================================
      const currentStartTime = startTimeRef.current || Date.now();
      const elapsed = Math.floor((Date.now() - currentStartTime) / 1000);
      const totalDurationSec = interviewDuration * 60;
      const remainingTime = totalDurationSec - elapsed;

      // Check if time is already up before submitting
      if (selectedMode === "live" && (remainingTime <= 10 || elapsed >= totalDurationSec)) {
        console.log("⏰ Time up detected in voice submit, ending interview gracefully.");
        const closingMessage =
          "We've reached the end of our allotted time. Thank you so much for your answers today. Let me prepare your comprehensive performance report now.";
        setConversationPhase(CONVERSATION_PHASES.COMPLETED);

        await speakAndListen(closingMessage, async () => {
          setInterviewPhase("idle");
          await handleCompleteInterview();
        });
        setIsSubmitting(false);
        return;
      }

      // Single-pass submission: send audio directly to backend
      const response = await interviewAPI.submitVoiceAnswer(
        currentSession.id,
        audioFile,
        currentQ.number
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to process voice answer");
      }

      const transcribedText = response.data.transcription?.text || "";
      setAnswer(transcribedText);
      setProgress(response.data.progress);
      setQuestionCount((prev) => prev + 1);

      // Add user response to conversation history
      setConversationHistory((prev) => [
        ...prev,
        {
          role: "user",
          content: transcribedText,
          timestamp: Date.now(),
        },
      ]);

      // Check for user repeat/clarify requests on short phrases (< 12 words)
      if (selectedMode === "live" && transcribedText) {
        const userText = transcribedText.toLowerCase().trim();
        const wordCount = userText.split(/\s+/).filter(Boolean).length;

        const isExplicitRepeat =
          wordCount < 12 &&
          (userText.startsWith("repeat") ||
            userText.startsWith("can you repeat") ||
            userText.startsWith("please repeat") ||
            userText.startsWith("could you repeat") ||
            userText.startsWith("say that again") ||
            userText.startsWith("what was the question") ||
            userText.startsWith("one more time"));

        const isExplicitClarify =
          wordCount < 12 &&
          (userText.startsWith("clarify") ||
            userText.startsWith("can you clarify") ||
            userText.startsWith("what do you mean") ||
            userText.startsWith("i don't understand"));

        if (isExplicitRepeat) {
          console.log("🔄 Explicit user repeat request detected");
          const repeatAck = "Sure, no problem! Here's the question again:";
          const fullRepeatSpeech = `${repeatAck} ${currentQ?.text || ""}`;

          setInterviewPhase("asking");
          await speakAndListen(fullRepeatSpeech, () => {
            setInterviewPhase("waiting");
            setTimeout(() => startRecording(true), 500);
          });
          setIsSubmitting(false);
          return;
        }

        if (isExplicitClarify) {
          console.log("❓ Explicit user clarify request detected");
          const clarifySpeech = `Sure! In simple terms, for the ${selectedRole} role: ${currentQ?.text || ""}`;

          setInterviewPhase("asking");
          await speakAndListen(clarifySpeech, () => {
            setInterviewPhase("waiting");
            setTimeout(() => startRecording(true), 500);
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Check if interview should complete
      const shouldEndInterview =
        response.data.isComplete ||
        (remainingTime <= 20 && elapsed >= 60);

      if (shouldEndInterview) {
        const closingMessage =
          "We've covered all our topics for today. Thank you so much for your time and thoughtful responses! Let me generate your detailed report.";
        setConversationPhase(CONVERSATION_PHASES.COMPLETED);

        await speakAndListen(closingMessage, async () => {
          setInterviewPhase("idle");
          await handleCompleteInterview();
        });
      } else if (response.data.nextQuestion) {
        // Natural conversation flow - combined acknowledgment and next question
        if (selectedMode === "live") {
          const ack = generateAcknowledgment();
          const nextQText = response.data.nextQuestion.text;
          const fullSpeech = `${ack} ${nextQText}`;

          updateCurrentQuestion(response.data.nextQuestion);
          setAnswer("");
          setEvaluation(null);

          // Add to conversation history
          setConversationHistory((prev) => [
            ...prev,
            {
              role: "ai",
              type: "question",
              content: fullSpeech,
              timestamp: Date.now(),
            },
          ]);

          // Speak transition + question in one seamless audio pass
          await speakAndListen(fullSpeech, () => {
            setInterviewPhase("waiting");
            setTimeout(() => startRecording(true), 500);
          });
        } else {
          // Non-live mode
          setEvaluation(response.data.evaluation);
          setInterviewPhase("evaluation");

          setTimeout(() => {
            updateCurrentQuestion(response.data.nextQuestion);
            setAnswer("");
            setEvaluation(null);
            setInterviewPhase("waiting");
          }, 3000);
        }
      } else {
        await handleCompleteInterview();
      }
    } catch (error) {
      console.error("Failed to submit voice answer:", error);
      
      // Auto-recover if the answer was already accepted on backend
      if (error.message?.includes("already answered") && currentSession?.id) {
        try {
          const sessionRes = await interviewAPI.getSession(currentSession.id);
          if (sessionRes.success && sessionRes.data?.session?.currentQuestion) {
            updateCurrentQuestion(sessionRes.data.session.currentQuestion);
            setInterviewPhase("waiting");
            return;
          }
        } catch (recoverErr) {
          console.error("Failed to recover session:", recoverErr);
        }
      }

      toast.error(error.message || "Failed to process voice answer");
      setInterviewPhase("waiting");

      // In live mode, restart listening after error
      if (selectedMode === "live") {
        setTimeout(() => startRecording(true), 1000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skip question
  const handleSkipQuestion = async () => {
    const confirmSkip = window.confirm(
      "Are you sure you want to skip this question? It will affect your score."
    );
    if (!confirmSkip) {
      return;
    }

    // Use refs for immediate access
    const currentSession = sessionRef.current;
    const currentQ = currentQuestionRef.current;

    console.log("🔄 Skipping question:", {
      sessionId: currentSession?.id,
      questionNumber: currentQ?.number,
    });

    setIsSubmitting(true);
    try {
      const response = await interviewAPI.skipQuestion(
        currentSession.id,
        currentQ.number
      );

      console.log("✅ Skip response:", response);

      if (!response.success) {
        throw new Error(response.error || "Failed to skip question");
      }

      setProgress(response.data.progress);

      if (response.data.isComplete) {
        await handleCompleteInterview();
      } else if (response.data.nextQuestion) {
        updateCurrentQuestion(response.data.nextQuestion);
        setAnswer("");
        setEvaluation(null);
        setInterviewPhase("asking");

        // Play next question audio in live mode
        if (selectedMode === "live" && response.data.nextQuestion?.audio) {
          setTimeout(() => {
            playQuestionAudio(
              response.data.nextQuestion.audio,
              response.data.nextQuestion.text
            );
          }, 500);
        } else if (
          selectedMode === "live" &&
          response.data.nextQuestion?.text
        ) {
          // No pre-generated audio, use TTS
          setTimeout(() => {
            speakAndListen(response.data.nextQuestion.text, () => {
              setInterviewPhase("waiting");
              setTimeout(() => startRecording(true), 500);
            });
          }, 500);
        } else if (selectedMode === "live") {
          // Fallback: no audio or text
          setTimeout(() => setInterviewPhase("waiting"), 500);
        }
      }

      toast.success("Question skipped");
    } catch (error) {
      console.error("❌ Failed to skip question:", error);
      toast.error(error.message || "Failed to skip question");
      setInterviewPhase("waiting");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete interview
  const handleCompleteInterview = async () => {
    if (isCompletingRef.current) {
      console.log("⚠️ handleCompleteInterview already in progress, skipping duplicate call.");
      return;
    }
    isCompletingRef.current = true;

    // Mark interview as inactive FIRST to prevent any further processing
    isInterviewActiveRef.current = false;

    // Use ref for immediate access (may be called from callback chain)
    const currentSession = sessionRef.current;

    // Stop all recording/audio resources first
    stopLocalAudio();

    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Already closed
      }
      audioContextRef.current = null;
      analyserRef.current = null;
    }

    setIsRecording(false);

    try {
      console.log("🏁 Completing interview:", currentSession?.id);
      const response = await interviewAPI.completeSession(currentSession.id);

      console.log("✅ Complete response:", response);

      if (!response.success) {
        throw new Error(response.error || "Failed to generate report");
      }

      setResult(response.data);
      setStep("result");
      setInterviewPhase("idle");
    } catch (error) {
      console.error("❌ Failed to complete interview:", error);
      toast.error(error.message || "Failed to generate report");
    }
  };

  // Abandon interview
  const handleAbandonInterview = async () => {
    const confirmAbandon = window.confirm(
      "Are you sure you want to end this interview? Your progress will be lost."
    );
    if (!confirmAbandon) {
      return;
    }

    // Mark interview as inactive FIRST to prevent any further processing
    isInterviewActiveRef.current = false;

    // Use ref for immediate access
    const currentSession = sessionRef.current;
    console.log("🚫 Abandoning interview:", currentSession?.id);

    try {
      stopLocalAudio();

      // Stop silence detection interval
      if (silenceCheckIntervalRef.current) {
        clearInterval(silenceCheckIntervalRef.current);
        silenceCheckIntervalRef.current = null;
      }

      // Stop any ongoing recording
      if (isRecording && mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
      }

      // Stop media stream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Close audio context safely
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close().catch(() => {});
        } catch (_) {}
        audioContextRef.current = null;
        analyserRef.current = null;
      }

      // Call backend to abandon session
      if (currentSession?.id) {
        await interviewAPI.abandonSession(currentSession.id);
      }

      console.log("✅ Interview abandoned successfully");
      toast.success("Interview ended");
      setStep("setup");
      setInterviewPhase("idle");
      resetState();
    } catch (error) {
      console.error("❌ Failed to abandon interview:", error);
      toast.error(error.message || "Failed to end interview");
      // Still reset state even on error
      resetState();
      setStep("setup");
    }
  };

  // Reset state
  const resetState = () => {
    stopLocalAudio();

    // Clear all intervals and timeouts
    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context safely
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch (_) {}
      audioContextRef.current = null;
      analyserRef.current = null;
    }

    // Reset all refs
    silenceStartRef.current = null;
    recordingStartTimeRef.current = null;
    startTimeRef.current = null;
    hasUserSpokenRef.current = false;
    silencePromptCountRef.current = 0;
    isMutedRef.current = false;

    // Reset all state
    updateSession(null);
    updateCurrentQuestion(null);
    setAnswer("");
    setEvaluation(null);
    setResult(null);
    setStartTime(null);
    setElapsedTime(0);
    setIsMuted(false);
    setIsRecording(false);
    setMediaRecorder(null);
    setAudioChunks([]);
    setIsPlayingAudio(false);
    setAudioRef(null);
    setConversationHistory([]);
    setAiMessage("");
    setQuestionCount(0);
    setConversationPhase(CONVERSATION_PHASES.IDLE);
  };

  // Safe mute toggle synchronized with ref and active audio playback
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (next) {
        if (audioElementRef.current) {
          audioElementRef.current.pause();
        }
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }
      return next;
    });
  }, []);

  // Start new interview
  const handleNewInterview = () => {
    resetState();
    setStep("setup");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0C0C0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Animated loader */}
          <div className="relative w-20 h-20">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse"></div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-900 dark:text-white font-medium">
              Loading interview...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Preparing your AI interviewer
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0C0C0C] overflow-x-hidden">
      {/* Ambient gradient blur effects matching other pages */}
      <div className="fixed top-40 left-20 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed top-60 right-20 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center relative">
          {/* Interview History Button - Top Right */}
          <button
            onClick={() => navigate("/interview/history")}
            className="absolute right-0 top-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <History className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Interview History</span>
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:backdrop-blur-xl border border-purple-500/20 dark:border-white/10 rounded-full text-sm font-medium text-purple-600 dark:text-purple-300 shadow-lg mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI-Powered Mock Interviews
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Practice with{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Interviewer
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Get real-time feedback and improve your interview skills with our
            intelligent AI coach
          </p>
        </div>

        {/* Setup Step */}
        {step === "setup" && (
          <SetupStep
            config={config}
            resumes={resumes}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            selectedResume={selectedResume}
            setSelectedResume={setSelectedResume}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            interviewDuration={interviewDuration}
            setInterviewDuration={setInterviewDuration}
            voiceAvailable={voiceAvailable}
            ttsAvailable={ttsAvailable}
            isSubmitting={isSubmitting}
            isTestingVoice={isTestingVoice}
            isPlayingAudio={isPlayingAudio}
            onTestVoice={handleTestVoice}
            onStart={handleStartInterview}
          />
        )}

        {/* Interview Step - Fullscreen Distraction-Free Studio (No Navbar, No Sidebar, No Footer) */}
        {step === "interview" && (
          <div className="fixed inset-0 z-[100] bg-[#070709] text-white flex flex-col justify-between overflow-hidden select-none">
            <InterviewStep
              currentQuestion={currentQuestion}
              progress={progress}
              elapsedTime={elapsedTime}
              formatTime={formatTime}
              interviewDuration={interviewDuration}
              answer={answer}
              setAnswer={setAnswer}
              evaluation={evaluation}
              selectedMode={selectedMode}
              isRecording={isRecording}
              isSubmitting={isSubmitting}
              isPlayingAudio={isPlayingAudio}
              isSpeaking={isSpeaking}
              interviewPhase={interviewPhase}
              conversationPhase={conversationPhase}
              aiMessage={aiMessage}
              isMuted={isMuted}
              micFrequencyBins={micFrequencyBins}
              bargeInNotice={bargeInNotice}
              onToggleMute={handleToggleMute}
              onSubmitAnswer={handleSubmitAnswer}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onSkip={handleSkipQuestion}
              onAbandon={handleAbandonInterview}
              onStopAudio={stopAudio}
            />
          </div>
        )}

        {/* Result Step */}
        {step === "result" && result && (
          <ResultStep
            result={result}
            elapsedTime={elapsedTime}
            formatTime={formatTime}
            onNewInterview={handleNewInterview}
            onViewHistory={() => navigate("/interview/history")}
          />
        )}
      </div>
    </div>
  );
};

// Setup Step Component
const SetupStep = ({
  config,
  resumes,
  selectedType,
  setSelectedType,
  selectedRole,
  setSelectedRole,
  selectedLevel,
  setSelectedLevel,
  selectedMode,
  setSelectedMode,
  selectedResume,
  setSelectedResume,
  jobDescription,
  setJobDescription,
  interviewDuration,
  setInterviewDuration,
  voiceAvailable,
  ttsAvailable,
  isSubmitting,
  isTestingVoice,
  isPlayingAudio,
  onTestVoice,
  onStart,
}) => {
  return (
    <div className="space-y-8">
      {/* Interview Type Selection */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500 dark:text-purple-400" />
          Select Interview Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {config?.interviewTypes?.map((type) => {
            const Icon = typeIcons[type.id] || Sparkles;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                  selectedType === type.id
                    ? "border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 shadow-lg shadow-purple-500/20"
                    : "border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 bg-white dark:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-6 h-6 mb-2 ${selectedType === type.id ? "text-purple-500 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"}`}
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role Selection */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            Target Role
          </h2>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">Select a role...</option>
            {config?.roles?.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            Experience Level
          </h2>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            {config?.experienceLevels?.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name} - {level.depth}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conditional Fields */}
      {selectedType === "resume-based" && (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            Select Resume
          </h2>
          {resumes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No resumes found.{" "}
              <a href="/upload" className="text-purple-500 hover:underline">
                Create one first
              </a>
              .
            </p>
          ) : (
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Select a resume...</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.resumeTitle || resume.name || "Untitled Resume"}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {selectedType === "job-description" && (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            Job Description
          </h2>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={6}
            className="w-full p-3 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {jobDescription.length}/50 characters minimum
          </p>
        </div>
      )}

      {/* Mode & Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interview Mode */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            Answer Mode
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedMode("text")}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-300 ${
                selectedMode === "text"
                  ? "border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 shadow-lg shadow-purple-500/20"
                  : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-300 dark:hover:border-purple-500/50"
              }`}
            >
              <MessageSquare
                className={`w-6 h-6 ${selectedMode === "text" ? "text-purple-500 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"}`}
              />
              <span className="font-medium text-gray-900 dark:text-white">
                Text
              </span>
            </button>
            <button
              onClick={() => voiceAvailable && setSelectedMode("voice")}
              disabled={!voiceAvailable}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-300 ${
                !voiceAvailable
                  ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5"
                  : selectedMode === "voice"
                    ? "border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 shadow-lg shadow-purple-500/20"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-300 dark:hover:border-purple-500/50"
              }`}
            >
              <Mic
                className={`w-6 h-6 ${selectedMode === "voice" ? "text-purple-500 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"}`}
              />
              <span className="font-medium text-gray-900 dark:text-white">
                Voice
              </span>
              {!voiceAvailable && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Start Whisper STT
                </span>
              )}
            </button>
            <button
              onClick={() =>
                voiceAvailable && ttsAvailable && setSelectedMode("live")
              }
              disabled={!voiceAvailable || !ttsAvailable}
              className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-300 ${
                !voiceAvailable || !ttsAvailable
                  ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5"
                  : selectedMode === "live"
                    ? "border-purple-500 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 shadow-lg shadow-purple-500/20"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-300 dark:hover:border-purple-500/50"
              }`}
            >
              <Volume2
                className={`w-6 h-6 ${selectedMode === "live" ? "text-purple-500 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"}`}
              />
              <span className="font-medium text-gray-900 dark:text-white">
                Live
              </span>
              {!voiceAvailable || !ttsAvailable ? (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {!voiceAvailable ? "Needs Whisper STT" : "Needs TTS"}
                </span>
              ) : (
                <span className="text-xs text-purple-400 font-medium">Voice-to-Voice</span>
              )}
            </button>
          </div>
          {selectedMode === "live" && (
            <p className="mt-3 text-sm text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 p-3 rounded-xl border border-purple-200 dark:border-purple-500/20">
              🎙️ Natural conversation mode: AI speaks questions aloud and
              listens for your responses automatically. Just talk naturally!
            </p>
          )}

          {/* Voice Test Section - Only show when TTS is available */}
          {ttsAvailable && (
            <div className="mt-4 p-4 bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200/50 dark:border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Test AI Interviewer Voice (Rachel)
                  </span>
                </div>
                {isPlayingAudio && (
                  <span className="text-xs text-purple-400 animate-pulse flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    Playing...
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onTestVoice("greeting")}
                  disabled={isTestingVoice || isPlayingAudio}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/5 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  🎙️ Greeting
                </button>
                <button
                  onClick={() => onTestVoice("question")}
                  disabled={isTestingVoice || isPlayingAudio}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/5 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ❓ Question
                </button>
                <button
                  onClick={() => onTestVoice("acknowledgment")}
                  disabled={isTestingVoice || isPlayingAudio}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/5 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ✅ Acknowledgment
                </button>
                <button
                  onClick={() => onTestVoice("closing")}
                  disabled={isTestingVoice || isPlayingAudio}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/5 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  👋 Closing
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Click to hear how the AI interviewer will sound during your
                interview
              </p>
            </div>
          )}
        </div>

        {/* Interview Duration */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            Interview Duration
          </h2>
          <input
            type="range"
            min="5"
            max="20"
            value={interviewDuration}
            onChange={(e) => setInterviewDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-3">
            <span>5 min (Quick)</span>
            <span className="font-bold text-purple-500 text-lg">
              {interviewDuration} min
            </span>
            <span>20 min (Thorough)</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            The interview will naturally conclude when time is up
          </p>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={isSubmitting || !selectedType || !selectedRole}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 disabled:shadow-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting Interview...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Start Interview
          </>
        )}
      </button>
    </div>
  );
};

// Interview Step Component
const InterviewStep = ({
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
            
            {/* SLEEK PROFESSIONAL BACK HAIR (Clean bob silhouette) */}
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
              {/* Left Eye */}
              <path d="M75 63C79 58 87 58 92 63" stroke="#1A0D07" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M76 63C80 68 87 68 91 63" fill="#FFFFFF" />
              <g className="pupil-gaze">
                <circle cx="83.5" cy="63" r="4" fill="url(#rachelHazelIrisAi)" />
                <circle cx="83.5" cy="63" r="2.1" fill="#0D0603" />
                <circle cx="82" cy="61.5" r="1.2" fill="#FFFFFF" />
                <circle cx="85" cy="64.5" r="0.6" fill="#FFFFFF" opacity="0.8" />
              </g>
              <path d="M74 62L71 60M93 62L96 60" stroke="#1A0D07" strokeWidth="1" strokeLinecap="round" />

              {/* Right Eye */}
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
            <path d="M64 50C62 34 74 20 100 18C126 20 138 34 136 50C130 26 118 22 100 22C82 22 70 26 64 50Z" fill="url(#rachelHairSleekAi)" />
            
            {/* 2. Sleek Side-Parted Fringe (Natural proportioned hairline from y=36 to y=44) */}
            <path d="M66 48C74 36 88 28 104 28C122 28 132 36 134 48C128 38 116 32 102 32C84 32 72 38 66 48Z" fill="url(#rachelHairShineAi)" />
            <path d="M66 46C76 40 90 38 102 42C116 38 128 40 134 48C128 42 114 36 100 36C84 36 72 42 66 46Z" fill="url(#rachelHairSleekAi)" />

            {/* 3. Sleek Face-Framing Tresses (Clean, soft edge) */}
            <path d="M65 48C63 66 65 88 70 104C73 107 75 105 74 100C70 84 68 66 69 48Z" fill="url(#rachelHairSleekAi)" />
            <path d="M135 48C137 66 135 88 130 104C127 107 125 105 126 100C130 84 132 66 131 48Z" fill="url(#rachelHairSleekAi)" />

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
              Evaluator: Rachel (Senior Engineering Lead) • Question {progress.current} of {progress.total}
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

        {/* Right: Timer & Theme Toggle & End Meeting */}
        <div className="flex items-center gap-3">
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
            <span>Interruption Detected: Rachel yielded speaking to listen to your response.</span>
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
                  Rachel • Technical Interviewer
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
              />

              <div className="text-center mt-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rachel</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">Lead Engineering Assessor</p>
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
                  ? "Rachel is reviewing your answer and preparing the next question..."
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

// Result Step Component
const ResultStep = ({
  result,
  elapsedTime,
  formatTime,
  onNewInterview,
  onViewHistory,
}) => {
  const scoreColor =
    result.overallScore >= 70
      ? "text-green-500"
      : result.overallScore >= 50
        ? "text-yellow-500"
        : "text-red-500";

  const scoreGradient =
    result.overallScore >= 70
      ? "from-green-500 to-emerald-500"
      : result.overallScore >= 50
        ? "from-yellow-500 to-orange-500"
        : "from-red-500 to-pink-500";

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-100 to-blue-100 dark:from-blue-500/10 dark:to-cyan-500/10 dark:backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full text-sm font-medium text-slate-700 dark:text-blue-300 shadow-lg mb-6">
          <Award className="w-4 h-4" />
          Interview Complete
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Your Performance Report
        </h2>
        <div className="relative w-36 h-36 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="64"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-gray-200 dark:text-white/10"
            />
            <circle
              cx="72"
              cy="72"
              r="64"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeDasharray={`${(result.overallScore / 100) * 402} 402`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="scoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  className={`${result.overallScore >= 70 ? "stop-color-green-500" : result.overallScore >= 50 ? "stop-color-yellow-500" : "stop-color-red-500"}`}
                  style={{
                    stopColor:
                      result.overallScore >= 70
                        ? "#22c55e"
                        : result.overallScore >= 50
                          ? "#eab308"
                          : "#ef4444",
                  }}
                />
                <stop
                  offset="100%"
                  className={`${result.overallScore >= 70 ? "stop-color-emerald-500" : result.overallScore >= 50 ? "stop-color-orange-500" : "stop-color-pink-500"}`}
                  style={{
                    stopColor:
                      result.overallScore >= 70
                        ? "#10b981"
                        : result.overallScore >= 50
                          ? "#f97316"
                          : "#ec4899",
                  }}
                />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${scoreColor}`}>
              {result.overallScore}
            </span>
          </div>
        </div>
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {result.grade} - {result.performanceLevel}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Duration: {formatTime(elapsedTime)} |{" "}
          {result.metrics?.answeredQuestions}/{result.metrics?.totalQuestions}{" "}
          questions answered
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Skill Breakdown */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Skill Breakdown
        </h3>
        <div className="space-y-5">
          {Object.entries(result.skillBreakdown || {}).map(([skill, data]) => (
            <div key={skill}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 capitalize font-medium">
                  {skill.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span
                  className={`font-bold ${data.score >= 70 ? "text-green-500" : data.score >= 50 ? "text-yellow-500" : "text-red-500"}`}
                >
                  {data.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    data.score >= 70
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : data.score >= 50
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-red-500 to-pink-500"
                  }`}
                  style={{width: `${data.score}%`}}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-green-200 dark:border-green-500/20 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths?.map((s, i) => (
              <li
                key={i}
                className="text-gray-600 dark:text-gray-400 flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-red-500/20 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {result.weaknesses?.map((w, i) => (
              <li
                key={i}
                className="text-gray-600 dark:text-gray-400 flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Practice Areas */}
      {result.practiceAreas?.length > 0 && (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Recommended Practice Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.practiceAreas.map((area, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-500/20"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onNewInterview}
          className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          <RefreshCw className="w-5 h-5" />
          Practice Again
        </button>
        <button
          onClick={onViewHistory}
          className="flex-1 py-4 bg-gray-100/80 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:border-blue-500/50 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <BarChart3 className="w-5 h-5" />
          View History
        </button>
      </div>
    </div>
  );
};

export default AIInterview;
