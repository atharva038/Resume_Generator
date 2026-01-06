# TestSprite Backend API Specification
## SmartNShine - Resume Builder Backend Testing

> **Version:** 1.0.0  
> **Test Type:** Backend API  
> **Server Port:** 5000  
> **Test Scope:** API Endpoints & Business Logic

---

## 🎯 Backend Overview

The SmartNShine backend is a Node.js/Express REST API that handles:
- User authentication (JWT + OAuth)
- Resume CRUD operations
- AI-powered resume parsing and enhancement (Google Gemini)
- ATS analysis
- ML job matching integration
- File uploads (PDF/DOCX parsing)
- Admin operations
- Contact/Feedback management

### **Tech Stack:**
- **Framework:** Express.js (Node.js 18+)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + Passport.js (OAuth)
- **AI Services:** Google Gemini API
- **File Processing:** Multer, pdf-parse, mammoth
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize, xss-clean

---

## 🔌 API Endpoints Documentation

### **Base URL:** `http://localhost:5000/api`

---

## 1️⃣ Authentication Endpoints

### **POST /api/auth/register**
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation:**
- `name`: Required, min 3 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-11-11T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Validation errors (missing fields, invalid format)
- `409`: Email already exists

---

### **POST /api/auth/login**
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400`: Missing credentials
- `401`: Invalid email or password
- `404`: User not found

---

### **GET /api/auth/me**
Get current authenticated user.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-11-11T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401`: No token provided or invalid token
- `404`: User not found

---

### **POST /api/auth/forgot-password**
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Error Responses:**
- `404`: User not found
- `500`: Email service error

---

### **POST /api/auth/reset-password/:token**
Reset password with token.

**Request Body:**
```json
{
  "password": "NewSecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Error Responses:**
- `400`: Invalid or expired token
- `400`: Weak password

---

### **GET /api/auth/google**
Initiate Google OAuth flow.

**Response:** Redirects to Google OAuth consent screen.

---

### **GET /api/auth/github**
Initiate GitHub OAuth flow.

**Response:** Redirects to GitHub OAuth authorization.

---

### **GET /api/auth/callback**
OAuth callback handler (Google/GitHub).

**Query Params:**
- `code`: OAuth authorization code

**Response:** Redirects to frontend with token in query params.

---

## 2️⃣ Resume Endpoints

### **POST /api/resume/upload**
Upload and parse resume file (PDF/DOCX).

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Form Data:**
```
resume: [File] (PDF or DOCX, max 5MB)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "name": "John Doe",
    "contact": {
      "email": "john@example.com",
      "phone": "+1-555-123-4567",
      "location": "San Francisco, CA",
      "linkedin": "linkedin.com/in/johndoe",
      "github": "github.com/johndoe"
    },
    "summary": "Experienced software engineer...",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [...],
    "education": [...],
    "projects": [...]
  }
}
```

**Error Responses:**
- `400`: No file uploaded or invalid file type
- `400`: File too large (> 5MB)
- `401`: Unauthorized
- `500`: Parsing error

---

### **POST /api/resume/save**
Save new resume to database.

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "resumeTitle": "Software Engineer Resume",
  "name": "John Doe",
  "contact": { ... },
  "summary": "...",
  "skills": [...],
  "experience": [...],
  "education": [...],
  "projects": [...],
  "template": "modern"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Resume saved successfully",
  "resume": {
    "_id": "resume_id",
    "userId": "user_id",
    "resumeTitle": "Software Engineer Resume",
    ...
  }
}
```

**Error Responses:**
- `400`: Validation errors
- `401`: Unauthorized
- `500`: Database error

---

### **GET /api/resume/list**
List all resumes for authenticated user.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "resumes": [
    {
      "_id": "resume_id_1",
      "resumeTitle": "Software Engineer Resume",
      "name": "John Doe",
      "updatedAt": "2025-11-11T00:00:00.000Z",
      "template": "modern"
    },
    ...
  ]
}
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Database error

---

### **GET /api/resume/:id**
Get specific resume by ID.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Success Response (200):**
```json
{
  "_id": "resume_id",
  "userId": "user_id",
  "resumeTitle": "Software Engineer Resume",
  "name": "John Doe",
  "contact": { ... },
  "summary": "...",
  "skills": [...],
  "experience": [...],
  "education": [...],
  "projects": [...],
  "template": "modern",
  "createdAt": "2025-11-11T00:00:00.000Z",
  "updatedAt": "2025-11-11T00:00:00.000Z"
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Not your resume (authorization error)
- `404`: Resume not found

---

### **PUT /api/resume/:id**
Update existing resume.

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:** (Same as save, partial updates allowed)
```json
{
  "resumeTitle": "Updated Title",
  "summary": "Updated summary...",
  "skills": ["New", "Skills"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resume updated successfully",
  "resume": { ... }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Not your resume
- `404`: Resume not found
- `400`: Validation errors

---

### **DELETE /api/resume/:id**
Delete resume.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Not your resume
- `404`: Resume not found

---

### **POST /api/resume/enhance**
AI-enhance resume content (using Gemini).

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Managed team and developed features",
  "sectionType": "experience",
  "resumeData": { ... },
  "customPrompt": "Make it more impactful"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "enhancedContent": "Led a cross-functional team of 5 developers and architected scalable features that improved user engagement by 40%"
}
```

**Error Responses:**
- `400`: Missing content or sectionType
- `401`: Unauthorized
- `429`: AI quota exceeded
- `500`: Gemini API error

---

### **POST /api/resume/generate-summary**
Generate professional summary from resume data.

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "resumeData": {
    "name": "John Doe",
    "skills": [...],
    "experience": [...],
    "education": [...]
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "summary": "Results-driven Software Engineer with 5+ years of experience in full-stack development..."
}
```

**Error Responses:**
- `400`: Invalid resume data
- `401`: Unauthorized
- `429`: AI quota exceeded

---

### **POST /api/resume/categorize-skills**
Categorize skills into Technical, Soft, Tools.

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "skills": ["React", "Leadership", "Docker", "Communication", "Node.js"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "categorizedSkills": {
    "technical": ["React", "Node.js"],
    "soft": ["Leadership", "Communication"],
    "tools": ["Docker"]
  }
}
```

---

### **POST /api/resume/segregate-achievements**
Segregate achievements into categories.

**Request Body:**
```json
{
  "achievements": [
    "Increased sales by 30%",
    "Published research paper",
    "Won hackathon"
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "segregatedAchievements": {
    "professional": ["Increased sales by 30%"],
    "academic": ["Published research paper"],
    "awards": ["Won hackathon"]
  }
}
```

---

## 3️⃣ ATS Analysis Endpoints

### **POST /api/ats/analyze-resume**
Analyze resume against job description.

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data
```

**Form Data:**
```
resume: [File] (PDF/DOCX)
jobDescription: "Software Engineer position requiring React, Node.js..."
```

**OR**

**Request Body (JSON):**
```json
{
  "resumeData": { ... },
  "jobDescription": "Software Engineer position..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "analysis": {
    "score": 78,
    "keywordMatches": {
      "matched": ["React", "Node.js", "MongoDB"],
      "missing": ["AWS", "Docker", "Kubernetes"]
    },
    "sectionAnalysis": {
      "summary": { "score": 8, "feedback": "Strong summary..." },
      "skills": { "score": 7, "feedback": "Add cloud skills..." },
      "experience": { "score": 8, "feedback": "Good metrics..." }
    },
    "suggestions": [
      "Add AWS and Docker to skills section",
      "Include more quantifiable achievements",
      "Mention Agile/Scrum experience"
    ],
    "formattingIssues": []
  }
}
```

**Error Responses:**
- `400`: Missing resume or job description
- `401`: Unauthorized
- `429`: AI quota exceeded
- `500`: Analysis error

---

## 4️⃣ ML Job Matching Endpoints

### **POST /api/ml/match-score**
Calculate match score using ML model.

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "resumeData": {
    "name": "John Doe",
    "skills": ["React", "Node.js"],
    "experience": [...],
    "education": [...]
  },
  "jobDescription": "Senior Full-Stack Developer..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "matchScore": 82.5,
  "breakdown": {
    "skillsMatch": 85,
    "experienceMatch": 80,
    "educationMatch": 90
  },
  "confidence": 0.87
}
```

**Error Responses:**
- `400`: Invalid input data
- `401`: Unauthorized
- `503`: ML service unavailable

---

### **POST /api/ml/skill-gap-analysis**
Analyze skill gaps between resume and job.

**Request Body:**
```json
{
  "resumeData": { ... },
  "jobDescription": "..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "skillGaps": {
    "present": ["React", "Node.js", "MongoDB"],
    "missing": ["AWS", "Docker", "Kubernetes"],
    "partial": ["CI/CD (familiar but not expert)"]
  },
  "recommendations": [
    "Consider learning AWS (high priority)",
    "Docker certification would strengthen profile",
    "Gain more experience with Kubernetes"
  ]
}
```

---

### **POST /api/ml/quick-match**
Quick skill-based matching.

**Request Body:**
```json
{
  "skills": ["React", "Node.js", "MongoDB"],
  "jobDescription": "..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "quickMatch": {
    "score": 75,
    "matchedSkills": ["React", "Node.js"],
    "missingCritical": ["AWS"],
    "recommendation": "Good fit with some upskilling needed"
  }
}
```

---

## 5️⃣ Contact & Feedback Endpoints

### **POST /api/contact**
Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about features",
  "message": "I would like to know..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact message sent successfully"
}
```

**Error Responses:**
- `400`: Validation errors
- `429`: Rate limit exceeded (max 5 per hour)

---

### **POST /api/feedback**
Submit feedback.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "category": "Feature",
  "rating": 5,
  "message": "Love the AI enhancement feature!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

---

## 6️⃣ GitHub Integration Endpoints

### **GET /api/github/repos**
Get user's GitHub repositories (requires OAuth).

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "repos": [
    {
      "id": 123456,
      "name": "awesome-project",
      "description": "An awesome full-stack application",
      "url": "https://github.com/johndoe/awesome-project",
      "stars": 42,
      "language": "JavaScript"
    },
    ...
  ]
}
```

**Error Responses:**
- `401`: Not authenticated with GitHub
- `500`: GitHub API error

---

### **POST /api/github/import**
Import selected repos as resume projects.

**Request Body:**
```json
{
  "resumeId": "resume_id",
  "repoIds": [123456, 789012]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Projects imported successfully",
  "importedCount": 2
}
```

---

## 7️⃣ Admin Endpoints

### **GET /api/admin/users**
List all users (admin only).

**Headers:**
```
Authorization: Bearer {admin_jwt_token}
```

**Query Params:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search by name/email
- `role`: Filter by role (user/admin)

**Success Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "resumeCount": 3,
      "createdAt": "2025-11-11T00:00:00.000Z",
      "lastLogin": "2025-11-11T12:00:00.000Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Forbidden (not admin)

---

### **GET /api/admin/analytics**
Get analytics data.

**Success Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 1250,
    "totalResumes": 3840,
    "aiApiCalls": 15670,
    "aiCosts": 245.50,
    "newUsersThisMonth": 180,
    "activeUsers": 650
  }
}
```

---

### **GET /api/admin/ai-usage**
Get AI usage statistics.

**Query Params:**
- `startDate`: Start date (ISO format)
- `endDate`: End date (ISO format)
- `groupBy`: day/week/month

**Success Response (200):**
```json
{
  "success": true,
  "usage": {
    "totalCalls": 15670,
    "byFeature": {
      "enhance": 8500,
      "analyze": 4200,
      "summarize": 2970
    },
    "costEstimate": 245.50,
    "topUsers": [...]
  }
}
```

---

### **PATCH /api/admin/users/:id**
Update user (role, quota, etc.).

**Request Body:**
```json
{
  "role": "admin",
  "aiQuota": 1000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

### **DELETE /api/admin/users/:id**
Delete user account.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 🔒 Security & Rate Limiting

### **Rate Limits:**
- General API: 100 requests/15 min per IP
- Auth endpoints: 5 requests/15 min per IP
- AI endpoints: 20 requests/hour per user
- File uploads: 10 requests/hour per user
- Contact form: 5 requests/hour per IP

### **Authentication:**
- All protected routes require `Authorization: Bearer {token}` header
- Token expires in 7 days
- Token refresh not implemented (user must re-login)

### **Input Validation:**
- All inputs sanitized against XSS, NoSQL injection
- File uploads validated (type, size)
- Email format validated
- URL format validated

### **CORS:**
- Allowed origins: `http://localhost:5173`, production frontend URL
- Credentials: Allowed
- Methods: GET, POST, PUT, PATCH, DELETE

---

## 🧪 Testing Checklist

### **Authentication Tests:**
- [ ] Register with valid data
- [ ] Register with duplicate email (should fail)
- [ ] Register with invalid email format (should fail)
- [ ] Register with weak password (should fail)
- [ ] Login with valid credentials
- [ ] Login with wrong password (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with expired token (should fail)
- [ ] Access admin route as regular user (should fail)

### **Resume Tests:**
- [ ] Upload valid PDF resume
- [ ] Upload valid DOCX resume
- [ ] Upload file > 5MB (should fail)
- [ ] Upload non-PDF/DOCX file (should fail)
- [ ] Save new resume
- [ ] Update existing resume
- [ ] Delete resume
- [ ] List all user resumes
- [ ] Get resume by ID
- [ ] Access another user's resume (should fail)

### **AI Enhancement Tests:**
- [ ] Enhance summary section
- [ ] Enhance experience bullet points
- [ ] Generate summary from resume data
- [ ] Categorize skills
- [ ] Segregate achievements
- [ ] Handle empty content (should fail gracefully)
- [ ] Handle very long content (>10k chars)
- [ ] Respect AI quota limits

### **ATS Analysis Tests:**
- [ ] Analyze resume vs job description
- [ ] Get ATS score
- [ ] Get keyword matches
- [ ] Get improvement suggestions
- [ ] Handle missing job description (should fail)

### **ML Matching Tests:**
- [ ] Calculate match score
- [ ] Get skill gap analysis
- [ ] Quick match with skills list
- [ ] Handle ML service down gracefully

### **Contact & Feedback Tests:**
- [ ] Submit contact form
- [ ] Submit feedback form
- [ ] Validate required fields
- [ ] Test rate limiting (max 5/hour)

### **Admin Tests:**
- [ ] List all users (admin only)
- [ ] View analytics (admin only)
- [ ] Update user role
- [ ] Delete user
- [ ] Access as non-admin (should fail)

### **Error Handling:**
- [ ] Handle database connection errors
- [ ] Handle Gemini API errors
- [ ] Handle ML service unavailable
- [ ] Handle file parsing errors
- [ ] Handle network timeouts
- [ ] Return appropriate HTTP status codes

---

## 📊 Expected Response Times

| Endpoint Type | Expected Time |
|--------------|---------------|
| Auth endpoints | < 500ms |
| CRUD operations | < 200ms |
| File upload | 1-3 seconds |
| AI enhancement | 2-5 seconds |
| ATS analysis | 3-8 seconds |
| ML matching | 2-4 seconds |

---

## 🐛 Common Issues

1. **AI quota exceeded** - User has hit daily/monthly limit
2. **File parsing failed** - Corrupted or unsupported PDF/DOCX
3. **MongoDB connection lost** - Database unavailable
4. **Gemini API error** - Invalid API key or service down
5. **ML service unavailable** - Python ML service not running

---

**Last Updated:** November 11, 2025  
**API Version:** 1.0.0
