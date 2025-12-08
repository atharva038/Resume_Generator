import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({path: envPath});

// Also try loading from current directory if not found
if (!process.env.MONGODB_URI) {
  dotenv.config();
}

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  console.log("Checked locations:");
  console.log("  - " + envPath);
  console.log("  - Current directory .env");
  console.log(
    "Please ensure your .env file contains MONGODB_URI or set it in your environment"
  );
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully");

// Import models
import User from "../models/User.model.js";
import Subscription from "../models/Subscription.model.js";

const DRY_RUN = process.argv.includes("--dry-run");
const CREATE_BACKUP = process.argv.includes("--backup");
const FORCE = process.argv.includes("--force");

async function createBackup() {
  console.log("\n📦 Creating backup...");
  const backupDir = path.resolve(__dirname, "../backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, {recursive: true});
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(
    backupDir,
    `pre-production-cleanup-${timestamp}.json`
  );

  try {
    const users = await User.find({
      $or: [
        {"subscription.tier": {$ne: "free"}},
        {"subscription.plan": {$exists: true, $ne: null}},
        {"subscription.status": {$ne: "active"}},
        {"subscription.receiptId": {$exists: true, $ne: null}},
        {"subscription.paymentId": {$exists: true, $ne: null}},
        {"subscription.orderId": {$exists: true, $ne: null}},
      ],
    }).select("+subscription");

    const subscriptions = await Subscription.find({});

    const backup = {
      timestamp: new Date(),
      users: users.map((u) => ({
        _id: u._id,
        email: u.email,
        subscription: u.subscription,
      })),
      subscriptions: subscriptions,
    };

    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`✅ Backup created: ${backupFile}`);
    console.log(`   - Users with subscriptions: ${users.length}`);
    console.log(`   - Subscription records: ${subscriptions.length}`);

    return backupFile;
  } catch (error) {
    console.error("❌ Error creating backup:", error);
    throw error;
  }
}

async function analyzeData() {
  console.log("\n🔍 Analyzing current data...");

  const totalUsers = await User.countDocuments();
  const usersWithPlans = await User.countDocuments({
    "subscription.tier": {$ne: "free"},
  });
  const usersWithPayments = await User.countDocuments({
    $or: [
      {"subscription.receiptId": {$exists: true, $ne: null}},
      {"subscription.paymentId": {$exists: true, $ne: null}},
    ],
  });
  const totalSubscriptions = await Subscription.countDocuments();

  console.log("\n📊 Current State:");
  console.log(`   - Total users: ${totalUsers}`);
  console.log(`   - Users with paid plans: ${usersWithPlans}`);
  console.log(`   - Users with payment records: ${usersWithPayments}`);
  console.log(`   - Total subscription records: ${totalSubscriptions}`);

  return {
    totalUsers,
    usersWithPlans,
    usersWithPayments,
    totalSubscriptions,
  };
}

async function cleanupUserPlans() {
  console.log("\n🧹 Cleaning up user subscription data...");

  const updateData = {
    "subscription.tier": "free",
    "subscription.plan": null,
    "subscription.status": "active",
    "subscription.startDate": null,
    "subscription.endDate": null,
    "subscription.receiptId": null,
    "subscription.paymentId": null,
    "subscription.orderId": null,
    "subscription.autoRenew": false,
    "subscription.cancelledAt": null,
    "subscription.cancelReason": null,
  };

  if (DRY_RUN) {
    const affectedUsers = await User.countDocuments({
      $or: [
        {"subscription.tier": {$ne: "free"}},
        {"subscription.plan": {$exists: true, $ne: null}},
        {"subscription.receiptId": {$exists: true, $ne: null}},
        {"subscription.paymentId": {$exists: true, $ne: null}},
      ],
    });
    console.log(`   [DRY RUN] Would update ${affectedUsers} users`);
    return affectedUsers;
  }

  const result = await User.updateMany({}, {$set: updateData});

  console.log(`   ✅ Updated ${result.modifiedCount} users`);
  return result.modifiedCount;
}

async function cleanupSubscriptionRecords() {
  console.log("\n🗑️  Removing subscription records...");

  const count = await Subscription.countDocuments();

  if (DRY_RUN) {
    console.log(`   [DRY RUN] Would delete ${count} subscription records`);
    return count;
  }

  const result = await Subscription.deleteMany({});

  console.log(`   ✅ Deleted ${result.deletedCount} subscription records`);
  return result.deletedCount;
}

async function verifyCleanup() {
  console.log("\n✔️  Verifying cleanup...");

  const usersWithPlans = await User.countDocuments({
    "subscription.tier": {$ne: "free"},
  });
  const usersWithPayments = await User.countDocuments({
    $or: [
      {"subscription.receiptId": {$exists: true, $ne: null}},
      {"subscription.paymentId": {$exists: true, $ne: null}},
    ],
  });
  const remainingSubscriptions = await Subscription.countDocuments();

  console.log("\n📊 Post-Cleanup State:");
  console.log(`   - Users with paid plans: ${usersWithPlans}`);
  console.log(`   - Users with payment records: ${usersWithPayments}`);
  console.log(`   - Remaining subscription records: ${remainingSubscriptions}`);

  const isClean =
    usersWithPlans === 0 &&
    usersWithPayments === 0 &&
    remainingSubscriptions === 0;

  if (isClean) {
    console.log("\n✅ Database is clean and ready for production!");
  } else {
    console.log("\n⚠️  Warning: Some data still remains. Please review.");
  }

  return isClean;
}

async function main() {
  try {
    console.log(
      "╔════════════════════════════════════════════════════════════╗"
    );
    console.log(
      "║   Production Plan Cleanup Script                          ║"
    );
    console.log(
      "║   Removes all subscription/plan data before production    ║"
    );
    console.log(
      "╚════════════════════════════════════════════════════════════╝"
    );

    if (DRY_RUN) {
      console.log("\n🔍 Running in DRY RUN mode - no changes will be made");
    }

    if (!FORCE && !DRY_RUN) {
      console.log(
        "\n⚠️  WARNING: This will permanently delete all subscription data!"
      );
      console.log("   Add --force flag to proceed with actual cleanup");
      console.log("   Add --dry-run flag to see what would be changed");
      console.log("   Add --backup flag to create a backup before cleanup");
      process.exit(0);
    }

    // Connect to database
    console.log("\n🔌 Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Analyze current state
    const stats = await analyzeData();

    if (stats.usersWithPlans === 0 && stats.totalSubscriptions === 0) {
      console.log("\n✨ Database is already clean! No action needed.");
      process.exit(0);
    }

    // Create backup if requested
    if (CREATE_BACKUP && !DRY_RUN) {
      await createBackup();
    }

    // Perform cleanup
    console.log("\n🚀 Starting cleanup process...");

    const usersUpdated = await cleanupUserPlans();
    const subscriptionsDeleted = await cleanupSubscriptionRecords();

    // Verify cleanup
    if (!DRY_RUN) {
      await verifyCleanup();
    }

    console.log(
      "\n═══════════════════════════════════════════════════════════"
    );
    console.log("Summary:");
    console.log(`  - Users updated: ${usersUpdated}`);
    console.log(`  - Subscriptions deleted: ${subscriptionsDeleted}`);
    if (DRY_RUN) {
      console.log(
        "\n💡 Run without --dry-run and with --force to apply changes"
      );
    }
    console.log(
      "═══════════════════════════════════════════════════════════\n"
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error during cleanup:", error);
    process.exit(1);
  }
}

// Handle cleanup on exit
process.on("SIGINT", async () => {
  console.log("\n\n⚠️  Interrupted. Closing database connection...");
  await mongoose.connection.close();
  process.exit(0);
});

main();
