# Phase 2 Installation & Setup Guide

## 🚀 Quick Start

Follow these steps to install and configure Phase 2 backend components:

---

## Step 1: Install Required Packages

```bash
cd server
npm install openai razorpay
```

**Packages:**
- `openai` - GPT-4o integration
- `razorpay` - Payment gateway for India

---

## Step 2: Get API Keys

### OpenAI API Key (GPT-4o)
1. Go to: https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Important**: Add billing info and credits ($5+ recommended)

### Razorpay API Keys
1. Go to: https://dashboard.razorpay.com/signup
2. Sign up for free (Test mode available)
3. Go to Settings → API Keys
4. Generate Test Keys (or Live Keys for production)
5. Copy:
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret

### Razorpay Webhook Secret
1. In Razorpay Dashboard, go to Settings → Webhooks
2. Click "Create Webhook"
3. URL: `https://your-domain.com/api/subscription/webhook`
4. Events to select:
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ subscription.activated
   - ✅ subscription.cancelled
5. Copy the webhook secret

---

## Step 3: Update .env File

Add these to `server/.env`:

```env
# ========================================
# OpenAI Configuration (GPT-4o)
# ========================================
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# ========================================
# Razorpay Configuration
# ========================================
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret_here
RAZORPAY_WEBHOOK_SECRET=your_actual_webhook_secret_here
```

**Example:**
```env
OPENAI_API_KEY=sk-proj-abc123xyz456...
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
RAZORPAY_WEBHOOK_SECRET=whsec_1234567890abcdef
```

---

## Step 4: Run Migration (Update Existing Users)

```bash
cd server
node scripts/migrateUsers.js
```

**Expected Output:**
```
🔄 Starting user migration...
✅ Migrated user: user@example.com
✅ Migration completed successfully
📊 Statistics:
   - Total users: 10
   - Migrated: 10
   - Skipped: 0
   - Errors: 0
```

---

## Step 5: Test Models

```bash
cd server
node scripts/testModels.js
```

**Expected Output:**
```
✅ User created successfully
✅ Default values set correctly
✅ hasActiveSubscription() works
✅ All tests passed!
```

---

## Step 6: Start Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
📝 Environment: development
✅ MongoDB connected successfully
```

---

## Step 7: Test API Endpoints

### Test 1: Get Pricing (Public)
```bash
curl http://localhost:5000/api/subscription/pricing
```

**Expected Response:**
```json
{
  "success": true,
  "pricing": {
    "free": {...},
    "one-time": {...},
    "pro": {...},
    ...
  }
}
```

### Test 2: Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "ATS Resume API is running",
  "timestamp": "2025-11-26T..."
}
```

---

## Step 8: Test with Authenticated Request

First, login to get JWT token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "yourpassword"}'
```

Copy the `token` from response, then:

```bash
curl http://localhost:5000/api/subscription/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "subscription": {
    "tier": "free",
    "plan": "lifetime",
    "status": "active",
    ...
  }
}
```

---

## Step 9: Test Payment Flow (Test Mode)

### Create Payment Order:
```bash
curl -X POST http://localhost:5000/api/subscription/create-order \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tier": "pro", "plan": "monthly"}'
```

**Expected Response:**
```json
{
  "success": true,
  "order": {
    "orderId": "order_...",
    "amount": 149,
    "currency": "INR",
    "tier": "pro",
    "plan": "monthly"
  },
  "key": "rzp_test_..."
}
```

---

## 🎯 Verification Checklist

- [ ] NPM packages installed (`openai`, `razorpay`)
- [ ] `.env` file updated with all 3 API keys
- [ ] Migration script ran successfully
- [ ] Test script passed all tests
- [ ] Server starts without errors
- [ ] `/api/subscription/pricing` returns pricing data
- [ ] `/api/subscription/status` returns user subscription
- [ ] Can create payment order (test mode)

---

## 🐛 Troubleshooting

### Error: "OpenAI API key not configured"
**Solution:** Check `.env` file has `OPENAI_API_KEY=sk-...`

### Error: "Razorpay configuration missing"
**Solution:** Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set

### Error: "MongoDB connection error"
**Solution:** Check `MONGODB_URI` is correct and database is accessible

### Error: "User not found" on /status
**Solution:** Login first to get valid JWT token

### Payment test fails
**Solution:** Use Razorpay TEST mode keys (start with `rzp_test_`)

---

## 💳 Test Card Details (Razorpay Test Mode)

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`

**More test cards:** https://razorpay.com/docs/payments/payments/test-card-upi-details/

---

## 📊 Monitoring Costs

### OpenAI Costs (GPT-4o):
- Track in: https://platform.openai.com/usage
- Set billing alerts to avoid surprises
- Typical resume: ₹2-4 per generation

### Razorpay Costs:
- Transaction fee: 2% + ₹0 (first ₹100,000 free)
- Settlement: T+1 day (next business day)
- Dashboard: https://dashboard.razorpay.com/

---

## ✅ Setup Complete!

Your backend is now ready with:
- ✅ Multi-tier subscription system
- ✅ AI routing (Gemini + GPT-4o)
- ✅ Payment integration (Razorpay)
- ✅ Usage tracking and limits
- ✅ API endpoints ready for frontend

**Next:** Build the frontend UI for pricing, payment, and subscription management! 🎨
