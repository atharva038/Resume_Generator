# Admin Panel Settings Implementation

## 🎯 Overview

Comprehensive system settings management for the admin panel with 6 categories of configurable options.

## ✨ Features Implemented

### 1. **Settings Model** (`server/models/Settings.model.js`)
- Centralized configuration storage
- Default values for all settings
- Single document pattern (only one settings document exists)

### 2. **Backend API** (`server/controllers/admin.controller.js`)
- `getSettings()` - Fetch all settings
- `updateSettings()` - Update settings
- `resetSettings()` - Reset to defaults
- `getSystemStats()` - System statistics
- `updateAIQuotaLimits()` - Update AI quotas
- `toggleFeature()` - Enable/disable features
- `updateRateLimits()` - Configure rate limits

### 3. **API Routes** (`server/routes/admin.routes.js`)
```
GET    /api/admin/settings
GET    /api/admin/settings/stats
PATCH  /api/admin/settings
POST   /api/admin/settings/reset
PATCH  /api/admin/settings/ai-quota
PATCH  /api/admin/settings/features/:feature
PATCH  /api/admin/settings/rate-limits
```

### 4. **Frontend Component** (`client/src/pages/admin/AdminSettings.jsx`)
- Tabbed interface with 6 categories
- Real-time updates
- Auto-save functionality
- Reset to defaults option

## 📋 Settings Categories

### 1. General Settings
- **Site Name**: Platform name
- **Site Description**: Meta description  
- **Contact Email**: Support email
- **Maintenance Mode**: Enable/disable site access

### 2. AI Quotas
- **Free Tier**: Daily and monthly limits
- **Premium Tier**: Daily and monthly limits
- Update limits independently per tier

### 3. Feature Toggles
- **Registration**: Allow new user signups
- **GitHub Import**: Enable GitHub integration
- **ATS Analyzer**: Enable resume analysis
- **AI Enhancement**: Enable AI suggestions
- **Feedback**: User feedback system
- **Template Upload**: Custom template uploads

### 4. Security
- **Password Min Length**: 6-32 characters
- **Session Timeout**: 1-168 hours
- **Email Verification**: Require email verification
- **Two-Factor Auth**: Enable 2FA (future)

### 5. Rate Limits
- **General**: Default API rate limits
- **Auth**: Login/register rate limits
- **AI**: AI endpoint rate limits
- **Upload**: File upload rate limits

Each category has:
- Window (milliseconds)
- Max requests per window

### 6. Storage
- **Max File Size**: 1-50 MB
- **Max Resumes Per User**: 1-100
- **Allowed File Types**: pdf, doc, docx, etc.

## 🎨 User Interface

### System Stats Dashboard
```
┌──────────────────────────────────────────────┐
│ [Active Users]  [AI Usage]  [Response]  [Storage] │
│     150/200       890        1234ms      45.2 MB   │
└──────────────────────────────────────────────┘
```

### Tabbed Interface
- General | AI Quotas | Features | Security | Rate Limits | Storage
- Each tab shows relevant settings
- Toggle switches for boolean settings
- Number inputs for numeric values
- Text inputs for strings

### Action Buttons
- **Refresh**: Reload settings from server
- **Reset to Defaults**: Restore default values
- **Save Changes**: Save all modifications

## 📊 Settings Model Schema

```javascript
{
  // General
  siteName: String,
  siteDescription: String,
  contactEmail: String,
  maintenanceMode: Boolean,

  // AI Quotas
  aiQuota: {
    free: { daily: Number, monthly: Number },
    premium: { daily: Number, monthly: Number }
  },

  // Features
  features: {
    registration: Boolean,
    githubImport: Boolean,
    atsAnalyzer: Boolean,
    aiEnhancement: Boolean,
    feedback: Boolean,
    templateUpload: Boolean
  },

  // Rate Limits
  rateLimits: {
    general: { windowMs: Number, max: Number },
    auth: { windowMs: Number, max: Number },
    ai: { windowMs: Number, max: Number },
    upload: { windowMs: Number, max: Number }
  },

  // Security
  security: {
    passwordMinLength: Number,
    sessionTimeout: Number,
    enableTwoFactor: Boolean,
    requireEmailVerification: Boolean
  },

  // Storage
  storage: {
    maxFileSize: Number,
    allowedFileTypes: [String],
    maxResumesPerUser: Number
  },

  // Metadata
  lastUpdatedBy: ObjectId,
  timestamps: true
}
```

## 🔒 Security

All endpoints protected by:
- ✅ Authentication middleware
- ✅ Admin role verification
- ✅ Rate limiting (200 req/15min)
- ✅ Action logging

## 🚀 Usage Examples

### Update AI Quota Limits
```javascript
PATCH /api/admin/settings/ai-quota
{
  "tier": "free",
  "daily": 15,
  "monthly": 300
}
```

### Toggle Feature
```javascript
PATCH /api/admin/settings/features/registration
{
  "enabled": false
}
```

### Update Rate Limit
```javascript
PATCH /api/admin/settings/rate-limits
{
  "category": "ai",
  "windowMs": 60000,
  "max": 20
}
```

### Reset All Settings
```javascript
POST /api/admin/settings/reset
```

## 📈 System Statistics

The settings page displays real-time stats:
- **Active Users**: Current active vs total
- **AI Usage**: Today's usage vs total
- **Avg Response Time**: AI request latency
- **Storage Used**: Total file storage (MB)

## 🎯 Default Values

```javascript
{
  siteName: "ATS Resume Generator",
  siteDescription: "Professional Resume Builder with ATS Optimization",
  contactEmail: "support@atsresume.com",
  maintenanceMode: false,
  
  aiQuota: {
    free: { daily: 10, monthly: 200 },
    premium: { daily: 100, monthly: 2000 }
  },
  
  features: {
    registration: true,
    githubImport: true,
    atsAnalyzer: true,
    aiEnhancement: true,
    feedback: true,
    templateUpload: true
  },
  
  rateLimits: {
    general: { windowMs: 900000, max: 100 },
    auth: { windowMs: 900000, max: 5 },
    ai: { windowMs: 60000, max: 10 },
    upload: { windowMs: 900000, max: 20 }
  },
  
  security: {
    passwordMinLength: 8,
    sessionTimeout: 86400000, // 24 hours
    enableTwoFactor: false,
    requireEmailVerification: false
  },
  
  storage: {
    maxFileSize: 5242880, // 5MB
    allowedFileTypes: ["pdf", "doc", "docx"],
    maxResumesPerUser: 10
  }
}
```

## 🔧 How to Use

### 1. Access Settings
```
http://localhost:5173/admin/settings
```

### 2. Modify Settings
- Click on desired tab
- Change values in input fields
- Toggle switches for on/off settings
- Click "Save Changes"

### 3. Update Specific Category
- AI Quotas: Modify and click "Update Free Tier" or "Update Premium Tier"
- Features: Click toggle to enable/disable immediately
- Rate Limits: Modify and click "Update [Category]"

### 4. Reset to Defaults
- Click "Reset to Defaults" button
- Confirm the action
- All settings revert to default values

## 🎨 Visual Indicators

- ✅ Green Success Message: Settings saved
- ❌ Red Error Message: Failed to save
- 🔵 Blue Info Cards: System statistics
- 🟣 Purple Toggle: Setting is ON
- ⚪ Gray Toggle: Setting is OFF

## 📝 Important Notes

### AI Quota Updates
- Affects NEW requests only
- Existing users continue with current day's quota
- Monthly limits reset on 1st of each month
- Daily limits reset at midnight

### Feature Toggles
- Take effect immediately
- Users may need to refresh
- Disabled features return 403 errors

### Rate Limits
- Require server restart to apply
- Affects all users globally
- Be careful with low limits

### Maintenance Mode
- Blocks all non-admin users
- Shows maintenance page
- Admin panel remains accessible

## 🔮 Future Enhancements

- [ ] Email notification settings (SMTP configuration)
- [ ] Backup/restore settings
- [ ] Settings change history
- [ ] Per-user quota overrides
- [ ] Custom branding (logo, colors)
- [ ] Analytics integration settings
- [ ] Payment gateway configuration
- [ ] Automated backups schedule

## 📊 API Response Examples

### GET Settings
```json
{
  "settings": {
    "siteName": "ATS Resume Generator",
    "aiQuota": {
      "free": {"daily": 10, "monthly": 200},
      "premium": {"daily": 100, "monthly": 2000}
    },
    "features": {
      "registration": true,
      "atsAnalyzer": true
    }
    // ... more settings
  }
}
```

### System Stats
```json
{
  "stats": {
    "users": {
      "total": 200,
      "active": 150,
      "todayNew": 5
    },
    "ai": {
      "totalUsage": 5000,
      "todayUsage": 890,
      "avgResponseTime": 1234
    },
    "storage": {
      "used": "45.2",
      "unit": "MB"
    }
  }
}
```

## ✅ Implementation Checklist

- ✅ Settings model created
- ✅ Backend controller functions (7 endpoints)
- ✅ API routes configured
- ✅ Frontend component with tabs
- ✅ System stats display
- ✅ Save/Reset functionality
- ✅ Feature toggles
- ✅ AI quota management
- ✅ Rate limit configuration
- ✅ Security settings
- ✅ Storage settings
- ✅ API service methods
- ✅ Error handling
- ✅ Success notifications
- ✅ Dark mode support

## 🎉 Result

The Admin Settings feature is **fully implemented** with:
- 6 settings categories
- 7 API endpoints
- Real-time updates
- Comprehensive configuration options
- User-friendly interface
- Complete documentation

---

**Created**: October 27, 2025  
**Status**: ✅ Production Ready
