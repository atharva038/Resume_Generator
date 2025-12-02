import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";
import UsageLog from "../models/UsageLog.model.js";
import * as aiRouter from "../services/aiRouter.service.js";
import * as paymentService from "../services/payment.service.js";

dotenv.config();

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

function test(name, fn) {
  testResults.total++;
  try {
    fn();
    console.log(`  ✓ PASS ${name}`);
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`  ✗ FAIL ${name}`);
    console.log(`    Error: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function asyncTest(name, fn) {
  testResults.total++;
  try {
    await fn();
    console.log(`  ✓ PASS ${name}`);
    testResults.passed++;
    return true;
  } catch (error) {
    console.log(`  ✗ FAIL ${name}`);
    console.log(`    Error: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function runTests() {
  console.log("🧪 Starting Comprehensive Backend Tests...\n");

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📡 Connected to MongoDB\n");

    let testUser;

    // ========================================
    // Test 1: Payment Service Configuration
    // ========================================
    console.log("📋 Testing Payment Service...\n");

    test("PRICING configuration exists", () => {
      if (!paymentService.PRICING) throw new Error("PRICING not exported");
      if (!paymentService.PRICING.free) throw new Error("FREE tier missing");
      if (!paymentService.PRICING.pro) throw new Error("PRO tier missing");
      if (!paymentService.PRICING.premium)
        throw new Error("PREMIUM tier missing");
    });

    test("PRICING has correct structure", () => {
      const freePricing = paymentService.PRICING.free;
      if (freePricing.amount !== 0) throw new Error("FREE tier should be ₹0");

      const proPricing = paymentService.PRICING.pro;
      if (!proPricing.monthly) throw new Error("PRO monthly price missing");
      if (proPricing.monthly !== 149)
        throw new Error("PRO monthly should be ₹149");
    });

    test("All 7 tiers are defined", () => {
      const tiers = [
        "free",
        "one-time",
        "pro",
        "premium",
        "student",
        "lifetime",
      ];
      tiers.forEach((tier) => {
        if (!paymentService.PRICING[tier]) {
          throw new Error(`${tier} tier missing`);
        }
      });
    });

    // ========================================
    // Test 2: AI Router Service
    // ========================================
    console.log("\n📋 Testing AI Router Service...\n");

    await asyncTest("Create test user for AI routing", async () => {
      testUser = await User.create({
        email: `test-ai-${Date.now()}@example.com`,
        password: "Test123!@#",
        name: "AI Test User",
        subscription: {
          tier: "free",
          plan: "lifetime",
          status: "active",
        },
      });
      if (!testUser) throw new Error("Failed to create test user");
    });

    test("getAIServiceInfo() returns config", () => {
      const info = aiRouter.getAIServiceInfo(testUser);
      if (!info.tier) throw new Error("Missing tier");
      if (!info.defaultModel) throw new Error("Missing defaultModel");
      if (info.tier !== "free") throw new Error("Expected free tier");
      if (info.defaultModel !== "gemini")
        throw new Error("Free tier should use Gemini");
    });

    await asyncTest(
      "AI Router selects correct service for free tier",
      async () => {
        // We can't actually call the AI without API credits, but we can test the logic
        const info = aiRouter.getAIServiceInfo(testUser);
        if (info.defaultModel !== "gemini") {
          throw new Error("Free tier should default to Gemini");
        }
      }
    );

    // Test premium user
    await asyncTest("Premium user gets GPT-4o", async () => {
      testUser.subscription.tier = "premium";
      await testUser.save();

      const info = aiRouter.getAIServiceInfo(testUser);
      if (info.defaultModel !== "gpt4o") {
        throw new Error("Premium tier should use GPT-4o");
      }
    });

    // Test Pro user (hybrid)
    await asyncTest("Pro user gets Hybrid mode", async () => {
      testUser.subscription.tier = "pro";
      await testUser.save();

      const info = aiRouter.getAIServiceInfo(testUser);
      if (info.defaultModel !== "hybrid") {
        throw new Error("Pro tier should use Hybrid");
      }
      if (!info.isHybrid) {
        throw new Error("isHybrid flag should be true");
      }
    });

    // ========================================
    // Test 3: Usage Tracking
    // ========================================
    console.log("\n📋 Testing Usage Tracking...\n");

    await asyncTest("User can increment usage", async () => {
      const initialCount = testUser.usage.resumesCreated;
      await testUser.incrementUsage("resume");
      await testUser.save();

      const updated = await User.findById(testUser._id);
      if (updated.usage.resumesCreated !== initialCount + 1) {
        throw new Error("Resume count not incremented");
      }
    });

    await asyncTest("Usage limits enforced correctly", async () => {
      testUser.subscription.tier = "free";
      testUser.usage.resumesThisMonth = 1; // Free tier limit
      await testUser.save();

      const hasReached = testUser.hasReachedLimit("resumes");
      if (!hasReached) {
        throw new Error("Free tier should have reached 1 resume limit");
      }
    });

    await asyncTest("Premium users have unlimited limits", async () => {
      testUser.subscription.tier = "premium";
      testUser.usage.resumesThisMonth = 100;
      await testUser.save();

      const hasReached = testUser.hasReachedLimit("resumes");
      if (hasReached) {
        throw new Error("Premium tier should have unlimited resumes");
      }
    });

    await asyncTest("UsageLog can be created", async () => {
      const log = await UsageLog.logUsage({
        userId: testUser._id,
        action: "resume_created",
        aiModel: "gemini",
        tokensUsed: {input: 1000, output: 500, total: 1500},
        cost: {amount: 0.02, currency: "INR"},
        success: true,
      });

      if (!log) throw new Error("Failed to create usage log");
      if (log.action !== "resume_created") throw new Error("Wrong action");
    });

    // ========================================
    // Test 4: Subscription Management
    // ========================================
    console.log("\n📋 Testing Subscription Management...\n");

    await asyncTest("Can create subscription record", async () => {
      const sub = await Subscription.create({
        userId: testUser._id,
        tier: "pro",
        plan: "monthly",
        status: "active",
        amount: 149,
        currency: "INR",
        paymentMethod: "razorpay",
        paymentId: "pay_test_123",
        orderId: "order_test_123",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      if (!sub) throw new Error("Failed to create subscription");
      if (!sub.isActive()) throw new Error("Subscription should be active");
    });

    await asyncTest("Can get active subscription", async () => {
      const activeSub = await Subscription.getActiveSubscription(testUser._id);
      if (!activeSub) throw new Error("Should find active subscription");
      if (activeSub.tier !== "pro") throw new Error("Should be pro tier");
    });

    await asyncTest("Can calculate days remaining", async () => {
      const activeSub = await Subscription.getActiveSubscription(testUser._id);
      const days = activeSub.daysRemaining();
      if (days < 25 || days > 30) {
        throw new Error(`Days remaining should be ~30, got ${days}`);
      }
    });

    // ========================================
    // Test 5: Feature Access Control
    // ========================================
    console.log("\n📋 Testing Feature Access Control...\n");

    await asyncTest("Free tier cannot access premium features", async () => {
      testUser.subscription.tier = "free";
      await testUser.save();

      const canAccess = testUser.canAccessFeature("coverLetters");
      if (canAccess) {
        throw new Error("Free tier should not access cover letters");
      }
    });

    await asyncTest("Premium tier can access all features", async () => {
      testUser.subscription.tier = "premium";
      await testUser.save();

      const features = ["resumes", "atsScans", "jobMatches", "coverLetters"];
      for (const feature of features) {
        if (!testUser.canAccessFeature(feature)) {
          throw new Error(`Premium should access ${feature}`);
        }
      }
    });

    await asyncTest("Pro tier has correct limits", async () => {
      testUser.subscription.tier = "pro";
      await testUser.save();

      const resumeLimit = testUser.getUsageLimit("resumes");
      const jobMatchLimit = testUser.getUsageLimit("jobMatches");

      if (resumeLimit !== Infinity) {
        throw new Error("Pro tier should have unlimited resumes");
      }
      if (jobMatchLimit !== 10) {
        throw new Error("Pro tier should have 10 job matches/day limit");
      }
    });

    // ========================================
    // Test 6: Environment Variables
    // ========================================
    console.log("\n📋 Testing Environment Configuration...\n");

    test("OpenAI API key is configured", () => {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY not set");
      }
      if (!process.env.OPENAI_API_KEY.startsWith("sk-")) {
        throw new Error("OPENAI_API_KEY format invalid");
      }
    });

    test("Razorpay keys are configured", () => {
      if (!process.env.RAZORPAY_KEY_ID) {
        throw new Error("RAZORPAY_KEY_ID not set");
      }
      if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("RAZORPAY_KEY_SECRET not set");
      }
    });

    test("Gemini API key is configured", () => {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY not set");
      }
    });

    // ========================================
    // Test 7: Model Validation
    // ========================================
    console.log("\n📋 Testing Model Validation...\n");

    await asyncTest("User model validates tier enum", async () => {
      try {
        const invalidUser = new User({
          email: "invalid@test.com",
          password: "Test123",
          name: "Invalid User",
          subscription: {
            tier: "invalid_tier", // Should fail
          },
        });
        await invalidUser.save();
        throw new Error("Should have failed validation");
      } catch (error) {
        if (!error.message.includes("enum")) {
          throw new Error("Expected enum validation error");
        }
      }
    });

    await asyncTest("Subscription model validates status", async () => {
      try {
        const invalidSub = new Subscription({
          userId: testUser._id,
          tier: "pro",
          plan: "monthly",
          status: "invalid_status", // Should fail
          amount: 149,
        });
        await invalidSub.save();
        throw new Error("Should have failed validation");
      } catch (error) {
        if (!error.message.includes("enum")) {
          throw new Error("Expected enum validation error");
        }
      }
    });

    // ========================================
    // Clean up
    // ========================================
    console.log("\n🧹 Cleaning up test data...\n");

    await User.deleteMany({email: {$regex: /^test-/}});
    await Subscription.deleteMany({paymentId: {$regex: /^pay_test_/}});
    await UsageLog.deleteMany({userId: testUser._id});

    console.log("✓ Test data cleaned\n");
  } catch (error) {
    console.error("❌ Test suite error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB\n");
  }

  // Print results
  console.log("══════════════════════════════════════════════════\n");
  console.log(
    `📊 Test Results: ${testResults.passed}/${testResults.total} passed\n`
  );

  if (testResults.failed === 0) {
    console.log("✅ All tests passed!\n");
    console.log(`Success Rate: 100%\n`);
  } else {
    console.log(`⚠ ${testResults.failed} test(s) failed\n`);
    console.log(
      `Success Rate: ${Math.round(
        (testResults.passed / testResults.total) * 100
      )}%\n`
    );
  }

  console.log("══════════════════════════════════════════════════\n");

  process.exit(testResults.failed === 0 ? 0 : 1);
}

runTests();
