# 🚀 Quick Reference: Authentication System

## For Developers

### Adding a New Protected Route (Backend)

```javascript
// In your route file (e.g., server/routes/yourfeature.routes.js)
import {authenticateToken} from "../middleware/auth.middleware.js";

// Add middleware to route
router.post("/your-endpoint", authenticateToken, yourController);
```

### Adding a New Protected Page (Frontend)

```javascript
// In client/src/App.jsx
import ProtectedRoute from "./components/ProtectedRoute";
import YourPage from "./pages/YourPage";

// Wrap route with ProtectedRoute
<Route
  path="your-page"
  element={
    <ProtectedRoute>
      <YourPage />
    </ProtectedRoute>
  }
/>
```

---

## Current Protected Features

### ✅ Backend Routes (API Endpoints)
```
POST   /api/resume/upload                  - Upload resume
POST   /api/resume/enhance                 - Enhance content
POST   /api/resume/generate-summary        - Generate summary
POST   /api/resume/categorize-skills       - Categorize skills
POST   /api/resume/segregate-achievements  - Segregate achievements
POST   /api/resume/process-custom-section  - Process custom section
POST   /api/resume/save                    - Save resume
PUT    /api/resume/:id                     - Update resume
GET    /api/resume/list                    - List resumes
GET    /api/resume/:id                     - Get resume
DELETE /api/resume/:id                     - Delete resume

POST   /api/contact                        - Submit contact form
GET    /api/contact                        - List contacts (admin)
GET    /api/contact/stats/summary          - Get stats (admin)
GET    /api/contact/:id                    - Get contact (admin)
PATCH  /api/contact/:id                    - Update contact (admin)
DELETE /api/contact/:id                    - Delete contact (admin)

POST   /api/ats/analyze-resume             - Analyze with ATS
```

### ✅ Frontend Pages (Routes)
```
/upload          - Upload Resume
/editor          - Resume Editor
/templates       - Template Selection
/github-import   - GitHub Import
/ats-analyzer    - ATS Analyzer
/contact         - Contact Form
/dashboard       - User Dashboard
```

### ❌ Public Pages (No Auth Required)
```
/                - Home Page
/login           - Login Page
/register        - Register Page
```

---

## Testing Commands

### Test Protected API Endpoint
```bash
# Without token (should fail with 401/403)
curl -X POST http://localhost:5000/api/resume/upload

# With token (should succeed)
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test in Browser
```javascript
// Open browser console on any protected page when NOT logged in
// Should automatically redirect to /login

// After login, should redirect back to original page
```

---

## Token Management

### Get Current Token (Browser Console)
```javascript
localStorage.getItem('token')
```

### Remove Token (Logout)
```javascript
localStorage.removeItem('token')
```

### Decode Token (Check Expiration)
```javascript
// In browser console
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('User ID:', payload.id);
console.log('Email:', payload.email);
console.log('Expires:', new Date(payload.exp * 1000));
```

---

## Common Issues & Solutions

### Issue 1: "No token provided" Error
**Problem**: Token not being sent with request
**Solution**: 
- Check if token exists in localStorage
- Verify axios interceptor is configured
- Check Authorization header in Network tab

### Issue 2: "Invalid token" Error
**Problem**: Token format is incorrect or corrupted
**Solution**:
- Clear localStorage and login again
- Check token format: should be "Bearer <token>"
- Verify JWT_SECRET matches on server

### Issue 3: Stuck on Login Page After Authentication
**Problem**: Redirect not working
**Solution**:
- Check browser console for errors
- Verify AuthContext is wrapping App
- Check navigate() function is called after login

### Issue 4: Can Access Protected Page Without Login
**Problem**: ProtectedRoute not working
**Solution**:
- Verify route is wrapped with ProtectedRoute in App.jsx
- Check AuthProvider is in component tree
- Verify useAuth() is returning user status

---

## Code Snippets

### Access User in Protected Controller
```javascript
export const yourController = async (req, res) => {
  try {
    // User info is available in req.user
    const userId = req.user.id;
    const userEmail = req.user.email;
    
    // Query user-specific data
    const data = await Model.find({userId});
    
    res.json({success: true, data});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
```

### Access User in Protected Component
```javascript
import {useAuth} from "../context/AuthContext";

const YourComponent = () => {
  const {user} = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};
```

### Make Authenticated API Call
```javascript
import {resumeAPI} from "../services/api";

// Token automatically added by axios interceptor
const response = await resumeAPI.upload(formData);
```

---

## Environment Variables

### Required in `.env`
```bash
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
```

---

## Security Best Practices

✅ **DO:**
- Use strong JWT_SECRET (32+ characters)
- Set appropriate token expiration (7d is reasonable)
- Store token in localStorage (accessible only via JavaScript)
- Validate token on every protected route
- Use HTTPS in production
- Implement token refresh mechanism
- Add rate limiting to prevent brute force

❌ **DON'T:**
- Store sensitive data in JWT payload
- Use short expiration times (bad UX)
- Skip backend validation (never trust frontend)
- Expose JWT_SECRET in client code
- Store passwords in tokens
- Share tokens between users

---

## Monitoring & Logging

### Track Authentication Events
```javascript
// In auth.controller.js
console.log(`[AUTH] User ${email} logged in at ${new Date()}`);
console.log(`[AUTH] User ${user.id} registered at ${new Date()}`);
console.log(`[AUTH] Invalid login attempt for ${email}`);
```

### Track Protected Route Access
```javascript
// In authenticateToken middleware
console.log(`[AUTH] User ${decoded.id} accessed ${req.method} ${req.path}`);
```

---

## Useful Commands

### Start Development Server
```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

### Check All Protected Routes
```bash
# In project root
grep -r "authenticateToken" server/routes/
```

### Check All Protected Pages
```bash
# In project root
grep -r "ProtectedRoute" client/src/App.jsx
```

---

## Quick Checklist

Before deployment, verify:
- [ ] All sensitive routes have authenticateToken middleware
- [ ] All protected pages wrapped with ProtectedRoute
- [ ] JWT_SECRET is strong and environment-specific
- [ ] Token expiration is appropriate
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS is enabled in production
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Logging is configured
- [ ] Token refresh mechanism works

---

## API Response Examples

### Success (200)
```json
{
  "success": true,
  "data": {...}
}
```

### Unauthorized (401)
```json
{
  "error": "No token provided"
}
```

### Forbidden (403)
```json
{
  "error": "Invalid token"
}
```

### Not Found (404)
```json
{
  "error": "Resume not found"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

---

## Additional Resources

- JWT Docs: https://jwt.io/
- Express Middleware: https://expressjs.com/en/guide/using-middleware.html
- React Router Protected Routes: https://reactrouter.com/
- Axios Interceptors: https://axios-http.com/docs/interceptors

---

## Support

For issues or questions:
1. Check browser console for errors
2. Check server logs for authentication errors
3. Verify token in localStorage
4. Test API endpoints with Postman/curl
5. Review authentication flow diagram

---

**Last Updated**: October 22, 2025
**Version**: 1.0.0
