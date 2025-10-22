import express from "express";
import Contact from "../models/Contact.js";
import {authenticateToken} from "../middleware/auth.middleware.js";

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post("/", async (req, res) => {
  try {
    const {name, email, subject, message, phone, company, category} = req.body;

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      phone,
      company,
      category: category || "general",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
    });

    await contact.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt,
      },
    });
  } catch (err) {
    console.error("Contact submission error:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to submit contact form. Please try again later.",
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact submissions (Admin only)
// @access  Private
router.get("/", authenticateToken, async (req, res) => {
  try {
    const {status, limit = 50, page = 1} = req.query;

    const query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({createdAt: -1})
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Get contacts error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch contacts",
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact submission
// @access  Private
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    // Update status to 'read' if it's 'new'
    if (contact.status === "new") {
      contact.status = "read";
      await contact.save();
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (err) {
    console.error("Get contact error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch contact",
    });
  }
});

// @route   PATCH /api/contact/:id
// @desc    Update contact status
// @access  Private
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const {status, notes} = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (status === "replied") updateData.repliedAt = new Date();

    const contact = await Contact.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (err) {
    console.error("Update contact error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to update contact",
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact submission
// @access  Private
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (err) {
    console.error("Delete contact error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete contact",
    });
  }
});

// @route   GET /api/contact/stats/summary
// @desc    Get contact statistics
// @access  Private
router.get("/stats/summary", authenticateToken, async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: {$sum: 1},
        },
      },
    ]);

    const total = await Contact.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await Contact.countDocuments({
      createdAt: {$gte: todayStart},
    });

    res.json({
      success: true,
      data: {
        total,
        today: todayCount,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
      },
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
});

export default router;
