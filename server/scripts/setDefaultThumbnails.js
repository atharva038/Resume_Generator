#!/usr/bin/env node
import mongoose from "mongoose";
import dotenv from "dotenv";
import Template from "../models/Template.model.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/test";

async function main() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Set default thumbnail for templates missing thumbnail or with empty string
    const result = await Template.updateMany(
      {
        $or: [
          {thumbnail: {$exists: false}},
          {thumbnail: ""},
          {thumbnail: null},
        ],
      },
      {$set: {thumbnail: "/templates/default.svg"}}
    );

    console.log(`✅ Thumbnail update complete:`);
    console.log(`   Matched: ${result.matchedCount} documents`);
    console.log(`   Modified: ${result.modifiedCount} documents`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error setting default thumbnails:", err);
    process.exit(1);
  }
}

main();
