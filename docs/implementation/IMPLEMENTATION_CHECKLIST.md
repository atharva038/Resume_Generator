# Premium Implementation - Quick Checklist

## 🚀 Phase-by-Phase Checklist

### Phase 1: Database & Models ✅
- [ ] Update `server/models/User.model.js` with subscription fields
- [ ] Create `server/models/Subscription.model.js`
- [ ] Create `server/models/UsageLog.model.js`
- [ ] Create migration script `server/scripts/migrateUsers.js`
- [ ] Test models with sample data

### Phase 2: Backend Core ✅
- [ ] Install `openai` package
- [ ] Create `server/services/openai.service.js`
- [ ] Create `server/services/aiRouter.service.js`
- [ ] Create `server/middleware/subscription.middleware.js`
- [ ] Create `server/controllers/subscription.controller.js`
- [ ] Install `razorpay` package
- [ ] Create `server/services/payment.service.js`
- [ ] Update `server/controllers/resume.controller.js`
- [ ] Update `server/controllers/ats.controller.js`
- [ ] Update `server/controllers/ml.controller.js`
- [ ] Create `server/routes/subscription.routes.js`
- [ ] Add routes to `server/server.js`

### Phase 3: Frontend ✅
- [ ] Create `client/src/pages/Pricing.jsx`
- [ ] Create `client/src/pages/SubscriptionDashboard.jsx`
- [ ] Create `client/src/components/payment/RazorpayCheckout.jsx`
- [ ] Create `client/src/components/subscription/UsageBadge.jsx`
- [ ] Create `client/src/components/subscription/UpgradePrompt.jsx`
- [ ] Update `client/src/components/layout/Navbar.jsx`
- [ ] Update `client/src/services/api.js`
- [ ] Add routing in `client/src/App.jsx`

### Phase 4: Configuration ✅
- [ ] Update `.env` with OpenAI keys
- [ ] Update `.env` with Razorpay keys
- [ ] Create `server/config/subscription.config.js`
- [ ] Update `.env.example`

### Phase 5: Testing ✅
- [ ] Test user registration → defaults to free
- [ ] Test free tier limits (3 resumes)
- [ ] Test premium tier (unlimited)
- [ ] Test payment flow end-to-end
- [ ] Test subscription upgrade
- [ ] Test subscription cancellation
- [ ] Test AI routing (Gemini vs GPT-4o)
- [ ] Test usage tracking
- [ ] Test mobile responsiveness

### Phase 6: Deployment ✅
- [ ] Backup database
- [ ] Run migration script
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test production payment
- [ ] Monitor logs

### Phase 7: Post-Launch ✅
- [ ] Set up cost alerts
- [ ] Monitor conversion rate
- [ ] Track user feedback
- [ ] Monitor API costs
- [ ] Update documentation

---

## 📦 NPM Packages to Install

### Backend
```bash
cd server
npm install openai razorpay
```

### Frontend
```bash
cd client
# Razorpay is loaded via script tag, no npm install needed
```

---

## 🔑 API Keys Needed

1. **OpenAI**
   - Get from: https://platform.openai.com/api-keys
   - Add $50-100 credits
   - Copy API key to `.env` as `OPENAI_API_KEY`

2. **Razorpay**
   - Sign up: https://razorpay.com/
   - Go to Settings → API Keys
   - Generate Test Keys (for development)
   - Generate Live Keys (for production)
   - Copy to `.env` as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`

---

## 💰 Pricing Structure (Finalized)

### India
- **Free**: ₹0 (3 resumes/month, Gemini AI)
- **Premium**: ₹499/month or ₹4,999/year (Unlimited, GPT-4o)

### International
- **Free**: $0 (3 resumes/month, Gemini AI)
- **Premium**: $9.99/month or $99/year (Unlimited, GPT-4o)

---

## 🎯 Next Steps

**Ready to start implementation?**

Choose your starting point:
1. **Backend First** (Recommended) → Start with User Model
2. **Frontend First** → Start with Pricing Page
3. **Quick MVP** → Minimal features to test concept

**Let me know which approach you prefer, and I'll guide you step-by-step!** 🚀
