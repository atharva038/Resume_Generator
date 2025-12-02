# TestSprite Frontend Testing Specification
## SmartNShine - ATS Resume Builder

> **Version:** 1.0.0  
> **Test Type:** Frontend  
> **Local Port:** 5173  
> **Backend Port:** 5000  
> **Test Scope:** Comprehensive E2E Testing

---

## 🎯 Application Overview

SmartNShine is an AI-powered ATS (Applicant Tracking System) Resume Builder built with the MERN stack and Google's Gemini AI. The application helps users create, optimize, and analyze resumes for better job application success rates.

### **Tech Stack**
- **Frontend:** React 18 + Vite, TailwindCSS, React Router v7
- **Backend:** Node.js + Express (port 5000)
- **Database:** MongoDB
- **AI:** Google Gemini API
- **File Upload:** PDF/DOCX parsing
- **Authentication:** JWT + OAuth (Google, GitHub)

---

## 📋 Application Routes & Features

### **Public Routes** (No Authentication Required)

#### 1. **Home Page** (`/`)
- **Purpose:** Landing page with features showcase
- **Key Elements:**
  - Hero section with CTA buttons
  - Features grid (4 main features)
  - "How it Works" section (3 steps)
  - FAQ accordion
  - Testimonials
  - Pricing/Features comparison
- **CTAs:**
  - "Get Started" → `/register`
  - "Try Now" → `/upload` (requires login)
  - "Login" → `/login`

#### 2. **Login Page** (`/login`)
- **Purpose:** User authentication
- **Form Fields:**
  - Email (required, email format)
  - Password (required, min 6 chars)
- **Actions:**
  - Email/Password login
  - OAuth login (Google, GitHub)
  - "Forgot Password" link → `/forgot-password`
  - "Create Account" link → `/register`
- **Success:** Redirects to `/dashboard` or intended protected page
- **Error Handling:** Display validation errors, network errors

#### 3. **Register Page** (`/register`)
- **Purpose:** New user registration
- **Form Fields:**
  - Name (required, min 3 chars)
  - Email (required, email format, unique)
  - Password (required, min 6 chars)
  - Confirm Password (must match)
- **Actions:**
  - Email/Password registration
  - OAuth signup (Google, GitHub)
  - "Already have account?" link → `/login`
- **Success:** Auto-login and redirect to `/dashboard`

#### 4. **Forgot Password** (`/forgot-password`)
- **Purpose:** Password recovery
- **Form Fields:**
  - Email (required)
- **Actions:**
  - Send reset link to email
  - Back to login link

#### 5. **Reset Password** (`/reset-password/:token`)
- **Purpose:** Set new password via email token
- **Form Fields:**
  - New Password (required, min 6 chars)
  - Confirm Password (must match)
- **Actions:**
  - Submit new password
  - Redirect to login on success

#### 6. **Contact Page** (`/contact`)
- **Purpose:** User support and inquiries
- **Form Fields:**
  - Name (required)
  - Email (required, email format)
  - Subject (required)
  - Message (required, min 10 chars)
- **Actions:**
  - Submit contact form
  - Toast notification on success/error

#### 7. **Feedback Page** (`/feedback`)
- **Purpose:** User feedback collection
- **Form Fields:**
  - Name (optional if logged in)
  - Email (optional if logged in)
  - Category (dropdown: Bug, Feature, Improvement, General)
  - Rating (1-5 stars)
  - Message (required)
- **Actions:**
  - Submit feedback
  - Toast notification

---

### **Protected Routes** (Authentication Required)

#### 8. **Dashboard** (`/dashboard`)
- **Purpose:** Resume management hub
- **Features:**
  - Display all user's saved resumes (grid/list view)
  - Resume cards showing:
    - Title/Name
    - Last modified date
    - Preview thumbnail
    - Actions: Edit, Delete, Download
  - Create new resume button → `/upload`
  - Empty state with CTA if no resumes
- **Actions:**
  - Click resume card → Load in `/editor`
  - Delete resume (with confirmation)
  - Edit resume info (inline modal)
  - Create blank resume → `/editor`
- **Data:** Fetched from `GET /api/resume/list`

#### 9. **Upload Page** (`/upload`)
- **Purpose:** Resume file upload or blank creation
- **Features:**
  - Drag-and-drop zone
  - File browser (click to upload)
  - Accepted formats: PDF, DOCX, DOC
  - Max file size: 5MB
  - "Start from Scratch" button
- **Workflow:**
  1. User drops/selects file
  2. File uploads to `POST /api/resume/upload`
  3. AI parses resume (Gemini API)
  4. Navigate to `/editor` with parsed data
- **OR:**
  1. Click "Start from Scratch"
  2. Navigate to `/editor` with blank template
- **Validation:**
  - File type check (PDF/DOCX only)
  - File size check (max 5MB)
  - Network error handling

#### 10. **Editor Page** (`/editor`)
- **Purpose:** Main resume editing interface
- **Layout:**
  - Left Panel: Form sections (collapsible)
  - Right Panel: Live preview (PDF-like)
  - Top Bar: Template selector, Save, Export
- **Sections (Editable):**
  - **Personal Info:**
    - Name, Email, Phone, Location
    - LinkedIn, GitHub, Portfolio URLs
  - **Summary/Objective:**
    - Rich text editor (TipTap)
    - AI Enhancement button
  - **Skills:**
    - Tag input (add/remove skills)
    - AI Categorization (Technical, Soft, Tools)
  - **Experience:**
    - Multiple entries (draggable to reorder)
    - Company, Role, Duration, Responsibilities
    - AI Enhancement per entry
  - **Education:**
    - Multiple entries (draggable)
    - Institution, Degree, Year, GPA
  - **Projects:**
    - Multiple entries (draggable)
    - Title, Description, Tech Stack, Links
    - AI Enhancement
  - **Certifications:**
    - Multiple entries
    - Name, Issuer, Date
  - **Achievements:**
    - Multiple entries
    - AI Segregation (Auto-categorize)
  - **Custom Sections:**
    - User-defined sections
    - Rich text content
- **Actions:**
  - **Save Resume:** `POST /api/resume/save` or `PUT /api/resume/:id`
  - **Export PDF:** Browser print (react-to-print)
  - **AI Enhance:** `POST /api/resume/enhance` (per section)
  - **Change Template:** Select from template picker
  - **Reorder Sections:** Drag & drop
- **AI Features:**
  - Enhance Summary (action verbs, metrics)
  - Enhance Experience bullets
  - Categorize Skills
  - Generate Summary from resume data
  - Segregate Achievements
- **Validation:**
  - Required fields: Name, Email
  - Email format validation
  - URL format validation
  - Auto-save indicator

#### 11. **Templates Page** (`/templates`)
- **Purpose:** Browse and preview resume templates
- **Features:**
  - Template gallery (8+ templates)
  - Template preview cards with:
    - Thumbnail image
    - Template name
    - Description
    - "Use Template" button
  - Filters: Classic, Modern, Creative, Minimal
- **Actions:**
  - Click template → Apply to current resume in editor
  - Preview template in modal

#### 12. **ATS Analyzer** (`/ats-analyzer`)
- **Purpose:** Analyze resume against job descriptions
- **Tabs:**
  - **ATS Analysis** (Gemini AI)
  - **ML Job Matching** (Python ML model)
- **ATS Analysis Tab:**
  - **Input:**
    - Job Description (textarea)
    - Resume source:
      - Upload file (PDF/DOCX)
      - OR select from saved resumes (dropdown)
  - **Output:**
    - ATS Score (0-100%)
    - Keyword match analysis
    - Section-by-section feedback
    - Improvement suggestions
    - Missing keywords
    - Formatting issues
  - **API:** `POST /api/ats/analyze-resume`
- **ML Job Matching Tab:**
  - **Input:**
    - Job Description (textarea)
    - Select saved resume (dropdown)
  - **Output:**
    - Match Score (percentage)
    - Skill Gap Analysis
    - Required vs. Present skills
    - Recommendations
  - **API:** `POST /api/ml/match-score`, `POST /api/ml/skill-gap-analysis`

#### 13. **Job Search** (`/job-search`)
- **Purpose:** Search and browse job listings
- **Features:**
  - Search bar (keywords, location)
  - Filters: Remote, Full-time, Part-time, Contract
  - Job cards with:
    - Company, Title, Location
    - Salary range
    - Posted date
    - "View Details" button
  - Pagination
- **Actions:**
  - Search jobs
  - Filter results
  - View job details
  - Apply (external link)

#### 14. **Smart Job Match** (`/smart-job-match`)
- **Purpose:** AI-powered job recommendations
- **Features:**
  - Select your resume
  - AI analyzes skills and experience
  - Displays matched jobs with:
    - Match percentage
    - Skill overlap
    - Gap analysis
    - Recommendations
- **Actions:**
  - Select resume for analysis
  - View match details
  - Apply to jobs

#### 15. **GitHub Import** (`/github-import`)
- **Purpose:** Import projects from GitHub
- **Features:**
  - Connect GitHub account (OAuth)
  - Browse repositories
  - Select repos to import as projects
  - Auto-populate project descriptions
- **Workflow:**
  1. Authenticate with GitHub
  2. Fetch repositories
  3. Select repos
  4. Import to resume projects section
- **API:** `GET /api/github/repos`, `POST /api/github/import`

---

### **Admin Routes** (Admin Role Required)

#### 16. **Admin Dashboard** (`/admin`)
- **Purpose:** Admin overview and analytics
- **Metrics:**
  - Total users
  - Total resumes
  - AI API usage
  - Recent activity
- **Charts:**
  - User growth over time
  - Resume creation trends
  - AI usage statistics

#### 17. **User Management** (`/admin/users`)
- **Purpose:** Manage user accounts
- **Features:**
  - User list (table/grid)
  - Search and filter users
  - User details (modal/sidebar)
  - Actions: View, Edit, Delete, Ban, Promote
- **Data:** User info, join date, last login, resume count

#### 18. **AI Analytics** (`/admin/ai-analytics`)
- **Purpose:** Monitor AI API usage
- **Metrics:**
  - Total API calls
  - Cost tracking
  - Usage by feature (enhance, analyze, etc.)
  - Usage by user
- **Charts:**
  - Daily/weekly/monthly usage
  - Cost breakdown

#### 19. **AI Quota Management** (`/admin/ai-quota`)
- **Purpose:** Set user AI usage limits
- **Features:**
  - Global quota settings
  - Per-user quota overrides
  - Quota alerts
- **Actions:**
  - Set daily/monthly limits
  - Grant extra quota
  - Reset quotas

#### 20. **Contact Messages** (`/admin/contacts`)
- **Purpose:** View and respond to contact form submissions
- **Features:**
  - Message list with filters (status, category)
  - Message details
  - Reply functionality
  - Mark as resolved
- **Actions:**
  - View message
  - Reply to user
  - Delete message
  - Update status

#### 21. **Feedback Management** (`/admin/feedback`)
- **Purpose:** Review user feedback
- **Features:**
  - Feedback list with filters (rating, category)
  - Feedback details
  - Analytics (average rating, category distribution)
- **Actions:**
  - View feedback
  - Mark as reviewed
  - Delete feedback

#### 22. **Admin Logs** (`/admin/logs`)
- **Purpose:** System activity logs
- **Features:**
  - Log entries (user actions, errors, API calls)
  - Filters: Date range, log level, user
  - Search functionality
- **Data:** Timestamp, user, action, IP, details

#### 23. **Template Management** (`/admin/templates`)
- **Purpose:** Manage resume templates
- **Features:**
  - Template list
  - Add new template
  - Edit template (metadata, thumbnail)
  - Delete template
  - Set featured/active status
- **Actions:**
  - Upload template files
  - Update template info
  - Toggle visibility

#### 24. **Admin Settings** (`/admin/settings`)
- **Purpose:** Application configuration
- **Features:**
  - Site settings (name, logo, etc.)
  - Email settings
  - AI settings (API keys, models)
  - Security settings
  - Feature toggles
- **Actions:**
  - Update settings
  - Test email configuration
  - Validate API keys

---

## 🔐 Authentication Flow

### **Login Process:**
1. User enters email + password on `/login`
2. Submit `POST /api/auth/login`
3. Receive JWT token + user data
4. Store token in `localStorage`
5. Set user in AuthContext
6. Redirect to `/dashboard` or intended page

### **OAuth Flow (Google/GitHub):**
1. Click "Login with Google/GitHub"
2. Redirect to OAuth provider
3. User authorizes
4. Redirect to `/auth/callback?token=...`
5. Extract token from URL
6. Store token in `localStorage`
7. Fetch user data `GET /api/auth/me`
8. Redirect to `/dashboard`

### **Protected Route Logic:**
```javascript
// If not authenticated:
- Show login modal or redirect to /login
- Store intended destination in location.state
- After login, redirect back to intended page

// If authenticated:
- Render protected component
```

### **Admin Route Logic:**
```javascript
// Check user.role === 'admin'
// If not admin: redirect to /dashboard with error toast
```

---

## 🧪 Critical User Flows to Test

### **Flow 1: Complete Resume Creation Journey**
1. **Start:** Home page (`/`)
2. Click "Get Started" → Redirect to `/register` (if not logged in)
3. Register with email/password
4. Auto-login → Redirect to `/dashboard`
5. Click "Create New Resume" → `/upload`
6. Upload PDF/DOCX file
7. AI parses resume → Navigate to `/editor` with data
8. Review parsed data in editor sections
9. Click "AI Enhance" on Summary section
10. AI improves content → Update displayed
11. Add/edit skills, experience, projects
12. Select different template from template picker
13. Preview updates in real-time on right panel
14. Click "Save Resume"
15. Toast notification "Resume saved successfully"
16. Click "Export PDF"
17. Browser prints resume as PDF
18. Navigate to `/dashboard`
19. See saved resume in list

### **Flow 2: ATS Analysis Workflow**
1. **Start:** Login and go to `/ats-analyzer`
2. Select "ATS Analysis" tab
3. Paste job description in textarea
4. Select resume from dropdown (or upload file)
5. Click "Analyze"
6. Loading indicator displays
7. Results display:
   - ATS Score (e.g., 78%)
   - Keyword matches
   - Improvement suggestions
8. Review feedback
9. Click "Go to Editor" to make improvements

### **Flow 3: Job Matching with ML**
1. **Start:** `/ats-analyzer` → "ML Job Matching" tab
2. Paste job description
3. Select resume from dropdown
4. Resume data loads automatically
5. Click "Analyze Match"
6. ML API processes (may take 2-3 seconds)
7. Results display:
   - Match Score (%)
   - Skill Gap Analysis table
   - Recommendations
8. Review gaps and suggestions

### **Flow 4: GitHub Project Import**
1. **Start:** `/github-import`
2. Click "Connect GitHub"
3. OAuth flow → Authorize app
4. Redirect back with token
5. Repository list loads
6. Select repositories (checkboxes)
7. Click "Import Selected"
8. Projects added to resume
9. Navigate to `/editor` → Projects section
10. Verify imported projects

### **Flow 5: Admin Management**
1. **Start:** Login as admin
2. Navigate to `/admin`
3. View dashboard metrics
4. Go to `/admin/users`
5. Search for user by email
6. Click user row → View details
7. Edit user role or quota
8. Save changes
9. Go to `/admin/ai-analytics`
10. View usage charts and metrics
11. Go to `/admin/contacts`
12. Read contact message
13. Reply to user
14. Mark as resolved

---

## 🎨 UI/UX Testing Checklist

### **Responsive Design:**
- [ ] Test on mobile (320px - 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] All forms are usable on mobile
- [ ] Navigation menu collapses on mobile (hamburger menu)
- [ ] Editor works on tablet/mobile

### **Dark Mode:**
- [ ] Dark mode toggle available (check header/settings)
- [ ] All pages support dark mode
- [ ] Colors have sufficient contrast
- [ ] Images/logos adapt to dark mode

### **Accessibility:**
- [ ] All forms have labels
- [ ] Error messages are announced
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on images

### **Performance:**
- [ ] Initial page load < 3 seconds
- [ ] Resume list loads quickly
- [ ] Editor real-time preview is smooth
- [ ] AI API calls show loading states
- [ ] No UI freezing during operations

### **Error Handling:**
- [ ] Network errors show toast notifications
- [ ] Form validation errors display inline
- [ ] API errors show user-friendly messages
- [ ] 404 page for invalid routes
- [ ] Graceful degradation if AI API fails

---

## 🔧 API Endpoints Reference

### **Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth
- `GET /api/auth/callback` - OAuth callback

### **Resume:**
- `POST /api/resume/upload` - Upload resume file
- `POST /api/resume/save` - Save new resume
- `PUT /api/resume/:id` - Update resume
- `GET /api/resume/list` - List user's resumes
- `GET /api/resume/:id` - Get resume by ID
- `DELETE /api/resume/:id` - Delete resume
- `POST /api/resume/enhance` - AI enhance content
- `POST /api/resume/generate-summary` - Generate summary
- `POST /api/resume/categorize-skills` - Categorize skills
- `POST /api/resume/segregate-achievements` - Segregate achievements

### **ATS Analysis:**
- `POST /api/ats/analyze-resume` - Analyze resume vs job description

### **ML Job Matching:**
- `POST /api/ml/match-score` - Calculate match score
- `POST /api/ml/skill-gap-analysis` - Analyze skill gaps
- `POST /api/ml/quick-match` - Quick skill match

### **Contact & Feedback:**
- `POST /api/contact` - Submit contact form
- `POST /api/feedback` - Submit feedback

### **GitHub:**
- `GET /api/github/repos` - List user's repos
- `POST /api/github/import` - Import repos as projects

### **Admin:**
- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/contacts` - Get contact messages
- `GET /api/admin/feedback` - Get feedback submissions
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

---

## 🧩 Key Components to Test

### **Forms:**
- Login form validation
- Registration form validation
- Resume editor forms (all sections)
- Contact form validation
- Feedback form validation
- Admin forms

### **Interactive Elements:**
- Drag & drop file upload
- Drag & drop section reordering (in editor)
- Template picker/selector
- Skill tag input (add/remove)
- Rich text editor (TipTap)
- Dropdown menus
- Modal dialogs
- Toast notifications
- Accordion/collapsible sections

### **Data Display:**
- Resume list/grid (Dashboard)
- Resume preview (Editor right panel)
- Analytics charts (Admin)
- Job cards (Job Search)
- User table (Admin Users)

### **Navigation:**
- Main navigation menu
- Protected route redirects
- Breadcrumbs (if present)
- Back buttons
- Pagination

---

## 🚨 Edge Cases & Error Scenarios

### **File Upload:**
- [ ] Upload file > 5MB (should reject)
- [ ] Upload non-PDF/DOCX file (should reject)
- [ ] Upload corrupted file
- [ ] Network error during upload
- [ ] Upload while offline

### **AI API:**
- [ ] AI enhancement fails (timeout, API error)
- [ ] Empty content sent to AI
- [ ] Very large content (>10k chars)
- [ ] API rate limit exceeded
- [ ] Invalid AI response format

### **Authentication:**
- [ ] Login with wrong password
- [ ] Login with non-existent email
- [ ] Register with existing email
- [ ] Token expired (try accessing protected route)
- [ ] Invalid token in localStorage
- [ ] OAuth flow canceled/failed

### **Resume Data:**
- [ ] Save resume with missing required fields
- [ ] Load non-existent resume ID
- [ ] Delete resume that's being edited
- [ ] Concurrent edits (2 tabs)
- [ ] Very long text in fields

### **Navigation:**
- [ ] Direct URL access to protected routes (not logged in)
- [ ] Direct URL access to admin routes (non-admin user)
- [ ] Browser back/forward during editing (unsaved changes)
- [ ] Refresh page during file upload

---

## 📊 Test Data Examples

### **Test User Credentials:**
```json
{
  "regular_user": {
    "email": "testuser@example.com",
    "password": "Test123456",
    "name": "Test User"
  },
  "admin_user": {
    "email": "admin@example.com",
    "password": "Admin123456",
    "name": "Admin User"
  }
}
```

### **Sample Job Description:**
```
We are seeking a Senior Full-Stack Developer with 5+ years of experience.

Required Skills:
- React, Node.js, MongoDB, Express
- RESTful API development
- AWS/Azure cloud services
- Git version control
- Agile/Scrum methodologies

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Mentor junior developers

Qualifications:
- Bachelor's degree in Computer Science
- Strong problem-solving skills
- Excellent communication
```

### **Sample Resume Data (JSON):**
```json
{
  "name": "John Doe",
  "contact": {
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "location": "San Francisco, CA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe"
  },
  "summary": "Experienced Full-Stack Developer with 6 years of expertise in React, Node.js, and MongoDB.",
  "skills": ["React", "Node.js", "MongoDB", "Express", "AWS", "Docker", "Git"],
  "experience": [
    {
      "company": "Tech Corp",
      "role": "Senior Developer",
      "duration": "2020 - Present",
      "responsibilities": [
        "Led development of microservices architecture",
        "Improved application performance by 40%",
        "Mentored team of 5 junior developers"
      ]
    }
  ],
  "education": [
    {
      "institution": "University of Technology",
      "degree": "B.S. Computer Science",
      "year": "2018",
      "gpa": "3.8"
    }
  ],
  "projects": [
    {
      "title": "E-commerce Platform",
      "description": "Built full-stack e-commerce site with React and Node.js",
      "techStack": ["React", "Node.js", "MongoDB", "Stripe"],
      "link": "https://github.com/johndoe/ecommerce"
    }
  ]
}
```

---

## 🛠️ Test Environment Setup

### **Prerequisites:**
1. **Backend running** on `http://localhost:5000`
2. **Frontend running** on `http://localhost:5173`
3. **MongoDB** connected
4. **Environment variables** set:
   - `VITE_API_URL=http://localhost:5000/api`
   - Backend `.env` with Gemini API key, MongoDB URI, etc.

### **Database State:**
- At least 1 test user registered
- At least 1 admin user (role: 'admin')
- Sample resumes saved for testing
- Templates seeded in database

### **Before Running Tests:**
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev

# Terminal 3: Verify services
curl http://localhost:5000/api/health  # Should return 200 OK
curl http://localhost:5173  # Should return HTML
```

---

## 📝 Test Execution Notes

### **Login Requirement:**
Many features require authentication. TestSprite should:
1. Test public pages first (Home, Login, Register, Contact)
2. Perform login flow
3. Store authentication state (localStorage token)
4. Test protected features
5. Test logout and re-login

### **AI Features:**
AI enhancement and analysis may take 3-10 seconds. Tests should:
- Wait for loading states to complete
- Check for success/error toast notifications
- Verify updated content after AI processing

### **File Operations:**
Upload tests should prepare sample files:
- `sample-resume.pdf` (valid PDF resume)
- `sample-resume.docx` (valid DOCX resume)
- `invalid-file.txt` (for negative testing)
- `large-file.pdf` (> 5MB for rejection testing)

### **Network Conditions:**
Consider testing under:
- Normal latency
- Slow network (3G simulation)
- Offline mode
- Intermittent connectivity

---

## ✅ Success Criteria

### **Core Functionality:**
- [ ] Users can register and login successfully
- [ ] Users can upload and parse resumes
- [ ] Editor displays parsed data correctly
- [ ] AI enhancement works (summary, skills, experience)
- [ ] Resumes can be saved and loaded
- [ ] PDF export generates valid resume
- [ ] ATS analysis provides score and feedback
- [ ] Templates can be selected and applied

### **User Experience:**
- [ ] All forms validate input correctly
- [ ] Error messages are clear and helpful
- [ ] Loading states indicate progress
- [ ] Success actions show confirmation
- [ ] Navigation is intuitive
- [ ] Responsive on all screen sizes

### **Security & Performance:**
- [ ] Protected routes block unauthorized access
- [ ] Admin routes require admin role
- [ ] JWT tokens expire and refresh properly
- [ ] No sensitive data in client-side code
- [ ] API calls complete within reasonable time
- [ ] No memory leaks or performance degradation

---

## 🐛 Known Issues & Limitations

1. **AI API Rate Limits:** Gemini API has rate limits; excessive testing may hit quotas
2. **File Size:** Large resumes (>5MB) are rejected by design
3. **Browser Compatibility:** Optimized for modern browsers (Chrome, Firefox, Safari, Edge)
4. **Mobile Editing:** Complex editor features may have limited mobile UX
5. **Offline Mode:** Application requires internet for AI features and data sync

---

## 📞 Support & Documentation

- **Project README:** `/README.md`
- **Deployment Guide:** `/docs/DEPLOYMENT_GUIDE.md`
- **Testing Guide:** `/docs/TESTING_GUIDE.md`
- **API Documentation:** Backend `/server/README.md`
- **Contributing:** `/docs/CONTRIBUTING.md`

---

## 🚀 TestSprite Configuration Summary

```json
{
  "projectPath": "/Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR",
  "type": "frontend",
  "localPort": 5173,
  "pathname": "/",
  "testScope": "codebase",
  "framework": "React + Vite",
  "authRequired": true,
  "keyFeatures": [
    "User Authentication (JWT + OAuth)",
    "Resume Upload & AI Parsing",
    "Rich Text Editor with AI Enhancement",
    "ATS Resume Analysis",
    "ML Job Matching",
    "Template Selection",
    "PDF Export",
    "Dashboard & Management",
    "Admin Panel"
  ],
  "criticalFlows": [
    "Registration → Upload → Edit → Save → Export",
    "Login → Dashboard → Load Resume → Edit → Update",
    "Upload → ATS Analysis → Improve → Re-analyze",
    "GitHub Import → Add to Resume",
    "Admin Login → User Management → Analytics"
  ]
}
```

---

**Last Updated:** November 11, 2025  
**Document Version:** 1.0.0  
**Prepared for:** TestSprite E2E Frontend Testing
