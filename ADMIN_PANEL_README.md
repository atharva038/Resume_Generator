# 🛡️ Admin Panel Documentation

## Overview
The SmartNShine Admin Panel is a comprehensive dashboard for managing users, templates, AI usage, and system analytics with role-based access control.

---

## 🌟 Features

### 1. **Dashboard Overview**
- **Real-time Statistics Cards**
  - Total Users
  - Total Resumes Created
  - AI API Calls
  - AI Cost Tracking
  - Active Templates
  - Contact Messages

- **Interactive Charts & Graphs**
  - User Growth Chart (Last 7 Days)
  - Resume Creation Trends
  - AI Usage by Feature (Pie Chart)
  - Recent Activity Feed

- **System Status**
  - Active/Disabled Users Count
  - System Uptime Monitoring

### 2. **User Management** 👥
- **User Listing with Advanced Filters**
  - Search by name/email
  - Filter by role (User/Admin)
  - Filter by status (Active/Disabled)
  - Pagination support

- **User Actions**
  - Enable/Disable user accounts
  - Change user roles (User ↔ Admin)
  - Delete users (with confirmation)
  - View user statistics (resumes count, AI usage)

- **User Details View**
  - Resume history
  - AI usage statistics
  - Account information

### 3. **Template Management** 📄
- Upload new templates
- Enable/Disable templates
- Preview templates
- Delete templates
- Track template usage statistics
- Categorize templates (Professional, Creative, Modern, etc.)

### 4. **AI Usage Analytics** 🤖
- **Comprehensive Metrics**
  - Total API calls
  - Total tokens consumed
  - Total cost tracking
  - Average response time

- **Visual Analytics**
  - API calls over time (Line Chart)
  - Usage by feature distribution (Pie Chart)
  - Top users by API usage
  - Recent API call logs

- **Filtering Options**
  - Time period (24h, 7d, 30d, 90d)
  - Feature-specific analytics
  - Status filtering (Success/Error)

### 5. **Contact Messages Viewer** 💬
- View all contact form submissions
- Filter by category
- Filter by status
- Search functionality
- Pagination support

### 6. **Activity Logs** 📊
- Track all admin actions
- Filter by:
  - Action type
  - Admin user
  - Date range
- View detailed logs with timestamps and IP addresses

### 7. **System Settings** ⚙️
- System configuration
- API keys management
- Email settings
- General preferences

---

## 🔐 Role-Based Access Control

### User Roles
- **User**: Regular users with access to resume builder features
- **Admin**: Full access to admin panel and all management features

### Admin Middleware
- Validates user authentication
- Checks admin role
- Verifies account status (active/disabled)
- Logs all admin actions

---

## 🚀 Getting Started

### Prerequisites
1. MongoDB database
2. Node.js v16+
3. Admin user account

### Creating First Admin User

#### Option 1: Manual Database Update
```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "atharvasjoshi2005@gmail.com" },
  { $set: { role: "admin" } }
)
```

#### Option 2: Using MongoDB Compass
1. Open MongoDB Compass
2. Navigate to your database → users collection
3. Find your user document
4. Edit the document and set `role: "admin"`
5. Save changes

### Accessing Admin Panel
1. Login with admin credentials
2. Navigate to `/admin/dashboard`
3. Explore admin features

---

## 📡 API Endpoints

### Dashboard
```
GET /api/admin/dashboard/stats - Get dashboard statistics
```

### User Management
```
GET    /api/admin/users              - Get all users (with filters)
GET    /api/admin/users/:userId      - Get user details
PATCH  /api/admin/users/:userId/status - Update user status
PATCH  /api/admin/users/:userId/role   - Update user role
DELETE /api/admin/users/:userId      - Delete user
```

### AI Analytics
```
GET /api/admin/ai-analytics - Get AI usage analytics (with filters)
```

### Contact Messages
```
GET /api/admin/contacts - Get all contact messages
```

### Admin Logs
```
GET /api/admin/logs - Get admin activity logs
```

### Templates
```
GET    /api/admin/templates              - Get all templates
PATCH  /api/admin/templates/:id/status   - Update template status
DELETE /api/admin/templates/:id          - Delete template
```

---

## 🗄️ Database Models

### User Model (Updated)
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  role: String (enum: ['user', 'admin']),
  status: String (enum: ['active', 'disabled']),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### AI Usage Model (New)
```javascript
{
  userId: ObjectId (ref: User),
  feature: String (enum: ['ats_analysis', 'resume_enhancement', 'github_import', 'ai_suggestions']),
  tokensUsed: Number,
  cost: Number,
  responseTime: Number (milliseconds),
  status: String (enum: ['success', 'error', 'timeout']),
  errorMessage: String,
  metadata: Mixed,
  createdAt: Date
}
```

### Admin Log Model (New)
```javascript
{
  adminId: ObjectId (ref: User),
  action: String (enum: ['user_deleted', 'user_disabled', 'user_enabled', ...]),
  targetType: String (enum: ['user', 'template', 'resume', 'feedback', 'contact', 'system']),
  targetId: ObjectId,
  description: String,
  metadata: Mixed,
  ipAddress: String,
  createdAt: Date
}
```

### Template Model (New)
```javascript
{
  name: String (unique),
  category: String (enum: ['professional', 'creative', 'modern', 'minimal', 'executive']),
  description: String,
  thumbnail: String (URL),
  componentPath: String,
  isActive: Boolean,
  isPremium: Boolean,
  usageCount: Number,
  rating: Number (0-5),
  tags: [String],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 UI Components

### Charts (using Recharts)
- **LineChart**: User growth, API calls over time
- **BarChart**: Resume creation trends
- **PieChart**: Feature usage distribution

### Data Tables
- Sortable columns
- Pagination
- Search and filters
- Action buttons
- Responsive design

### Stats Cards
- Animated counters
- Trend indicators
- Color-coded categories
- Icon representations

---

## 🔒 Security Features

1. **Authentication**
   - JWT token validation
   - Protected routes
   - Session management

2. **Authorization**
   - Role-based access control
   - Admin-only middleware
   - Action logging

3. **Data Protection**
   - Password hashing (bcrypt)
   - Input validation
   - SQL injection prevention
   - XSS protection

4. **Audit Trail**
   - All admin actions logged
   - IP address tracking
   - Timestamp recording
   - User identification

---

## 📱 Responsive Design

- Mobile-friendly sidebar navigation
- Collapsible menu
- Touch-optimized interactions
- Adaptive charts and tables
- Dark mode support

---

## 🛠️ Technology Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v7
- Recharts for visualizations
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

---

## 📈 Future Enhancements

### Planned Features
- [ ] Real-time notifications
- [ ] Email template management
- [ ] Bulk user operations
- [ ] Export data to CSV/Excel
- [ ] Advanced analytics dashboard
- [ ] Template builder interface
- [ ] Role permissions customization
- [ ] Two-factor authentication
- [ ] API rate limiting configuration
- [ ] Scheduled reports
- [ ] User activity timeline
- [ ] System health monitoring
- [ ] Backup and restore functionality

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Cannot Access Admin Panel
**Solution**: Ensure your user account has `role: "admin"` in the database

#### 2. Charts Not Displaying
**Solution**: Check if data is being fetched correctly from the API

#### 3. Permission Denied Errors
**Solution**: Verify JWT token is valid and user is authenticated

#### 4. API Calls Failing
**Solution**: 
- Check server is running
- Verify MongoDB connection
- Check console for error messages

---

## 📞 Support

For issues or questions:
- Email: atharvasjoshi2005@gmail.com
- GitHub: Create an issue in the repository

---

## 📄 License

This admin panel is part of the SmartNShine ATS Resume Generator project.

---

## 🙏 Credits

Built with ❤️ by Atharva Sachin Joshi

**Version**: 1.0.0  
**Last Updated**: October 22, 2025
