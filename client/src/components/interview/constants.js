import {
  FileText,
  Briefcase,
  Code,
  Users,
  Sparkles,
} from "lucide-react";

// Sarvam AI & Local Voice Personas
export const INTERVIEWER_VOICES = {
  shubh: {
    id: "shubh",
    name: "Shubh",
    gender: "male",
    title: "Senior Engineering Lead",
    provider: "sarvam",
    accent: "Indian / Global English",
    badge: "Default",
  },
  anushka: {
    id: "anushka",
    name: "Anushka",
    gender: "female",
    title: "Senior Technical Recruiter",
    provider: "sarvam",
    accent: "Indian / Global English",
    badge: "Popular",
  },
  amartya: {
    id: "amartya",
    name: "Amartya",
    gender: "male",
    title: "Principal Solutions Architect",
    provider: "sarvam",
    accent: "Deep Professional",
    badge: "Executive",
  },
  meera: {
    id: "meera",
    name: "Meera",
    gender: "female",
    title: "Director of Engineering",
    provider: "sarvam",
    accent: "Clear & Warm",
    badge: "Leadership",
  },
  arvind: {
    id: "arvind",
    name: "Arvind",
    gender: "male",
    title: "Staff Systems Engineer",
    provider: "sarvam",
    accent: "Conversational Pace",
    badge: "Dynamic",
  },
  rachel: {
    id: "rachel",
    name: "Rachel",
    gender: "female",
    title: "Technical Assessor",
    provider: "chatterbox",
    accent: "Local Microservice",
    badge: "Local",
  },
};

// Interview type icons
export const TYPE_ICONS = {
  "resume-based": FileText,
  "job-description": Briefcase,
  technical: Code,
  behavioral: Users,
  mixed: Sparkles,
};

// Conversation phases for natural interview flow
export const CONVERSATION_PHASES = {
  IDLE: "idle",
  INTRODUCTION: "introduction",
  WARM_UP: "warm_up",
  CORE_INTERVIEW: "core_interview",
  WRAP_UP: "wrap_up",
  COMPLETED: "completed",
};

// Human Voice Activity & Silence detection settings (Tuned for fan/ambient noise resilience)
export const SILENCE_THRESHOLD = 32; // Audio level below this is considered silence (avoids fan/AC false triggers)
export const VOCAL_SPEECH_THRESHOLD = 38; // Vocal presence required to confirm user is speaking
export const SILENCE_DURATION = 2200; // 2.2 seconds of silence to automatically end recording
export const MIN_RECORDING_DURATION = 1800; // 1.8s minimum recording duration
export const EXTENDED_SILENCE_DURATION = 12000; // 12 seconds - user hasn't said anything at all
export const MAX_WAITING_SILENCE = 16000; // 16 seconds - max time to wait before prompting again
