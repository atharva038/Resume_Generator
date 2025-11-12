import express from "express";
import mlMatchingService from "../services/mlMatching.service.js";
import {authenticateToken} from "../middleware/auth.middleware.js";
import {trackAIUsage} from "../middleware/aiUsageTracker.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/ml/match-score
 * @desc    Calculate semantic match score between resume and job description
 * @access  Private
 */
router.post("/match-score", authenticateToken, async (req, res) => {
  const startTime = Date.now();
  try {
    const {resumeData, jobDescription} = req.body;

    // Validation
    if (!resumeData) {
      return res.status(400).json({
        success: false,
        error: "Resume data is required",
      });
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error: "Job description must be at least 50 characters long",
      });
    }

    // Calculate match score using ML service
    const matchResult = await mlMatchingService.calculateMatchScore(
      resumeData,
      jobDescription
    );

    // Track AI usage
    const responseTime = Date.now() - startTime;
    await trackAIUsage(
      req.user.userId,
      "ml_job_matching",
      matchResult.tokensUsed || 0,
      responseTime,
      "success"
    );

    res.json({
      success: true,
      data: matchResult,
    });
  } catch (error) {
    console.error("Match score calculation error:", error);

    // Track failed AI usage
    const responseTime = Date.now() - startTime;
    await trackAIUsage(
      req.user.userId,
      "ml_job_matching",
      0,
      responseTime,
      "error",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Failed to calculate match score. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /api/ml/skill-gap-analysis
 * @desc    Analyze skill gaps and provide learning recommendations
 * @access  Private
 */
router.post("/skill-gap-analysis", authenticateToken, async (req, res) => {
  const startTime = Date.now();
  try {
    const {resumeData, jobDescription} = req.body;

    // Validation
    if (!resumeData || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: "Resume data and job description are required",
      });
    }

    // Analyze skill gaps
    const analysis = await mlMatchingService.analyzeSkillGaps(
      resumeData,
      jobDescription
    );

    // Track AI usage
    const responseTime = Date.now() - startTime;
    await trackAIUsage(
      req.user.userId,
      "ml_skill_gap_analysis",
      analysis.tokensUsed || 0,
      responseTime,
      "success"
    );

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Skill gap analysis error:", error);

    // Track failed AI usage
    const responseTime = Date.now() - startTime;
    await trackAIUsage(
      req.user.userId,
      "ml_skill_gap_analysis",
      0,
      responseTime,
      "error",
      error.message
    );

    res.status(500).json({
      success: false,
      error: "Failed to analyze skill gaps. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /api/ml/quick-match
 * @desc    Quick match check (simplified, faster response)
 * @access  Public (rate-limited)
 */
router.post("/quick-match", async (req, res) => {
  try {
    const {skills, jobDescription} = req.body;

    if (!skills || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: "Skills and job description are required",
      });
    }

    // Simple keyword matching for quick results
    const jobDescLower = jobDescription.toLowerCase();
    const matchedSkills = skills.filter((skill) =>
      jobDescLower.includes(skill.toLowerCase())
    );

    const matchPercentage = Math.round(
      (matchedSkills.length / Math.max(skills.length, 1)) * 100
    );

    res.json({
      success: true,
      data: {
        matchPercentage,
        matchedSkills,
        totalSkills: skills.length,
      },
    });
  } catch (error) {
    console.error("Quick match error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to perform quick match",
    });
  }
});

export default router;
