# 🔒 Security Headers + CORS Implementation Guide

## Overview

This document describes the comprehensive security headers and CORS (Cross-Origin Resource Sharing) implementation for the ATS Resume Generator. This is a critical security layer that protects against various web vulnerabilities.

---

## 🎯 What Was Implemented

### 1. **Security Headers (Helmet.js)**

Using the industry-standard `helmet` package, we've implemented the following security headers:

#### **Content Security Policy (CSP)**
- **Purpose**: Prevents XSS (Cross-Site Scripting) and code injection attacks
- **What it does**: Controls which resources (scripts, styles, images, etc.) can be loaded
- **Configuration**:
  ```javascript
  - defaultSrc: ["'self'"]                    // Only load resources from same origin
  - scriptSrc: Allow React inline scripts     // Needed for React app
  - styleSrc: Allow Google Fonts & inline     // Needed for styling
  - imgSrc: Allow data URIs, HTTPS, blobs     // For resume photos
  - connectSrc: Allow Gemini API, GitHub API  // For AI features
  - frameSrc: Deny all iframes                // Prevent clickjacking
  - objectSrc: Deny Flash/Java                // Prevent plugin exploits
  ```

#### **HTTP Strict Transport Security (HSTS)**
- **Purpose**: Forces HTTPS connections, prevents SSL stripping attacks
- **Configuration**:
  ```javascript
  maxAge: 31536000              // 1 year
  includeSubDomains: true       // Apply to all subdomains
  preload: true                 // Submit to HSTS preload list
  ```

#### **X-Frame-Options**
- **Purpose**: Prevents clickjacking attacks
- **Configuration**: `DENY` - Site cannot be embedded in iframes

#### **X-Content-Type-Options**
- **Purpose**: Prevents MIME type sniffing attacks
- **Configuration**: `nosniff` - Browser must respect declared content type

#### **X-XSS-Protection**
- **Purpose**: Enables browser's XSS filter (legacy browsers)
- **Configuration**: `1; mode=block` - Block page if XSS detected

#### **Referrer-Policy**
- **Purpose**: Controls how much referrer information is shared
- **Configuration**: `strict-origin-when-cross-origin`

#### **Permissions-Policy**
- **Purpose**: Controls which browser features can be used
- **Disabled**: geolocation, microphone, camera, payment, USB, etc.

### 2. **Enhanced CORS Configuration**

#### **Dynamic Origin Validation**
```javascript
// Supports:
1. Exact origin matching:     http://localhost:5173
2. Wildcard subdomains:        https://*.yourdomain.com
3. Multiple origins:           http://localhost:5173,http://localhost:3000
4. Environment-based config:   ALLOWED_ORIGINS env variable
```

#### **Credentials Support**
- Allows cookies and authorization headers
- Required for JWT authentication

#### **Method & Header Control**
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Allowed Headers**: Content-Type, Authorization, X-Requested-With
- **Exposed Headers**: Content-Range, X-Total-Count (for pagination)

#### **Preflight Caching**
- Cache OPTIONS requests for 24 hours
- Reduces network overhead

---

## 📁 Files Modified/Created

### Created Files:

1. **`server/middleware/security.middleware.js`** (277 lines)
   - Helmet security headers configuration
   - CSP directives
   - CORS options with dynamic origin validation
   - Additional security headers
   - Security logging middleware

### Modified Files:

2. **`server/server.js`** (Updated imports and middleware order)
   - Added security middleware imports
   - Applied security headers BEFORE all routes
   - Applied enhanced CORS configuration
   - Added security logger for development mode

3. **`server/.env.example`** (Added CORS configuration)
   - Added ALLOWED_ORIGINS documentation
   - Added examples for development and production
   - Added wildcard support examples

4. **`server/package.json`** (Updated dependencies)
   - Added `helmet` package

---

## 🔧 Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# For production, use your domain:
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Wildcard support for subdomains:
# ALLOWED_ORIGINS=https://*.yourdomain.com
```

### Middleware Order (IMPORTANT!)

The security middleware MUST be applied in this order:

```javascript
// 1. Security Headers (Helmet)
app.use(securityHeaders);

// 2. Additional Security Headers
app.use(additionalSecurityHeaders);

// 3. CORS
app.use(cors(corsOptions));

// 4. Security Logger (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(securityLogger);
}

// 5. Rate Limiting
app.use("/api/", apiLimiter);

// 6. Body Parsing
app.use(express.json({limit: "10kb"}));

// 7. Data Sanitization
app.use(mongoSanitize());
app.use(xss());

// 8. Routes
app.use("/api/resumes", resumeRoutes);
// ... other routes
```

---

## 🧪 Testing

### Test Security Headers

1. **Start the server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Check headers in browser**:
   - Open Chrome DevTools (F12)
   - Go to Network tab
   - Make a request to `http://localhost:5000/api/resumes`
   - Click on the request
   - Go to "Headers" tab
   - Look for these headers:
     - `Content-Security-Policy`
     - `Strict-Transport-Security`
     - `X-Frame-Options: DENY`
     - `X-Content-Type-Options: nosniff`
     - `X-XSS-Protection: 1; mode=block`
     - `Referrer-Policy`
     - `Permissions-Policy`

3. **Test CSP**:
   ```bash
   # Headers should appear in response
   curl -I http://localhost:5000/api/resumes
   ```

### Test CORS

1. **Test from allowed origin** (should work):
   ```bash
   curl -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        http://localhost:5000/api/resumes
   ```

2. **Test from blocked origin** (should fail):
   ```bash
   curl -H "Origin: http://evil-site.com" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        http://localhost:5000/api/resumes
   ```
   
   Expected: Should see warning in server logs:
   ```
   ⚠️  CORS blocked request from origin: http://evil-site.com
   ```

3. **Test wildcard support**:
   ```bash
   # Set ALLOWED_ORIGINS=https://*.example.com
   # Then test:
   curl -H "Origin: https://subdomain.example.com" ...
   # Should work for any subdomain
   ```

### Test Frontend Integration

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

2. **Test API calls**:
   - Open `http://localhost:5173`
   - Try creating a resume
   - Try uploading a resume
   - Check browser console for CORS errors (should be none)
   - Check Network tab for security headers

3. **Check for CSP violations**:
   - Open browser console
   - Look for CSP violation warnings
   - Common issues:
     - "Refused to load script" → Add to scriptSrc
     - "Refused to load style" → Add to styleSrc
     - "Refused to connect" → Add to connectSrc

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **CORS Error: "No 'Access-Control-Allow-Origin' header"**
```
Error: Access to fetch at 'http://localhost:5000/api/...' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution**:
- Check `ALLOWED_ORIGINS` in `.env` includes your frontend origin
- Make sure server is using `cors(corsOptions)`
- Check server logs for CORS blocking message

#### 2. **CSP Violation: "Refused to load script"**
```
Refused to load the script 'https://example.com/script.js' because it 
violates the following Content Security Policy directive: "script-src 'self'"
```

**Solution**:
- Add the domain to `scriptSrc` in CSP configuration
- For development, you can temporarily use `'unsafe-inline'`
- For production, use nonce-based CSP

#### 3. **Images Not Loading**
```
Refused to load the image 'data:image/png;base64,...' because it 
violates the following Content Security Policy directive: "img-src 'self'"
```

**Solution**:
- Add `data:` to `imgSrc` in CSP configuration
- Add `blob:` for blob URLs
- Add `https:` for external HTTPS images

#### 4. **API Calls Failing**
```
Refused to connect to 'https://api.example.com' because it violates 
the following Content Security Policy directive: "connect-src 'self'"
```

**Solution**:
- Add API domain to `connectSrc` in CSP configuration
- Check for Gemini API: `https://generativelanguage.googleapis.com`
- Check for GitHub API: `https://api.github.com`

#### 5. **Google Fonts Not Loading**
```
Refused to load the stylesheet 'https://fonts.googleapis.com/css...'
```

**Solution**:
- Add to `styleSrc`: `https://fonts.googleapis.com`
- Add to `fontSrc`: `https://fonts.gstatic.com`

---

## 📊 Security Benefits

### Protection Against:

1. **XSS (Cross-Site Scripting)** ✅
   - CSP prevents inline script execution
   - XSS filter enabled
   - Script sources whitelisted

2. **Clickjacking** ✅
   - X-Frame-Options: DENY
   - Site cannot be embedded in iframes

3. **MIME Sniffing** ✅
   - X-Content-Type-Options: nosniff
   - Browser respects declared content types

4. **Man-in-the-Middle** ✅
   - HSTS forces HTTPS
   - 1-year duration with subdomains

5. **Unauthorized Cross-Origin Access** ✅
   - CORS restricts origins
   - Credentials controlled
   - Methods and headers whitelisted

6. **Information Disclosure** ✅
   - X-Powered-By removed
   - Referrer policy controlled
   - Permissions policy restricts features

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Configure `ALLOWED_ORIGINS` with production domains
- [ ] Remove wildcard origins (use specific domains)
- [ ] Enable HTTPS on your server
- [ ] Test all API endpoints
- [ ] Check browser console for CSP violations
- [ ] Verify HSTS is working
- [ ] Test CORS from production frontend
- [ ] Remove or restrict security logger
- [ ] Consider submitting to HSTS preload list

### Production Configuration

```bash
# Production .env
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CLIENT_ORIGIN=https://yourdomain.com

# Optional: Use strict CORS
# (modify server.js to use strictCorsOptions instead of corsOptions)
```

### Monitoring

Add monitoring for:
- CORS blocking events (check logs)
- CSP violations (browser console)
- Failed authentication attempts
- Suspicious IP addresses
- Admin panel access

---

## 📚 Additional Resources

### Documentation
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: Security Headers](https://owasp.org/www-project-secure-headers/)

### Tools
- [Security Headers Checker](https://securityheaders.com/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [HSTS Preload](https://hstspreload.org/)

### Testing Tools
- Chrome DevTools (Network → Headers)
- [Postman](https://www.postman.com/) for API testing
- [OWASP ZAP](https://www.zaproxy.org/) for security testing

---

## ✅ Implementation Complete

### Summary
- ✅ Helmet.js security headers configured
- ✅ Content Security Policy (CSP) implemented
- ✅ HSTS enabled (1-year max age)
- ✅ Enhanced CORS with dynamic origin validation
- ✅ Wildcard subdomain support
- ✅ Environment-based configuration
- ✅ Security logging for development
- ✅ Documentation complete

### Next Steps
1. Test with frontend application
2. Check browser console for CSP violations
3. Verify all API calls work correctly
4. Test with different origins
5. Configure for production deployment

---

**Security is a journey, not a destination. Keep monitoring and updating!** 🔒
