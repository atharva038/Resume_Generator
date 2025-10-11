import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({error: "Access token required"});
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({error: "Invalid or expired token"});
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({error: "Authentication failed"});
  }
};

/**
 * Generate JWT token for user
 */
export const generateToken = (userId, email) => {
  return jwt.sign({userId, email}, process.env.JWT_SECRET, {expiresIn: "7d"});
};
