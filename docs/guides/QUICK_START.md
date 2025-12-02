# SmartNShine - Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account created
- [ ] Gemini API key obtained from https://ai.google.dev/

## Setup Steps

### 1. Server Setup (5 minutes)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=random_secret_at_least_32_characters
CLIENT_ORIGIN=http://localhost:5173
```

Start server:
```bash
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected successfully
```

### 2. Client Setup (3 minutes)

```bash
cd client
npm install
npm run dev
```

Expected output:
```
  VITE ready in 500 ms
  ➜  Local:   http://localhost:5173/
```

### 3. Test the Application

1. Open http://localhost:5173
2. Click "Get Started" or navigate to "Upload Resume"
3. Upload a sample resume (PDF or DOCX)
4. Wait for AI parsing (10-15 seconds)
5. Review extracted data in editor
6. Click "Enhance" on any section to test AI enhancement
7. Click "Show Preview" to see formatted resume
8. Click "Download PDF" to export

## Test Data

### Sample cURL Commands

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Upload Resume:**
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@/path/to/your/resume.pdf"
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Common Issues

### Issue: MongoDB Connection Failed
**Solution:** 
1. Check MongoDB URI format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
2. Whitelist IP in MongoDB Atlas (0.0.0.0/0 for testing)
3. Verify database user permissions

### Issue: Gemini API Error
**Solution:**
1. Verify API key is correct
2. Check API quota at https://aistudio.google.com/app/apikey
3. Ensure no spaces in API key

### Issue: File Upload Fails
**Solution:**
1. Check file size < 5MB
2. Verify file format is PDF or DOCX
3. Ensure uploads/ directory exists in server folder

### Issue: CORS Error
**Solution:**
1. Verify CLIENT_ORIGIN in server/.env matches client URL
2. Check client is running on http://localhost:5173
3. Restart server after .env changes

## Development Tips

### Enable Hot Reload
Both server and client support hot module replacement:
- Server uses `--watch` flag (Node 18+)
- Client uses Vite's HMR

### Debug Mode
Set `NODE_ENV=development` in server/.env to see detailed error logs

### Test Without Auth
Upload and enhance endpoints work without authentication for testing

## Next Steps

1. ✅ Verify both server and client are running
2. ✅ Upload a test resume
3. ✅ Test AI enhancement feature
4. ✅ Export PDF and verify text selectability
5. ✅ Create an account and save resume
6. ✅ Load saved resume from dashboard

## Production Deployment

See main README.md for deployment instructions to:
- Backend: Railway/Render
- Frontend: Vercel
- Database: MongoDB Atlas

## Need Help?

- Check server logs in terminal
- Check browser console for client errors
- Review README.md troubleshooting section
- Ensure all npm dependencies installed correctly

---

**Estimated setup time: 8-10 minutes**
