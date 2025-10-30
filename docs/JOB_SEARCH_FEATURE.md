# Job Search Feature Documentation 🔍

## Overview
The Job Search feature integrates with the **Adzuna API** to provide real-time job listings from thousands of sources across multiple countries. Users can search for jobs by keywords and location, view detailed job information, and apply directly through the platform.

## Features ✨

### 1. **Real-Time Job Search**
- Search across 17+ countries
- 20 results per page with pagination
- Real-time job listings from thousands of sources

### 2. **Advanced Search Options**
- **Keyword Search**: Job title, skills, or any relevant keywords
- **Location Filter**: Search in specific countries
- **Multiple Countries Supported**:
  - United States, United Kingdom, Canada
  - Australia, Germany, France, India
  - Netherlands, New Zealand, Poland
  - Brazil, South Africa, Singapore
  - Austria, Belgium, Switzerland, Italy

### 3. **Rich Job Information**
- Job title and description
- Company name
- Location details
- Salary range (when available)
- Contract type (Full-time, Part-time, Contract, etc.)
- Contract time (Permanent, Temporary)
- Job category
- Date posted
- Direct application link

### 4. **User Experience**
- Beautiful gradient UI with dark mode support
- Loading states and animations
- Toast notifications for user feedback
- Responsive design for all devices
- Pagination for browsing results
- Statistics display (total jobs, average salary)

## Setup Instructions 🚀

### 1. Get Adzuna API Credentials

1. **Visit the Adzuna Developer Portal**:
   - Go to https://developer.adzuna.com/
   
2. **Create a Free Account**:
   - Click "Sign Up" or "Register"
   - Fill in your details
   - Verify your email

3. **Get Your API Credentials**:
   - Log in to your account
   - Navigate to your dashboard
   - You'll see your `App ID` and `App Key`
   - Copy both credentials

### 2. Configure Environment Variables

1. **Navigate to the client folder**:
   ```bash
   cd client
   ```

2. **Create or edit `.env` file**:
   ```bash
   # If .env doesn't exist, copy from example
   cp .env.example .env
   ```

3. **Add your Adzuna credentials to `.env`**:
   ```env
   VITE_API_URL=http://localhost:5000/api
   
   # Adzuna API Credentials
   VITE_ADZUNA_APP_ID=your_actual_app_id_here
   VITE_ADZUNA_APP_KEY=your_actual_app_key_here
   ```

4. **Save the file** and restart your development server:
   ```bash
   npm run dev
   ```

### 3. Access the Feature

1. **Start your application**:
   ```bash
   # In the root directory
   npm run dev
   # or
   cd client && npm run dev
   ```

2. **Navigate to Job Search**:
   - Click the **"Job Search"** button in the sidebar
   - Or visit: `http://localhost:5173/job-search`

## API Information 📊

### Adzuna API Details

**Base URL**: `https://api.adzuna.com/v1/api/jobs`

**Rate Limits** (Free Tier):
- 1,000 calls per month
- No rate limit per second

**Pricing**:
- **Free**: 1,000 calls/month
- **Basic**: $199/month - 10,000 calls
- **Pro**: Custom pricing for higher volumes

### API Endpoint Used
```
GET /v1/api/jobs/{country}/search/{page}
```

**Parameters**:
- `app_id`: Your application ID
- `app_key`: Your application key
- `results_per_page`: Number of results (default: 20)
- `what`: Search keywords
- `where`: Location (optional)
- `salary_min`: Minimum salary (optional)
- `salary_max`: Maximum salary (optional)
- `max_days_old`: Maximum age of job posting (optional)
- `category`: Job category (optional)

### Response Format
```json
{
  "results": [
    {
      "id": "1234567890",
      "title": "Software Developer",
      "location": {
        "display_name": "San Francisco, CA"
      },
      "description": "Job description...",
      "created": "2024-01-15T10:30:00Z",
      "company": {
        "display_name": "Tech Corp"
      },
      "salary_min": 80000,
      "salary_max": 120000,
      "contract_type": "permanent",
      "contract_time": "full_time",
      "category": {
        "label": "IT Jobs"
      },
      "redirect_url": "https://..."
    }
  ],
  "count": 1234,
  "mean": 95000
}
```

## Usage Guide 💡

### Basic Search
1. Enter job title or keywords (e.g., "Software Developer", "Marketing Manager")
2. Select country from dropdown
3. Click "Search Jobs"
4. Browse results and click "Apply Now" to view job details

### Advanced Tips
- **Use specific keywords**: "React Developer" vs "Developer"
- **Try different countries**: Opportunities vary by location
- **Check regularly**: Jobs are updated in real-time
- **Save interesting jobs**: Click "Apply Now" to view on the original site

### Search Examples
- "Software Engineer" in United States
- "Data Scientist" in United Kingdom
- "Marketing Manager" in Canada
- "Graphic Designer" in Australia
- "Project Manager" in Germany

## Component Structure 📁

```
client/src/
├── pages/
│   └── JobSearch.jsx          # Main job search component
├── components/
│   └── Sidebar.jsx            # Updated with Job Search link
└── App.jsx                     # Added /job-search route
```

## Features Breakdown 🎯

### Search Form
- **Input**: Job title or keywords
- **Select**: Country dropdown with 17 countries
- **Button**: Submit search with loading state

### Statistics Cards
- **Total Jobs Found**: Real-time count of matching jobs
- **Average Salary**: Calculated mean salary from results

### Job Cards
Each job listing displays:
- ✅ Job title (bold, prominent)
- 🏢 Company name
- 📍 Location
- 📝 Job description preview (200 characters)
- 🏷️ Tags: Category, contract type, contract time
- 💰 Salary range (if available)
- 📅 Date posted (relative time: "2 days ago")
- 🔗 "Apply Now" button (opens in new tab)

### Pagination
- Previous/Next buttons
- Current page indicator
- Disabled states when appropriate

## Troubleshooting 🔧

### Issue: "API Credentials Required" Warning

**Solution**:
1. Make sure you've added credentials to `.env`
2. Restart your development server
3. Check that variable names match: `VITE_ADZUNA_APP_ID` and `VITE_ADZUNA_APP_KEY`
4. Verify credentials are correct in Adzuna dashboard

### Issue: "Failed to fetch jobs" Error

**Possible Causes**:
1. **Invalid API credentials**: Double-check your App ID and App Key
2. **Rate limit exceeded**: Free tier has 1,000 calls/month limit
3. **Network issues**: Check your internet connection
4. **CORS issues**: Adzuna API allows CORS, but check browser console

**Solutions**:
- Verify credentials in Adzuna dashboard
- Check API usage in Adzuna dashboard
- Look at browser console for detailed error messages

### Issue: No Jobs Found

**Solutions**:
- Try different keywords (broader search terms)
- Change country selection
- Check if search term has typos
- Try common job titles like "Manager", "Developer", "Designer"

### Issue: Environment Variables Not Loading

**Solutions**:
1. Make sure `.env` file is in the `client` folder
2. Variable names must start with `VITE_` (Vite requirement)
3. Restart development server after changing `.env`
4. Check for syntax errors in `.env` file (no quotes needed)

## Best Practices 🌟

### For Users
1. **Be specific**: Use relevant keywords for better results
2. **Try variations**: "Frontend Developer" vs "Front-end Engineer"
3. **Check multiple countries**: Some have more opportunities
4. **Read full descriptions**: Click "Apply Now" for complete details

### For Developers
1. **Monitor API usage**: Stay within free tier limits
2. **Cache results**: Consider implementing caching for repeated searches
3. **Error handling**: Toast notifications for user feedback
4. **Rate limiting**: Implement client-side throttling if needed

## Future Enhancements 🚀

### Planned Features
- [ ] Save favorite jobs to user profile
- [ ] Email alerts for new matching jobs
- [ ] Advanced filters (salary range, contract type, date posted)
- [ ] Job application tracking
- [ ] Resume matching score for each job
- [ ] Integration with "My Resumes" to auto-fill applications
- [ ] Job recommendations based on user profile
- [ ] Comparison view for multiple jobs
- [ ] Bookmarking and notes for jobs

### Technical Improvements
- [ ] Implement result caching
- [ ] Add debouncing for search input
- [ ] Infinite scroll pagination
- [ ] Export job listings to PDF
- [ ] Share job links with other users
- [ ] Mobile app integration

## API Documentation Links 📚

- **Adzuna Developer Portal**: https://developer.adzuna.com/
- **API Documentation**: https://developer.adzuna.com/docs
- **Sign Up for API Key**: https://developer.adzuna.com/signup
- **API Status**: https://developer.adzuna.com/status
- **Support**: support@adzuna.com

## Security Notes 🔒

### Environment Variables
- ✅ Never commit `.env` file to version control
- ✅ `.env` is in `.gitignore`
- ✅ Use `.env.example` as template
- ✅ Rotate API keys if accidentally exposed

### Client-Side API Keys
⚠️ **Important**: API keys are visible in client-side code. For production:
1. Consider creating a backend proxy endpoint
2. Store API keys server-side
3. Implement rate limiting on your server
4. Add request authentication

**Example Backend Proxy** (optional):
```javascript
// server/routes/jobs.js
router.get('/search', async (req, res) => {
  const { query, country, page } = req.query;
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&what=${query}`;
  
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});
```

## Example Code Snippets 💻

### Basic Fetch Request
```javascript
const searchJobs = async () => {
  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=developer`
  );
  const data = await response.json();
  console.log(data.results);
};
```

### With Error Handling
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
  setJobs(data.results);
  toast.success(`Found ${data.count} jobs!`);
} catch (error) {
  toast.error('Failed to fetch jobs');
  console.error(error);
}
```

## Support 💬

For issues or questions:
1. Check this documentation first
2. Review Adzuna API docs: https://developer.adzuna.com/docs
3. Check browser console for errors
4. Contact Adzuna support: support@adzuna.com
5. Create an issue in the project repository

## Credits 🙏

- **API Provider**: Adzuna (https://www.adzuna.com/)
- **Icons**: Lucide React (https://lucide.dev/)
- **UI Framework**: Tailwind CSS
- **Toast Notifications**: react-hot-toast

---

**Last Updated**: October 2024  
**Feature Version**: 1.0.0  
**Status**: ✅ Active and Working
