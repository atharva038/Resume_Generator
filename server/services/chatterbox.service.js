/**
 * Chatterbox TTS Service
 *
 * Open-source alternative to ElevenLabs using Chatterbox TTS
 * Provides high-quality text-to-speech synthesis locally
 */

const CHATTERBOX_SERVICE_URL =
  process.env.CHATTERBOX_SERVICE_URL || "http://localhost:5002";

/**
 * Check if Chatterbox TTS service is available
 */
export async function isAvailable() {
  try {
    const response = await fetch(`${CHATTERBOX_SERVICE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.status === "healthy" && data.chatterbox_available === true;
  } catch (error) {
    console.warn("Chatterbox service not available:", error.message);
    return false;
  }
}

/**
 * Get service health information
 */
export async function getHealth() {
  try {
    const response = await fetch(`${CHATTERBOX_SERVICE_URL}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to check Chatterbox health: ${error.message}`);
  }
}

/**
 * Synthesize speech from text using Chatterbox TTS
 *
 * @param {string} text - Text to synthesize
 * @param {Object} options - Synthesis options
 * @param {string} options.voiceRef - Path to reference audio for voice cloning (optional)
 * @param {string} options.language - Language code (for multilingual model, e.g., 'en', 'fr', 'es')
 * @returns {Promise<Buffer>} Audio buffer (WAV format)
 */
export async function textToSpeech(text, options = {}) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Text is required and must be a string");
    }

    if (text.length > 5000) {
      throw new Error("Text too long. Maximum 5000 characters.");
    }

    console.log(`🔊 Chatterbox TTS: Synthesizing ${text.length} characters...`);

    const requestBody = {
      text: text.trim(),
    };

    // Add optional voice reference for cloning
    if (options.voiceRef) {
      requestBody.audio_prompt_path = options.voiceRef;
    }

    // Add language for multilingual model
    if (options.language) {
      requestBody.language = options.language;
    }

    const response = await fetch(`${CHATTERBOX_SERVICE_URL}/tts/synthesize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Chatterbox API error: ${response.status} - ${
          errorData.error || response.statusText
        }`
      );
    }

    // Get audio as buffer
    const audioBuffer = Buffer.from(await response.arrayBuffer());

    console.log(`✅ Chatterbox TTS: Generated ${audioBuffer.length} bytes`);

    return audioBuffer;
  } catch (error) {
    console.error("❌ Chatterbox TTS error:", error.message);
    throw error;
  }
}

/**
 * Get available voices information
 */
export async function getVoices() {
  try {
    const response = await fetch(`${CHATTERBOX_SERVICE_URL}/tts/voices`);

    if (!response.ok) {
      throw new Error(`Failed to get voices: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to get Chatterbox voices: ${error.message}`);
  }
}

/**
 * Test synthesis with sample text
 */
export async function testSynthesis() {
  try {
    const testText =
      "Hello! This is a test of the Chatterbox text-to-speech system.";
    const audioBuffer = await textToSpeech(testText);

    return {
      success: true,
      audioSize: audioBuffer.length,
      message: "Chatterbox synthesis test successful",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  isAvailable,
  getHealth,
  textToSpeech,
  getVoices,
  testSynthesis,
};
