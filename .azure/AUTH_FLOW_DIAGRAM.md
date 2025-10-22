# 🔐 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        USER ACCESS FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   User Visits    │
                    │  Protected Page  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  ProtectedRoute  │
                    │    Component     │
                    └────────┬─────────┘
                             │
                  ┌──────────▼──────────┐
                  │  Check Auth Status  │
                  └──────────┬──────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
      ┌───────▼──────┐              ┌──────▼───────┐
      │  Authenticated│              │Not Authenticated│
      │   (has token) │              │  (no token)  │
      └───────┬───────┘              └──────┬───────┘
              │                             │
      ┌───────▼────────┐           ┌────────▼─────────┐
      │ Show Protected │           │  Redirect to     │
      │     Page       │           │   /login         │
      │   ✅ Access    │           │  (with from URL) │
      └────────────────┘           └────────┬─────────┘
                                            │
                                   ┌────────▼─────────┐
                                   │   Login Page     │
                                   │  Shows Message:  │
                                   │ "Auth Required"  │
                                   └────────┬─────────┘
                                            │
                                   ┌────────▼─────────┐
                                   │ User Enters      │
                                   │ Credentials      │
                                   └────────┬─────────┘
                                            │
                                   ┌────────▼─────────┐
                                   │ Submit to Backend│
                                   │ POST /api/auth/  │
                                   │     login        │
                                   └────────┬─────────┘
                                            │
                              ┌─────────────┴─────────────┐
                              │                           │
                      ┌───────▼──────┐           ┌────────▼────────┐
                      │  Success ✅   │           │   Failed ❌     │
                      │ Token Saved   │           │ Show Error      │
                      │ in localStorage│          │ Stay on Login   │
                      └───────┬───────┘           └─────────────────┘
                              │
                      ┌───────▼────────┐
                      │ Redirect to    │
                      │ Original Page  │
                      │ (from URL) or  │
                      │  /dashboard    │
                      └────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND API PROTECTION                              │
└─────────────────────────────────────────────────────────────────────────┘

            ┌───────────────────┐
            │  Frontend Request │
            │  with JWT Token   │
            │  in Authorization │
            │      Header       │
            └─────────┬─────────┘
                      │
            ┌─────────▼─────────┐
            │   Express Route   │
            │  authenticateToken│
            │    Middleware     │
            └─────────┬─────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
  ┌──────▼──────┐          ┌──────▼──────┐
  │ Valid Token │          │Invalid/Missing│
  │     ✅      │          │    Token ❌   │
  └──────┬──────┘          └──────┬───────┘
         │                        │
  ┌──────▼──────┐          ┌──────▼───────┐
  │   Decode    │          │   Return     │
  │   Token     │          │ 401/403 Error│
  │ Extract User│          │ "Unauthorized"│
  └──────┬──────┘          └──────────────┘
         │
  ┌──────▼──────┐
  │  Attach     │
  │ req.user =  │
  │ decoded     │
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │  Execute    │
  │ Controller  │
  │  Function   │
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │   Return    │
  │  Response   │
  │  with Data  │
  └─────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      PROTECTED FEATURES MAP                              │
└─────────────────────────────────────────────────────────────────────────┘

    Frontend Pages              Backend APIs                 Database
    ===============            =============                ==========
    
    📤 /upload          →    POST /api/resume/upload    →   Resume
       (Protected)                (Protected)                 Collection
         ↓
    ✏️ /editor          →    POST /api/resume/save     →   Resume
       (Protected)                (Protected)                 Collection
         ↓
    🎨 /templates       →    (Frontend Only)           →   localStorage
       (Protected)                                           only
         ↓
    📊 /ats-analyzer    →    POST /api/ats/analyze     →   Temporary
       (Protected)                (Protected)                 Analysis
         ↓
    ✉️ /contact         →    POST /api/contact         →   Contact
       (Protected)                (Protected)                 Collection
         ↓
    📋 /dashboard       →    GET /api/resume/list      →   Resume
       (Protected)                (Protected)                 Collection


┌─────────────────────────────────────────────────────────────────────────┐
│                      TOKEN FLOW DIAGRAM                                  │
└─────────────────────────────────────────────────────────────────────────┘

    User Login
        │
        ▼
    ┌──────────────────┐
    │ POST /api/auth/  │
    │     login        │
    │                  │
    │ email: xxx       │
    │ password: xxx    │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │  Backend Verifies│
    │   Credentials    │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │  Generate JWT    │
    │  Token with      │
    │  user.id, email  │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │  Return Token    │
    │ {token: "xxx",   │
    │  user: {...}}    │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │  Frontend Stores │
    │  in localStorage │
    │  key: "token"    │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │ All API Requests │
    │ Include Header:  │
    │ Authorization:   │
    │ Bearer <token>   │
    └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      ERROR HANDLING FLOW                                 │
└─────────────────────────────────────────────────────────────────────────┘

    API Request with Token
            │
    ┌───────▼───────┐
    │ Middleware    │
    │ Checks Token  │
    └───────┬───────┘
            │
    ┌───────▼────────────────────────────────────────┐
    │                                                 │
    │  Token Scenarios:                              │
    │                                                 │
    │  1. ❌ No token provided                       │
    │     → 401 "No token provided"                  │
    │                                                 │
    │  2. ❌ Invalid token format                    │
    │     → 403 "Invalid token"                      │
    │                                                 │
    │  3. ❌ Expired token                           │
    │     → 403 "Token expired"                      │
    │                                                 │
    │  4. ❌ Token verification failed               │
    │     → 403 "Token verification failed"          │
    │                                                 │
    │  5. ✅ Valid token                             │
    │     → Proceed to controller                    │
    │                                                 │
    └─────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                                   │
└─────────────────────────────────────────────────────────────────────────┘

    main.jsx
      │
      ├─ BrowserRouter
      │    │
      │    ├─ AuthProvider (provides auth context)
      │         │
      │         └─ App.jsx
      │              │
      │              ├─ DarkModeProvider
      │              │    │
      │              │    ├─ ScrollToTop
      │              │    │
      │              │    └─ Routes
      │              │         │
      │              │         ├─ Layout
      │              │         │    │
      │              │         │    ├─ Public Routes
      │              │         │    │    ├─ Home
      │              │         │    │    ├─ Login
      │              │         │    │    └─ Register
      │              │         │    │
      │              │         │    └─ Protected Routes
      │              │         │         │
      │              │         │         ├─ ProtectedRoute
      │              │         │         │    └─ Upload
      │              │         │         │
      │              │         │         ├─ ProtectedRoute
      │              │         │         │    └─ Editor
      │              │         │         │
      │              │         │         ├─ ProtectedRoute
      │              │         │         │    └─ Templates
      │              │         │         │
      │              │         │         ├─ ProtectedRoute
      │              │         │         │    └─ ATSAnalyzer
      │              │         │         │
      │              │         │         ├─ ProtectedRoute
      │              │         │         │    └─ Contact
      │              │         │         │
      │              │         │         └─ ProtectedRoute
      │              │         │              └─ Dashboard


┌─────────────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                                       │
└─────────────────────────────────────────────────────────────────────────┘

    Layer 1: Frontend Route Protection
    ├─ ProtectedRoute Component
    ├─ Checks useAuth().user
    └─ Redirects to /login if not authenticated
    
    Layer 2: API Request Headers
    ├─ axios interceptor adds Authorization header
    ├─ Token from localStorage
    └─ Format: "Bearer <token>"
    
    Layer 3: Backend Middleware
    ├─ authenticateToken middleware
    ├─ Verifies JWT signature
    ├─ Checks expiration
    └─ Attaches user to req.user
    
    Layer 4: Controller Logic
    ├─ Access req.user.id
    ├─ User-specific data queries
    └─ Prevents cross-user access

    Layer 5: Database Queries
    ├─ Filter by userId
    ├─ Ensure user owns data
    └─ Prevent unauthorized data access


┌─────────────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT                                      │
└─────────────────────────────────────────────────────────────────────────┘

    AuthContext State
    ├─ user: User object or null
    ├─ loading: Boolean (initial auth check)
    └─ functions: login(), register(), logout()
    
    localStorage
    └─ token: JWT string
    
    API Service
    └─ axios instance with interceptor
        ├─ Adds Authorization header
        └─ Handles 401/403 errors
```
