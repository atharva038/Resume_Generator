import User from "../models/User.model.js";
import Resume from "../models/Resume.model.js";
import Contact from "../models/Contact.js";
import AIUsage from "../models/AIUsage.model.js";
import AdminLog from "../models/AdminLog.model.js";
import Template from "../models/Template.model.js";
import Feedback from "../models/Feedback.model.js";
import Settings from "../models/Settings.model.js";

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalResumes,
      totalTemplates,
      totalAICalls,
      totalContacts,
      activeUsers,
      disabledUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Template.countDocuments(),
      AIUsage.countDocuments(),
      Contact.countDocuments(),
      User.countDocuments({status: "active"}),
      User.countDocuments({status: "disabled"}),
    ]);

    // Get users growth (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const usersGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {$gte: sevenDaysAgo},
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {format: "%Y-%m-%d", date: "$createdAt"},
          },
          count: {$sum: 1},
        },
      },
      {
        $sort: {_id: 1},
      },
    ]);

    // Get resumes growth (last 7 days)
    const resumesGrowth = await Resume.aggregate([
      {
        $match: {
          createdAt: {$gte: sevenDaysAgo},
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {format: "%Y-%m-%d", date: "$createdAt"},
          },
          count: {$sum: 1},
        },
      },
      {
        $sort: {_id: 1},
      },
    ]);

    // Get AI usage by feature
    const aiUsageByFeature = await AIUsage.aggregate([
      {
        $group: {
          _id: "$feature",
          count: {$sum: 1},
          totalTokens: {$sum: "$tokensUsed"},
          totalCost: {$sum: "$cost"},
        },
      },
    ]);

    // Get recent activities
    const recentUsers = await User.find()
      .select("name email createdAt")
      .sort({createdAt: -1})
      .limit(5);

    const recentResumes = await Resume.find()
      .populate("userId", "name email")
      .select("name userId createdAt")
      .sort({createdAt: -1})
      .limit(5);

    // Get total cost from AI usage
    const totalAICost = await AIUsage.aggregate([
      {
        $group: {
          _id: null,
          total: {$sum: "$cost"},
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalResumes,
          totalTemplates,
          totalAICalls,
          totalContacts,
          activeUsers,
          disabledUsers,
          totalAICost: totalAICost[0]?.total || 0,
        },
        charts: {
          usersGrowth,
          resumesGrowth,
          aiUsageByFeature,
        },
        recentActivity: {
          users: recentUsers,
          resumes: recentResumes,
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// Get All Users with Filters
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter query
    const filter = {};
    if (search) {
      filter.$or = [
        {name: {$regex: search, $options: "i"}},
        {email: {$regex: search, $options: "i"}},
      ];
    }
    if (role) filter.role = role;
    if (status) filter.status = status;

    // Build sort query
    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    // Get resume count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const resumeCount = await Resume.countDocuments({userId: user._id});
        const aiUsageCount = await AIUsage.countDocuments({userId: user._id});
        return {
          ...user.toObject(),
          resumeCount,
          aiUsageCount,
        };
      })
    );

    res.json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Get Single User Details
export const getUserDetails = async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's resumes
    const resumes = await Resume.find({userId}).sort({createdAt: -1});

    // Get user's AI usage
    const aiUsage = await AIUsage.find({userId})
      .sort({createdAt: -1})
      .limit(20);

    // Get AI usage stats
    const aiStats = await AIUsage.aggregate([
      {$match: {userId: user._id}},
      {
        $group: {
          _id: "$feature",
          count: {$sum: 1},
          totalTokens: {$sum: "$tokensUsed"},
          totalCost: {$sum: "$cost"},
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        user,
        resumes,
        aiUsage,
        aiStats,
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};

// Update User Status (Enable/Disable)
export const updateUserStatus = async (req, res) => {
  try {
    const {userId} = req.params;
    const {status} = req.body;

    if (!["active", "disabled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {status},
      {new: true}
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user.userId,
      action: status === "active" ? "user_enabled" : "user_disabled",
      targetType: "user",
      targetId: userId,
      description: `User ${user.email} ${
        status === "active" ? "enabled" : "disabled"
      }`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `User ${
        status === "active" ? "enabled" : "disabled"
      } successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

// Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const {userId} = req.params;
    const {role} = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role value",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {role},
      {new: true}
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user.userId,
      action: "other",
      targetType: "user",
      targetId: userId,
      description: `User ${user.email} role changed to ${role}`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user's resumes
    await Resume.deleteMany({userId});

    // Delete user's AI usage records
    await AIUsage.deleteMany({userId});

    // Delete user
    await User.findByIdAndDelete(userId);

    // Log admin action
    await AdminLog.create({
      adminId: req.user.userId,
      action: "user_deleted",
      targetType: "user",
      targetId: userId,
      description: `User ${user.email} deleted`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// Get AI Usage Analytics
export const getAIAnalytics = async (req, res) => {
  try {
    const {period = "7d", feature = ""} = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case "24h":
        startDate.setHours(now.getHours() - 24);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const matchFilter = {createdAt: {$gte: startDate}};
    if (feature) matchFilter.feature = feature;

    // Get usage over time
    const usageOverTime = await AIUsage.aggregate([
      {$match: matchFilter},
      {
        $group: {
          _id: {
            $dateToString: {format: "%Y-%m-%d", date: "$createdAt"},
          },
          count: {$sum: 1},
          totalTokens: {$sum: "$tokensUsed"},
          totalCost: {$sum: "$cost"},
        },
      },
      {$sort: {_id: 1}},
    ]);

    // Get usage by feature
    const usageByFeature = await AIUsage.aggregate([
      {$match: matchFilter},
      {
        $group: {
          _id: "$feature",
          count: {$sum: 1},
          totalTokens: {$sum: "$tokensUsed"},
          totalCost: {$sum: "$cost"},
          avgResponseTime: {$avg: "$responseTime"},
        },
      },
    ]);

    // Get usage by status
    const usageByStatus = await AIUsage.aggregate([
      {$match: matchFilter},
      {
        $group: {
          _id: "$status",
          count: {$sum: 1},
        },
      },
    ]);

    // Get top users
    const topUsers = await AIUsage.aggregate([
      {$match: matchFilter},
      {
        $group: {
          _id: "$userId",
          count: {$sum: 1},
          totalTokens: {$sum: "$tokensUsed"},
          totalCost: {$sum: "$cost"},
        },
      },
      {$sort: {count: -1}},
      {$limit: 10},
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {$unwind: "$user"},
      {
        $project: {
          userId: "$_id",
          userName: "$user.name",
          userEmail: "$user.email",
          count: 1,
          totalTokens: 1,
          totalCost: 1,
        },
      },
    ]);

    // Get recent logs
    const recentLogs = await AIUsage.find(matchFilter)
      .populate("userId", "name email")
      .sort({createdAt: -1})
      .limit(50);

    // Get totals
    const totals = await AIUsage.aggregate([
      {$match: matchFilter},
      {
        $group: {
          _id: null,
          totalCalls: {$sum: 1},
          totalTokens: {$sum: "$tokensUsed"},
          totalCost: {$sum: "$cost"},
          avgResponseTime: {$avg: "$responseTime"},
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totals: totals[0] || {
          totalCalls: 0,
          totalTokens: 0,
          totalCost: 0,
          avgResponseTime: 0,
        },
        charts: {
          usageOverTime,
          usageByFeature,
          usageByStatus,
        },
        topUsers,
        recentLogs,
      },
    });
  } catch (error) {
    console.error("Get AI analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch AI analytics",
      error: error.message,
    });
  }
};

// Get All Contact Messages
export const getContactMessages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "",
      category = "",
      search = "",
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        {name: {$regex: search, $options: "i"}},
        {email: {$regex: search, $options: "i"}},
        {subject: {$regex: search, $options: "i"}},
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [messages, total] = await Promise.all([
      Contact.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(parseInt(limit)),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get contact messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
};

// Update Contact Message Status
export const updateContactStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const {status, notes} = req.body;

    const validStatuses = ["new", "read", "replied", "archived"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (status === "replied") updateData.repliedAt = new Date();

    const contact = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    res.json({
      success: true,
      message: "Contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Update contact status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact status",
      error: error.message,
    });
  }
};

// Delete Contact Message
export const deleteContactMessage = async (req, res) => {
  try {
    const {id} = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    res.json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact message",
      error: error.message,
    });
  }
};

// Get Contact Message Statistics
export const getContactStatistics = async (req, res) => {
  try {
    const [totalContacts, statusStats, categoryStats] = await Promise.all([
      Contact.countDocuments(),
      Contact.aggregate([
        {
          $group: {
            _id: "$status",
            count: {$sum: 1},
          },
        },
      ]),
      Contact.aggregate([
        {
          $group: {
            _id: "$category",
            count: {$sum: 1},
          },
        },
      ]),
    ]);

    // Get recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = await Contact.countDocuments({
      createdAt: {$gte: sevenDaysAgo},
    });

    res.json({
      success: true,
      data: {
        total: totalContacts,
        byStatus: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        byCategory: categoryStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        recentCount,
      },
    });
  } catch (error) {
    console.error("Get contact statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact statistics",
      error: error.message,
    });
  }
};

// Get Admin Logs
export const getAdminLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action = "",
      adminId = "",
      startDate = "",
      endDate = "",
    } = req.query;

    const filter = {};
    if (action) filter.action = action;
    if (adminId) filter.adminId = adminId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AdminLog.find(filter)
        .populate("adminId", "name email")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(parseInt(limit)),
      AdminLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get admin logs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin logs",
      error: error.message,
    });
  }
};

// Get All Templates
export const getAllTemplates = async (req, res) => {
  try {
    const {page = 1, limit = 10, category = "", isActive = ""} = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isActive !== "") filter.isActive = isActive === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [templates, total] = await Promise.all([
      Template.find(filter)
        .populate("createdBy", "name email")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(parseInt(limit)),
      Template.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        templates,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get all templates error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: error.message,
    });
  }
};

// Update Template Status
export const updateTemplateStatus = async (req, res) => {
  try {
    const {templateId} = req.params;
    const {isActive} = req.body;

    const template = await Template.findByIdAndUpdate(
      templateId,
      {isActive},
      {new: true}
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user.userId,
      action: isActive ? "template_enabled" : "template_disabled",
      targetType: "template",
      targetId: templateId,
      description: `Template ${template.name} ${
        isActive ? "enabled" : "disabled"
      }`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Template ${isActive ? "enabled" : "disabled"} successfully`,
      data: template,
    });
  } catch (error) {
    console.error("Update template status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update template status",
      error: error.message,
    });
  }
};

// Delete Template
export const deleteTemplate = async (req, res) => {
  try {
    const {templateId} = req.params;

    const template = await Template.findByIdAndDelete(templateId);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user.userId,
      action: "template_deleted",
      targetType: "template",
      targetId: templateId,
      description: `Template ${template.name} deleted`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete template",
      error: error.message,
    });
  }
};

// Get All Feedback (Admin)
export const getAllFeedback = async (req, res) => {
  try {
    const {type, status, priority, page = 1, limit = 20, search} = req.query;

    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        {title: {$regex: search, $options: "i"}},
        {description: {$regex: search, $options: "i"}},
      ];
    }

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
    console.error("Get all feedback error:", error);
    res.status(500).json({error: "Failed to fetch feedback"});
  }
};

// Update Feedback Status (Admin)
export const updateFeedbackStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const {status, adminResponse, adminNotes} = req.body;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({error: "Feedback not found"});
    }

    if (status) feedback.status = status;
    if (adminResponse) feedback.adminResponse = adminResponse;
    if (adminNotes) feedback.adminNotes = adminNotes;

    if (status === "resolved" || status === "closed") {
      feedback.resolvedAt = new Date();
      feedback.resolvedBy = req.user.userId;
    }

    await feedback.save();
    await feedback.populate("userId", "name email");
    await feedback.populate("resolvedBy", "name email");

    res.json({
      message: "Feedback updated successfully",
      feedback,
    });
  } catch (error) {
    console.error("Update feedback status error:", error);
    res.status(500).json({error: "Failed to update feedback"});
  }
};

// Delete Feedback (Admin)
export const deleteFeedbackAdmin = async (req, res) => {
  try {
    const {id} = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({error: "Feedback not found"});
    }

    await feedback.deleteOne();

    res.json({message: "Feedback deleted successfully"});
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({error: "Failed to delete feedback"});
  }
};

// Get Feedback Statistics (Admin)
export const getFeedbackStatistics = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
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
          avgUpvotes: {$avg: "$upvotes"},
        },
      },
    ]);

    // Get feedback by category
    const byCategory = await Feedback.aggregate([
      {
        $group: {
          _id: "$category",
          count: {$sum: 1},
        },
      },
      {
        $sort: {count: -1},
      },
    ]);

    // Get top upvoted feedback
    const topFeedback = await Feedback.find()
      .sort({upvotes: -1})
      .limit(10)
      .populate("userId", "name email");

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
        avgUpvotes: 0,
      },
      byCategory,
      topFeedback,
    });
  } catch (error) {
    console.error("Get feedback statistics error:", error);
    res.status(500).json({error: "Failed to fetch statistics"});
  }
};

// ============================================
// AI QUOTA MONITORING ENDPOINTS
// ============================================

/**
 * Get all users with their AI quota status
 * GET /api/admin/ai-quota/users
 */
export const getUserQuotaStatus = async (req, res) => {
  try {
    const {sortBy = "usage", order = "desc", search = ""} = req.query;

    // Get all users
    const searchFilter = search
      ? {
          $or: [
            {name: {$regex: search, $options: "i"}},
            {email: {$regex: search, $options: "i"}},
          ],
        }
      : {};

    const users = await User.find(searchFilter).select(
      "name email role status createdAt"
    );

    // Calculate quota status for each user
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const quotaStatuses = await Promise.all(
      users.map(async (user) => {
        // Get daily and monthly usage
        const [dailyUsage, monthlyUsage] = await Promise.all([
          AIUsage.countDocuments({
            userId: user._id,
            createdAt: {$gte: startOfDay},
            status: "success",
          }),
          AIUsage.countDocuments({
            userId: user._id,
            createdAt: {$gte: startOfMonth},
            status: "success",
          }),
        ]);

        // Get monthly costs
        const monthlyCosts = await AIUsage.aggregate([
          {
            $match: {
              userId: user._id,
              createdAt: {$gte: startOfMonth},
              status: "success",
            },
          },
          {
            $group: {
              _id: null,
              totalCost: {$sum: "$cost"},
              totalTokens: {$sum: "$tokensUsed"},
            },
          },
        ]);

        const tier = user.role === "admin" ? "admin" : "free"; // TODO: Add premium tier support
        const limits = {
          free: {daily: 10, monthly: 200},
          premium: {daily: 100, monthly: 2000},
          admin: {daily: Infinity, monthly: Infinity},
        };

        const dailyLimit = limits[tier].daily;
        const monthlyLimit = limits[tier].monthly;

        return {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          tier,
          quota: {
            daily: {
              used: dailyUsage,
              limit: dailyLimit,
              remaining: Math.max(0, dailyLimit - dailyUsage),
              percentage:
                dailyLimit === Infinity ? 0 : (dailyUsage / dailyLimit) * 100,
            },
            monthly: {
              used: monthlyUsage,
              limit: monthlyLimit,
              remaining: Math.max(0, monthlyLimit - monthlyUsage),
              percentage:
                monthlyLimit === Infinity
                  ? 0
                  : (monthlyUsage / monthlyLimit) * 100,
              totalCost: monthlyCosts[0]?.totalCost || 0,
              totalTokens: monthlyCosts[0]?.totalTokens || 0,
            },
          },
          createdAt: user.createdAt,
        };
      })
    );

    // Sort results
    quotaStatuses.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "usage":
          comparison = b.quota.daily.used - a.quota.daily.used;
          break;
        case "cost":
          comparison = b.quota.monthly.totalCost - a.quota.monthly.totalCost;
          break;
        case "percentage":
          comparison = b.quota.daily.percentage - a.quota.daily.percentage;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = b.quota.daily.used - a.quota.daily.used;
      }
      return order === "desc" ? comparison : -comparison;
    });

    res.json({
      users: quotaStatuses,
      totalUsers: quotaStatuses.length,
      summary: {
        totalDailyUsage: quotaStatuses.reduce(
          (sum, u) => sum + u.quota.daily.used,
          0
        ),
        totalMonthlyCost: quotaStatuses.reduce(
          (sum, u) => sum + u.quota.monthly.totalCost,
          0
        ),
        usersNearLimit: quotaStatuses.filter(
          (u) => u.quota.daily.percentage >= 80 && u.tier !== "admin"
        ).length,
        usersOverLimit: quotaStatuses.filter(
          (u) => u.quota.daily.used >= u.quota.daily.limit && u.tier !== "admin"
        ).length,
      },
    });
  } catch (error) {
    console.error("Get user quota status error:", error);
    res.status(500).json({error: "Failed to fetch user quota status"});
  }
};

/**
 * Get detailed quota info for a specific user
 * GET /api/admin/ai-quota/users/:userId
 */
export const getUserQuotaDetails = async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId).select("name email role status");
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get usage breakdown by feature
    const usageByFeature = await AIUsage.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: {$gte: startOfMonth},
        },
      },
      {
        $group: {
          _id: "$feature",
          count: {$sum: 1},
          successCount: {
            $sum: {$cond: [{$eq: ["$status", "success"]}, 1, 0]},
          },
          errorCount: {
            $sum: {$cond: [{$eq: ["$status", "error"]}, 1, 0]},
          },
          totalTokens: {$sum: "$tokensUsed"},
          totalCost: {$sum: "$cost"},
          avgResponseTime: {$avg: "$responseTime"},
        },
      },
    ]);

    // Get daily usage over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyUsage = await AIUsage.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: {$gte: thirtyDaysAgo},
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {format: "%Y-%m-%d", date: "$createdAt"},
          },
          count: {$sum: 1},
          successCount: {
            $sum: {$cond: [{$eq: ["$status", "success"]}, 1, 0]},
          },
          totalCost: {$sum: "$cost"},
        },
      },
      {$sort: {_id: 1}},
    ]);

    // Get recent requests
    const recentRequests = await AIUsage.find({userId: user._id})
      .sort({createdAt: -1})
      .limit(20)
      .select(
        "feature tokensUsed cost responseTime status createdAt errorMessage"
      );

    // Calculate quota status
    const [dailyUsageCount, monthlyUsageCount] = await Promise.all([
      AIUsage.countDocuments({
        userId: user._id,
        createdAt: {$gte: startOfDay},
        status: "success",
      }),
      AIUsage.countDocuments({
        userId: user._id,
        createdAt: {$gte: startOfMonth},
        status: "success",
      }),
    ]);

    const tier = user.role === "admin" ? "admin" : "free";
    const limits = {
      free: {daily: 10, monthly: 200},
      premium: {daily: 100, monthly: 2000},
      admin: {daily: Infinity, monthly: Infinity},
    };

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        tier,
      },
      quota: {
        daily: {
          used: dailyUsageCount,
          limit: limits[tier].daily,
          remaining: Math.max(0, limits[tier].daily - dailyUsageCount),
        },
        monthly: {
          used: monthlyUsageCount,
          limit: limits[tier].monthly,
          remaining: Math.max(0, limits[tier].monthly - monthlyUsageCount),
        },
      },
      usageByFeature,
      dailyUsage,
      recentRequests,
    });
  } catch (error) {
    console.error("Get user quota details error:", error);
    res.status(500).json({error: "Failed to fetch user quota details"});
  }
};

/**
 * Update user's AI quota tier (for future premium support)
 * PATCH /api/admin/ai-quota/users/:userId/tier
 */
export const updateUserTier = async (req, res) => {
  try {
    const {userId} = req.params;
    const {tier} = req.body;

    if (!["free", "premium"].includes(tier)) {
      return res
        .status(400)
        .json({error: "Invalid tier. Must be 'free' or 'premium'"});
    }

    // TODO: Add tier field to User model
    // For now, return a message
    res.json({
      message:
        "Tier update feature coming soon. Please add 'tier' field to User model first.",
      note: "Currently, tier is determined by role: admin = unlimited, user = free",
    });
  } catch (error) {
    console.error("Update user tier error:", error);
    res.status(500).json({error: "Failed to update user tier"});
  }
};

/**
 * Reset user's daily quota (for testing/support)
 * POST /api/admin/ai-quota/users/:userId/reset-daily
 */
export const resetUserDailyQuota = async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }

    // Delete today's usage records for this user
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await AIUsage.deleteMany({
      userId: user._id,
      createdAt: {$gte: startOfDay},
    });

    res.json({
      message: `Daily quota reset successfully for ${user.name}`,
      deletedRecords: result.deletedCount,
    });
  } catch (error) {
    console.error("Reset user daily quota error:", error);
    res.status(500).json({error: "Failed to reset daily quota"});
  }
};

// ============================================
// SYSTEM SETTINGS ENDPOINTS
// ============================================

/**
 * Get all system settings
 * GET /api/admin/settings
 */
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({settings});
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({error: "Failed to fetch settings"});
  }
};

/**
 * Update system settings
 * PATCH /api/admin/settings
 */
export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const adminId = req.user.id;

    let settings = await Settings.getSettings();

    // Update settings with provided data
    Object.keys(updates).forEach((key) => {
      if (key !== "_id" && key !== "createdAt" && key !== "updatedAt") {
        if (typeof updates[key] === "object" && !Array.isArray(updates[key])) {
          // Handle nested objects
          settings[key] = {...settings[key], ...updates[key]};
        } else {
          settings[key] = updates[key];
        }
      }
    });

    settings.lastUpdatedBy = adminId;
    await settings.save();

    res.json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({error: "Failed to update settings"});
  }
};

/**
 * Reset settings to defaults
 * POST /api/admin/settings/reset
 */
export const resetSettings = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Delete existing settings
    await Settings.deleteMany({});

    // Create new default settings
    const settings = await Settings.create({lastUpdatedBy: adminId});

    res.json({
      message: "Settings reset to defaults successfully",
      settings,
    });
  } catch (error) {
    console.error("Reset settings error:", error);
    res.status(500).json({error: "Failed to reset settings"});
  }
};

/**
 * Get system statistics for settings page
 * GET /api/admin/settings/stats
 */
export const getSystemStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalResumes,
      totalAIUsage,
      totalStorage,
      avgResponseTime,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({status: "active"}),
      Resume.countDocuments(),
      AIUsage.countDocuments(),
      Resume.aggregate([
        {
          $group: {
            _id: null,
            totalSize: {$sum: {$ifNull: ["$fileSize", 0]}},
          },
        },
      ]),
      AIUsage.aggregate([
        {
          $group: {
            _id: null,
            avgTime: {$avg: "$responseTime"},
          },
        },
      ]),
    ]);

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayUsers, todayAIUsage] = await Promise.all([
      User.countDocuments({createdAt: {$gte: today}}),
      AIUsage.countDocuments({createdAt: {$gte: today}}),
    ]);

    // Calculate storage in MB
    const storageInMB = totalStorage[0]
      ? (totalStorage[0].totalSize / (1024 * 1024)).toFixed(2)
      : 0;

    res.json({
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          todayNew: todayUsers,
        },
        resumes: {
          total: totalResumes,
        },
        ai: {
          totalUsage: totalAIUsage,
          todayUsage: todayAIUsage,
          avgResponseTime: avgResponseTime[0]
            ? Math.round(avgResponseTime[0].avgTime)
            : 0,
        },
        storage: {
          used: storageInMB,
          unit: "MB",
        },
      },
    });
  } catch (error) {
    console.error("Get system stats error:", error);
    res.status(500).json({error: "Failed to fetch system statistics"});
  }
};

/**
 * Update AI quota limits
 * PATCH /api/admin/settings/ai-quota
 */
export const updateAIQuotaLimits = async (req, res) => {
  try {
    const {tier, daily, monthly} = req.body;

    if (!["free", "premium"].includes(tier)) {
      return res
        .status(400)
        .json({error: "Invalid tier. Must be 'free' or 'premium'"});
    }

    if (daily < 1 || monthly < 1) {
      return res.status(400).json({error: "Quota limits must be at least 1"});
    }

    const settings = await Settings.getSettings();
    settings.aiQuota[tier].daily = daily;
    settings.aiQuota[tier].monthly = monthly;
    settings.lastUpdatedBy = req.user.id;
    await settings.save();

    res.json({
      message: `AI quota limits updated for ${tier} tier`,
      aiQuota: settings.aiQuota,
    });
  } catch (error) {
    console.error("Update AI quota limits error:", error);
    res.status(500).json({error: "Failed to update AI quota limits"});
  }
};

/**
 * Toggle feature flag
 * PATCH /api/admin/settings/features/:feature
 */
export const toggleFeature = async (req, res) => {
  try {
    const {feature} = req.params;
    const {enabled} = req.body;

    const settings = await Settings.getSettings();

    if (settings.features[feature] === undefined) {
      return res.status(400).json({error: "Invalid feature name"});
    }

    settings.features[feature] = enabled;
    settings.lastUpdatedBy = req.user.id;
    await settings.save();

    res.json({
      message: `Feature '${feature}' ${enabled ? "enabled" : "disabled"}`,
      features: settings.features,
    });
  } catch (error) {
    console.error("Toggle feature error:", error);
    res.status(500).json({error: "Failed to toggle feature"});
  }
};

/**
 * Update rate limits
 * PATCH /api/admin/settings/rate-limits
 */
export const updateRateLimits = async (req, res) => {
  try {
    const {category, windowMs, max} = req.body;

    if (!["general", "auth", "ai", "upload"].includes(category)) {
      return res.status(400).json({error: "Invalid rate limit category"});
    }

    if (windowMs < 1000 || max < 1) {
      return res.status(400).json({
        error: "Invalid values. windowMs must be >= 1000ms, max must be >= 1",
      });
    }

    const settings = await Settings.getSettings();
    settings.rateLimits[category].windowMs = windowMs;
    settings.rateLimits[category].max = max;
    settings.lastUpdatedBy = req.user.id;
    await settings.save();

    res.json({
      message: `Rate limits updated for ${category}`,
      rateLimits: settings.rateLimits,
    });
  } catch (error) {
    console.error("Update rate limits error:", error);
    res.status(500).json({error: "Failed to update rate limits"});
  }
};
