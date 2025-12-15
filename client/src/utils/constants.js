/**
 * Environment Variable Validation and Application Configuration
 *
 * This module validates required environment variables and exports
 * centralized configuration objects for use throughout the application.
 *
 * @module utils/constants
 */

/**
 * Required environment variables that must be defined
 * Application will throw error if any are missing
 */
const requiredEnvVars = ["VITE_API_URL"];

/**
 * Validate that all required environment variables are defined
 * Throws an error with helpful message if any are missing
 */
requiredEnvVars.forEach((envVar) => {
  if (!import.meta.env[envVar]) {
    throw new Error(
      `❌ Missing required environment variable: ${envVar}\n` +
        `Please check your .env file and ensure all required variables are set.\n` +
        `Required variables: ${requiredEnvVars.join(", ")}`
    );
  }
});

/**
 * Application configuration from environment variables
 *
 * @type {Object}
 * @property {string} apiUrl - Backend API base URL
 * @property {string} serverUrl - Backend server URL (for OAuth)
 * @property {string} appName - Application name
 * @property {boolean} isDev - Is development environment
 * @property {boolean} isProd - Is production environment
 * @property {boolean} isTest - Is test environment
 */
export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  serverUrl:
    import.meta.env.VITE_SERVER_URL ||
    import.meta.env.VITE_API_URL.replace("/api", ""),
  appName: import.meta.env.VITE_APP_NAME || "ATS Resume Generator",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  isTest: import.meta.env.MODE === "test",
};

/**
 * Feature flags from environment variables
 * Use these to enable/disable features based on environment
 *
 * @type {Object}
 * @property {boolean} enableAnalytics - Enable analytics tracking
 * @property {boolean} enableDebug - Enable debug logging
 * @property {number} maxUploadSize - Maximum file upload size in bytes (default: 5MB)
 */
export const features = {
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  enableDebug: import.meta.env.VITE_ENABLE_DEBUG === "true",
  maxUploadSize: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE || "5242880"), // 5MB default
};

/**
 * API endpoints built from base URL
 * Centralized endpoint definitions for consistency
 *
 * @type {Object}
 */
export const endpoints = {
  // Base
  api: config.apiUrl,
  server: config.serverUrl,

  // Authentication
  auth: `${config.apiUrl}/auth`,
  authLogin: `${config.apiUrl}/auth/login`,
  authRegister: `${config.apiUrl}/auth/register`,
  authMe: `${config.apiUrl}/auth/me`,

  // Resume
  resume: `${config.apiUrl}/resume`,
  resumeUpload: `${config.apiUrl}/resume/upload`,
  resumeSave: `${config.apiUrl}/resume/save`,
  resumeList: `${config.apiUrl}/resume/list`,

  // ATS Analysis
  ats: `${config.apiUrl}/ats`,
  atsAnalyze: `${config.apiUrl}/ats/analyze-resume`,

  // ML/AI
  ml: `${config.apiUrl}/ml`,
  mlMatchScore: `${config.apiUrl}/ml/match-score`,
  mlSkillGap: `${config.apiUrl}/ml/skill-gap-analysis`,

  // Admin
  admin: `${config.apiUrl}/admin`,
  adminDashboard: `${config.apiUrl}/admin/dashboard`,
  adminUsers: `${config.apiUrl}/admin/users`,

  // Contact/Feedback
  contact: `${config.apiUrl}/contact`,
  feedback: `${config.apiUrl}/feedback`,
};

/**
 * Adzuna Job Search API Configuration
 * Optional - job search features will be disabled if not configured
 *
 * @type {Object}
 * @property {string|null} appId - Adzuna API App ID
 * @property {string|null} appKey - Adzuna API App Key
 * @property {boolean} isConfigured - Whether API credentials are configured
 */
export const adzunaConfig = {
  appId: import.meta.env.VITE_ADZUNA_APP_ID || null,
  appKey: import.meta.env.VITE_ADZUNA_APP_KEY || null,
  isConfigured: Boolean(
    import.meta.env.VITE_ADZUNA_APP_ID && import.meta.env.VITE_ADZUNA_APP_KEY
  ),
};

/**
 * Application limits and constraints
 * Centralized limit definitions
 *
 * @type {Object}
 */
export const limits = {
  // File uploads
  maxFileSize: features.maxUploadSize,
  maxFileSizeMB: Math.round(features.maxUploadSize / 1024 / 1024),

  // Resume content
  maxResumePages: 3,
  maxCharactersPerSection: 5000,

  // API rate limits (informational - enforced by backend)
  rateLimitRequests: 100,
  rateLimitWindow: "15 minutes",
};

/**
 * Log configuration on application startup (development only)
 */
if (config.isDev && features.enableDebug) {
  console.log("🔧 Application Configuration:");
  console.log("  API URL:", config.apiUrl);
  console.log("  Server URL:", config.serverUrl);
  console.log(
    "  Environment:",
    config.isDev ? "Development" : config.isProd ? "Production" : "Test"
  );
  console.log(
    "  Analytics:",
    features.enableAnalytics ? "Enabled" : "Disabled"
  );
  console.log("  Debug:", features.enableDebug ? "Enabled" : "Disabled");
  console.log(
    "  Adzuna Job Search:",
    adzunaConfig.isConfigured ? "Configured" : "Not Configured"
  );
}

/**
 * Export default configuration object
 */
export default {
  config,
  features,
  endpoints,
  adzunaConfig,
  limits,
};
