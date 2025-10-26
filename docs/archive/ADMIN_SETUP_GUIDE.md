# 🚀 Quick Setup Guide for Admin Panel

## Step 1: Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend (if recharts wasn't installed)
cd client
npm install recharts
```

## Step 2: Create Your First Admin User

### Method 1: Direct MongoDB Update
```bash
# Connect to MongoDB
mongosh "your_mongodb_connection_string"

# Update your user to admin
use your_database_name
db.users.updateOne(
  { email: "atharvasjoshi2005@gmail.com" },
  { 
    $set: { 
      role: "admin",
      status: "active"
    } 
  }
)
```

### Method 2: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Find your user document
5. Click "Edit Document"
6. Add/Update these fields:
   ```json
   {
     "role": "admin",
     "status": "active"
   }
   ```
7. Click "Update"

## Step 3: Start the Application

```bash
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd client
npm run dev
```

## Step 4: Access Admin Panel

1. Go to `http://localhost:5173`
2. Login with your admin credentials
3. Navigate to `/admin/dashboard` or click on a special admin link (you might want to add this)

## Step 5: Test Admin Features

### Dashboard
- Visit `/admin/dashboard`
- You should see statistics, charts, and recent activity

### User Management
- Visit `/admin/users`
- Try filtering, searching, and managing users

### AI Analytics
- Visit `/admin/ai-analytics`
- View API usage statistics and costs

## 🔧 Optional: Add Admin Link to Main Site

Add this to your Navbar or Dashboard for easy access:

```jsx
// In Navbar.jsx or Dashboard.jsx
import { useAuth } from "../context/AuthContext";

// Inside component
const { user } = useAuth();

// Add this link only for admin users
{user?.role === 'admin' && (
  <Link 
    to="/admin/dashboard"
    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
  >
    <Shield className="w-4 h-4" />
    Admin Panel
  </Link>
)}
```

## 📝 Important Notes

1. **Security**: Only users with `role: "admin"` can access admin routes
2. **Database**: Ensure MongoDB is running before starting the server
3. **Environment**: Check that all environment variables are set correctly
4. **Token**: Make sure JWT authentication is working properly

## 🎯 Quick Test Checklist

- [ ] Backend server is running (port 5000)
- [ ] Frontend is running (port 5173)
- [ ] MongoDB is connected
- [ ] User has admin role in database
- [ ] Can login successfully
- [ ] Can access `/admin/dashboard`
- [ ] Dashboard shows statistics
- [ ] Can view users list
- [ ] Can access all admin pages

## 🐛 Troubleshooting

### Issue: "Access Denied"
**Fix**: Check if your user's role is set to "admin" in the database

### Issue: "Failed to fetch data"
**Fix**: Ensure backend server is running and MongoDB is connected

### Issue: Charts not showing
**Fix**: Make sure recharts is installed: `npm install recharts`

### Issue: 404 on admin routes
**Fix**: Verify App.jsx has admin routes configured

## ✅ You're Done!

Your admin panel is now ready to use. Check out `ADMIN_PANEL_README.md` for detailed documentation on all features.

---

**Need Help?** Contact: atharvasjoshi2005@gmail.com
