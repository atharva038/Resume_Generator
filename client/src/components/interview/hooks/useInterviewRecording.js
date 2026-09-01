import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  SILENCE_THRESHOLD,
  SILENCE_DURATION,
  MIN_RECORDING_DURATION,
  EXTENDED_SILENCE_DURATION,
  VOCAL_SPEECH_THRESHOLD,
} from "../constants";

export function useInterviewRecording({
  selectedMode,
  isInterviewActiveRef,
  interviewPhase,
  setInterviewPhase,
  isPlayingAudio,
  audioElementRef,
  stopLocalAudio,
  speakAndListen,
  onVoiceSubmit,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [micFrequencyBins, setMicFrequencyBins] = useState([10, 10, 10, 10, 10, 10, 10, 10]);
  const [bargeInNotice, setBargeInNotice] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceStartRef = useRef(null);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const silenceCheckIntervalRef = useRef(null);
  const hasUserSpokenRef = useRef(false);
  const silencePromptCountRef = useRef(0);
  const startRecordingRef = useRef(null);
  const bargeInCountRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const speechConsecutiveFramesRef = useRef(0);

  // 60fps audio waveform sampling & Barge-In Interruption Detection
  useEffect(() => {
    let isRunning = true;

    const sampleAudioLevels = () => {
      if (!isRunning) return;

      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

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

        const avgVol = totalSum / binCount;
        const isActuallyPlaying =
          isPlayingAudio &&
          audioElementRef.current &&
          !audioElementRef.current.paused &&
          audioElementRef.current.currentTime > 0.6;

        const vocalEnergy = (levels[2] + levels[3] + levels[4] + levels[5]) / 4;

        if (isActuallyPlaying && isInterviewActiveRef.current && selectedMode === "live" && vocalEnergy > 38 && avgVol > 36) {
          bargeInCountRef.current += 1;
          if (bargeInCountRef.current >= 5) {
            console.log("⚡ Barge-in: Candidate interrupted AI speech.");
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
  }, [audioElementRef, isInterviewActiveRef, isPlayingAudio, selectedMode, stopLocalAudio]);

  const handleExtendedSilence = useCallback(async () => {
    if (selectedMode !== "live" || !isInterviewActiveRef.current) return;

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }

    const promptCount = silencePromptCountRef.current;
    silencePromptCountRef.current = promptCount + 1;

    const prompts = [
      "Hey, are you still there? Take your time if you need to think about it!",
      "No rush at all! Let me know if you'd like me to clarify or repeat anything.",
      "Take all the time you need. If you'd like, we can move forward whenever you're ready.",
    ];

    const silenceResponse = prompts[Math.min(promptCount, prompts.length - 1)];
    setInterviewPhase("transitioning");

    await speakAndListen(silenceResponse, () => {
      hasUserSpokenRef.current = false;
      setInterviewPhase("waiting");
      setTimeout(() => {
        if (isInterviewActiveRef.current) {
          startRecording(true);
        }
      }, 500);
    });
  }, [isInterviewActiveRef, mediaRecorder, selectedMode, setInterviewPhase, speakAndListen]);

  const checkSilence = (recorder) => {
    if (!isInterviewActiveRef.current || !analyserRef.current || !recorder || recorder.state !== "recording") {
      return;
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

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

    if (recordingDuration < MIN_RECORDING_DURATION) return;

    const isVocalizing = vocalEnergy > VOCAL_SPEECH_THRESHOLD || average > (SILENCE_THRESHOLD + 12);

    if (!isVocalizing) {
      speechConsecutiveFramesRef.current = 0;
    } else {
      speechConsecutiveFramesRef.current += 1;
      if (speechConsecutiveFramesRef.current >= 2) {
        if (!hasUserSpokenRef.current) {
          hasUserSpokenRef.current = true;
        }
        silenceStartRef.current = null;
      }
    }
  };

  const startRecording = async (autoStart = false) => {
    if (!isInterviewActiveRef.current) return;

    if (interviewPhase !== "waiting" && !autoStart) {
      if (interviewPhase === "asking") {
        toast("Please wait for the question to finish", { icon: "⏳" });
      }
      return;
    }

    try {
      let stream = streamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        streamRef.current = stream;

        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            audioContextRef.current = new AudioCtx();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
          }
        } catch (audioCtxError) {
          console.warn("AudioContext setup warning:", audioCtxError.message);
        }

        silenceStartRef.current = null;
        recordingStartTimeRef.current = Date.now();
        hasUserSpokenRef.current = false;
      }

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        if (silenceCheckIntervalRef.current) {
          clearInterval(silenceCheckIntervalRef.current);
          silenceCheckIntervalRef.current = null;
        }

        const blob = new Blob(chunks, { type: mimeType });
        if (selectedMode !== "live") {
          stream.getTracks().forEach((track) => track.stop());
        }

        if (blob.size === 0) {
          toast.error("No audio recorded. Please try again.");
          if (selectedMode === "live" && interviewPhase === "waiting") {
            setTimeout(() => startRecording(true), 500);
          }
          return;
        }

        if (onVoiceSubmit) {
          await onVoiceSubmit(blob);
        }
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start(1000);
      setIsRecording(true);

      if (selectedMode === "live") {
        silenceCheckIntervalRef.current = setInterval(() => {
          if (!isInterviewActiveRef.current) {
            clearInterval(silenceCheckIntervalRef.current);
            silenceCheckIntervalRef.current = null;
            return;
          }
          checkSilence(recorder);
        }, 100);
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error("Microphone access denied or not available");
    }
  };

  startRecordingRef.current = startRecording;

  const stopRecording = () => {
    if (silenceCheckIntervalRef.current) {
      clearInterval(silenceCheckIntervalRef.current);
      silenceCheckIntervalRef.current = null;
    }

    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const cleanupAudioStreams = () => {
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
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch (_) {}
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    setIsRecording(false);
  };

  return {
    isRecording,
    setIsRecording,
    mediaRecorder,
    audioChunks,
    micFrequencyBins,
    bargeInNotice,
    startRecording,
    stopRecording,
    startRecordingRef,
    hasUserSpokenRef,
    silencePromptCountRef,
    cleanupAudioStreams,
  };
}
