/**
 * Migration Script: Add Receipt IDs to Existing Subscriptions
 * Run this once to add receipt IDs to all existing subscriptions that don't have one
 */

import mongoose from "mongoose";
import crypto from "crypto";
import Subscription from "../models/Subscription.model.js";
import dotenv from "dotenv";

dotenv.config();

// Generate unique receipt ID
function generateReceiptId(createdAt) {
  const date = createdAt || new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const random = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
  return `RCP-${dateStr}-${random}`;
}

async function migrateReceiptIds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find all subscriptions without receiptId
    const subscriptionsWithoutReceipt = await Subscription.find({
      $or: [{receiptId: {$exists: false}}, {receiptId: null}, {receiptId: ""}],
    });

    console.log(
      `📊 Found ${subscriptionsWithoutReceipt.length} subscriptions without receipt IDs`
    );

    if (subscriptionsWithoutReceipt.length === 0) {
      console.log("✅ All subscriptions already have receipt IDs!");
      process.exit(0);
    }

    // Update each subscription
    let updated = 0;
    for (const sub of subscriptionsWithoutReceipt) {
      const receiptId = generateReceiptId(sub.createdAt);

      await Subscription.updateOne({_id: sub._id}, {$set: {receiptId}});

      console.log(
        `✅ Added receipt ID ${receiptId} to subscription ${sub._id}`
      );
      updated++;
    }

    console.log(`\n✅ Migration complete! Updated ${updated} subscriptions`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateReceiptIds();
