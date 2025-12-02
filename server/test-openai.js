import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

console.log("=".repeat(60));
console.log("🔍 OpenAI Configuration Check");
console.log("=".repeat(60));

// Check if API key exists
const hasKey = !!process.env.OPENAI_API_KEY;
console.log("✓ OPENAI_API_KEY exists:", hasKey);

if (hasKey) {
  console.log(
    "✓ API Key preview:",
    process.env.OPENAI_API_KEY.substring(0, 20) + "..."
  );
  console.log("✓ API Key length:", process.env.OPENAI_API_KEY.length);

  // Try to initialize OpenAI client
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("✓ OpenAI client initialized successfully");

    // Try a simple API call to verify the key works
    console.log("\n🧪 Testing OpenAI API with simple call...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {role: "system", content: "You are a helpful assistant."},
        {role: "user", content: "Say 'Hello' in exactly one word."},
      ],
      max_tokens: 10,
    });

    console.log("✓ API Response:", completion.choices[0].message.content);
    console.log("✓ Tokens used:", completion.usage.total_tokens);
    console.log("\n✅ OpenAI is working correctly!");
  } catch (error) {
    console.error("❌ Error initializing or testing OpenAI:", error.message);
    if (error.code === "invalid_api_key") {
      console.error("   The API key is invalid or expired");
    } else if (error.code === "insufficient_quota") {
      console.error("   API key has exceeded quota");
    }
  }
} else {
  console.error("❌ OPENAI_API_KEY not found in environment");
}

console.log("=".repeat(60));
