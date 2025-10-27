# AI Quota Management - Admin Panel Integration

## 🎯 Overview

The AI Quota Management feature has been successfully integrated into the admin panel, providing comprehensive monitoring and control over user AI usage quotas.

## ✨ Features

### 1. **Real-Time Quota Monitoring**
- View all users with their current quota status
- Daily and monthly usage tracking
- Real-time percentage calculations
- Visual progress bars for quota usage

### 2. **User Management**
- Search users by name or email
- Sort by usage, cost, percentage, or name
- View detailed quota information per user
- Reset daily quotas (for support/testing)

### 3. **Cost Tracking**
- Token usage monitoring
- Cost calculations based on Gemini API pricing
- Monthly cost summaries
- Total platform costs

### 4. **Alerts & Status**
- Warning indicators for users near limit (≥80%)
- Error indicators for quota exceeded (≥100%)
- Active status for normal usage
- Admin unlimited quota badges

### 5. **Detailed Analytics**
- Usage by feature breakdown
- Success/error request counts
- Response time monitoring
- Recent request history (last 20)
- Daily usage trends (30-day view)

## 📁 New Files Created

### Backend
1. **Controller Functions** (`server/controllers/admin.controller.js`)
   - `getUserQuotaStatus()` - List all users with quota info
   - `getUserQuotaDetails()` - Detailed view for specific user
   - `updateUserTier()` - Change user tier (future premium support)
   - `resetUserDailyQuota()` - Reset daily quota for testing/support

2. **API Routes** (`server/routes/admin.routes.js`)
   ```
   GET  /api/admin/ai-quota/users
   GET  /api/admin/ai-quota/users/:userId
   PATCH /api/admin/ai-quota/users/:userId/tier
   POST  /api/admin/ai-quota/users/:userId/reset-daily
   ```

3. **API Service** (`client/src/services/admin.api.js`)
   - `getUserQuotaStatus(params)`
   - `getUserQuotaDetails(userId)`
   - `updateUserTier(userId, tier)`
   - `resetUserDailyQuota(userId)`

### Frontend
1. **AI Quota Management Page** (`client/src/pages/admin/AIQuotaManagement.jsx`)
   - 600+ lines of React component
   - Comprehensive dashboard with tables, modals, and stats
   - Real-time data fetching and updates

2. **Route Configuration** (`client/src/App.jsx`)
   - Added `/admin/ai-quota` route
   - Imported AIQuotaManagement component

3. **Navigation** (`client/src/components/AdminLayout.jsx`)
   - Added "AI Quota Management" menu item
   - Yellow TrendingUp icon

## 🎨 User Interface

### Main Dashboard
```
┌─────────────────────────────────────────────────┐
│ AI Quota Management              [Refresh]      │
├─────────────────────────────────────────────────┤
│ [Total Users]  [Daily Usage]  [Cost]  [Alerts] │
│                                                  │
│ [Search Bar]                    [Sort By ▼]     │
│                                                  │
│ User Table:                                      │
│ ┌───────────────────────────────────────────┐  │
│ │ Name │ Tier │ Daily │ Monthly │ Status  │  │
│ │───────────────────────────────────────────│  │
│ │ John │ FREE │ 7/10  │ 45/200  │ Active  │  │
│ │ Jane │ FREE │ 10/10 │ 180/200 │ Limit   │  │
│ │ Admin│ ADMN │ 50/∞  │ 500/∞   │ Unlimit │  │
│ └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### User Details Modal
```
┌─────────────────────────────────────────────────┐
│ John Doe (john@example.com)              [X]    │
├─────────────────────────────────────────────────┤
│ Quota Status:                                    │
│ ┌─────────────┐  ┌─────────────┐               │
│ │ Daily: 7/10 │  │ Monthly:    │               │
│ │ 3 remaining │  │ 45/200      │               │
│ └─────────────┘  └─────────────┘               │
│                                                  │
│ Usage by Feature:                                │
│ • ai_suggestions: 30 requests, $0.0045          │
│ • ats_analysis:   15 requests, $0.0120          │
│                                                  │
│ Recent Requests:                                 │
│ ✓ ai_suggestions - 2 mins ago - 1,234 tokens   │
│ ✓ ats_analysis   - 5 mins ago - 3,456 tokens   │
│ ✗ ai_suggestions - 10 mins ago - ERROR          │
└─────────────────────────────────────────────────┘
```

## 🎨 Visual Indicators

### Quota Status Colors
| Status | Color | Condition | Badge |
|--------|-------|-----------|-------|
| Admin | Purple | Unlimited tier | 🛡️ Unlimited |
| Active | Green | < 50% used | ✅ Active |
| Warning | Yellow | 50-79% used | ⚠️ Active |
| Near Limit | Orange | 80-99% used | ⚠️ Near Limit |
| Exceeded | Red | ≥ 100% used | ❌ Quota Exceeded |

### Progress Bars
- **Green**: 0-49% usage
- **Yellow**: 50-79% usage
- **Orange**: 80-99% usage
- **Red**: 100%+ usage (blocked)
- **Purple**: Admin (unlimited)

## 📊 API Endpoints

### 1. Get All Users Quota Status
```
GET /api/admin/ai-quota/users?sortBy=usage&search=john
```

**Query Parameters:**
- `sortBy`: usage, cost, percentage, name (default: usage)
- `order`: asc, desc (default: desc)
- `search`: Filter by name/email

**Response:**
```json
{
  "users": [
    {
      "userId": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "tier": "free",
      "quota": {
        "daily": {
          "used": 7,
          "limit": 10,
          "remaining": 3,
          "percentage": 70
        },
        "monthly": {
          "used": 45,
          "limit": 200,
          "remaining": 155,
          "percentage": 22.5,
          "totalCost": 0.0045,
          "totalTokens": 12345
        }
      }
    }
  ],
  "totalUsers": 150,
  "summary": {
    "totalDailyUsage": 890,
    "totalMonthlyCost": 12.34,
    "usersNearLimit": 15,
    "usersOverLimit": 3
  }
}
```

### 2. Get User Quota Details
```
GET /api/admin/ai-quota/users/:userId
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "tier": "free"
  },
  "quota": {
    "daily": { "used": 7, "limit": 10, "remaining": 3 },
    "monthly": { "used": 45, "limit": 200, "remaining": 155 }
  },
  "usageByFeature": [
    {
      "_id": "ai_suggestions",
      "count": 30,
      "successCount": 28,
      "errorCount": 2,
      "totalTokens": 12345,
      "totalCost": 0.0045,
      "avgResponseTime": 1234
    }
  ],
  "dailyUsage": [
    {
      "_id": "2024-01-15",
      "count": 5,
      "successCount": 5,
      "totalCost": 0.0012
    }
  ],
  "recentRequests": [
    {
      "_id": "...",
      "feature": "ai_suggestions",
      "tokensUsed": 1234,
      "cost": 0.0003,
      "responseTime": 1234,
      "status": "success",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Reset User Daily Quota
```
POST /api/admin/ai-quota/users/:userId/reset-daily
```

**Response:**
```json
{
  "message": "Daily quota reset successfully for John Doe",
  "deletedRecords": 7
}
```

## 🔐 Security

All admin quota endpoints are protected by:
1. **Authentication**: `authenticateToken` middleware
2. **Authorization**: `isAdmin` middleware
3. **Rate Limiting**: 200 requests per 15 minutes
4. **Action Logging**: All actions logged via `logAdminAction`

## 🚀 Usage Guide

### Access the Dashboard
1. Login as admin user
2. Navigate to Admin Panel
3. Click "AI Quota Management" in sidebar
4. Dashboard loads with all users

### Monitor Users
1. **Search**: Type name or email in search bar
2. **Sort**: Select sort criteria (usage/cost/percentage/name)
3. **View**: Click "View Details" to see full breakdown
4. **Reset**: Click "Reset" to clear daily quota (for testing)

### Understand Quota Status
- **Green Progress Bar**: Normal usage, well within limits
- **Yellow/Orange Bar**: Approaching limit, monitor user
- **Red Bar**: Quota exceeded, user is blocked
- **Purple Badge**: Admin user with unlimited access

### View User Details
1. Click "View Details" on any user
2. See quota status (daily/monthly)
3. Check usage by feature
4. Review recent requests
5. Analyze daily usage trends
6. Close modal when done

### Reset Daily Quota
**Use Case**: Testing, support tickets, special circumstances

1. Find user in table
2. Click "Reset" button
3. Confirm the action
4. Daily quota resets to 0
5. User can make new requests

**⚠️ Warning**: This deletes all today's usage records!

## 📈 Summary Statistics

The dashboard shows 4 key metrics at the top:

1. **Total Users**: Count of all registered users
2. **Daily Usage**: Total AI requests across all users today
3. **Monthly Cost**: Total cost for current month (all users)
4. **Users Near Limit**: Count of users at ≥80% quota

These update in real-time when you refresh the data.

## 🎯 Use Cases

### 1. Cost Monitoring
- Track total monthly AI costs
- Identify high-usage users
- Project future costs based on trends

### 2. Capacity Planning
- See how many users are near limits
- Identify if quota limits are too low/high
- Plan for scaling and cost optimization

### 3. User Support
- Reset quotas for legitimate issues
- Investigate error patterns per user
- View request history for debugging

### 4. Abuse Detection
- Monitor unusual usage patterns
- Check for rapid quota consumption
- Review error rates per user

## 🔮 Future Enhancements

### Premium Tier Support (Coming Soon)
Currently, the system supports:
- Free tier: 10 daily, 200 monthly
- Admin tier: Unlimited

**To add premium tier:**
1. Add `tier` field to User model
2. Uncomment tier update logic in `updateUserTier()`
3. Create premium subscription system
4. Update frontend to show tier badges

### Suggested Premium Limits
```javascript
premium: {
  daily: 100,
  monthly: 2000
}
```

### Additional Features
- [ ] Email alerts for users near quota
- [ ] Auto-upgrade suggestions (free → premium)
- [ ] Quota history graphs (30-day trends)
- [ ] Export quota reports (CSV/PDF)
- [ ] Custom quota overrides per user
- [ ] Bulk quota operations
- [ ] Webhook notifications for quota events

## 🧪 Testing

### Test the Admin Panel
1. **Login as admin**:
   ```bash
   # Use your admin credentials
   Email: admin@atsresume.com
   Password: [admin password]
   ```

2. **Navigate to quota management**:
   ```
   http://localhost:5173/admin/ai-quota
   ```

3. **Test features**:
   - Search for users
   - Sort by different criteria
   - View user details
   - Check if data loads correctly

### Test with API
```bash
# Get all users quota status
curl -X GET http://localhost:5000/api/admin/ai-quota/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Get specific user details
curl -X GET http://localhost:5000/api/admin/ai-quota/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Reset user daily quota
curl -X POST http://localhost:5000/api/admin/ai-quota/users/USER_ID/reset-daily \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📝 Database Queries

The system uses MongoDB aggregations for efficient data retrieval:

### Daily Usage Aggregation
```javascript
AIUsage.countDocuments({
  userId: user._id,
  createdAt: { $gte: startOfDay },
  status: "success"
})
```

### Monthly Cost Aggregation
```javascript
AIUsage.aggregate([
  { $match: { userId, createdAt: { $gte: startOfMonth }, status: "success" } },
  { $group: { 
    _id: null, 
    totalCost: { $sum: "$cost" },
    totalTokens: { $sum: "$tokensUsed" }
  }}
])
```

### Usage by Feature
```javascript
AIUsage.aggregate([
  { $match: { userId, createdAt: { $gte: startOfMonth } } },
  { $group: {
    _id: "$feature",
    count: { $sum: 1 },
    successCount: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
    errorCount: { $sum: { $cond: [{ $eq: ["$status", "error"] }, 1, 0] } },
    totalTokens: { $sum: "$tokensUsed" },
    totalCost: { $sum: "$cost" }
  }}
])
```

## 🎨 Component Structure

### AIQuotaManagement.jsx
```
AIQuotaManagement
├── Header (Title + Refresh Button)
├── Summary Cards (4 metrics)
├── Filters & Search Bar
├── Users Table
│   ├── User Row
│   │   ├── User Info (name, email)
│   │   ├── Tier Badge
│   │   ├── Daily Quota Progress Bar
│   │   ├── Monthly Usage
│   │   ├── Cost
│   │   ├── Status Badge
│   │   └── Actions (View Details, Reset)
│   └── ...more rows
└── User Details Modal
    ├── User Info Header
    ├── Quota Status Cards (Daily, Monthly)
    ├── Usage by Feature List
    ├── Daily Usage Chart Data
    └── Recent Requests Timeline
```

## 🔧 Configuration

### Quota Limits
Defined in `server/middleware/aiUsageTracker.middleware.js`:
```javascript
const QUOTA_LIMITS = {
  free: {
    daily: 10,
    monthly: 200,
  },
  premium: {
    daily: 100,
    monthly: 2000,
  },
  admin: {
    daily: Infinity,
    monthly: Infinity,
  },
};
```

### Token Costs
```javascript
const TOKEN_COSTS = {
  input: 0.000125 / 1000,   // $0.000125 per 1K tokens
  output: 0.000375 / 1000,  // $0.000375 per 1K tokens
};
```

## 📱 Responsive Design

The quota management dashboard is fully responsive:
- **Desktop**: Full table with all columns
- **Tablet**: Stacked layout for cards, scrollable table
- **Mobile**: Single column cards, horizontal scroll for table

## 🎉 Success!

The AI Quota Management feature is now fully integrated into the admin panel with:
- ✅ Backend API endpoints (4 new functions)
- ✅ Frontend dashboard (600+ lines React component)
- ✅ Navigation integration
- ✅ Real-time monitoring
- ✅ User details view
- ✅ Quota reset capability
- ✅ Cost tracking
- ✅ Visual indicators
- ✅ Search and sorting
- ✅ Responsive design

## 🔗 Related Documentation
- [AI_USAGE_TRACKING_GUIDE.md](./AI_USAGE_TRACKING_GUIDE.md) - Main tracking implementation
- [AI_USAGE_QUICK_TEST.md](./AI_USAGE_QUICK_TEST.md) - Quick testing guide
- [MANUAL_TEST_COMMANDS.md](./MANUAL_TEST_COMMANDS.md) - Manual test commands
- [ADMIN_PANEL_README.md](./ADMIN_PANEL_README.md) - General admin panel guide

---

**Created**: January 2024  
**Last Updated**: January 2024  
**Status**: ✅ Production Ready
