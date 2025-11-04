# 🚀 Quick Deployment Checklist

Use this checklist to deploy your ATS Resume Generator to production.

## ✅ Pre-Deployment (Complete These First)

### MongoDB Setup
- [ ] Create MongoDB Atlas account at https://cloud.mongodb.com
- [ ] Create a new cluster (free tier M0)
- [ ] Create database user with password
- [ ] Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
- [ ] Copy connection string from Connect → Connect your application
- [ ] Test connection locally first

### API Keys
- [ ] Get Google Gemini API key from https://makersuite.google.com/app/apikey
- [ ] (Optional) Get Adzuna API credentials from https://developer.adzuna.com/
- [ ] Set up Gmail App Password:
  - Enable 2FA on Gmail
  - Go to https://myaccount.google.com/apppasswords
  - Generate app password for "Mail"

### Code Preparation
- [ ] Push all code to GitHub
- [ ] Verify `.env` files are in `.gitignore`
- [ ] Test application locally (`npm run dev`)
- [ ] Verify build works (`cd client && npm run build`)

---

## 🔧 Backend Deployment (Render.com)

### Initial Setup
1. [ ] Go to https://render.com and sign in with GitHub
2. [ ] Click "New +" → "Web Service"
3. [ ] Select your repository
4. [ ] Fill in:
   - **Name**: `ats-resume-backend`
   - **Region**: Choose closest to you (e.g., Oregon)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: Free

### Environment Variables
5. [ ] Click "Advanced" → "Add Environment Variable"
6. [ ] Add all variables from `.env.production.example`:
   - [ ] NODE_ENV=production
   - [ ] PORT=5000
   - [ ] MONGODB_URI (from MongoDB Atlas)
   - [ ] GEMINI_API_KEY
   - [ ] JWT_SECRET (generate random 32+ char string)
   - [ ] CLIENT_ORIGIN (will update after Vercel)
   - [ ] ALLOWED_ORIGINS (will update after Vercel)
   - [ ] CLIENT_URL (will update after Vercel)
   - [ ] EMAIL_SERVICE=gmail
   - [ ] EMAIL_USER (your Gmail)
   - [ ] EMAIL_PASSWORD (Gmail app password)

7. [ ] Click "Create Web Service"
8. [ ] Wait for deployment (5-10 minutes)
9. [ ] Copy your backend URL (e.g., https://ats-resume-backend.onrender.com)

### Test Backend
10. [ ] Visit: `https://your-backend-url.onrender.com/api/health`
11. [ ] Should see: `{"status":"ok","message":"ATS Resume API is running"}`

---

## 🌐 Frontend Deployment (Vercel.com)

### Initial Setup
1. [ ] Go to https://vercel.com and sign in with GitHub
2. [ ] Click "Add New..." → "Project"
3. [ ] Import your GitHub repository
4. [ ] Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

### Environment Variables
5. [ ] Click "Environment Variables"
6. [ ] Add these variables:
   - [ ] VITE_API_URL = `https://your-render-backend-url.onrender.com/api`
   - [ ] VITE_ADZUNA_APP_ID (optional)
   - [ ] VITE_ADZUNA_APP_KEY (optional)

7. [ ] Click "Deploy"
8. [ ] Wait for build (2-3 minutes)
9. [ ] Copy your frontend URL (e.g., https://your-app.vercel.app)

---

## 🔄 Update Backend CORS (Important!)

1. [ ] Go back to Render dashboard
2. [ ] Click on your backend service
3. [ ] Go to "Environment" tab
4. [ ] Update these variables with your Vercel URL:
   - [ ] CLIENT_ORIGIN = `https://your-app.vercel.app`
   - [ ] ALLOWED_ORIGINS = `https://your-app.vercel.app`
   - [ ] CLIENT_URL = `https://your-app.vercel.app`
5. [ ] Click "Save Changes"
6. [ ] Service will auto-restart

---

## 🧪 Testing Checklist

Visit your Vercel URL and test:
- [ ] Homepage loads
- [ ] Sign up creates account
- [ ] Login works
- [ ] Create new resume
- [ ] AI enhancement works (Gemini API)
- [ ] PDF download works
- [ ] Job search works (if Adzuna configured)
- [ ] Check browser console for errors
- [ ] Test on mobile device

---

## 🐛 Common Issues & Quick Fixes

### "Cannot connect to backend"
- [ ] Check VITE_API_URL in Vercel has `/api` at the end
- [ ] Verify backend is running on Render
- [ ] Check browser console for CORS errors

### CORS Error
- [ ] Verify ALLOWED_ORIGINS matches Vercel URL exactly
- [ ] No trailing slashes in URLs
- [ ] Restart Render service after changes

### MongoDB Connection Failed
- [ ] IP whitelist set to 0.0.0.0/0 in MongoDB Atlas
- [ ] Connection string format correct
- [ ] Database user has read/write permissions

### Backend Slow (First Load)
- [ ] This is normal on Render free tier (cold start ~30 seconds)
- [ ] Service sleeps after 15 minutes of inactivity
- [ ] Consider paid tier ($7/month) for always-on

### Build Failed on Vercel
- [ ] Check build logs for specific error
- [ ] Verify all dependencies in package.json
- [ ] Test `npm run build` locally first

---

## 📝 Save These URLs

After deployment, save these for reference:

```
Frontend: https://your-app.vercel.app
Backend:  https://ats-resume-backend.onrender.com
Health:   https://ats-resume-backend.onrender.com/api/health
```

---

## 🎉 You're Live!

Your ATS Resume Generator is now live and ready to use!

### Next Steps:
- [ ] Share your app with friends/testers
- [ ] Monitor Render logs for errors
- [ ] Check Vercel analytics for usage
- [ ] Consider custom domain (both platforms support it)
- [ ] Set up error monitoring (optional)

### Auto-Deployment:
Both platforms will auto-deploy when you push to GitHub:
- Make changes → Commit → Push to main branch
- Vercel and Render automatically rebuild
- Check deployment status in respective dashboards

---

## 💰 Cost Breakdown

**Completely Free Tier:**
- Frontend (Vercel): Free forever
- Backend (Render): 750 hours/month free (enough for 1 service)
- MongoDB Atlas: 512MB free tier
- **Total: $0/month** ✨

**If You Need Better Performance:**
- Render Standard: $7/month (always-on, no cold starts)
- MongoDB Shared: $9/month (2GB storage)
- **Total: ~$16/month**

---

## 📚 Documentation

- Full Guide: `DEPLOYMENT_GUIDE.md`
- Environment Variables: `.env.production.example`
- Vercel Config: `client/vercel.json`
- Render Config: `render.yaml`

---

Need help? Check the full DEPLOYMENT_GUIDE.md for detailed troubleshooting!
