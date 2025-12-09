# Gemini API Quota Error - Fix Documentation

## Problem
The application is experiencing **429 Too Many Requests** errors from the Gemini API due to exceeding the free tier quota limit of **20 requests per day** for the `gemini-2.5-flash` model.

## Error Details
```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: 
[429 Too Many Requests] You exceeded your current quota, please check your plan and billing details.

Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
Limit: 20 requests/day
Model: gemini-2.5-flash
```

## Solutions Implemented

### 1. ✅ Better Error Handling
- Added specific quota error detection in `gemini.service.js`
- Returns user-friendly error messages with 429 status code
- Tracks failed requests with proper error codes

### 2. ✅ Controller Updates
- `enhanceContent`: Returns proper 429 response with retry information
- `generateSummary`: Returns proper 429 response with retry information
- Both now send `quotaExceeded: true` flag for frontend handling

### 3. 🔄 Recommended Long-term Solutions

#### Option A: Upgrade to Paid Plan (Recommended)
- **Gemini Pro**: Higher quotas and better performance
- **Cost**: Pay-as-you-go pricing
- **Benefits**: 
  - Higher rate limits
  - Better model quality
  - Production-ready
  - No daily quota restrictions

#### Option B: Implement Request Caching
```javascript
// Cache AI responses to reduce API calls
const cacheKey = `gemini_${sectionType}_${hashContent(content)}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;
```

#### Option C: Rate Limiting on Application Side
```javascript
// Limit AI enhancements per user per day
const userAILimit = 10; // per day
const userUsage = await getUserAIUsageToday(userId);
if (userUsage >= userAILimit) {
  throw new Error("Daily AI enhancement limit reached");
}
```

#### Option D: Use Multiple AI Providers (Fallback)
```javascript
// Try Gemini first, fallback to OpenAI or others
try {
  return await gemini.enhance(content);
} catch (quotaError) {
  return await openai.enhance(content); // Fallback
}
```

## Frontend Error Handling Needed

Update your frontend code to handle 429 errors gracefully:

```javascript
// In your API call handler
try {
  const response = await enhanceContent(content);
} catch (error) {
  if (error.response?.status === 429) {
    // Show user-friendly message
    toast.error("AI service temporarily unavailable. Please try again later.");
    // Maybe disable AI features temporarily
    setAIDisabled(true);
  }
}
```

## Environment Variables to Check

Make sure you have the correct Gemini API key in your `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Monitoring Usage

1. **Check current usage**: https://ai.dev/usage?tab=rate-limit
2. **View quota details**: https://ai.google.dev/gemini-api/docs/rate-limits
3. **Upgrade plan**: https://ai.google.dev/pricing

## Current Status

- ✅ Error handling improved
- ✅ Better error messages for users
- ⚠️ Still using free tier (20 requests/day limit)
- 🔄 Need to implement one of the long-term solutions above

## Immediate Next Steps

1. **Short-term**: Wait for quota to reset (resets daily)
2. **Medium-term**: Implement rate limiting per user
3. **Long-term**: Upgrade to paid Gemini plan or add fallback providers

## Testing

After implementing these fixes, test with:

```bash
# Should return 429 with user-friendly message
curl -X POST http://localhost:5000/api/resume/enhance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"content":"test","sectionType":"experience"}'
```

Expected response when quota exceeded:
```json
{
  "error": "AI service quota exceeded",
  "message": "The AI enhancement service has reached its daily limit. Please try again later or contact support.",
  "quotaExceeded": true,
  "retryAfter": "1 hour"
}
```
