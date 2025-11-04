# OAuth Authentication Implementation - Complete Guide 🔐

## Overview

This guide covers the complete implementation of **Google** and **GitHub** OAuth 2.0 authentication using **Passport.js** in the ATS Resume Generator application.

---

## 🎯 Features Implemented

✅ **Google OAuth Login** - Sign in with Google account  
✅ **GitHub OAuth Login** - Sign in with GitHub account  
✅ **Account Linking** - Link OAuth providers to existing accounts  
✅ **Automatic User Creation** - New users created on first OAuth login  
✅ **Profile Picture Support** - Auto-fetch profile pictures from OAuth providers  
✅ **JWT Token Generation** - Seamless integration with existing JWT auth  
✅ **Session Management** - Express session for OAuth flow  
✅ **Responsive UI** - Beautiful OAuth buttons on login page  

---

## 📦 Packages Installed

### Backend (server/)
```bash
npm install passport passport-google-oauth20 passport-github2 express-session
```

### Frontend (client/)
```bash
npm install react-icons
```

---

## 🔧 Backend Implementation

### 1. User Model Updates (`server/models/User.model.js`)

**New Fields Added:**
```javascript
{
  // OAuth Provider IDs
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  githubId: {
    type: String,
    sparse: true,
    unique: true,
  },
  
  // Provider type
  provider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  },
  
  // Profile picture from OAuth
  profilePicture: {
    type: String,
  },
  
  // Password optional for OAuth users
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.githubId;
    },
    minlength: 6,
  },
}
```

**Key Changes:**
- Password is **optional** for OAuth users
- Added `googleId` and `githubId` for provider identification
- Added `provider` field to track authentication method
- Added `profilePicture` to store OAuth profile images

---

### 2. Passport Configuration (`server/config/passport.config.js`)

**Google Strategy:**
```javascript
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user exists
      // Link accounts if email matches
      // Create new user if needed
    }
  )
);
```

**GitHub Strategy:**
```javascript
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user exists
      // Link accounts if email matches
      // Create new user if needed
    }
  )
);
```

**Features:**
- ✅ Automatic account linking by email
- ✅ Profile picture extraction
- ✅ Last login tracking
- ✅ Error handling

---

### 3. OAuth Routes (`server/routes/auth.routes.js`)

**Google Routes:**
```javascript
// Initiate Google OAuth
GET /api/auth/google

// Google callback
GET /api/auth/google/callback
```

**GitHub Routes:**
```javascript
// Initiate GitHub OAuth
GET /api/auth/github

// GitHub callback
GET /api/auth/github/callback
```

**Flow:**
1. User clicks "Continue with Google/GitHub"
2. Redirected to OAuth provider
3. User authorizes the app
4. Provider redirects to callback URL
5. JWT token generated
6. User redirected to frontend with token

---

### 4. Server Configuration (`server/server.js`)

**Session Middleware:**
```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
```

**Passport Initialization:**
```javascript
app.use(passport.initialize());
app.use(passport.session());
```

---

## 🎨 Frontend Implementation

### 1. OAuth Callback Page (`client/src/pages/AuthCallback.jsx`)

Handles OAuth redirects from backend:
- Extracts token from URL
- Fetches user data
- Updates AuthContext
- Redirects to dashboard

**Route:** `/auth/callback`

---

### 2. Login Page Updates (`client/src/pages/Login.jsx`)

**OAuth Buttons Added:**

```jsx
{/* Google OAuth */}
<a
  href={`${import.meta.env.VITE_API_URL}/auth/google`}
  className="oauth-button"
>
  <FcGoogle /> Continue with Google
</a>

{/* GitHub OAuth */}
<a
  href={`${import.meta.env.VITE_API_URL}/auth/github`}
  className="oauth-button"
>
  <Github /> Continue with GitHub
</a>
```

---

## 🔐 Environment Variables Setup

### Backend Environment Variables (`.env`)

```bash
# ==========================================
# OAUTH CONFIGURATION
# ==========================================

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Session Secret (for Passport)
SESSION_SECRET=your-random-session-secret-here

# Server URL (for OAuth callbacks)
SERVER_URL=http://localhost:5000
# Production: https://your-backend-domain.com

# Client URL (for redirects after OAuth)
CLIENT_URL=http://localhost:5173
# Production: https://your-frontend-domain.com
```

### Frontend Environment Variables (`.env`)

```bash
# Backend API URL
VITE_API_URL=http://localhost:5000/api
# Production: https://your-backend-domain.com/api
```

---

## 📝 How to Get OAuth Credentials

### Google OAuth Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project:**
   - Click "Select a project" → "New Project"
   - Name: "ATS Resume Generator"
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Configure OAuth consent screen first (if prompted)
   - Application type: **Web application**
   - Name: "ATS Resume Generator"

5. **Add Authorized Redirect URIs:**
   ```
   Development:
   http://localhost:5000/api/auth/google/callback
   
   Production:
   https://your-backend-domain.com/api/auth/google/callback
   ```

6. **Copy Credentials:**
   - Client ID → `GOOGLE_CLIENT_ID`
   - Client Secret → `GOOGLE_CLIENT_SECRET`

---

### GitHub OAuth Setup

1. **Go to GitHub Developer Settings:**
   - Visit: https://github.com/settings/developers

2. **Create New OAuth App:**
   - Click "New OAuth App"
   - Application name: "ATS Resume Generator"
   - Homepage URL: `http://localhost:5173` (dev) or your domain
   - Application description: "AI-powered resume builder"

3. **Add Authorization Callback URL:**
   ```
   Development:
   http://localhost:5000/api/auth/github/callback
   
   Production:
   https://your-backend-domain.com/api/auth/github/callback
   ```

4. **Copy Credentials:**
   - Client ID → `GITHUB_CLIENT_ID`
   - Client Secret → `GITHUB_CLIENT_SECRET`

---

## 🚀 Testing OAuth Locally

### 1. Start Backend Server
```bash
cd server
npm start
```

### 2. Start Frontend
```bash
cd client
npm run dev
```

### 3. Test OAuth Flow

1. Go to `http://localhost:5173/login`
2. Click "Continue with Google" or "Continue with GitHub"
3. Authorize the application
4. You should be redirected back and logged in

---

## 🔄 OAuth Flow Diagram

```
┌─────────┐                ┌──────────┐                ┌─────────┐
│ Client  │                │  Server  │                │ OAuth   │
│(Browser)│                │(Backend) │                │Provider │
└────┬────┘                └────┬─────┘                └────┬────┘
     │                          │                           │
     │ 1. Click OAuth Button    │                           │
     ├─────────────────────────>│                           │
     │                          │                           │
     │ 2. Redirect to Provider  │                           │
     ├──────────────────────────┴──────────────────────────>│
     │                          │                           │
     │ 3. User Authorizes       │                           │
     │                          │                           │
     │ 4. Redirect to Callback  │                           │
     │<─────────────────────────┴───────────────────────────┤
     │                          │                           │
     │                          │ 5. Verify & Get Profile   │
     │                          ├──────────────────────────>│
     │                          │                           │
     │                          │ 6. Return User Data       │
     │                          │<──────────────────────────┤
     │                          │                           │
     │ 7. Generate JWT Token    │                           │
     │                          │                           │
     │ 8. Redirect with Token   │                           │
     │<─────────────────────────┤                           │
     │                          │                           │
     │ 9. Store Token & Login   │                           │
     │                          │                           │
     └──────────────────────────┴───────────────────────────┘
```

---

## 🛡️ Security Features

✅ **HTTPS in Production** - OAuth requires HTTPS  
✅ **Secure Cookies** - HttpOnly, Secure flags  
✅ **CSRF Protection** - Built into OAuth flow  
✅ **JWT Tokens** - Stateless authentication  
✅ **Session Expiry** - 24-hour sessions  
✅ **Account Linking** - Safe email-based linking  

---

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution:** Make sure the callback URL in OAuth provider settings matches exactly:
```
http://localhost:5000/api/auth/google/callback
```

### Error: "The 'X-Forwarded-For' header is set"
**Solution:** Already fixed with `app.set("trust proxy", 1)` in server.js

### Error: "Cannot read properties of undefined (reading 'token')"
**Solution:** Check that backend is generating token correctly in callback route

### Users Not Being Created
**Solution:** 
1. Check MongoDB connection
2. Verify User model has all OAuth fields
3. Check console logs for errors

---

## 📊 Database Schema

**Example OAuth User Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@gmail.com",
  "name": "John Doe",
  "provider": "google",
  "googleId": "107824856874564329872",
  "profilePicture": "https://lh3.googleusercontent.com/a/...",
  "role": "user",
  "status": "active",
  "lastLogin": "2025-11-04T10:30:00.000Z",
  "createdAt": "2025-11-04T10:30:00.000Z",
  "updatedAt": "2025-11-04T10:30:00.000Z"
}
```

---

## 🎯 Next Steps

### Optional Enhancements:

1. **Add More Providers:**
   - LinkedIn OAuth
   - Microsoft OAuth
   - Apple Sign In

2. **Profile Management:**
   - Allow users to link/unlink accounts
   - Show connected providers in settings
   - Update profile picture from OAuth

3. **Enhanced Security:**
   - Two-factor authentication
   - Login notifications
   - Session management page

4. **Analytics:**
   - Track OAuth signup rates
   - Provider popularity metrics
   - Conversion tracking

---

## 📚 Resources

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Express Session Docs](https://github.com/expressjs/session)

---

## 🎉 Deployment Notes

### Production Checklist:

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS for both frontend and backend
- [ ] Update OAuth callback URLs to production domains
- [ ] Set `SESSION_SECRET` to a strong random string
- [ ] Enable `trust proxy` in Express (already done)
- [ ] Update CORS settings for production domain
- [ ] Test OAuth flow in production environment

---

**Date Implemented:** November 4, 2025  
**Status:** ✅ Complete and Ready for Testing  
**Version:** 1.0.0
