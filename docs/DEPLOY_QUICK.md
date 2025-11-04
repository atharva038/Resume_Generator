# ⚡ 5-Minute Deployment Cheat Sheet

## 🎯 Prerequisites (Get These Ready)
- [ ] GitHub account (push your code)
- [ ] MongoDB Atlas connection string
- [ ] Google Gemini API key
- [ ] Gmail app password

---

## 🔥 Deploy Backend (Render)

**URL**: https://render.com

1. **New +** → **Web Service** → Select repo
2. **Settings**:
   ```
   Build: cd server && npm install
   Start: cd server && npm start
   ```
3. **Environment Variables** (click "Add" for each):
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
   GEMINI_API_KEY=your_key
   JWT_SECRET=random_32_char_string
   EMAIL_SERVICE=gmail
   EMAIL_USER=your@gmail.com
   EMAIL_PASSWORD=gmail_app_password
   # Leave these blank for now:
   CLIENT_ORIGIN=
   ALLOWED_ORIGINS=
   CLIENT_URL=
   ```
4. **Deploy** → Wait 5-10 min
5. **Copy URL**: `https://xxx.onrender.com` ✅

---

## 🌐 Deploy Frontend (Vercel)

**URL**: https://vercel.com

1. **Add New...** → **Project** → Import repo
2. **Settings**:
   ```
   Root Directory: client
   Framework: Vite (auto)
   ```
3. **Environment Variable**:
   ```bash
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
4. **Deploy** → Wait 2-3 min
5. **Copy URL**: `https://xxx.vercel.app` ✅

---

## 🔄 Update CORS

1. Go to **Render** → Your service → **Environment**
2. Update these 3 variables:
   ```bash
   CLIENT_ORIGIN=https://your-app.vercel.app
   ALLOWED_ORIGINS=https://your-app.vercel.app
   CLIENT_URL=https://your-app.vercel.app
   ```
3. **Save** (auto-restarts) ✅

---

## ✅ Test

**Backend**: Visit `https://your-backend.onrender.com/api/health`
**Frontend**: Visit `https://your-app.vercel.app`

---

## 🐛 Quick Fixes

| Problem | Fix |
|---------|-----|
| CORS error | Check ALLOWED_ORIGINS matches Vercel URL |
| Can't connect | Check VITE_API_URL has `/api` at end |
| MongoDB error | Whitelist 0.0.0.0/0 in Atlas |
| Slow first load | Normal on Render free (30s cold start) |

---

## 💡 Tips

- ✅ No trailing slashes in URLs
- ✅ MongoDB Atlas: Network Access → 0.0.0.0/0
- ✅ Gmail: Use App Password, not regular password
- ✅ Both platforms auto-deploy on git push
- ✅ First Render load after sleep: ~30 seconds

---

## 📱 Share Your App!

```
Frontend: https://your-app.vercel.app
Backend:  https://your-backend.onrender.com
```

**Done!** 🎉

Full guide: See `DEPLOYMENT_CHECKLIST.md`
