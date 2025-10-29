# 🛡️ Security Headers Visual Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                     (http://localhost:5173)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                             │
│                   (http://localhost:5000)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1️⃣  SECURITY HEADERS (Helmet.js)                        │  │
│  │      ✓ Content-Security-Policy                           │  │
│  │      ✓ Strict-Transport-Security                         │  │
│  │      ✓ X-Frame-Options: DENY                             │  │
│  │      ✓ X-Content-Type-Options: nosniff                   │  │
│  │      ✓ X-XSS-Protection: 1; mode=block                   │  │
│  │      ✓ Referrer-Policy                                   │  │
│  │      ✓ Permissions-Policy                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │  2️⃣  ADDITIONAL SECURITY HEADERS                         │  │
│  │      ✓ Cache-Control for sensitive data                  │  │
│  │      ✓ Additional permissions policy                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │  3️⃣  CORS VALIDATION                                     │  │
│  │      ✓ Check origin against whitelist                    │  │
│  │      ✓ Validate credentials                              │  │
│  │      ✓ Check methods & headers                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │  4️⃣  RATE LIMITING                                       │  │
│  │      ✓ 100 requests per 15 minutes                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │  5️⃣  BODY PARSING & SANITIZATION                         │  │
│  │      ✓ JSON parsing (10kb limit)                         │  │
│  │      ✓ NoSQL injection protection                        │  │
│  │      ✓ XSS cleaning                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │  6️⃣  ROUTES & BUSINESS LOGIC                             │  │
│  │      ✓ Resume CRUD                                       │  │
│  │      ✓ Authentication                                    │  │
│  │      ✓ AI Enhancement                                    │  │
│  │      ✓ ATS Analysis                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Headers Protection Matrix

```
╔═══════════════════════════════════════════════════════════════╗
║                    ATTACK VECTORS                             ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  1. XSS (Cross-Site Scripting) 🚫                            ║
║     ┌──────────────────────────────────────────┐             ║
║     │ Attacker tries to inject:                │             ║
║     │ <script>steal_cookies()</script>         │             ║
║     └──────────────────────────────────────────┘             ║
║                    ⚡ BLOCKED BY ⚡                           ║
║     ✅ Content-Security-Policy (scriptSrc)                   ║
║     ✅ X-XSS-Protection                                      ║
║     ✅ XSS-Clean middleware                                  ║
║                                                               ║
║─────────────────────────────────────────────────────────────  ║
║                                                               ║
║  2. Clickjacking 🚫                                          ║
║     ┌──────────────────────────────────────────┐             ║
║     │ Attacker embeds site in iframe:          │             ║
║     │ <iframe src="yoursite.com"></iframe>     │             ║
║     └──────────────────────────────────────────┘             ║
║                    ⚡ BLOCKED BY ⚡                           ║
║     ✅ X-Frame-Options: DENY                                 ║
║     ✅ CSP: frame-ancestors 'none'                           ║
║                                                               ║
║─────────────────────────────────────────────────────────────  ║
║                                                               ║
║  3. MIME Sniffing Attack 🚫                                  ║
║     ┌──────────────────────────────────────────┐             ║
║     │ Browser tries to execute .txt as .js     │             ║
║     │ Content-Type: text/plain → executed      │             ║
║     └──────────────────────────────────────────┘             ║
║                    ⚡ BLOCKED BY ⚡                           ║
║     ✅ X-Content-Type-Options: nosniff                       ║
║                                                               ║
║─────────────────────────────────────────────────────────────  ║
║                                                               ║
║  4. Man-in-the-Middle (SSL Stripping) 🚫                     ║
║     ┌──────────────────────────────────────────┐             ║
║     │ Attacker downgrades HTTPS → HTTP         │             ║
║     │ Intercepts traffic in plain text         │             ║
║     └──────────────────────────────────────────┘             ║
║                    ⚡ BLOCKED BY ⚡                           ║
║     ✅ Strict-Transport-Security (HSTS)                      ║
║     ✅ 1-year max-age + includeSubDomains                    ║
║                                                               ║
║─────────────────────────────────────────────────────────────  ║
║                                                               ║
║  5. Unauthorized Cross-Origin Access 🚫                      ║
║     ┌──────────────────────────────────────────┐             ║
║     │ Evil site tries to call API:             │             ║
║     │ fetch('yourapi.com/data')                │             ║
║     └──────────────────────────────────────────┘             ║
║                    ⚡ BLOCKED BY ⚡                           ║
║     ✅ CORS origin validation                                ║
║     ✅ Credential checks                                     ║
║                                                               ║
║─────────────────────────────────────────────────────────────  ║
║                                                               ║
║  6. Information Disclosure 🚫                                ║
║     ┌──────────────────────────────────────────┐             ║
║     │ X-Powered-By: Express                    │             ║
║     │ Server: Node.js v18.0.0                  │             ║
║     └──────────────────────────────────────────┘             ║
║                    ⚡ BLOCKED BY ⚡                           ║
║     ✅ hidePoweredBy: true                                   ║
║     ✅ Minimal error messages                                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## CSP (Content Security Policy) Flow

```
┌────────────────────────────────────────────────────────────────┐
│                      BROWSER LOADS PAGE                        │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Receives CSP Header:         │
         │  Content-Security-Policy:     │
         │    default-src 'self';        │
         │    script-src 'self' ...      │
         │    style-src 'self' ...       │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Browser Parses Resources     │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────┐
         │  Each resource checked:       │
         └───────────────┬───────────────┘
                         │
         ┌───────────────▼───────────────────────────────┐
         │                                               │
    ┌────▼─────┐     ┌──────────┐     ┌──────────────┐  │
    │ Scripts  │     │  Styles  │     │   Images     │  │
    └────┬─────┘     └────┬─────┘     └──────┬───────┘  │
         │                │                   │          │
         ▼                ▼                   ▼          │
    ┌─────────────────────────────────────────────┐     │
    │  Check against CSP directive:               │     │
    │  ✓ Is domain allowed?                       │     │
    │  ✓ Is inline allowed?                       │     │
    │  ✓ Is protocol allowed (https)?             │     │
    └─────────────┬───────────────────────────────┘     │
                  │                                      │
        ┌─────────▼─────────┐                           │
        │   ALLOWED? ✅     │                           │
        └─────────┬─────────┘                           │
                  │                                      │
         ┌────────▼────────┐                            │
         │  Load Resource  │                            │
         └─────────────────┘                            │
                                                         │
        ┌──────────────────┐                            │
        │   BLOCKED? 🚫    │◄───────────────────────────┘
        └─────────┬────────┘
                  │
         ┌────────▼────────────────┐
         │  Console Error:         │
         │  "CSP violation:        │
         │   Refused to load..."   │
         └─────────────────────────┘
```

---

## CORS Validation Flow

```
┌──────────────────────────────────────────────────────────────┐
│                 CLIENT MAKES REQUEST                         │
│              Origin: http://localhost:5173                   │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────┐
         │  Preflight Request (OPTIONS)      │
         │  ────────────────────────────►    │
         │  Origin: http://localhost:5173    │
         │  Access-Control-Request-Method    │
         │  Access-Control-Request-Headers   │
         └───────────────────────────────────┘
                             │
                             ▼
         ┌────────────────────────────────────────────┐
         │  SERVER: Check ALLOWED_ORIGINS             │
         │  ─────────────────────────────────────     │
         │  const allowedOrigins = [                  │
         │    'http://localhost:5173',                │
         │    'http://localhost:3000'                 │
         │  ];                                        │
         └───────────────┬────────────────────────────┘
                         │
         ┌───────────────▼────────────────┐
         │  Is origin in whitelist?       │
         └───────────────┬────────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
         ✅ YES                    🚫 NO
            │                         │
            ▼                         ▼
┌─────────────────────┐   ┌────────────────────────┐
│  Send CORS Headers  │   │  Reject Request        │
│  ──────────────────  │   │  ─────────────────     │
│  Access-Control-    │   │  ⚠️  CORS Error        │
│    Allow-Origin     │   │  "Not allowed by CORS" │
│  Access-Control-    │   │                        │
│    Allow-Methods    │   │  Logged in console:    │
│  Access-Control-    │   │  "Blocked: evil.com"   │
│    Allow-Headers    │   └────────────────────────┘
│  Access-Control-    │
│    Allow-Credentials│
└──────────┬──────────┘
           │
           ▼
┌────────────────────┐
│  Client Receives   │
│  Successful        │
│  Response ✅       │
└────────────────────┘
```

---

## Security Headers in Action (Browser DevTools)

```
┌─────────────────────────────────────────────────────────────┐
│  Chrome DevTools → Network Tab → Response Headers          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ content-security-policy:                                │
│      default-src 'self';                                    │
│      script-src 'self' 'unsafe-inline' 'unsafe-eval';       │
│      style-src 'self' 'unsafe-inline'                       │
│          https://fonts.googleapis.com;                      │
│      font-src 'self' data: https://fonts.gstatic.com;       │
│      img-src 'self' data: blob: https:;                     │
│      connect-src 'self'                                     │
│          https://generativelanguage.googleapis.com          │
│          http://localhost:5173;                             │
│      frame-src 'none';                                      │
│      object-src 'none'                                      │
│                                                             │
│  ✅ strict-transport-security:                              │
│      max-age=31536000; includeSubDomains; preload           │
│                                                             │
│  ✅ x-frame-options: DENY                                   │
│                                                             │
│  ✅ x-content-type-options: nosniff                         │
│                                                             │
│  ✅ x-xss-protection: 1; mode=block                         │
│                                                             │
│  ✅ referrer-policy: strict-origin-when-cross-origin        │
│                                                             │
│  ✅ permissions-policy:                                     │
│      geolocation=(), microphone=(), camera=(),              │
│      payment=(), usb=(), magnetometer=(),                   │
│      gyroscope=(), accelerometer=()                         │
│                                                             │
│  ✅ access-control-allow-origin:                            │
│      http://localhost:5173                                  │
│                                                             │
│  ✅ access-control-allow-credentials: true                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Configuration Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      .env FILE                               │
├──────────────────────────────────────────────────────────────┤
│  ALLOWED_ORIGINS=http://localhost:5173,                     │
│                  http://localhost:3000                       │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────┐
         │  server/middleware/               │
         │  security.middleware.js           │
         │  ─────────────────────────         │
         │  const allowedOrigins =           │
         │    process.env.ALLOWED_ORIGINS    │
         │      .split(',')                  │
         │      .map(o => o.trim());         │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │  Parse origins:                   │
         │  ['http://localhost:5173',        │
         │   'http://localhost:3000']        │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │  Apply to CORS middleware         │
         │  ──────────────────────────────    │
         │  app.use(cors({                   │
         │    origin: (origin, callback) => {│
         │      if (allowedOrigins.includes  │
         │          (origin)) {               │
         │        callback(null, true);      │
         │      }                             │
         │    }                               │
         │  }));                              │
         └────────────────────────────────────┘
```

---

## Wildcard Origin Support

```
┌──────────────────────────────────────────────────────────────┐
│  Configuration: ALLOWED_ORIGINS=https://*.example.com        │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────┐
         │  Request from:                    │
         │  https://app.example.com          │
         └───────────────┬───────────────────┘
                         │
                         ▼
         ┌────────────────────────────────────────┐
         │  Convert wildcard to regex:            │
         │  ───────────────────────────────────   │
         │  Pattern: https://*.example.com        │
         │  Regex:   ^https://.*\.example\.com$   │
         └───────────────┬────────────────────────┘
                         │
                         ▼
         ┌────────────────────────────────────┐
         │  Test origin against regex:        │
         │  https://app.example.com           │
         │    .match(/^https:\/\/.*\.example  │
         │           \.com$/)                 │
         └───────────────┬────────────────────┘
                         │
            ┌────────────┴──────────────┐
            │                           │
         ✅ MATCH                    🚫 NO MATCH
            │                           │
            ▼                           ▼
    ┌───────────────┐         ┌──────────────────┐
    │  Allow Access │         │  Block Request   │
    └───────────────┘         └──────────────────┘

Examples that MATCH:
  ✅ https://api.example.com
  ✅ https://app.example.com
  ✅ https://dashboard.example.com

Examples that DON'T MATCH:
  🚫 https://example.com (no subdomain)
  🚫 http://app.example.com (http, not https)
  🚫 https://app.different.com (different domain)
```

---

## Security Layers Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    DEFENSE IN DEPTH                          │
└──────────────────────────────────────────────────────────────┘

    🛡️ Layer 1: Security Headers (Helmet.js)
    ├── CSP: Prevents XSS and code injection
    ├── HSTS: Forces HTTPS
    ├── X-Frame-Options: Prevents clickjacking
    ├── X-Content-Type: Prevents MIME sniffing
    └── Permissions Policy: Restricts browser features

    🛡️ Layer 2: CORS (Cross-Origin Resource Sharing)
    ├── Origin validation (whitelist)
    ├── Wildcard subdomain support
    ├── Credential control
    └── Method & header validation

    🛡️ Layer 3: Rate Limiting
    ├── 100 requests per 15 minutes
    ├── Per-IP tracking
    └── Prevents brute force

    🛡️ Layer 4: Input Validation
    ├── express-validator
    ├── Custom validation rules
    └── Schema validation

    🛡️ Layer 5: Data Sanitization
    ├── NoSQL injection protection (mongoSanitize)
    ├── XSS cleaning (xss-clean)
    └── Body size limits (10kb)

    🛡️ Layer 6: Authentication & Authorization
    ├── JWT tokens
    ├── Password hashing (bcrypt)
    ├── Admin role checks
    └── Session management

Each layer provides protection, creating multiple barriers
against different attack vectors! 🔒
```

---

## Testing Security Headers

```
┌──────────────────────────────────────────────────────────────┐
│               TESTING SECURITY HEADERS                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Browser DevTools                                         │
│     ┌────────────────────────────────────────┐              │
│     │ F12 → Network → Select request         │              │
│     │ → Headers tab → Response Headers        │              │
│     │                                         │              │
│     │ Look for:                               │              │
│     │ ✓ content-security-policy              │              │
│     │ ✓ strict-transport-security            │              │
│     │ ✓ x-frame-options                      │              │
│     │ ✓ x-content-type-options               │              │
│     └────────────────────────────────────────┘              │
│                                                              │
│  2. curl Command                                             │
│     ┌────────────────────────────────────────┐              │
│     │ $ curl -I http://localhost:5000        │              │
│     │                                         │              │
│     │ HTTP/1.1 200 OK                        │              │
│     │ Content-Security-Policy: ...           │              │
│     │ Strict-Transport-Security: ...         │              │
│     └────────────────────────────────────────┘              │
│                                                              │
│  3. Online Tools                                             │
│     ┌────────────────────────────────────────┐              │
│     │ 🌐 securityheaders.com                 │              │
│     │    Enter your domain                   │              │
│     │    Get security rating (A-F)           │              │
│     │                                         │              │
│     │ 🌐 csp-evaluator.withgoogle.com        │              │
│     │    Test CSP configuration              │              │
│     └────────────────────────────────────────┘              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## ✅ Complete Security Stack

```
╔═══════════════════════════════════════════════════════════════╗
║              SECURITY IMPLEMENTATION STATUS                   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ✅ Layer 1: Input Validation                                ║
║     └─ express-validator + custom rules                      ║
║                                                               ║
║  ✅ Layer 2: Rate Limiting                                   ║
║     └─ express-rate-limit (100 req/15min)                    ║
║                                                               ║
║  ✅ Layer 3: Data Sanitization                               ║
║     ├─ express-mongo-sanitize (NoSQL injection)              ║
║     └─ xss-clean (XSS attacks)                               ║
║                                                               ║
║  ✅ Layer 4: Security Headers + CORS                         ║
║     ├─ helmet (CSP, HSTS, X-Frame, etc.)                     ║
║     └─ Enhanced CORS with origin validation                  ║
║                                                               ║
║  🔄 Layer 5: Authentication & Authorization                  ║
║     ├─ JWT tokens ✅                                         ║
║     ├─ Password hashing ✅                                   ║
║     └─ Role-based access ✅                                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🎉 APPLICATION IS NOW SECURED WITH MULTIPLE LAYERS! 🎉
```

---

**Remember**: Security is not a one-time setup, but an ongoing process!
Keep your dependencies updated and monitor for vulnerabilities. 🔒
