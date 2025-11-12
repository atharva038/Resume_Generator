# 🚀 Quick Reference: Testing ML Job Matching API

## ⚡ Copy-Paste Ready Commands

### 1️⃣ Get JWT Token
```bash
# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "YOUR_EMAIL", "password": "YOUR_PASSWORD"}' | jq -r '.token'
```

### 2️⃣ Test Match Score (Full-Stack - High Match)
```bash
TOKEN="YOUR_JWT_TOKEN_HERE"

curl -X POST http://localhost:5000/api/ml/match-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resumeData": {
      "personalInfo": {"name": "John Doe", "email": "john@example.com"},
      "skills": ["React.js", "Node.js", "JavaScript", "TypeScript", "Express.js", "MongoDB", "PostgreSQL", "Docker", "AWS", "Git"],
      "experience": [{
        "role": "Senior Full-Stack Developer",
        "company": "Tech Co",
        "responsibilities": ["Built React apps", "Deployed to AWS", "Led microservices architecture"]
      }]
    },
    "jobDescription": "Senior Full-Stack Developer needed. Required: React.js, Node.js, MongoDB, PostgreSQL, Docker, AWS, TypeScript, Microservices. Build scalable web applications, design APIs, deploy to cloud, mentor team."
  }' | jq .
```

**Expected**: 85-95% match ✅

---

### 3️⃣ Test Skill Gap Analysis
```bash
curl -X POST http://localhost:5000/api/ml/skill-gap-analysis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resumeData": {
      "skills": ["React.js", "Node.js", "JavaScript", "MongoDB"],
      "experience": [{"role": "Developer", "responsibilities": ["Built web apps"]}]
    },
    "jobDescription": "Senior developer needed with React, Node.js, TypeScript, Docker, Kubernetes, AWS, GraphQL, Microservices, CI/CD pipelines."
  }' | jq .
```

**Expected**: Identifies gaps (TypeScript, Docker, K8s, AWS, GraphQL, CI/CD) 📊

---

### 4️⃣ Test Quick Match (No Auth)
```bash
curl -X POST http://localhost:5000/api/ml/quick-match \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["React.js", "Node.js", "TypeScript", "Docker", "AWS"],
    "jobDescription": "Looking for developer with React, Node.js, TypeScript, Docker, Kubernetes, AWS, GraphQL"
  }' | jq .
```

**Expected**: Keyword match ~71% (5 out of 7 skills) ⚡

---

### 5️⃣ Test Low Match Scenario
```bash
curl -X POST http://localhost:5000/api/ml/match-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "resumeData": {
      "skills": ["HTML", "CSS", "jQuery", "Bootstrap"],
      "experience": [{"role": "Junior Web Designer", "responsibilities": ["Created websites"]}]
    },
    "jobDescription": "Senior DevOps Engineer. Required: Kubernetes, Terraform, AWS, Docker, Jenkins, Linux, Bash, Python, Ansible, Prometheus, Grafana. Manage cloud infrastructure."
  }' | jq .
```

**Expected**: 10-30% match ❌

---

## 📋 Resume Data Templates

### Template 1: Full-Stack Developer
```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "summary": "Full-Stack Developer with 5 years experience",
  "skills": [
    "React.js", "Node.js", "JavaScript", "TypeScript",
    "MongoDB", "PostgreSQL", "Docker", "AWS", "Git"
  ],
  "experience": [{
    "role": "Full-Stack Developer",
    "company": "Tech Corp",
    "responsibilities": [
      "Built React applications",
      "Designed REST APIs",
      "Deployed to AWS"
    ]
  }]
}
```

### Template 2: Frontend Developer
```json
{
  "skills": [
    "React.js", "JavaScript", "TypeScript", "HTML5", "CSS3",
    "Tailwind CSS", "Responsive Design", "Git"
  ],
  "experience": [{
    "role": "Frontend Developer",
    "responsibilities": [
      "Built responsive UIs",
      "Optimized performance",
      "Implemented designs"
    ]
  }]
}
```

### Template 3: Backend Developer
```json
{
  "skills": [
    "Node.js", "Python", "Express.js", "PostgreSQL",
    "MongoDB", "Redis", "Docker", "GraphQL"
  ],
  "experience": [{
    "role": "Backend Engineer",
    "responsibilities": [
      "Designed microservices",
      "Built GraphQL APIs",
      "Optimized databases"
    ]
  }]
}
```

---

## 🎯 Job Description Templates

### Job 1: Senior Full-Stack
```
Senior Full-Stack Developer needed with 5+ years experience.

Required: React.js, Node.js, TypeScript, MongoDB, PostgreSQL, 
Docker, AWS, Microservices, CI/CD, Git

Responsibilities: Build scalable web apps, design APIs, 
deploy to cloud, mentor team, code reviews

Nice to have: Kubernetes, GraphQL, Redis, Next.js
```

### Job 2: Frontend React
```
React Developer with 3+ years experience needed.

Required: React.js, TypeScript, HTML5, CSS3, Tailwind CSS,
Responsive design, Git, Webpack

Responsibilities: Build reusable components, implement designs,
optimize performance, ensure accessibility

Nice to have: Next.js, Redux, Testing (Jest, Cypress)
```

### Job 3: Backend Node.js
```
Backend Engineer position requiring Node.js expertise.

Required: Node.js, Express.js, PostgreSQL, MongoDB, Redis,
Docker, GraphQL, Microservices, AWS

Responsibilities: Design APIs, build microservices,
optimize databases, deploy to cloud

Nice to have: Python, Kubernetes, Kafka, Elasticsearch
```

---

## 🧪 Run All Tests

### Option 1: Bash Script
```bash
# Set your token
export AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Edit script to use env variable
sed -i '' "s/YOUR_JWT_TOKEN_HERE/$AUTH_TOKEN/" tests/test-ml-api.sh

# Run all tests
./tests/test-ml-api.sh
```

### Option 2: Node.js Script
```bash
# Install axios if needed
npm install axios

# Set token in script
nano tests/test-ml-api.js  # Update AUTH_TOKEN

# Run tests
node tests/test-ml-api.js
```

---

## 📊 Expected Match Scores

| Resume | Job | Expected Match | Reason |
|--------|-----|----------------|---------|
| Full-Stack (5yr) | Senior Full-Stack | 85-95% | Perfect skill alignment |
| Frontend (4yr) | React Frontend | 75-85% | Good match, some gaps |
| Backend (6yr) | Node.js Backend | 80-90% | Strong backend match |
| Junior (0-1yr) | Junior Full-Stack | 60-75% | Entry-level appropriate |
| Backend | DevOps | 20-40% | Skill mismatch |
| Frontend | Backend | 30-50% | Different specializations |

---

## 🔍 Validation Tests

### Test Missing Data
```bash
curl -X POST http://localhost:5000/api/ml/match-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"jobDescription": "Some job"}' | jq .
```
**Expected**: 400 error - "Resume data is required" ❌

### Test Short Job Description
```bash
curl -X POST http://localhost:5000/api/ml/match-score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"resumeData": {"skills": ["React"]}, "jobDescription": "Short"}' | jq .
```
**Expected**: 400 error - "Job description must be at least 50 characters" ❌

### Test No Auth
```bash
curl -X POST http://localhost:5000/api/ml/match-score \
  -H "Content-Type: application/json" \
  -d '{"resumeData": {}, "jobDescription": "Test"}' | jq .
```
**Expected**: 401 error - "Unauthorized" ❌

---

## 💡 Pro Tips

1. **Use jq for pretty JSON**: Add `| jq .` to curl commands
2. **Save token as variable**: `TOKEN="your_token"` then use `$TOKEN`
3. **Test incrementally**: Start simple, add complexity
4. **Check response time**: AI calls take 5-15 seconds
5. **Monitor server logs**: Watch terminal for errors

---

## 🎯 Quick Test Checklist

- [ ] Server running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Gemini API key configured
- [ ] JWT token obtained
- [ ] High match test passes (80%+)
- [ ] Low match test passes (<40%)
- [ ] Skill gap analysis returns gaps
- [ ] Quick match works (no auth)
- [ ] Error validation works

---

## 📞 Need Help?

**Check**:
- Server logs: Terminal running `npm start`
- Browser console: F12 → Console
- Network tab: F12 → Network
- `.env` file: Has `GEMINI_API_KEY`

**Common Issues**:
- 401 Error → Token expired or invalid
- 500 Error → Check server logs
- Timeout → Gemini API slow/down
- 0% match → Check resume data format

---

**🎉 Happy Testing!**
