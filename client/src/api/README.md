# API Services

This directory contains all API service modules for communicating with the backend server. Each service provides a clean, organized interface for specific API endpoints.

## 📋 Table of Contents
- [Overview](#overview)
- [Available Services](#available-services)
- [Architecture](#architecture)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Best Practices](#best-practices)

## 🌐 Overview

The API services layer provides:
- **Centralized API client** (`api.js`) with Axios
- **Automatic JWT token injection** via request interceptors
- **Comprehensive error handling** with status-specific actions
- **Toast notifications** for user feedback
- **Type-safe responses** with consistent structure

## 📦 Available Services

### `api.js` - Main API Service
Central API client and primary services:
- **authAPI**: Authentication (register, login, get current user)
- **resumeAPI**: Resume CRUD, AI enhancements, ATS analysis
- **contactAPI**: Contact form management
- **mlAPI**: AI job matching and skill analysis

### `feedback.api.js` - Feedback Service
User feedback and feature requests:
- Submit feedback/bug reports
- View user's feedback history
- Upvote community feedback
- Get feedback statistics

### `subscription.api.js` - Payment Service
Razorpay payment and subscriptions:
- Fetch pricing plans
- Create payment orders
- Verify payments
- Manage subscriptions
- Payment history

### `admin.api.js` - Admin Service
Admin-only endpoints (not shown in detail here)
- User management
- System analytics
- Content moderation

## 🏗️ Architecture

### Axios Instance Configuration

```javascript
// api.js
import axios from "axios";
import {authStorage} from "@/utils/storage";
import {config} from "@/utils/constants";

const api = axios.create({
  baseURL: config.apiUrl, // from environment
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Request Interceptor (Auto JWT Injection)

```javascript
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor (Error Handling)

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleErrorByStatus(error, {
      401: () => {
        // Token expired - redirect to login
        authStorage.clearAuth();
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      },
      403: () => toast.error("Permission denied"),
      429: () => toast.error("Too many requests"),
      500: () => toast.error("Server error"),
      503: () => toast.error("Service unavailable"),
    });
    return Promise.reject(error);
  }
);
```

## 💡 Usage Examples

### Authentication

```javascript
import {authAPI} from '@/api/api';

// Register new user
try {
  const {data} = await authAPI.register({
    name: "John Doe",
    email: "john@example.com",
    password: "SecurePass123"
  });
  
  console.log(data.token); // JWT token
  console.log(data.user); // User object
} catch (error) {
  console.error("Registration failed:", error);
}

// Login
try {
  const {data} = await authAPI.login({
    email: "john@example.com",
    password: "SecurePass123"
  });
  
  // Store token in localStorage
  authStorage.setToken(data.token);
  authStorage.setUser(data.user);
} catch (error) {
  console.error("Login failed:", error);
}

// Get current user profile
try {
  const {data} = await authAPI.getCurrentUser();
  console.log(data); // Current user data
} catch (error) {
  console.error("Not authenticated:", error);
}
```

### Resume Operations

```javascript
import {resumeAPI} from '@/api/api';

// Upload resume file for parsing
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  try {
    const {data} = await resumeAPI.upload(formData);
    console.log("Parsed resume:", data);
    return data;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// Save resume
const saveResume = async (resumeData) => {
  try {
    const {data} = await resumeAPI.save(resumeData);
    console.log("Saved resume ID:", data._id);
    return data;
  } catch (error) {
    console.error("Save failed:", error);
  }
};

// List all user's resumes
const fetchResumes = async () => {
  try {
    const {data} = await resumeAPI.list();
    console.log("User resumes:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
  }
};

// Update existing resume
const updateResume = async (resumeId, updates) => {
  try {
    const {data} = await resumeAPI.update(resumeId, updates);
    console.log("Updated resume:", data);
    return data;
  } catch (error) {
    console.error("Update failed:", error);
  }
};

// Delete resume
const deleteResume = async (resumeId) => {
  try {
    await resumeAPI.delete(resumeId);
    console.log("Resume deleted successfully");
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
```

### AI Resume Enhancement

```javascript
import {resumeAPI} from '@/api/api';

// Enhance a resume section with AI
const enhanceSection = async (content, sectionType) => {
  try {
    const {data} = await resumeAPI.enhance(
      content,
      sectionType, // 'summary', 'experience', 'skills', etc.
      resumeData, // Optional: full resume for context
      customPrompt // Optional: custom AI instructions
    );
    
    console.log("Enhanced content:", data.enhancedContent);
    return data.enhancedContent;
  } catch (error) {
    console.error("Enhancement failed:", error);
  }
};

// Generate professional summary
const generateSummary = async (resumeData) => {
  try {
    const {data} = await resumeAPI.generateSummary(resumeData);
    console.log("Generated summary:", data.summary);
    return data.summary;
  } catch (error) {
    console.error("Summary generation failed:", error);
  }
};

// Categorize skills
const categorizeSkills = async (skillsList) => {
  try {
    const {data} = await resumeAPI.categorizeSkills(skillsList);
    console.log("Categorized skills:", data.categories);
    return data.categories;
  } catch (error) {
    console.error("Categorization failed:", error);
  }
};
```

### ATS Analysis

```javascript
import {resumeAPI} from '@/api/api';

// Analyze resume for ATS compatibility
const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  try {
    const {data} = await resumeAPI.analyzeResume(formData);
    
    console.log("ATS Score:", data.score); // 0-100
    console.log("Suggestions:", data.suggestions);
    console.log("Missing keywords:", data.missingKeywords);
    
    return data;
  } catch (error) {
    console.error("Analysis failed:", error);
  }
};
```

### AI Job Matching

```javascript
import {mlAPI} from '@/api/api';

// Calculate match score
const getMatchScore = async (resumeData, jobDescription) => {
  try {
    const {data} = await mlAPI.calculateMatchScore(
      resumeData,
      jobDescription
    );
    
    console.log("Match score:", data.matchScore); // 0-100
    console.log("Analysis:", data.analysis);
    
    return data;
  } catch (error) {
    console.error("Match calculation failed:", error);
  }
};

// Analyze skill gaps
const analyzeSkillGaps = async (resumeData, jobDescription) => {
  try {
    const {data} = await mlAPI.analyzeSkillGaps(
      resumeData,
      jobDescription
    );
    
    console.log("Missing skills:", data.missingSkills);
    console.log("Recommendations:", data.recommendations);
    
    return data;
  } catch (error) {
    console.error("Gap analysis failed:", error);
  }
};

// Quick match (skills only)
const quickMatch = async (skills, jobDescription) => {
  try {
    const {data} = await mlAPI.quickMatch(skills, jobDescription);
    
    console.log("Quick match score:", data.score);
    console.log("Key insights:", data.insights);
    
    return data;
  } catch (error) {
    console.error("Quick match failed:", error);
  }
};
```

### Feedback System

```javascript
import {feedbackAPI} from '@/api/feedback.api';

// Submit feedback
const submitFeedback = async (feedback) => {
  try {
    const {data} = await feedbackAPI.submitFeedback({
      type: 'feature-request', // bug, feature-request, improvement
      title: "Add dark mode support",
      description: "Please add dark mode to the resume editor",
      category: "UI/UX"
    });
    
    console.log("Feedback submitted:", data);
  } catch (error) {
    console.error("Feedback submission failed:", error);
  }
};

// Get user's feedback
const getMyFeedback = async () => {
  try {
    const {data} = await feedbackAPI.getMyFeedback({
      page: 1,
      limit: 10
    });
    
    console.log("My feedback:", data);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
};

// Upvote feedback
const upvoteFeedback = async (feedbackId) => {
  try {
    const {data} = await feedbackAPI.upvoteFeedback(feedbackId);
    console.log("Upvoted! New count:", data.upvotes);
  } catch (error) {
    console.error("Upvote failed:", error);
  }
};
```

### Payment & Subscriptions

```javascript
import {
  getPricing,
  createPaymentOrder,
  verifyPayment
} from '@/api/subscription.api';

// Get pricing plans
const fetchPricing = async () => {
  try {
    const data = await getPricing();
    console.log("Pricing plans:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch pricing:", error);
  }
};

// Create Razorpay order
const initiatePayment = async (tier, plan) => {
  try {
    const order = await createPaymentOrder(tier, plan);
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "ATS Resume Generator",
      description: `${tier} ${plan} subscription`,
      order_id: order.orderId,
      handler: async (response) => {
        // Verify payment on backend
        const verified = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        
        if (verified.success) {
          console.log("Payment successful!");
        }
      },
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Payment initiation failed:", error);
  }
};
```

## 🚨 Error Handling

### Automatic Error Handling

All API services use interceptors for automatic error handling:

```javascript
// 401 Unauthorized - Auto logout and redirect
// 403 Forbidden - Permission denied toast
// 429 Rate Limit - Retry after toast
// 500 Server Error - Generic error toast
// 503 Service Unavailable - Maintenance toast
```

### Manual Error Handling

```javascript
import {handleApiError, getErrorMessage} from '@/utils/errorHandler';
import toast from 'react-hot-toast';

try {
  const {data} = await resumeAPI.save(resumeData);
} catch (error) {
  // Option 1: Use helper function
  const message = handleApiError(error, "Failed to save resume", toast);
  
  // Option 2: Manual handling
  if (error.response?.status === 413) {
    toast.error("Resume file too large");
  } else {
    toast.error(getErrorMessage(error));
  }
  
  // Option 3: Status-specific handling
  handleErrorByStatus(error, {
    400: () => toast.error("Invalid resume data"),
    404: () => toast.error("Resume not found"),
    default: (err) => console.error(err)
  });
}
```

### Validation Errors

```javascript
import {parseValidationErrors, formatFieldErrors} from '@/utils/errorHandler';

try {
  await authAPI.register(userData);
} catch (error) {
  // Get all validation messages
  const message = parseValidationErrors(error);
  // "Email is invalid. Password must be at least 6 characters."
  
  // Get field-specific errors
  const fieldErrors = formatFieldErrors(error);
  // { email: "Email is invalid", password: "Too short" }
  
  // Display in form
  setFormErrors(fieldErrors);
}
```

## 🔐 Authentication

### Token Storage

```javascript
import {authStorage} from '@/utils/storage';

// After login
authStorage.setToken(data.token);
authStorage.setUser(data.user);

// Check if authenticated
const isAuthenticated = authStorage.isAuthenticated();

// Get current user
const user = authStorage.getUser();

// Logout
authStorage.clearAuth();
```

### Protected API Calls

```javascript
// JWT token is automatically added to all requests
// via request interceptor

// No manual token handling needed:
const {data} = await resumeAPI.list(); // ✅ Auto-authenticated

// vs Old way (DON'T DO THIS):
const token = localStorage.getItem('token'); // ❌
const {data} = await axios.get('/resume/list', {
  headers: {Authorization: `Bearer ${token}`} // ❌ Not needed
});
```

### Handling Expired Tokens

```javascript
// Automatic handling via interceptor:
// 1. 401 error detected
// 2. authStorage.clearAuth() called
// 3. User redirected to /login
// 4. Toast notification shown

// No manual handling needed!
```

## ✅ Best Practices

### 1. Use Destructuring

```javascript
// ✅ Good
const {data} = await resumeAPI.list();

// ❌ Bad
const response = await resumeAPI.list();
const data = response.data;
```

### 2. Handle Errors Gracefully

```javascript
// ✅ Good
try {
  const {data} = await resumeAPI.save(resumeData);
  toast.success("Resume saved!");
  return data;
} catch (error) {
  handleApiError(error, "Failed to save resume", toast);
  return null;
}

// ❌ Bad
const {data} = await resumeAPI.save(resumeData); // Might crash!
```

### 3. Use Loading States

```javascript
// ✅ Good
const [loading, setLoading] = useState(false);

const fetchResumes = async () => {
  setLoading(true);
  try {
    const {data} = await resumeAPI.list();
    setResumes(data);
  } catch (error) {
    handleApiError(error, "Failed to fetch resumes", toast);
  } finally {
    setLoading(false);
  }
};
```

### 4. Avoid Unnecessary API Calls

```javascript
// ✅ Good - Use useEffect dependencies
useEffect(() => {
  if (userId) {
    fetchUserData();
  }
}, [userId]);

// ❌ Bad - Runs on every render
fetchUserData();
```

### 5. Cache API Responses

```javascript
// ✅ Good - Use React Query or SWR
import {useQuery} from '@tanstack/react-query';

const {data, isLoading} = useQuery({
  queryKey: ['resumes'],
  queryFn: () => resumeAPI.list().then(res => res.data),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// ❌ Bad - Fetch on every mount
useEffect(() => {
  resumeAPI.list().then(res => setResumes(res.data));
}, []);
```

### 6. Use AbortController for Cleanup

```javascript
// ✅ Good
useEffect(() => {
  const controller = new AbortController();
  
  const fetchData = async () => {
    try {
      const {data} = await axios.get('/api/data', {
        signal: controller.signal
      });
      setData(data);
    } catch (error) {
      if (error.name !== 'CanceledError') {
        handleApiError(error);
      }
    }
  };
  
  fetchData();
  
  return () => controller.abort();
}, []);
```

## 🔧 Configuration

### Environment Variables

```env
# .env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### API Base URL

```javascript
// Automatically loaded from environment
import {config} from '@/utils/constants';

console.log(config.apiUrl); // http://localhost:5000/api
console.log(config.serverUrl); // http://localhost:5000
```

## 📚 API Response Format

### Success Response

```javascript
{
  success: true,
  data: { /* actual data */ },
  message: "Operation successful"
}
```

### Error Response

```javascript
{
  success: false,
  message: "Error message",
  errors: [ // Optional validation errors
    {field: "email", message: "Email is required"},
    {field: "password", message: "Password too short"}
  ]
}
```

## 🔄 Migration Guide

### From Old Pattern to New Pattern

```javascript
// ❌ Old way
const API_URL = "http://localhost:5000/api";

const fetchResumes = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/resume/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
};

// ✅ New way
import {resumeAPI} from '@/api/api';

const fetchResumes = async () => {
  const {data} = await resumeAPI.list();
  return data;
};
```

## 📖 Related Documentation

- [Error Handler Utils](../utils/README.md) - Error handling utilities
- [Storage Utils](../utils/README.md) - Token storage helpers
- [Constants](../utils/README.md) - API configuration

---

**Need help?** Check the [project documentation](../../../docs/) or open an issue on GitHub.
