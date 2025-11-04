# 🚀 Deployment Guide

This guide will help you deploy your ATS Resume Generator application with:
- **Frontend**: Vercel
- **Backend**: Render

---

## 📋 Pre-Deployment Checklist

### 1. Database Setup
- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Network access configured (allow all IPs: `0.0.0.0/0` for Render)
- [ ] Database user created with read/write permissions
- [ ] Connection string obtained

### 2. API Keys
- [ ] Google Gemini API key obtained
- [ ] Adzuna API credentials (optional - for job search feature)
- [ ] Email service configured (Gmail app password)

### 3. Code Repository
- [ ] Code pushed to GitHub
- [ ] `.env` files NOT committed (check `.gitignore`)
- [ ] All dependencies listed in `package.json`

---

## 🎯 Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ats-resume-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty or set to `server`
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

### Step 3: Set Environment Variables
Add these in Render dashboard (Settings → Environment):

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ats_resume?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
CLIENT_ORIGIN=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
CLIENT_URL=https://your-app.vercel.app
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Copy your backend URL: `https://ats-resume-backend.onrender.com`

### Step 5: Test Backend
Visit: `https://ats-resume-backend.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "ATS Resume API is running",
  "timestamp": "2025-11-04T..."
}
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables
Add these in Vercel dashboard (Settings → Environment Variables):

```bash
VITE_API_URL=https://ats-resume-backend.onrender.com/api
VITE_ADZUNA_APP_ID=your_adzuna_app_id (optional)
VITE_ADZUNA_APP_KEY=your_adzuna_app_key (optional)
```

**Important**: Use your Render backend URL from Step 4 above!

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Copy your frontend URL: `https://your-app.vercel.app`

### Step 5: Update Backend CORS
1. Go back to Render dashboard
2. Update environment variables:
   ```bash
   CLIENT_ORIGIN=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Restart your backend service

---

## ✅ Post-Deployment Testing

### 1. Test Health Check
```bash
curl https://ats-resume-backend.onrender.com/api/health
```

### 2. Test Frontend
1. Visit your Vercel URL
2. Try creating an account
3. Try logging in
4. Test resume creation
5. Test AI features

### 3. Common Issues & Fixes

#### Backend returns 404
- Check Root Directory is set correctly in Render
- Verify Build Command: `cd server && npm install`
- Verify Start Command: `cd server && npm start`

#### CORS errors
- Update `ALLOWED_ORIGINS` in Render to match Vercel URL
- Ensure no trailing slashes in URLs
- Restart Render service after changes

#### Database connection fails
- Whitelist all IPs in MongoDB Atlas: `0.0.0.0/0`
- Check connection string format
- Verify database user has permissions

#### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel settings
- Must include `/api` at the end
- Redeploy frontend after changing env vars

#### Cold start delays (Render Free)
- First request after inactivity takes ~30 seconds
- Normal on free plan - upgrade for faster response

---

## 🔒 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] MongoDB password is strong
- [ ] Gmail app password (not regular password)
- [ ] No sensitive data in GitHub
- [ ] CORS origins properly configured
- [ ] Rate limiting enabled (already in code)
- [ ] Helmet security headers enabled (already in code)

---

## 📊 Monitoring

### Render
- View logs in dashboard
- Set up email alerts for downtime
- Monitor resource usage

### Vercel
- Analytics tab for visitor stats
- Function logs for debugging
- Performance insights

---

## 🔄 Continuous Deployment

Both Vercel and Render auto-deploy when you push to GitHub:

1. Make code changes locally
2. Commit and push to GitHub
3. Vercel/Render automatically rebuild and deploy
4. Check deployment logs for errors

---

## 💡 Tips

### Render Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- 750 hours/month (enough for one service)
- First request after sleep takes ~30 seconds
- Consider upgrading for production apps

### Vercel Free Tier
- 100GB bandwidth/month
- Unlimited sites and deployments
- Serverless functions included
- Custom domains supported

### Cost-Effective Alternative
If you need always-on backend, consider:
- Railway ($5/month)
- Fly.io (free tier with credit card)
- DigitalOcean App Platform ($5/month)

---

## 🆘 Getting Help

If you encounter issues:

1. Check deployment logs on Render/Vercel
2. Test backend health endpoint
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Review CORS configuration

---

## 🎉 Success!

Once deployed, your app should be accessible at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://ats-resume-backend.onrender.com`

Share your live URL and start building resumes! 🚀
