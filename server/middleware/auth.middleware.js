import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    console.log("🔐 Auth middleware called for:", req.method, req.path);
    console.log(
      "  - Authorization header:",
      authHeader ? "Present" : "Missing"
    );
    console.log("  - Token extracted:", token ? "Yes" : "No");
    console.log(
      "  - JWT_SECRET exists:",
      process.env.JWT_SECRET ? "Yes" : "NO!"
    );

    if (!token) {
      console.log("🔒 Auth failed: No token provided");
      return res.status(401).json({error: "Access token required"});
    }

    // Log first and last few chars of token for debugging (never log full token)
    console.log(
      "  - Token preview:",
      token.substring(0, 20) + "..." + token.substring(token.length - 10)
    );

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("🔒 Auth failed: Token verification error:", err.message);
        console.error("  - Error type:", err.name);
        console.error("  - Error details:", err);

        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            error: "Token has expired",
            code: "TOKEN_EXPIRED",
          });
        }

        if (err.name === "JsonWebTokenError") {
          return res.status(403).json({
            error: "Invalid token",
            code: "INVALID_TOKEN",
            details: err.message,
          });
        }

        return res.status(403).json({error: "Invalid or expired token"});
      }

      console.log("✅ Auth successful for user:", user.userId, user.email);
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({error: "Authentication failed"});
  }
};

/**
 * Generate JWT token for user
 */
export const generateToken = (userId, email) => {
  return jwt.sign({userId, email}, process.env.JWT_SECRET, {expiresIn: "7d"});
};
