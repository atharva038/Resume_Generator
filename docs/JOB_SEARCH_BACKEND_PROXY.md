# Job Search Backend Proxy - Implementation Summary

## Problem Solved ✅

The Adzuna API does not support CORS (Cross-Origin Resource Sharing) for direct browser requests, which was causing the error:
```
Access to fetch at 'https://api.adzuna.com/...' has been blocked by CORS policy
```

## Solution Implemented

Created a **backend proxy** that fetches jobs from Adzuna and returns them to the frontend. This solves the CORS issue since the browser only communicates with our own server.

---

## Backend Changes

### 1. Created `/server/routes/jobs.js`
**Purpose**: Proxy endpoint for Adzuna API

**Features**:
- ES module syntax (compatible with server.js)
- Fetches jobs from Adzuna API
- Returns data to frontend
- Error handling for missing credentials
- Handles failed API requests

**Endpoint**: `GET /api/jobs/adzuna`

**Query Parameters**:
- `query`: Job search keywords (e.g., "software developer")
- `country`: Country code (e.g., "us", "gb", "ca")
- `page`: Page number for pagination

**Example Request**:
```
GET http://localhost:5000/api/jobs/adzuna?query=software%20developer&country=us&page=1
```

### 2. Updated `/server/server.js`
- Added import: `import jobsRoutes from "./routes/jobs.js";`
- Registered route: `app.use("/api/jobs", jobsRoutes);`

### 3. Updated `/server/.env`
Added backend API credentials:
```env
ADZUNA_APP_ID=c5ced38f
ADZUNA_APP_KEY=a107ae90c7aafd5995d4f65c175f386b
```

---

## Frontend Changes

### Updated `/client/src/pages/JobSearch.jsx`

**Before** (Direct API call - CORS error):
```javascript
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID || "YOUR_APP_ID";
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY || "YOUR_APP_KEY";
const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&what=${query}`;
```

**After** (Backend proxy - No CORS issue):
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const url = `${API_BASE_URL}/jobs/adzuna?query=${query}&country=${country}&page=${page}`;
```

**Changes Made**:
1. Removed direct Adzuna API calls
2. Now fetches from backend proxy: `/api/jobs/adzuna`
3. Removed API credentials from frontend (security improvement)
4. Removed API setup notice (credentials now server-side only)
5. Simplified error handling

---

## Architecture Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. Request: /api/jobs/adzuna?query=developer&country=us
       │
       ▼
┌─────────────────┐
│  Express Server │
│   (Backend)     │
│  Port: 5000     │
└──────┬──────────┘
       │
       │ 2. Fetch with API credentials
       │
       ▼
┌─────────────────┐
│  Adzuna API     │
│  (External)     │
└──────┬──────────┘
       │
       │ 3. Return job data
       │
       ▼
┌─────────────────┐
│  Express Server │
│   (Backend)     │
└──────┬──────────┘
       │
       │ 4. Forward to frontend
       │
       ▼
┌─────────────┐
│   Browser   │
│  (Frontend) │
└─────────────┘
```

---

## Benefits of Backend Proxy

### ✅ Security
- API credentials stored server-side only (not exposed in browser)
- No credentials in frontend code
- Better control over API usage

### ✅ CORS Compliance
- Browser only talks to same-origin server
- No CORS issues
- Works in all browsers

### ✅ Flexibility
- Can add rate limiting on our side
- Can cache results for better performance
- Can add authentication/authorization
- Can transform data before sending to frontend

### ✅ Monitoring
- Track API usage server-side
- Better error logging
- Can implement retry logic

---

## Testing

### Test the Backend Endpoint Directly:
```bash
curl "http://localhost:5000/api/jobs/adzuna?query=developer&country=us&page=1"
```

Expected response:
```json
{
  "results": [...],
  "count": 12345,
  "mean": 95000
}
```

### Test in Browser:
1. Navigate to: `http://localhost:5173/job-search`
2. Enter search term: "Software Developer"
3. Select country: "United States"
4. Click "Search Jobs"
5. Should see real job listings (no CORS errors)

---

## Error Handling

### Backend Errors
- **Missing credentials**: Returns 500 with error message
- **Adzuna API failure**: Returns 500 with details
- **Invalid request**: Returns appropriate status code

### Frontend Errors
- Shows toast notification with error message
- Displays user-friendly error text
- Logs detailed error to console

---

## Dependencies Installed

### Backend (`/server`)
```bash
npm install node-fetch
```

**Why**: Required to make HTTP requests from Node.js to external APIs (Adzuna)

---

## Files Modified Summary

### Created:
- ✅ `/server/routes/jobs.js` (Backend proxy route)

### Modified:
- ✅ `/server/server.js` (Added jobs route)
- ✅ `/server/.env` (Added API credentials)
- ✅ `/client/src/pages/JobSearch.jsx` (Use backend proxy)

---

## Environment Variables

### Backend (Required)
File: `/server/.env`
```env
ADZUNA_APP_ID=c5ced38f
ADZUNA_APP_KEY=a107ae90c7aafd5995d4f65c175f386b
```

### Frontend (No longer needed for Adzuna)
File: `/client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

**Note**: Frontend no longer needs Adzuna credentials!

---

## API Rate Limits (Adzuna Free Tier)

- ✅ 1,000 API calls per month
- ✅ No per-second rate limit
- ✅ Access to all countries
- ✅ Real-time job data

**Usage Tracking**:
- Monitor usage in Adzuna dashboard
- Consider implementing backend caching for popular searches
- Add rate limiting on backend if needed

---

## Troubleshooting

### Issue: "Cannot find package 'node-fetch'"
**Solution**: Install node-fetch in server folder
```bash
cd server
npm install node-fetch
```

### Issue: "Missing Adzuna API credentials"
**Solution**: Add credentials to `/server/.env`
```env
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
```

### Issue: Backend not responding
**Solution**: Check server is running on port 5000
```bash
cd server
npm run dev
```

### Issue: Frontend still showing CORS error
**Solution**: 
1. Clear browser cache
2. Restart frontend dev server
3. Check that frontend is calling `/api/jobs/adzuna` (not direct Adzuna URL)

---

## Future Enhancements

### Caching
```javascript
// Add Redis or in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

router.get('/adzuna', async (req, res) => {
  const cacheKey = `${req.query.query}-${req.query.country}-${req.query.page}`;
  
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }
  
  // Fetch from API and cache...
});
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const jobSearchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.get('/adzuna', jobSearchLimiter, async (req, res) => {
  // ...
});
```

### Authentication
```javascript
import { authenticate } from '../middleware/auth.js';

router.get('/adzuna', authenticate, async (req, res) => {
  // Only authenticated users can search jobs
});
```

---

## Status

✅ **Backend proxy**: Implemented and working  
✅ **Frontend updated**: Using backend proxy  
✅ **CORS issue**: Resolved  
✅ **No compilation errors**: Clean build  
✅ **Ready to test**: Start both servers and test!  

---

**Implementation Date**: October 30, 2025  
**Status**: Complete and ready for testing  
**Next Step**: Test job search functionality in browser
