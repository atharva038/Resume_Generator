# Requirement Analysis

## Project Title
SmartNShine ATS Resume Generator with AI Interview Practice

## Date
13 March 2026

## 1. Introduction
SmartNShine is a full-stack web application built to help users create ATS-friendly resumes, improve resume content using AI, analyze resume-job fit, and practice interviews through an AI-driven mock interview system. The project combines resume management, ATS analysis, voice-enabled interview simulation, subscription billing, and an admin panel in a single MERN-based platform.

This requirement analysis summarizes the problem the system solves, its stakeholders, major modules, functional requirements, non-functional requirements, constraints, and future scope based on the current codebase implementation.

## 2. Problem Statement
Job seekers often struggle with three connected problems:

1. Creating a resume that is structured correctly for Applicant Tracking Systems.
2. Improving resume content to better match job expectations and keywords.
3. Practicing interviews in a realistic and personalized way before applying.

Most tools solve only one part of this workflow. SmartNShine addresses the complete preparation cycle by allowing users to build and optimize resumes, measure ATS compatibility, and practice AI-guided interviews in one platform.

## 3. Project Objectives
The main objectives of the system are:

1. To let users create, edit, save, and download professional ATS-friendly resumes.
2. To use AI for resume parsing, summarization, content enhancement, and skill categorization.
3. To analyze a resume against a job description and provide ATS-related feedback.
4. To provide a mock interview system with text and voice-based interaction.
5. To manage subscriptions and usage limits for free and premium users.
6. To provide administrators with monitoring, user management, template management, and usage analytics.

## 4. Stakeholders

### Primary Stakeholders
- Job seekers and students who want to improve their resumes and interview performance.
- Premium subscribers who need higher AI limits, more templates, and advanced features.
- System administrators who manage users, templates, subscriptions, and platform analytics.

### Secondary Stakeholders
- Faculty or evaluators reviewing the project as an academic submission.
- Developers maintaining the platform.
- External service providers such as Google Gemini, OpenAI, Razorpay, GitHub, Google OAuth, Adzuna, Whisper, and Chatterbox.

## 5. User Roles

### 5.1 Guest User
- Can access public pages such as home, pricing, policies, and authentication pages.
- Can view plan information.
- Cannot access resume editor, ATS tools, saved resumes, or interview features.

### 5.2 Registered User
- Can log in using email/password or OAuth.
- Can upload resumes, edit resume data, save multiple resumes, and manage profile data.
- Can use AI-powered resume and interview features subject to plan limits.

### 5.3 Subscriber
- Has access to higher usage limits, more templates, premium AI routing, ATS scans, and interview-related capabilities.
- Can manage subscription status, billing history, and usage statistics.

### 5.4 Admin
- Can view platform-wide dashboards.
- Can manage users, templates, contact messages, feedback, AI quotas, logs, and settings.

## 6. Scope of the System

### In Scope
- User registration, login, OAuth login, and password reset.
- Resume upload, parsing, editing, saving, deletion, and PDF download tracking.
- AI-powered resume enhancement and summary generation.
- ATS analysis against job descriptions.
- AI interview practice with session history and results.
- Voice integration through STT and TTS services.
- Subscription and payment management using Razorpay.
- Admin dashboard and management tools.

### Currently Limited or Hidden
- Job search and smart-match features exist in code but are temporarily hidden from active routing for compliance reasons.
- ElevenLabs TTS integration is disabled and replaced by Chatterbox plus browser TTS fallback.
- Advanced analytics for subscription users are partially referenced but not fully active.

### Out of Current Scope
- Real-time video interview conferencing.
- Team collaboration on resumes.
- Fully implemented Stripe or PayPal payment flows.
- Production-grade live interview streaming workflow beyond current placeholders.

## 7. Functional Requirements

### 7.1 Authentication and User Management
FR-1. The system shall allow users to register using name, email, and password.

FR-2. The system shall allow users to log in using email and password.

FR-3. The system shall support Google OAuth login when configured.

FR-4. The system shall support GitHub OAuth login when configured.

FR-5. The system shall allow authenticated users to fetch their current profile.

FR-6. The system shall support forgot-password and reset-password workflows.

FR-7. The system shall maintain user roles such as user and admin.

FR-8. The system shall maintain user account status such as active and disabled.

### 7.2 Resume Management
FR-9. The system shall allow authenticated users to upload resume files in PDF or DOCX format.

FR-10. The system shall extract raw text from uploaded resumes.

FR-11. The system shall parse uploaded resume content into structured sections including contact details, summary, skills, experience, education, projects, certifications, achievements, and custom sections.

FR-12. The system shall allow users to edit parsed resume data in the resume editor.

FR-13. The system shall allow users to save resumes to the database.

FR-14. The system shall allow users to list, view, update, and delete their saved resumes.

FR-15. The system shall allow users to choose resume templates and color themes.

FR-16. The system shall support download tracking for exported resumes.

### 7.3 AI Resume Enhancement
FR-17. The system shall allow users to enhance resume content using AI.

FR-18. The system shall generate professional summaries using AI.

FR-19. The system shall categorize skills into meaningful skill groups using AI.

FR-20. The system shall segregate achievements into structured output using AI.

FR-21. The system shall process user-defined custom sections using AI assistance.

FR-22. The system shall enforce plan-based AI usage limits before executing AI requests.

### 7.4 ATS Analysis
FR-23. The system shall analyze a resume against a job description.

FR-24. The system shall compute a match score between resume data and a job description.

FR-25. The system shall analyze skill alignment and missing skills.

FR-26. The system shall restrict ATS analysis to authenticated users and applicable AI quotas.

### 7.5 AI Interview Module
FR-27. The system shall allow users to configure and create interview sessions.

FR-28. The system shall support interview types including resume-based, job-description, technical, behavioral, and mixed.

FR-29. The system shall support interview modes including text, voice, mixed, and live placeholders.

FR-30. The system shall generate interview questions dynamically using AI.

FR-31. The system shall allow users to start, answer, skip, abandon, and complete interview sessions.

FR-32. The system shall accept typed answers for interview questions.

FR-33. The system shall accept voice answers through uploaded audio in supported interview flows.

FR-34. The system shall transcribe voice answers through the speech-to-text service.

FR-35. The system shall evaluate answers across multiple dimensions such as relevance, technical accuracy, clarity, confidence, and role fit.

FR-36. The system shall generate question-level feedback, suggested answers, and improvement tips.

FR-37. The system shall generate a final interview result/report for completed sessions.

FR-38. The system shall provide interview history and statistics for each user.

### 7.6 Voice Services
FR-39. The system shall check the health of speech-to-text and text-to-speech services.

FR-40. The system shall synthesize interview prompts to audio using Chatterbox when available.

FR-41. The system shall fall back to browser-based text-to-speech when server-side TTS is unavailable.

FR-42. The system shall protect private voice endpoints with authentication where required.

### 7.7 Subscription and Payment Management
FR-43. The system shall provide plan/pricing information.

FR-44. The system shall create payment orders through Razorpay.

FR-45. The system shall verify completed payments and activate subscriptions.

FR-46. The system shall store subscription tier, plan, status, dates, and payment references.

FR-47. The system shall allow users to view subscription status, history, and usage data.

FR-48. The system shall allow users to cancel and renew subscriptions.

FR-49. The system shall process payment webhooks.

FR-50. The system shall enforce feature access and usage quotas according to the active subscription tier.

### 7.8 Admin Module
FR-51. The system shall provide a protected admin area.

FR-52. The system shall allow admins to view user statistics and dashboard metrics.

FR-53. The system shall allow admins to manage user accounts, roles, and status.

FR-54. The system shall allow admins to manage resume templates.

FR-55. The system shall allow admins to review AI analytics and quota usage.

FR-56. The system shall allow admins to manage contact messages and user feedback.

FR-57. The system shall allow admins to view admin logs.

FR-58. The system shall allow admins to update platform settings.

### 7.9 Support and Communication
FR-59. The system shall provide a contact form for users.

FR-60. The system shall provide a feedback mechanism.

FR-61. The system shall send email notifications for selected flows such as password reset and payment confirmation.

## 8. Non-Functional Requirements

### 8.1 Performance
- The frontend should load efficiently through route-based lazy loading where possible.
- API endpoints should return reasonable responses under normal user load.
- File uploads should be limited to prevent large payload abuse.
- Voice service checks should be non-blocking during server startup.

### 8.2 Security
- The system shall use JWT authentication for protected API access.
- The system shall hash passwords before saving them.
- The system shall apply CORS restrictions.
- The system shall sanitize requests against NoSQL injection and XSS attacks.
- The system shall apply rate limiting to API, authentication, AI, and upload routes.
- The system shall store secrets in environment variables.

### 8.3 Reliability and Availability
- The system shall handle unavailable AI or voice services gracefully.
- The system shall provide health endpoints for service status checks.
- The system shall support fallback behavior for voice output.

### 8.4 Scalability
- The architecture shall separate the web application from voice microservices.
- The platform should support additional templates, plans, and AI features without redesigning the full system.
- The data model should support multiple resumes, subscriptions, and interview sessions per user.

### 8.5 Usability
- The user interface should be responsive across desktop and mobile devices.
- The resume editor should support structured editing and preview workflows.
- Users should be able to navigate key features through dedicated route-based pages.

### 8.6 Maintainability
- The backend follows a modular structure using routes, controllers, services, middleware, and models.
- The frontend is organized into pages, components, hooks, and API clients.
- The codebase should remain extensible for new AI features and payment options.

## 9. Data Requirements
The system maintains the following major data entities:

1. User
2. Resume
3. InterviewSession
4. InterviewResult
5. Subscription
6. Template
7. AIUsage
8. Feedback
9. Contact
10. AdminLog
11. Settings
12. UsageLog

Key persistent data includes personal profile details, resume content, AI usage statistics, payment references, subscription history, interview questions and answers, evaluations, and administrator actions.

## 10. External Interface Requirements

### Software Interfaces
- Google Gemini API for resume parsing and enhancement.
- OpenAI API for interview generation and evaluation.
- Razorpay API for payment processing.
- MongoDB Atlas or MongoDB server for persistence.
- Google OAuth and GitHub OAuth for authentication.
- Adzuna API for job search related features.
- Whisper Flask service for speech-to-text.
- Chatterbox Flask service for text-to-speech.

### Hardware/Platform Interfaces
- Modern browser for the React frontend.
- Server environment capable of running Node.js and MongoDB connectivity.
- Python runtime for voice microservices.
- Microphone access for voice interview input.

## 11. Business Rules and Constraints

1. Protected features require authenticated access.
2. Premium feature access depends on active subscription status.
3. AI-heavy operations are subject to quota and rate-limit checks.
4. Resume uploads are restricted to supported file types and size limits.
5. Some features are tier-dependent, such as template access, ATS scans, AI routing, and premium interview capabilities.
6. Admin users have elevated privileges for monitoring and configuration.
7. Voice output must degrade gracefully to browser TTS when the Chatterbox service is unavailable.
8. Certain features present in code are intentionally hidden or disabled for business or compliance reasons.

## 12. Assumptions

1. Users have stable internet access for cloud AI and payment services.
2. Required API keys and OAuth credentials are configured correctly in the deployment environment.
3. MongoDB is available and reachable.
4. Voice interview quality depends on microphone input quality and voice service availability.
5. Resume parsing accuracy depends on document clarity and AI response quality.

## 13. Risks and Limitations

1. External API downtime may affect AI, OAuth, payment, or job-related features.
2. Speech recognition quality may vary based on accent, audio noise, and recording quality.
3. Some features are incomplete or temporarily disabled, which may reduce the end-to-end scope shown in demonstrations.
4. Subscription logic adds operational complexity because quotas, access rights, and payment verification must stay synchronized.
5. Hidden job features and disabled ElevenLabs integration indicate that some roadmap items are not currently production-ready.

## 14. Future Enhancements

1. Re-enable or replace advanced job matching workflows.
2. Add live video interview support.
3. Add more payment gateways such as Stripe or PayPal.
4. Expand analytics for both users and administrators.
5. Add collaborative resume review or mentor feedback features.
6. Improve recommendation quality with more advanced AI scoring and benchmarking.

## 15. Conclusion
SmartNShine is not just a resume builder. It is a career-preparation platform that integrates resume creation, ATS optimization, interview practice, subscription management, and admin control into one system. The implemented project demonstrates a clear academic and practical scope, with strong coverage of authentication, AI integration, CRUD operations, analytics, and modular architecture. The current codebase is substantial enough to be presented as a complete full-stack project, while still leaving identifiable future scope for further enhancement.