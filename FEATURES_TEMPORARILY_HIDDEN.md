# Temporarily Hidden Features

## Summary of Changes (December 5, 2025)

### 1. **Shortened Feature Descriptions on Home Page** ✅

**File:** `/client/src/pages/Home.jsx`

Made all feature card descriptions shorter and more concise:

**Before → After:**

- **ATS Optimization**: 
  - Was: "Beat the bots! Our system ensures your resume passes Applicant Tracking Systems with optimized formatting and keyword placement."
  - Now: "Beat applicant tracking systems with optimized formatting and keyword matching."

- **Smart Scoring & Insights**:
  - Was: "Get instant ATS scores. Know exactly how your resume performs against real job descriptions and tech stacks."
  - Now: "Get detailed feedback on every section with actionable improvements."

- **Professional Templates**:
  - Was: "Choose from 8+ sleek, recruiter-approved templates. From Classic to Creative — all ATS-friendly and beautifully designed."
  - Now: "Choose from 8 ATS-friendly templates designed by experts."

- **Affordable Pricing**:
  - Was: "Start free forever or upgrade to Pro at just ₹199/month. No hidden fees, cancel anytime. Premium features that won't break the bank."
  - Now: "Start free forever or upgrade to Pro at just ₹199/month. No hidden fees, cancel anytime."

**Result:** Feature cards are now shorter and more scannable! 📏

---

### 2. **Commented Out: Advanced Analytics** 🔒

**File:** `/client/src/pages/Pricing.jsx`

**Location:** Feature comparison table (line ~336)

**Comment Added:**
```javascript
// TEMPORARILY HIDDEN - Analytics feature to be enabled later
// {
//   name: "Advanced Analytics",
//   values: ["✗", "✗", "✓"],
// },
```

**Also Updated:** FAQ section to remove "advanced analytics" mention
- Changed from: "unlimited ATS scans, advanced analytics, and priority support"
- Changed to: "unlimited ATS scans, and priority support"

**Why Hidden:**
- Analytics dashboard exists but will be rolled out later
- Pro users will get access when feature is ready
- Backend tracking already in place

**To Re-enable:**
Simply uncomment the lines in the pricing table and FAQ section.

---

### 3. **Commented Out: Cover Letters** 📝

**File:** `/client/src/pages/Pricing.jsx`

**Location:** Feature comparison table (line ~316)

**Comment Added:**
```javascript
// TEMPORARILY HIDDEN - Cover Letters feature not yet implemented
// {
//   name: "Cover Letters",
//   values: ["✗", "✗", "∞"],
// },
```

**Backend Status:**
✅ Backend models already have cover letter tracking:
- `coverLetters` (total count)
- `coverLettersThisMonth` (monthly usage)
- `coverLettersPerMonth` (limit based on tier)

**Tier Limits (Already Configured in Backend):**
- **Free**: 0 per month
- **One-Time**: 5 per month
- **Pro**: Unlimited (Infinity)

**Files with Cover Letter References:**
- `/server/models/User.model.js` - Usage limits defined
- `/server/services/payment.service.js` - Initialization
- `/server/controllers/subscription.controller.js` - Usage tracking

**To Re-enable:**
1. Uncomment the pricing table row
2. Implement the cover letter generation UI
3. Backend is already ready!

---

## Currently Hidden Features Summary

| Feature | Status | Frontend | Backend | Re-enable Difficulty |
|---------|--------|----------|---------|---------------------|
| **Advanced Analytics** | Hidden | Commented out | ✅ Complete | Easy - Just uncomment |
| **Cover Letters** | Hidden | Commented out | ✅ Complete | Medium - Need UI implementation |
| **Job Matches** | Hidden | Commented out | ✅ Complete | Easy - Just uncomment (Razorpay compliance) |

---

## Other Existing Hidden Features

### Job Matches per Day (Razorpay Compliance)
**Status:** Also commented out for Razorpay compliance
**Location:** Same pricing table
**Comment:**
```javascript
// TEMPORARILY HIDDEN FOR RAZORPAY COMPLIANCE
// {
//   name: "Job Matches per Day",
//   values: ["0", "3", "∞"],
// },
```

---

## Active Features in Pricing Page

✅ **Resumes per Month**
✅ **ATS Score Analysis**
✅ **AI Model** (Gemini vs GPT-4o)
✅ **AI Resume Extraction** (2/day for Pro)
✅ **All Templates**
✅ **Portfolio Builder** (Pro only)
✅ **Priority Support** (Pro only)

---

## Feature Rollout Plan

### Phase 1 (Current - December 2025)
- Core resume building
- ATS scanning
- Template selection
- Basic AI features

### Phase 2 (Future)
- **Advanced Analytics** - Detailed usage insights
- **Cover Letter Generation** - AI-powered cover letters
- **Job Matches** - Smart job recommendations (compliance pending)

---

## Developer Notes

### To Uncomment Cover Letters:
1. Open `/client/src/pages/Pricing.jsx`
2. Find line ~316 (search for "Cover Letters")
3. Remove comment markers (`//`)
4. Backend will automatically handle limits
5. Implement UI for cover letter generation

### To Uncomment Advanced Analytics:
1. Open `/client/src/pages/Pricing.jsx`
2. Find line ~336 (search for "Advanced Analytics")
3. Remove comment markers (`//`)
4. Update FAQ section (remove comment)
5. Ensure `/subscription/analytics` route is enabled

### Backend Configuration Location:
- User usage limits: `/server/models/User.model.js` (lines 300-350)
- Usage tracking: `/server/controllers/subscription.controller.js`
- Payment service: `/server/services/payment.service.js`

---

## Visual Changes

### Before (Long Descriptions):
- Feature cards had 2-3 lines of text
- Looked cluttered on mobile
- Too much scrolling required

### After (Short Descriptions):
- Feature cards have 1 line of text
- Clean and scannable
- Better mobile experience
- Maintains all key information

---

**Last Updated:** December 5, 2025  
**Status:** ✅ All changes implemented successfully  
**Impact:** Improved user experience, cleaner pricing page, feature rollout flexibility
