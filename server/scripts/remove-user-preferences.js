/**
 * Database Cleanup Script
 * Removes preferences.aiModel field from all users
 *
 * Run with: node server/scripts/remove-user-preferences.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

// Load environment variables
dotenv.config();

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

/**
 * Remove preferences.aiModel from all users
 */
const removePreferences = async () => {
  try {
    console.log("\n🔍 Checking for users with preferences.aiModel...");

    // Find users with preferences.aiModel field
    const usersWithPreferences = await User.find({
      "preferences.aiModel": {$exists: true},
    }).select("_id name email preferences.aiModel");

    console.log(
      `\n📊 Found ${usersWithPreferences.length} users with preferences.aiModel:`
    );

    if (usersWithPreferences.length > 0) {
      usersWithPreferences.forEach((user) => {
        console.log(
          `   - ${user.name} (${user.email}): ${user.preferences?.aiModel}`
        );
      });

      // Ask for confirmation
      console.log("\n⚠️  This will remove preferences.aiModel from all users.");
      console.log("   AI model selection will be purely tier-based.\n");

      // Remove preferences.aiModel field from all users
      const result = await User.updateMany(
        {"preferences.aiModel": {$exists: true}},
        {$unset: {"preferences.aiModel": ""}}
      );

      console.log(
        `\n✅ Successfully removed preferences.aiModel from ${result.modifiedCount} users`
      );

      // Verify cleanup
      const remainingUsers = await User.find({
        "preferences.aiModel": {$exists: true},
      }).countDocuments();

      if (remainingUsers === 0) {
        console.log(
          "✅ Verification passed: No users have preferences.aiModel"
        );
      } else {
        console.warn(
          `⚠️  Warning: ${remainingUsers} users still have preferences.aiModel`
        );
      }
    } else {
      console.log(
        "\n✅ No users found with preferences.aiModel - database is clean!"
      );
    }
  } catch (error) {
    console.error("❌ Error removing preferences:", error.message);
    throw error;
  }
};

/**
 * Main execution
 */
const main = async () => {
  try {
    console.log("🚀 Starting database cleanup...\n");

    await connectDB();
    await removePreferences();

    console.log("\n✅ Cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Cleanup failed:", error.message);
    process.exit(1);
  }
};

// Run the script
main();
