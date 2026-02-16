import {useState, useEffect, useCallback, useRef} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {useAuth} from "@/context/AuthContext";
import {resumeAPI} from "@/api/api";
import interviewAPI from "@/api/interview.api";
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

// Silence detection settings
const SILENCE_THRESHOLD = 20; // Audio level below this is considered silence
const SILENCE_DURATION = 2000; // 2 seconds of silence to end recording (after user speaks)
const MIN_RECORDING_DURATION = 1500; // Minimum 1.5 seconds before silence detection
const EXTENDED_SILENCE_DURATION = 8000; // 8 seconds - user hasn't said anything at all
const MAX_WAITING_SILENCE = 15000; // 15 seconds - max time to wait before prompting again

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
  const [isMuted, setIsMuted] = useState(false); // Mute AI speech
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

  // Audio analysis refs for silence detection
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceStartRef = useRef(null);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const silenceCheckIntervalRef = useRef(null);
  const hasUserSpokenRef = useRef(false); // Track if user has spoken at all during this recording
  const silencePromptCountRef = useRef(0); // Track how many times we've prompted for silence
  const startRecordingRef = useRef(null); // Stable ref for startRecording to avoid stale closures

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

        setConfig(configRes.data);
        setResumes(resumesRes.data.resumes || []);
        setVoiceAvailable(voiceRes.data?.available || false);
        setTtsAvailable(
          ttsRes.data?.available || configRes.data?.ttsAvailable || false
        );
        setServerTtsAvailable(
          ttsRes.data?.providers?.chatterbox?.available || false
        );

        // Set defaults
        if (configRes.data?.experienceLevels?.length > 0) {
          setSelectedLevel(configRes.data.experienceLevels[2]?.id || "mid");
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
            conversationPhase !== CONVERSATION_PHASES.COMPLETED
          ) {
            const isActivelyWorking =
              isRecording ||
              interviewPhase === "processing" ||
              interviewPhase === "asking";

            // Allow up to 15s grace period if user is mid-recording or answer is processing
            if (!isActivelyWorking || remainingTime <= -15) {
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
      if (audioContextRef.current) {
        audioContextRef.current.close();
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

  // Generate natural, emotionally expressive introduction for live mode
  const generateIntroduction = useCallback(() => {
    const greetings = [
      `Hi there! Oh, it's so great to meet you! Thanks for joining me today!`,
      `Hello! Welcome! I'm really excited to chat with you today!`,
      `Hey! Thanks so much for being here! I'm really looking forward to this!`,
      `Hi! Wonderful to meet you! Thanks for taking the time to speak with me!`,
    ];

    const setups = [
      `So, I'll be conducting a friendly interview for the ${selectedRole} position. We've got about ${interviewDuration} minutes together, and I'd absolutely love to learn more about your background and experience!`,
      `I'm here to chat with you about the ${selectedRole} role! We have around ${interviewDuration} minutes, and honestly, I'm really curious to hear about your experience and how you approach things!`,
      `Today we'll be discussing the ${selectedRole} position! For the next ${interviewDuration} minutes or so, let's just have a natural conversation about your skills and what makes you tick!`,
    ];

    const encouragements = [
      "Just relax and be yourself! There's no rush at all, and think of this as a friendly chat, not an interrogation!",
      "Feel free to take all the time you need with your answers! I'm genuinely excited to hear your perspective!",
      "Don't worry about being perfect! I really just want to understand how you think and hear your story!",
    ];

    const warmUpQuestion = [
      "So to kick things off, could you tell me a bit about yourself? Maybe your background, what you're currently working on, or what gets you excited about this field?",
      "Before we dive in, I'd love to hear about you! What's your background, and what brings you here today?",
      "Let's start with something fun! Can you give me a quick introduction about yourself? What have you been up to lately?",
      "To begin, I'd really love to hear about yourself! Your background, your interests, what got you into this field?",
    ];

    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return `${randomPick(greetings)} ${randomPick(setups)} ${randomPick(encouragements)} ${randomPick(warmUpQuestion)}`;
  }, [selectedRole, interviewDuration]);

  // Speak text and then trigger callback (for continuous conversation flow)
  const speakAndListen = useCallback(
    async (text, onComplete) => {
      console.log(
        "🔊 speakAndListen called with:",
        text?.substring(0, 50) + "..."
      );

      // Cancel any in-progress audio to prevent overlapping playback
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }

      // Always show the message as subtitle, even when muted
      setAiMessage(text);
      setIsSpeaking(true);

      try {
        // If muted, just show subtitle for a calculated duration then proceed
        if (isMuted) {
          console.log("🔇 Muted - showing subtitle only");
          setIsPlayingAudio(true); // Still set this so UI shows speaking state

          // Calculate reading time (~150 words per minute)
          const wordCount = text.split(" ").length;
          const readingTimeMs = Math.max(3000, (wordCount / 150) * 60 * 1000);

          setTimeout(() => {
            setIsPlayingAudio(false);
            setIsSpeaking(false);
            if (onComplete) onComplete();
          }, readingTimeMs);
          return;
        }

        setIsPlayingAudio(true);

        try {
          if (!serverTtsAvailable) {
            throw new Error("Chatterbox not running, using browser TTS");
          }
          console.log("📡 Calling TTS API (binary)...");
          const audioBlob = await interviewAPI.synthesizeSpeech(text);
          console.log("📡 TTS Response - Blob received:", {
            type: audioBlob?.type,
            size: audioBlob?.size,
            isBlob: audioBlob instanceof Blob,
          });

          if (audioBlob && audioBlob instanceof Blob && audioBlob.size > 0) {
            console.log("✅ Audio blob received, creating audio element");

            // Create object URL from blob (more efficient than base64)
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            setAudioRef(audio);

            audio.onended = () => {
              console.log("🔊 Audio playback ended");
              // Clean up the object URL to prevent memory leaks
              URL.revokeObjectURL(audioUrl);
              setIsPlayingAudio(false);
              setIsSpeaking(false);
              if (onComplete) onComplete();
            };

            audio.onerror = (e) => {
              console.error("❌ Audio playback failed:", e);
              URL.revokeObjectURL(audioUrl);
              setIsPlayingAudio(false);
              setIsSpeaking(false);
              if (onComplete) onComplete();
            };

            console.log("▶️ Playing audio...");
            await audio.play();
            return; // Success - exit early
          }
        } catch (ttsError) {
          console.warn(
            "⚠️ Server TTS unavailable, using browser TTS:",
            ttsError.message
          );
        }

        // Fallback: Use browser's built-in Text-to-Speech (Web Speech API)
        if ("speechSynthesis" in window) {
          console.log("🗣️ Using browser TTS as fallback...");

          return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);

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
              console.log("🗣️ Browser TTS ended");
              setIsPlayingAudio(false);
              setIsSpeaking(false);
              if (onComplete) onComplete();
              resolve();
            };

            utterance.onerror = (e) => {
              console.error("❌ Browser TTS error:", e);
              setIsPlayingAudio(false);
              setIsSpeaking(false);
              if (onComplete) onComplete();
              resolve();
            };

            window.speechSynthesis.speak(utterance);
          });
        }

        // Last resort: show subtitle for reading time
        console.warn("⚠️ No TTS available, showing subtitle only");
        const wordCount = text.split(" ").length;
        const readingTimeMs = Math.max(3000, (wordCount / 150) * 60 * 1000);

        setTimeout(() => {
          setIsPlayingAudio(false);
          setIsSpeaking(false);
          if (onComplete) onComplete();
        }, readingTimeMs);
      } catch (error) {
        console.error("❌ TTS error:", error);
        // On error, show subtitle for a few seconds then proceed
        setTimeout(() => {
          setIsPlayingAudio(false);
          setIsSpeaking(false);
          if (onComplete) onComplete();
        }, 4000);
      }
    },
    [isMuted, serverTtsAvailable]
  );

  // Generate natural, emotionally expressive acknowledgment after user's answer
  const generateAcknowledgment = useCallback((score, isFollowUp = false) => {
    const highScoreResponses = [
      "Wow, that's a fantastic answer! I really love the detail you provided!",
      "Oh, excellent point! Your experience really shines through here!",
      "That's exactly what I was hoping to hear! Really well said!",
      "I'm impressed! You've clearly given this a lot of thought!",
      "That's brilliant! I can really see your expertise in this area!",
    ];

    const midScoreResponses = [
      "Thanks for sharing that! It gives me a good sense of your approach!",
      "I appreciate you walking me through that! That's helpful!",
      "Okay, interesting! Thanks for explaining that!",
      "Got it! That makes sense. Thanks for the context!",
    ];

    const lowScoreResponses = [
      "Thanks for your answer! Let's try something a bit different.",
      "I appreciate your honesty! Let's move to another topic.",
      "Okay, thank you for that! Let me ask you something else.",
      "Thanks for sharing! Let's explore another area.",
    ];

    const transitions = [
      "So now I'm curious...",
      "Here's what I'd like to know next...",
      "So tell me...",
      "I'm really curious about...",
      "Let's dive into...",
      "Now, here's an interesting one...",
    ];

    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    let ack;
    if (score >= 70) {
      ack = randomPick(highScoreResponses);
    } else if (score >= 50) {
      ack = randomPick(midScoreResponses);
    } else {
      ack = randomPick(lowScoreResponses);
    }

    return `${ack} ${randomPick(transitions)}`;
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

        setAudioRef(audio);

        audio.onended = () => {
          console.log("🔊 Question audio ended");
          setIsPlayingAudio(false);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          setInterviewPhase("waiting");
          autoStartRecording();
        };

        audio.onerror = () => {
          console.error("❌ Question audio playback failed");
          setIsPlayingAudio(false);
          setIsSpeaking(false);
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
    // Cancel browser speech synthesis if active
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setIsSpeaking(false);
    // Transition to waiting phase when user skips audio
    setInterviewPhase("waiting");
    // Start recording if in live mode
    if (selectedMode === "live" && voiceAvailable) {
      setTimeout(() => startRecordingRef.current?.(true), 300);
    }
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

      // Use browser TTS directly
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

            try {
              setInterviewPhase("transitioning");
              const ackResponse =
                await interviewAPI.synthesizeSpeech(randomAck);
              if (ackResponse.success && ackResponse.data?.audio) {
                const ackAudioUrl = `data:audio/mpeg;base64,${ackResponse.data.audio}`;
                const ackAudio = new Audio(ackAudioUrl);
                setIsPlayingAudio(true);

                ackAudio.onended = () => {
                  setIsPlayingAudio(false);
                  updateCurrentQuestion(response.data.nextQuestion);
                  setAnswer("");
                  setEvaluation(null);
                  setInterviewPhase("asking");

                  if (response.data.nextQuestion?.audio) {
                    setTimeout(
                      () =>
                        playQuestionAudio(
                          response.data.nextQuestion.audio,
                          response.data.nextQuestion.text
                        ),
                      300
                    );
                  } else if (response.data.nextQuestion?.text) {
                    speakAndListen(response.data.nextQuestion.text, () => {
                      setInterviewPhase("waiting");
                      setTimeout(() => startRecording(true), 500);
                    });
                  }
                };

                await ackAudio.play();
              } else {
                throw new Error("No audio");
              }
            } catch {
              // TTS failed, proceed directly
              updateCurrentQuestion(response.data.nextQuestion);
              setAnswer("");
              setEvaluation(null);
              setInterviewPhase("asking");
              if (response.data.nextQuestion?.audio) {
                setTimeout(
                  () =>
                    playQuestionAudio(
                      response.data.nextQuestion.audio,
                      response.data.nextQuestion.text
                    ),
                  500
                );
              } else if (response.data.nextQuestion?.text) {
                speakAndListen(response.data.nextQuestion.text, () => {
                  setInterviewPhase("waiting");
                  setTimeout(() => startRecording(true), 500);
                });
              }
            }
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

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    const now = Date.now();
    const recordingDuration = now - (recordingStartTimeRef.current || now);

    // Only check for silence after minimum recording duration
    if (recordingDuration < MIN_RECORDING_DURATION) {
      return;
    }

    if (average < SILENCE_THRESHOLD) {
      // User is silent
      if (!silenceStartRef.current) {
        silenceStartRef.current = now;
        console.log("🔇 Silence detected, starting timer...");
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
    } else {
      // User is speaking - mark that they've spoken and reset silence timer
      if (!hasUserSpokenRef.current) {
        console.log("🎤 User started speaking!");
        hasUserSpokenRef.current = true;
      }
      if (silenceStartRef.current) {
        console.log("🎤 Speech detected, resetting silence timer");
      }
      silenceStartRef.current = null;
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

        // Generate warm, enthusiastic acknowledgment for the self-introduction
        const warmAcknowledgments = [
          `Oh, that's fantastic! Thank you so much for sharing that! I really love learning about your background! Now, I'm excited to dive into some questions about the ${selectedRole} role!`,
          `Wow, that's really interesting! Thanks for the great introduction! You clearly have some awesome experience! Let me ask you some questions about ${selectedRole}!`,
          `I love it! Thanks for telling me about yourself! It sounds like you've got some really great experience! Alright, let's dive into some questions now!`,
          `That's wonderful, thank you for sharing! It's so helpful to understand your journey! Now, let's explore your skills with some fun questions!`,
          `What a great introduction! I'm really excited to learn more about how you approach things! Let's get into the interview questions!`,
        ];

        const randomAck =
          warmAcknowledgments[
            Math.floor(Math.random() * warmAcknowledgments.length)
          ];

        // Transition to core interview
        setConversationPhase(CONVERSATION_PHASES.CORE_INTERVIEW);
        setInterviewPhase("transitioning");

        // Add acknowledgment to history
        setConversationHistory((prev) => [
          ...prev,
          {
            role: "ai",
            type: "transition",
            content: randomAck,
            timestamp: Date.now(),
          },
        ]);

        // Speak acknowledgment, then ask first technical question
        await speakAndListen(randomAck, () => {
          setInterviewPhase("asking");

          // Add first question to history
          setConversationHistory((prev) => [
            ...prev,
            {
              role: "ai",
              type: "question",
              content: currentQ?.text || "Let's start with the first question.",
              timestamp: Date.now(),
            },
          ]);

          // Speak the first technical question
          if (currentQ?.audio) {
            playQuestionAudio(currentQ.audio, currentQ.text);
          } else if (currentQ?.text) {
            speakAndListen(currentQ.text, () => {
              setInterviewPhase("waiting");
              setTimeout(() => startRecording(true), 500);
            });
          }
        });

        setIsSubmitting(false);
        return; // Don't continue to regular submission flow
      }

      // ============================================
      // LIVE MODE: Check for user queries (repeat, clarify, etc.)
      // ============================================
      if (selectedMode === "live") {
        // First, just transcribe to check if it's a query
        const transcribeCheck =
          await interviewAPI.transcribeAudioOnly(audioFile);

        if (transcribeCheck.success && transcribeCheck.data?.text) {
          const userText = transcribeCheck.data.text.toLowerCase();
          console.log("📝 Checking user text for queries:", userText);

          // Detect various user queries
          const isRepeatRequest =
            userText.includes("repeat") ||
            userText.includes("again") ||
            userText.includes("say that again") ||
            userText.includes("one more time") ||
            userText.includes("didn't hear") ||
            userText.includes("didn't catch") ||
            userText.includes("can you repeat");

          const isClarifyRequest =
            userText.includes("what do you mean") ||
            userText.includes("clarify") ||
            userText.includes("don't understand") ||
            userText.includes("didn't understand") ||
            userText.includes("confused") ||
            userText.includes("explain") ||
            userText.includes("rephrase");

          const isThinkingRequest =
            userText.includes("give me a moment") ||
            userText.includes("let me think") ||
            userText.includes("one second") ||
            userText.includes("hold on") ||
            userText.includes("wait");

          // Handle repeat request
          if (isRepeatRequest) {
            console.log("🔄 User requested question repeat");
            const repeatResponses = [
              "Of course! Let me repeat the question for you.",
              "Sure, no problem. Here's the question again.",
              "Absolutely, I'll say that again.",
            ];
            const repeatAck =
              repeatResponses[
                Math.floor(Math.random() * repeatResponses.length)
              ];

            setInterviewPhase("transitioning");
            await speakAndListen(repeatAck, () => {
              setInterviewPhase("asking");
              const questionText =
                currentQ?.text || "Let me repeat the question.";
              speakAndListen(questionText, () => {
                setInterviewPhase("waiting");
                setTimeout(() => startRecording(true), 500);
              });
            });

            setIsSubmitting(false);
            return;
          }

          // Handle clarify request
          if (isClarifyRequest) {
            console.log("❓ User requested clarification");
            const clarifyResponses = [
              `Let me put it another way. ${currentQ?.text || "What are your thoughts on this?"}`,
              `Sure, I'll try to explain differently. Essentially, I'm asking about ${currentQ?.category || "your experience"} - ${currentQ?.text || "can you share your approach?"}`,
              `No worries! In simpler terms: ${currentQ?.text || "Tell me about your experience with this."}`,
            ];
            const clarifyResponse =
              clarifyResponses[
                Math.floor(Math.random() * clarifyResponses.length)
              ];

            setInterviewPhase("transitioning");
            await speakAndListen(clarifyResponse, () => {
              setInterviewPhase("waiting");
              setTimeout(() => startRecording(true), 500);
            });

            setIsSubmitting(false);
            return;
          }

          // Handle thinking request
          if (isThinkingRequest) {
            console.log("🤔 User needs thinking time");
            const thinkingResponses = [
              "Take your time, there's no rush.",
              "Of course, take a moment to think it through.",
              "Sure, I'll wait. Just let me know when you're ready.",
            ];
            const thinkingResponse =
              thinkingResponses[
                Math.floor(Math.random() * thinkingResponses.length)
              ];

            setInterviewPhase("transitioning");
            await speakAndListen(thinkingResponse, () => {
              setInterviewPhase("waiting");
              // Give extra time before starting to record again
              setTimeout(() => startRecording(true), 3000);
            });

            setIsSubmitting(false);
            return;
          }

          // Check if response is too short to be a real answer (might be filler words)
          const wordCount = userText
            .split(" ")
            .filter((w) => w.length > 0).length;
          if (wordCount < 5) {
            console.log(
              "⚠️ Response too short, might be filler. Words:",
              wordCount
            );
            const shortResponses = [
              "I didn't quite catch that. Could you elaborate a bit more?",
              "Could you tell me more about that?",
              "I'd love to hear more details. Can you expand on that?",
            ];
            const shortResponse =
              shortResponses[Math.floor(Math.random() * shortResponses.length)];

            setInterviewPhase("transitioning");
            await speakAndListen(shortResponse, () => {
              setInterviewPhase("waiting");
              setTimeout(() => startRecording(true), 500);
            });

            setIsSubmitting(false);
            return;
          }
        }
      }

      // ============================================
      // REGULAR FLOW: Submit answer for evaluation
      // ============================================
      const response = await interviewAPI.submitVoiceAnswer(
        currentSession.id,
        audioFile,
        currentQ.number
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to process voice answer");
      }

      const transcribedText = response.data.transcription.text;
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

      // Check time remaining for phase management (use ref for immediate access)
      const currentStartTime = startTimeRef.current || Date.now();
      const elapsed = Math.floor((Date.now() - currentStartTime) / 1000);
      const totalDurationSec = interviewDuration * 60;
      const remainingTime = totalDurationSec - elapsed;

      console.log("⏱️ Time check:", {
        elapsed,
        totalDurationSec,
        remainingTime,
        isComplete: response.data.isComplete,
      });
      console.log("📊 Response data:", {
        hasNextQuestion: !!response.data.nextQuestion,
        nextQuestionText: response.data.nextQuestion?.text?.substring(0, 50),
      });

      // Only end interview if BOTH isComplete is true AND we're past the minimum time
      // This prevents premature endings due to backend configuration
      const shouldEndInterview = response.data.isComplete && elapsed >= 60; // At least 1 minute
      const timeAlmostUp = remainingTime <= 30 && elapsed >= 60;

      if (shouldEndInterview || timeAlmostUp) {
        // Time's almost up or interview complete
        const closingMessage =
          "We've covered a lot of ground today. Thank you so much for your time and thoughtful responses. Let me put together your feedback.";
        setConversationPhase(CONVERSATION_PHASES.COMPLETED);

        await speakAndListen(closingMessage, async () => {
          setInterviewPhase("idle");
          await handleCompleteInterview();
        });
      } else if (response.data.nextQuestion) {
        // Natural conversation flow - acknowledgment then next question
        if (selectedMode === "live") {
          const score = response.data.evaluation?.score || 60;
          const ack = generateAcknowledgment(score);

          setInterviewPhase("transitioning");

          // Add AI acknowledgment to history
          setConversationHistory((prev) => [
            ...prev,
            {
              role: "ai",
              type: "acknowledgment",
              content: ack,
              timestamp: Date.now(),
            },
          ]);

          // Speak acknowledgment, then question, then listen
          await speakAndListen(ack, () => {
            updateCurrentQuestion(response.data.nextQuestion);
            setAnswer("");
            setEvaluation(null); // Don't show evaluation in live mode
            setInterviewPhase("asking");

            // Add question to history
            setConversationHistory((prev) => [
              ...prev,
              {
                role: "ai",
                type: "question",
                content: response.data.nextQuestion.text,
                timestamp: Date.now(),
              },
            ]);

            // Speak the question then start listening
            if (response.data.nextQuestion?.audio) {
              playQuestionAudio(
                response.data.nextQuestion.audio,
                response.data.nextQuestion.text
              );
            } else {
              speakAndListen(response.data.nextQuestion.text, () => {
                setInterviewPhase("waiting");
                setTimeout(() => startRecording(true), 500);
              });
            }
          });
        } else {
          // Non-live mode - show evaluation briefly
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
        // No next question but interview shouldn't end yet - might be an edge case
        console.warn(
          "⚠️ No next question received, but interview not complete. Completing interview..."
        );
        await handleCompleteInterview();
      }
    } catch (error) {
      console.error("Failed to submit voice answer:", error);
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
    // Mark interview as inactive FIRST to prevent any further processing
    isInterviewActiveRef.current = false;

    // Use ref for immediate access (may be called from callback chain)
    const currentSession = sessionRef.current;

    // Stop all recording/audio resources first
    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
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

    if (audioRef) {
      audioRef.pause();
      setIsPlayingAudio(false);
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

      // Close audio context
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.log("AudioContext already closed");
        }
        audioContextRef.current = null;
        analyserRef.current = null;
      }

      // Stop any playing audio
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
        setIsPlayingAudio(false);
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

    // Close audio context
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Already closed
      }
      audioContextRef.current = null;
      analyserRef.current = null;
    }

    // Reset all refs
    silenceStartRef.current = null;
    recordingStartTimeRef.current = null;
    startTimeRef.current = null;
    hasUserSpokenRef.current = false;
    silencePromptCountRef.current = 0;

    // Reset all state
    updateSession(null);
    updateCurrentQuestion(null);
    setAnswer("");
    setEvaluation(null);
    setResult(null);
    setStartTime(null);
    setElapsedTime(0);
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
      {/* Ambient gradient blur effects */}
      <div className="fixed top-40 left-20 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed top-60 right-20 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center relative">
          {/* Interview History Button - Top Right */}
          <button
            onClick={() => navigate("/interview/history")}
            className="absolute right-0 top-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Interview History</span>
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:backdrop-blur-xl border border-purple-500/20 dark:border-white/10 rounded-full text-sm font-medium text-purple-600 dark:text-purple-300 shadow-lg mb-6">
            <Sparkles className="w-4 h-4" />
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

        {/* Interview Step */}
        {step === "interview" && (
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
            onToggleMute={() => setIsMuted(!isMuted)}
            onSubmitAnswer={handleSubmitAnswer}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onSkip={handleSkipQuestion}
            onAbandon={handleAbandonInterview}
            onStopAudio={stopAudio}
          />
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
          <Target className="w-5 h-5 text-purple-500" />
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
                  className={`w-6 h-6 mb-2 ${selectedType === type.id ? "text-purple-500" : "text-gray-500 dark:text-gray-400"}`}
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
            <Briefcase className="w-5 h-5 text-purple-500" />
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
            <Award className="w-5 h-5 text-purple-500" />
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
            <FileText className="w-5 h-5 text-purple-500" />
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
            <Briefcase className="w-5 h-5 text-purple-500" />
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
            <MessageSquare className="w-5 h-5 text-purple-500" />
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
                className={`w-6 h-6 ${selectedMode === "text" ? "text-purple-500" : "text-gray-500 dark:text-gray-400"}`}
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
                    ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 shadow-lg shadow-blue-500/20"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-300 dark:hover:border-blue-500/50"
              }`}
            >
              <Mic
                className={`w-6 h-6 ${selectedMode === "voice" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
              />
              <span className="font-medium text-gray-900 dark:text-white">
                Voice
              </span>
              {!voiceAvailable && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Unavailable
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
                    ? "border-emerald-500 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 shadow-lg shadow-emerald-500/20"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-emerald-300 dark:hover:border-emerald-500/50"
              }`}
            >
              <Volume2
                className={`w-6 h-6 ${selectedMode === "live" ? "text-emerald-500" : "text-gray-500 dark:text-gray-400"}`}
              />
              <span className="font-medium text-gray-900 dark:text-white">
                Live
              </span>
              {!voiceAvailable || !ttsAvailable ? (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Unavailable
                </span>
              ) : (
                <span className="text-xs text-emerald-500">Voice-to-Voice</span>
              )}
            </button>
          </div>
          {selectedMode === "live" && (
            <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
              🎙️ Natural conversation mode: AI speaks questions aloud and
              listens for your responses automatically. No buttons needed - just
              talk naturally!
            </p>
          )}

          {/* Voice Test Section - Only show when TTS is available */}
          {ttsAvailable && (
            <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Test AI Interviewer Voice (Rachel)
                  </span>
                </div>
                {isPlayingAudio && (
                  <span className="text-xs text-purple-500 animate-pulse flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    Playing...
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onTestVoice("greeting")}
                  disabled={isTestingVoice || isPlayingAudio}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/10 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  🎙️ Greeting
                </button>
                <button
                  onClick={() => onTestVoice("question")}
                  disabled={isTestingVoice || isPlayingAudio}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ❓ Question
                </button>
                <button
                  onClick={() => onTestVoice("acknowledgment")}
                  disabled={isTestingVoice || isPlayingAudio}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ✅ Acknowledgment
                </button>
                <button
                  onClick={() => onTestVoice("closing")}
                  disabled={isTestingVoice || isPlayingAudio}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-white/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  👋 Closing
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                Click to hear how the AI interviewer will sound during your
                interview
              </p>
            </div>
          )}
        </div>

        {/* Interview Duration */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Timer className="w-5 h-5 text-purple-500" />
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
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
            The interview will naturally conclude when time is up
          </p>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        disabled={isSubmitting || !selectedType || !selectedRole}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:shadow-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting Interview...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
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
          icon: Bot,
          text: "Hello! Getting things ready...",
          bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
          iconClass: "text-indigo-500 animate-pulse",
          textClass: "text-indigo-600 dark:text-indigo-400",
        };
      case "asking":
        return {
          icon: Bot,
          text: "Listening to interviewer...",
          bgClass: "bg-purple-50 dark:bg-purple-900/20",
          iconClass: "text-purple-500",
          textClass: "text-purple-600 dark:text-purple-400",
        };
      case "waiting":
        return {
          icon: Radio,
          text: isRecording ? "Listening to you..." : "Your turn to speak",
          bgClass: isRecording
            ? "bg-green-50 dark:bg-green-900/20"
            : "bg-blue-50 dark:bg-blue-900/20",
          iconClass: isRecording
            ? "text-green-500 animate-pulse"
            : "text-blue-500",
          textClass: isRecording
            ? "text-green-600 dark:text-green-400"
            : "text-blue-600 dark:text-blue-400",
        };
      case "processing":
        return {
          icon: Loader2,
          text: "Thinking...",
          bgClass: "bg-yellow-50 dark:bg-yellow-900/20",
          iconClass: "text-yellow-500 animate-spin",
          textClass: "text-yellow-600 dark:text-yellow-400",
        };
      case "evaluation":
        return {
          icon: Star,
          text: "Great! Processing...",
          bgClass: "bg-green-50 dark:bg-green-900/20",
          iconClass: "text-green-500",
          textClass: "text-green-600 dark:text-green-400",
        };
      case "transitioning":
        return {
          icon: Bot,
          text: "Interviewer is responding...",
          bgClass: "bg-teal-50 dark:bg-teal-900/20",
          iconClass: "text-teal-500 animate-pulse",
          textClass: "text-teal-600 dark:text-teal-400",
        };
      default:
        return null;
    }
  };

  const phaseStatus = getPhaseStatus();

  return (
    <div className="space-y-6">
      {/* Progress Bar - Time-based for live mode */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-5">
        <div className="flex justify-between items-center mb-3">
          {selectedMode === "live" ? (
            <>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {progress.current > 0
                  ? `Question ${progress.current}`
                  : "Starting..."}
              </span>
              <span
                className={`text-sm font-medium flex items-center gap-1 ${isTimeWarning ? "text-orange-500" : "text-gray-600 dark:text-gray-400"}`}
              >
                <Clock className="w-4 h-4" />
                {remainingMinutes > 0
                  ? `${remainingMinutes}m remaining`
                  : "Wrapping up..."}
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Question {progress.current} of {progress.total}
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(elapsedTime)}
              </span>
            </>
          )}
        </div>
        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              selectedMode === "live"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-purple-500 to-blue-500"
            }`}
            style={{
              width:
                selectedMode === "live"
                  ? `${(elapsedTime / (interviewDuration * 60)) * 100}%`
                  : `${progress.percentage}%`,
            }}
          />
        </div>

        {/* Phase Status Indicator for Live Mode */}
        {phaseStatus && (
          <div
            className={`mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border ${phaseStatus.bgClass} border-opacity-50`}
          >
            <phaseStatus.icon className={`w-4 h-4 ${phaseStatus.iconClass}`} />
            <span className={`text-sm font-medium ${phaseStatus.textClass}`}>
              {phaseStatus.text}
            </span>
          </div>
        )}
      </div>

      {/* Natural Conversation Interface - Only for Live Mode */}
      {selectedMode === "live" && (
        <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 dark:from-slate-950 dark:via-purple-950/50 dark:to-slate-950 backdrop-blur-xl rounded-2xl border border-purple-500/30 dark:border-white/10 shadow-2xl overflow-hidden min-h-[400px] relative">
          {/* Video call style background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          </div>

          {/* Main content area - like a video call */}
          <div className="relative p-6 flex flex-col h-full min-h-[400px]">
            {/* Header - interviewer info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`relative`}>
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg ${
                      isPlayingAudio ||
                      interviewPhase === "greeting" ||
                      interviewPhase === "transitioning"
                        ? "ring-2 ring-purple-400/50 animate-pulse"
                        : ""
                    }`}
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  {/* Status dot */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                      isPlayingAudio
                        ? "bg-purple-500 animate-pulse"
                        : isRecording
                          ? "bg-green-500"
                          : interviewPhase === "processing"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">
                    AI Interviewer
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {isPlayingAudio
                      ? "Speaking..."
                      : isRecording
                        ? "Listening to you"
                        : interviewPhase === "processing"
                          ? "Thinking..."
                          : "Ready"}
                  </p>
                </div>
              </div>

              {/* Time remaining */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  isTimeWarning
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-white/10 text-gray-300"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {remainingMinutes}:
                  {String(remainingSeconds % 60).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Main visual area - AI visualization */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                {/* Large AI avatar/visualization */}
                <div
                  className={`relative mx-auto mb-6 ${isPlayingAudio ? "scale-110" : ""} transition-transform duration-300`}
                >
                  <div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center ${
                      isPlayingAudio ? "animate-pulse" : ""
                    }`}
                  >
                    <div
                      className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl ${
                        isPlayingAudio
                          ? "ring-4 ring-purple-400/50"
                          : isRecording
                            ? "ring-4 ring-green-400/50"
                            : ""
                      }`}
                    >
                      {isPlayingAudio ||
                      interviewPhase === "greeting" ||
                      interviewPhase === "transitioning" ? (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 bg-white rounded-full animate-pulse"
                              style={{
                                height: `${16 + Math.random() * 20}px`,
                                animationDelay: `${i * 100}ms`,
                                animationDuration: "0.4s",
                              }}
                            />
                          ))}
                        </div>
                      ) : interviewPhase === "processing" ? (
                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                      ) : isRecording ? (
                        <Mic className="w-12 h-12 text-green-400 animate-pulse" />
                      ) : (
                        <Bot className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </div>
                  {/* Audio waves when speaking */}
                  {isPlayingAudio && (
                    <>
                      <div
                        className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-ping"
                        style={{animationDuration: "1.5s"}}
                      />
                      <div
                        className="absolute inset-0 rounded-full border-2 border-purple-400/20 animate-ping"
                        style={{
                          animationDuration: "2s",
                          animationDelay: "0.5s",
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Status text */}
                <p className="text-gray-400 text-sm mb-2">
                  {isPlayingAudio
                    ? "Interviewer is speaking"
                    : isRecording
                      ? "Listening to your response..."
                      : interviewPhase === "processing"
                        ? "Processing your answer..."
                        : interviewPhase === "greeting"
                          ? "Interview starting..."
                          : "Ready"}
                </p>
              </div>
            </div>

            {/* User speaking indicator (bottom right corner) */}
            {isRecording && interviewPhase === "waiting" && (
              <div className="absolute bottom-20 right-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg ring-2 ring-green-400/50 animate-pulse">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-green-500 rounded-full text-[10px] font-medium text-white">
                    YOU
                  </div>
                </div>
              </div>
            )}

            {/* Subtitles area - like video call closed captions */}
            <div className="mt-auto">
              {/* AI Message Subtitle - Always show when AI has something to say */}
              {aiMessage &&
                (isSpeaking ||
                  isPlayingAudio ||
                  interviewPhase === "greeting" ||
                  interviewPhase === "transitioning" ||
                  interviewPhase === "asking") && (
                  <div className="bg-black/70 backdrop-blur-sm rounded-xl px-6 py-4 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <p className="text-white text-base leading-relaxed">
                        {aiMessage}
                      </p>
                    </div>
                  </div>
                )}

              {/* User Response Subtitle */}
              {answer &&
                (interviewPhase === "processing" ||
                  interviewPhase === "transitioning") && (
                  <div className="bg-green-900/50 backdrop-blur-sm rounded-xl px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <p className="text-white text-base leading-relaxed italic">
                        "{answer}"
                      </p>
                    </div>
                  </div>
                )}

              {/* Recording indicator subtitle */}
              {isRecording && interviewPhase === "waiting" && !answer && (
                <div className="bg-green-900/50 backdrop-blur-sm rounded-xl px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                      <Mic className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-green-300 text-base">
                      Speak now... I'll know when you're done
                    </p>
                    <div className="flex gap-1 ml-auto">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-green-400 rounded-full animate-pulse"
                          style={{
                            height: "12px",
                            animationDelay: `${i * 150}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom controls bar */}
          <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPlayingAudio || isRecording
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-500"
                }`}
              />
              <span>
                {isPlayingAudio
                  ? "AI Speaking"
                  : isRecording
                    ? "Recording"
                    : "Standby"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Mute/Unmute Button */}
              <button
                onClick={onToggleMute}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                  isMuted
                    ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
                    : "bg-white/10 hover:bg-white/20 text-gray-300"
                }`}
                title={isMuted ? "Unmute AI" : "Mute AI"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                {isMuted ? "Unmute" : "Mute"}
              </button>

              {isPlayingAudio && (
                <button
                  onClick={onStopAudio}
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-all flex items-center gap-1.5"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Skip
                </button>
              )}
              <button
                onClick={onAbandon}
                className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all flex items-center gap-1.5"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Card - Only for NON-Live Modes */}
      {selectedMode !== "live" && (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-500/30">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                {currentQuestion?.number}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">
                  {currentQuestion?.type}
                </span>
                {currentQuestion?.category && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                    {currentQuestion.category}
                  </span>
                )}
                {currentQuestion?.isFollowUp && (
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs rounded-full font-medium">
                    Follow-up
                  </span>
                )}
                {selectedMode === "live" && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full flex items-center gap-1 font-medium">
                    <Volume2 className="w-3 h-3" />
                    Live
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                {currentQuestion?.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Answer Section - Only for Non-Live Modes */}
      {selectedMode !== "live" && !evaluation && (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Answer
          </h3>

          {selectedMode === "text" ? (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be specific and provide examples when possible."
              rows={6}
              disabled={isSubmitting}
              className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          ) : (
            <div className="flex flex-col items-center py-8">
              <button
                onClick={isRecording ? onStopRecording : onStartRecording}
                disabled={isSubmitting}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isRecording
                    ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 animate-pulse shadow-red-500/40"
                    : "bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 shadow-blue-500/40"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isRecording ? (
                  <MicOff className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {isRecording
                  ? "Recording... Click to stop"
                  : "Click to start recording"}
              </p>
              {isRecording && (
                <p className="text-sm text-red-400 mt-2 animate-pulse">
                  Max 90 seconds
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {selectedMode === "text" && (
              <button
                onClick={onSubmitAnswer}
                disabled={isSubmitting || !answer.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl disabled:shadow-none"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ChevronRight className="w-5 h-5" />
                    Submit Answer
                  </>
                )}
              </button>
            )}
            <button
              onClick={onSkip}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-xl hover:border-gray-400 dark:hover:border-white/30 flex items-center gap-2 transition-all"
            >
              <SkipForward className="w-5 h-5" />
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Evaluation Display - Only for text/voice mode, not live */}
      {evaluation && selectedMode !== "live" && (
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                evaluation.score >= 70
                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 border border-green-500/30"
                  : evaluation.score >= 50
                    ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 dark:from-yellow-500/30 dark:to-orange-500/30 border border-yellow-500/30"
                    : "bg-gradient-to-br from-red-500/20 to-pink-500/20 dark:from-red-500/30 dark:to-pink-500/30 border border-red-500/30"
              }`}
            >
              <span
                className={`text-2xl font-bold ${
                  evaluation.score >= 70
                    ? "text-green-600 dark:text-green-400"
                    : evaluation.score >= 50
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                }`}
              >
                {evaluation.score}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Answer Evaluation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {evaluation.feedback}
              </p>
            </div>
          </div>

          {evaluation.strengths?.length > 0 && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
              <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1 mb-2">
                <CheckCircle className="w-4 h-4" /> Strengths
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                {evaluation.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.improvementTips?.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
              <h4 className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-2">
                <TrendingUp className="w-4 h-4" /> Improvement Tips
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                {evaluation.improvementTips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center animate-pulse">
            Moving to next question...
          </p>
        </div>
      )}

      {/* End Interview Button - Different style for live mode */}
      <button
        onClick={onAbandon}
        className={`text-sm flex items-center gap-1 mx-auto transition-colors py-2 px-4 rounded-lg ${
          selectedMode === "live"
            ? "text-gray-400 hover:text-red-400 opacity-60 hover:opacity-100"
            : "text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
        }`}
      >
        {selectedMode === "live" ? (
          <>
            <PhoneOff className="w-4 h-4" />
            End Call
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4" />
            End Interview Early
          </>
        )}
      </button>
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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:backdrop-blur-xl border border-purple-500/20 dark:border-white/10 rounded-full text-sm font-medium text-purple-600 dark:text-purple-300 shadow-lg mb-6">
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
          <BarChart3 className="w-5 h-5 text-purple-500" />
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
            <BookOpen className="w-5 h-5 text-purple-500" />
            Recommended Practice Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.practiceAreas.map((area, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium border border-purple-500/20"
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
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
        >
          <RefreshCw className="w-5 h-5" />
          Practice Again
        </button>
        <button
          onClick={onViewHistory}
          className="flex-1 py-4 bg-white/10 hover:bg-white/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:border-purple-500/50 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <BarChart3 className="w-5 h-5" />
          View History
        </button>
      </div>
    </div>
  );
};

export default AIInterview;
