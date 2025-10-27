# 🔒 Security Analysis Report - ATS Resume Generator

> **Generated:** October 26, 2025  
> **Status:** Security Assessment & Recommendations

---

## 📊 Executive Summary

### Current Security Status: ⚠️ MODERATE RISK

Your application has **basic authentication** but lacks **critical security features** including:
- ❌ **NO rate limiting on API endpoints**
- ❌ **NO rate limiting on Gemini API calls**
- ❌ **NO input sanitization/validation libraries**
- ❌ **NO security headers (helmet)**
- ❌ **NO CSRF protection**
- ⚠️ **Basic CORS configuration**
- ✅ **JWT authentication implemented**
- ✅ **Password hashing with bcrypt**

---

## 🎯 CRITICAL: Rate Limiting Issues

### ❌ 1. NO Rate Limiting on Gemini API Key

**Location:** `server/services/gemini.service.js`

```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

**Problem:**
- **7 different AI functions** call Gemini API **WITHOUT** any rate limiting:
  1. `parseResumeWithAI()` - Resume parsing
  2. `enhanceContentWithAI()` - Content enhancement
  3. `generateSummaryWithAI()` - Summary generation
  4. `categorizeSkillsWithAI()` - Skills categorization
  5. `segregateAchievementsWithAI()` - Achievement segregation
  6. `processCustomSectionWithAI()` - Custom section processing
  7. `analyzeResumeJobMatch()` - ATS analysis

**Risk:**
- 💰 **Unlimited API costs** if user spams requests
- 🚨 **Gemini API quota exhaustion** (quota limits will be hit)
- 🔥 **Potential account suspension** by Google
- 💸 **Financial risk**: Each request costs money

**Impact:**
- A single malicious user can generate **thousands of AI requests**
- No tracking of costs per user
- No limits on concurrent requests

---

### ❌ 2. NO Rate Limiting on REST API Endpoints

**Current Routes WITHOUT Rate Limiting:**

#### Authentication Routes (`auth.routes.js`)
```javascript
router.post("/register", register);  // ❌ Can spam registrations
router.post("/login", login);        // ❌ Brute force attacks possible
```

#### Resume Routes (`resume.routes.js`)
```javascript
router.post("/upload", authenticateToken, upload.single("resume"), uploadResume);
router.post("/enhance", authenticateToken, enhanceContent);
router.post("/generate-summary", authenticateToken, generateSummary);
router.post("/categorize-skills", authenticateToken, categorizeSkills);
router.post("/segregate-achievements", authenticateToken, segregateAchievements);
// All ❌ No limits on AI-powered expensive operations
```

#### ATS Routes (`ats.routes.js`)
```javascript
router.post("/analyze-resume", authenticateToken, upload.single("resumeFile"), analyzeResume);
// ❌ Most expensive operation - no rate limit
```

**Risk:**
- **Brute force attacks** on login/register
- **Spam account creation**
- **AI API abuse** (expensive operations)
- **DoS attacks** by flooding endpoints
- **File upload spam**

---

## 🛡️ Security Features Needed (Priority Order)

### 🔴 **CRITICAL PRIORITY** (Implement Immediately)

#### 1. **Rate Limiting Middleware**
**Where to implement:**
- `server/middleware/rateLimiter.middleware.js` (NEW FILE)

**Required Rate Limiters:**

```javascript
// 1. Authentication Rate Limiter
authLimiter: {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 requests per window
  endpoints: ['/api/auth/login', '/api/auth/register']
}

// 2. AI Operations Rate Limiter (PER USER)
aiLimiter: {
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 20,                     // 20 AI requests per hour per user
  endpoints: [
    '/api/resume/enhance',
    '/api/resume/generate-summary',
    '/api/resume/categorize-skills',
    '/api/resume/segregate-achievements',
    '/api/resume/process-custom-section',
    '/api/ats/analyze-resume'
  ]
}

// 3. File Upload Rate Limiter
uploadLimiter: {
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,                     // 10 uploads per window
  endpoints: ['/api/resume/upload', '/api/ats/analyze-resume']
}

// 4. General API Rate Limiter
apiLimiter: {
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                    // 100 requests per window
  endpoints: ['*']             // All routes
}
```

**NPM Package Needed:**
```bash
npm install express-rate-limit
```

**Apply to Routes:**
```javascript
// In server.js
import rateLimit from 'express-rate-limit';
import { authLimiter, aiLimiter, uploadLimiter, apiLimiter } from './middleware/rateLimiter.middleware.js';

// Apply global rate limiter
app.use('/api/', apiLimiter);

// Apply specific limiters
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/resume/enhance', aiLimiter);
app.use('/api/ats/analyze-resume', aiLimiter);
```

---

#### 2. **Gemini API Cost Tracking & User Limits**
**Where to implement:**
- `server/middleware/aiUsageTracker.middleware.js` (NEW FILE)

**Features Needed:**
```javascript
// Track AI usage per user
aiUsageTracker: {
  - Track tokens used per request
  - Calculate cost per request
  - Store in AIUsage model (already exists!)
  - Daily/Monthly limits per user
  - Alert when approaching limits
}

// User quotas
userQuotas: {
  free_tier: {
    daily_ai_requests: 10,
    monthly_ai_requests: 100,
    daily_cost_limit: $1.00
  },
  premium_tier: {
    daily_ai_requests: 100,
    monthly_ai_requests: 1000,
    daily_cost_limit: $10.00
  }
}
```

**Implementation Points:**
- Middleware before all AI controller calls
- Check user's daily/monthly usage from `AIUsage` model
- Reject requests if quota exceeded
- Log all AI usage with costs

---

#### 3. **Input Validation & Sanitization**
**Where to implement:**
- `server/middleware/validation.middleware.js` (NEW FILE)

**Required Validations:**

```javascript
// Authentication validation
validateAuth: {
  email: 'Valid email format, max 255 chars',
  password: 'Min 8 chars, max 128 chars, complexity rules',
  name: 'Min 2 chars, max 100 chars, no special chars'
}

// Resume data validation
validateResumeData: {
  name: 'Required, min 3 chars, max 200 chars',
  contact: {
    email: 'Valid email format',
    phone: 'Valid phone format (regex)',
    linkedin: 'Valid URL',
    github: 'Valid URL'
  },
  summary: 'Max 1000 chars',
  experience: 'Array, max 20 items',
  skills: 'Array, max 50 items'
}

// File validation (already partially exists)
validateFile: {
  mimeType: ['application/pdf', 'application/docx'],
  maxSize: 5MB (already implemented),
  scanForMalware: 'TODO - virus scanning'
}

// AI content validation
validateAIInput: {
  content: 'Required, min 10 chars, max 5000 chars',
  sectionType: 'Enum validation',
  customPrompt: 'Max 500 chars, XSS sanitization'
}
```

**NPM Packages Needed:**
```bash
npm install express-validator    # Input validation
npm install validator            # Additional validators
npm install xss-clean           # XSS sanitization
npm install express-mongo-sanitize  # NoSQL injection prevention
```

**Apply to Routes:**
```javascript
// Example
import { body, validationResult } from 'express-validator';

router.post('/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('name').trim().isLength({ min: 2, max: 100 })
  ],
  validateRequest,  // Middleware to check validation results
  register
);
```

---

### 🟠 **HIGH PRIORITY** (Implement Within 1 Week)

#### 4. **Security Headers (Helmet.js)**
**Where to implement:**
- `server/server.js`

**What it protects:**
```javascript
helmet() adds:
  - X-DNS-Prefetch-Control
  - X-Frame-Options: DENY (prevents clickjacking)
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security (HTTPS)
  - Content-Security-Policy
```

**NPM Package:**
```bash
npm install helmet
```

**Implementation:**
```javascript
// In server.js
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

---

#### 5. **CORS Hardening**
**Where to implement:**
- `server/server.js` (MODIFY EXISTING)

**Current CORS (Weak):**
```javascript
// Current - Too permissive
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
```

**Recommended CORS (Strong):**
```javascript
// Recommended - Strict configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_ORIGIN,
      'https://yourapp.com',
      'https://www.yourapp.com'
    ];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 10 minutes
};

app.use(cors(corsOptions));
```

---

#### 6. **JWT Security Enhancements**
**Where to implement:**
- `server/middleware/auth.middleware.js` (MODIFY EXISTING)

**Current Issues:**
```javascript
// Current - Basic JWT
jwt.sign({userId, email}, process.env.JWT_SECRET, {expiresIn: "7d"});
```

**Recommended Enhancements:**
```javascript
// 1. Shorter expiry + Refresh tokens
accessToken: {
  expiresIn: '15m',  // Short-lived
  payload: {userId, email, role}
}

refreshToken: {
  expiresIn: '7d',   // Long-lived
  stored_in_db: true  // Track refresh tokens
}

// 2. Token blacklisting for logout
tokenBlacklist: {
  - Store invalidated tokens in Redis/MongoDB
  - Check blacklist on each auth request
}

// 3. Token rotation
- Issue new tokens on refresh
- Invalidate old refresh token
```

**Additional Security:**
```javascript
// Add to JWT payload
{
  userId,
  email,
  role,
  iat: issued_at_timestamp,
  exp: expiry_timestamp,
  jti: unique_token_id,  // For blacklisting
  iss: 'ats-resume-generator'  // Issuer
}

// Verify more than just signature
- Check token expiry
- Check token not blacklisted
- Check user still exists and is active
- Check user role hasn't changed
```

---

### 🟡 **MEDIUM PRIORITY** (Implement Within 2 Weeks)

#### 7. **CSRF Protection**
**Where to implement:**
- `server/middleware/csrf.middleware.js` (NEW FILE)

**What it protects:**
- Cross-Site Request Forgery attacks
- Protects state-changing operations (POST, PUT, DELETE)

**NPM Package:**
```bash
npm install csurf
npm install cookie-parser
```

**Implementation:**
```javascript
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

// Apply to all state-changing routes
app.post('/api/*', csrfProtection);
app.put('/api/*', csrfProtection);
app.delete('/api/*', csrfProtection);
```

---

#### 8. **Request Size Limits**
**Where to implement:**
- `server/server.js` (MODIFY EXISTING)

**Current (Unlimited):**
```javascript
app.use(express.json());
app.use(express.urlencoded({extended: true}));
```

**Recommended (Limited):**
```javascript
app.use(express.json({ limit: '10kb' }));  // Limit JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.raw({ limit: '5mb' }));    // For file uploads
```

---

#### 9. **Database Query Protection**
**Where to implement:**
- All MongoDB queries in controllers

**Current Vulnerabilities:**
```javascript
// Vulnerable to NoSQL injection
User.findOne({email});
Resume.find({userId});
```

**Protection Needed:**
```javascript
// 1. Install mongo-sanitize
npm install express-mongo-sanitize

// 2. Apply middleware
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());

// 3. Use parameterized queries (already doing this)
// 4. Validate all inputs before queries
// 5. Use mongoose schema validation (already doing this)
```

---

#### 10. **File Upload Security**
**Where to implement:**
- `server/config/multer.config.js` (MODIFY EXISTING)

**Current Security (Partial):**
```javascript
✅ File type validation (PDF, DOCX)
✅ File size limit (5MB)
❌ No malware scanning
❌ No file content validation
❌ Predictable file names
```

**Enhancements Needed:**
```javascript
// 1. Randomize file names
filename: (req, file, cb) => {
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
}

// 2. Validate file content (not just extension)
- Check file magic numbers
- Verify PDF/DOCX structure

// 3. Scan for malware (optional but recommended)
npm install clamscan  // Requires ClamAV

// 4. Store files outside web root
- Never serve uploaded files directly
- Use signed URLs for access
```

---

### 🟢 **LOW PRIORITY** (Future Enhancements)

#### 11. **API Response Security**
- Remove stack traces in production
- Sanitize error messages
- Don't expose database errors to clients

#### 12. **Logging & Monitoring**
- Log all authentication attempts
- Log all AI API calls (already done via AIUsage model)
- Alert on suspicious activity
- Monitor for rate limit violations

#### 13. **Session Management**
- Implement session timeout
- Track active sessions
- Force logout on security events

#### 14. **Environment Variable Protection**
- Never commit `.env` files (already using .gitignore)
- Use secret management services (AWS Secrets Manager, Azure Key Vault)
- Rotate secrets regularly

---

## 📁 Where to Apply Security Features

### File-by-File Implementation Guide

#### `server/server.js` (MODIFY)
```javascript
// Add these imports
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Apply middleware (ORDER MATTERS!)
app.use(helmet());                    // Security headers
app.use(apiLimiter);                  // Rate limiting
app.use(cors(strictCorsOptions));     // CORS
app.use(express.json({ limit: '10kb' })); // Body size limit
app.use(mongoSanitize());            // NoSQL injection prevention
app.use(xss());                       // XSS prevention
```

#### `server/middleware/rateLimiter.middleware.js` (NEW)
```javascript
// Create comprehensive rate limiters
export const authLimiter = rateLimit({...});
export const aiLimiter = rateLimit({...});
export const uploadLimiter = rateLimit({...});
export const apiLimiter = rateLimit({...});
```

#### `server/middleware/validation.middleware.js` (NEW)
```javascript
// Input validation schemas
export const validateRegister = [...];
export const validateLogin = [...];
export const validateResumeData = [...];
export const validateAIRequest = [...];
export const validateRequest = (req, res, next) => {...};
```

#### `server/middleware/aiUsageTracker.middleware.js` (NEW)
```javascript
// Track and limit AI usage per user
export const trackAIUsage = async (req, res, next) => {
  - Check user quota
  - Log usage
  - Calculate costs
  - Update AIUsage model
};
```

#### `server/middleware/auth.middleware.js` (MODIFY)
```javascript
// Enhance JWT validation
- Add token blacklist check
- Add user status check
- Add role validation
- Implement refresh token logic
```

#### `server/routes/*.js` (MODIFY ALL)
```javascript
// Add rate limiters and validators
import { authLimiter, aiLimiter, uploadLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateRegister, validateRequest } from '../middleware/validation.middleware.js';
import { trackAIUsage } from '../middleware/aiUsageTracker.middleware.js';

router.post('/register', 
  authLimiter,
  validateRegister,
  validateRequest,
  register
);

router.post('/enhance',
  authenticateToken,
  aiLimiter,
  trackAIUsage,
  validateAIRequest,
  validateRequest,
  enhanceContent
);
```

#### `server/services/gemini.service.js` (MODIFY)
```javascript
// Add error handling and cost tracking
export const parseResumeWithAI = async (text) => {
  try {
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const responseTime = Date.now() - startTime;
    
    // Calculate tokens and cost
    const tokensUsed = result.usage?.totalTokens || 0;
    const cost = calculateCost(tokensUsed);
    
    // Return with metadata
    return {
      data: parsedData,
      metadata: { tokensUsed, cost, responseTime }
    };
  } catch (error) {
    // Handle Gemini API errors
    if (error.message.includes('quota')) {
      throw new Error('API quota exceeded');
    }
    throw error;
  }
};
```

#### `server/controllers/*.js` (MODIFY ALL)
```javascript
// Add validation, sanitization, and error handling
export const enhanceContent = async (req, res) => {
  try {
    // Validation already done by middleware
    const { content, sectionType } = req.body;
    
    // Call AI service
    const result = await enhanceContentWithAI(content, sectionType);
    
    // Log AI usage (done by middleware)
    res.json(result);
  } catch (error) {
    // Sanitized error messages
    const message = process.env.NODE_ENV === 'production' 
      ? 'Failed to enhance content' 
      : error.message;
    res.status(500).json({ error: message });
  }
};
```

---

## 🚨 Security Vulnerabilities Summary

### Current Vulnerabilities (Ranked by Severity)

| # | Vulnerability | Severity | Impact | Location |
|---|--------------|----------|--------|----------|
| 1 | No rate limiting on Gemini API | 🔴 Critical | Unlimited costs, quota exhaustion | `gemini.service.js` |
| 2 | No authentication rate limiting | 🔴 Critical | Brute force attacks | `auth.routes.js` |
| 3 | No AI operation rate limiting | 🔴 Critical | API abuse, high costs | `resume.routes.js`, `ats.routes.js` |
| 4 | No input validation libraries | 🔴 Critical | XSS, injection attacks | All controllers |
| 5 | No security headers (Helmet) | 🟠 High | Clickjacking, XSS | `server.js` |
| 6 | Weak CORS configuration | 🟠 High | CSRF attacks | `server.js` |
| 7 | No CSRF protection | 🟠 High | Cross-site request forgery | All POST/PUT/DELETE routes |
| 8 | JWT tokens too long-lived (7 days) | 🟠 High | Token theft impact | `auth.middleware.js` |
| 9 | No request size limits | 🟡 Medium | DoS attacks | `server.js` |
| 10 | No file content validation | 🟡 Medium | Malicious file uploads | `multer.config.js` |
| 11 | Error messages expose internals | 🟡 Medium | Information disclosure | All controllers |
| 12 | No NoSQL injection prevention | 🟡 Medium | Database attacks | All database queries |

---

## 📦 NPM Packages to Install

```bash
# Rate limiting
npm install express-rate-limit

# Input validation and sanitization
npm install express-validator validator xss-clean express-mongo-sanitize

# Security headers
npm install helmet

# CSRF protection
npm install csurf cookie-parser

# Optional: Malware scanning
npm install clamscan  # Requires ClamAV server

# Optional: Advanced logging
npm install winston express-winston
```

---

## 🎯 Implementation Checklist

### Week 1 - Critical Security
- [ ] Install `express-rate-limit`
- [ ] Create `rateLimiter.middleware.js`
- [ ] Apply rate limiting to authentication routes
- [ ] Apply rate limiting to AI routes (per user)
- [ ] Create `aiUsageTracker.middleware.js`
- [ ] Implement daily AI usage limits per user
- [ ] Test rate limiting with multiple requests

### Week 2 - Input Validation
- [ ] Install `express-validator`, `xss-clean`, `express-mongo-sanitize`
- [ ] Create `validation.middleware.js`
- [ ] Add validation to all authentication routes
- [ ] Add validation to all resume routes
- [ ] Add validation to all ATS routes
- [ ] Add XSS sanitization middleware
- [ ] Add NoSQL injection prevention middleware
- [ ] Test with malicious inputs

### Week 3 - Security Headers & CORS
- [ ] Install `helmet`
- [ ] Configure and apply Helmet middleware
- [ ] Harden CORS configuration
- [ ] Test security headers with online scanners
- [ ] Configure Content Security Policy

### Week 4 - JWT & CSRF
- [ ] Implement refresh token system
- [ ] Reduce JWT access token expiry to 15 minutes
- [ ] Create token blacklist system
- [ ] Install `csurf` and `cookie-parser`
- [ ] Apply CSRF protection to state-changing routes
- [ ] Update frontend to handle CSRF tokens

### Week 5 - File Security
- [ ] Randomize uploaded file names
- [ ] Validate file content (magic numbers)
- [ ] Store files outside web root
- [ ] Implement signed URLs for file access
- [ ] (Optional) Setup ClamAV for malware scanning

### Week 6 - Error Handling & Logging
- [ ] Sanitize all error messages
- [ ] Remove stack traces in production
- [ ] Install `winston` for advanced logging
- [ ] Log all authentication attempts
- [ ] Log all rate limit violations
- [ ] Setup alerts for suspicious activity

---

## 🧪 Testing Security

### Tools to Use:
1. **OWASP ZAP** - Automated security scanner
2. **Postman** - Test rate limiting and validation
3. **Burp Suite** - Intercept and test requests
4. **npm audit** - Check for vulnerable packages
5. **Security Headers Scanner** - https://securityheaders.com

### Test Cases:
```bash
# Test rate limiting
- Send 100 login requests → Should be blocked after 5
- Send 50 AI requests → Should be blocked after quota

# Test input validation
- Send XSS payloads → Should be sanitized
- Send SQL injection → Should be prevented
- Send NoSQL injection → Should be prevented

# Test authentication
- Use expired JWT → Should reject
- Use invalid JWT → Should reject
- Brute force password → Should be rate limited

# Test file uploads
- Upload .exe file → Should reject
- Upload 10MB file → Should reject
- Upload file with malicious content → Should reject
```

---

## 📊 Cost Impact Analysis

### Without Rate Limiting:
```
Scenario: Malicious user spamming AI endpoints
- 1000 AI requests/hour × 24 hours = 24,000 requests/day
- Average cost per request: $0.01
- Daily loss: $240
- Monthly loss: $7,200
```

### With Rate Limiting:
```
Scenario: Rate limited to 20 AI requests/hour per user
- Maximum requests from 1 user: 20 × 24 = 480 requests/day
- Daily cost per user: $4.80
- Even with 100 abusive users: $480/day vs $24,000/day
- Savings: 98% cost reduction
```

---

## 🔐 Security Best Practices

1. **Never trust user input** - Always validate and sanitize
2. **Principle of least privilege** - Users get minimum permissions
3. **Defense in depth** - Multiple layers of security
4. **Fail securely** - Errors should not expose information
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Use HTTPS in production** - Encrypt data in transit
7. **Secure environment variables** - Never commit secrets
8. **Monitor and log** - Track security events
9. **Regular security audits** - Test your application
10. **Educate your team** - Security is everyone's responsibility

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Gemini API Security Guide](https://ai.google.dev/docs/security)

---

## ✅ Summary

**Immediate Actions Required:**
1. ✅ Implement rate limiting on ALL routes (especially AI endpoints)
2. ✅ Add per-user AI usage quotas and cost tracking
3. ✅ Install input validation and sanitization libraries
4. ✅ Add security headers with Helmet.js
5. ✅ Harden CORS configuration
6. ✅ Implement proper JWT token management

**Your application has JWT authentication working, but lacks critical production-grade security features. Without rate limiting, you're vulnerable to API abuse and unlimited costs. This should be your #1 priority.**

---

**Last Updated:** October 26, 2025  
**Next Review:** December 1, 2025
