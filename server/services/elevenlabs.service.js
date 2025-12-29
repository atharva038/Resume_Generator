/**
 * ElevenLabs Text-to-Speech Service
 *
 * Converts AI interviewer questions to natural speech
 * for the live interview experience.
 */

import fetch from "node-fetch";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Voice IDs
const VOICE_IDS = {
  rachel: "21m00Tcm4TlvDq8ikWAM", // Rachel - warm, professional female voice (primary)
  adam: "pNInz6obpgDQGcFmaJgB", // Adam - clear male voice (backup)
};

// Default voice - Rachel (warm, professional female voice - perfect for interviews)
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || VOICE_IDS.rachel;

// Backup voice if primary fails
const BACKUP_VOICE_ID = VOICE_IDS.adam;

// Voice settings optimized for natural, expressive interview conversation
// Lower stability = more emotional variation, Higher style = more expressive
const VOICE_SETTINGS = {
  stability: 0.4, // Lower for more emotional variation and natural speech patterns
  similarity_boost: 0.75, // Good balance - maintains voice character while allowing expression
  style: 0.65, // Higher expressiveness - sounds more engaged and interested
  use_speaker_boost: true, // Enhance voice clarity
};

// Alternative settings for different emotional contexts
export const VOICE_PRESETS = {
  // Warm and enthusiastic - for greetings and positive feedback
  warm: {
    stability: 0.35, // Very expressive
    similarity_boost: 0.7,
    style: 0.75, // High enthusiasm
    use_speaker_boost: true,
  },
  // Curious and engaged - for asking questions
  question: {
    stability: 0.45,
    similarity_boost: 0.75,
    style: 0.6, // Sounds interested and curious
    use_speaker_boost: true,
  },
  // Encouraging and positive - for acknowledgments
  acknowledgment: {
    stability: 0.4,
    similarity_boost: 0.8,
    style: 0.7, // Warm and appreciative tone
    use_speaker_boost: true,
  },
  // Friendly transition
  transition: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.55,
    use_speaker_boost: true,
  },
  // Warm closing - grateful and friendly
  closing: {
    stability: 0.35,
    similarity_boost: 0.75,
    style: 0.8, // Very warm and appreciative
    use_speaker_boost: true,
  },
  // Professional but friendly (default fallback)
  professional: {
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: true,
  },
  // Supportive and calm
  supportive: {
    stability: 0.45,
    similarity_boost: 0.8,
    style: 0.6,
    use_speaker_boost: true,
  },
};

/**
 * Check if ElevenLabs is configured
 * @returns {boolean}
 */
export const isConfigured = () => {
  return !!ELEVENLABS_API_KEY;
};

/**
 * Get available voices from ElevenLabs
 * @returns {Promise<Array>} List of available voices
 */
export const getVoices = async () => {
  if (!isConfigured()) {
    throw new Error("ElevenLabs API key not configured");
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return data.voices.map((voice) => ({
      id: voice.voice_id,
      name: voice.name,
      category: voice.category,
      description: voice.description,
      previewUrl: voice.preview_url,
    }));
  } catch (error) {
    console.error("❌ Failed to get ElevenLabs voices:", error);
    throw error;
  }
};

/**
 * Convert text to speech using ElevenLabs
 * @param {string} text - Text to convert to speech
 * @param {Object} options - Optional settings
 * @param {string} options.voiceId - Voice ID to use
 * @param {string} options.preset - Voice preset (warm, professional, supportive)
 * @param {string} options.model - Model to use (eleven_monolingual_v1, eleven_multilingual_v2)
 * @param {boolean} options.useBackup - Whether to try backup voice on failure
 * @returns {Promise<Buffer>} Audio buffer (MP3)
 */
export const textToSpeech = async (text, options = {}) => {
  if (!isConfigured()) {
    throw new Error("ElevenLabs API key not configured");
  }

  if (!text || text.trim().length === 0) {
    throw new Error("Text is required for speech synthesis");
  }

  const voiceId = options.voiceId || DEFAULT_VOICE_ID;
  const model = options.model || "eleven_monolingual_v1";
  const useBackup = options.useBackup !== false; // Default to true

  // Get voice settings - use preset if specified, otherwise default
  const voiceSettings =
    options.preset && VOICE_PRESETS[options.preset]
      ? VOICE_PRESETS[options.preset]
      : VOICE_SETTINGS;

  const synthesize = async (vId) => {
    console.log(
      `🔊 Synthesizing speech with voice ${vId}: "${text.substring(0, 50)}..."`
    );

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${vId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: voiceSettings,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `ElevenLabs API error: ${response.status} - ${errorText}`
      );
    }

    const audioBuffer = await response.buffer();
    console.log(`✅ Speech synthesized: ${audioBuffer.length} bytes`);

    return audioBuffer;
  };

  try {
    return await synthesize(voiceId);
  } catch (error) {
    console.error("❌ Text-to-speech error with primary voice:", error.message);

    // Try backup voice if enabled and we weren't already using it
    if (useBackup && voiceId !== BACKUP_VOICE_ID) {
      console.log("🔄 Trying backup voice (Adam)...");
      try {
        return await synthesize(BACKUP_VOICE_ID);
      } catch (backupError) {
        console.error("❌ Backup voice also failed:", backupError.message);
        throw error; // Throw original error
      }
    }

    throw error;
  }
};

/**
 * Convert text to speech and return as base64
 * @param {string} text - Text to convert
 * @param {Object} options - Optional settings
 * @returns {Promise<Object>} { audioBase64, contentType, duration, voiceId }
 */
export const textToSpeechBase64 = async (text, options = {}) => {
  const audioBuffer = await textToSpeech(text, options);

  return {
    audioBase64: audioBuffer.toString("base64"),
    contentType: "audio/mpeg",
    // Estimate duration (rough: 150 words per minute, ~5 chars per word)
    estimatedDuration: Math.ceil((text.length / 5 / 150) * 60),
    voiceId: options.voiceId || DEFAULT_VOICE_ID,
  };
};

/**
 * Stream text to speech (for longer content)
 * @param {string} text - Text to convert
 * @param {Object} options - Optional settings
 * @returns {Promise<ReadableStream>} Audio stream
 */
export const textToSpeechStream = async (text, options = {}) => {
  if (!isConfigured()) {
    throw new Error("ElevenLabs API key not configured");
  }

  const voiceId = options.voiceId || DEFAULT_VOICE_ID;

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: VOICE_SETTINGS,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs streaming error: ${response.status}`);
  }

  return response.body;
};

/**
 * Get usage/quota information
 * @returns {Promise<Object>} Usage stats
 */
export const getUsage = async () => {
  if (!isConfigured()) {
    return {configured: false, available: false};
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      // API key might work for TTS but not for user info (restricted permissions)
      if (response.status === 401 || response.status === 403) {
        console.log(
          "⚠️ ElevenLabs API key has limited permissions (TTS may still work)"
        );
        return {
          configured: true,
          available: true, // Assume TTS works
          canSynthesize: true,
          limitedPermissions: true,
          message: "API key has limited permissions - TTS should still work",
        };
      }
      throw new Error(`Failed to get usage: ${response.status}`);
    }

    const data = await response.json();
    return {
      configured: true,
      available: true,
      tier: data.tier,
      characterCount: data.character_count,
      characterLimit: data.character_limit,
      remainingCharacters: data.character_limit - data.character_count,
      canSynthesize: data.character_count < data.character_limit,
    };
  } catch (error) {
    console.error("❌ Failed to get ElevenLabs usage:", error);
    // Return available: true so the app can try TTS anyway
    return {
      configured: true,
      available: true,
      canSynthesize: true,
      error: error.message,
    };
  }
};

export default {
  isConfigured,
  getVoices,
  textToSpeech,
  textToSpeechBase64,
  textToSpeechStream,
  getUsage,
  VOICE_PRESETS,
};
