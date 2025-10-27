# 🚀 AI Quota Management - Quick Reference

## 📍 Access URL
```
http://localhost:5173/admin/ai-quota
```

## 🎯 Quick Overview

### What You'll See
1. **Summary Cards** (Top of page)
   - Total Users
   - Daily Usage
   - Monthly Cost
   - Users Near Limit

2. **User Table** (Main content)
   - Name & Email
   - Tier Badge (FREE/PREMIUM/ADMIN)
   - Daily Quota Progress Bar
   - Monthly Usage
   - Cost
   - Status Icon
   - Actions (View Details, Reset)

## 🎨 Status Colors

| Color | Meaning | What to Do |
|-------|---------|------------|
| 🟢 Green | 0-49% used | Normal, no action needed |
| 🟡 Yellow | 50-79% used | Monitor usage |
| 🟠 Orange | 80-99% used | User approaching limit |
| 🔴 Red | 100% used | User blocked, consider reset |
| 🟣 Purple | Admin/Unlimited | No limits apply |

## ⚡ Quick Actions

### Search Users
1. Type name or email in search bar
2. Results filter automatically

### Sort Users
1. Click "Sort by" dropdown
2. Choose: Usage, Cost, Percentage, or Name

### View Details
1. Click "View Details" on any user
2. See detailed analytics:
   - Quota status
   - Usage by feature
   - Recent requests
   - Daily trends

### Reset Quota
1. Click "Reset" on any user (only visible if they have usage)
2. Confirm the action
3. Daily quota resets to 0
4. User can make requests again

**⚠️ Warning**: This deletes today's usage records!

## 📊 Understanding the Data

### Daily Quota
```
7 / 10 ████████░░ 70%
```
- **7** = Requests made today
- **10** = Daily limit
- **70%** = Percentage used
- **Bar color** = Status indicator

### Monthly Usage
```
45 / 200
12,345 tokens
```
- **45** = Total requests this month
- **200** = Monthly limit
- **12,345** = Total tokens consumed

### Cost
```
$0.0045
```
- Calculated from token usage
- Input tokens: $0.000125 per 1K
- Output tokens: $0.000375 per 1K

## 🔍 User Details Modal

Click "View Details" to see:

### 1. Quota Status
- Daily used/limit/remaining
- Monthly used/limit/remaining

### 2. Usage by Feature
```
ai_suggestions: 30 requests, $0.0045
├─ Success: 28
└─ Errors: 2

ats_analysis: 15 requests, $0.0120
├─ Success: 14
└─ Errors: 1
```

### 3. Recent Requests
```
✓ ai_suggestions - 2 mins ago - 1,234 tokens - 1200ms
✓ ats_analysis   - 5 mins ago - 3,456 tokens - 2300ms
✗ ai_suggestions - 10 mins ago - ERROR
```

## 🎯 Common Scenarios

### Scenario 1: User Complains About Quota Limit
1. Search for user by email
2. Click "View Details"
3. Check their usage:
   - Are they really at limit?
   - How many errors?
   - What features are they using?
4. If legitimate, click "Reset" to clear daily quota
5. Monitor for unusual patterns

### Scenario 2: High Costs Alert
1. Sort by "Cost"
2. Identify top spenders
3. Click "View Details" on high-cost users
4. Check:
   - Which features cost most?
   - Are there excessive errors?
   - Is usage pattern normal?
5. Contact user or adjust their tier

### Scenario 3: Monitor Platform Usage
1. Check summary cards at top
2. Note "Users Near Limit" count
3. Click "Sort by Percentage"
4. Review users in orange/red zones
5. Consider:
   - Are quotas too restrictive?
   - Do we need premium tier?
   - Is usage growing?

### Scenario 4: Testing/Development
1. Find test user account
2. Click "Reset" to clear quota
3. Test AI features
4. Check usage appears in admin panel
5. Verify quota enforcement works

## 🔒 Security Notes

- All endpoints require admin authentication
- Rate limited to 200 requests per 15 minutes
- All actions are logged in Activity Logs
- Quota resets are permanent (deletes records)

## 📱 Responsive Design

### Desktop
- Full table view
- All columns visible
- Side-by-side cards

### Tablet
- Slightly condensed table
- Horizontal scroll if needed
- Stacked cards

### Mobile
- Single column layout
- Horizontal scroll for table
- Touch-friendly buttons

## 🎨 Dark Mode Support

The entire dashboard supports dark mode:
- Toggle in top navigation
- All colors adjust automatically
- Charts and graphs adapt
- Text remains readable

## 📝 Important Notes

### Quota Limits (Current)
```javascript
Free Tier:
  Daily: 10 requests
  Monthly: 200 requests

Premium Tier: (Not yet enabled)
  Daily: 100 requests
  Monthly: 2000 requests

Admin Tier:
  Daily: Unlimited (∞)
  Monthly: Unlimited (∞)
```

### Token Costs
```
Input:  $0.000125 per 1,000 tokens
Output: $0.000375 per 1,000 tokens
```

### Features Tracked
- `ai_suggestions` - Resume enhancement, summary, skills
- `ats_analysis` - ATS score and analysis
- `resume_parser` - Document parsing

## 🐛 Troubleshooting

### Data Not Loading
1. Check if backend is running
2. Open browser console for errors
3. Verify admin token is valid
4. Check network tab for API calls

### User Not Appearing
1. Check search spelling
2. Clear search and try sort
3. Verify user exists in database
4. Check if user has any AI usage

### Reset Not Working
1. Confirm admin permissions
2. Check browser console
3. Verify user has usage today
4. Try refreshing the page

### Cost Showing $0.00
1. Check if requests were successful
2. Verify token counts > 0
3. Review AIUsage collection in DB
4. Check if tracking middleware is active

## 🚀 Quick Test Checklist

- [ ] Access `/admin/ai-quota`
- [ ] See summary cards with numbers
- [ ] View user table with data
- [ ] Search for a user
- [ ] Sort by different criteria
- [ ] Click "View Details" on a user
- [ ] See detailed analytics
- [ ] Check progress bars are colored correctly
- [ ] Try "Reset" on a test user
- [ ] Confirm reset works
- [ ] Check "Refresh" button works
- [ ] Verify dark mode works
- [ ] Test on mobile/tablet view

## 📚 API Endpoints Reference

```bash
# List all users with quota
GET /api/admin/ai-quota/users
Query: ?sortBy=usage&order=desc&search=john

# Get user details
GET /api/admin/ai-quota/users/:userId

# Update user tier (future)
PATCH /api/admin/ai-quota/users/:userId/tier
Body: { "tier": "premium" }

# Reset daily quota
POST /api/admin/ai-quota/users/:userId/reset-daily
```

## 🎯 Next Steps

After testing the quota management:

1. ✅ **Verify it works** - Test all features
2. 📊 **Monitor real usage** - Watch actual users
3. 💰 **Track costs** - Review monthly expenses
4. 🔮 **Consider premium** - Plan paid tiers
5. ⏭️ **Move to Day 5** - Input validation & sanitization

## 📖 Full Documentation

For complete details, see:
- `AI_QUOTA_ADMIN_INTEGRATION.md` - Full implementation guide
- `AI_QUOTA_IMPLEMENTATION_SUMMARY.md` - Summary of changes
- `AI_USAGE_TRACKING_GUIDE.md` - Original tracking system

---

**Quick Help**: If you need support, check the detailed guides above or review the implementation in:
- Backend: `server/controllers/admin.controller.js`
- Frontend: `client/src/pages/admin/AIQuotaManagement.jsx`
- Routes: `server/routes/admin.routes.js`
