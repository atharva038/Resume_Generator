import AdminNotification from "../models/AdminNotification.model.js";

const buildNotificationFilter = (query) => {
  const {status = "", type = "", severity = "", search = ""} = query;
  const filter = {};

  if (status) filter.status = status;
  if (type) filter.type = type;
  if (severity) filter.severity = severity;
  if (search) {
    filter.$or = [
      {title: {$regex: search, $options: "i"}},
      {message: {$regex: search, $options: "i"}},
    ];
  }

  return filter;
};

export const getAdminNotifications = async (req, res) => {
  try {
    const {page = 1, limit = 20} = req.query;
    const filter = buildNotificationFilter(req.query);
    const parsedLimit = Math.min(parseInt(limit), 100);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;

    const [notifications, total] = await Promise.all([
      AdminNotification.find(filter)
        .populate("userId", "name email role status")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      AdminNotification.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          total,
          page: parsedPage,
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
      },
    });
  } catch (error) {
    console.error("Get admin notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export const getAdminNotificationStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [unread, critical, errors, today, byType, bySeverity] =
      await Promise.all([
        AdminNotification.countDocuments({status: "unread"}),
        AdminNotification.countDocuments({
          severity: "critical",
          status: {$ne: "archived"},
        }),
        AdminNotification.countDocuments({
          severity: "error",
          status: {$ne: "archived"},
        }),
        AdminNotification.countDocuments({createdAt: {$gte: startOfDay}}),
        AdminNotification.aggregate([
          {$match: {status: {$ne: "archived"}}},
          {$group: {_id: "$type", count: {$sum: 1}}},
          {$sort: {count: -1}},
        ]),
        AdminNotification.aggregate([
          {$match: {status: {$ne: "archived"}}},
          {$group: {_id: "$severity", count: {$sum: 1}}},
          {$sort: {count: -1}},
        ]),
      ]);

    res.json({
      success: true,
      data: {
        unread,
        critical,
        errors,
        today,
        byType,
        bySeverity,
      },
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notification statistics",
      error: error.message,
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      {status: "read", readAt: new Date()},
      {new: true}
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({success: true, data: notification});
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const result = await AdminNotification.updateMany(
      {status: "unread"},
      {status: "read", readAt: new Date()}
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
      data: {modifiedCount: result.modifiedCount},
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

export const archiveNotification = async (req, res) => {
  try {
    const notification = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      {status: "archived"},
      {new: true}
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({success: true, data: notification});
  } catch (error) {
    console.error("Archive notification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to archive notification",
      error: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await AdminNotification.findByIdAndDelete(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};
