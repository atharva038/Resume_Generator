# Backend Implementation Documentation

## 1. Overview
The backend of the SmartNShine ATS Resume Generator is built as a robust, specialized REST API. It is designed around the Express.js framework on top of Node.js. It manages data persistence with MongoDB (via Mongoose), sophisticated AI integrations, resume parsing, user authentication, and administrative controls.

## 2. Technology Stack
*   **Core Runtime environment**: Node.js
*   **Web Framework**: Express.js
*   **Database & ORM**: MongoDB with Mongoose
*   **Authentication**: Passport.js (for Google/GitHub OAuth2) and JSON Web Tokens (JWT) for secure session handling.
*   **Security & Protection**: Helmet (HTTP Headers), `express-rate-limit`, `cors`, `express-mongo-sanitize` (NoSQL Injection prevention), and `xss-clean`.
*   **File Handling & Parsing**: `multer` (Uploads), `pdf-parse`, `pdf.js-extract`, and `mammoth` (DOCX parsing).
*   **AI Integration**: `@google/generative-ai` (Gemini API) and `openai` (GPT model API).
*   **Payment Infrastructure**: Razorpay and DodoPayments Webhooks.
*   **Mailing**: `nodemailer` for transactional emails.

## 3. Architecture & Directory Structure
The application follows a standard Model-View-Controller (MVC) and Service-Oriented architecture paradigm:

*   **`config/`**: Configuration bounds for external plugins (`multer.config.js` for disk-storage definitions and `passport.config.js` for OAuth).
*   **`models/`**: Mongoose Object Data Modeling (ODM) schemas. Defines the database structure for:
    *   `User.model.js`, `Resume.model.js`, `Template.model.js` (Core Application)
    *   `Subscription.model.js`, `Payment.model.js` (Billing)
    *   `AIUsage.model.js`, `InterviewSession.model.js` (AI Tracking)
    *   `AdminLog.model.js` (Platform Logging)
*   **`routes/`**: Distinct API route definitions specifying exact endpoints (`/api/v1/auth`, `/api/v1/ats`, `/api/v1/interview`, etc) which point to matching controllers.  
*   **`controllers/`**: Extracts HTTP query logic, invokes necessary services, and handles application HTTP response structures. Includes logic for `ats.controller.js`, `auth.controller.js`, `resume.controller.js`, etc.
*   **`services/`**: Specialized utility classes handling complex logic decoupling it from controllers:
    *   `aiRouter.service.js`: intelligently routes requests between OpenAI and Gemini to balance loads and fallbacks.
    *   `chatterbox.service.js` & `elevenlabs.service.js`: Used for vocal and conversational capabilities.
    *   `payment.service.js`: Wrapper over transaction validation logic.
*   **`middleware/`**: Request interceptors processing context before controllers:
    *   `auth.middleware.js`: Verifies JWTs and assigns user context to `req`.
    *   `security.middleware.js`: Applies application-wide sanitize checks.
    *   `aiUsageTracker.middleware.js`: Tracks and restricts AI requests based on the user's subscription limits.
*   **`utils/`**: General helper abstractions (e.g., `fileExtractor.js` to strip text from uploaded buffers).
*   **`scripts/`**: Essential maintenance tools to perform Database mutations, user migration (`migrateUsers.js`), creating admins, and deduplicating template structures.

## 4. Key Sub-Systems

### 4.1 ATS Analysis Engine
Triggered through the `/api/v1/ats` endpoint, the system uses Multer to capture a resume file memory buffer. It extracts raw text and passes it to the `aiRouter.service.js`. The router invokes predefined prompts via either Gemini or OpenAI APIs, evaluating the match, extracting metadata, and constructing a detailed JSON response grading the applicant against specified keywords.

### 4.2 Security & Authentication Pipeline
Security is baked into the root `server.js` startup script. The application enforces JWTs over HTTPS requests. Rate limiters are established per route to prevent abuse (e.g., stopping brute-force password attacks on authentication endpoints). Inputs are aggressively sanitized leveraging `xss-clean` to prevent Cross-Site Scripting.

### 4.3 Quota and Subscription Logic
AI models incur costs. Thus, the system includes `Subscription` and `AIUsage` tracking schemas. Dedicated middleware (`aiUsageTracker.middleware.js`) dynamically checks a user's Tier bounds before proxying generative tasks to the respective models, ensuring users don't exceed their allotted token/request limits.

### 4.4 Automated Interview Features
Allows real-time generative conversation structures. Utilizing `Session` state, the backend evaluates applicant skills storing historical context in `InterviewSession` models, processing continuous iterations via AI generation handlers.
