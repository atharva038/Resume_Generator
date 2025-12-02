/**
 * Test Script for Subscription Models
 *
 * This script tests:
 * - User model with subscription fields
 * - Subscription model
 * - UsageLog model
 * - Helper methods
 *
 * Run: node testModels.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";
import UsageLog from "../models/UsageLog.model.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/resume_builder";

const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  reset: "\x1b[0m",
};

function logTest(name, passed) {
  const status = passed
    ? `${colors.green}✓ PASS${colors.reset}`
    : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`  ${status} ${name}`);
  return passed;
}

async function runTests() {
  let totalTests = 0;
  let passedTests = 0;

  try {
    console.log("\n🧪 Starting Model Tests...\n");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("📡 Connected to MongoDB\n");

    // ==================== USER MODEL TESTS ====================
    console.log("📋 Testing User Model...\n");

    // Test 1: Create user with subscription fields
    totalTests++;
    const testUser = new User({
      email: "test@subscription.com",
      password: "Test123!",
      name: "Test User",
      subscription: {
        tier: "free",
        status: "active",
      },
    });

    const userSaved =
      testUser.email === "test@subscription.com" &&
      testUser.subscription.tier === "free";
    if (logTest("Create user with subscription fields", userSaved))
      passedTests++;

    // Test 2: Default values
    totalTests++;
    const hasDefaults =
      testUser.usage.resumesCreated === 0 &&
      testUser.subscription.status === "active";
    if (logTest("Default values applied correctly", hasDefaults)) passedTests++;

    // Test 3: hasActiveSubscription method
    totalTests++;
    const isActive = testUser.hasActiveSubscription();
    if (logTest("hasActiveSubscription() returns true for active", isActive))
      passedTests++;

    // Test 4: isPremiumUser method (free user)
    totalTests++;
    const isFreeUser = !testUser.isPremiumUser();
    if (logTest("isPremiumUser() returns false for free tier", isFreeUser))
      passedTests++;

    // Test 5: getUsageLimit method
    totalTests++;
    const resumeLimit = testUser.getUsageLimit("resumesPerMonth");
    const limitCorrect = resumeLimit === 1; // Free tier = 1 resume
    if (logTest("getUsageLimit() returns correct limit", limitCorrect))
      passedTests++;

    // Test 6: hasReachedLimit method
    totalTests++;
    testUser.usage.resumesThisMonth = 1;
    const reachedLimit = testUser.hasReachedLimit("resumesPerMonth");
    if (logTest("hasReachedLimit() detects limit reached", reachedLimit))
      passedTests++;

    // Test 7: canAccessFeature method
    totalTests++;
    const canAccessBasic = testUser.canAccessFeature("basic-resume");
    const cannotAccessPremium = !testUser.canAccessFeature("interview-qa");
    const featureAccessWorks = canAccessBasic && cannotAccessPremium;
    if (
      logTest("canAccessFeature() correctly checks access", featureAccessWorks)
    )
      passedTests++;

    // ==================== SUBSCRIPTION MODEL TESTS ====================
    console.log("\n📋 Testing Subscription Model...\n");

    // Test 8: Create subscription
    totalTests++;
    const testSubscription = new Subscription({
      userId: testUser._id,
      tier: "pro",
      plan: "monthly",
      status: "active",
      amount: 149,
      currency: "INR",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    const subCreated =
      testSubscription.tier === "pro" && testSubscription.amount === 149;
    if (logTest("Create subscription record", subCreated)) passedTests++;

    // Test 9: isActive method
    totalTests++;
    const subActive = testSubscription.isActive();
    if (logTest("Subscription isActive() method works", subActive))
      passedTests++;

    // Test 10: daysRemaining method
    totalTests++;
    const daysLeft = testSubscription.daysRemaining();
    const daysCorrect = daysLeft >= 29 && daysLeft <= 31;
    if (logTest("daysRemaining() calculates correctly", daysCorrect))
      passedTests++;

    // ==================== USAGE LOG MODEL TESTS ====================
    console.log("\n📋 Testing UsageLog Model...\n");

    // Test 11: Create usage log
    totalTests++;
    const testLog = new UsageLog({
      userId: testUser._id,
      action: "resume_created",
      aiModel: "gemini",
      tokensUsed: {
        input: 500,
        output: 300,
        total: 800,
      },
      cost: {
        amount: 0.02,
        currency: "INR",
      },
      success: true,
      metadata: {
        userTier: "free",
      },
    });

    const logCreated =
      testLog.action === "resume_created" && testLog.tokensUsed.total === 800;
    if (logTest("Create usage log entry", logCreated)) passedTests++;

    // Test 12: logUsage static method
    totalTests++;
    const quickLog = await UsageLog.logUsage({
      userId: testUser._id,
      action: "ats_scan",
      aiModel: "gpt4o",
      tokensUsed: {total: 1200},
      cost: {amount: 2.5, currency: "INR"},
    });
    const quickLogWorks = quickLog && quickLog.action === "ats_scan";
    if (logTest("UsageLog.logUsage() static method", quickLogWorks))
      passedTests++;

    // ==================== HELPER METHODS TESTS ====================
    console.log("\n📋 Testing Helper Methods...\n");

    // Test 13: Premium user methods
    totalTests++;
    testUser.subscription.tier = "premium";
    const nowPremium = testUser.isPremiumUser();
    const unlimitedResumes =
      testUser.getUsageLimit("resumesPerMonth") === Infinity;
    const premiumWorks = nowPremium && unlimitedResumes;
    if (logTest("Premium tier gets unlimited limits", premiumWorks))
      passedTests++;

    // Test 14: Subscription expiry check
    totalTests++;
    testUser.subscription.endDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
    const expired = await testUser.checkSubscriptionExpiry();
    const downgradedToFree = testUser.subscription.tier === "free";
    const expiryWorks = expired && downgradedToFree;
    if (
      logTest("checkSubscriptionExpiry() downgrades expired users", expiryWorks)
    )
      passedTests++;

    // ==================== CLEANUP ====================
    console.log("\n🧹 Cleaning up test data...\n");

    // Note: In production, you'd actually clean up test data here
    // For now, we'll just report completion
  } catch (error) {
    console.error(`\n❌ Test error: ${error.message}\n`);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB\n");
  }

  // ==================== SUMMARY ====================
  console.log("═".repeat(50));
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} passed\n`);

  if (passedTests === totalTests) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠ Some tests failed${colors.reset}\n`);
  }

  const percentage = Math.round((passedTests / totalTests) * 100);
  console.log(`Success Rate: ${percentage}%\n`);
  console.log("═".repeat(50) + "\n");

  process.exit(passedTests === totalTests ? 0 : 1);
}

// Run tests
runTests().catch(console.error);
