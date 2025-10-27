# 🔒 Security Quick Reference

> **TL;DR:** Your app has basic auth but **NO RATE LIMITING** - this is a critical security and cost risk!

---

## ⚠️ CRITICAL ISSUES

### 1. ❌ NO Rate Limiting on Gemini API
**Problem:** Anyone can spam AI requests → **unlimited costs**  
**Location:** `server/services/gemini.service.js`  
**7 AI functions** without any limits:
- Resume parsing
- Content enhancement
- Summary generation
- Skills categorization
- Achievement segregation
- Custom section processing
- ATS analysis

**Impact:** 1 user can generate $240/day in API costs

---

### 2. ❌ NO Rate Limiting on API Endpoints
**Problem:** Vulnerable to brute force, spam, and DoS attacks  
**Affected Routes:**
```javascript
// Can be spammed unlimited times
POST /api/auth/register     ❌ No limit
POST /api/auth/login        ❌ No limit
POST /api/resume/enhance    ❌ No limit (expensive AI call)
POST /api/ats/analyze-resume ❌ No limit (expensive AI call)
POST /api/resume/upload     ❌ No limit
```

---

### 3. ❌ NO Input Validation Libraries
**Problem:** Vulnerable to XSS, injection attacks, malicious data  
**Currently:** Only basic checks in controllers  
**Missing:** 
- `express-validator` for input validation
- `xss-clean` for XSS prevention
- `express-mongo-sanitize` for NoSQL injection prevention

---

## 🛠️ WHAT YOU NEED (Priority Order)

### 🔴 Critical (Do This Week)

#### 1. Rate Limiting
```bash
npm install express-rate-limit
```

**Create:** `server/middleware/rateLimiter.middleware.js`
```javascript
// Auth: 5 requests per 15 minutes
// AI: 20 requests per hour per user
// Upload: 10 files per 15 minutes
// General API: 100 requests per 15 minutes
```

**Apply to:**
- Authentication routes (login, register)
- All AI routes (enhance, analyze, generate)
- File upload routes
- All API routes (global limiter)

---

#### 2. AI Usage Tracking & Quotas
**Create:** `server/middleware/aiUsageTracker.middleware.js`

**Features:**
- Track daily/monthly AI usage per user
- Set usage limits (free tier: 10/day, premium: 100/day)
- Calculate costs per request
- Reject requests when quota exceeded
- Use existing `AIUsage` model

---

#### 3. Input Validation
```bash
npm install express-validator validator xss-clean express-mongo-sanitize
```

**Create:** `server/middleware/validation.middleware.js`

**Validate:**
- Email format
- Password strength (min 8 chars, complexity)
- Resume data structure
- File types and sizes
- AI request content

---

### 🟠 High Priority (This Month)

#### 4. Security Headers
```bash
npm install helmet
```

**Add to server.js:**
```javascript
import helmet from 'helmet';
app.use(helmet());
```

**Protects from:**
- Clickjacking
- XSS attacks
- Content sniffing
- Insecure connections

---

#### 5. CORS Hardening
**Modify:** `server/server.js`

**Current (weak):**
```javascript
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
```

**Recommended (strong):**
```javascript
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_ORIGIN,
      'https://yourapp.com'
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
```

---

#### 6. JWT Security
**Modify:** `server/middleware/auth.middleware.js`

**Current Issues:**
- Token expiry too long (7 days)
- No refresh token system
- No token blacklist

**Recommended:**
- Access token: 15 minutes
- Refresh token: 7 days
- Implement token rotation
- Add token blacklist for logout

---

### 🟡 Medium Priority (Next Month)

7. **CSRF Protection** (`npm install csurf cookie-parser`)
8. **Request Size Limits** (already using express.json, just add limits)
9. **File Upload Security** (randomize filenames, validate content)
10. **Error Sanitization** (don't expose stack traces in production)

---

## 📊 Current Security Score

| Feature | Status | Priority |
|---------|--------|----------|
| JWT Authentication | ✅ Implemented | - |
| Password Hashing | ✅ bcrypt | - |
| Rate Limiting | ❌ Missing | 🔴 Critical |
| AI Quotas | ❌ Missing | 🔴 Critical |
| Input Validation | ⚠️ Basic only | 🔴 Critical |
| Security Headers | ❌ Missing | 🟠 High |
| CORS | ⚠️ Basic | 🟠 High |
| CSRF Protection | ❌ Missing | 🟡 Medium |
| Token Refresh | ❌ Missing | 🟡 Medium |

**Overall:** 🟠 **MODERATE RISK** - Needs immediate attention

---

## 🚀 Quick Implementation Guide

### Step 1: Install Packages
```bash
cd server
npm install express-rate-limit express-validator validator xss-clean express-mongo-sanitize helmet
```

### Step 2: Create Middleware Files
```bash
touch server/middleware/rateLimiter.middleware.js
touch server/middleware/validation.middleware.js
touch server/middleware/aiUsageTracker.middleware.js
```

### Step 3: Update server.js
```javascript
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

// Apply middleware (ORDER MATTERS!)
app.use(helmet());
app.use(apiLimiter);
app.use(cors(strictCorsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
```

### Step 4: Apply to Routes
```javascript
// In auth.routes.js
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateRegister } from '../middleware/validation.middleware.js';

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, login);

// In resume.routes.js
import { aiLimiter } from '../middleware/rateLimiter.middleware.js';
import { trackAIUsage } from '../middleware/aiUsageTracker.middleware.js';

router.post('/enhance', authenticateToken, aiLimiter, trackAIUsage, enhanceContent);
```

---

## 💰 Cost Impact

### Without Rate Limiting (Current)
```
1 malicious user × 1000 AI requests/hour × $0.01 = $10/hour
24 hours = $240/day
30 days = $7,200/month
```

### With Rate Limiting (Recommended)
```
1 user × 20 AI requests/hour × $0.01 = $0.20/hour
24 hours = $4.80/day
30 days = $144/month

Savings: 98% reduction in potential abuse costs
```

---

## 📂 Files to Modify/Create

### Modify (Existing Files)
- ✏️ `server/server.js` - Add security middleware
- ✏️ `server/middleware/auth.middleware.js` - Enhance JWT
- ✏️ `server/routes/auth.routes.js` - Add rate limiting
- ✏️ `server/routes/resume.routes.js` - Add rate limiting + validation
- ✏️ `server/routes/ats.routes.js` - Add rate limiting + validation
- ✏️ `server/services/gemini.service.js` - Add cost tracking

### Create (New Files)
- ➕ `server/middleware/rateLimiter.middleware.js`
- ➕ `server/middleware/validation.middleware.js`
- ➕ `server/middleware/aiUsageTracker.middleware.js`

---

## ✅ Week 1 Checklist

**Day 1-2: Rate Limiting**
- [ ] Install `express-rate-limit`
- [ ] Create `rateLimiter.middleware.js`
- [ ] Add auth rate limiter (5 req/15min)
- [ ] Add AI rate limiter (20 req/hour per user)
- [ ] Test with Postman

**Day 3-4: AI Usage Tracking**
- [ ] Create `aiUsageTracker.middleware.js`
- [ ] Implement daily quota check (10 AI calls/day for free users)
- [ ] Track costs in `AIUsage` model
- [ ] Add user quota exceeded error

**Day 5: Input Validation**
- [ ] Install validation packages
- [ ] Create `validation.middleware.js`
- [ ] Add auth validation (email, password)
- [ ] Add resume data validation

**Day 6-7: Security Headers + CORS**
- [ ] Install and configure `helmet`
- [ ] Harden CORS configuration
- [ ] Test with security scanner

---

## 🧪 Testing Commands

```bash
# Test rate limiting (should fail after 5 attempts)
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Test AI rate limiting (should fail after 20 attempts)
for i in {1..25}; do
  curl -X POST http://localhost:5000/api/resume/enhance \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"content":"test","sectionType":"experience"}'
done

# Check for vulnerable packages
npm audit

# Security headers check
curl -I http://localhost:5000/api/health
```

---

## 📚 Full Documentation

See **`SECURITY_ANALYSIS.md`** for:
- Complete vulnerability analysis
- Detailed implementation guides
- Code examples for each security feature
- Best practices
- Testing strategies
- Cost analysis

---

## 🎯 Summary

**You asked about security, here's the verdict:**

1. ❌ **NO rate limiting on API keys or endpoints** - This is your biggest risk
2. ❌ **NO protection against API abuse** - Users can spam expensive AI calls
3. ⚠️ **Basic security only** - Missing helmet, proper CORS, input validation
4. ✅ **Auth works** - JWT and bcrypt are correctly implemented

**Priority:** Fix rate limiting THIS WEEK. Without it, you're vulnerable to:
- Unlimited API costs
- Brute force attacks
- DoS attacks
- API quota exhaustion

**Estimated effort:** 
- Rate limiting: 4-6 hours
- AI quotas: 4-6 hours
- Input validation: 6-8 hours
- Other security: 8-10 hours
- **Total:** 2-3 days of focused work

---

**Last Updated:** October 26, 2025
