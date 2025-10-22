import User from "../models/User.model.js";

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    // User ID is set by auth middleware
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    if (user.status === "disabled") {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    // Add user details to request
    req.adminUser = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during authorization",
    });
  }
};

// Middleware to log admin actions
export const logAdminAction = async (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    // Log admin action after successful request
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // You can save this to a database
      console.log({
        adminId: req.user?.userId,
        adminEmail: req.adminUser?.email,
        action: req.method,
        endpoint: req.originalUrl,
        timestamp: new Date(),
        ip: req.ip,
      });
    }
    originalSend.call(this, data);
  };

  next();
};
