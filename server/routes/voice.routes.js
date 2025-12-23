import express from "express";
import {authenticateToken} from "../middleware/auth.middleware.js";
import * as elevenlabsService from "../services/elevenlabs.service.js";

const router = express.Router();

/**
 * Voice Routes
 *
 * - Whisper: Speech-to-Text (user's voice → text)
 * - ElevenLabs: Text-to-Speech (AI questions → voice)
 * Used by the AI Interview feature for live interview mode.
 */

/**
 * @route   GET /api/voice/health
 * @desc    Check if voice transcription service is available
 * @access  Public
 */
router.get("/health", async (req, res) => {
  try {
    const voiceServiceUrl =
      process.env.VOICE_SERVICE_URL ||
      process.env.ML_SERVICE_URL ||
      "http://localhost:5001";
    const response = await fetch(`${voiceServiceUrl}/health`);
    const data = await response.json();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Voice service health check error:", error);
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
 * @route   GET /api/voice/transcribe/health
 * @desc    Check transcription capabilities and limits
 * @access  Private
 */
router.get("/transcribe/health", authenticateToken, async (req, res) => {
  try {
    const voiceServiceUrl =
      process.env.VOICE_SERVICE_URL ||
      process.env.ML_SERVICE_URL ||
      "http://localhost:5001";
    const response = await fetch(`${voiceServiceUrl}/transcribe/health`);
    const data = await response.json();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Transcription health check error:", error);
    res.json({
      success: true,
      data: {
        available: false,
        error: "Voice service not reachable",
      },
    });
  }
});

// =====================
// TEXT-TO-SPEECH (ElevenLabs)
// =====================

/**
 * @route   GET /api/voice/tts/health
 * @desc    Check if text-to-speech is available
 * @access  Private
 */
router.get("/tts/health", authenticateToken, async (req, res) => {
  try {
    const usage = await elevenlabsService.getUsage();
    res.json({
      success: true,
      data: {
        available: usage.configured && usage.canSynthesize,
        ...usage,
      },
    });
  } catch (error) {
    console.error("TTS health check error:", error);
    res.json({
      success: true,
      data: {
        available: false,
        configured: elevenlabsService.isConfigured(),
        error: error.message,
      },
    });
  }
});

/**
 * @route   GET /api/voice/tts/voices
 * @desc    Get available TTS voices
 * @access  Private
 */
router.get("/tts/voices", authenticateToken, async (req, res) => {
  try {
    if (!elevenlabsService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "ElevenLabs not configured",
      });
    }

    const voices = await elevenlabsService.getVoices();
    res.json({
      success: true,
      data: voices,
    });
  } catch (error) {
    console.error("Get voices error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get voices",
    });
  }
});

/**
 * @route   POST /api/voice/tts/synthesize
 * @desc    Convert text to speech
 * @access  Private
 * @body    { text: string, voiceId?: string }
 */
router.post("/tts/synthesize", authenticateToken, async (req, res) => {
  try {
    const {text, voiceId} = req.body;

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

    if (!elevenlabsService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "Text-to-speech service not configured",
      });
    }

    const result = await elevenlabsService.textToSpeechBase64(text, {voiceId});

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("TTS synthesis error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to synthesize speech",
    });
  }
});

/**
 * @route   POST /api/voice/tts/stream
 * @desc    Stream text-to-speech audio
 * @access  Private
 * @body    { text: string, voiceId?: string }
 */
router.post("/tts/stream", authenticateToken, async (req, res) => {
  try {
    const {text, voiceId} = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Text is required",
      });
    }

    if (!elevenlabsService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "Text-to-speech service not configured",
      });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    const audioStream = await elevenlabsService.textToSpeechStream(text, {
      voiceId,
    });
    audioStream.pipe(res);
  } catch (error) {
    console.error("TTS streaming error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to stream speech",
    });
  }
});

export default router;
