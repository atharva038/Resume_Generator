# 🔒 Security Headers Quick Reference

## What Was Implemented

✅ **Helmet.js Security Headers**
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

✅ **Enhanced CORS**
- Dynamic origin validation
- Wildcard subdomain support
- Environment-based configuration
- Credentials support

---

## Files Changed

### Created:
- `server/middleware/security.middleware.js` (277 lines)

### Modified:
- `server/server.js` (Added security middleware)
- `server/.env.example` (Added ALLOWED_ORIGINS)
- `server/package.json` (Added helmet package)

---

## Configuration

Add to your `.env` file:

```bash
# Development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Wildcard (use carefully!)
ALLOWED_ORIGINS=https://*.yourdomain.com
```

---

## Testing (2 Minutes)

### 1. Test Server Starts
```bash
cd server
npm run dev
```

### 2. Check Security Headers
Open browser → DevTools → Network → Check response headers:
- ✅ `Content-Security-Policy`
- ✅ `Strict-Transport-Security`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`

### 3. Test CORS
From frontend (`http://localhost:5173`):
- Try creating a resume
- Check browser console (no CORS errors)

### 4. Test Blocked Origin
```bash
curl -H "Origin: http://evil-site.com" \
     -X OPTIONS \
     http://localhost:5000/api/resumes
```
Should see in server logs: `⚠️  CORS blocked request from origin`

---

## What Each Header Does

| Header | Purpose | Our Configuration |
|--------|---------|-------------------|
| **CSP** | Prevents XSS attacks | Whitelist scripts, styles, APIs |
| **HSTS** | Forces HTTPS | 1-year max age |
| **X-Frame-Options** | Prevents clickjacking | DENY (no iframes) |
| **X-Content-Type-Options** | Prevents MIME sniffing | nosniff |
| **X-XSS-Protection** | Browser XSS filter | Enabled |
| **Referrer-Policy** | Controls referrer info | strict-origin-when-cross-origin |
| **Permissions-Policy** | Controls browser features | Deny camera, geolocation, etc. |

---

## Common Issues & Fixes

### CORS Error
```
Access blocked by CORS policy
```
**Fix**: Add origin to `ALLOWED_ORIGINS` in `.env`

### CSP Violation: Scripts
```
Refused to load script
```
**Fix**: Add domain to `scriptSrc` in `security.middleware.js`

### CSP Violation: Images
```
Refused to load image
```
**Fix**: Already configured for `data:`, `blob:`, `https:`

### Google Fonts Not Loading
**Fix**: Already configured in `styleSrc` and `fontSrc`

### Gemini API Blocked
**Fix**: Already added to `connectSrc`

---

## Middleware Order (Critical!)

```javascript
// ⚠️ SECURITY MUST BE FIRST!
app.use(securityHeaders);           // 1. Helmet
app.use(additionalSecurityHeaders); // 2. Custom headers
app.use(cors(corsOptions));         // 3. CORS
app.use(securityLogger);            // 4. Logging (dev)
app.use("/api/", apiLimiter);       // 5. Rate limiting
app.use(express.json());            // 6. Body parsing
app.use(mongoSanitize());           // 7. Sanitization
app.use(xss());                     // 8. XSS protection
// ... then routes
```

---

## Production Checklist

- [ ] `NODE_ENV=production` in `.env`
- [ ] Configure `ALLOWED_ORIGINS` with production domains
- [ ] Remove wildcard origins
- [ ] Enable HTTPS
- [ ] Test all endpoints
- [ ] Check for CSP violations
- [ ] Verify HSTS working
- [ ] Test CORS from production frontend

---

## Security Headers Checker

Test your deployed site:
- Visit: https://securityheaders.com/
- Enter your domain
- Should get an **A** or **A+** rating

---

## Quick Commands

```bash
# Install dependency
npm install helmet

# Start server
cd server && npm run dev

# Test CORS
curl -H "Origin: http://localhost:5173" -I http://localhost:5000/api/resumes

# Check headers
curl -I http://localhost:5000/api/resumes
```

---

## Documentation

📖 Full guide: `docs/SECURITY_HEADERS_IMPLEMENTATION.md`

---

## ✅ Status: COMPLETE

All security headers and CORS configuration implemented and tested!
