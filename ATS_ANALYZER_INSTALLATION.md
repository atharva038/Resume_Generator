# ATS Job Match & Resume Scoring Feature - Installation Guide

## 📦 Required NPM Packages

### Backend Dependencies

Run these commands in the **`server`** directory:

```bash
cd server

# PDF parsing
npm install pdf-parse

# DOCX parsing  
npm install mammoth

# Already installed (verify):
# - multer (file uploads)
# - express
# - @google/generative-ai
```

### Frontend Dependencies

All required packages are already installed:
- ✅ lucide-react (icons)
- ✅ react-router-dom (routing)
- ✅ axios (API calls)

## 🚀 Installation Commands

```bash
# Navigate to server directory
cd server

# Install PDF and DOCX parsers
npm install pdf-parse mammoth

# Restart backend server
npm run dev
```

## 📁 Files Created

### Frontend
- ✅ `client/src/pages/ATSAnalyzer.jsx` - Main ATS analyzer page
- ✅ Updated `client/src/App.jsx` - Added /ats-analyzer route
- ✅ Updated `client/src/services/api.js` - Added analyzeResume API method
- ✅ Updated `client/src/components/Navbar.jsx` - Added ATS Analyzer link

### Backend
- ✅ `server/controllers/ats.controller.js` - ATS analysis controller
- ✅ `server/routes/ats.routes.js` - ATS routes
- ✅ Updated `server/services/gemini.service.js` - Added analyzeResumeJobMatch function
- ✅ Updated `server/server.js` - Added /api/ats routes

## 🎯 Feature Access

Once installed, users can access the feature at:
```
http://localhost:5173/ats-analyzer
```

Or click **"ATS Analyzer"** in the navigation bar.

## 🧪 Testing

1. Navigate to `/ats-analyzer`
2. Paste a job description
3. Select an existing resume OR upload a PDF/DOCX file
4. Click "Analyze Job Match"
5. View the analysis results with:
   - Match score (0-100%)
   - Missing keywords
   - Present keywords
   - Strengths
   - AI improvement tips

## 🔧 Troubleshooting

### Issue: "pdf-parse not found"
```bash
cd server
npm install pdf-parse
```

### Issue: "mammoth not found"
```bash
cd server
npm install mammoth
```

### Issue: "Module not found: analyzeResumeJobMatch"
- Make sure `server/services/gemini.service.js` exports the function
- Restart the backend server

### Issue: "Unsupported file format"
- Only PDF and DOCX files are supported
- Check file MIME type

## 📊 API Endpoint

### POST /api/ats/analyze-resume

**Request (multipart/form-data):**
```javascript
{
  jobDescription: string (required),
  resumeFile: File (PDF/DOCX) (optional if resumeId provided),
  resumeId: string (optional if resumeFile provided)
}
```

**Response:**
```json
{
  "match_score": 85,
  "eligible": true,
  "missing_keywords": ["Docker", "Kubernetes"],
  "present_keywords": ["Python", "React", "AWS"],
  "strengths": [
    "Has 5+ years of full-stack development",
    "Strong leadership background"
  ],
  "improvements": [
    "Add quantifiable metrics to projects",
    "Include missing keywords in skills section"
  ]
}
```

## 🎨 Features

✅ **Upload resume** (PDF/DOCX) or **select from saved resumes**
✅ **Paste job description** for analysis
✅ **AI-powered matching** using Gemini 2.5 Flash
✅ **Match score** (0-100%) with color coding
✅ **Keyword analysis** (missing vs present)
✅ **Strengths identification**
✅ **Actionable improvement tips**
✅ **Eligibility determination** (ATS pass/fail)
✅ **Responsive design** with smooth animations
✅ **Dark mode support**

## 🔐 Authentication

This feature requires user authentication. Users must be logged in to:
- Access the `/ats-analyzer` page
- Upload resumes
- View saved resumes
- Get analysis results

## 🌟 Next Steps

After installation, consider adding:
- [ ] Export analysis results as PDF
- [ ] Save analysis history
- [ ] Compare multiple resumes against same job
- [ ] Batch analysis for multiple jobs
- [ ] Email analysis reports
- [ ] Resume optimization suggestions integration with Editor

---

**Status**: ✅ Ready for testing
**Installation Time**: ~2 minutes
**Dependencies**: 2 new packages (pdf-parse, mammoth)
