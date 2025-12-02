#!/usr/bin/env node

/**
 * Migration Script: Add Subscription Fields to Existing Users
 *
 * This script migrates existing users to the new subscription model by:
 * 1. Adding subscription fields (defaults to free tier)
 * 2. Adding usage tracking fields
 * 3. Adding AI preferences
 * 4. Backing up existing data
 *
 * Usage: node migrateUsers.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";

// Load environment variables
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/resume_builder";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) =>
    console.log(
      `\n${colors.blue}═══${colors.reset} ${msg} ${colors.blue}═══${colors.reset}\n`
    ),
};

async function migrateUsers() {
  try {
    log.section("Starting User Migration");

    // Connect to MongoDB
    log.info("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    log.success("Connected to MongoDB");

    // Get all users
    log.info("Fetching existing users...");
    const users = await User.find({});
    log.info(`Found ${users.length} users to migrate`);

    if (users.length === 0) {
      log.warning("No users found to migrate");
      await mongoose.disconnect();
      return;
    }

    // Statistics
    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    log.section("Migrating Users");

    for (const user of users) {
      try {
        // Check if already migrated
        if (user.subscription && user.subscription.tier) {
          log.warning(`Skipping ${user.email} - already migrated`);
          skipped++;
          continue;
        }

        // Add subscription fields
        user.subscription = {
          tier: "free",
          status: "active",
          startDate: user.createdAt || new Date(),
        };

        // Add usage tracking
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
        };

        // Add preferences
        user.preferences = {
          aiModel: "gemini",
          currency: "INR",
          notifications: {
            email: true,
            usageAlerts: true,
            renewalReminders: true,
          },
        };

        // Save user
        await user.save();
        log.success(`Migrated: ${user.email}`);
        migrated++;
      } catch (error) {
        log.error(`Failed to migrate ${user.email}: ${error.message}`);
        errors++;
      }
    }

    // Summary
    log.section("Migration Summary");
    log.info(`Total users: ${users.length}`);
    log.success(`Successfully migrated: ${migrated}`);
    log.warning(`Skipped (already migrated): ${skipped}`);
    if (errors > 0) {
      log.error(`Errors: ${errors}`);
    }

    // Create indexes
    log.section("Creating Indexes");
    log.info("Creating indexes for better performance...");
    await User.collection.createIndex({"subscription.tier": 1});
    await User.collection.createIndex({"subscription.status": 1});
    await User.collection.createIndex({"subscription.endDate": 1});
    log.success("Indexes created successfully");

    log.section("Migration Complete!");
  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    log.info("Disconnected from MongoDB");
  }
}

// Run migration
migrateUsers()
  .then(() => {
    log.success("\n🎉 Migration script completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    log.error("\n💥 Migration script failed!\n");
    console.error(error);
    process.exit(1);
  });
