import mongoose from "mongoose";
import CareerProfile from "../models/CareerProfile.model.js";
import CareerQA from "../models/CareerQA.model.js";
import User from "../models/User.model.js";
import Resume from "../models/Resume.model.js";
import * as careerService from "../services/career.service.js";

/**
 * GET /api/career/profile
 * Get or create career profile for authenticated user with completeness calculation
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    let profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      // Auto-initialize profile from User if available
      const user = await User.findById(userId);
      profile = new CareerProfile({
        userId,
        personalInfo: {
          fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
          email: user?.email || "",
          location: user?.profile?.location || "",
          linkedin: user?.profile?.linkedin || "",
          github: user?.profile?.github || "",
        },
      });
      await profile.save();
    }

    const completeness = careerService.calculateCompleteness(profile);

    res.json({
      success: true,
      profile,
      completeness,
    });
  } catch (error) {
    console.error("Get career profile error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch career profile" });
  }
};

/**
 * PUT /api/career/profile
 * Update career profile data
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    let profile = await CareerProfile.findOne({ userId });
    if (!profile) {
      profile = new CareerProfile({ userId, ...updateData });
    } else {
      // Update fields
      if (updateData.personalInfo !== undefined) profile.personalInfo = updateData.personalInfo;
      if (updateData.education !== undefined) profile.education = updateData.education;
      if (updateData.skills !== undefined) profile.skills = updateData.skills;
      if (updateData.experience !== undefined) profile.experience = updateData.experience;
      if (updateData.projects !== undefined) profile.projects = updateData.projects;
      if (updateData.achievements !== undefined) profile.achievements = updateData.achievements;
      if (updateData.certifications !== undefined) profile.certifications = updateData.certifications;
      if (updateData.leadership !== undefined) profile.leadership = updateData.leadership;
      if (updateData.additionalInfo !== undefined) profile.additionalInfo = updateData.additionalInfo;
    }

    await profile.save();
    const completeness = careerService.calculateCompleteness(profile);

    res.json({
      success: true,
      message: "Career profile updated successfully",
      profile,
      completeness,
    });
  } catch (error) {
    console.error("Update career profile error:", error);
    res.status(500).json({ error: error.message || "Failed to update career profile" });
  }
};

/**
 * POST /api/career/profile/ai-structure
 * Structure raw unstructured text with AI for user review
 */
export const structureWithAI = async (req, res) => {
  try {
    const { section, rawText } = req.body;
    const user = await User.findById(req.user.userId);

    if (!section || !rawText) {
      return res.status(400).json({ error: "Section and text content are required" });
    }

    const structuredData = await careerService.structureSectionWithAI({
      section,
      rawText,
      user,
    });

    res.json({
      success: true,
      section,
      structuredData,
    });
  } catch (error) {
    console.error("AI structuring error:", error);
    res.status(500).json({ error: error.message || "Failed to structure information with AI" });
  }
};

/**
 * POST /api/career/profile/import-resume
 * Import data from existing SmartNShine resume
 */
export const importResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { resumeId, selectedSections } = req.body;

    const profile = await careerService.importFromResumeData({
      userId,
      sourceResumeId: resumeId,
      selectedSections: selectedSections || [],
    });

    const completeness = careerService.calculateCompleteness(profile);

    res.json({
      success: true,
      message: "Data imported successfully into Career Profile",
      profile,
      completeness,
    });
  } catch (error) {
    console.error("Import resume error:", error);
    res.status(500).json({ error: error.message || "Failed to import resume data" });
  }
};

/**
 * GET /api/career/profile/export-resume-format
 * Get Career Profile in standard Resume JSON format
 */
export const exportResumeFormat = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await CareerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ error: "Career profile not found" });
    }

    const resumeFormat = careerService.exportProfileToResumeFormat(profile);

    res.json({
      success: true,
      resumeData: resumeFormat,
    });
  } catch (error) {
    console.error("Export resume format error:", error);
    res.status(500).json({ error: error.message || "Failed to export profile format" });
  }
};

/**
 * GET /api/career/qa
 * Get personalized Q&A items, combined with default question bank
 */
export const getQAItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category, search, status, starred } = req.query;

    const query = { userId };
    if (category && category !== "all") query.category = category;
    if (status && status !== "all") query.status = status;
    if (starred === "true") query.isStarred = true;

    if (search && search.trim()) {
      query.$or = [
        { question: { $regex: search.trim(), $options: "i" } },
        { savedAnswer: { $regex: search.trim(), $options: "i" } },
        { aiDraft: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const userQAItems = await CareerQA.find(query).sort({ lastUpdated: -1 });

    // Load admin master questions
    const masterQuestions = await careerService.getActiveMasterQuestions({
      category: category && category !== "all" ? category : undefined,
      search: search && search.trim() ? search.trim() : undefined,
    });

    let combinedItems = [...userQAItems];

    if ((!status || status === "all") && starred !== "true") {
      const userQuestionsSet = new Set(userQAItems.map((q) => q.question.toLowerCase().trim()));
      const defaultsToAdd = masterQuestions
        .filter((dq) => !userQuestionsSet.has(dq.question.toLowerCase().trim()))
        .map((dq, idx) => ({
          _id: dq._id ? `master-${dq._id}` : `default-${dq.category}-${idx}-${encodeURIComponent(dq.question.slice(0, 60))}`,
          userId,
          question: dq.question,
          category: dq.category,
          difficulty: dq.difficulty || "medium",
          hint: dq.hint || "",
          tags: dq.tags || [],
          aiDraft: "",
          savedAnswer: "",
          status: "unanswered",
          answerLength: dq.recommendedLength || "standard",
          answerTone: dq.recommendedTone || "conversational",
          relatedProjects: [],
          relatedExperience: [],
          isStarred: false,
          isDefault: true,
          isAdminProvided: true,
        }));

      combinedItems = [...userQAItems, ...defaultsToAdd];
    }

    res.json({
      success: true,
      items: combinedItems,
      totalSaved: await CareerQA.countDocuments({ userId, status: "saved" }),
    });
  } catch (error) {
    console.error("Get Q&A error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch Q&A items" });
  }
};

/**
 * POST /api/career/qa/generate
 * Generate personalized AI answer for a question
 */
export const generateAnswer = async (req, res) => {
  try {
    const { question, category, answerLength, answerTone, jobDescription, selectedProject } = req.body;
    const user = await User.findById(req.user.userId);

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const aiResult = await careerService.generatePersonalizedAnswer({
      question,
      category: category || "hr",
      answerLength: answerLength || "standard",
      answerTone: answerTone || "conversational",
      jobDescription: jobDescription || "",
      selectedProject: selectedProject || "",
      user,
    });

    res.json({
      success: true,
      question,
      aiDraft: aiResult.answer,
      talkingPoints: aiResult.talkingPoints || [],
      relatedProjects: aiResult.relatedProjects || [],
      relatedExperience: aiResult.relatedExperience || [],
      missingInfoTip: aiResult.missingInfoTip || "",
    });
  } catch (error) {
    console.error("Generate answer error:", error);
    res.status(500).json({ error: error.message || "Failed to generate answer" });
  }
};

/**
 * POST /api/career/qa/save
 * Save or update final user answer in CareerQA bank
 */
export const saveAnswer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      qaId,
      question,
      category,
      aiDraft,
      savedAnswer,
      answerLength,
      answerTone,
      relatedProjects,
      relatedExperience,
      jobContext,
      isStarred,
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    let qaItem = null;

    if (qaId && mongoose.Types.ObjectId.isValid(qaId)) {
      qaItem = await CareerQA.findOne({ _id: qaId, userId });
    }

    if (!qaItem) {
      qaItem = await CareerQA.findOne({
        userId,
        question: question.trim(),
      });
    }

    if (!qaItem) {
      qaItem = new CareerQA({
        userId,
        question: question.trim(),
        category: category || "hr",
      });
    }

    if (category) qaItem.category = category;
    if (aiDraft !== undefined) qaItem.aiDraft = aiDraft;
    if (savedAnswer !== undefined) {
      qaItem.savedAnswer = savedAnswer;
      qaItem.status = savedAnswer.trim() ? "saved" : qaItem.aiDraft ? "drafted" : "unanswered";
    }
    if (answerLength) qaItem.answerLength = answerLength;
    if (answerTone) qaItem.answerTone = answerTone;
    if (relatedProjects) qaItem.relatedProjects = relatedProjects;
    if (relatedExperience) qaItem.relatedExperience = relatedExperience;
    if (jobContext) qaItem.jobContext = jobContext;
    if (isStarred !== undefined) qaItem.isStarred = isStarred;

    qaItem.lastUpdated = new Date();
    await qaItem.save();

    res.json({
      success: true,
      message: "Answer saved to career Q&A bank",
      item: qaItem,
    });
  } catch (error) {
    console.error("Save answer error:", error);
    res.status(500).json({ error: error.message || "Failed to save answer" });
  }
};

/**
 * POST /api/career/qa/toggle-star
 */
export const toggleStar = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { qaId, question, category } = req.body;

    let item = null;
    if (qaId && mongoose.Types.ObjectId.isValid(qaId)) {
      item = await CareerQA.findOne({ _id: qaId, userId });
    }

    if (!item && question) {
      item = await CareerQA.findOne({ userId, question: question.trim() });
    }

    if (!item) {
      item = new CareerQA({
        userId,
        question: question ? question.trim() : "Custom Question",
        category: category || "hr",
        isStarred: true,
      });
    } else {
      item.isStarred = !item.isStarred;
    }

    if (item) {
      await item.save();
    }

    res.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Toggle star error:", error);
    res.status(500).json({ error: error.message || "Failed to toggle star" });
  }
};

/**
 * DELETE /api/career/qa/:id
 */
export const deleteQAItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (id.startsWith("default-")) {
      return res.json({ success: true, message: "Default question removed from view" });
    }

    await CareerQA.findOneAndDelete({ _id: id, userId });
    res.json({ success: true, message: "Question removed" });
  } catch (error) {
    console.error("Delete QA error:", error);
    res.status(500).json({ error: error.message || "Failed to delete QA item" });
  }
};

/**
 * POST /api/career/qa/job-questions
 * Generate interview/application questions from a Job Description
 */
export const generateJobQuestions = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const user = await User.findById(req.user.userId);

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: "Job description is required" });
    }

    const result = await careerService.generateJobSpecificQuestions({
      jobDescription,
      user,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Generate job questions error:", error);
    res.status(500).json({ error: error.message || "Failed to generate job questions" });
  }
};

/**
 * POST /api/career/qa/project-questions
 * Generate technical architecture & challenge questions for a project
 */
export const generateProjectQuestions = async (req, res) => {
  try {
    const { project } = req.body;
    const user = await User.findById(req.user.userId);

    if (!project || !project.name) {
      return res.status(400).json({ error: "Project name and details are required" });
    }

    const result = await careerService.generateProjectQuestions({
      project,
      user,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Generate project questions error:", error);
    res.status(500).json({ error: error.message || "Failed to generate project questions" });
  }
};
