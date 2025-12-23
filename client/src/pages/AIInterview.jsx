import {useState, useEffect, useCallback} from "react";
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
  Loader2,
  FileText,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Star,
} from "lucide-react";

// Interview type icons
const typeIcons = {
  "resume-based": FileText,
  "job-description": Briefcase,
  technical: Code,
  behavioral: Users,
  mixed: Sparkles,
};

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
  const [questionCount, setQuestionCount] = useState(10);

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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  // Result state
  const [result, setResult] = useState(null);

  // Timer state
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

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

  // Timer effect
  useEffect(() => {
    let interval;
    if (step === "interview" && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, startTime]);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Play audio from base64 data (for live mode)
  const playQuestionAudio = useCallback(
    async (audioData) => {
      if (!audioData?.audioBase64) return;

      try {
        setIsPlayingAudio(true);
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
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
          // Transition to waiting phase after AI finishes speaking
          setInterviewPhase("waiting");
          // Auto-start recording after question plays in live mode
          if (selectedMode === "live" && voiceAvailable) {
            toast("🎤 Your turn to answer...", {duration: 2000, icon: "🎙️"});
            setTimeout(() => startRecording(), 500);
          }
        };

        audio.onerror = () => {
          setIsPlayingAudio(false);
          setInterviewPhase("waiting"); // Still allow answering
          console.error("Failed to play audio");
        };

        await audio.play();
      } catch (error) {
        console.error("Audio playback error:", error);
        setIsPlayingAudio(false);
        setInterviewPhase("waiting"); // Allow answering even if audio fails
        // Still try to start recording in live mode
        if (selectedMode === "live" && voiceAvailable) {
          toast("🎤 Your turn to answer...", {duration: 2000, icon: "🎙️"});
          setTimeout(() => startRecording(), 500);
        }
      }
    },
    [selectedMode, voiceAvailable]
  );

  // Stop audio playback
  const stopAudio = () => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsPlayingAudio(false);
      // Transition to waiting phase when user skips audio
      setInterviewPhase("waiting");
      // Start recording if in live mode
      if (selectedMode === "live" && voiceAvailable) {
        toast("🎤 Your turn to answer...", {duration: 2000, icon: "🎙️"});
        setTimeout(() => startRecording(), 500);
      }
    }
  };

  // Start interview
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
      // Create session
      const createRes = await interviewAPI.createSession({
        interviewType: selectedType,
        role: selectedRole,
        experienceLevel: selectedLevel,
        mode: selectedMode,
        resumeId: selectedResume || undefined,
        jobDescription:
          selectedType === "job-description" ? jobDescription : undefined,
        totalQuestions: questionCount,
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

      setSession({id: createRes.data.sessionId, ...createRes.data});
      setCurrentQuestion(startRes.data.currentQuestion);
      setProgress(startRes.data.progress);
      setStartTime(Date.now());
      setStep("interview");
      setInterviewPhase("greeting"); // AI is greeting first

      // Generate greeting based on role and mode
      const greetingText = `Hello! Welcome to your ${selectedRole} interview. I'm your AI interviewer today. I'll be asking you ${questionCount} questions to assess your skills and experience. Take your time with each answer, and feel free to provide detailed examples from your experience. Let's begin with your first question.`;

      // Play greeting audio in live mode
      if (selectedMode === "live") {
        try {
          toast("🎤 AI Interviewer is introducing...", {
            duration: 2000,
            icon: "👋",
          });
          const ttsResponse = await interviewAPI.synthesizeSpeech(greetingText);
          if (ttsResponse.success && ttsResponse.data?.audio) {
            const greetingAudioUrl = `data:audio/mpeg;base64,${ttsResponse.data.audio}`;
            const greetingAudio = new Audio(greetingAudioUrl);

            setIsPlayingAudio(true);
            greetingAudio.onended = () => {
              setIsPlayingAudio(false);
              // Now play the first question
              setInterviewPhase("asking");
              if (startRes.data.currentQuestion?.audio) {
                setTimeout(() => {
                  playQuestionAudio(startRes.data.currentQuestion.audio);
                }, 500);
              } else {
                setInterviewPhase("waiting");
              }
            };

            await greetingAudio.play();
          } else {
            // TTS failed, just show greeting and proceed
            toast.success(greetingText.substring(0, 100) + "...");
            setInterviewPhase("asking");
            if (startRes.data.currentQuestion?.audio) {
              setTimeout(() => {
                playQuestionAudio(startRes.data.currentQuestion.audio);
              }, 2000);
            } else {
              setTimeout(() => setInterviewPhase("waiting"), 2000);
            }
          }
        } catch (ttsError) {
          console.error("TTS greeting failed:", ttsError);
          setInterviewPhase("asking");
          if (startRes.data.currentQuestion?.audio) {
            setTimeout(() => {
              playQuestionAudio(startRes.data.currentQuestion.audio);
            }, 1000);
          } else {
            setTimeout(() => setInterviewPhase("waiting"), 1500);
          }
        }
      } else {
        // For text/voice mode, show greeting toast and proceed
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
                  setCurrentQuestion(response.data.nextQuestion);
                  setAnswer("");
                  setEvaluation(null);
                  setInterviewPhase("asking");

                  if (response.data.nextQuestion?.audio) {
                    setTimeout(
                      () => playQuestionAudio(response.data.nextQuestion.audio),
                      300
                    );
                  }
                };

                await ackAudio.play();
              } else {
                throw new Error("No audio");
              }
            } catch {
              // TTS failed, proceed directly
              setCurrentQuestion(response.data.nextQuestion);
              setAnswer("");
              setEvaluation(null);
              setInterviewPhase("asking");
              if (response.data.nextQuestion?.audio) {
                setTimeout(
                  () => playQuestionAudio(response.data.nextQuestion.audio),
                  500
                );
              }
            }
          } else {
            // Non-live mode
            setCurrentQuestion(response.data.nextQuestion);
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

  // Voice recording handlers
  const startRecording = async () => {
    // Phase guard: Only allow recording when waiting for user's answer
    if (interviewPhase !== "waiting") {
      console.log("⚠️ Cannot start recording - current phase:", interviewPhase);
      if (interviewPhase === "asking") {
        toast("Please wait for the question to finish", {icon: "⏳"});
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});

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

        const blob = new Blob(chunks, {type: mimeType});
        stream.getTracks().forEach((track) => track.stop());

        if (blob.size === 0) {
          toast.error("No audio was recorded. Please try again.");
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

      // Auto-stop after 90 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          setIsRecording(false);
          toast("Recording stopped (90 second limit)");
        }
      }, 90000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Microphone access denied or not available");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceSubmit = async (audioBlob) => {
    console.log("🎤 handleVoiceSubmit called");
    console.log("  - audioBlob:", audioBlob);
    console.log("  - audioBlob.size:", audioBlob?.size);
    console.log("  - audioBlob.type:", audioBlob?.type);
    console.log("  - session:", session);
    console.log("  - session.id:", session?.id);
    console.log("  - currentQuestion.number:", currentQuestion?.number);

    if (!audioBlob || audioBlob.size === 0) {
      toast.error("No audio recorded. Please try again.");
      return;
    }

    if (!session?.id) {
      toast.error("Session not found. Please restart the interview.");
      return;
    }

    setIsSubmitting(true);
    setEvaluation(null);
    setInterviewPhase("processing"); // Processing voice answer

    try {
      // Use the blob's actual type, determine file extension
      const mimeType = audioBlob.type || "audio/webm";
      const extension = mimeType.includes("webm")
        ? "webm"
        : mimeType.includes("mp4")
          ? "m4a"
          : "webm";

      const audioFile = new File([audioBlob], `answer.${extension}`, {
        type: mimeType,
      });
      console.log(
        "  - audioFile created:",
        audioFile.name,
        audioFile.size,
        "bytes",
        audioFile.type
      );

      const response = await interviewAPI.submitVoiceAnswer(
        session.id,
        audioFile,
        currentQuestion.number
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to process voice answer");
      }

      setAnswer(response.data.transcription.text); // Show transcribed text
      setEvaluation(response.data.evaluation);
      setProgress(response.data.progress);
      setInterviewPhase("evaluation"); // Show evaluation

      // Show shorter toast for live mode
      if (selectedMode === "live") {
        toast.success("Answer processed", {duration: 1500});
      } else {
        toast.success(
          `Transcribed: "${response.data.transcription.text.substring(0, 50)}..."`
        );
      }

      if (response.data.isComplete) {
        toast.success("Interview complete! Generating your report...");
        setInterviewPhase("idle");
        await handleCompleteInterview();
      } else if (response.data.nextQuestion) {
        // Show evaluation briefly, then add natural AI transition
        const showEvalDuration = selectedMode === "live" ? 2500 : 3000;

        setTimeout(async () => {
          // Generate AI acknowledgment phrase based on score
          if (selectedMode === "live") {
            const acknowledgments =
              response.data.evaluation.score >= 70
                ? [
                    "Great answer! Let me move to the next question.",
                    "That's a solid response. Here's your next question.",
                    "Well explained! Moving on to the next one.",
                  ]
                : response.data.evaluation.score >= 50
                  ? [
                      "Thank you for that response. Let's continue.",
                      "Noted. Here's the next question for you.",
                      "Alright, let's move forward.",
                    ]
                  : [
                      "I appreciate your answer. Let's try another question.",
                      "Okay, let's continue with the next one.",
                      "Thank you. Moving to the next question.",
                    ];

            const randomAck =
              acknowledgments[
                Math.floor(Math.random() * acknowledgments.length)
              ];

            try {
              // Synthesize acknowledgment
              setInterviewPhase("transitioning");
              const ackResponse =
                await interviewAPI.synthesizeSpeech(randomAck);
              if (ackResponse.success && ackResponse.data?.audio) {
                const ackAudioUrl = `data:audio/mpeg;base64,${ackResponse.data.audio}`;
                const ackAudio = new Audio(ackAudioUrl);
                setIsPlayingAudio(true);

                ackAudio.onended = () => {
                  setIsPlayingAudio(false);
                  setCurrentQuestion(response.data.nextQuestion);
                  setAnswer("");
                  setEvaluation(null);
                  setInterviewPhase("asking");

                  // Play next question audio
                  if (response.data.nextQuestion?.audio) {
                    setTimeout(() => {
                      playQuestionAudio(response.data.nextQuestion.audio);
                    }, 300);
                  }
                };

                await ackAudio.play();
              } else {
                throw new Error("No audio");
              }
            } catch (ackError) {
              console.log("Acknowledgment TTS failed, proceeding directly");
              setCurrentQuestion(response.data.nextQuestion);
              setAnswer("");
              setEvaluation(null);
              setInterviewPhase("asking");

              if (response.data.nextQuestion?.audio) {
                setTimeout(() => {
                  playQuestionAudio(response.data.nextQuestion.audio);
                }, 500);
              }
            }
          } else {
            // Non-live mode - just proceed
            setCurrentQuestion(response.data.nextQuestion);
            setAnswer("");
            setEvaluation(null);
            setInterviewPhase("waiting");
          }
        }, showEvalDuration);
      }
    } catch (error) {
      console.error("Failed to submit voice answer:", error);
      toast.error(error.message || "Failed to process voice answer");
      setInterviewPhase("waiting"); // Go back to waiting state on error
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

    console.log("🔄 Skipping question:", {
      sessionId: session?.id,
      questionNumber: currentQuestion?.number,
    });

    setIsSubmitting(true);
    try {
      const response = await interviewAPI.skipQuestion(
        session.id,
        currentQuestion.number
      );

      console.log("✅ Skip response:", response);

      if (!response.success) {
        throw new Error(response.error || "Failed to skip question");
      }

      setProgress(response.data.progress);

      if (response.data.isComplete) {
        await handleCompleteInterview();
      } else if (response.data.nextQuestion) {
        setCurrentQuestion(response.data.nextQuestion);
        setAnswer("");
        setEvaluation(null);
        setInterviewPhase("asking");

        // Play next question audio in live mode
        if (selectedMode === "live" && response.data.nextQuestion?.audio) {
          setTimeout(() => {
            playQuestionAudio(response.data.nextQuestion.audio);
          }, 500);
        } else if (selectedMode === "live") {
          // No audio, go straight to waiting
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
    try {
      console.log("🏁 Completing interview:", session?.id);
      const response = await interviewAPI.completeSession(session.id);

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

    console.log("🚫 Abandoning interview:", session?.id);

    try {
      // Stop any ongoing recording
      if (isRecording && mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
      }

      // Stop any playing audio
      if (audioRef) {
        audioRef.pause();
        setIsPlayingAudio(false);
      }

      await interviewAPI.abandonSession(session.id);
      console.log("✅ Interview abandoned successfully");
      toast.success("Interview ended");
      setStep("setup");
      setInterviewPhase("idle");
      resetState();
    } catch (error) {
      console.error("❌ Failed to abandon interview:", error);
      toast.error(error.message || "Failed to end interview");
    }
  };

  // Reset state
  const resetState = () => {
    setSession(null);
    setCurrentQuestion(null);
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
  };

  // Start new interview
  const handleNewInterview = () => {
    resetState();
    setStep("setup");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0C0C0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
            <Loader2 className="w-8 h-8 animate-spin text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading interview...
          </p>
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
        <div className="mb-10 text-center">
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
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            voiceAvailable={voiceAvailable}
            ttsAvailable={ttsAvailable}
            isSubmitting={isSubmitting}
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
            answer={answer}
            setAnswer={setAnswer}
            evaluation={evaluation}
            selectedMode={selectedMode}
            isRecording={isRecording}
            isSubmitting={isSubmitting}
            isPlayingAudio={isPlayingAudio}
            interviewPhase={interviewPhase}
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
  questionCount,
  setQuestionCount,
  voiceAvailable,
  ttsAvailable,
  isSubmitting,
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
              🎙️ AI interviewer will speak questions aloud. Recording starts
              automatically after each question.
            </p>
          )}
        </div>

        {/* Question Count */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Number of Questions
          </h2>
          <input
            type="range"
            min="5"
            max="15"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-3">
            <span>5 (Quick)</span>
            <span className="font-bold text-purple-500 text-lg">
              {questionCount}
            </span>
            <span>15 (Thorough)</span>
          </div>
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
  answer,
  setAnswer,
  evaluation,
  selectedMode,
  isRecording,
  isSubmitting,
  isPlayingAudio,
  interviewPhase,
  onSubmitAnswer,
  onStartRecording,
  onStopRecording,
  onSkip,
  onAbandon,
  onStopAudio,
}) => {
  // Helper to get phase status message
  const getPhaseStatus = () => {
    if (selectedMode !== "live") return null;

    switch (interviewPhase) {
      case "greeting":
        return {
          icon: Volume2,
          text: "AI Interviewer is introducing...",
          bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
          iconClass: "text-indigo-500 animate-pulse",
          textClass: "text-indigo-600 dark:text-indigo-400",
        };
      case "asking":
        return {
          icon: Volume2,
          text: "AI is asking the question...",
          bgClass: "bg-purple-50 dark:bg-purple-900/20",
          iconClass: "text-purple-500",
          textClass: "text-purple-600 dark:text-purple-400",
        };
      case "waiting":
        return {
          icon: Mic,
          text: "Your turn - speak your answer",
          bgClass: "bg-blue-50 dark:bg-blue-900/20",
          iconClass: "text-blue-500",
          textClass: "text-blue-600 dark:text-blue-400",
        };
      case "processing":
        return {
          icon: Loader2,
          text: "Processing your answer...",
          bgClass: "bg-yellow-50 dark:bg-yellow-900/20",
          iconClass: "text-yellow-500 animate-spin",
          textClass: "text-yellow-600 dark:text-yellow-400",
        };
      case "evaluation":
        return {
          icon: Star,
          text: "Reviewing your response",
          bgClass: "bg-green-50 dark:bg-green-900/20",
          iconClass: "text-green-500",
          textClass: "text-green-600 dark:text-green-400",
        };
      case "transitioning":
        return {
          icon: Volume2,
          text: "AI is responding...",
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
      {/* Progress Bar */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {progress.current} of {progress.total}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTime(elapsedTime)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{width: `${progress.percentage}%`}}
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

      {/* AI Interviewer Avatar - Only for Live Mode */}
      {selectedMode === "live" && (
        <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 dark:from-purple-500/20 dark:via-blue-500/20 dark:to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 dark:border-white/10 shadow-xl p-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg ${
                  isPlayingAudio ||
                  interviewPhase === "greeting" ||
                  interviewPhase === "transitioning"
                    ? "animate-pulse"
                    : ""
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  {isPlayingAudio ||
                  interviewPhase === "greeting" ||
                  interviewPhase === "transitioning" ? (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1 h-4 bg-purple-500 rounded-full animate-bounce"
                        style={{animationDelay: "0ms"}}
                      ></div>
                      <div
                        className="w-1 h-6 bg-purple-500 rounded-full animate-bounce"
                        style={{animationDelay: "150ms"}}
                      ></div>
                      <div
                        className="w-1 h-4 bg-purple-500 rounded-full animate-bounce"
                        style={{animationDelay: "300ms"}}
                      ></div>
                      <div
                        className="w-1 h-5 bg-purple-500 rounded-full animate-bounce"
                        style={{animationDelay: "450ms"}}
                      ></div>
                    </div>
                  ) : interviewPhase === "processing" ? (
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                  ) : (
                    <span className="text-2xl">🤖</span>
                  )}
                </div>
              </div>
              {/* Status indicator */}
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
                  isPlayingAudio
                    ? "bg-green-500 animate-pulse"
                    : interviewPhase === "waiting"
                      ? "bg-blue-500"
                      : interviewPhase === "processing"
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-gray-400"
                }`}
              ></div>
            </div>

            {/* AI Status Text */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Interviewer
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {interviewPhase === "greeting" &&
                  "Hello! Let me introduce myself..."}
                {interviewPhase === "asking" &&
                  (isPlayingAudio
                    ? "Speaking the question..."
                    : "Presenting question...")}
                {interviewPhase === "waiting" && "Listening to your answer..."}
                {interviewPhase === "processing" &&
                  "Analyzing your response..."}
                {interviewPhase === "evaluation" && "Evaluating your answer..."}
                {interviewPhase === "transitioning" &&
                  "Preparing next question..."}
                {interviewPhase === "idle" && "Ready to start"}
              </p>
            </div>

            {/* Audio control for live mode */}
            {isPlayingAudio && (
              <button
                onClick={onStopAudio}
                className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl text-gray-700 dark:text-gray-300 transition-all"
              >
                Skip Audio
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Card */}
      <div
        className={`bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6 ${selectedMode === "live" && isPlayingAudio ? "ring-2 ring-purple-500/50" : ""}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              selectedMode === "live" && isPlayingAudio
                ? "bg-gradient-to-br from-purple-500 to-blue-500 animate-pulse"
                : "bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-500/30"
            }`}
          >
            {selectedMode === "live" && isPlayingAudio ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                {currentQuestion?.number}
              </span>
            )}
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

      {/* Answer Section */}
      {!evaluation && (
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
              {/* Audio Playing Indicator for Live Mode */}
              {selectedMode === "live" && isPlayingAudio && (
                <div className="mb-6 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-500/30 flex items-center justify-center animate-pulse border border-purple-500/30">
                    <Volume2 className="w-10 h-10 text-purple-500" />
                  </div>
                  <p className="mt-3 text-purple-600 dark:text-purple-400 font-medium">
                    AI Interviewer is speaking...
                  </p>
                  <button
                    onClick={onStopAudio}
                    className="mt-2 text-sm text-gray-500 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                  >
                    Skip audio
                  </button>
                </div>
              )}

              {/* Recording Button */}
              {(!isPlayingAudio || selectedMode !== "live") && (
                <>
                  <button
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    disabled={
                      isSubmitting ||
                      (selectedMode === "live" && interviewPhase !== "waiting")
                    }
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                      isRecording
                        ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 animate-pulse shadow-red-500/40"
                        : selectedMode === "live"
                          ? "bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 shadow-purple-500/40"
                          : "bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 shadow-blue-500/40"
                    } ${isSubmitting || (selectedMode === "live" && interviewPhase !== "waiting") ? "opacity-50 cursor-not-allowed" : ""}`}
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
                      : selectedMode === "live" && interviewPhase === "asking"
                        ? "Wait for the question to finish..."
                        : selectedMode === "live"
                          ? "Speak your answer"
                          : "Click to start recording"}
                  </p>
                  {isRecording && (
                    <p className="text-sm text-red-400 mt-2 animate-pulse">
                      Max 90 seconds
                    </p>
                  )}
                  {selectedMode === "live" &&
                    !isRecording &&
                    interviewPhase === "waiting" && (
                      <p className="text-sm text-purple-500 mt-2 font-medium">
                        Your turn to respond
                      </p>
                    )}
                </>
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

      {/* Evaluation Display */}
      {evaluation && (
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

      {/* Abandon Button */}
      <button
        onClick={onAbandon}
        className="text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-sm flex items-center gap-1 mx-auto transition-colors py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
      >
        <XCircle className="w-4 h-4" />
        End Interview Early
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
