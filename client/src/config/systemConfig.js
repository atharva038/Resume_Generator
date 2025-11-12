// System Configuration - Update these values to automatically reflect in the flowchart

export const SYSTEM_CONFIG = {
  // Application Info
  app: {
    name: "SmartNShine - ATS Resume Builder",
    version: "1.0.0",
    description: "MERN + Gemini AI powered ATS-optimized resume builder with smart job matching",
    status: "Development Phase (Pre-Launch)",
    launchDate: "Q1 2026"
  },

  // Tech Stack
  techStack: {
    frontend: [
      { name: "React 18", color: "blue" },
      { name: "Vite 6.3.6", color: "blue" },
      { name: "Tailwind CSS", color: "blue" },
      { name: "React Router", color: "blue" },
      { name: "TipTap Editor", color: "blue" },
      { name: "Axios", color: "blue" },
      { name: "React Hot Toast", color: "blue" }
    ],
    backend: [
      { name: "Node.js", color: "green" },
      { name: "Express.js", color: "green" },
      { name: "JWT", color: "green" },
      { name: "Passport.js", color: "green" },
      { name: "Multer", color: "green" },
      { name: "Bcrypt", color: "green" },
      { name: "Helmet", color: "green" }
    ],
    database: [
      { name: "MongoDB", color: "purple" },
      { name: "Mongoose ODM", color: "purple" },
      { name: "6 Collections", color: "purple" },
      { name: "Indexed Queries", color: "purple" },
      { name: "Connection Pooling", color: "purple" }
    ],
    ai: [
      { name: "Google Gemini AI", color: "orange" },
      { name: "gemini-1.5-flash", color: "orange" },
      { name: "Content Enhancement", color: "orange" },
      { name: "Job Matching", color: "orange" },
      { name: "Quota Management", color: "orange" }
    ],
    external: [
      { name: "Adzuna Jobs API", color: "pink" },
      { name: "Google OAuth 2.0", color: "pink" },
      { name: "GitHub OAuth", color: "pink" },
      { name: "GitHub REST API", color: "pink" }
    ],
    security: [
      { name: "CORS Protection", color: "indigo" },
      { name: "Rate Limiting", color: "indigo" },
      { name: "Input Validation", color: "indigo" },
      { name: "XSS Prevention", color: "indigo" },
      { name: "CSRF Protection", color: "indigo" }
    ]
  },

  // Templates
  templates: {
    total: 9,
    atsScoreRange: "88-98",
    list: [
      "Classic", "Modern", "Minimal", "Professional", 
      "Professional V2", "Executive", "Tech", "Creative", "Academic"
    ]
  },

  // Security Layers
  security: {
    layers: [
      { layer: 1, name: "CORS", desc: "Allow only CLIENT_URL origin", color: "blue" },
      { layer: 2, name: "Helmet", desc: "Security headers protection", color: "green" },
      { layer: 3, name: "Rate Limiter", desc: "Prevent brute force & DDoS", color: "yellow" },
      { layer: 4, name: "Validation", desc: "Input sanitization & type checking", color: "orange" },
      { layer: 5, name: "Authentication", desc: "JWT token verification", color: "red" },
      { layer: 6, name: "Authorization", desc: "Role-based access control", color: "purple" },
      { layer: 7, name: "AI Quota", desc: "Usage limits enforcement", color: "pink" },
      { layer: 8, name: "File Upload", desc: "Type & size validation", color: "indigo" },
      { layer: 9, name: "Error Handler", desc: "Sanitized error responses", color: "gray" }
    ]
  },

  // Key Features
  features: [
    { icon: "🎨", title: "9 Professional Templates", description: "ATS-optimized designs with scores 88-98" },
    { icon: "🤖", title: "AI-Powered Enhancement", description: "Content improvement with Gemini AI" },
    { icon: "📄", title: "One-Page Constraint", description: "Real-time validation & overflow alerts" },
    { icon: "🎯", title: "ATS Score Analysis", description: "Real-time scoring & recommendations" },
    { icon: "💼", title: "Smart Job Matching", description: "AI-powered job compatibility analysis" },
    { icon: "🔒", title: "Enterprise Security", description: "9-layer security stack protection" }
  ],

  // Database Collections
  database: {
    collections: [
      { name: "Users", description: "User accounts and authentication" },
      { name: "Resumes", description: "Resume data and versions" },
      { name: "AIUsage", description: "AI request tracking and quotas" },
      { name: "ContactMessages", description: "User inquiries and support" },
      { name: "Feedback", description: "User feedback and ratings" },
      { name: "AdminLogs", description: "System activity logs" }
    ]
  },

  // Statistics (Update these as your platform grows)
  // CURRENT STATUS: Pre-launch (set to 0 - update when you have real users)
  stats: {
    totalUsers: 0,        // Update after launch
    totalResumes: 0,      // Update after launch
    aiRequests: 0,        // Update after launch
    activeToday: 0        // Update after launch
  }
};
