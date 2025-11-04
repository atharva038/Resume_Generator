# 🔴 GitHub OAuth Redirect URI Fix

## Error Message
```
Be careful!
The redirect_uri is not associated with this application.
```

## What This Means
Your GitHub OAuth App's callback URL doesn't match what your backend is using.

---

## ✅ Quick Fix (2 minutes)

### Step 1: Go to GitHub OAuth Settings
1. Open: https://github.com/settings/developers
2. Find your OAuth App (the one with Client ID: `Ov23liwHCkEPmR4CViAM`)
3. Click **"Edit"** on that app

### Step 2: Update Authorization Callback URL

**REPLACE the existing callback URL with:**
```
http://localhost:5000/api/auth/github/callback
```

**Important Notes:**
- ✅ Must be **exactly** this URL
- ✅ Include `http://` at the start
- ✅ Include `/api/auth/github/callback` at the end
- ✅ No trailing slash
- ⚠️ Case-sensitive!

### Step 3: Save Changes
Click **"Update application"** at the bottom

### Step 4: Test Again
1. Go back to http://localhost:5173/login
2. Click "Continue with GitHub"
3. Should work now! ✅

---

## 🔍 What Should Be In GitHub Settings

**Your GitHub OAuth App should have these settings:**

| Field | Value |
|-------|-------|
| Application name | ATS Resume Generator (or your choice) |
| Homepage URL | `http://localhost:5173` |
| Authorization callback URL | `http://localhost:5000/api/auth/github/callback` |
| Application description | AI-powered resume builder (optional) |

---

## 🎯 Common Mistakes to Avoid

❌ **Wrong:** `http://localhost:5173/api/auth/github/callback` (frontend URL)  
❌ **Wrong:** `http://localhost:5000/auth/github/callback` (missing /api)  
❌ **Wrong:** `http://localhost:5000/api/auth/github/callback/` (trailing slash)  
✅ **Correct:** `http://localhost:5000/api/auth/github/callback`

---

## 📝 For Production Later

When you deploy to production, you'll need to:

1. **Add production callback URL** to GitHub OAuth App:
   ```
   https://your-backend-domain.com/api/auth/github/callback
   ```

2. **Update server/.env** for production:
   ```bash
   SERVER_URL=https://your-backend-domain.com
   CLIENT_URL=https://your-frontend-domain.com
   ```

**Tip:** GitHub allows multiple callback URLs, so you can add both development and production URLs!

---

## 🔄 If It Still Doesn't Work

1. **Double-check the URL** - Copy/paste from here to avoid typos
2. **Clear browser cache** - Cookies might be interfering
3. **Use incognito/private window** - Fresh start
4. **Check server is running** - Backend should be on port 5000
5. **Verify GitHub app** - Make sure you're editing the correct OAuth app

---

## ✅ Expected Flow After Fix

1. Click "Continue with GitHub"
2. Redirected to: `github.com/login/oauth/authorize?client_id=...`
3. Authorize the app
4. Redirected to: `http://localhost:5000/api/auth/github/callback?code=...`
5. Backend processes login
6. Redirected to: `http://localhost:5173/auth/callback?token=...`
7. You're logged in! 🎉

---

## 📸 Visual Guide

### GitHub OAuth App Settings Should Look Like This:

```
┌─────────────────────────────────────────────────────┐
│ OAuth Apps > ATS Resume Generator                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Application name                                     │
│ ┌────────────────────────────────────────────────┐ │
│ │ ATS Resume Generator                           │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ Homepage URL                                         │
│ ┌────────────────────────────────────────────────┐ │
│ │ http://localhost:5173                          │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ Authorization callback URL                           │
│ ┌────────────────────────────────────────────────┐ │
│ │ http://localhost:5000/api/auth/github/callback │ │ ← THIS IS KEY!
│ └────────────────────────────────────────────────┘ │
│                                                      │
│ [Update application]                                 │
└─────────────────────────────────────────────────────┘
```

---

**Action Required:** Update the callback URL in GitHub, then test again!

**Current Client ID:** `Ov23liwHCkEPmR4CViAM`
**Correct Callback:** `http://localhost:5000/api/auth/github/callback`
