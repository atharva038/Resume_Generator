# Job Search Feature - Quick Start Guide ⚡

## 🚀 Get Started in 5 Minutes

### Step 1: Get API Credentials (2 minutes)
1. Visit: https://developer.adzuna.com/
2. Click "Sign Up" (it's free!)
3. Verify your email
4. Copy your **App ID** and **App Key** from the dashboard

### Step 2: Configure Environment (1 minute)
```bash
cd client
nano .env  # or use your preferred editor
```

Add these lines:
```env
VITE_ADZUNA_APP_ID=paste_your_app_id_here
VITE_ADZUNA_APP_KEY=paste_your_app_key_here
```

### Step 3: Restart Server (30 seconds)
```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### Step 4: Test It Out! (1 minute)
1. Open your browser
2. Click **"Job Search"** in the sidebar
3. Search for "Software Developer" in "United States"
4. Click "Search Jobs"
5. Browse results! 🎉

## 🎯 Quick Tips

### Best Searches
- ✅ "Software Engineer" → Lots of results
- ✅ "Data Scientist" → High-paying jobs
- ✅ "Marketing Manager" → Various industries
- ✅ "Frontend Developer" → Tech-specific
- ❌ "asdfghjkl" → No results 😅

### Countries with Most Jobs
1. 🇺🇸 United States
2. 🇬🇧 United Kingdom
3. 🇨🇦 Canada
4. 🇦🇺 Australia
5. 🇩🇪 Germany

## 🐛 Quick Troubleshooting

### "API Credentials Required" Warning?
→ Add credentials to `.env` and restart server

### "Failed to fetch jobs" Error?
→ Check your App ID and App Key are correct

### No Jobs Found?
→ Try broader keywords like "Developer" or "Manager"

## 📊 API Limits (Free Tier)
- ✅ 1,000 API calls per month
- ✅ Unlimited access to all countries
- ✅ Real-time job data
- ✅ No credit card required

**That's ~33 searches per day!** 🎉

## 🎨 Features You'll Love
- 🌍 Search 17+ countries
- 💰 See salary ranges
- 📱 Mobile-friendly
- 🌙 Dark mode support
- ⚡ Real-time results
- 🔗 Direct apply links

## 📚 Need More Help?
Check out the full documentation: `docs/JOB_SEARCH_FEATURE.md`

---

**Time to first job search**: < 5 minutes ⏱️  
**Difficulty**: Easy 😊  
**Cost**: Free 💸
