/**
 * DESTRUCTIVE OPERATION: Reset All Users and Remove All Resumes
 *
 * This script will:
 * 1. Delete all resumes from the database
 * 2. Delete all subscriptions
 * 3. Reset all users' usage counters to 0
 *
 * ⚠️ WARNING: This cannot be undone!
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({path: path.join(__dirname, "../.env")});

// Import models
import User from "../models/User.model.js";
import Resume from "../models/Resume.model.js";
import Subscription from "../models/Subscription.model.js";

async function resetAllUsersAndResumes() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Step 1: Count before deletion
    const resumeCount = await Resume.countDocuments();
    const subscriptionCount = await Subscription.countDocuments();
    const userCount = await User.countDocuments();

    console.log("📊 Current Database Status:");
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Resumes: ${resumeCount}`);
    console.log(`  - Subscriptions: ${subscriptionCount}\n`);

    // Step 2: Delete all resumes
    console.log("🗑️  Deleting all resumes...");
    const resumeDeleteResult = await Resume.deleteMany({});
    console.log(`✅ Deleted ${resumeDeleteResult.deletedCount} resumes\n`);

    // Step 3: Delete all subscriptions
    console.log("🗑️  Deleting all subscriptions...");
    const subscriptionDeleteResult = await Subscription.deleteMany({});
    console.log(
      `✅ Deleted ${subscriptionDeleteResult.deletedCount} subscriptions\n`
    );

    // Step 4: Reset all users' subscription and usage data
    console.log("🔄 Resetting all users...");
    const users = await User.find({});

    for (const user of users) {
      // Reset subscription to free tier
      user.subscription = {
        tier: "free",
        status: "active",
        plan: undefined,
        startDate: undefined,
        endDate: undefined,
        receiptId: undefined,
        paymentId: undefined,
        orderId: undefined,
        autoRenew: false,
      };

      // Reset all usage counters to 0
      user.usage = {
        resumesCreated: 0,
        resumesThisMonth: 0,
        atsScans: 0,
        atsScansThisMonth: 0,
        jobMatches: 0,
        jobMatchesToday: 0,
        coverLetters: 0,
        coverLettersThisMonth: 0,
        tokensUsed: 0,
        lastResetDate: new Date(),
        lastDailyReset: new Date(),
        aiGenerationsThisMonth: 0,
        aiGenerationsUsed: 0,
        aiResumeExtractions: 0,
        aiResumeExtractionsToday: 0,
        resumesDownloaded: 0,
        resumesDownloadedThisMonth: 0,
      };

      await user.save();
      console.log(`  ✅ Reset user: ${user.email}`);
    }

    console.log(`\n✅ Reset ${users.length} users\n`);

    // Step 5: Verify final state
    const finalResumeCount = await Resume.countDocuments();
    const finalSubscriptionCount = await Subscription.countDocuments();
    const finalUserCount = await User.countDocuments();

    console.log("📊 Final Database Status:");
    console.log(`  - Users: ${finalUserCount} (all reset to free tier)`);
    console.log(`  - Resumes: ${finalResumeCount}`);
    console.log(`  - Subscriptions: ${finalSubscriptionCount}\n`);

    console.log("🎉 All data reset successfully!\n");
    console.log("Summary:");
    console.log(`  ✅ Deleted ${resumeDeleteResult.deletedCount} resumes`);
    console.log(
      `  ✅ Deleted ${subscriptionDeleteResult.deletedCount} subscriptions`
    );
    console.log(`  ✅ Reset ${users.length} users to free tier with 0 usage`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the script
console.log("\n⚠️  WARNING: DESTRUCTIVE OPERATION ⚠️");
console.log("This will:");
console.log("  1. Delete ALL resumes");
console.log("  2. Delete ALL subscriptions");
console.log("  3. Reset ALL users to free tier with 0 usage\n");

// Give user 3 seconds to cancel
console.log("Starting in 3 seconds... Press Ctrl+C to cancel\n");
setTimeout(() => {
  resetAllUsersAndResumes();
}, 3000);
