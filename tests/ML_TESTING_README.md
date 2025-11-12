# 🧪 ML Job Matching - Backend Testing Guide

This directory contains comprehensive test data and scripts for testing the ML Job Matching API.

---

## 📁 Files Overview

### 1. **sample-resume-data.json**
Contains 5 realistic resume profiles:
- ✅ **fullStackDeveloper** - Senior developer with React, Node.js, AWS (high match)
- ✅ **frontendDeveloper** - React specialist with UI/UX focus
- ✅ **backendDeveloper** - Node.js/Python backend engineer with microservices
- ✅ **dataScientist** - ML/Python data scientist
- ✅ **juniorDeveloper** - Recent graduate with basic skills

### 2. **sample-job-descriptions.json**
Contains 7 job descriptions for testing:
- ✅ **fullStackSenior** - Senior full-stack role (matches fullStackDeveloper)
- ✅ **frontendReact** - React frontend role (matches frontendDeveloper)
- ✅ **backendNodeJs** - Backend Node.js role (matches backendDeveloper)
- ✅ **mlEngineer** - ML engineer role (matches dataScientist)
- ✅ **dataScientist** - Data science role
- ✅ **juniorFullStack** - Entry-level position (matches juniorDeveloper)
- ✅ **devOpsMismatch** - DevOps role (tests low match scenario)

### 3. **test-ml-api.sh**
Bash script with 8 automated cURL tests covering:
- ✅ High match scenarios
- ✅ Good match scenarios
- ✅ Low match scenarios
- ✅ Skill gap analysis
- ✅ Quick match (public endpoint)
- ✅ Error handling (missing data, validation)

### 4. **test-ml-api.js**
Node.js test script with axios for:
- ✅ Automated API testing
- ✅ Pass/fail assertions
- ✅ Test summary reporting
- ✅ Multiple test scenarios

---

## 🚀 Quick Start

### Option 1: Using cURL (Bash Script)

```bash
# 1. Make script executable
chmod +x tests/test-ml-api.sh

# 2. Get your JWT token (login to the app first)
# Check browser DevTools > Network > auth/login response

# 3. Edit the script and replace AUTH_TOKEN
nano tests/test-ml-api.sh
# Change: AUTH_TOKEN="YOUR_JWT_TOKEN_HERE"
# To: AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 4. Run the tests
./tests/test-ml-api.sh
```

### Option 2: Using Node.js Script

```bash
# 1. Install dependencies (if not already installed)
npm install axios

# 2. Get your JWT token (same as above)

# 3. Edit the script
nano tests/test-ml-api.js
# Update AUTH_TOKEN variable

# 4. Run tests
node tests/test-ml-api.js
```

### Option 3: Using Postman

1. Import `sample-resume-data.json` for request bodies
2. Import `sample-job-descriptions.json` for job descriptions
3. Create requests manually:

**Example: Match Score Request**
```http
POST http://localhost:5000/api/ml/match-score
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "resumeData": { /* Copy from sample-resume-data.json */ },
  "jobDescription": "Your job description here..."
}
```

---

## 🎯 Test Scenarios

### Scenario 1: Perfect Match (85-95% expected)
- **Resume**: fullStackDeveloper
- **Job**: fullStackSenior
- **Expected**: High match, minimal skill gaps, positive assessment

### Scenario 2: Good Match (70-85% expected)
- **Resume**: frontendDeveloper
- **Job**: frontendReact
- **Expected**: Good match, some missing skills

### Scenario 3: Fair Match (50-70% expected)
- **Resume**: juniorDeveloper
- **Job**: juniorFullStack
- **Expected**: Moderate match, several skill gaps, learning suggestions

### Scenario 4: Low Match (20-40% expected)
- **Resume**: backendDeveloper
- **Job**: devOpsMismatch
- **Expected**: Low match, many missing skills (DevOps tools)

### Scenario 5: Skill Gap Analysis
- **Resume**: Any developer with basic skills
- **Job**: Advanced role with many requirements
- **Expected**: Detailed skill gap breakdown with learning recommendations

---

## 📊 Expected API Responses

### Success Response (Match Score)
```json
{
  "success": true,
  "data": {
    "matchPercentage": 87,
    "matchedSkills": ["React.js", "Node.js", "MongoDB", "Docker", "AWS"],
    "missingSkills": ["Kubernetes", "GraphQL", "TypeScript"],
    "matchedExperience": ["Full-Stack Development", "Microservices"],
    "strengths": [
      "Strong full-stack experience with React and Node.js",
      "Cloud deployment experience with AWS"
    ],
    "weaknesses": [
      "Limited container orchestration knowledge",
      "No GraphQL API experience mentioned"
    ],
    "suggestions": [
      "Add Kubernetes projects to demonstrate container orchestration skills",
      "Build a GraphQL API project to show modern API design knowledge",
      "Include TypeScript in tech stack for type-safe development"
    ],
    "assessment": "Strong candidate overall with solid fundamentals..."
  }
}
```

### Error Response (Validation)
```json
{
  "success": false,
  "error": "Job description must be at least 50 characters long"
}
```

---

## 🔧 How to Get JWT Token

### Method 1: Browser DevTools
1. Open app in browser: `http://localhost:5173`
2. Open DevTools (F12)
3. Go to **Network** tab
4. Login to your account
5. Find the **auth/login** request
6. Check **Response** tab for `token` field
7. Copy the token value

### Method 2: Using cURL
```bash
# Login request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'

# Response will contain: {"token": "eyJhbGc..."}
```

### Method 3: Check localStorage
1. Open browser console (F12)
2. Type: `localStorage.getItem('token')`
3. Copy the returned token

---

## 📝 Manual Testing Steps

### Test 1: High Match Scenario
```bash
curl -X POST http://localhost:5000/api/ml/match-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "resumeData": {
      "skills": ["React.js", "Node.js", "MongoDB", "Docker", "AWS"],
      "experience": [{"role": "Full-Stack Developer", "responsibilities": ["Built React apps", "Deployed to AWS"]}]
    },
    "jobDescription": "Need Full-Stack Developer with React, Node.js, MongoDB, Docker, AWS. Build scalable apps and deploy to cloud."
  }'
```

**Expected**: 80-95% match

### Test 2: Skill Gap Analysis
```bash
curl -X POST http://localhost:5000/api/ml/skill-gap-analysis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "resumeData": {
      "skills": ["JavaScript", "React.js", "HTML", "CSS"]
    },
    "jobDescription": "Senior role requiring React, TypeScript, Docker, Kubernetes, AWS, GraphQL, Microservices, CI/CD pipelines."
  }'
```

**Expected**: Multiple skill gaps identified with learning recommendations

### Test 3: Quick Match (No Auth)
```bash
curl -X POST http://localhost:5000/api/ml/quick-match \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["React", "Node.js", "Python"],
    "jobDescription": "Looking for developer with React, Node.js, TypeScript, and AWS experience."
  }'
```

**Expected**: Keyword-based match percentage

---

## ✅ Validation Checklist

Before testing, ensure:
- [x] Backend server is running (`npm start` in `server/` folder)
- [x] MongoDB is connected
- [x] Gemini API key is configured in `.env`
- [x] You have a valid JWT token
- [x] Port 5000 is accessible

During testing, verify:
- [x] Response times are reasonable (5-15 seconds for AI calls)
- [x] Match percentages make sense (0-100%)
- [x] Matched skills appear in both resume and job
- [x] Missing skills appear only in job description
- [x] Suggestions are actionable and relevant
- [x] Error messages are clear and helpful

---

## 🐛 Troubleshooting

### Issue: "401 Unauthorized"
**Solution**: Check if JWT token is valid and not expired. Get a fresh token.

### Issue: "Failed to calculate match score"
**Possible causes**:
- Gemini API key not configured
- API quota exceeded
- Network issues
- Invalid resume data format

**Solution**: 
- Check `server/.env` has `GEMINI_API_KEY`
- Check server logs for detailed error
- Verify resume data structure matches expected format

### Issue: "Job description must be at least 50 characters"
**Solution**: Ensure job description is meaningful (50+ characters)

### Issue: Very low match percentages
**Expected behavior**: If resume and job are very different, low scores are correct
**Check**: Verify resume has relevant skills and experience for the job

---

## 📈 Performance Benchmarks

Expected response times:
- **Quick Match**: < 100ms (keyword matching, no AI)
- **Match Score (AI)**: 5-15 seconds (Gemini API call)
- **Skill Gap Analysis**: 5-15 seconds (Gemini API call)

If responses are slower:
- Check internet connection
- Check Gemini API status
- Verify server resources

---

## 🎓 Best Practices

1. **Use realistic data**: Test with actual resume content and real job postings
2. **Test edge cases**: Empty skills, very long descriptions, special characters
3. **Verify AI quality**: Check if suggestions are actually helpful
4. **Monitor tokens**: Track AI token usage to manage costs
5. **Test errors**: Ensure error messages are user-friendly

---

## 📚 Additional Resources

- [Gemini AI Documentation](https://ai.google.dev/docs)
- [API Testing Best Practices](https://www.postman.com/api-testing-best-practices/)
- [JWT Token Guide](https://jwt.io/introduction)

---

## 🎉 Happy Testing!

For questions or issues, check:
- Server logs (`terminal running npm start`)
- Browser console (F12)
- `docs/TESTING_ML_JOB_MATCHING.md` for frontend testing

**Remember**: The ML matching uses AI, so results may vary slightly between runs!
