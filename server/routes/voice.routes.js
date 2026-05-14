import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
// ElevenLabs DISABLED - using Chatterbox TTS + Browser TTS fallback
// Service kept in codebase for future re-enablement
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
 * - Whisper: Speech-to-Text (user's voice → text)
 * - Browser TTS: Text-to-Speech (AI questions → voice)
 * Used by the AI Interview feature for live interview mode.
 *
 * Priority: Chatterbox (free, open-source) → Browser TTS (fallback)
 * ElevenLabs is DISABLED due to payment issues
 */

/**
 * @route   GET /api/voice/health
 * @desc    Check if voice transcription service is available
 * @access  Public
 */
router.get("/health", async (req, res) => {
  const voiceServiceUrl = getVoiceServiceUrl();

  try {
    const {data} = await fetchVoiceHealth("/health");

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    logVoiceServiceUnavailable("Voice service", voiceServiceUrl, error);
    res.json({
      success: true,
      data: {
        status: "unavailable",
        whisper_available: false,
        error: "Voice service not reachable",
      },
    });
  }
});

/**
 * @route   GET /api/voice/tts/health
 * @desc    Check text-to-speech services status (Chatterbox + Browser TTS)
 * @access  Public
 */
router.get("/tts/health", async (req, res) => {
  try {
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
        chatterbox: {
          available: chatterboxAvailable,
          priority: 1,
          cost: "free",
          details: chatterboxHealth,
        },
        browser: {
          available: true,
          priority: 2,
          cost: "free",
          note: "Frontend fallback (Web Speech API)",
        },
      },
      recommended: chatterboxAvailable ? "chatterbox" : "browser",
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
 * @body    { text: string, voiceId?: string, preset?: string, voiceRef?: string }
 * @returns Binary audio/mpeg or audio/wav stream
 *
 * Priority: Chatterbox (free) → Browser TTS (frontend fallback)
 * ElevenLabs DISABLED due to payment issues
 */
router.post("/tts/synthesize", authenticateToken, async (req, res) => {
  try {
    const {text, voiceRef} = req.body; // voiceId, preset removed (ElevenLabs params)

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

    // Try Chatterbox first (free, open-source)
    try {
      const chatterboxAvailable = await chatterboxService.isAvailable();

      if (chatterboxAvailable) {
        console.log("🎙️ Using Chatterbox TTS (open-source)");
        const audioBuffer = await chatterboxService.textToSpeech(text, {
          voiceRef: voiceRef || process.env.DEFAULT_VOICE_REF,
          language: "en",
        });

        // Send as binary audio stream (WAV format from Chatterbox)
        res.set({
          "Content-Type": "audio/wav",
          "Content-Length": audioBuffer.length,
          "Cache-Control": "no-cache",
          "X-TTS-Provider": "chatterbox",
        });

        return res.send(audioBuffer);
      } else {
        console.log(
          "⚠️ Chatterbox not available, using browser TTS fallback..."
        );
      }
    } catch (chatterboxError) {
      console.warn("⚠️ Chatterbox TTS failed:", chatterboxError.message);
      console.log("🔄 Falling back to browser TTS...");
    }

    // No TTS service available - return 503 to trigger browser TTS
    console.log("📱 Returning 503 to trigger browser TTS fallback");
    return res.status(503).json({
      success: false,
      error: "Server TTS unavailable",
      message:
        "Chatterbox not running. Browser TTS will be used automatically.",
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
