# 🧪 Manual AI Quota Testing Commands

## Copy-Paste These Commands One by One

### 1️⃣ Set Your Token (Run This First)

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzFmMDEwYjczOGM2NTFmYjFjNjMyYzUiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTczMDEwNTA1NiwiZXhwIjoxNzMwNzA5ODU2fQ.qP1uPMvHEYjWU9UdFsHKbxhMwbTmq87_8UX_swqDcw4"
```

---

### 2️⃣ Test Request 1 (Should Succeed)

```bash
curl -X POST http://localhost:5000/api/resume/generate-summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resumeData":{"name":"Test User","experience":[{"company":"Corp","title":"Dev","bullets":["Work"]}]}}'
```

**Expected:** ✅ HTTP 200 with AI-generated summary

---

### 3️⃣ Test Request 2 (Should Succeed)

```bash
curl -X POST http://localhost:5000/api/resume/enhance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":["Led team of developers"],"sectionType":"experience"}'
```

**Expected:** ✅ HTTP 200 with enhanced content

---

### 4️⃣ Test Request 3 (Should Succeed)

```bash
curl -X POST http://localhost:5000/api/resume/categorize-skills \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"skills":"JavaScript, Python, React, Node.js, MongoDB"}'
```

**Expected:** ✅ HTTP 200 with categorized skills

---

### 5️⃣ Test Requests 4-10 (Run This Loop)

```bash
for i in {4..10}; do
  echo "Request $i"
  curl -X POST http://localhost:5000/api/resume/generate-summary \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"resumeData":{"name":"Test","experience":[{"company":"C","title":"D","bullets":["W"]}]}}'
  echo -e "\n---\n"
  sleep 1
done
```

**Expected:** ✅ All 7 requests should succeed

---

### 6️⃣ Test Request 11 (Should FAIL with Quota Exceeded)

```bash
curl -v -X POST http://localhost:5000/api/resume/generate-summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resumeData":{"name":"Test","experience":[{"company":"C","title":"D","bullets":["W"]}]}}'
```

**Expected:** 🚫 HTTP 429 with error:
```json
{
  "success": false,
  "error": "Daily AI quota exceeded",
  "quota": {
    "tier": "free",
    "daily": {"used": 10, "limit": 10, "remaining": 0}
  }
}
```

---

## 📊 Check Database (MongoDB)

### Option 1: MongoDB Compass
1. Connect to your database
2. Open `aiusages` collection
3. Sort by `createdAt` descending
4. Verify 10 records exist with your userId

### Option 2: MongoDB Shell

```javascript
// Connect to MongoDB
mongosh

// Use your database
use your_database_name

// Find recent AI usage records
db.aiusages.find().sort({createdAt: -1}).limit(10).pretty()

// Count today's usage for your user
db.aiusages.countDocuments({
  userId: ObjectId("671f010b738c651fb1c632c5"),
  createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
})

// Check costs
db.aiusages.aggregate([
  {
    $match: {
      userId: ObjectId("671f010b738c651fb1c632c5"),
      createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
    }
  },
  {
    $group: {
      _id: null,
      totalRequests: { $sum: 1 },
      totalTokens: { $sum: "$tokensUsed" },
      totalCost: { $sum: "$cost" }
    }
  }
])
```

---

## 🔍 Check Server Logs

Look for these logs in your server terminal:

```
✅ [AI Quota] User 671f... quota check passed: 1/10 daily, 1/200 monthly
✅ Summary generated successfully (Tokens: 156)
✅ [AI Usage] Tracked: User 671f..., Feature: ai_suggestions, Tokens: 156, Cost: $0.0001, Status: success

... (requests 2-10) ...

🚫 [AI Quota] User 671f... exceeded daily limit: 10/10
```

---

## ✅ Success Criteria

- [ ] Requests 1-10: All succeed (HTTP 200)
- [ ] Request 11: Blocked with HTTP 429
- [ ] Database has 10 `aiusages` records
- [ ] Each record has `tokensUsed > 0`
- [ ] Each record has `cost > 0`
- [ ] Server logs show quota checks
- [ ] Total cost calculated correctly

---

## 🔄 Reset Quota (For Re-testing)

### Option 1: Restart Server
```bash
# In server directory
# Stop server (Ctrl+C)
npm run dev
```

### Option 2: Delete Today's Usage Records
```javascript
// MongoDB Shell
db.aiusages.deleteMany({
  userId: ObjectId("671f010b738c651fb1c632c5"),
  createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }
})
```

### Option 3: Wait Until Tomorrow
- Quota resets automatically at midnight

---

## 🎯 Quick Verification

**One-liner to check quota status:**

```bash
curl -X POST http://localhost:5000/api/resume/generate-summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resumeData":{"name":"T","experience":[{"company":"C","title":"D","bullets":["W"]}]}}' \
  2>/dev/null | jq 'if .error then .error else "Success" end'
```

**Output:**
- `"Success"` = Quota available
- `"Daily AI quota exceeded"` = Quota exhausted

---

## 📝 Notes

- Free tier limit: **10 AI requests per day**
- Token from login (valid for 7 days)
- In-memory rate limiting resets on server restart
- Database tracking persists across restarts
- Admins bypass quota (set role to "admin" in DB)

---

**Run these commands in your terminal to test the AI quota system!** 🚀
