import AdminQuestion from "../models/AdminQuestion.model.js";
import { seedAdminQuestionsIfEmpty } from "../services/career.service.js";

/**
 * GET /api/admin/questions
 * Get all questions in the master bank with filtering & pagination
 */
export const getAllAdminQuestions = async (req, res) => {
  try {
    await seedAdminQuestionsIfEmpty(req.user?.userId);

    const { category, difficulty, status, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (category && category !== "all") query.category = category;
    if (difficulty && difficulty !== "all") query.difficulty = difficulty;
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    if (search && search.trim()) {
      query.$or = [
        { question: { $regex: search.trim(), $options: "i" } },
        { hint: { $regex: search.trim(), $options: "i" } },
        { tags: { $in: [new RegExp(search.trim(), "i")] } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await AdminQuestion.countDocuments(query);
    const questions = await AdminQuestion.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate("createdBy", "firstName lastName email")
      .lean();

    // Category breakdown statistics
    const stats = await AdminQuestion.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
        },
      },
    ]);

    const statsObj = {
      total,
      active: await AdminQuestion.countDocuments({ isActive: true }),
      hr: 0,
      behavioral: 0,
      project: 0,
      application: 0,
      technical: 0,
      custom: 0,
    };

    stats.forEach((s) => {
      if (statsObj[s._id] !== undefined) {
        statsObj[s._id] = s.count;
      }
    });

    res.json({
      success: true,
      questions,
      stats: statsObj,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    console.error("Get admin questions error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch questions" });
  }
};

/**
 * POST /api/admin/questions
 * Create a new question in the master bank
 */
export const createAdminQuestion = async (req, res) => {
  try {
    const {
      question,
      category,
      difficulty = "medium",
      tags = [],
      hint = "",
      recommendedLength = "standard",
      recommendedTone = "conversational",
      isActive = true,
      order = 0,
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question text is required" });
    }

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Check for duplicate question
    const existing = await AdminQuestion.findOne({
      question: { $regex: `^${question.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    });

    if (existing) {
      return res.status(409).json({ error: "A question with this exact text already exists in the master bank" });
    }

    const newQuestion = new AdminQuestion({
      question: question.trim(),
      category,
      difficulty,
      tags: Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean),
      hint: hint.trim(),
      recommendedLength,
      recommendedTone,
      isActive: isActive !== false,
      order: parseInt(order, 10) || 0,
      createdBy: req.user?.userId,
    });

    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question added to master bank successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Create admin question error:", error);
    res.status(500).json({ error: error.message || "Failed to create question" });
  }
};

/**
 * PUT /api/admin/questions/:id
 * Update an existing question
 */
export const updateAdminQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      question,
      category,
      difficulty,
      tags,
      hint,
      recommendedLength,
      recommendedTone,
      isActive,
      order,
    } = req.body;

    const targetQuestion = await AdminQuestion.findById(id);
    if (!targetQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (question !== undefined) targetQuestion.question = question.trim();
    if (category !== undefined) targetQuestion.category = category;
    if (difficulty !== undefined) targetQuestion.difficulty = difficulty;
    if (tags !== undefined) {
      targetQuestion.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (hint !== undefined) targetQuestion.hint = hint.trim();
    if (recommendedLength !== undefined) targetQuestion.recommendedLength = recommendedLength;
    if (recommendedTone !== undefined) targetQuestion.recommendedTone = recommendedTone;
    if (isActive !== undefined) targetQuestion.isActive = Boolean(isActive);
    if (order !== undefined) targetQuestion.order = parseInt(order, 10) || 0;

    await targetQuestion.save();

    res.json({
      success: true,
      message: "Question updated successfully",
      question: targetQuestion,
    });
  } catch (error) {
    console.error("Update admin question error:", error);
    res.status(500).json({ error: error.message || "Failed to update question" });
  }
};

/**
 * PATCH /api/admin/questions/:id/toggle-status
 * Toggle active/inactive status
 */
export const toggleAdminQuestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const targetQuestion = await AdminQuestion.findById(id);
    if (!targetQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    targetQuestion.isActive = !targetQuestion.isActive;
    await targetQuestion.save();

    res.json({
      success: true,
      message: `Question marked as ${targetQuestion.isActive ? "Active" : "Inactive"}`,
      isActive: targetQuestion.isActive,
    });
  } catch (error) {
    console.error("Toggle question status error:", error);
    res.status(500).json({ error: error.message || "Failed to toggle status" });
  }
};

/**
 * DELETE /api/admin/questions/:id
 * Delete a question from the master bank
 */
export const deleteAdminQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AdminQuestion.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({
      success: true,
      message: "Question deleted from master bank",
    });
  } catch (error) {
    console.error("Delete admin question error:", error);
    res.status(500).json({ error: error.message || "Failed to delete question" });
  }
};
