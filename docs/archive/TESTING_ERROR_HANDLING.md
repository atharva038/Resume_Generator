# Quick Testing Guide - Frontend Error Handling

## How to Test Validation Error Display

### 🔐 Authentication Tests

#### Test 1: Registration - Weak Password
1. Navigate to `/register`
2. Fill form with:
   - Name: Test User
   - Email: test@example.com
   - Password: `abc123` (no uppercase, no special char)
3. Submit
4. ✅ **Expected**: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)"

#### Test 2: Login - Invalid Email
1. Navigate to `/login`
2. Fill form with:
   - Email: `notanemail` (invalid format)
   - Password: anything
3. Submit
4. ✅ **Expected**: "Email must be a valid email address"

---

### 📝 Contact Form Tests

#### Test 3: Short Message
1. Navigate to `/contact`
2. Fill form with:
   - Name: Test
   - Email: test@example.com
   - Message: `Hi` (less than 10 characters)
3. Submit
4. ✅ **Expected**: "Message must be between 10 and 1000 characters"

#### Test 4: Invalid Email
1. Navigate to `/contact`
2. Fill with invalid email: `bademail`
3. Submit
4. ✅ **Expected**: Field-specific error next to email input

---

### 💬 Feedback Form Tests

#### Test 5: Short Title
1. Navigate to `/feedback`
2. Fill form with:
   - Title: `Hi` (less than 3 characters)
   - Description: Valid text
3. Submit
4. ✅ **Expected**: "Title must be between 3 and 100 characters" in red alert box

---

### 📄 File Upload Tests

#### Test 6: Large File
1. Navigate to editor `/editor`
2. Try uploading a file larger than 5MB
3. ✅ **Expected**: "File size must not exceed 5MB"

#### Test 7: Invalid File Type
1. Navigate to editor `/editor`
2. Try uploading a .txt or .jpg file
3. ✅ **Expected**: "Only PDF, DOC, and DOCX files are allowed"

---

### 💾 Resume Save Tests

#### Test 8: Empty Resume Title
1. Navigate to `/editor`
2. Create resume without title
3. Click Save
4. ✅ **Expected**: Validation error about required fields

---

### 👨‍💼 Admin Panel Tests (Requires Admin Account)

#### Test 9: Invalid Status Update
1. Login as admin
2. Navigate to `/admin/contacts`
3. Try to update message status to invalid value (manipulate API call)
4. ✅ **Expected**: "Status must be one of: new, read, replied, archived"

#### Test 10: Invalid User Role
1. Login as admin
2. Navigate to `/admin/users`
3. Try to update user role to invalid value
4. ✅ **Expected**: "Role must be one of: user, admin"

---

## Rate Limiting Tests

### Test 11: Hit Rate Limit
1. Make 101 requests rapidly (any endpoint)
2. ✅ **Expected**: "Too many requests. Please try again later."
   - Status code: 429
   - Retry-After header included

### Test 12: Login Rate Limit
1. Make 6 failed login attempts rapidly
2. ✅ **Expected**: "Too many login attempts. Please try again later."
   - Locked for 15 minutes

---

## AI Quota Tests

### Test 13: Exceed Daily Quota (Free User)
1. Use AI enhancement 11 times in one day
2. ✅ **Expected**: "Daily AI quota exceeded. Upgrade to premium for more."

---

## Automated Testing Script

Run all validation tests at once:

```bash
# From project root
npm run test:validation

# Or run quick tests
npm run test:validation-quick
```

---

## Expected Console Logs

When validation fails, you should see in browser console:
```
Error: Request failed with status code 400
Response: {
  success: false,
  message: "Validation Error",
  errors: [
    {field: "password", message: "Password must contain..."}
  ]
}
```

After our fix, the UI shows the parsed message:
```
"Password must contain at least one uppercase letter..."
```

---

## Troubleshooting

### If errors still show as "Bad Request"
1. Check if `errorHandler.js` was created properly
2. Verify import statement in component
3. Check that `parseValidationErrors()` is called in catch block
4. Clear browser cache and reload

### If field-specific errors don't show
1. Verify `formatFieldErrors()` is imported
2. Check that component has field error states
3. Verify error display logic in JSX

### If rate limiting doesn't work
1. Check that server is running
2. Verify `express-rate-limit` middleware is loaded
3. Check Redis connection (if using Redis store)

---

## Success Criteria

✅ All validation errors display user-friendly messages
✅ No "Bad Request" or "Request failed with status code 400" shown to users
✅ Field-specific errors appear next to relevant inputs
✅ Admin panel shows proper validation errors
✅ Rate limit errors display with clear messages
✅ AI quota errors are informative

---

**Last Updated**: October 28, 2025
**Test Coverage**: 13 test scenarios
**Status**: Ready for testing ✨
