/**
 * Security Headers Middleware
 *
 * Implements comprehensive security headers to protect against:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - MIME type sniffing
 * - Information disclosure
 * - Man-in-the-middle attacks
 *
 * Uses helmet.js for battle-tested security header configurations
 */

import helmet from "helmet";

/**
 * Configure security headers middleware
 *
 * Headers implemented:
 * - Content-Security-Policy: Prevents XSS and code injection
 * - X-Content-Type-Options: Prevents MIME sniffing
 * - X-Frame-Options: Prevents clickjacking
 * - X-XSS-Protection: Enables browser XSS filter
 * - Strict-Transport-Security: Enforces HTTPS
 * - Referrer-Policy: Controls referrer information
 * - Permissions-Policy: Controls browser features
 */
export const securityHeaders = helmet({
  // Content Security Policy - Restricts resource loading
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline scripts (needed for React)
        "'unsafe-eval'", // Allow eval (needed for some build tools)
        "https://cdnjs.cloudflare.com", // CDN for libraries
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline styles (needed for styled-components)
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
      ],
      imgSrc: [
        "'self'",
        "data:", // Allow data URIs for images
        "blob:", // Allow blob URLs
        "https:", // Allow HTTPS images
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
      ],
      connectSrc: [
        "'self'",
        "https://api.github.com", // GitHub API
        "https://generativelanguage.googleapis.com", // Google Gemini API
        process.env.CLIENT_ORIGIN || "http://localhost:5173",
      ],
      frameSrc: ["'none'"], // Prevent embedding in iframes
      objectSrc: ["'none'"], // Prevent object/embed/applet
      baseUri: ["'self'"], // Restrict base tag URLs
      formAction: ["'self'"], // Restrict form submissions
      upgradeInsecureRequests: [], // Upgrade HTTP to HTTPS (production only)
    },
  },

  // Cross-Origin-Embedder-Policy - Prevents loading cross-origin resources
  crossOriginEmbedderPolicy: false, // Set to true if needed

  // Cross-Origin-Opener-Policy - Isolates browsing context
  crossOriginOpenerPolicy: {policy: "same-origin-allow-popups"},

  // Cross-Origin-Resource-Policy - Controls resource sharing
  crossOriginResourcePolicy: {policy: "cross-origin"},

  // DNS Prefetch Control - Controls DNS prefetching
  dnsPrefetchControl: {allow: false},

  // Expect-CT - Certificate Transparency
  expectCt: {
    maxAge: 86400, // 24 hours
    enforce: true,
  },

  // Frameguard - Prevents clickjacking
  frameguard: {
    action: "deny", // Don't allow site to be framed
  },

  // Hide Powered-By - Removes X-Powered-By header
  hidePoweredBy: true,

  // HSTS - HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // IE No Open - Prevents IE from executing downloads
  ieNoOpen: true,

  // No Sniff - Prevents MIME sniffing
  noSniff: true,

  // Origin Agent Cluster - Isolates origins
  originAgentCluster: true,

  // Permitted Cross-Domain Policies - Restricts Adobe products
  permittedCrossDomainPolicies: {
    permittedPolicies: "none",
  },

  // Referrer Policy - Controls referrer information
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },

  // X-XSS-Protection - Enables browser XSS filter (legacy)
  xssFilter: true,
});

/**
 * Additional custom security headers
 * Applied after helmet for extra protection
 */
export const additionalSecurityHeaders = (req, res, next) => {
  // Permissions Policy - Controls browser features
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
  );

  // X-Content-Type-Options - Already set by helmet, but reinforcing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // X-Frame-Options - Already set by helmet, but reinforcing
  res.setHeader("X-Frame-Options", "DENY");

  // X-XSS-Protection - Already set by helmet, but reinforcing
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Cache-Control for sensitive data
  if (req.path.includes("/api/")) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }

  next();
};

/**
 * CORS Configuration
 *
 * Implements secure Cross-Origin Resource Sharing
 * - Restricts origins to whitelist from environment variables
 * - Controls allowed methods and headers
 * - Manages credentials and preflight requests
 */
export const corsOptions = {
  // Allowed origins - Configured via ALLOWED_ORIGINS environment variable
  origin: (origin, callback) => {
    // Get allowed origins from environment variable or fallback to defaults
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : [
          process.env.CLIENT_ORIGIN || "http://localhost:5173",
          "http://localhost:3000",
          "http://localhost:5173",
        ];

    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    // Check if origin matches any allowed origin (supports wildcards)
    const isAllowed = allowedOrigins.some((allowed) => {
      // Exact match
      if (allowed === origin) return true;

      // Wildcard support (e.g., https://*.example.com)
      if (allowed.includes("*")) {
        const regex = new RegExp("^" + allowed.replace(/\*/g, ".*") + "$");
        return regex.test(origin);
      }

      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Allowed HTTP methods
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  // Allowed headers
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],

  // Expose headers to client
  exposedHeaders: ["Content-Range", "X-Content-Range", "X-Total-Count"],

  // Preflight cache duration (24 hours)
  maxAge: 86400,

  // Pass the preflight response to the next handler
  preflightContinue: false,

  // Success status for preflight
  optionsSuccessStatus: 204,
};

/**
 * Strict CORS for production
 * Use this in production for tighter security
 */
export const strictCorsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

/**
 * Security headers for file uploads
 * Additional headers for endpoints that handle file uploads
 */
export const uploadSecurityHeaders = (req, res, next) => {
  // Prevent file execution
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Disposition", "attachment");

  // Prevent caching of uploaded files
  res.setHeader("Cache-Control", "no-store");

  next();
};

/**
 * Security logging middleware
 * Logs security-related events for monitoring
 */
export const securityLogger = (req, res, next) => {
  // Log suspicious activity
  if (req.headers["x-forwarded-for"]) {
    console.log(`📍 Request from IP: ${req.headers["x-forwarded-for"]}`);
  }

  // Log authentication attempts
  if (req.path.includes("/auth/")) {
    console.log(`🔐 Auth request: ${req.method} ${req.path}`);
  }

  // Log admin access
  if (req.path.includes("/admin/")) {
    console.log(`👤 Admin request: ${req.method} ${req.path}`);
  }

  next();
};

export default {
  securityHeaders,
  additionalSecurityHeaders,
  corsOptions,
  strictCorsOptions,
  uploadSecurityHeaders,
  securityLogger,
};
