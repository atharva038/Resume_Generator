import jwt from "jsonwebtoken";

/**
 * Middleware to verify dedicated Super Admin JWT token
 */
export const authenticateSuperAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Super Admin access token required",
        code: "NO_SUPER_ADMIN_TOKEN",
      });
    }

    const secret = process.env.JWT_SECRET || "smartnshine-super-admin-secret-2026";

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            error: "Super Admin session has expired. Please log in again.",
            code: "SUPER_ADMIN_TOKEN_EXPIRED",
          });
        }
        return res.status(403).json({
          success: false,
          error: "Invalid Super Admin credentials",
          code: "INVALID_SUPER_ADMIN_TOKEN",
        });
      }

      if (decoded.role !== "super-admin") {
        return res.status(403).json({
          success: false,
          error: "Access denied: Super Admin privileges required",
          code: "SUPER_ADMIN_FORBIDDEN",
        });
      }

      req.superAdmin = decoded;
      next();
    });
  } catch (error) {
    console.error("Super Admin auth middleware error:", error);
    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

/**
 * Logger for super admin activities
 */
export const logSuperAdminAction = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log(
        `🛡️ [SUPER ADMIN ACTION] ${req.method} ${req.originalUrl} - ${res.statusCode} (${Date.now() - start}ms) | IP: ${req.ip}`
      );
    }
  });
  next();
};
