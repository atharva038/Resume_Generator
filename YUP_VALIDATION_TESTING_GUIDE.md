# Yup Validation Testing Guide

## ✅ Dev Server Status: RUNNING

The development server is active. Follow this guide to test all form validations.

---

## 🧪 Test Plan

### 1. **Login Form** (`/login`)

**URL:** `http://localhost:5173/login`

#### Test Cases:

**Test 1: Empty Form**
- [ ] Leave email empty, click Submit
- **Expected:** "Email is required" error appears

**Test 2: Invalid Email Format**
- [ ] Enter: `notanemail`
- [ ] Leave password empty
- **Expected:** "Please enter a valid email address"

**Test 3: Missing Password**
- [ ] Enter valid email: `test@example.com`
- [ ] Leave password empty
- **Expected:** "Password is required"

**Test 4: Valid Credentials**
- [ ] Enter valid email: `test@example.com`
- [ ] Enter password: `password123`
- **Expected:** Form submits, API call is made

---

### 2. **Register Form** (`/register`)

**URL:** `http://localhost:5173/register`

#### Test Cases:

**Test 1: Name Too Short**
- [ ] Enter name: `A` (1 character)
- **Expected:** "Name must be at least 2 characters"

**Test 2: Invalid Email**
- [ ] Enter name: `John Doe`
- [ ] Enter email: `invalidemail`
- **Expected:** "Please enter a valid email address"

**Test 3: Weak Password (Too Short)**
- [ ] Enter all fields correctly
- [ ] Password: `Pass1` (5 characters)
- **Expected:** "Password must be at least 8 characters"

**Test 4: Weak Password (No Uppercase)**
- [ ] Password: `password123` (lowercase only)
- **Expected:** "Password must contain at least one uppercase letter, one lowercase letter, and one number"

**Test 5: Weak Password (No Lowercase)**
- [ ] Password: `PASSWORD123` (uppercase only)
- **Expected:** Same as above

**Test 6: Weak Password (No Number)**
- [ ] Password: `Password` (no number)
- **Expected:** Same as above

**Test 7: Passwords Don't Match**
- [ ] Password: `Password123`
- [ ] Confirm: `Password456`
- **Expected:** "Passwords must match"

**Test 8: Strong Password Success**
- [ ] Name: `John Doe`
- [ ] Email: `john@example.com`
- [ ] Password: `Password123`
- [ ] Confirm: `Password123`
- **Expected:** Form submits, registration proceeds

---

### 3. **Forgot Password Form** (`/forgot-password`)

**URL:** `http://localhost:5173/forgot-password`

#### Test Cases:

**Test 1: Empty Email**
- [ ] Leave email empty, click Submit
- **Expected:** "Email is required"

**Test 2: Invalid Email Format**
- [ ] Enter: `notvalidemail`
- **Expected:** "Please enter a valid email address"

**Test 3: Valid Email**
- [ ] Enter: `test@example.com`
- **Expected:** Form submits, reset email sent

---

### 4. **Reset Password Form** (`/reset-password?token=...`)

**URL:** `http://localhost:5173/reset-password?token=test123`

#### Test Cases:

**Test 1: Password Too Short**
- [ ] Enter password: `Pass1` (5 characters)
- **Expected:** "Password must be at least 8 characters"

**Test 2: Weak Password**
- [ ] Password: `password123` (no uppercase)
- **Expected:** "Password must contain at least one uppercase letter, one lowercase letter, and one number"

**Test 3: Passwords Don't Match**
- [ ] Password: `Password123`
- [ ] Confirm: `Password456`
- **Expected:** "Passwords must match"

**Test 4: Strong Password Success**
- [ ] Password: `NewPassword123`
- [ ] Confirm: `NewPassword123`
- **Expected:** Password reset successful

---

### 5. **Contact Form** (`/contact`)

**URL:** `http://localhost:5173/contact`

#### Test Cases (Contact Tab):

**Test 1: Name Too Short**
- [ ] Name: `A` (1 character)
- **Expected:** "Name must be at least 2 characters"

**Test 2: Invalid Email**
- [ ] Name: `John Doe`
- [ ] Email: `notvalid`
- **Expected:** "Please enter a valid email address"

**Test 3: Invalid Phone (Optional)**
- [ ] Phone: `abc123!@#` (invalid characters)
- **Expected:** "Phone number can only contain numbers, spaces, and symbols: + - ( )"

**Test 4: Phone Too Short**
- [ ] Phone: `123` (less than 10 chars)
- **Expected:** "Phone number must be at least 10 characters"

**Test 5: Subject Too Short**
- [ ] Subject: `Hi` (2 characters)
- **Expected:** "Subject must be at least 5 characters"

**Test 6: Message Too Short**
- [ ] Message: `Hello` (5 characters)
- **Expected:** "Message must be at least 10 characters"

**Test 7: Valid Submission**
- [ ] Name: `John Doe`
- [ ] Email: `john@example.com`
- [ ] Phone: `+1234567890` (optional)
- [ ] Company: `Acme Corp` (optional)
- [ ] Subject: `Question about features`
- [ ] Category: `general`
- [ ] Message: `I have a question about your AI resume features. Can you help?`
- **Expected:** ✅ Success toast, form resets

---

### 6. **Feedback Form** (`/contact` - Feedback Tab)

**URL:** `http://localhost:5173/contact` (switch to Feedback tab)

#### Test Cases:

**Test 1: Title Too Short**
- [ ] Title: `Bug` (3 characters)
- **Expected:** "Title must be at least 5 characters"

**Test 2: Description Too Short**
- [ ] Description: `Problem` (7 characters)
- **Expected:** "Description must be at least 10 characters"

**Test 3: Valid Feedback Submission**
- [ ] Type: `bug`
- [ ] Title: `Login page layout issue`
- [ ] Description: `The login button overlaps with the footer on mobile devices`
- [ ] Priority: `high`
- [ ] Category: `ui-ux`
- **Expected:** 🎉 Success toast, form resets

---

## 🎯 Quick Test Checklist

Use this quick checklist to verify all validations are working:

### Authentication Forms
- [ ] Login: Email validation works
- [ ] Login: Password required works
- [ ] Register: Strong password validation works
- [ ] Register: Password match validation works
- [ ] Forgot Password: Email validation works
- [ ] Reset Password: Strong password validation works

### Contact Forms
- [ ] Contact: Name validation works
- [ ] Contact: Email validation works
- [ ] Contact: Phone validation works (optional field)
- [ ] Contact: Subject length validation works
- [ ] Contact: Message length validation works
- [ ] Feedback: Title length validation works
- [ ] Feedback: Description length validation works

---

## 🔍 What to Look For

### Visual Indicators
1. **Error Messages:**
   - Should appear below the field or at the top of the form
   - Should be clear and descriptive
   - Should use Yup's error messages (check against schema)

2. **Form Behavior:**
   - Form should NOT submit if validation fails
   - Error should show BEFORE API call
   - Loading spinner should NOT appear on validation error

3. **User Experience:**
   - Errors appear immediately on submit click
   - No console errors in browser DevTools
   - Form is responsive and doesn't freeze

### Browser Console
Open DevTools (F12 or Cmd+Option+I) and check:
- [ ] No JavaScript errors
- [ ] No "undefined" or "null" errors
- [ ] No Yup validation errors in console

---

## 🐛 Common Issues to Check

### Issue 1: Validation Not Working
**Symptoms:** Form submits even with invalid data
**Check:**
- Import statements in the page file
- `validateWithSchema` is called before API request
- Schema is imported correctly from `@/utils/validation`

### Issue 2: Error Message Not Showing
**Symptoms:** No error appears when validation fails
**Check:**
- `setError()` is called with the validation error
- Error state is displayed in the JSX
- Error component is visible (not hidden by CSS)

### Issue 3: Form Hangs on Submit
**Symptoms:** Loading spinner shows forever
**Check:**
- `finally` block sets loading to false
- No infinite loops in validation
- API endpoint is accessible

---

## 📊 Expected Validation Messages

Reference this list to verify correct error messages:

### Authentication
| Field | Invalid Input | Expected Message |
|-------|--------------|------------------|
| Email (empty) | `` | "Email is required" |
| Email (invalid) | `notanemail` | "Please enter a valid email address" |
| Password (empty) | `` | "Password is required" |
| Password (short) | `Pass1` | "Password must be at least 8 characters" |
| Password (weak) | `password123` | "Password must contain at least one uppercase..." |
| Confirm Password | `different` | "Passwords must match" |
| Name (short) | `A` | "Name must be at least 2 characters" |

### Contact
| Field | Invalid Input | Expected Message |
|-------|--------------|------------------|
| Name (short) | `A` | "Name must be at least 2 characters" |
| Email (invalid) | `notvalid` | "Please enter a valid email address" |
| Phone (invalid) | `abc!@#` | "Phone number can only contain numbers..." |
| Phone (short) | `123` | "Phone number must be at least 10 characters" |
| Subject (short) | `Hi` | "Subject must be at least 5 characters" |
| Message (short) | `Hello` | "Message must be at least 10 characters" |

### Feedback
| Field | Invalid Input | Expected Message |
|-------|--------------|------------------|
| Title (short) | `Bug` | "Title must be at least 5 characters" |
| Description (short) | `Problem` | "Description must be at least 10 characters" |

---

## ✅ Success Criteria

Validation is working correctly if:

1. **All validation messages match the schema rules**
2. **Forms DO NOT submit with invalid data**
3. **Error messages appear BEFORE API calls**
4. **No console errors during testing**
5. **Forms submit successfully with valid data**
6. **User experience is smooth (no freezing/hanging)**

---

## 🚀 Testing Tips

1. **Test in Order:** Start with Login, then Register, etc.
2. **Use Real Data:** Try realistic email addresses and names
3. **Test Edge Cases:** Very long strings, special characters, etc.
4. **Test All Fields:** Don't skip optional fields
5. **Clear Form Between Tests:** Refresh page or manually clear inputs
6. **Check Network Tab:** Verify no API calls on validation failure
7. **Test Mobile View:** Responsive design might affect error display

---

## 📝 Report Issues

If you find any issues during testing, note:
- **Form:** Which form (Login, Register, Contact, etc.)
- **Field:** Which field has the problem
- **Input:** What you entered
- **Expected:** What should happen
- **Actual:** What actually happened
- **Console Errors:** Any errors in browser console

---

## 🎉 After Testing

Once all tests pass:
1. ✅ Mark validation as production-ready
2. 📋 Create a list of any issues found
3. 🔧 Fix critical issues before deployment
4. 📚 Update user-facing documentation
5. 🚀 Ready for production deployment!

---

**Happy Testing! 🧪✨**

Dev Server: `http://localhost:5173`
