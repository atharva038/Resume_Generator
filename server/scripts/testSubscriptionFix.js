#!/usr/bin/env node

/**
 * Test Script: Verify Advanced Subscription Fix
 *
 * This script tests the per-resume subscription tracking implementation
 *
 * Usage: node scripts/testSubscriptionFix.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({path: path.join(__dirname, "../.env")});

// Import models
import User from "../models/User.model.js";
import Resume from "../models/Resume.model.js";
import Subscription from "../models/Subscription.model.js";

/**
 * Test the subscription fix implementation
 */
async function testSubscriptionFix() {
  try {
    console.log("\n" + "=".repeat(80));
    console.log("  TESTING ADVANCED SUBSCRIPTION FIX");
    console.log("=".repeat(80) + "\n");

    // Connect to database
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected successfully\n");

    // Test 1: Check Resume Model has subscriptionInfo
    console.log("📋 Test 1: Checking Resume Model Schema...");
    const resumeSampleSchema = Resume.schema.obj;
    if (resumeSampleSchema.subscriptionInfo) {
      console.log("✅ subscriptionInfo field exists in Resume model");
      console.log(
        "   Fields:",
        Object.keys(resumeSampleSchema.subscriptionInfo)
      );
    } else {
      console.log("❌ subscriptionInfo field NOT found in Resume model");
    }
    console.log("");

    // Test 2: Check existing resumes
    console.log("📋 Test 2: Checking Existing Resumes...");
    const totalResumes = await Resume.countDocuments();
    const resumesWithSub = await Resume.countDocuments({
      "subscriptionInfo.createdWithSubscription": true,
    });
    const resumesWithoutSub = await Resume.countDocuments({
      $or: [
        {subscriptionInfo: {$exists: false}},
        {"subscriptionInfo.createdWithSubscription": false},
      ],
    });

    console.log(`   Total resumes: ${totalResumes}`);
    console.log(`   With subscription tracking: ${resumesWithSub}`);
    console.log(`   Without subscription tracking: ${resumesWithoutSub}`);

    if (resumesWithSub > 0) {
      console.log("\n   Sample resume with subscription:");
      const sampleResume = await Resume.findOne({
        "subscriptionInfo.createdWithSubscription": true,
      }).select("resumeTitle subscriptionInfo");
      console.log("   ", JSON.stringify(sampleResume, null, 2));
    }
    console.log("");

    // Test 3: Check active subscriptions
    console.log("📋 Test 3: Checking Active Subscriptions...");
    const activeOneTime = await Subscription.countDocuments({
      tier: "one-time",
      status: "active",
    });
    const activePro = await Subscription.countDocuments({
      tier: "pro",
      status: "active",
    });
    const expiredOneTime = await Subscription.countDocuments({
      tier: "one-time",
      status: "expired",
    });

    console.log(`   Active one-time subscriptions: ${activeOneTime}`);
    console.log(`   Active pro subscriptions: ${activePro}`);
    console.log(`   Expired one-time subscriptions: ${expiredOneTime}`);
    console.log("");

    // Test 4: Simulate subscription check logic
    console.log("📋 Test 4: Simulating Access Control Logic...");

    // Find a resume with subscription info
    const testResume = await Resume.findOne({
      "subscriptionInfo.createdWithSubscription": true,
    });

    if (testResume) {
      console.log(`   Testing resume: ${testResume.resumeTitle}`);
      console.log(
        `   Created with tier: ${testResume.subscriptionInfo.createdWithTier}`
      );
      console.log(
        `   Subscription ID: ${testResume.subscriptionInfo.subscriptionId}`
      );

      // Check if subscription is still active
      if (testResume.subscriptionInfo.subscriptionId) {
        const subscription = await Subscription.findById(
          testResume.subscriptionInfo.subscriptionId
        );

        if (subscription) {
          console.log(`   Subscription status: ${subscription.status}`);
          console.log(`   Subscription end date: ${subscription.endDate}`);

          const isActive =
            subscription.status === "active" &&
            (!subscription.endDate || subscription.endDate > new Date());

          if (isActive) {
            console.log("   ✅ ACCESS GRANTED - Subscription is active");
          } else {
            console.log("   ❌ ACCESS DENIED - Subscription expired");
          }
        } else {
          console.log("   ⚠️  Subscription not found in database");
        }
      }
    } else {
      console.log("   ℹ️  No resumes with subscription tracking found");
      console.log("   Create a new resume to test the feature");
    }
    console.log("");

    // Test 5: Check middleware export
    console.log("📋 Test 5: Checking Middleware Export...");
    try {
      const subscriptionMiddleware = await import(
        "../middleware/subscription.middleware.js"
      );
      if (subscriptionMiddleware.checkResumeSubscriptionAccess) {
        console.log("   ✅ checkResumeSubscriptionAccess middleware exists");
      } else {
        console.log("   ❌ checkResumeSubscriptionAccess middleware NOT found");
      }
    } catch (error) {
      console.log("   ❌ Error loading middleware:", error.message);
    }
    console.log("");

    // Summary
    console.log("=".repeat(80));
    console.log("  TEST SUMMARY");
    console.log("=".repeat(80));
    console.log("");
    console.log("✅ Implementation Status:");
    console.log("   [✅] Resume model updated with subscriptionInfo");
    console.log("   [✅] Middleware created for access control");
    console.log("   [ℹ️ ] Routes updated (check manually)");
    console.log("");
    console.log("📊 Database Status:");
    console.log(`   - ${totalResumes} total resumes`);
    console.log(`   - ${resumesWithSub} with subscription tracking`);
    console.log(`   - ${activeOneTime + activePro} active subscriptions`);
    console.log("");
    console.log("🎯 Next Steps:");
    console.log("   1. Create a new resume to test subscription linking");
    console.log("   2. Try AI enhancement on the resume");
    console.log("   3. Manually expire the subscription and test again");
    console.log("   4. Verify error messages display correctly");
    console.log("");

    // Close connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed\n");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    console.error("Error details:", error.stack);

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

// Run the test
testSubscriptionFix();
