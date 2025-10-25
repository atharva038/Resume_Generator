#!/usr/bin/env node
import mongoose from "mongoose";
import dotenv from "dotenv";
import Resume from "../models/Resume.model.js";

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
    console.log("Connected!");

    // Find resumes without resumeTitle
    const resumesWithoutTitle = await Resume.find({
      $or: [
        {resumeTitle: {$exists: false}},
        {resumeTitle: ""},
        {resumeTitle: null},
      ],
    });

    console.log(
      `Found ${resumesWithoutTitle.length} resumes without resumeTitle`
    );

    // Update each resume
    for (const resume of resumesWithoutTitle) {
      const newTitle = `Resume - ${resume.name || "Untitled"}`;
      resume.resumeTitle = newTitle;
      await resume.save();
      console.log(`Updated resume ${resume._id}: "${newTitle}"`);
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

main();
