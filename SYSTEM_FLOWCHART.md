# Resume Generator - Complete System Flowchart & Architecture

## 🎯 System Overview

**Resume Generator** is a full-stack MERN application that helps users create ATS-friendly resumes with AI-powered enhancements, job matching, and template selection.

---

## 📊 High-Level Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Client    │ ◄─────► │   Server    │ ◄─────► │  Database   │
│  (React)    │  HTTP   │  (Node.js)  │  CRUD   │  (MongoDB)  │
└─────────────┘         └─────────────┘         └─────────────┘
       │                        │
       │                        │
       │                        ▼
       │                ┌──────────────┐
       │                │  Google AI   │
       │                │  (Gemini)    │
       │                └──────────────┘
       │                        │
       │                        ▼
       │                ┌──────────────┐
       │                │   Job APIs   │
       │                │   (Adzuna)   │
       │                └──────────────┘
       │
       ▼
┌──────────────┐
│ OAuth        │
│ (Google/     │
│  GitHub)     │
└──────────────┘
```

---

## 🔄 Complete User Flow Diagram

```
START
  │
  ├─► Landing Page (/)
  │      │
  │      ├─► Login (/login)
  │      │      │
  │      │      ├─► Email/Password Login
  │      │      │      │
  │      │      │      └─► POST /api/auth/login
  │      │      │             │
  │      │      │             ├─► Validate Credentials
  │      │      │             ├─► Generate JWT Token
  │      │      │             └─► Return User Data
  │      │      │
  │      │      └─► OAuth Login (Google/GitHub)
  │      │             │
  │      │             ├─► GET /api/auth/google
  │      │             │      │
  │      │             │      └─► Redirect to Google
  │      │             │             │
  │      │             │             └─► GET /api/auth/google/callback
  │      │             │                    │
  │      │             │                    ├─► Create/Find User
  │      │             │                    ├─► Generate JWT
  │      │             │                    └─► Redirect to /auth/callback
  │      │             │
  │      │             └─► GET /api/auth/github
  │      │                    │
  │      │                    └─► (Same flow as Google)
  │      │
  │      └─► Register (/register)
  │             │
  │             └─► POST /api/auth/register
  │                    │
  │                    ├─► Validate Input
  │                    ├─► Hash Password
  │                    ├─► Create User in DB
  │                    └─► Return Success
  │
  └─► Authenticated User Flow
         │
         ├─► Dashboard (/dashboard)
         │      │
         │      ├─► GET /api/resumes/list
         │      │      │
         │      │      └─► Display All User Resumes
         │      │             │
         │      │             ├─► View Resume
         │      │             ├─► Edit Resume → Editor
         │      │             ├─► Delete Resume
         │      │             └─► Download PDF
         │      │
         │      └─► Create New Resume
         │             │
         │             └─► Choose Method:
         │                    │
         │                    ├─► Upload Existing Resume
         │                    ├─► Import from GitHub
         │                    └─► Start from Scratch
         │
         ├─► Upload Resume (/upload)
         │      │
         │      └─► POST /api/resume/upload
         │             │
         │             ├─► Upload PDF/DOCX File
         │             ├─► Parse Resume (Multer)
         │             ├─► Extract Text Content
         │             ├─► AI Parse → Structured Data
         │             └─► Redirect to Editor
         │
         ├─► GitHub Import (/github-import)
         │      │
         │      └─► POST /api/github/import
         │             │
         │             ├─► Fetch GitHub Profile
         │             ├─► Fetch Repositories
         │             ├─► Extract Projects Data
         │             ├─► AI Process → Resume Format
         │             └─► Redirect to Editor
         │
         ├─► Templates (/templates)
         │      │
         │      ├─► View 9 Resume Templates
         │      │      ├─► Classic
         │      │      ├─► Modern
         │      │      ├─► Minimal
         │      │      ├─► Professional
         │      │      ├─► Professional V2
         │      │      ├─► Executive
         │      │      ├─► Tech Developer
         │      │      ├─► Creative Designer
         │      │      └─► Academic Research
         │      │
         │      └─► Select Template
         │             │
         │             └─► Save to localStorage
         │
         ├─► Editor (/editor) ◄─── CORE FEATURE
         │      │
         │      ├─► Load Resume Data
         │      │      │
         │      │      └─► GET /api/resumes/:id
         │      │
         │      ├─► Edit Sections:
         │      │      │
         │      │      ├─► Personal Information
         │      │      │      └─► Update name, email, phone, links
         │      │      │
         │      │      ├─► Professional Summary
         │      │      │      ├─► Manual Edit
         │      │      │      └─► POST /api/resume/enhance
         │      │      │             │
         │      │      │             └─► AI Enhancement (Gemini)
         │      │      │
         │      │      ├─► Skills
         │      │      │      ├─► Add Skills (comma-separated)
         │      │      │      └─► POST /api/resume/categorize-skills
         │      │      │             │
         │      │      │             └─► AI Auto-Categorize
         │      │      │
         │      │      ├─► Experience
         │      │      │      ├─► Add/Edit Entries
         │      │      │      │      ├─► Company
         │      │      │      │      ├─► Title
         │      │      │      │      ├─► Duration
         │      │      │      │      └─► Bullet Points
         │      │      │      │
         │      │      │      └─► POST /api/resume/enhance
         │      │      │             │
         │      │      │             └─► AI Enhance Bullets
         │      │      │
         │      │      ├─► Projects
         │      │      │      └─► (Same as Experience)
         │      │      │
         │      │      ├─► Education
         │      │      │      └─► Add Degrees, Schools, GPAs
         │      │      │
         │      │      ├─► Certifications
         │      │      │      └─► Add Cert Name, Issuer, Date
         │      │      │
         │      │      ├─► Achievements
         │      │      │      └─► POST /api/resume/segregate-achievements
         │      │      │             │
         │      │      │             └─► AI Organize Achievements
         │      │      │
         │      │      └─► Custom Sections
         │      │             │
         │      │             └─► POST /api/resume/process-custom-section
         │      │                    │
         │      │                    └─► AI Process Custom Content
         │      │
         │      ├─► Real-time Preview
         │      │      │
         │      │      ├─► Live Template Rendering
         │      │      ├─► One-Page Validation
         │      │      │      │
         │      │      │      ├─► Character Counter
         │      │      │      └─► Overflow Warning
         │      │      │
         │      │      └─► Download PDF
         │      │             │
         │      │             └─► Browser Print API
         │      │
         │      ├─► ATS Score Analysis
         │      │      │
         │      │      ├─► Real-time Score Calculation
         │      │      ├─► Keyword Analysis
         │      │      ├─► Format Validation
         │      │      └─► Recommendations Panel
         │      │
         │      ├─► Section Reordering
         │      │      │
         │      │      └─► Drag & Drop Interface
         │      │
         │      ├─► Auto-Save
         │      │      │
         │      │      └─► PUT /api/resumes/:id
         │      │             │
         │      │             └─► Update every 30 seconds
         │      │
         │      └─► Manual Save
         │             │
         │             └─► POST /api/resume/save
         │
         ├─► ATS Analyzer (/ats-analyzer)
         │      │
         │      └─► POST /api/ats/analyze
         │             │
         │             ├─► Upload Job Description
         │             ├─► AI Compare Resume vs JD
         │             ├─► Calculate Match Score
         │             ├─► Identify Missing Keywords
         │             └─► Provide Recommendations
         │
         ├─► Job Search (/job-search)
         │      │
         │      └─► POST /api/jobs/search
         │             │
         │             ├─► Search Parameters:
         │             │      ├─► Keywords
         │             │      ├─► Location
         │             │      ├─► Category
         │             │      └─► Filters
         │             │
         │             ├─► Call Adzuna API
         │             ├─► Return Job Listings
         │             └─► Display Results with Pagination
         │
         ├─► Smart Job Match (/smart-match)
         │      │
         │      └─► POST /api/jobs/smart-match
         │             │
         │             ├─► Analyze User Resume
         │             ├─► Fetch Relevant Jobs
         │             ├─► AI Calculate Match %
         │             ├─► Rank by Compatibility
         │             └─► Display Matched Jobs
         │
         ├─► Contact (/contact)
         │      │
         │      └─► POST /api/contact/send
         │             │
         │             ├─► Validate Message
         │             ├─► Save to Database
         │             └─► Send Notification
         │
         └─► Feedback (/feedback)
                │
                └─► POST /api/feedback/submit
                       │
                       ├─► Collect User Feedback
                       ├─► Save to Database
                       └─► Thank You Message
```

---

## 👑 Admin Flow

```
Admin Login
  │
  └─► Admin Dashboard (/admin/dashboard)
         │
         ├─► GET /api/admin/dashboard/stats
         │      │
         │      └─► Display:
         │             ├─► Total Users
         │             ├─► Total Resumes
         │             ├─► AI Usage Stats
         │             └─► System Health
         │
         ├─► User Management (/admin/users)
         │      │
         │      └─► GET /api/admin/users
         │             │
         │             ├─► View All Users
         │             ├─► PATCH /api/admin/users/:userId/status
         │             │      └─► Activate/Deactivate
         │             ├─► PATCH /api/admin/users/:userId/role
         │             │      └─► Change Role (user/admin)
         │             └─► DELETE /api/admin/users/:userId
         │                    └─► Delete User
         │
         ├─► AI Analytics (/admin/ai-analytics)
         │      │
         │      └─► GET /api/admin/ai-analytics
         │             │
         │             └─► View:
         │                    ├─► AI Requests by User
         │                    ├─► Quota Usage
         │                    ├─► API Costs
         │                    └─► Usage Trends
         │
         ├─► AI Quota Management (/admin/ai-quota)
         │      │
         │      └─► Manage User AI Limits:
         │             │
         │             ├─► GET /api/admin/ai-quota/users
         │             ├─► PATCH /api/admin/ai-quota/update-tier
         │             └─► POST /api/admin/ai-quota/reset-daily
         │
         ├─► Contact Messages (/admin/contacts)
         │      │
         │      └─► GET /api/admin/contacts
         │             │
         │             ├─► View All Messages
         │             ├─► PATCH /api/admin/contacts/:id/status
         │             │      └─► Mark as Read/Resolved
         │             └─► DELETE /api/admin/contacts/:id
         │
         ├─► Feedback Management (/admin/feedback)
         │      │
         │      └─► GET /api/admin/feedback
         │             │
         │             ├─► View All Feedback
         │             ├─► PATCH /api/admin/feedback/:id/status
         │             └─► GET /api/admin/feedback/statistics
         │
         ├─► Template Management (/admin/templates)
         │      │
         │      └─► GET /api/admin/templates
         │             │
         │             ├─► View All Templates
         │             ├─► PATCH /api/admin/templates/:id/status
         │             │      └─► Enable/Disable
         │             └─► DELETE /api/admin/templates/:id
         │
         ├─► Admin Logs (/admin/logs)
         │      │
         │      └─► GET /api/admin/logs
         │             │
         │             └─► View System Activity Logs
         │
         └─► Settings (/admin/settings)
                │
                └─► Manage:
                       ├─► GET /api/admin/settings
                       ├─► PUT /api/admin/settings
                       ├─► POST /api/admin/settings/reset
                       ├─► PATCH /api/admin/settings/ai-quota
                       ├─► PATCH /api/admin/settings/features
                       └─► PATCH /api/admin/settings/rate-limits
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Authentication Flow                     │
└─────────────────────────────────────────────────────────┘

1. User Registration
   ┌──────────┐
   │ Client   │──► POST /api/auth/register
   └──────────┘         │
                        ├─► Validate Email/Password
                        ├─► Check if User Exists
                        ├─► Hash Password (bcrypt)
                        ├─► Create User in MongoDB
                        └─► Return Success

2. User Login
   ┌──────────┐
   │ Client   │──► POST /api/auth/login
   └──────────┘         │
                        ├─► Find User by Email
                        ├─► Compare Password (bcrypt)
                        ├─► Generate JWT Token
                        │      ├─► payload: {userId, email, role}
                        │      └─► expiresIn: 7 days
                        └─► Return {token, user}

3. OAuth Flow (Google/GitHub)
   ┌──────────┐
   │ Client   │──► GET /api/auth/google
   └──────────┘         │
                        └─► Redirect to Google OAuth
                               │
                               └─► User Grants Permission
                                      │
                                      └─► GET /api/auth/google/callback
                                             │
                                             ├─► Passport Strategy
                                             ├─► Find or Create User
                                             ├─► Generate JWT
                                             └─► Redirect to Client with Token

4. Protected Route Access
   ┌──────────┐
   │ Client   │──► GET /api/resumes/list
   │ Headers: │      Authorization: Bearer <token>
   └──────────┘         │
                        └─► authenticateToken Middleware
                               │
                               ├─► Verify JWT Token
                               ├─► Extract User ID
                               ├─► Attach req.user
                               └─► Next() or 401 Unauthorized

5. Admin Route Access
   ┌──────────┐
   │ Client   │──► GET /api/admin/users
   │ Headers: │      Authorization: Bearer <token>
   └──────────┘         │
                        ├─► authenticateToken Middleware
                        │      └─► Verify Token
                        │
                        └─► isAdmin Middleware
                               │
                               ├─► Check req.user.role === 'admin'
                               └─► Next() or 403 Forbidden
```

---

## 🤖 AI Integration Flow

```
┌─────────────────────────────────────────────────────────┐
│              AI Enhancement Pipeline                     │
└─────────────────────────────────────────────────────────┘

User Action (Enhance Button)
  │
  └─► POST /api/resume/enhance
         │
         ├─► Rate Limiter Middleware
         │      └─► Max 50 requests/15min
         │
         ├─► AI Quota Check Middleware
         │      │
         │      ├─► Check Daily Limit
         │      ├─► Check Monthly Limit
         │      └─► 403 if Exceeded
         │
         ├─► Resume Controller
         │      │
         │      ├─► Prepare Prompt:
         │      │      ├─► Section Type (summary/experience/etc)
         │      │      ├─► Current Content
         │      │      ├─► Resume Context
         │      │      └─► Target Job Role (if provided)
         │      │
         │      └─► Call AI Service
         │
         ├─► AI Service (Gemini)
         │      │
         │      ├─► Format Prompt
         │      ├─► Call Google Generative AI
         │      │      └─► Model: gemini-1.5-flash
         │      │
         │      ├─► Parse Response
         │      └─► Return Enhanced Content
         │
         ├─► Track AI Usage
         │      │
         │      ├─► Update User AI Counter
         │      ├─► Log to AIUsage Collection
         │      └─► Update Quota Status
         │
         └─► Return Enhanced Content to Client

AI Features:
  ├─► Content Enhancement
  │      └─► Improve clarity, ATS keywords, impact
  │
  ├─► Skills Categorization
  │      └─► Group skills into logical categories
  │
  ├─► Achievement Segregation
  │      └─► Extract and format achievements
  │
  ├─► Summary Generation
  │      └─► Create professional summary
  │
  └─► Job Matching
         └─► Calculate resume-job compatibility
```

---

## 📄 One-Page Resume System

```
┌─────────────────────────────────────────────────────────┐
│          One-Page Resume Validation System               │
└─────────────────────────────────────────────────────────┘

Editor Page Rendering
  │
  ├─► Resume Preview Component
  │      │
  │      ├─► A4 Page Dimensions (210mm × 297mm)
  │      ├─► Max Height: 297mm (strict)
  │      └─► Overflow: hidden
  │
  ├─► Page Limit Warning Component
  │      │
  │      ├─► Monitor Resume Height (500ms interval)
  │      ├─► Compare: currentHeight vs maxHeight
  │      │
  │      └─► If Overflow Detected:
  │             │
  │             ├─► Display Floating Warning
  │             │      └─► "Resume exceeds one page by XXXpx"
  │             │
  │             └─► Toast Notification
  │
  ├─► Character Counter Components
  │      │
  │      └─► For Each Section:
  │             │
  │             ├─► Count Characters
  │             ├─► Display: Current/Limit
  │             └─► Color Code:
  │                    ├─► Green (< 80%)
  │                    ├─► Yellow (80-100%)
  │                    └─► Red (> 100%)
  │
  └─► Character Limits:
         │
         ├─► Summary: 600 chars
         ├─► Experience: 400 chars/entry (max 3)
         ├─► Projects: 300 chars/entry (max 3)
         ├─► Education: 200 chars/entry (max 2)
         ├─► Skills: 6 categories
         ├─► Certifications: 4 items
         └─► Achievements: 6 items

Template Optimizations:
  │
  ├─► Font Size: 9.5pt (compact)
  ├─► Line Height: 1.25 (tight)
  ├─► Section Spacing: 8px
  ├─► Margins: 0.4in top/bottom, 0.5in sides
  └─► Result: ~30% more content fits
```

---

## 🔒 Security & Middleware Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Security Stack                          │
└─────────────────────────────────────────────────────────┘

Request Flow Through Middleware:
  │
  ├─► 1. CORS Middleware
  │      └─► Allow only CLIENT_URL origin
  │
  ├─► 2. Helmet Middleware
  │      └─► Set security headers
  │
  ├─► 3. Rate Limiter Middleware
  │      │
  │      ├─► General: 100 req/15min
  │      ├─► Auth: 5 req/15min
  │      ├─► AI: 50 req/15min
  │      ├─► Upload: 10 req/15min
  │      └─► Admin: 200 req/15min
  │
  ├─► 4. Validation Middleware
  │      │
  │      ├─► Validate Request Body
  │      ├─► Sanitize Input
  │      └─► Check Data Types
  │
  ├─► 5. Authentication Middleware
  │      │
  │      ├─► Extract JWT from Headers
  │      ├─► Verify Token
  │      ├─► Decode Payload
  │      └─► Attach req.user
  │
  ├─► 6. Authorization Middleware
  │      │
  │      └─► Check User Role
  │             ├─► Admin Routes: role === 'admin'
  │             └─► User Routes: Authenticated
  │
  ├─► 7. AI Quota Middleware
  │      │
  │      ├─► Check Daily Limit
  │      ├─► Check Monthly Limit
  │      └─► 403 if Exceeded
  │
  ├─► 8. File Upload Middleware (Multer)
  │      │
  │      ├─► Validate File Type (PDF/DOCX)
  │      ├─► Validate File Size (< 5MB)
  │      └─► Save to /uploads
  │
  └─► 9. Error Handler Middleware
         │
         ├─► Catch All Errors
         ├─► Log Error Details
         ├─► Send Sanitized Response
         └─► Don't Expose Stack Trace
```

---

## 💾 Database Schema

```
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Collections                     │
└─────────────────────────────────────────────────────────┘

1. Users Collection
   {
     _id: ObjectId,
     name: String,
     email: String (unique, indexed),
     password: String (hashed),
     role: Enum ['user', 'admin'],
     provider: Enum ['local', 'google', 'github'],
     providerId: String,
     avatar: String,
     isActive: Boolean,
     aiUsage: {
       dailyCount: Number,
       monthlyCount: Number,
       lastResetDate: Date,
       tier: Enum ['free', 'pro', 'enterprise']
     },
     createdAt: Date,
     updatedAt: Date
   }

2. Resumes Collection
   {
     _id: ObjectId,
     userId: ObjectId (ref: User),
     title: String,
     template: String,
     name: String,
     contact: {
       email: String,
       phone: String,
       location: String,
       linkedin: String,
       github: String,
       portfolio: String
     },
     summary: String,
     skills: [{
       category: String,
       items: [String]
     }],
     experience: [{
       company: String,
       title: String,
       location: String,
       startDate: String,
       endDate: String,
       current: Boolean,
       bullets: [String]
     }],
     education: [{
       institution: String,
       degree: String,
       field: String,
       location: String,
       startDate: String,
       endDate: String,
       gpa: String
     }],
     projects: [{
       name: String,
       description: String,
       technologies: [String],
       link: String,
       bullets: [String]
     }],
     certifications: [{
       name: String,
       issuer: String,
       date: String,
       link: String
     }],
     achievements: [String],
     customSections: [{
       title: String,
       items: [String]
     }],
     sectionOrder: [String],
     atsScore: {
       overall: Number,
       keywords: Number,
       format: Number,
       recommendations: [String]
     },
     createdAt: Date,
     updatedAt: Date
   }

3. AIUsage Collection
   {
     _id: ObjectId,
     userId: ObjectId (ref: User),
     action: String,
     sectionType: String,
     tokensUsed: Number,
     cost: Number,
     success: Boolean,
     timestamp: Date
   }

4. ContactMessages Collection
   {
     _id: ObjectId,
     userId: ObjectId (ref: User),
     name: String,
     email: String,
     subject: String,
     message: String,
     status: Enum ['new', 'read', 'resolved'],
     createdAt: Date,
     updatedAt: Date
   }

5. Feedback Collection
   {
     _id: ObjectId,
     userId: ObjectId (ref: User),
     rating: Number (1-5),
     category: String,
     message: String,
     status: Enum ['pending', 'reviewed', 'implemented'],
     createdAt: Date,
     updatedAt: Date
   }

6. AdminLogs Collection
   {
     _id: ObjectId,
     adminId: ObjectId (ref: User),
     action: String,
     targetType: String,
     targetId: ObjectId,
     details: Object,
     ipAddress: String,
     timestamp: Date
   }
```

---

## 🎨 Frontend Component Architecture

```
App.jsx (Root)
  │
  ├─► DarkModeProvider (Context)
  ├─► NavigationBlockerProvider (Context)
  ├─► AuthProvider (Context)
  │
  └─► React Router
         │
         ├─► Layout Component
         │      │
         │      ├─► Header
         │      │      ├─► Logo
         │      │      ├─► Navigation Menu
         │      │      └─► User Profile Dropdown
         │      │
         │      ├─► Main Content (Outlet)
         │      │
         │      └─► Footer
         │
         ├─► Public Routes
         │      ├─► Home
         │      ├─► Login
         │      ├─► Register
         │      ├─► Forgot Password
         │      └─► Reset Password
         │
         ├─► Protected Routes (User)
         │      │
         │      ├─► Dashboard
         │      │      └─► Resume Cards Grid
         │      │
         │      ├─► Upload
         │      │      └─► File Upload Component
         │      │
         │      ├─► Editor ⭐ CORE
         │      │      │
         │      │      ├─► Left Panel (60%)
         │      │      │      ├─► Personal Info Section
         │      │      │      ├─► Summary Section
         │      │      │      ├─► Skills Section
         │      │      │      ├─► Experience Section
         │      │      │      ├─► Education Section
         │      │      │      ├─► Projects Section
         │      │      │      ├─► Certifications Section
         │      │      │      ├─► Achievements Section
         │      │      │      └─► Custom Sections
         │      │      │
         │      │      └─► Right Panel (40%)
         │      │             ├─► Resume Preview
         │      │             │      └─► Template Renderer
         │      │             ├─► ATS Score Card
         │      │             ├─► Job-Specific Score
         │      │             ├─► Recommendations Panel
         │      │             └─► Page Limit Warning
         │      │
         │      ├─► Templates
         │      │      └─► Template Gallery
         │      │
         │      ├─► GitHub Import
         │      │      └─► GitHub Profile Viewer
         │      │
         │      ├─► ATS Analyzer
         │      │      └─► Job Description Input
         │      │
         │      ├─► Job Search
         │      │      └─► Job Listings Grid
         │      │
         │      ├─► Smart Job Match
         │      │      └─► Matched Jobs List
         │      │
         │      ├─► Contact
         │      │      └─► Contact Form
         │      │
         │      └─► Feedback
         │             └─► Feedback Form
         │
         └─► Admin Routes
                │
                ├─► AdminLayout Component
                │      │
                │      ├─► Admin Sidebar
                │      └─► Admin Content (Outlet)
                │
                ├─► Admin Dashboard
                ├─► User Management
                ├─► Template Management
                ├─► AI Analytics
                ├─► AI Quota Management
                ├─► Contact Messages
                ├─► Feedback Management
                ├─► Admin Logs
                └─► Settings
```

---

## 🚀 API Endpoints Summary

### Authentication Routes (`/api/auth`)
```
POST   /register              - Register new user
POST   /login                 - Login with credentials
GET    /me                    - Get current user
POST   /forgot-password       - Request password reset
POST   /reset-password        - Reset password with token
GET    /google                - Initiate Google OAuth
GET    /google/callback       - Google OAuth callback
GET    /github                - Initiate GitHub OAuth
GET    /github/callback       - GitHub OAuth callback
```

### Resume Routes (`/api/resume`)
```
POST   /upload                - Upload resume file
POST   /save                  - Save resume
PUT    /:id                   - Update resume
GET    /list                  - Get all user resumes
GET    /:id                   - Get resume by ID
DELETE /:id                   - Delete resume
POST   /enhance               - AI enhance content
POST   /generate-summary      - AI generate summary
POST   /categorize-skills     - AI categorize skills
POST   /segregate-achievements - AI segregate achievements
POST   /process-custom-section - AI process custom section
```

### ATS Routes (`/api/ats`)
```
POST   /analyze               - Analyze resume vs job description
```

### Job Routes (`/api/jobs`)
```
POST   /search                - Search jobs by criteria
POST   /smart-match           - AI match resume to jobs
```

### GitHub Routes (`/api/github`)
```
POST   /import                - Import GitHub profile data
```

### Contact Routes (`/api/contact`)
```
POST   /send                  - Send contact message
```

### Feedback Routes (`/api/feedback`)
```
POST   /submit                - Submit feedback
```

### Admin Routes (`/api/admin`)
```
Dashboard:
  GET    /dashboard/stats     - Dashboard statistics

Users:
  GET    /users               - Get all users
  GET    /users/:userId       - Get user details
  PATCH  /users/:userId/status - Update user status
  PATCH  /users/:userId/role  - Update user role
  DELETE /users/:userId       - Delete user

AI Analytics:
  GET    /ai-analytics        - AI usage analytics

Contacts:
  GET    /contacts            - Get contact messages
  GET    /contacts/statistics - Contact statistics
  PATCH  /contacts/:id/status - Update message status
  DELETE /contacts/:id        - Delete message

Logs:
  GET    /logs                - Get admin logs

Templates:
  GET    /templates           - Get all templates
  PATCH  /templates/:id/status - Update template status
  DELETE /templates/:id       - Delete template

Feedback:
  GET    /feedback            - Get all feedback
  GET    /feedback/statistics - Feedback statistics
  PATCH  /feedback/:id/status - Update feedback status
  DELETE /feedback/:id        - Delete feedback

AI Quota:
  GET    /ai-quota/users      - Get user quota status
  PATCH  /ai-quota/update-tier - Update user tier
  POST   /ai-quota/reset-daily - Reset daily quota

Settings:
  GET    /settings            - Get system settings
  PUT    /settings            - Update settings
  POST   /settings/reset      - Reset to defaults
  PATCH  /settings/ai-quota   - Update AI limits
  PATCH  /settings/features   - Toggle features
  PATCH  /settings/rate-limits - Update rate limits
```

---

## 📋 Key Features Summary

### 1. Resume Creation & Editing
- Upload existing resume (PDF/DOCX)
- Import from GitHub profile
- Manual creation from scratch
- Real-time preview with 9 templates
- Drag-and-drop section reordering
- Auto-save every 30 seconds

### 2. AI-Powered Enhancements
- Content enhancement (Gemini AI)
- Automatic skills categorization
- Achievement extraction
- Professional summary generation
- Custom section processing
- Smart job matching

### 3. ATS Optimization
- Real-time ATS score calculation
- Keyword analysis
- Format validation
- Improvement recommendations
- Job-specific scoring

### 4. One-Page Constraint System
- A4 page size enforcement (210mm × 297mm)
- Character counters per section
- Overflow warnings
- Optimized template spacing
- Visual feedback system

### 5. Job Search Integration
- Job search via Adzuna API
- Location-based filtering
- Category filtering
- Pagination support
- India-specific job search

### 6. Admin Dashboard
- User management
- AI usage analytics
- Quota management
- Contact message handling
- Feedback management
- System monitoring
- Activity logs

### 7. Security Features
- JWT authentication
- OAuth (Google/GitHub)
- Rate limiting
- Input validation
- Password hashing (bcrypt)
- Role-based access control
- CORS protection
- Security headers (Helmet)

---

## 🎯 Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Axios** - HTTP client
- **TipTap** - Rich text editor
- **React-to-Print** - PDF generation
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - OAuth
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

### External Services
- **Google Gemini AI** - Content enhancement
- **Adzuna API** - Job search
- **Google OAuth** - Social login
- **GitHub OAuth** - Social login

---

## 🔄 Data Flow Example: Creating a Resume

```
User Journey: Upload Resume → Edit → Download PDF

Step 1: Upload Resume
   User ──► /upload page
            │
            └──► Select PDF/DOCX file
                 │
                 └──► POST /api/resume/upload
                        │
                        ├──► Multer saves to /uploads
                        ├──► Parse file content
                        ├──► AI extracts structured data
                        ├──► Save to MongoDB
                        └──► Return resume ID

Step 2: Redirect to Editor
   Server ──► Redirect to /editor?id=<resumeId>
              │
              └──► GET /api/resumes/:id
                     │
                     └──► Return resume data

Step 3: Edit Resume
   User ──► Edit sections in left panel
            │
            ├──► Click "Enhance" button
            │      │
            │      └──► POST /api/resume/enhance
            │             │
            │             ├──► Check AI quota
            │             ├──► Call Gemini AI
            │             ├──► Track usage
            │             └──► Return enhanced content
            │
            ├──► Edit manually
            │      │
            │      └──► Auto-save triggers
            │             │
            │             └──► PUT /api/resumes/:id
            │                    └──► Update in MongoDB
            │
            └──► Real-time preview updates
                   │
                   └──► Template re-renders
                        │
                        ├──► Page validation
                        └──► ATS score update

Step 4: Download PDF
   User ──► Click "Download PDF"
            │
            └──► Browser Print API
                 │
                 ├──► Render template at full size
                 ├──► Apply print styles
                 ├──► Remove headers/footers
                 └──► Save as PDF
```

---

## 📊 Performance Optimizations

1. **Frontend**
   - Code splitting with React.lazy()
   - Debounced auto-save
   - Optimized re-renders with React.memo
   - Local storage for template selection
   - Lazy loading of templates

2. **Backend**
   - Database indexing on userId, email
   - Connection pooling
   - Rate limiting to prevent abuse
   - Caching for frequently accessed data
   - Efficient MongoDB queries

3. **AI Integration**
   - Quota management to control costs
   - Request batching where possible
   - Error handling and retries
   - Usage tracking and analytics

---

## 🎓 For Your Mentor Presentation

### Project Highlights:

1. **Full-Stack MERN Application**
   - Complete user authentication with OAuth
   - RESTful API architecture
   - Responsive React frontend
   - MongoDB database with proper schema design

2. **AI Integration**
   - Google Gemini AI for content enhancement
   - Smart quota management system
   - Cost tracking and analytics

3. **Unique Features**
   - One-page resume constraint system
   - Real-time ATS score calculation
   - AI-powered job matching
   - Multiple template support

4. **Production-Ready**
   - Comprehensive security measures
   - Rate limiting and validation
   - Error handling
   - Admin dashboard for management

5. **Best Practices**
   - Clean code architecture
   - Component reusability
   - Middleware pattern
   - Environment configuration

---

**End of Flowchart Documentation**
