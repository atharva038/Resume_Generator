/**
 * Script to Remove All User Subscriptions
 *
 * WARNING: This will delete ALL subscriptions from the database
 * Use with caution!
 *
 * Usage: node scripts/removeAllSubscriptions.js
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

// Subscription Schema (inline to avoid import issues)
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tier: String,
  plan: String,
  status: String,
  startDate: Date,
  endDate: Date,
  amount: Number,
  currency: String,
  paymentMethod: String,
  receiptId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySubscriptionId: String,
  autoRenew: Boolean,
  features: Object,
  metadata: Object,
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

/**
 * Remove all subscriptions from database
 */
async function removeAllSubscriptions() {
  try {
    console.log("🔌 Connecting to MongoDB...");

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully\n");

    // Get count before deletion
    const countBefore = await Subscription.countDocuments();
    console.log(`📊 Found ${countBefore} subscriptions in database\n`);

    if (countBefore === 0) {
      console.log("ℹ️  No subscriptions found to delete");
      await mongoose.connection.close();
      return;
    }

    // Ask for confirmation
    console.log("⚠️  WARNING: You are about to delete ALL subscriptions!");
    console.log("   This action cannot be undone.\n");

    // Get all subscriptions for logging
    const subscriptions = await Subscription.find();

    console.log("📋 Subscriptions to be deleted:");
    console.log("━".repeat(80));
    subscriptions.forEach((sub, index) => {
      console.log(`${index + 1}. User ID: ${sub.userId}`);
      console.log(
        `   Tier: ${sub.tier} | Plan: ${sub.plan} | Status: ${sub.status}`
      );
      console.log(
        `   Amount: ₹${sub.amount} | Payment ID: ${
          sub.razorpayPaymentId || "N/A"
        }`
      );
      console.log("━".repeat(80));
    });

    console.log("\n🗑️  Proceeding with deletion...\n");

    // Delete all subscriptions
    const result = await Subscription.deleteMany({});

    console.log(`✅ Successfully deleted ${result.deletedCount} subscriptions`);

    // Verify deletion
    const countAfter = await Subscription.countDocuments();
    console.log(`📊 Subscriptions remaining: ${countAfter}\n`);

    if (countAfter === 0) {
      console.log("🎉 All subscriptions removed successfully!");
      console.log("💡 All users are now on FREE tier");
    } else {
      console.log(`⚠️  Warning: ${countAfter} subscriptions still remain`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  } catch (error) {
    console.error("\n❌ Error removing subscriptions:", error);

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

// Run the script
console.log("\n" + "=".repeat(80));
console.log("  REMOVE ALL SUBSCRIPTIONS - SmartNShine");
console.log("=".repeat(80) + "\n");

removeAllSubscriptions();
