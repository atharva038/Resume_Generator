# Premium AI Implementation Plan
## Two-Tier System: Gemini (Free) + GPT-4o (Premium)

---

## 📋 Overview

### Goal
Implement a multi-tier monetization system:
- **FREE** → ₹0 (1 resume, Gemini)
- **ONE-TIME** → ₹49 (Complete resume with GPT-4o)
- **PRO** → ₹149/month (Unlimited, hybrid AI)
- **PREMIUM** → ₹249/month (All features, GPT-4o)
- **STUDENT** → ₹99/3 months (Pro features)
- **LIFETIME** → ₹499 (Limited offer)
- **ADD-ONS** → ₹10-29 (Micro-payments)

### Timeline
**Total Estimated Time:** 3-4 days (24-32 hours)

---

## 🎯 Phase 1: Database & Models (3-4 hours)

### 1.1 Update User Model
**File:** `server/models/User.model.js`

**Add fields:**
```javascript
{
  subscription: {
    tier: {
      type: String,
      enum: ['free', 'one-time', 'pro', 'premium', 'student', 'lifetime'],
      default: 'free'
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly', '3-months', 'lifetime', 'one-time'],
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trial'],
      default: 'active'
    },
    startDate: Date,
    endDate: Date,
    paymentId: String,
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  
  usage: {
    resumesCreated: {
      type: Number,
      default: 0
    },
    atsScans: {
      type: Number,
      default: 0
    },
    jobMatches: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  
  preferences: {
    aiModel: {
      type: String,
      enum: ['gemini', 'gpt4o'],
      default: 'gemini'
    }
  }
}
```

**Tasks:**
- [ ] Update User schema
- [ ] Create migration script for existing users
- [ ] Add indexes for subscription queries
- [ ] Test model updates

---

### 1.2 Create Subscription Model
**File:** `server/models/Subscription.model.js` (NEW)

**Schema:**
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  tier: { type: String, enum: ['free', 'premium'], required: true },
  status: { type: String, enum: ['active', 'cancelled', 'expired', 'trial'] },
  startDate: Date,
  endDate: Date,
  amount: Number,
  currency: String,
  paymentMethod: String,
  paymentId: String,
  invoiceUrl: String,
  cancelledAt: Date,
  cancelReason: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

**Tasks:**
- [ ] Create Subscription model
- [ ] Add validation rules
- [ ] Create indexes
- [ ] Add helper methods (isActive, isExpired, etc.)

---

### 1.3 Create Usage Tracking Model
**File:** `server/models/UsageLog.model.js` (NEW)

**Schema:**
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  action: { 
    type: String, 
    enum: ['resume_created', 'ats_scan', 'job_match', 'content_enhance'],
    required: true 
  },
  aiModel: { type: String, enum: ['gemini', 'gpt4o'] },
  tokensUsed: Number,
  cost: Number,
  metadata: Object,
  timestamp: { type: Date, default: Date.now }
}
```

**Tasks:**
- [ ] Create UsageLog model
- [ ] Add aggregation methods
- [ ] Create indexes for performance
- [ ] Test logging

---

## 🔧 Phase 2: Backend Implementation (6-8 hours)

### 2.1 OpenAI Integration
**File:** `server/services/openai.service.js` (NEW)

**Features:**
```javascript
- Initialize OpenAI client
- Parse resume with GPT-4o
- Enhance content with GPT-4o
- Generate summary with GPT-4o
- Analyze ATS score with GPT-4o
- Job matching with GPT-4o
- Token usage tracking
- Error handling & fallback to Gemini
```

**Tasks:**
- [ ] Install `openai` package: `npm install openai`
- [ ] Create OpenAI service file
- [ ] Implement all AI functions (mirror gemini.service.js)
- [ ] Add token counting
- [ ] Add error handling
- [ ] Test all endpoints

---

### 2.2 AI Router Service
**File:** `server/services/aiRouter.service.js` (NEW)

**Purpose:** Route AI requests to correct provider based on user tier

**Functions:**
```javascript
- getAIService(user) → returns gemini or openai service
- parseResume(user, resumeText)
- enhanceContent(user, content, sectionType)
- generateSummary(user, resumeData)
- analyzeATS(user, resumeText, jobDescription)
- matchJobs(user, resumeData, jobDescription)
```

**Logic:**
```javascript
function getAIService(user) {
  if (user.subscription.tier === 'premium' && user.subscription.status === 'active') {
    return openaiService;
  }
  return geminiService;
}
```

**Tasks:**
- [ ] Create AI router service
- [ ] Implement routing logic
- [ ] Add fallback mechanism
- [ ] Test with both tiers
- [ ] Add logging

---

### 2.3 Subscription Middleware
**File:** `server/middleware/subscription.middleware.js` (NEW)

**Features:**
```javascript
- checkSubscription() - Verify active subscription
- checkUsageLimit() - Check tier-based limits
- requirePremium() - Require premium tier
- trackUsage() - Log AI usage
- enforceRateLimit() - Prevent abuse
```

**Usage Limits:**
```javascript
const TIER_LIMITS = {
  free: {
    resumesPerMonth: 1,
    atsScansPerMonth: 0,
    jobMatchesPerMonth: 0,
    coverLettersPerMonth: 0,
    templatesAccess: ['professional'], // Only 1 basic template
    aiModel: 'gemini'
  },
  'one-time': {
    resumesPerMonth: 1,
    atsScansPerMonth: 1,
    jobMatchesPerMonth: 3,
    coverLettersPerMonth: 1,
    templatesAccess: 'all',
    accessDays: 7, // 7-day access to edit
    aiModel: 'gpt4o'
  },
  pro: {
    resumesPerMonth: Infinity,
    atsScansPerMonth: Infinity,
    jobMatchesPerDay: 10,
    coverLettersPerMonth: Infinity,
    templatesAccess: 'all',
    aiModel: 'hybrid' // Mix of Gemini + GPT-4o
  },
  premium: {
    resumesPerMonth: Infinity,
    atsScansPerMonth: Infinity,
    jobMatchesPerDay: Infinity,
    coverLettersPerMonth: Infinity,
    interviewQAPerMonth: Infinity,
    templatesAccess: 'all',
    aiModel: 'gpt4o',
    priorityProcessing: true,
    humanReview: 1 // Once per month
  },
  student: {
    // Same as Pro, but time-limited
    ...TIER_LIMITS.pro,
    duration: '3-months'
  },
  lifetime: {
    // Same as Pro forever
    ...TIER_LIMITS.pro,
    duration: 'lifetime'
  }
};
```

**Tasks:**
- [ ] Create middleware file
- [ ] Implement subscription check
- [ ] Implement usage limit check
- [ ] Add usage tracking
- [ ] Add rate limiting
- [ ] Test all scenarios

---

### 2.4 Subscription Controller
**File:** `server/controllers/subscription.controller.js` (NEW)

**Endpoints:**
```javascript
POST   /api/subscription/create       - Create premium subscription
GET    /api/subscription/status       - Get user subscription status
POST   /api/subscription/cancel       - Cancel subscription
POST   /api/subscription/renew        - Renew subscription
GET    /api/subscription/usage        - Get usage statistics
GET    /api/subscription/plans        - Get available plans
POST   /api/subscription/upgrade      - Upgrade to premium
```

**Tasks:**
- [ ] Create controller
- [ ] Implement all endpoints
- [ ] Add validation
- [ ] Add error handling
- [ ] Test with Postman

---

### 2.5 Payment Integration (Razorpay for India)
**File:** `server/services/payment.service.js` (NEW)

**Features:**
```javascript
- createOrder(amount, userId)
- verifyPayment(orderId, paymentId, signature)
- createSubscription(planId, userId)
- cancelSubscription(subscriptionId)
- getInvoice(invoiceId)
```

**Plans:**
```javascript
const PRICING_PLANS = {
  india: {
    'one-time': { amount: 49, currency: 'INR', type: 'one-time' },
    'pro-monthly': { amount: 149, currency: 'INR', type: 'subscription' },
    'pro-yearly': { amount: 1499, currency: 'INR', type: 'subscription' }, // 2 months free
    'premium-monthly': { amount: 249, currency: 'INR', type: 'subscription' },
    'premium-yearly': { amount: 2499, currency: 'INR', type: 'subscription' },
    'student-3months': { amount: 99, currency: 'INR', type: 'one-time' },
    'lifetime': { amount: 499, currency: 'INR', type: 'one-time' }
  },
  international: {
    'one-time': { amount: 0.99, currency: 'USD', type: 'one-time' },
    'pro-monthly': { amount: 2.99, currency: 'USD', type: 'subscription' },
    'pro-yearly': { amount: 29.99, currency: 'USD', type: 'subscription' },
    'premium-monthly': { amount: 4.99, currency: 'USD', type: 'subscription' },
    'premium-yearly': { amount: 49.99, currency: 'USD', type: 'subscription' },
    'student-3months': { amount: 1.99, currency: 'USD', type: 'one-time' },
    'lifetime': { amount: 9.99, currency: 'USD', type: 'one-time' }
  },
  addons: {
    'cover-letter': { amount: 10, currency: 'INR' },
    'ats-score': { amount: 15, currency: 'INR' },
    'job-match': { amount: 10, currency: 'INR' },
    'portfolio-export': { amount: 20, currency: 'INR' },
    'template-upgrade': { amount: 25, currency: 'INR' },
    'ai-review': { amount: 29, currency: 'INR' }
  }
};
```

**Tasks:**
- [ ] Install Razorpay: `npm install razorpay`
- [ ] Set up Razorpay account
- [ ] Create payment service
- [ ] Implement order creation
- [ ] Implement payment verification
- [ ] Add webhook handling
- [ ] Test in sandbox mode

---

### 2.6 Update Existing Controllers

**Files to Update:**
- `server/controllers/resume.controller.js`
- `server/controllers/ats.controller.js`
- `server/controllers/ml.controller.js`

**Changes:**
```javascript
// Before (direct Gemini call)
const result = await geminiService.parseResume(resumeText);

// After (route based on tier)
const result = await aiRouter.parseResume(req.user, resumeText);
```

**Tasks:**
- [ ] Update resume.controller.js (parseResume, enhanceContent)
- [ ] Update ats.controller.js (analyzeResume)
- [ ] Update ml.controller.js (matchScore, skillGaps)
- [ ] Add usage tracking
- [ ] Add limit checks
- [ ] Test all endpoints

---

### 2.7 Subscription Routes
**File:** `server/routes/subscription.routes.js` (NEW)

**Routes:**
```javascript
router.post('/create', auth, createSubscription);
router.get('/status', auth, getSubscriptionStatus);
router.post('/cancel', auth, cancelSubscription);
router.get('/usage', auth, getUsageStats);
router.get('/plans', getPlans);
router.post('/webhook/razorpay', verifyWebhook, handleWebhook);
```

**Tasks:**
- [ ] Create routes file
- [ ] Add authentication
- [ ] Add validation
- [ ] Connect to main app.js
- [ ] Test all routes

---

## 🎨 Phase 3: Frontend Implementation (5-6 hours)

### 3.1 Pricing Page
**File:** `client/src/pages/Pricing.jsx` (NEW)

**Features:**
- Display Free vs Premium comparison
- Pricing cards with features
- Monthly/Yearly toggle
- Currency selector (INR/USD)
- Call-to-action buttons
- FAQ section

**Tasks:**
- [ ] Create Pricing component
- [ ] Design pricing cards
- [ ] Add feature comparison table
- [ ] Implement toggle switches
- [ ] Add animations
- [ ] Make responsive
- [ ] Add to navigation

---

### 3.2 Subscription Dashboard
**File:** `client/src/pages/SubscriptionDashboard.jsx` (NEW)

**Features:**
- Current plan display
- Usage statistics (progress bars)
- Upgrade/Cancel buttons
- Payment history
- Invoice downloads
- Next billing date

**Tasks:**
- [ ] Create dashboard component
- [ ] Fetch subscription data
- [ ] Display usage stats
- [ ] Add upgrade flow
- [ ] Add cancel flow
- [ ] Show payment history
- [ ] Add responsive design

---

### 3.3 Payment Integration (Frontend)
**File:** `client/src/components/payment/RazorpayCheckout.jsx` (NEW)

**Features:**
- Razorpay checkout integration
- Payment success/failure handling
- Order creation
- Payment verification
- Loading states
- Error handling

**Tasks:**
- [ ] Install Razorpay: `npm install razorpay`
- [ ] Create checkout component
- [ ] Implement Razorpay script loading
- [ ] Handle payment flow
- [ ] Add success/failure modals
- [ ] Test in sandbox

---

### 3.4 Usage Limit Indicators
**Files:**
- `client/src/components/subscription/UsageBadge.jsx` (NEW)
- `client/src/components/subscription/UpgradePrompt.jsx` (NEW)

**Features:**
```javascript
// UsageBadge
- Show "2/3 resumes used this month"
- Progress bar
- Premium badge for unlimited

// UpgradePrompt
- Modal when limit reached
- "Upgrade to Premium" CTA
- Feature highlights
```

**Tasks:**
- [ ] Create UsageBadge component
- [ ] Create UpgradePrompt modal
- [ ] Integrate in ResumeEditor
- [ ] Integrate in ATS analyzer
- [ ] Add animations
- [ ] Test limit scenarios

---

### 3.5 Update Existing Components

**Files to Update:**
- `client/src/components/layout/Navbar.jsx` - Add "Upgrade" button
- `client/src/components/dashboard/Dashboard.jsx` - Show subscription status
- `client/src/components/editor/ResumeEditor.jsx` - Add usage limits
- `client/src/pages/Home.jsx` - Add pricing section

**Tasks:**
- [ ] Add "Upgrade to Premium" button in navbar
- [ ] Show subscription badge in dashboard
- [ ] Add usage indicators in editor
- [ ] Update home page with pricing
- [ ] Add premium features highlights

---

### 3.6 API Service Updates
**File:** `client/src/services/api.js`

**Add:**
```javascript
export const subscriptionAPI = {
  getStatus: () => api.get('/subscription/status'),
  createSubscription: (planId) => api.post('/subscription/create', { planId }),
  cancelSubscription: () => api.post('/subscription/cancel'),
  getUsage: () => api.get('/subscription/usage'),
  getPlans: () => api.get('/subscription/plans'),
};
```

**Tasks:**
- [ ] Add subscription API methods
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test all endpoints

---

## 🔐 Phase 4: Environment & Configuration (1-2 hours)

### 4.1 Environment Variables

**Add to `.env`:**
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxx

# Subscription Settings
PREMIUM_MONTHLY_PRICE_INR=499
PREMIUM_YEARLY_PRICE_INR=4999
PREMIUM_MONTHLY_PRICE_USD=9.99
PREMIUM_YEARLY_PRICE_USD=99

# Usage Limits
FREE_TIER_RESUME_LIMIT=3
FREE_TIER_ATS_LIMIT=5
FREE_TIER_JOB_MATCH_LIMIT=3
```

**Tasks:**
- [ ] Update .env file
- [ ] Update .env.example
- [ ] Document all variables
- [ ] Add to deployment configs

---

### 4.2 Configuration File
**File:** `server/config/subscription.config.js` (NEW)

```javascript
export const SUBSCRIPTION_CONFIG = {
  tiers: {
    free: {
      name: 'Free',
      limits: { resumesPerMonth: 3, atsScansPerMonth: 5, jobMatchesPerMonth: 3 },
      aiModel: 'gemini',
      features: ['3 Resumes/month', 'Basic Templates', 'ATS Scoring']
    },
    premium: {
      name: 'Premium',
      limits: { resumesPerMonth: Infinity, atsScansPerMonth: Infinity, jobMatchesPerMonth: Infinity },
      aiModel: 'gpt4o',
      features: ['Unlimited Resumes', 'All Templates', 'Advanced AI', 'Priority Support']
    }
  },
  pricing: {
    india: { monthly: 499, yearly: 4999, currency: 'INR' },
    international: { monthly: 9.99, yearly: 99, currency: 'USD' }
  }
};
```

**Tasks:**
- [ ] Create config file
- [ ] Export constants
- [ ] Add to server imports
- [ ] Test configuration

---

## 🧪 Phase 5: Testing (3-4 hours)

### 5.1 Backend Testing

**Test Cases:**
- [ ] User registration defaults to free tier
- [ ] Free user can create up to 3 resumes
- [ ] Free user gets blocked after limit
- [ ] Premium user has unlimited access
- [ ] Payment flow works correctly
- [ ] Subscription upgrade works
- [ ] Subscription cancel works
- [ ] Usage tracking is accurate
- [ ] AI routing works (Gemini for free, GPT-4o for premium)
- [ ] Token usage is logged
- [ ] Webhooks update subscription status

**Tools:**
- Postman for API testing
- Jest for unit tests
- Manual testing for flows

**Tasks:**
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test with Postman
- [ ] Test payment flow
- [ ] Test all edge cases

---

### 5.2 Frontend Testing

**Test Cases:**
- [ ] Pricing page displays correctly
- [ ] Payment flow completes
- [ ] Usage indicators show correctly
- [ ] Upgrade prompts appear at limits
- [ ] Subscription dashboard works
- [ ] Cancel flow works
- [ ] Responsive on mobile
- [ ] Dark mode works

**Tasks:**
- [ ] Manual UI testing
- [ ] Test on different browsers
- [ ] Test on mobile
- [ ] Test payment flows
- [ ] Test error scenarios

---

## 🚀 Phase 6: Deployment (2-3 hours)

### 6.1 Database Migration

**Script:** `server/scripts/migrateUsers.js`

```javascript
// Migrate existing users to free tier
await User.updateMany(
  { 'subscription.tier': { $exists: false } },
  { 
    $set: { 
      'subscription.tier': 'free',
      'subscription.status': 'active',
      'usage.resumesCreated': 0
    }
  }
);
```

**Tasks:**
- [ ] Create migration script
- [ ] Test on dev database
- [ ] Backup production database
- [ ] Run migration on production
- [ ] Verify data integrity

---

### 6.2 Production Deployment

**Checklist:**
- [ ] Add OpenAI API key to production env
- [ ] Add Razorpay keys to production env
- [ ] Update frontend env variables
- [ ] Deploy backend to Render/Railway
- [ ] Deploy frontend to Vercel
- [ ] Test production payment flow
- [ ] Monitor error logs
- [ ] Set up usage alerts

---

## 📊 Phase 7: Monitoring & Analytics (1-2 hours)

### 7.1 Usage Analytics

**File:** `server/services/analytics.service.js` (NEW)

**Track:**
- Daily active users (free vs premium)
- Conversion rate (free → premium)
- Average revenue per user (ARPU)
- Token usage per tier
- API costs per tier
- Churn rate

**Tasks:**
- [ ] Create analytics service
- [ ] Add tracking events
- [ ] Create admin dashboard
- [ ] Set up alerts for high usage

---

### 7.2 Cost Monitoring

**Alert thresholds:**
- [ ] Email if daily AI cost > $10
- [ ] Email if user exceeds 50K tokens/day
- [ ] Slack notification for failed payments
- [ ] Track cost per user

---

## 📝 Documentation (1 hour)

### Files to Create/Update:
- [ ] `docs/SUBSCRIPTION_GUIDE.md` - How subscription works
- [ ] `docs/PAYMENT_INTEGRATION.md` - Payment setup guide
- [ ] `docs/API_DOCUMENTATION.md` - Update with new endpoints
- [ ] `README.md` - Update with premium features
- [ ] `CHANGELOG.md` - Document major changes

---

## 🎯 Implementation Order (Recommended)

### Day 1 (8 hours)
1. ✅ Phase 1.1-1.3: Database models (3-4 hrs)
2. ✅ Phase 2.1: OpenAI integration (2 hrs)
3. ✅ Phase 2.2: AI Router (1 hr)
4. ✅ Phase 2.3: Subscription middleware (2 hrs)

### Day 2 (8 hours)
1. ✅ Phase 2.4-2.5: Controllers & Payment (4 hrs)
2. ✅ Phase 2.6-2.7: Update routes (2 hrs)
3. ✅ Phase 4: Environment setup (1 hr)
4. ✅ Phase 5.1: Backend testing (1 hr)

### Day 3 (8 hours)
1. ✅ Phase 3.1-3.3: Frontend (Pricing, Dashboard, Payment) (5 hrs)
2. ✅ Phase 3.4-3.6: Usage indicators & API updates (2 hrs)
3. ✅ Phase 5.2: Frontend testing (1 hr)

### Day 4 (Optional - Polish)
1. ✅ Phase 6: Deployment (2 hrs)
2. ✅ Phase 7: Monitoring (1 hr)
3. ✅ Phase 8: Documentation (1 hr)
4. ✅ Final testing & bug fixes (4 hrs)

---

## 💡 Quick Wins (Do These First)

### Minimum Viable Premium (MVP) - 4 hours
1. Add `subscription.tier` to User model
2. Create simple middleware to check tier
3. Update one AI endpoint to use GPT-4o for premium
4. Create basic pricing page
5. Manual subscription upgrade (no payment yet)

This lets you test the core concept without payment integration.

---

## 🚨 Potential Issues & Solutions

### Issue 1: OpenAI Rate Limits
**Solution:** Implement exponential backoff, queue system

### Issue 2: High Costs
**Solution:** Set strict daily/monthly limits, alerts at $50, $100

### Issue 3: Payment Failures
**Solution:** Retry logic, grace period (3 days), email notifications

### Issue 4: User Confusion
**Solution:** Clear pricing, feature comparison, FAQ, tooltips

### Issue 5: Migration Issues
**Solution:** Thorough testing, backups, rollback plan

---

## 📊 Success Metrics

Track these after launch:
- [ ] Conversion rate (free → premium): Target 3-5%
- [ ] Monthly recurring revenue (MRR): Target ₹50,000 in 3 months
- [ ] Customer acquisition cost (CAC): Keep under ₹500
- [ ] Churn rate: Keep under 5%
- [ ] Average revenue per user (ARPU): Target ₹499-999
- [ ] AI cost as % of revenue: Keep under 5%

---

## 🎉 Launch Checklist

Before going live:
- [ ] All tests passing
- [ ] Payment flow tested with real money (small amount)
- [ ] Subscription cancellation works
- [ ] Usage limits enforced
- [ ] AI routing works correctly
- [ ] Email notifications working
- [ ] Analytics tracking works
- [ ] Documentation complete
- [ ] Backup/rollback plan ready
- [ ] Customer support plan ready
- [ ] Pricing finalized
- [ ] Terms of Service updated
- [ ] Privacy Policy updated

---

## 📞 Support

After launch, monitor:
- [ ] User feedback on pricing
- [ ] Payment success rate
- [ ] API error rates
- [ ] Cost per user
- [ ] Support tickets

---

**Ready to start? Let's begin with Phase 1.1 - Updating the User Model!** 🚀

Would you like me to:
1. Start implementing the User model updates
2. Create the OpenAI service first
3. Set up the subscription middleware
4. Or start with the pricing page

Which would you prefer to tackle first?
