import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
// ElevenLabs DISABLED - using Sarvam AI (Production) + Chatterbox TTS (Local) + Browser TTS (Fallback)
import * as sarvamService from "../services/sarvam.service.js";
import * as chatterboxService from "../services/chatterbox.service.js";

const router = express.Router();
const unavailableVoiceHealthLogs = new Set();

function getVoiceServiceUrl() {
  return (
    process.env.VOICE_SERVICE_URL ||
    process.env.ML_SERVICE_URL ||
    "http://localhost:5001"
  );
}

function logVoiceServiceUnavailable(serviceName, serviceUrl, error) {
  const logKey = `${serviceName}:${serviceUrl}`;
  const message = error?.cause?.code || error?.code || error?.message;

  if (!unavailableVoiceHealthLogs.has(logKey)) {
    unavailableVoiceHealthLogs.add(logKey);
    console.warn(
      `${serviceName} health check unavailable on ${serviceUrl}: ${
        message || "request failed"
      }`
    );
  }
}

async function fetchVoiceHealth(path) {
  const voiceServiceUrl = getVoiceServiceUrl();
  const response = await fetch(`${voiceServiceUrl}${path}`, {
    signal: AbortSignal.timeout(3000),
  });

  if (!response.ok) {
    throw new Error(`Voice service returned ${response.status}`);
  }

  return {
    data: await response.json(),
    voiceServiceUrl,
  };
}

/**
 * Voice Routes
 *
 * - STT: Sarvam Saaras (Production) / Whisper (Local voice-service)
 * - TTS: Sarvam Bulbul (Production) / Chatterbox (Local) / Browser TTS (Fallback)
 * Used by the AI Interview feature for live interview mode.
 *
 * Priority for TTS: Sarvam AI (Cloud/Production) → Chatterbox (Local dev) → Browser TTS (Fallback)
 */

/**
 * @route   GET /api/voice/health
 * @desc    Check if voice transcription service is available
 * @access  Public
 */
router.get("/health", async (req, res) => {
  const sarvamAvailable = sarvamService.isAvailable();
  const voiceServiceUrl = getVoiceServiceUrl();

  try {
    const {data} = await fetchVoiceHealth("/health");

    res.json({
      success: true,
      data: {
        ...data,
        sarvam_available: sarvamAvailable,
      },
    });
  } catch (error) {
    logVoiceServiceUnavailable("Voice service", voiceServiceUrl, error);
    res.json({
      success: true,
      data: {
        status: sarvamAvailable ? "healthy" : "unavailable",
        whisper_available: false,
        sarvam_available: sarvamAvailable,
        error: sarvamAvailable
          ? null
          : "Local voice service not reachable & Sarvam AI not configured",
      },
    });
  }
});

/**
 * @route   GET /api/voice/tts/health
 * @desc    Check text-to-speech services status (Sarvam AI + Chatterbox + Browser TTS)
 * @access  Public
 */
router.get("/tts/health", async (req, res) => {
  try {
    const sarvamAvailable = sarvamService.isAvailable();
    const chatterboxAvailable = await chatterboxService.isAvailable();

    let chatterboxHealth = null;
    if (chatterboxAvailable) {
      try {
        chatterboxHealth = await chatterboxService.getHealth();
      } catch (error) {
        console.error("Chatterbox health check error:", error);
      }
    }

    res.json({
      success: true,
      available: true, // TTS is always available (Browser TTS fallback)
      providers: {
        sarvam: {
          available: sarvamAvailable,
          priority: 1,
          cost: "low-cost API",
          model: "bulbul:v3",
          note: "Production cloud voice synthesis",
        },
        chatterbox: {
          available: chatterboxAvailable,
          priority: 2,
          cost: "free",
          details: chatterboxHealth,
          note: "Local microservice synthesis",
        },
        browser: {
          available: true,
          priority: 3,
          cost: "free",
          note: "Frontend fallback (Web Speech API)",
        },
      },
      recommended: sarvamAvailable
        ? "sarvam"
        : chatterboxAvailable
        ? "chatterbox"
        : "browser",
    });
  } catch (error) {
    console.error("TTS health check error:", error);
    res.json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/voice/transcribe/health
 * @desc    Check transcription capabilities and limits
 * @access  Private
 */
router.get("/transcribe/health", authenticateToken, async (req, res) => {
  const voiceServiceUrl = getVoiceServiceUrl();

  try {
    const {data} = await fetchVoiceHealth("/transcribe/health");

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logVoiceServiceUnavailable("Transcription service", voiceServiceUrl, error);
    res.json({
      success: true,
      data: {
        available: false,
        error: "Voice service not reachable",
      },
    });
  }
});

/**
 * @route   GET /api/voice/tts/voices
 * @desc    Get available TTS voices (ElevenLabs disabled - using Chatterbox)
 * @access  Private
 */
router.get("/tts/voices", authenticateToken, async (req, res) => {
  return res.status(503).json({
    success: false,
    error: "ElevenLabs TTS is disabled. Using Chatterbox + Browser TTS instead.",
  });
});

/**
 * @route   POST /api/voice/tts/synthesize
 * @desc    Convert text to speech - returns binary audio directly (more efficient)
 * @access  Private
 * @body    { text: string, speaker?: string, language?: string, voiceRef?: string }
 * @returns Binary audio/wav stream
 *
 * Priority: Sarvam AI (Cloud/Production) → Chatterbox (Local dev) → Browser TTS (frontend fallback)
 */
router.post("/tts/synthesize", authenticateToken, async (req, res) => {
  try {
    const {text, speaker, language, voiceRef} = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Text is required",
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        error: "Text too long. Maximum 5000 characters.",
      });
    }

    // 1. Try Sarvam AI first (Production Cloud TTS)
    if (sarvamService.isAvailable()) {
      try {
        console.log("🎙️ Using Sarvam AI TTS (Bulbul v3)");
        const audioBuffer = await sarvamService.textToSpeech(text, {
          speaker: speaker || "shubh",
          target_language_code: language || "en-IN",
          model: "bulbul:v3",
          pace: 1.0,
        });

        res.set({
          "Content-Type": "audio/wav",
          "Content-Length": audioBuffer.length,
          "Cache-Control": "no-cache",
          "X-TTS-Provider": "sarvam",
        });

        return res.send(audioBuffer);
      } catch (sarvamError) {
        console.warn("⚠️ Sarvam AI TTS failed, trying fallback:", sarvamError.message);
      }
    }

    // 2. Try Chatterbox (Local dev microservice)
    try {
      const chatterboxAvailable = await chatterboxService.isAvailable();

      if (chatterboxAvailable) {
        console.log("🎙️ Using Chatterbox TTS (Local microservice)");
        const audioBuffer = await chatterboxService.textToSpeech(text, {
          voiceRef: voiceRef || process.env.DEFAULT_VOICE_REF,
          language: language || "en",
        });

        res.set({
          "Content-Type": "audio/wav",
          "Content-Length": audioBuffer.length,
          "Cache-Control": "no-cache",
          "X-TTS-Provider": "chatterbox",
        });

        return res.send(audioBuffer);
      }
    } catch (chatterboxError) {
      console.warn("⚠️ Chatterbox TTS failed:", chatterboxError.message);
    }

    // 3. Fallback to Browser Web Speech API
    console.log("📱 Returning 503 to trigger browser TTS fallback");
    return res.status(503).json({
      success: false,
      error: "Server TTS unavailable",
      message:
        "Server TTS not running or failed. Browser TTS will be used automatically.",
      provider: "none",
      fallback: "browser",
    });
  } catch (error) {
    console.error("TTS route error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * @route   POST /api/voice/tts/synthesize-json
 * @desc    DISABLED - Convert text to speech (base64 JSON)
 * @access  Private
 */
router.post("/tts/synthesize-json", authenticateToken, async (req, res) => {
  console.log("⚠️ synthesize-json endpoint called but ElevenLabs is disabled");

  return res.status(503).json({
    success: false,
    error: "Endpoint unavailable",
    message:
      "ElevenLabs is disabled. Use /api/voice/tts/synthesize instead (returns 503 for browser TTS fallback).",
  });
});

/**
 * @route   POST /api/voice/tts/stream
 * @desc    DISABLED - Stream text-to-speech audio (ElevenLabs)
 * @access  Private
 */
router.post("/tts/stream", authenticateToken, async (req, res) => {
  console.log("⚠️ stream endpoint called but ElevenLabs is disabled");

  return res.status(503).json({
    success: false,
    error: "Endpoint unavailable",
    message: "ElevenLabs is disabled. Use browser TTS instead.",
  });
});

/**
 * @route   POST /api/voice/tts/test
 * @desc    Test voice with sample interview phrases - DISABLED (ElevenLabs)
 * @access  Private
 * @returns 503 - Use browser TTS for testing
 *
 * NOTE: This endpoint is disabled because it relies on ElevenLabs.
 * Use browser TTS or Chatterbox for voice testing instead.
 */
router.post("/tts/test", authenticateToken, async (req, res) => {
  console.log("⚠️ TTS test endpoint called but ElevenLabs is disabled");

  return res.status(503).json({
    success: false,
    error: "Voice test unavailable",
    message:
      "ElevenLabs is disabled. Use browser TTS for testing (it's already active in the interview).",
    suggestion: "Start a Live Mode interview to test the current TTS system",
  });
});

export default router;
