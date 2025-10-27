# 🚀 AI Usage Tracking - Quick Start Testing

## Prerequisites

✅ Server running: `cd server && npm run dev`  
✅ MongoDB connected  
✅ Test user created  

---

## Quick Test (5 Minutes)

### 1. Get JWT Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123456"}'
```

**Copy the token** from response: `"token": "eyJhbGc..."`

### 2. Test Quota Enforcement (11 Requests)

```bash
# Replace YOUR_TOKEN_HERE with actual token
TOKEN="YOUR_TOKEN_HERE"

for i in {1..11}; do
  echo "============ Request $i ============"
  curl -X POST http://localhost:5000/api/resume/generate-summary \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "resumeData": {
        "name": "Test User",
        "experience": [{"company": "Test Corp", "title": "Developer", "bullets": ["Led team"]}]
      }
    }' | jq '.'
  echo ""
  sleep 2
done
```

### Expected Results

- ✅ **Requests 1-10:** Success (HTTP 200) with AI-generated summary
- ✅ **Request 11:** Quota exceeded (HTTP 429) with error message:
  ```json
  {
    "success": false,
    "error": "Daily AI quota exceeded",
    "message": "You have reached your daily limit of 10 AI requests...",
    "quota": {
      "tier": "free",
      "daily": {"used": 10, "limit": 10, "remaining": 0},
      "resetsAt": "2025-10-28T00:00:00.000Z"
    }
  }
  ```

### 3. Verify Database Tracking

**MongoDB Compass:**
1. Open `aiusages` collection
2. Sort by `createdAt` descending
3. See 10 new records with:
   - ✅ Your userId
   - ✅ feature: "ai_suggestions"
   - ✅ tokensUsed: ~100-300
   - ✅ cost: ~$0.00003-$0.00010
   - ✅ status: "success"

**MongoDB Shell:**
```javascript
db.aiusages.find().sort({createdAt: -1}).limit(10).pretty()
```

### 4. Check Server Logs

Look for these logs in terminal:

```
✅ [AI Quota] User 67... quota check passed: 1/10 daily, 1/200 monthly
✅ Summary generated successfully (Tokens: 156)
✅ [AI Usage] Tracked: User 67..., Feature: ai_suggestions, Tokens: 156, Cost: $0.0000, Status: success
```

---

## What to Check

| ✅ Check | Expected Result |
|---------|-----------------|
| First 10 requests succeed | HTTP 200 with AI content |
| 11th request blocked | HTTP 429 with quota error |
| Database has 10 records | `aiusages` collection updated |
| Token counts > 0 | `tokensUsed` field populated |
| Costs calculated | `cost` field has value |
| Server logs show tracking | Console shows quota checks |

---

## Troubleshooting

**Issue:** All requests fail with 429  
**Fix:** Rate limiter active from previous tests. Wait 15 minutes or restart server.

**Issue:** Token is invalid  
**Fix:** Re-login to get fresh token. Check token copied correctly.

**Issue:** Database not updating  
**Fix:** Check MongoDB connection in `.env`. Verify `MONGODB_URI` is correct.

**Issue:** Quota not enforced (11th request succeeds)  
**Fix:** Check middleware applied to route. Verify `checkAIQuota` in route chain.

---

## Next Steps

✅ Test other AI endpoints (`/enhance`, `/categorize-skills`, etc.)  
✅ Test admin bypass (set user role to "admin")  
✅ Test error tracking (send invalid requests)  
✅ Monitor costs over time  
✅ Build quota status dashboard  

---

**Full Documentation:** See `AI_USAGE_TRACKING_GUIDE.md`
