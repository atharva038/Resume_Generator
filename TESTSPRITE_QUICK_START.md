# TestSprite Quick Start Guide
## SmartNShine ATS Resume Builder Testing

> **Quick reference for running TestSprite tests on this project**

---

## 🚀 Quick Setup (60 seconds)

### 1. **Start Backend Server**
```bash
cd server
npm install
# Create .env file with required variables (see .env.example)
npm run dev
# Server should run on http://localhost:5000
```

### 2. **Start Frontend Application**
```bash
cd client
npm install
npm run dev
# App should run on http://localhost:5173
```

### 3. **Verify Services**
```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend
open http://localhost:5173
```

---

## 🧪 TestSprite Configuration

### **Basic Configuration:**
```javascript
{
  "projectPath": "/Users/atharva_beast/Desktop/Coading/Full-Stack-Web/ATS_RESUME_GENERATOR",
  "type": "frontend",
  "localPort": 5173,
  "pathname": "/",
  "testScope": "codebase",
  "needLogin": true
}
```

### **Test Execution Command:**
```bash
# From project root
testsprite test --config testsprite.config.json
```

---

## 📋 Pre-Test Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Environment variables configured:
  - `GEMINI_API_KEY` (backend)
  - `MONGODB_URI` (backend)
  - `JWT_SECRET` (backend)
  - `VITE_API_URL=http://localhost:5000/api` (frontend)
- [ ] Test user created in database
- [ ] Test admin user created (optional for admin tests)

---

## 🎯 High-Priority Test Scenarios

### **P0 - Critical Flows:**

1. **User Registration & Login**
   - Path: `/` → `/register` → `/dashboard`
   - Expected: User can register and access dashboard

2. **Resume Upload & Parse**
   - Path: `/upload` → Select file → `/editor`
   - Expected: Resume parsed and displayed in editor

3. **Resume Editing & Save**
   - Path: `/editor` → Edit fields → Click "Save"
   - Expected: Resume saved successfully

4. **AI Enhancement**
   - Path: `/editor` → Click "AI Enhance" on summary
   - Expected: Content improved with AI suggestions

5. **ATS Analysis**
   - Path: `/ats-analyzer` → Paste job description → Analyze
   - Expected: ATS score and feedback displayed

### **P1 - Important Flows:**

6. **Template Selection**
   - Path: `/editor` → Select template
   - Expected: Resume preview updates with new template

7. **PDF Export**
   - Path: `/editor` → Click "Export PDF"
   - Expected: PDF download initiated

8. **Dashboard Management**
   - Path: `/dashboard` → View/Edit/Delete resumes
   - Expected: All CRUD operations work

9. **GitHub Import**
   - Path: `/github-import` → Connect → Import repos
   - Expected: Projects imported to resume

10. **Job Matching (ML)**
    - Path: `/ats-analyzer` → ML tab → Analyze
    - Expected: Match score and skill gaps shown

---

## 🔑 Test Credentials

### **Regular User:**
```
Email: testuser@example.com
Password: Test123456
```

### **Admin User:**
```
Email: admin@example.com
Password: Admin123456
```

**Note:** Create these users before testing or have TestSprite handle registration.

---

## 📁 Test Files Location

Place test files in: `/tests/fixtures/`

### **Required Files:**
- `sample-resume.pdf` - Valid PDF resume (< 5MB)
- `sample-resume.docx` - Valid DOCX resume (< 5MB)
- `sample-job-description.txt` - Job description for ATS testing
- `invalid-file.txt` - For negative testing (wrong format)
- `large-file.pdf` - File > 5MB for size limit testing

---

## 🧩 Key Features to Test

### ✅ **Must Test:**
- [ ] User registration/login
- [ ] Resume upload (PDF/DOCX)
- [ ] Resume parsing (AI extraction)
- [ ] Resume editing (all sections)
- [ ] Resume save/load
- [ ] AI content enhancement
- [ ] ATS analysis with job description
- [ ] Template selection
- [ ] PDF export

### 🔍 **Should Test:**
- [ ] Dark mode toggle
- [ ] Mobile responsiveness
- [ ] Error handling (network errors, validation)
- [ ] Form validations
- [ ] Protected route access
- [ ] OAuth login (Google/GitHub)
- [ ] Dashboard CRUD operations
- [ ] Skill categorization (AI)
- [ ] Achievement segregation (AI)
- [ ] ML job matching

### 💡 **Nice to Have:**
- [ ] Admin panel access
- [ ] Contact form submission
- [ ] Feedback form submission
- [ ] GitHub project import
- [ ] Job search functionality
- [ ] Drag & drop reordering
- [ ] Rich text editor functionality
- [ ] Performance under load

---

## 🐛 Common Issues & Solutions

### **Issue: Backend not responding**
```bash
# Check if MongoDB is running
mongosh

# Check if backend server started
cd server && npm run dev

# Check environment variables
cat server/.env
```

### **Issue: Frontend shows CORS errors**
```javascript
// Check backend CORS settings in server/server.js
// Should allow http://localhost:5173
```

### **Issue: AI features not working**
```bash
# Verify Gemini API key is set
echo $GEMINI_API_KEY

# Check backend logs for API errors
```

### **Issue: File upload fails**
```bash
# Check file size (must be < 5MB)
# Check file format (PDF/DOCX only)
# Verify multer configuration in server/config/multer.config.js
```

### **Issue: Tests can't login**
```bash
# Create test user manually
cd server
npm run create-admin  # For admin user
# Or register via UI first
```

---

## 📊 Test Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| **User Flows** | 100% of critical flows |
| **UI Components** | 80%+ interaction coverage |
| **API Endpoints** | 90%+ endpoint coverage |
| **Error Scenarios** | 70%+ edge case coverage |
| **Responsive Design** | Test 3 breakpoints (mobile, tablet, desktop) |

---

## 🔄 Test Execution Order

**Recommended sequence:**

1. **Public Pages** (no auth required)
   - Home, Login, Register, Contact, Feedback

2. **Authentication Flow**
   - Register → Login → Logout → Login again

3. **Core Features** (authenticated)
   - Upload → Edit → Save → Export

4. **AI Features**
   - AI Enhancement, ATS Analysis, ML Matching

5. **Management Features**
   - Dashboard, Templates, GitHub Import

6. **Admin Features** (if admin user available)
   - Admin Dashboard, User Management, Analytics

---

## 📝 Test Reporting

### **Expected Outputs:**
- Test execution summary (pass/fail counts)
- Screenshots of key pages
- Error logs and stack traces
- Performance metrics (page load times, API response times)
- Coverage report

### **Report Location:**
- Console output
- `testsprite-report.html` (if generated)
- `test-results/` directory

---

## 🚦 Success Indicators

### ✅ **Tests Passing If:**
- All critical user flows complete successfully
- Forms validate correctly
- API responses are correct
- UI renders without errors
- No console errors in browser
- Authentication persists across page reloads
- File uploads process correctly
- AI features return valid results

### ❌ **Tests Failing If:**
- Any P0 scenario fails
- Forms accept invalid data
- API returns 500 errors
- UI breaks on mobile/tablet
- Authentication state lost
- File uploads rejected incorrectly
- AI features timeout or error

---

## 🔧 Troubleshooting Commands

```bash
# Check running processes
lsof -i :5000  # Backend
lsof -i :5173  # Frontend

# View backend logs
cd server && npm run dev

# View frontend logs
cd client && npm run dev

# Check MongoDB connection
mongosh mongodb://localhost:27017/smartnshine

# Test API directly
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'

# Clear localStorage (if auth issues)
# Open browser console and run:
localStorage.clear()
```

---

## 📚 Additional Resources

- **Full Frontend Spec:** `TESTSPRITE_FRONTEND_SPEC.md`
- **Project README:** `README.md`
- **API Documentation:** `server/README.md`
- **Deployment Guide:** `docs/DEPLOYMENT_GUIDE.md`
- **Testing Guide:** `docs/TESTING_GUIDE.md`

---

## 💬 Need Help?

1. Check full specification: `TESTSPRITE_FRONTEND_SPEC.md`
2. Review project documentation in `/docs`
3. Check existing tests in `/tests`
4. Review server logs for API errors
5. Check browser console for frontend errors

---

**Quick Start Time:** ~5 minutes  
**Full Test Suite Time:** ~30-60 minutes  
**Priority Tests Time:** ~15 minutes

---

Last Updated: November 11, 2025
