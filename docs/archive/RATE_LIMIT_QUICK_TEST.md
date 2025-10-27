# 🚀 Quick Rate Limiting Test Guide

## ✅ What's Working Now

**Auth Rate Limiter:** ✅ TESTED & VERIFIED
- 5 login attempts per 15 minutes
- HTTP 429 returned after limit
- Custom error messages working

**Global API Limiter:** ✅ TESTED & VERIFIED
- 100 requests per 15 minutes
- Health endpoint correctly skipped

## 🧪 Quick Tests You Can Run Now

### Test 1: Auth Rate Limiter (5 req/15min)
```bash
# Send 6 login requests - 6th should be blocked
for i in {1..6}; do 
  echo "Request $i:"
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nHTTP: %{http_code}\n\n"
  sleep 0.5
done
```

**Expected:** First 5 return 401, 6th returns 429 ✅

### Test 2: Check Rate Limit Headers
```bash
curl -I -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  | grep -i "ratelimit"
```

**Expected Headers:**
- `RateLimit-Limit: 5`
- `RateLimit-Remaining: X`
- `Retry-After: 900` (when limit hit)

### Test 3: Health Endpoint (Should Never Rate Limit)
```bash
for i in {1..20}; do 
  curl -s http://localhost:5000/api/health | jq .status
done
```

**Expected:** All 20 requests succeed with "ok"

## 🔄 To Test AI Rate Limiter

### Step 1: Restart Server (Reset Limits)
```bash
cd server
# Stop server (Ctrl+C if running)
npm run dev
```

### Step 2: Get JWT Token
```bash
# Login (replace with your credentials)
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpass"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

### Step 3: Test AI Limiter (20 req/hour)
```bash
# Send 22 AI requests - 21st should be blocked
for i in {1..22}; do
  echo "AI Request $i:"
  curl -X POST http://localhost:5000/api/resume/enhance \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"content":"test","sectionType":"experience"}' \
    -w "\nHTTP: %{http_code}\n\n"
  sleep 0.5
done
```

**Expected:** First 20 succeed, 21st+ return 429

## 📊 All Rate Limits at a Glance

| Endpoint | Limit | Window | Key Type |
|----------|-------|--------|----------|
| `/api/auth/*` | 5 | 15 min | IP |
| AI endpoints | 20 | 1 hour | User ID |
| `/api/resume/upload` | 10 | 15 min | User ID |
| `/api/contact` | 3 | 1 hour | IP |
| `/api/feedback` | 5 | 1 hour | User ID |
| `/api/admin/*` | 200 | 15 min | User ID |
| All `/api/*` | 100 | 15 min | IP |

## 🎯 Rate Limit Error Format

When rate limited, you'll get:
```json
{
  "error": "Too many [type] attempts. Please try again after [time].",
  "retryAfter": "15 minutes",
  "type": "AUTH_RATE_LIMIT_EXCEEDED"
}
```

HTTP Status: `429 Too Many Requests`

## 🔧 Troubleshooting

**Still seeing 429 after waiting?**
- Server hasn't been restarted
- Using in-memory rate limiting (resets on restart)
- Check server logs for rate limit warnings

**Not seeing rate limits?**
- Check middleware is imported and applied
- Verify server.js has `app.use("/api/", apiLimiter)`
- Check routes have specific limiters applied

**Rate limit too strict/loose?**
- Edit `server/middleware/rateLimiter.middleware.js`
- Adjust `max` value for desired limit
- Restart server for changes to take effect

## 📚 Documentation

- **Full Implementation:** `RATE_LIMITING_IMPLEMENTATION.md`
- **Test Results:** `RATE_LIMITING_TEST_RESULTS.md`
- **Security Overview:** `SECURITY_ANALYSIS.md`
- **Quick Reference:** `SECURITY_QUICK_REFERENCE.md`

## ✅ Checklist

- [x] Rate limiters implemented
- [x] Auth limiter tested (5/15min) ✅
- [x] Global API limiter tested (100/15min) ✅
- [x] Error messages verified ✅
- [ ] AI limiter tested (20/hour) - need token
- [ ] Upload limiter tested (10/15min) - need token
- [ ] Contact limiter tested (3/hour)
- [ ] Feedback limiter tested (5/hour)

---

**Status:** ✅ **WORKING**  
**Last Updated:** October 27, 2025
