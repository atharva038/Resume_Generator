# 🚀 Subscription System - Quick Start Guide

## 📋 Prerequisites

Before testing the subscription system, ensure you have:

- ✅ Node.js installed (v18+)
- ✅ MongoDB running (local or Atlas)
- ✅ Backend server configured
- ✅ Frontend Vite app configured

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secret_key

# OpenAI (for premium users)
OPENAI_API_KEY=sk-proj-your_openai_key

# Razorpay (test mode)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Gemini AI (for free users)
GEMINI_API_KEY=your_gemini_key

# Server
PORT=5000
NODE_ENV=development
```

**Frontend (`client/.env`):**
```bash
# Backend API
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000

# Razorpay (public key only)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### 3. Get Razorpay Test Keys

1. Go to https://razorpay.com/
2. Sign up for free account
3. Navigate to Settings → API Keys
4. Generate test mode keys
5. Copy Key ID and Secret

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

---

## 🧪 Testing the Subscription System

### Step 1: Access Pricing Page

1. Open browser: http://localhost:5173
2. Navigate to `/pricing` or click "Pricing" in navbar
3. **Expected:** See 7 beautiful pricing cards

### Step 2: Toggle Billing Cycle

1. Click "Yearly" toggle
2. **Expected:** Prices update, see "Save 16%" badge
3. Click "Monthly" toggle
4. **Expected:** Prices revert to monthly

### Step 3: Select a Plan

1. Click "Choose Plan" on any paid tier
2. **If not logged in:** Redirected to login
3. **If logged in:** Opens Payment Modal

### Step 4: Complete Test Payment

1. Review order summary
2. Click "Pay ₹XXX" button
3. **Expected:** Razorpay checkout opens
4. Use test card details:
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits (e.g., 123)
   - **Expiry:** Any future date (e.g., 12/25)
   - **Name:** Your Name
5. Click "Pay"
6. **Expected:** Success → Redirect to Subscription Dashboard

### Step 5: View Subscription Dashboard

1. Navigate to `/subscription`
2. **Expected to see:**
   - Current plan with tier badge
   - Start date, end date, days remaining
   - Usage statistics with progress bars
   - Payment history table
   - AI configuration (if PRO/STUDENT)

### Step 6: Test Usage Tracking

1. Generate a resume (existing feature)
2. Refresh subscription dashboard
3. **Expected:** "Resumes Generated" progress bar updates
4. Check if usage increased: "1 / 10" → "2 / 10"

### Step 7: Test AI Configuration (PRO/STUDENT only)

1. On subscription dashboard
2. Click "Configure" in AI Settings
3. Select AI preference: Auto, Gemini, or GPT-4o
4. **Expected:** Preference saved, success toast shown

### Step 8: Test Cancel Subscription

1. Click "Cancel Subscription" button
2. Enter optional reason
3. Click "Cancel Subscription" in modal
4. **Expected:** 
   - Success message
   - Access until end date shown
   - Status updated to "cancelled"

### Step 9: Test Usage Indicators

1. Add `<UsageBadge compact={true} />` to navbar
2. **Expected:** 
   - See tier badge with icon
   - Red dot if usage > 80%
   - Clickable → Goes to subscription dashboard

---

## 🎯 Test Scenarios

### Scenario 1: Free User Workflow
```
1. Login as free user
2. Go to /pricing
3. See current plan is FREE
4. Click upgrade on PRO
5. Complete payment
6. Verify upgrade successful
7. Check usage limits increased
```

### Scenario 2: Upgrade PRO → PREMIUM
```
1. Login as PRO user
2. Go to /subscription
3. Click "Change Plan"
4. Select PREMIUM
5. Complete payment
6. Verify upgrade with proration (future feature)
7. Check AI model changed to GPT-4o
```

### Scenario 3: Subscription Expiry
```
1. Set subscription endDate to past date in database
2. Login
3. Go to /subscription
4. See "Expired" status
5. Click "Renew Now"
6. Complete payment
7. Verify subscription renewed
```

### Scenario 4: Usage Limit Reached
```
1. Login as free user (1 resume limit)
2. Generate 1 resume
3. Try to generate 2nd resume
4. Expected: Blocked by backend middleware
5. Error: "Usage limit reached"
6. Upgrade to PRO
7. Generate unlimited resumes
```

---

## 🔧 API Testing with Postman/Thunder Client

### Get Pricing (Public)
```http
GET http://localhost:5000/api/subscription/pricing
```

### Create Payment Order (Protected)
```http
POST http://localhost:5000/api/subscription/create-order
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "tier": "pro",
  "plan": "monthly"
}
```

### Get Subscription Status (Protected)
```http
GET http://localhost:5000/api/subscription/status
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Usage Stats (Protected)
```http
GET http://localhost:5000/api/subscription/usage
Authorization: Bearer YOUR_JWT_TOKEN
```

### Cancel Subscription (Protected)
```http
POST http://localhost:5000/api/subscription/cancel
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "reason": "Testing cancellation"
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Razorpay Script Not Loading
**Error:** `Razorpay is not defined`

**Solution:**
- Check `client/index.html` has Razorpay script
- Check browser console for script errors
- Verify internet connection

### Issue 2: Payment Verification Failed
**Error:** `Invalid signature`

**Solution:**
- Check `RAZORPAY_KEY_SECRET` matches in backend
- Ensure payment response has all 3 fields:
  - razorpay_order_id
  - razorpay_payment_id
  - razorpay_signature

### Issue 3: API Not Found
**Error:** `404 Not Found`

**Solution:**
- Check backend server is running
- Verify `VITE_API_URL` in `client/.env`
- Check route is mounted in `server/server.js`:
  ```javascript
  app.use('/api/subscription', subscriptionRoutes);
  ```

### Issue 4: JWT Token Missing
**Error:** `No token provided`

**Solution:**
- Login first
- Check `localStorage.getItem('token')` exists
- Verify token format: `Bearer xxx.yyy.zzz`

### Issue 5: Usage Not Updating
**Error:** Usage stats not increasing

**Solution:**
- Check `trackUsage()` middleware is added to routes
- Verify user ID matches in database
- Check `incrementUsage()` method called after action

---

## 📊 Database Verification

### Check User Subscription
```javascript
// MongoDB Shell or Compass
db.users.find({ email: "test@example.com" }).pretty()

// Expected fields:
// subscription.tier: "pro"
// subscription.status: "active"
// subscription.startDate: ISODate(...)
// subscription.endDate: ISODate(...)
```

### Check Subscription History
```javascript
db.subscriptions.find({ userId: ObjectId("...") }).sort({ createdAt: -1 })

// Expected: Array of subscription records
```

### Check Usage Logs
```javascript
db.usagelogs.find({ userId: ObjectId("...") }).limit(10)

// Expected: Array of usage records with AI costs
```

---

## 🎨 UI Testing Checklist

### Pricing Page
- [ ] 7 cards displayed
- [ ] Colors match tier
- [ ] PRO has "MOST POPULAR" badge
- [ ] Monthly/Yearly toggle works
- [ ] Prices update correctly
- [ ] Feature list shows checkmarks
- [ ] Comparison table scrolls horizontally on mobile
- [ ] FAQ section readable

### Payment Modal
- [ ] Opens on "Choose Plan" click
- [ ] Shows correct plan and price
- [ ] Order summary accurate
- [ ] Razorpay checkout opens
- [ ] Payment completes
- [ ] Redirects to dashboard
- [ ] Success toast shows

### Subscription Dashboard
- [ ] Current plan displays with icon
- [ ] Days remaining counts down
- [ ] Usage bars show progress
- [ ] Colors change (green → yellow → red)
- [ ] Payment history table loads
- [ ] Cancel modal works
- [ ] AI settings (PRO only)

### Usage Indicators
- [ ] Badge shows in navbar
- [ ] Warning dot at 80%
- [ ] Progress bars animate
- [ ] Unlimited shows ∞

---

## 🚀 Production Deployment Checklist

### Before Going Live:

1. **Switch Razorpay to Live Mode:**
   - Generate live API keys
   - Update `RAZORPAY_KEY_ID` in both frontend and backend
   - Update `RAZORPAY_KEY_SECRET` in backend
   - Set up live webhook URL

2. **Environment Variables:**
   - Use production MongoDB URI
   - Strong JWT secret (64+ characters)
   - Production OpenAI API key
   - Production Gemini API key

3. **Testing:**
   - Test with real payment (small amount)
   - Verify webhook receives events
   - Test cancellation and refunds
   - Monitor error logs

4. **Email Notifications:**
   - Payment confirmation
   - Subscription expiry warnings
   - Invoice generation

5. **Monitoring:**
   - Set up error tracking (Sentry)
   - Monitor payment success rate
   - Track revenue metrics
   - Usage analytics

---

## 📞 Support & Troubleshooting

### Debug Mode:

1. **Enable Verbose Logging:**
   ```javascript
   // In subscription.api.js
   console.log('API Request:', endpoint, data);
   console.log('API Response:', response);
   ```

2. **Check Network Tab:**
   - Open browser DevTools
   - Go to Network tab
   - Filter by "subscription"
   - Check request/response

3. **Check Backend Logs:**
   ```bash
   # Server logs show:
   - API requests
   - Payment creation
   - Verification attempts
   - Errors
   ```

### Need Help?

- **Backend Issues:** Check `server/logs/` or console output
- **Frontend Issues:** Check browser console (F12)
- **Payment Issues:** Check Razorpay dashboard → Payments
- **Database Issues:** Check MongoDB Compass or Atlas

---

## 🎉 Success!

If all tests pass, you have a fully functional subscription system! 🎊

**Next Steps:**
1. Add "Pricing" link to navbar
2. Add "Subscription" to user dropdown menu
3. Add usage badge to navbar
4. Test on mobile devices
5. Deploy to production

**Enjoy your subscription system! 💰**

---

*Quick Start Guide - Version 1.0*  
*Last Updated: November 26, 2025*
