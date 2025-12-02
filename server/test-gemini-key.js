#!/usr/bin/env node

/**
 * Test script to verify Gemini API key is working
 * Run: node test-gemini-key.js
 */

import dotenv from "dotenv";
import {GoogleGenerativeAI} from "@google/generative-ai";

// Load environment variables
dotenv.config();

async function testGeminiKey() {
  console.log("\n🔍 Testing Gemini API Key Configuration...\n");

  // Step 1: Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found in environment variables");
    console.error("💡 Please add GEMINI_API_KEY to your .env file");
    process.exit(1);
  }

  const apiKey = process.env.GEMINI_API_KEY.trim();

  // Step 2: Validate API key format
  console.log(`📋 API Key Format Check:`);
  console.log(`   Length: ${apiKey.length} characters`);
  console.log(`   Prefix: ${apiKey.substring(0, 10)}...`);
  console.log(`   Suffix: ...${apiKey.substring(apiKey.length - 4)}`);

  if (apiKey.length < 20) {
    console.error("❌ API key seems too short");
    process.exit(1);
  }

  if (!apiKey.startsWith("AIzaSy")) {
    console.error(
      '⚠️  Warning: API key doesn\'t start with "AIzaSy" (standard Google AI format)'
    );
  }

  // Step 3: Test actual API call
  console.log("\n🧪 Testing API call with a simple prompt...\n");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use the same model as your production application
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});

    const prompt =
      'Say "Hello! API key is working correctly." in exactly those words.';

    console.log("   Making API request...");
    console.log("   Using model: gemini-2.5-flash (same as your app)");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ API call successful!\n");
    console.log("📝 Response:", text);

    // Check token usage
    if (response.usageMetadata) {
      console.log("\n📊 Token Usage:");
      console.log(
        `   Prompt tokens: ${response.usageMetadata.promptTokenCount || 0}`
      );
      console.log(
        `   Response tokens: ${
          response.usageMetadata.candidatesTokenCount || 0
        }`
      );
      console.log(
        `   Total tokens: ${response.usageMetadata.totalTokenCount || 0}`
      );
    }

    console.log("\n✅ SUCCESS: Your Gemini API key is working correctly!\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ API call failed!\n");
    console.error("Error details:");
    console.error(`   Message: ${error.message}`);

    if (error.message.includes("API key not valid")) {
      console.error("\n💡 Solutions:");
      console.error(
        "   1. Get a new API key from: https://aistudio.google.com/app/apikey"
      );
      console.error(
        "   2. Make sure you're using the correct API key (not OAuth client ID)"
      );
      console.error("   3. Check if the key has been revoked or expired");
      console.error(
        "   4. Verify the Generative Language API is enabled in your project"
      );
      console.error("   5. Check for any IP/referrer restrictions on the key");
    } else if (error.message.includes("quota")) {
      console.error(
        "\n💡 Solution: You've exceeded your API quota. Wait or upgrade your plan."
      );
    } else if (error.message.includes("models/gemini")) {
      console.error(
        '\n💡 Solution: The model might not be available. Try "gemini-pro" or check available models.'
      );
    }

    console.error("\n📚 Documentation: https://ai.google.dev/docs\n");
    process.exit(1);
  }
}

// Run the test
testGeminiKey().catch((error) => {
  console.error("\n❌ Unexpected error:", error.message);
  process.exit(1);
});
