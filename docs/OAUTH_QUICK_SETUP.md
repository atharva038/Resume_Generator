# OAuth Quick Setup Guide 🚀

## Step 1: Get OAuth Credentials (5 minutes)

### Google OAuth
1. Go to https://console.cloud.google.com/
2. Create new project "ATS Resume Generator"
3. Enable "Google+ API"
4. Create OAuth 2.0 Client ID
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret

### GitHub OAuth
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Add callback: `http://localhost:5000/api/auth/github/callback`
4. Copy Client ID and Secret

---

## Step 2: Add Environment Variables

### Backend `.env` (server/.env)
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Session Secret (generate a random string)
SESSION_SECRET=your-random-secret-here-change-this

# URLs
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

### Frontend `.env` (client/.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## Step 3: Start Servers

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
cd client
npm run dev
```

---

## Step 4: Test OAuth

1. Go to http://localhost:5173/login
2. Click "Continue with Google" or "Continue with GitHub"
3. Authorize the app
4. You should be logged in! 🎉

---

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure callback URL matches exactly in OAuth settings
- Check: `http://localhost:5000/api/auth/google/callback`

### "Cannot connect to server"
- Verify backend is running on port 5000
- Check VITE_API_URL in client/.env

### "User not created"
- Check MongoDB connection
- Look at server console for errors

---

## Production Deployment

### Update Environment Variables

**Backend:**
```bash
SERVER_URL=https://your-backend-domain.com
CLIENT_URL=https://your-frontend-domain.com
```

**OAuth Providers:**
- Add production callback URLs
- Google: `https://your-backend-domain.com/api/auth/google/callback`
- GitHub: `https://your-backend-domain.com/api/auth/github/callback`

---

## Files Modified

✅ `server/models/User.model.js` - Added OAuth fields  
✅ `server/config/passport.config.js` - Passport strategies  
✅ `server/routes/auth.routes.js` - OAuth routes  
✅ `server/server.js` - Session & Passport init  
✅ `client/src/pages/AuthCallback.jsx` - Callback handler  
✅ `client/src/pages/Login.jsx` - OAuth buttons  
✅ `client/src/App.jsx` - Callback route  

---

**Need Help?** Check `docs/OAUTH_IMPLEMENTATION.md` for full details!
