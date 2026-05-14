# Chapter 3: System Design

---

## 3.1 Overview

System design is the process of defining the architecture, components, interfaces, and data flows of a system to satisfy specified requirements. For SmartNShine, the design must satisfy a diverse set of simultaneous requirements: real-time AI-powered text processing, multi-format document ingestion, voice-based interaction, secure multi-user data isolation, payment integration, and ATS-compliant PDF generation — all within a responsive web application.

This chapter presents the complete system design across multiple levels of abstraction: high-level architecture, component-wise design, data flow diagrams, and database schema design. Where relevant, specific design decisions and their rationale are explained.

---

## 3.2 High-Level Architecture

### 3.2.1 Architectural Style

SmartNShine is designed as a **three-tier web application** with an additional **microservice layer** for AI voice processing:

- **Tier 1 — Presentation Layer**: React 18 + Vite frontend, served via Vercel
- **Tier 2 — Application Layer**: Node.js + Express 4 REST API backend, deployed on Render
- **Tier 3 — Data Layer**: MongoDB Atlas cloud database
- **Microservice Layer**: Two independent Python Flask servers for voice AI (Whisper STT, Chatterbox TTS)
- **External Services**: Google Gemini API, OpenAI API, Razorpay, nodemailer (SMTP)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                        │
│         React 18 + Vite + TailwindCSS + Framer Motion           │
│               Served via Vercel (CDN)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTPS / REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER (Node.js)                     │
│           Express 4 REST API — port 5000 (Render)               │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  Auth    │ │  Resume  │ │  ATS     │ │    Interview     │   │
│  │ Routes   │ │  Routes  │ │  Routes  │ │    Routes        │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  Voice   │ │  Payment │ │  Admin   │ │  Feedback /      │   │
│  │  Routes  │ │  Routes  │ │  Routes  │ │  Contact         │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│                                                                  │
│     Service Layer: Gemini | OpenAI | Interview | Payment        │
│     Middleware: JWT Auth | Rate Limiter | Security | XSS        │
└───┬───────────────────────────────────┬─────────────────────────┘
    │                                   │
    │ HTTP Proxy                        │ Mongoose ODM
    ▼                                   ▼
┌──────────────────────┐     ┌──────────────────────────────────┐
│  VOICE MICROSERVICES │     │         DATA LAYER               │
│                      │     │      MongoDB Atlas (Cloud)        │
│  Whisper STT :5001   │     │                                  │
│  (Python + Flask)    │     │  Collections:                    │
│                      │     │  • users        • resumes        │
│  Chatterbox TTS:5002 │     │  • interviews   • results        │
│  (Python + Flask)    │     │  • subscriptions• aiusage        │
└──────────────────────┘     └──────────────────────────────────┘
    │                │
    ▼                ▼
┌──────────┐  ┌──────────────┐
│  Whisper │  │  Chatterbox  │
│  Model   │  │  TTS Model   │
│ (Local)  │  │  (Local)     │
└──────────┘  └──────────────┘

External API Calls (from Application Layer):
  ├── Google Gemini API  (resume parsing, enhancement, ATS scoring)
  ├── OpenAI GPT-4o API  (interview questions, evaluation, reports)
  └── Razorpay API       (payment orders, signature verification)
```

### 3.2.2 Communication Protocols

| Connection | Protocol | Format |
|---|---|---|
| Browser ↔ Node.js Backend | HTTPS + REST | JSON |
| Node.js ↔ MongoDB Atlas | MongoDB Wire Protocol (TCP) | BSON |
| Node.js ↔ Whisper microservice | HTTP (internal) | multipart/form-data |
| Node.js ↔ Chatterbox microservice | HTTP (internal) | JSON / audio stream |
| Node.js ↔ Gemini API | HTTPS | JSON |
| Node.js ↔ OpenAI API | HTTPS | JSON |
| Node.js ↔ Razorpay API | HTTPS | JSON |
| Browser ↔ Razorpay Checkout | HTTPS | Razorpay SDK |

---

## 3.3 Flowchart: Core User Workflows

### 3.3.1 Resume Upload and AI Enhancement Workflow

```
START
  │
  ▼
User visits /upload page
  │
  ▼
User drags/drops PDF or DOCX file
  │
  ▼
Client validates file type (PDF/DOCX) and size (≤ 5MB)
  │
  ├─[INVALID]─► Show "Invalid file type" or "File too large" error
  │
  ▼
Frontend sends multipart/form-data POST to /api/resume/upload
  │
  ▼
Multer middleware saves file to /uploads/ temp directory
  │
  ▼
fileExtractor.js runs:
  ├─[PDF]─► pdf-parse extracts raw text
  └─[DOCX]─► mammoth extracts raw text
  │
  ▼
Raw text passed to Gemini (parseResumeWithAI)
  │
  ▼
Gemini returns structured JSON
  │
  ├─[PARSE FAILURE]─► Retry with exponential backoff (max 3 attempts)
  │                     └─[ALL FAIL]─► Return 500 error to client
  ▼
Temp file deleted from /uploads/
  │
  ▼
Structured resume JSON returned to client (200 OK)
  │
  ▼
Client stores resume data in React state → redirects to /editor
  │
  ▼
User edits resume in TipTap editor
  │
  ▼
User clicks "Enhance" on a section
  │
  ▼
POST /api/resume/enhance (content + sectionType + resumeData)
  │
  ▼
Gemini enhanceContentWithAI() → enhanced bullets returned
  │
  ▼
Client updates resume state with enhanced content
  │
  ▼
User reviews and optionally saves (requires auth)
  │
  ├─[LOGGED IN]─► POST /api/resume/save → saved to MongoDB
  └─[GUEST]─────► Direct PDF download via react-to-print
  │
  ▼
END
```

### 3.3.2 AI Interview Workflow

```
START
  │
  ▼
User navigates to /ai-interview
  │
  ▼
User configures interview:
  (Type | Role | Level | Question Count | Resume Upload | Mode)
  │
  ▼
POST /api/interview/session — creates InterviewSession in MongoDB
  │
  ▼
Interview begins — Question loop:
  │
  ┌────────────────────────────────────────────────────────┐
  │  Loop: while (questionNumber ≤ totalQuestions)          │
  │    │                                                    │
  │    ▼                                                    │
  │  POST /api/interview/question                           │
  │    │                                                    │
  │    ▼                                                    │
  │  GPT-4o generates question JSON                        │
  │    │                                                    │
  │    ▼                                                    │
  │  [Voice Mode?]                                          │
  │    ├─[YES]─► POST /api/voice/tts → Chatterbox reads    │
  │    │           question aloud                           │
  │    └─[NO]──► Display question as text                  │
  │    │                                                    │
  │    ▼                                                    │
  │  User answers (text or voice):                          │
  │    [Voice Mode] → Record audio → POST /api/voice/      │
  │    transcribe → Whisper transcribes → text answer      │
  │    [Text Mode]  → User types answer                    │
  │    │                                                    │
  │    ▼                                                    │
  │  POST /api/interview/evaluate                           │
  │    │                                                    │
  │    ▼                                                    │
  │  GPT-4o returns evaluation JSON                        │
  │    (score + 5 dimension scores + feedback)             │
  │    │                                                    │
  │    ▼                                                    │
  │  [shouldAskFollowUp && followUpBudget > 0?]            │
  │    ├─[YES]─► POST /api/interview/followup              │
  │    └─[NO]──► Proceed to next question                  │
  └────────────────────────────────────────────────────────┘
  │
  ▼
All questions completed
  │
  ▼
POST /api/interview/report → GPT-4o generates final report
  │
  ▼
InterviewResult saved to MongoDB
  │
  ▼
User views results at /ai-interview/results/:sessionId
  │
  ▼
END
```

### 3.3.3 Authentication and Authorization Workflow

```
START
  │
  ├─[Standard Login]──────────────────────────────────────────┐
  │   POST /api/auth/login                                     │
  │   → Validate email/password                                │
  │   → bcryptjs.compare(inputPassword, hashedPassword)        │
  │   → Generate JWT (7-day expiry)                            │
  │   → Return token + user object                             │
  │                                                            │
  ├─[Google OAuth]────────────────────────────────────────────┤
  │   GET /api/auth/google                                     │
  │   → Passport GoogleStrategy                                │
  │   → Google Auth Consent Screen                             │
  │   → Callback: /api/auth/google/callback                    │
  │   → Upsert User in DB → Generate JWT → Redirect to client │
  │                                                            │
  └─[GitHub OAuth]────────────────────────────────────────────┘
      GET /api/auth/github
      → Passport GitHubStrategy
      → Callback: /api/auth/github/callback
      → Upsert User in DB → Generate JWT → Redirect to client
  │
  ▼
Client stores JWT in localStorage
  │
  ▼
All protected API calls:
  Authorization: Bearer <token>
  │
  ▼
auth.middleware.js:
  jwt.verify(token, JWT_SECRET)
  → [VALID]  → req.user = decoded payload → next()
  → [INVALID/EXPIRED] → 401 Unauthorized
  │
  ▼
Controller accesses req.user._id for data isolation
  │
  ▼
END
```

---

## 3.4 High-Level Application Architecture

### 3.4.1 Frontend Architecture (React + Vite)

The frontend is organized into a domain-driven structure:

```
client/src/
├── api/                    # Axios API clients
│   ├── api.js              # Resume, auth, ATS API calls
│   └── interview.api.js    # Interview session API calls
│
├── components/             # Reusable UI components
│   ├── admin/              # Admin dashboard widgets
│   ├── auth/               # Login, Register, OAuth buttons
│   ├── common/             # Navbar, Footer, LoadingSpinner
│   ├── editor/             # TipTap editor wrappers
│   ├── layout/             # BaseLayout, PageWrapper
│   └── templates/          # Resume preview templates
│
├── context/                # React Context providers
│   ├── DarkModeContext.jsx # Global dark mode state
│   └── NavigationBlockerContext.jsx  # Unsaved changes guard
│
├── hooks/                  # Custom React hooks
│
├── pages/                  # Route-level page components
│   ├── Home.jsx
│   ├── Upload.jsx
│   ├── Editor.jsx          # Main resume editor page
│   ├── Dashboard.jsx       # User resumes list
│   ├── AIInterview.jsx     # AI interview session
│   ├── Login.jsx
│   ├── Register.jsx
│   └── AdminPanel.jsx
│
└── utils/                  # Validation schemas, helpers
```

**State Management Strategy**: SmartNShine uses React's built-in `useState` and `useContext` hooks for state management. The choice not to use a third-party store (Redux, Zustand) reflects the application size — Resume and interview state are localized to their respective pages, with only global concerns (auth token, dark mode) lifted to Context providers.

**Routing**: React Router v6 with `<Outlet>`-based nested route structure. A `BaseLayout` component wraps all authenticated pages, rendering the Navbar and Footer without repetition across page components.

**Styling**: TailwindCSS utility classes with Framer Motion for animations. Framer Motion's `motion.div` components provide page transition animations, hover effects, and interview-phase transition animations without custom CSS keyframe management.

### 3.4.2 Backend Architecture (Node.js + Express)

The backend follows a strict **MVC + Service Layer** pattern:

```
server/
├── config/
│   ├── multer.config.js         # File upload config (5MB limit, PDF/DOCX only)
│   └── passport.config.js       # Google & GitHub OAuth strategies
│
├── controllers/                  # HTTP layer — parse req, call service, send res
│   ├── auth.controller.js        # Register, login, me, OAuth
│   ├── resume.controller.js      # Upload, enhance, save, CRUD
│   ├── ats.controller.js         # ATS score analysis
│   ├── interview.controller.js   # Session, question, evaluate, report
│   ├── subscription.controller.js # Razorpay orders, verification
│   └── admin.controller.js       # Admin CRUD operations
│
├── services/                     # Business logic — independent, testable
│   ├── gemini.service.js         # Google Gemini API client + prompts
│   ├── openai.service.js         # OpenAI GPT-4o client
│   ├── interview.service.js      # Interview orchestration (questions, eval)
│   ├── payment.service.js        # Razorpay order/verify logic
│   ├── email.service.js          # Nodemailer transactional emails
│   └── chatterbox.service.js     # Chatterbox TTS HTTP client
│
├── models/                       # Mongoose schemas
├── routes/                       # Express route definitions
├── middleware/
│   ├── auth.middleware.js         # JWT verification
│   ├── rateLimiter.middleware.js  # Express-rate-limit config
│   └── security.middleware.js     # Helmet, CORS, sanitization
│
├── utils/
│   └── fileExtractor.js           # pdf-parse + mammoth text extraction
│
└── server.js                      # Application entry point
```

**Key Design Principle — Service Layer Isolation**: Controllers delegate all business logic to service functions. Controllers handle only: (1) request parsing, (2) service invocation, (3) response formatting. This ensures that service functions (e.g., `parseResumeWithAI`) are independently testable without HTTP context.

---

## 3.5 Component-Wise Design

### 3.5.1 File Upload Component

**Responsibility**: Accept PDF and DOCX files from the user, validate them client-side, upload to the backend, and navigate to the editor with parsed data.

**Design Decisions**:
- React Dropzone provides drag-and-drop plus click-to-select functionality with minimal custom implementation
- Client-side validation (file type, size) prevents unnecessary server round-trips for clearly invalid inputs
- The upload progress state machine has four states: `idle → uploading → parsing → success/error`
- On success, resume JSON is passed to the editor via React Router's `navigate(path, { state: resumeData })`

**Multer Configuration**:
```
Storage: diskStorage (temp /uploads/ directory)
File Filter: mimetype ∈ { application/pdf, application/vnd.openxmlformats... }
File Size Limit: 5 MB
Field Name: 'resume'
```

### 3.5.2 Resume Editor Component (`Editor.jsx`)

The Editor is the most complex page in the application (~1200+ lines). It manages:

- **Resume state**: Complete structured JSON object tracking all resume sections
- **TipTap editor instances**: One per editable section (summary, each experience bullet array, etc.)
- **Enhancement state**: Loading indicators per section, caching of enhanced content
- **Section ordering**: Up/down reordering for experience, education, and project entries
- **Save state**: Dirty tracking (unsaved changes) with navigation blocker
- **Preview toggle**: Conditional rendering of the `ResumePreview` component

**State Structure**:
```javascript
const [resumeData, setResumeData] = useState({
  name: '',
  contact: { email, phone, linkedin, github, portfolio, location },
  summary: '',
  skills: [{ category: '', items: [] }],
  experience: [{ company, title, location, startDate, endDate, current, bullets }],
  education: [{ institution, degree, field, location, startDate, endDate, gpa, bullets }],
  projects: [{ name, description, technologies, link, bullets }],
  certifications: [{ name, issuer, date, credentialId, link }],
  customSections: [{ id, title, items }]
})
```

### 3.5.3 Resume Preview Component (`ResumePreview.jsx`)

**Responsibility**: Render the resume data as an ATS-compliant HTML document suitable for PDF export.

**ATS Compliance Rules enforced in this component**:
1. Single-column layout using block-level HTML elements only
2. No CSS Grid or multi-column Flexbox layouts
3. Arial font specified via inline CSS (not TailwindCSS utility classes, which are not print-safe)
4. Standard section heading text ("Experience", "Education", "Skills", "Projects")
5. `<ul>` and `<li>` for bullet lists — not custom Unicode bullet characters
6. `@media print` CSS rules to hide non-resume UI elements during print

**PDF Export**: `useReactToPrint()` hook is configured with a ref to the preview container. When triggered, it opens the browser print dialog targeting only the preview component.

### 3.5.4 AI Interview Component (`AIInterview.jsx`)

The AI Interview page is the largest component in the codebase (~3300+ lines). It implements a finite state machine for interview session management:

**Interview States**:
```
IDLE → CONFIGURING → SESSION_CREATING → INTERVIEWING → EVALUATING → REPORT_GENERATING → COMPLETED
```

**Voice Mode Sub-States**:
```
LISTENING → RECORDING → TRANSCRIBING → ANSWER_READY
```

**Key Design Decisions**:
- Audio recording uses the browser `MediaRecorder` API, capturing audio chunks in 250ms slices
- Silence detection is implemented via `AudioContext.createAnalyser()` — RMS volume below threshold for >2 seconds auto-submits the recording
- TTS question playback uses `HTMLAudioElement` targeting an audio blob URL synthesized by Chatterbox
- Browser Web Speech API serves as TTS fallback (no audio blob needed)
- Timer countdown is implemented with `setInterval` and auto-submits the current answer on expiry

### 3.5.5 ATS Score Analyzer Component

**Responsibility**: Accept a job description input alongside the current resume content, call the ATS analysis API, and visualize results.

**Output Visualization**:
- Circular progress meter showing match score (0–100)
- Color-coded threshold feedback (Red: <50, Yellow: 50-70, Green: >70)
- Two keyword tag lists: Present Keywords (green badges) and Missing Keywords (red badges)
- Accordion-style sections for Strengths, Improvement Tips, and an Eligibility verdict banner

---

## 3.6 Data Flow Diagram

### 3.6.1 Level 0 DFD (Context Diagram)

The Level 0 DFD shows SmartNShine as a single system entity with its external entities:

```
                    ┌──────────────────────┐
                    │                      │
 Job Seeker ───────►│                      │◄──── Google Gemini API
 (User)    ◄────────│   SmartNShine        │
                    │   ATS Resume         │◄──── OpenAI GPT-4o API
 Admin     ───────►│   Generator          │
           ◄────────│                      │◄──── Razorpay API
                    │                      │
 Recruiter ◄────────│                      │◄──── Google OAuth / GitHub OAuth
 (receives PDF)     └──────────────────────┘
```

| Input Flow | Description |
|---|---|
| Resume file (PDF/DOCX) | Uploaded by user for parsing |
| Job description text | Provided for ATS scoring |
| Interview configuration | Type, role, level, question count |
| Voice audio | Recorded during voice interview |
| Payment intent | User initiating subscription |

| Output Flow | Description |
|---|---|
| Enhanced resume content | AI-rewritten bullets and summary |
| ATS score + recommendations | Job-resume compatibility analysis |
| Interview questions (text/audio) | GPT-4o generated, Chatterbox spoken |
| Interview evaluation + report | Multi-dimensional scoring per answer |
| ATS-compliant PDF | Downloaded by user, shared with recruiters |

### 3.6.2 Level 1 DFD (System Processes)

```
                    ┌─────────────────────┐
                    │   1.0 Authentication│
 User ─────────────►│   (Register/Login/  │──────► User DB (MongoDB)
                    │    OAuth)           │
                    └─────────────────────┘
                              │ Auth Token
                              ▼
User ──[file]──────►┌─────────────────────┐
                    │   2.0 Resume        │──────► Resume DB
                    │   Processing        │
                    │   (Parse/Edit/Save) │◄────── Gemini API
                    └─────────────────────┘
                              │ Resume Data
                              ▼
                    ┌─────────────────────┐
User ──[JD text]──►│   3.0 ATS Scoring   │──────► Gemini API
                    │   (Analyze Score)   │
                    └─────────────────────┘
                              │ Score + Keywords
                              ▼
                    ┌─────────────────────┐
User ──[config]───►│   4.0 AI Interview  │──────► OpenAI GPT-4o
                    │   (Session Mgmt)    │──────► Whisper STT :5001
                    │                     │──────► Chatterbox :5002
                    └─────────────────────┘
                              │ Report
                              ▼
                    ┌─────────────────────┐
User ──[payment]──►│   5.0 Subscription  │──────► Razorpay API
                    │   (Plan Mgmt)       │──────► Subscription DB
                    └─────────────────────┘
```

### 3.6.3 Level 2 DFD — Resume Processing (Process 2.0)

```
                  ┌─────────────────────────────────────────────┐
                  │            PROCESS 2.0: RESUME PROCESSING   │
                  │                                              │
PDF/DOCX ────────►│  2.1 File           Raw       2.2 AI       │
                  │  Extraction   ──── Text ────► Parsing      │─► Structured JSON
                  │  (pdf-parse/        │          (Gemini)     │
                  │   mammoth)          │                       │
                  │                     │                       │
                  │                     └─► 2.3 Content        │
                  │  resume JSON   ─────────► Enhancement      │─► Enhanced JSON
                  │  + sectionType             (Gemini)        │
                  │                                             │
                  │  resume JSON   ─────────► 2.4 Summary      │─► Summary Text
                  │                            Generation       │
                  │                            (Gemini)        │
                  │                                             │
                  │  resume JSON   ─────────► 2.5 Save/Update  │─► MongoDB (Resume)
                  │  + userId                  (Mongoose)      │
                  │                                             │
                  │  resumeId      ─────────► 2.6 PDF Export   │─► PDF File
                  │                            (react-to-print) │
                  └─────────────────────────────────────────────┘
```

---

## 3.7 Database Design

### 3.7.1 MongoDB Collections Overview

SmartNShine uses MongoDB — a document-oriented NoSQL database — hosted on MongoDB Atlas. The schema-less nature of MongoDB suits the resume data model well, as different candidates have varying numbers of experience entries, projects, and skills categories.

Mongoose 8 (ODM — Object Document Mapper) is used to define schemas with type validation, default values, and referential integrity constraints (`ref` for population).

### 3.7.2 Entity Relationship Overview

```
User ────1:N──── Resume
User ────1:N──── InterviewSession
InterviewSession ────1:1──── InterviewResult
User ────1:N──── Subscription
User ────1:N──── AIUsage
User ────1:N──── Feedback
```

### 3.7.3 User Model Schema

The `User` model is the central entity of the system:

| Field | Type | Description |
|---|---|---|
| `name` | String (required) | Display name |
| `email` | String (required, unique) | Login identifier |
| `password` | String | bcrypt-hashed; absent for OAuth users |
| `avatar` | String | Profile picture URL |
| `role` | String (enum: user/admin) | RBAC role |
| `googleId` | String | Google OAuth identifier |
| `githubId` | String | GitHub OAuth identifier |
| `isEmailVerified` | Boolean | Email verification status |
| `subscriptionTier` | String (enum) | free/one-time/pro/premium |
| `aiUsageCount` | Number | Total AI calls made |
| `lastLoginAt` | Date | Last login timestamp |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

Password field is omitted from all API responses via Mongoose's `select: false` on the password field.

### 3.7.4 Resume Model Schema

The `Resume` model represents a single resume document:

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId (ref: User) | Owner reference |
| `resumeTitle` | String | User-defined title for dashboard |
| `name` | String (required) | Candidate's full name |
| `contact` | Embedded object | email, phone, linkedin, github, portfolio, location |
| `summary` | String | Professional summary text |
| `skills` | Array of `{category, items[]}` | Categorized skill groups |
| `experience` | Array of experience objects | company, title, dates, bullets[] |
| `education` | Array of education objects | institution, degree, field, dates, gpa, bullets[] |
| `projects` | Array of project objects | name, description, technologies[], link, bullets[] |
| `certifications` | Array of certification objects | name, issuer, date, credentialId, link |
| `achievements` | Array of String | Achievement bullet points |
| `customSections` | Array of `{id, title, items[]}` | User-defined extra sections |
| `rawText` | String | Original extracted text (for re-parsing) |
| `templateId` | String | Selected display template |
| `subscriptionInfo` | Embedded object | Tier used at creation |

### 3.7.5 InterviewSession Model Schema

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId (ref: User) | Session owner |
| `interviewType` | String (enum) | technical/behavioral/hr/mixed/resume-based/job-description |
| `role` | String | Target job role |
| `experienceLevel` | String (enum) | fresher/junior/mid/senior/lead |
| `targetSkills` | Array of String | Skills to focus on |
| `questions` | Array of question objects | Each with question text, type, category, evaluation embedded |
| `status` | String (enum) | pending/active/completed/abandoned |
| `currentQuestionIndex` | Number | Progress tracking |
| `totalQuestions` | Number | Configured total |
| `totalDurationSeconds` | Number | Session duration |
| `resumeText` | String | Resume text used as context |
| `jobDescription` | String | JD text used as context |

### 3.7.6 InterviewResult Model Schema

The `InterviewResult` stores the GPT-4o-generated comprehensive report after all questions are answered:

| Field | Type | Description |
|---|---|---|
| `sessionId` | ObjectId (ref: InterviewSession) | Parent session |
| `userId` | ObjectId (ref: User) | Owner reference |
| `overallScore` | Number (0-100) | Overall interview score |
| `skillBreakdown` | Embedded object | communication, technical, problemSolving, situational, culturalFit scores |
| `topicBreakdown` | Array | Per-topic score breakdown |
| `strengths` | Array of String | Identified candidate strengths |
| `weaknesses` | Array of String | Areas for improvement |
| `missedKeywords` | Array of String | Keywords not mentioned |
| `resumeImprovements` | Array of String | Resume update suggestions |
| `practiceAreas` | Array of String | Recommended study topics |
| `summary` | String | Overall performance summary |
| `hiringRecommendation` | Embedded object | hire/maybe/no-hire + confidence + reasoning |

### 3.7.7 Subscription Model Schema

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId (ref: User) | Subscriber reference |
| `planType` | String (enum) | free/one-time/pro/premium/student/lifetime |
| `status` | String (enum) | active/expired/cancelled |
| `razorpayOrderId` | String | Razorpay order reference |
| `razorpayPaymentId` | String | Razorpay payment reference |
| `razorpaySignature` | String | HMAC signature (verification) |
| `amount` | Number | Amount paid (paise) |
| `currency` | String | INR |
| `startDate`, `endDate` | Date | Subscription validity window |

### 3.7.8 AIUsage Model Schema

The `AIUsage` model provides operational tracking of all AI API calls:

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId (ref: User) | User who triggered the call |
| `aiProvider` | String (enum) | gemini/openai |
| `aiModel` | String | Specific model (gemini-2.5-flash, gpt-4o, etc.) |
| `feature` | String | Feature tag (resume_parse, enhance, interview_question, etc.) |
| `tokensUsed` | Number | Total tokens (input + output) |
| `cost` | Number | Estimated cost in USD |
| `responseTime` | Number | API response time in ms |
| `status` | String (enum) | success/error |

This model enables the admin dashboard to surface per-user and per-feature AI consumption reports.

---

## 3.8 Security Design

### 3.8.1 Security Layers

SmartNShine implements a multi-layered security architecture:

| Layer | Mechanism | Purpose |
|---|---|---|
| Transport | HTTPS (TLS) | Encrypts all data in transit |
| HTTP Headers | Helmet.js | Sets CSP, HSTS, X-Frame-Options, etc. |
| Cross-Origin | CORS | Restricts origins to CLIENT_ORIGIN only |
| Input Sanitization | express-mongo-sanitize | Prevents NoSQL injection |
| XSS Prevention | xss-clean | Strips malicious HTML from inputs |
| Rate Limiting | express-rate-limit | 100 req/15min per IP globally |
| Authentication | JWT (HS256, 7-day TTL) | Stateless session token |
| Password Storage | bcryptjs (10 rounds) | One-way hashed passwords |
| File Upload | Multer + MIME validation | Only PDF/DOCX, max 5MB |
| Data Isolation | userId filtering | Users only access their own data |
| Admin RBAC | role === 'admin' middleware check | Admin routes protected |
| Payment Verification | HMAC-SHA256 signature | Cannot forge payment success |
| Session Storage | MongoDB-backed express-session | OAuth state persistence |

### 3.8.2 Rate Limiting Configuration

The global API rate limiter applies across all `/api/*` routes:

```
Window: 15 minutes
Max requests: 100 per IP
Response on exceed: 429 Too Many Requests
Message: "Too many requests from this IP, please try again later"
```

AI-specific endpoints (enhance, parse, interview) may implement tighter limits per the subscription tier logic.

---

## 3.9 Design Considerations and Trade-offs

### 3.9.1 Client-Side vs Server-Side PDF Generation

**Trade-off**: Client-side (`react-to-print`) vs server-side (`pdfkit`, `puppeteer`) PDF generation.

**Decision**: Client-side via `react-to-print`.

**Rationale**:
- Eliminates server round-trip and server-side resource consumption for PDF rendering
- Browser-native PDF text layer is inherently selectable (machine-readable) — required for ATS
- ATS-preview and PDF output are always in sync because both use the same `ResumePreview` React component
- Headless browser-based server rendering (Puppeteer) adds significant deployment complexity and memory overhead

**Trade-off accepted**: Cross-browser font and layout consistency requires careful CSS management. Arial must be specified explicitly; system font stacks may differ.

### 3.9.2 React State vs External Store (Redux/Zustand)

**Decision**: React Context + useState; no external store.

**Rationale**: The page components are largely self-contained. Resume data is local to the Editor page; interview state is local to AIInterview. Global state needs are limited to auth token and dark mode preference — both lightweight and handled cleanly with Context.

**Trade-off accepted**: As application complexity grew (the Editor component reached ~1200 lines), state locality created some prop-drilling and state initialization complexity. For future versions, Zustand is considered for the resume editor state specifically.

### 3.9.3 Microservice vs Monolithic Voice Integration

**Decision**: Python Flask microservices for voice AI (Whisper, Chatterbox) rather than native Node.js integration.

**Rationale**: The Python ecosystem (Whisper, PyTorch, Chatterbox) has no equivalent in Node.js. Attempting to call Python models from Node.js via `child_process` would be fragile and complex. Two clearly-bounded HTTP services with health check endpoints is a clean, standard microservice pattern.

**Trade-off accepted**: Two additional processes must be running for full voice functionality. Network overhead for audio blob proxying adds ~10–50ms latency versus in-process calls. Service startup time is longer for the voice services (model loading: ~5–15 seconds for Whisper on first invocation).

### 3.9.4 Multi-Model AI Strategy (Gemini + GPT-4o)

**Decision**: Route resume tasks to Gemini, interview tasks to GPT-4o.

**Rationale**:
- Gemini 2.5 Flash offers lower per-token cost and faster latency for structured extraction tasks (parsing, enhancement) — approximately 3–5× cheaper than GPT-4o at equivalent quality for these tasks
- GPT-4o's stronger chain-of-thought reasoning is genuinely needed for nuanced interview evaluation — assessing the quality of a behavioral answer, constructing adaptive follow-up questions, and generating a comprehensive hiring recommendation

**Trade-off accepted**: Two separate API key configurations required; two different error handling paths. The `aiRouter.service.js` module abstracts routing logic and provides a unified interface.

---

## 3.10 Summary

This chapter presented the complete system design of SmartNShine across multiple levels of detail. The high-level three-tier + microservice architecture clearly separates concerns between presentation, application logic, data persistence, and voice AI processing. The detailed flowcharts trace the exact steps of the three critical user journeys: resume processing, AI interview, and authentication. The component-wise design explains the internal structure and state management of the most complex frontend components. The database schema design demonstrates how MongoDB documents model the rich, variable-length data structures inherent to resumes and interview sessions. Finally, the security design shows how multiple defence-in-depth layers protect user data and prevent abuse.

The design decisions documented in Section 3.9 reflect deliberate engineering trade-offs that prioritize simplicity, performance, and maintainability — values that guided SmartNShine's architecture throughout its development.

---

*End of Chapter 3*
