import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load .env
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import * as sarvamService from "../services/sarvam.service.js";

async function runTests() {
  console.log("\n==================================================");
  console.log("🔍 TESTING SARVAM AI INTEGRATION");
  console.log("==================================================");

  const isConfigured = sarvamService.isAvailable();
  console.log(`1. Key Configuration Check: ${isConfigured ? "✅ CONFIGURED" : "❌ NOT CONFIGURED"}`);

  if (!isConfigured) {
    console.error("❌ SARVAM_API_KEY is not set or is empty in .env");
    process.exit(1);
  }

  // Masked key display
  const key = process.env.SARVAM_API_KEY;
  const maskedKey = key.substring(0, 4) + "..." + key.substring(key.length - 4);
  console.log(`   API Key: ${maskedKey}`);

  // Test 1: TTS
  console.log("\n--------------------------------------------------");
  console.log("🎙️ TEST 1: Text-to-Speech (Bulbul v3)");
  console.log("--------------------------------------------------");
  const testText = "Hello! Welcome to your AI mock interview. Are you ready to begin?";
  console.log(`Input Text: "${testText}"`);

  let audioBuffer;
  try {
    const startTime = Date.now();
    audioBuffer = await sarvamService.textToSpeech(testText, {
      speaker: "shubh",
      target_language_code: "en-IN",
      model: "bulbul:v3",
    });
    const latency = Date.now() - startTime;

    console.log(`✅ TTS SUCCESS!`);
    console.log(`   Audio Size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`   Latency: ${latency}ms`);

    // Optionally save to test output
    const testAudioPath = path.join(__dirname, "../uploads/test_sarvam_tts.wav");
    fs.mkdirSync(path.dirname(testAudioPath), { recursive: true });
    fs.writeFileSync(testAudioPath, audioBuffer);
    console.log(`   Audio saved to: ${testAudioPath}`);
  } catch (ttsErr) {
    console.error("❌ TTS Failed:", ttsErr.message);
  }

  // Test 2: STT (Using the audio we just synthesized)
  if (audioBuffer) {
    console.log("\n--------------------------------------------------");
    console.log("🎧 TEST 2: Speech-to-Text (Saaras v3)");
    console.log("--------------------------------------------------");
    try {
      const startTime = Date.now();
      const sttResult = await sarvamService.speechToText(audioBuffer, {
        filename: "test_sarvam_tts.wav",
        mimetype: "audio/wav",
        model: "saaras:v3",
      });
      const latency = Date.now() - startTime;

      console.log(`✅ STT SUCCESS!`);
      console.log(`   Transcribed Text: "${sttResult.text}"`);
      console.log(`   Detected Language: ${sttResult.language}`);
      console.log(`   Latency: ${latency}ms`);
    } catch (sttErr) {
      console.error("❌ STT Failed:", sttErr.message);
    }
  }

  console.log("\n==================================================");
  console.log("🎉 SARVAM AI TEST SUITE COMPLETE");
  console.log("==================================================\n");
}

runTests();
