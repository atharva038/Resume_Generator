import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";

dotenv.config();

const userId = "690a4313f4524249902a2412";

async function clearAIPreference() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    const user = await User.findById(userId);

    if (!user) {
      console.error("❌ User not found");
      process.exit(1);
    }

    console.log("\n📊 Current User Info:");
    console.log("   Name:", user.name);
    console.log("   Email:", user.email);
    console.log("   Tier:", user.subscription?.tier || "free");
    console.log(
      "   Current AI Preference:",
      user.preferences?.aiModel || "none"
    );

    // Clear AI preference
    if (!user.preferences) {
      user.preferences = {};
    }
    user.preferences.aiModel = undefined;

    await user.save();

    console.log("\n✅ AI preference cleared!");
    console.log(
      "   New AI Preference:",
      user.preferences?.aiModel || "none (will use tier-based selection)"
    );
    console.log("\n🎯 User will now use GPT-4o based on 'one-time' tier");

    await mongoose.disconnect();
    console.log("\n📦 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

clearAIPreference();
