import mongoose from "mongoose";
import Feedback from "../models/Feedback.model.js";
import User from "../models/User.model.js";

/**
 * Submit new feedback
 * POST /api/feedback
 */
export const submitFeedback = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      priority,
      category,
      browserInfo,
      deviceInfo,
      pageUrl,
      screenshot,
    } = req.body;

    // Validate required fields
    if (!type || !title || !description) {
      return res.status(400).json({
        error: "Type, title, and description are required",
      });
    }

    // Validate type
    if (!["improvement", "feedback", "bug"].includes(type)) {
      return res.status(400).json({
        error: "Invalid feedback type",
      });
    }

    // Create feedback
    const feedback = new Feedback({
      userId: req.user.userId,
      type,
      title,
      description,
      priority: priority || "medium",
      category: category || "other",
      browserInfo,
      deviceInfo,
      pageUrl,
      screenshot,
    });

    await feedback.save();

    // Populate user info
    await feedback.populate("userId", "name email");

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({error: "Failed to submit feedback"});
  }
};

/**
 * Get user's feedback
 * GET /api/feedback/my-feedback
 */
export const getMyFeedback = async (req, res) => {
  try {
    const {type, status, page = 1, limit = 10} = req.query;

    const query = {userId: req.user.userId};

    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const feedbacks = await Feedback.find(query)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(parseInt(limit))
      .populate("userId", "name email")
      .populate("resolvedBy", "name email");

    const total = await Feedback.countDocuments(query);

    res.json({
      feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get my feedback error:", error);
    res.status(500).json({error: "Failed to fetch feedback"});
  }
};

/**
 * Get single feedback details
 * GET /api/feedback/:id
 */
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate("userId", "name email")
      .populate("resolvedBy", "name email");

    if (!feedback) {
      return res.status(404).json({error: "Feedback not found"});
    }

    // Check if user owns this feedback or is admin
    if (
      feedback.userId._id.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({error: "Access denied"});
    }

    res.json({feedback});
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({error: "Failed to fetch feedback"});
  }
};

/**
 * Update feedback (user can update their own)
 * PATCH /api/feedback/:id
 */
export const updateFeedback = async (req, res) => {
  try {
    const {title, description, priority, category} = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({error: "Feedback not found"});
    }

    // Check if user owns this feedback
    if (feedback.userId.toString() !== req.user.userId) {
      return res.status(403).json({error: "Access denied"});
    }

    // Users can only update open feedback
    if (feedback.status !== "open") {
      return res.status(400).json({
        error: "Cannot update feedback that is already being processed",
      });
    }

    // Update fields
    if (title) feedback.title = title;
    if (description) feedback.description = description;
    if (priority) feedback.priority = priority;
    if (category) feedback.category = category;

    await feedback.save();
    await feedback.populate("userId", "name email");

    res.json({
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    console.error("Update feedback error:", error);
    res.status(500).json({error: "Failed to update feedback"});
  }
};

/**
 * Delete feedback (user can delete their own)
 * DELETE /api/feedback/:id
 */
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({error: "Feedback not found"});
    }

    // Check if user owns this feedback
    if (feedback.userId.toString() !== req.user.userId) {
      return res.status(403).json({error: "Access denied"});
    }

    await feedback.deleteOne();

    res.json({message: "Feedback deleted successfully"});
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({error: "Failed to delete feedback"});
  }
};

/**
 * Upvote feedback
 * POST /api/feedback/:id/upvote
 */
export const upvoteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({error: "Feedback not found"});
    }

    const userId = req.user.userId;

    // Check if user already upvoted
    if (feedback.upvotedBy.includes(userId)) {
      // Remove upvote
      feedback.upvotedBy = feedback.upvotedBy.filter(
        (id) => id.toString() !== userId
      );
      feedback.upvotes = Math.max(0, feedback.upvotes - 1);
    } else {
      // Add upvote
      feedback.upvotedBy.push(userId);
      feedback.upvotes += 1;
    }

    await feedback.save();

    res.json({
      message: "Vote updated successfully",
      upvotes: feedback.upvotes,
      hasUpvoted: feedback.upvotedBy.includes(userId),
    });
  } catch (error) {
    console.error("Upvote feedback error:", error);
    res.status(500).json({error: "Failed to update vote"});
  }
};

/**
 * Get feedback statistics (for dashboard)
 * GET /api/feedback/stats
 */
export const getFeedbackStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Feedback.aggregate([
      {$match: {userId: new mongoose.Types.ObjectId(userId)}},
      {
        $group: {
          _id: null,
          total: {$sum: 1},
          improvements: {
            $sum: {$cond: [{$eq: ["$type", "improvement"]}, 1, 0]},
          },
          feedbacks: {
            $sum: {$cond: [{$eq: ["$type", "feedback"]}, 1, 0]},
          },
          bugs: {$sum: {$cond: [{$eq: ["$type", "bug"]}, 1, 0]}},
          open: {$sum: {$cond: [{$eq: ["$status", "open"]}, 1, 0]}},
          inProgress: {
            $sum: {$cond: [{$eq: ["$status", "in-progress"]}, 1, 0]},
          },
          resolved: {
            $sum: {$cond: [{$eq: ["$status", "resolved"]}, 1, 0]},
          },
          closed: {$sum: {$cond: [{$eq: ["$status", "closed"]}, 1, 0]}},
        },
      },
    ]);

    res.json({
      stats: stats[0] || {
        total: 0,
        improvements: 0,
        feedbacks: 0,
        bugs: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
      },
    });
  } catch (error) {
    console.error("Get feedback stats error:", error);
    res.status(500).json({error: "Failed to fetch statistics"});
  }
};
