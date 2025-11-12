import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import passport from "./config/passport.config.js";
import resumeRoutes from "./routes/resume.routes.js";
import authRoutes from "./routes/auth.routes.js";
import githubRoutes from "./routes/github.routes.js";
import atsRoutes from "./routes/ats.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import jobsRoutes from "./routes/jobs.js";
import mlRoutes from "./routes/ml.routes.js";
import {apiLimiter} from "./middleware/rateLimiter.middleware.js";
import {
  securityHeaders,
  additionalSecurityHeaders,
  corsOptions,
  securityLogger,
} from "./middleware/security.middleware.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// TRUST PROXY (Must be set first for Render/Vercel/etc.)
// ==========================================

// Enable trust proxy for apps behind reverse proxies (Render, Vercel, Nginx, etc.)
// This allows Express to correctly read X-Forwarded-* headers
app.set("trust proxy", 1); // Trust first proxy

// ==========================================
// SECURITY MIDDLEWARE (Applied First)
// ==========================================

// 1. Security Headers - Helmet.js configuration
app.use(securityHeaders);

// 2. Additional custom security headers
app.use(additionalSecurityHeaders);

// 3. CORS - Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// 4. Security logging (optional - for monitoring)
if (process.env.NODE_ENV === "development") {
  app.use(securityLogger);
}

// ==========================================
// SESSION & PASSPORT (For OAuth)
// ==========================================

// Express session with MongoDB store (required by Passport for OAuth)
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-session-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600, // lazy session update (in seconds)
      crypto: {
        secret: process.env.SESSION_SECRET || "session-encryption-secret",
      },
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // For cross-site OAuth
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ==========================================
// *  RATE LIMITING
// ==========================================

// Apply global rate limiter to all API routes
app.use("/api/", apiLimiter);

// ==========================================
// BODY PARSING & DATA SANITIZATION
// ==========================================

// Body parser with size limits
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({extended: true, limit: "10kb"}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// MongoDB Connection with better error handling
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Connected to database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("💡 Possible fixes:");
    console.error("   1. Check if your IP is whitelisted in MongoDB Atlas");
    console.error("   2. Verify your MongoDB connection string");
    console.error("   3. Check your network/firewall settings");
    process.exit(1);
  });

// Handle mongoose connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/ml", mlRoutes); // ML/AI matching routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "ATS Resume API is running",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {stack: err.stack}),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
