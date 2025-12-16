# One-Time Subscription - AI & Download Restrictions

## 📋 Current Behavior Analysis

### ✅ What Already Works:
1. **Subscription Expiry Detection**: When one-time subscription expires (21 days), it automatically:
   - Changes status from `active` → `expired`
   - Downgrades tier from `one-time` → `free`
   - This happens in `User.model.js` → `checkSubscriptionExpiry()`

2. **Feature Access Control**: The system checks `user.hasActiveSubscription()` which returns:
   - `true` if status = "active" AND endDate > now
   - `false` if expired

### ❌ Current Issues:

#### Issue 1: AI Enhancement After Expiry
**Problem**: When one-time subscription expires, old resumes can STILL use AI enhancement
- **Why**: The AI enhancement endpoint only checks if user has reached monthly limit
- **Current Check**: `checkUsageLimit("aiGenerationsPerMonth")`
- **What's Missing**: Check if subscription is active

#### Issue 2: Resume Download After Expiry  
**Problem**: When one-time subscription expires, old resumes can STILL be downloaded
- **Why**: The download endpoint only checks monthly download limit
- **Current Check**: `checkUsageLimit("resumeDownloadsPerMonth")`
- **What's Missing**: Check if subscription is active for premium resumes

#### Issue 3: Multiple One-Time Purchases
**Question**: If user buys one-time again after expiry, which resumes get access?

---

## 🎯 Desired Behavior (Your Requirements)

### Scenario 1: First One-Time Purchase (₹49)
1. User buys one-time subscription
2. User creates Resume #1 using AI enhancement ✅
3. User can download Resume #1 ✅
4. **21 days pass, subscription expires**
5. Resume #1 **CANNOT use AI enhancement anymore** ❌ (Currently broken)
6. Resume #1 **CANNOT be downloaded** ❌ (Currently broken)
7. User is back to FREE tier

### Scenario 2: Second One-Time Purchase (₹49)
1. User buys one-time subscription AGAIN
2. User creates Resume #2 using AI enhancement ✅
3. **Question**: What about Resume #1?
   - **Option A**: Resume #1 can NOW use AI again (both resumes active)
   - **Option B**: ONLY Resume #2 can use AI (1 resume per purchase)

---

## 💡 Recommended Solution

### Best Approach: **Option B - 1 Resume Per Purchase**

**Why Option B is better:**
- ✅ Fair to pricing (₹49 = 1 resume)
- ✅ Encourages multiple purchases
- ✅ Clear user expectation
- ✅ Better revenue model
- ✅ Prevents abuse

**How it works:**
1. When user buys one-time subscription:
   - User can create **1 new resume** with AI
   - That resume is "linked" to this subscription
   - After 21 days, ONLY that resume loses AI/download access

2. When user buys one-time AGAIN:
   - User can create **1 more new resume** with AI
   - This is a separate subscription
   - Old resume stays locked unless re-purchased

3. Each resume "remembers" which subscription paid for it

---

## 🔧 Implementation Plan

### Step 1: Add Subscription Tracking to Resumes

**Modify Resume Model** to track which subscription created it:

\`\`\`javascript
// In resume.model.js
const resumeSchema = new mongoose.Schema({
  // ... existing fields ...
  
  subscriptionInfo: {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    createdWithTier: {
      type: String,
      enum: ["free", "one-time", "pro"],
      default: "free",
    },
    createdWithSubscription: {
      type: Boolean,
      default: false,
    },
  },
});
\`\`\`

### Step 2: Track Subscription When Resume Created

**Modify Resume Controller** to save subscription info:

\`\`\`javascript
// When creating/updating resume
if (user.subscription.tier === "one-time" || user.subscription.tier === "pro") {
  const activeSubscription = await Subscription.findOne({
    userId: user._id,
    status: "active",
    tier: user.subscription.tier,
  });
  
  resume.subscriptionInfo = {
    subscriptionId: activeSubscription._id,
    createdWithTier: user.subscription.tier,
    createdWithSubscription: true,
  };
}
\`\`\`

### Step 3: Check Active Subscription for AI Enhancement

**Modify Middleware** to verify subscription is still active:

\`\`\`javascript
// New middleware: checkResumeSubscriptionAccess
export async function checkResumeSubscriptionAccess(req, res, next) {
  try {
    const user = req.user;
    const resumeId = req.body.resumeId || req.params.resumeId;
    
    // Get the resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    
    // If resume was created with one-time subscription
    if (resume.subscriptionInfo?.createdWithTier === "one-time") {
      // Check if that subscription is still active
      const subscription = await Subscription.findById(
        resume.subscriptionInfo.subscriptionId
      );
      
      if (!subscription || subscription.status !== "active") {
        return res.status(403).json({
          error: "Subscription expired",
          message: "Your one-time subscription for this resume has expired. Please purchase again to continue using AI features.",
          requiresUpgrade: true,
        });
      }
    }
    
    // If user has active pro subscription, allow all resumes
    if (user.subscription.tier === "pro" && user.subscription.status === "active") {
      return next();
    }
    
    // Free users shouldn't reach here (blocked by other middleware)
    next();
  } catch (error) {
    console.error("Resume subscription access check error:", error);
    res.status(500).json({ error: "Failed to verify subscription access" });
  }
}
\`\`\`

### Step 4: Check Active Subscription for Download

**Apply same logic to download endpoint**:

\`\`\`javascript
// In resume.routes.js
router.post(
  "/track-download",
  authenticateToken,
  checkSubscription,
  checkResumeSubscriptionAccess, // NEW: Check if resume's subscription is active
  checkUsageLimit("resumeDownloadsPerMonth"),
  trackDownload
);
\`\`\`

### Step 5: Check Active Subscription for AI Features

**Apply to all AI endpoints**:

\`\`\`javascript
router.post(
  "/enhance",
  authenticateToken,
  checkSubscription,
  checkResumeSubscriptionAccess, // NEW
  checkUsageLimit("aiGenerationsPerMonth"),
  aiLimiter,
  checkAIQuota,
  validateContentEnhance,
  enhanceContent
);
\`\`\`

---

## 📊 User Experience Flow

### Example Timeline:

**Day 1**: User buys One-Time (₹49)
- Subscription: Active, Expires in 21 days
- Creates Resume #1 with AI ✅
- Resume #1 linked to Subscription #1

**Day 10**: Using Resume #1
- AI Enhancement works ✅
- Download works ✅
- Can edit resume ✅

**Day 22**: Subscription Expires
- Subscription: Expired
- Resume #1 AI Enhancement ❌ BLOCKED
- Resume #1 Download ❌ BLOCKED
- Can still VIEW resume ✅
- Message: "Your subscription expired. Purchase again to continue."

**Day 25**: User buys One-Time AGAIN (₹49)
- New Subscription #2: Active, Expires in 21 days
- Resume #1 still LOCKED (tied to old subscription)
- Can create NEW Resume #2 ✅
- Resume #2 linked to Subscription #2

**Day 30**: User has 2 resumes
- Resume #1: View only (old subscription)
- Resume #2: Full access (current subscription)
- If wants Resume #1 active: Buy another one-time

---

## 🎯 Alternative: Option A (All Resumes Active)

If you prefer ANY active subscription unlocks ALL resumes:

**Simpler approach:**
- Don't track subscription per resume
- Just check: "Does user have ANY active subscription?"
- If yes: All resumes can use AI and download
- If no: All resumes blocked

**Implementation:**
\`\`\`javascript
export async function checkResumeAccess(req, res, next) {
  const user = req.user;
  
  // Check if user has ANY active subscription
  if (!user.hasActiveSubscription()) {
    return res.status(403).json({
      error: "Subscription required",
      message: "You need an active subscription to use AI features and downloads.",
      requiresUpgrade: true,
    });
  }
  
  next();
}
\`\`\`

**Pros:**
- ✅ Simpler to implement
- ✅ Better user experience
- ✅ Encourages recurring subscriptions

**Cons:**
- ❌ Less revenue (1 subscription = unlimited old resumes)
- ❌ People won't buy multiple one-time subscriptions

---

## 🤔 Recommendation

### **Choose Option B (1 Resume Per Purchase)**

**Reasoning:**
1. One-time is ₹49 for "1 resume"
2. Pro Monthly (₹199) is for "unlimited resumes"
3. This makes Pro more valuable
4. Encourages users to upgrade to Pro if they need multiple resumes
5. Fair pricing model

### **Pricing Psychology:**
- **One-Time (₹49)**: "Quick resume for job application"
- **Pro Monthly (₹199)**: "Multiple resumes, ongoing job search"
- **Pro Yearly (₹1,990)**: "Career management, best value"

If one-time unlocks ALL old resumes, nobody would buy Pro! 📉

---

## 🚀 Implementation Priority

1. **High Priority** ✅
   - Add subscription access checks to AI enhancement
   - Add subscription access checks to downloads
   - Show clear error messages when expired

2. **Medium Priority** 📝
   - Track which subscription created each resume
   - Link resumes to subscriptions
   - Update UI to show subscription status per resume

3. **Low Priority** 🔮
   - Add "unlock this resume" purchase option
   - Show subscription expiry countdown per resume
   - Analytics on subscription renewals

---

## ❓ Questions to Answer

1. **Which option do you prefer?**
   - Option A: Any active subscription unlocks ALL resumes
   - Option B: 1 subscription = 1 resume access

2. **Should users be able to "unlock" old resumes?**
   - Yes: Add "Unlock Resume (₹49)" button on expired resumes
   - No: They must buy new one-time subscription for new resume

3. **What about Pro users who downgrade?**
   - Scenario: User has Pro (unlimited), creates 10 resumes, then cancels
   - Should all 10 resumes stay accessible or lock?

---

## 💬 My Recommendation

**Best User Experience + Revenue:**

1. **One-Time Subscription (₹49)**:
   - Creates 1 resume
   - AI and download work for 21 days
   - After expiry: View only, no AI, no download
   - Can buy another one-time for NEW resume

2. **Pro Monthly (₹199)**:
   - Unlimited resumes
   - All AI features
   - Unlimited downloads
   - When active: ALL resumes work (even old one-time resumes)
   - When expires: Back to view-only

3. **Clear Messaging**:
   - "One-Time: 1 resume, 21 days (₹49)"
   - "Pro: Unlimited resumes, unlimited time (₹199/month)"
   - "Pro Yearly: Save ₹398 (₹1,990/year)"

This makes Pro MUCH more attractive for serious job seekers! 🎯
