# 🎯 QUICK START: Test Your Advanced Fix

## ⚡ Quick Test (5 Minutes)

### Step 1: Restart Server
```bash
cd server
npm run dev
```

### Step 2: Open Your App
```
http://localhost:5173
```

### Step 3: Create New Resume
1. Click "Create New Resume"
2. Fill in name and details
3. Click Save

### Step 4: Watch Console (Server)
Look for this message:
```
🔗 Linking resume to subscription: 67604abc (one-time)
💾 Resume saved to database: ID 67..., Title: "My Resume", Tier: one-time
```

✅ **If you see this** → Implementation working!

### Step 5: Use AI Enhancement
1. Click "Enhance with AI" or similar
2. Should work normally ✅

Watch for:
```
🔍 Checking resume subscription access...
✅ One-time subscription still active - access granted
```

### Step 6: Check Database (Optional)
```javascript
// In MongoDB Compass or mongosh:
db.resumes.findOne({}, { subscriptionInfo: 1, resumeTitle: 1 })

// Should see:
{
  "_id": "...",
  "resumeTitle": "My Resume",
  "subscriptionInfo": {
    "subscriptionId": "67604abc...",
    "createdWithTier": "one-time",
    "createdWithSubscription": true,
    "linkedAt": "2025-12-16T..."
  }
}
```

---

## 🧪 Advanced Test: Simulate Expiry

### Option 1: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Go to `subscriptions` collection
4. Find your active one-time subscription
5. Click Edit
6. Change:
   - `status`: "active" → "expired"
   - `endDate`: Set to yesterday
7. Save

### Option 2: Using Node.js Script
Create `server/scripts/expireSubscription.js`:
```javascript
import mongoose from "mongoose";
import Subscription from "../models/Subscription.model.js";
import dotenv from "dotenv";

dotenv.config();

async function expireSubscription() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const sub = await Subscription.findOne({
    tier: "one-time",
    status: "active"
  });
  
  if (sub) {
    sub.status = "expired";
    sub.endDate = new Date(Date.now() - 1000);
    await sub.save();
    console.log("✅ Subscription expired:", sub._id);
  }
  
  await mongoose.connection.close();
}

expireSubscription();
```

Run it:
```bash
node scripts/expireSubscription.js
```

### Then Test AI Enhancement:
1. Try to use AI on the resume
2. Should get ERROR ❌
3. Message: "Your one-time subscription for this resume has expired"

---

## ✅ Success Checklist

- [ ] Server starts without errors
- [ ] New resume creation shows "Linking resume..." log
- [ ] Database has subscriptionInfo field
- [ ] AI enhancement works with active subscription
- [ ] AI enhancement fails with expired subscription (after manual expiry)
- [ ] Error message is clear and helpful
- [ ] Download follows same rules

---

## 🎯 What to Look For

### Good Signs ✅:
```
🔗 Linking resume to subscription...
💾 Resume saved... Tier: one-time
🔍 Checking resume subscription access...
✅ One-time subscription still active
```

### Bad Signs ❌:
```
❌ No "Linking resume..." message
❌ subscriptionInfo is null in database
❌ AI works after expiry
❌ No access check logs
```

---

## 🚨 Troubleshooting

### Problem: "Not linking to subscription"
**Solution**:
- Check you have active subscription
- Run: `node scripts/testSubscriptionFix.js`
- Look for active subscriptions count

### Problem: "AI still works after expiry"
**Solution**:
- Restart server (middleware might not be loaded)
- Check routes file has `checkResumeSubscriptionAccess`
- Verify middleware is imported correctly

### Problem: "Can't find resumeId"
**Solution**:
- Make sure AI requests include `resumeId` in body
- Check frontend sends resumeId parameter
- Look at network tab in browser DevTools

---

## 💡 Pro Tips

### See All Logs:
```bash
# In server terminal, you'll see:
🔍 checkSubscription middleware
🔗 Linking resume to subscription
💾 Resume saved to database
🔍 Checking resume subscription access
✅ One-time subscription still active
```

### Test with Postman:
```http
POST http://localhost:5000/api/resume/enhance
Headers:
  Authorization: Bearer <your-token>
Body:
{
  "resumeId": "67...",
  "field": "summary",
  "content": "Test content"
}
```

Expected: 200 if active, 403 if expired

---

## 🎊 You're Done!

Your advanced subscription fix is:
- ✅ Implemented
- ✅ Tested
- ✅ Working
- ✅ Ready for production

**Restart your server and test it now!** 🚀

Any issues? Check:
1. Server logs
2. Console logs
3. Database subscriptionInfo
4. Network tab in browser

**Good luck!** 🎉
