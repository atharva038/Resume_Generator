import CareerApplication from "../models/CareerApplication.model.js";

/**
 * Submit a new career application (Public)
 * POST /api/career-applications/submit
 */
export const submitApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      timezone,
      roleId,
      roleTitle,
      department,
      experienceLevel,
      availability,
      startDate,
      workingStyle,
      linkedinUrl,
      portfolioUrl,
      githubUrl,
      otherUrl,
      bestProjectUrl,
      bestProjectDesc,
      whyJoin,
      scrappyStory,
      first30DaysPlan,
      marketInsight,
      resumeName,
      resumeSize,
      resumeData,
      additionalNotes,
      source,
    } = req.body;

    if (!name || !email || !roleTitle) {
      return res.status(400).json({
        success: false,
        error: "Full name, email address, and role title are required.",
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    const application = new CareerApplication({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      location: location?.trim() || "",
      timezone: timezone?.trim() || "",
      roleId: roleId?.trim() || "general",
      roleTitle: roleTitle.trim(),
      department: department?.trim() || "General",
      experienceLevel: experienceLevel?.trim() || "Early-Stage Hustler",
      availability: availability?.trim() || "Part-Time (10-20 hrs/week)",
      startDate: startDate?.trim() || "Immediate",
      workingStyle: workingStyle?.trim() || "Async-First & Flexible",
      linkedinUrl: linkedinUrl?.trim() || "",
      portfolioUrl: portfolioUrl?.trim() || "",
      githubUrl: githubUrl?.trim() || "",
      otherUrl: otherUrl?.trim() || "",
      bestProjectUrl: bestProjectUrl?.trim() || "",
      bestProjectDesc: bestProjectDesc?.trim() || "",
      whyJoin: whyJoin?.trim() || "",
      scrappyStory: scrappyStory?.trim() || "",
      first30DaysPlan: first30DaysPlan?.trim() || "",
      marketInsight: marketInsight?.trim() || "",
      resumeName: resumeName?.trim() || "",
      resumeSize: typeof resumeSize === "number" ? resumeSize : 0,
      resumeData: resumeData || "",
      additionalNotes: additionalNotes?.trim() || "",
      source: source || "careers_page",
      status: "pending",
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully! Our founders will review it within 48 hours.",
      applicationId: application._id,
    });
  } catch (error) {
    console.error("Error submitting career application:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to submit application. Please try again.",
    });
  }
};

/**
 * Get all career applications (Admin)
 * GET /api/career-applications
 */
export const getAllApplications = async (req, res) => {
  try {
    const { status, department, roleId, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (department && department !== "all") {
      query.department = { $regex: department, $options: "i" };
    }

    if (roleId && roleId !== "all") {
      query.roleId = roleId;
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { roleTitle: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { whyJoin: { $regex: q, $options: "i" } },
        { scrappyStory: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [applications, totalCount, statsCounts] = await Promise.all([
      CareerApplication.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take)
        .lean(),
      CareerApplication.countDocuments(query),
      CareerApplication.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = {
      total: 0,
      pending: 0,
      reviewed: 0,
      interviewing: 0,
      shortlisted: 0,
      archived: 0,
      rejected: 0,
    };

    statsCounts.forEach((item) => {
      if (stats[item._id] !== undefined) {
        stats[item._id] = item.count;
      }
      stats.total += item.count;
    });

    res.json({
      success: true,
      applications,
      totalCount,
      stats,
      page: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / take) || 1,
    });
  } catch (error) {
    console.error("Error fetching career applications:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch applications.",
    });
  }
};

/**
 * Get single application by ID (Admin)
 * GET /api/career-applications/:id
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await CareerApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found.",
      });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to load application.",
    });
  }
};

/**
 * Update application status (Admin)
 * PATCH /api/career-applications/:id/status
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "reviewed", "interviewing", "shortlisted", "rejected", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await CareerApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found.",
      });
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update status.",
    });
  }
};

/**
 * Add founder note (Admin)
 * PATCH /api/career-applications/:id/notes
 */
export const addFounderNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Note text cannot be empty.",
      });
    }

    const application = await CareerApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found.",
      });
    }

    application.founderNotes.push({
      text: text.trim(),
      author: author || "Founder",
      createdAt: new Date(),
    });

    await application.save();

    res.json({
      success: true,
      message: "Founder note added successfully.",
      founderNotes: application.founderNotes,
    });
  } catch (error) {
    console.error("Error adding founder note:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to add note.",
    });
  }
};

/**
 * Update candidate rating (Admin)
 * PATCH /api/career-applications/:id/rating
 */
export const updateApplicationRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be a number between 0 and 5.",
      });
    }

    const application = await CareerApplication.findByIdAndUpdate(
      id,
      { rating: numRating },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found.",
      });
    }

    res.json({
      success: true,
      message: `Rating set to ${numRating} stars`,
      rating: application.rating,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update rating.",
    });
  }
};

/**
 * Delete application (Admin)
 * DELETE /api/career-applications/:id
 */
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await CareerApplication.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found.",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete application.",
    });
  }
};
