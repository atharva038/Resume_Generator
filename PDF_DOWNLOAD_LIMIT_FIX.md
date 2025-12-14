# PDF Download Subscription & Limit Fix

## Problem
Users were able to download PDF resumes even when they had no subscription or had exceeded their download limits. The download functionality bypassed subscription checks, while the save functionality properly enforced limits.

## Root Cause
The PDF download button directly called `resumePreviewRef.current.downloadPDF()` which uses `react-to-print` library. This client-side operation happened without checking:
- User subscription status
- Download limits for the user's tier
- Calling the `/track-download` API endpoint

## Solution Implemented

### 1. Added `trackDownload` API Method
**File:** `client/src/services/api.js`
- Added `trackDownload: () => api.post("/resume/track-download")` to `resumeAPI` object
- This calls the existing backend endpoint that checks subscription and limits

### 2. Created `handleDownloadPDF` Function
**File:** `client/src/pages/Editor.jsx`
- Created a new async function that:
  1. Checks if user is logged in
  2. Calls `resumeAPI.trackDownload()` to validate subscription and limits
  3. Only proceeds with PDF download if validation passes
  4. Shows upgrade modal if subscription/limit error (403 status)
  5. Shows error toast for other errors

**Code:**
```javascript
const handleDownloadPDF = async () => {
  if (!user) {
    toast.error("Please login to download your resume");
    navigate("/login");
    return;
  }

  try {
    // First, call track-download API to check subscription and limits
    await resumeAPI.trackDownload();

    // If successful, proceed with PDF download
    if (!showPreview) {
      setShowPreview(true);
      setTimeout(() => {
        if (resumePreviewRef.current?.downloadPDF) {
          resumePreviewRef.current.downloadPDF();
        }
      }, 300);
    } else {
      if (resumePreviewRef.current?.downloadPDF) {
        resumePreviewRef.current.downloadPDF();
      }
    }

    toast.success("Resume download started!");
  } catch (err) {
    // Check if it's a subscription/upgrade error
    if (err.response?.status === 403 && err.response?.data?.upgradeRequired) {
      setUpgradeMessage(err.response.data.message);
      setShowUpgradeModal(true);
    } else {
      toast.error("Failed to download resume: " + parseValidationErrors(err));
    }
  }
};
```

### 3. Updated Download Buttons
**File:** `client/src/pages/Editor.jsx`
- Updated floating download button (desktop)
- Updated mobile download button
- Both now call `handleDownloadPDF` instead of directly calling `downloadPDF()`

**Before:**
```javascript
onClick={() => {
  if (!showPreview) {
    setShowPreview(true);
    setTimeout(() => {
      resumePreviewRef.current?.downloadPDF();
    }, 300);
  } else {
    resumePreviewRef.current?.downloadPDF();
  }
}}
```

**After:**
```javascript
onClick={handleDownloadPDF}
```

### 4. Updated ResumePreview Component
**File:** `client/src/components/editor/preview/ResumePreview.jsx`
- Added `onDownload` prop to component signature
- Download button now uses `onDownload || handlePrint`
- This allows the parent component to control download behavior

**Changes:**
```javascript
// Component signature
const ResumePreview = forwardRef(
  ({ resumeData, template, twoPageMode, onPageUsageChange, onDownload }, ref) => {
    // ...
  }
);

// Download button
<button onClick={onDownload || handlePrint}>
  Download PDF
</button>
```

### 5. Passed Download Handler to ResumePreview
**File:** `client/src/pages/Editor.jsx`
- All 3 instances of `<ResumePreview>` now receive `onDownload={handleDownloadPDF}`
- Main preview panel
- Hidden preview (for certain templates)
- Mobile preview modal

## Backend (Already Implemented)
The backend endpoint was already properly configured with subscription checks:

**File:** `server/routes/resume.routes.js`
```javascript
router.post(
  "/track-download",
  authenticateToken,
  checkSubscription,
  checkUsageLimit("resumeDownloadsPerMonth"),
  trackDownload
);
```

**Middleware Chain:**
1. `authenticateToken` - Verifies JWT token
2. `checkSubscription` - Loads user subscription data
3. `checkUsageLimit("resumeDownloadsPerMonth")` - Checks if user has exceeded download limit
4. `trackDownload` - Controller that increments download counter

## User Experience Flow

### With Valid Subscription
1. User clicks "Download PDF" button
2. API validates subscription and limits ✅
3. Download counter increments
4. PDF download starts
5. Success toast shown: "Resume download started!"

### Without Subscription / Limit Exceeded
1. User clicks "Download PDF" button
2. API rejects request with 403 status ❌
3. Upgrade modal appears with message
4. No PDF download occurs
5. User directed to upgrade

## Tier-Specific Download Limits

| Tier      | Downloads Per Month |
|-----------|---------------------|
| Free      | 1                   |
| One-Time  | Unlimited           |
| Pro       | Unlimited           |
| Premium   | Unlimited           |
| Student   | Unlimited           |
| Lifetime  | Unlimited           |

## Testing Checklist

✅ **Free Tier User (1 download limit):**
- First download works
- Second download blocked with upgrade modal

✅ **One-Time Plan User:**
- Can download unlimited PDFs

✅ **Unauthenticated User:**
- Redirected to login when clicking download

✅ **All Download Buttons:**
- Floating download button (desktop)
- Mobile download button
- Preview panel download button

✅ **Error Handling:**
- Upgrade modal shows for subscription errors
- Error toast shows for other errors
- Proper error messages displayed

## Files Modified

1. `client/src/services/api.js` - Added `trackDownload` API method
2. `client/src/pages/Editor.jsx` - Added `handleDownloadPDF` function and updated all download buttons
3. `client/src/components/editor/preview/ResumePreview.jsx` - Added `onDownload` prop support

## Related Documentation

- User Model: `server/models/User.model.js` - Usage limits defined
- Subscription Middleware: `server/middleware/subscription.middleware.js` - Limit checking logic
- Resume Controller: `server/controllers/resume.controller.js` - Track download implementation
- One-Time Plan Implementation: `docs/implementation/ONE_TIME_PLAN_IMPLEMENTATION.md`

## Notes

- The fix follows the same pattern as the save functionality
- No changes needed to backend - it was already properly secured
- Frontend now properly validates before triggering client-side download
- Consistent error handling across all features
- Upgrade modal reused from save functionality

## Status

✅ **COMPLETE** - Users can no longer bypass subscription limits when downloading PDFs.
