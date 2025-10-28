# Quick Test Guide - Unsaved Changes Warning

## 🚀 Quick Start Testing

### Prerequisites
- Resume must be loaded in the editor
- You must be logged in

---

## 🧪 5-Minute Test Suite

### Test 1: Visual Indicator ⚡ (30 seconds)
1. Open resume in editor
2. Wait for "Saved" (blue button with 💾)
3. Type anything in the name field
4. ✅ **Verify:** Button turns orange with ⚠️ icon and pulsing red dot

---

### Test 2: Save Functionality ⚡ (1 minute)
1. Make the button orange (edit any field)
2. Click the Save button
3. ✅ **Verify:** 
   - Shows "Saving..." with ⏳
   - Alert: "Resume updated successfully!"
   - Button returns to blue 💾 "Saved"
4. Refresh the page
5. ✅ **Verify:** Your changes are still there

---

### Test 3: Back Button Warning ⚡ (1 minute)
1. Edit something (don't save)
2. Click browser back button
3. ✅ **Verify:** Modal appears with:
   - Yellow warning icon
   - "Unsaved Changes" title
   - Three buttons: Save / Discard / Cancel
4. Click "Cancel"
5. ✅ **Verify:** Modal closes, you're still on editor

---

### Test 4: Save and Navigate ⚡ (1 minute)
1. Edit something again
2. Click back button (modal appears)
3. Click "Save Changes" button
4. ✅ **Verify:**
   - Button shows "Saving..."
   - Alert: "Resume updated successfully!"
   - Modal closes automatically
   - You're navigated to previous page
5. Return to editor
6. ✅ **Verify:** Your changes are saved

---

### Test 5: Discard Changes ⚡ (1.5 minutes)
1. Note current name value (e.g., "John Doe")
2. Change it to something else (e.g., "Test User")
3. Button turns orange
4. Click back button
5. Click "Discard Changes"
6. ✅ **Verify:** Immediately navigates away
7. Return to editor
8. ✅ **Verify:** Name is still "John Doe" (original value)

---

## 🔥 Edge Case Tests (Optional)

### Test 6: Tab Close Warning (30 seconds)
1. Make changes (don't save)
2. Try to close the browser tab (Cmd+W or close button)
3. ✅ **Verify:** Browser shows warning: "Changes you made may not be saved"
4. Choose "Stay on Page"

---

### Test 7: Multiple Changes (1 minute)
1. Change name
2. Change email
3. Add a skill
4. ✅ **Verify:** Button stays orange throughout
5. Click Save
6. ✅ **Verify:** All changes are saved

---

### Test 8: No Changes Navigation (30 seconds)
1. Don't make any changes
2. Click back button
3. ✅ **Verify:** Navigates immediately (no modal)

---

## 📱 Mobile Testing (2 minutes)

1. Open on mobile device or resize browser to mobile width
2. Edit something
3. ✅ **Verify:** 
   - Save button in top bar turns orange
   - Pulsing red dot appears
   - Text changes to "Save*"
4. Click device back button
5. ✅ **Verify:** Modal is mobile-responsive
6. Click "Save Changes"
7. ✅ **Verify:** Works same as desktop

---

## 🌙 Dark Mode Testing (1 minute)

1. Toggle dark mode (if available)
2. Edit something to show orange button
3. Click back button
4. ✅ **Verify:** Modal looks good in dark mode:
   - Dark background
   - Light text
   - Buttons visible
5. Click Cancel
6. Toggle back to light mode
7. ✅ **Verify:** Everything works in light mode too

---

## ✅ Success Criteria

All these should work:
- [ ] Save button changes color (blue → orange → blue)
- [ ] Pulsing red dot appears when unsaved
- [ ] Back button shows modal when unsaved
- [ ] Tab close shows browser warning when unsaved
- [ ] "Save Changes" button saves and navigates
- [ ] "Discard Changes" button loses changes and navigates
- [ ] "Cancel" button keeps you on page
- [ ] No modal when no changes
- [ ] Mobile responsive
- [ ] Dark mode support

---

## 🐛 Report Issues

If something doesn't work:

1. **Check Console** (F12 → Console tab)
   - Look for JavaScript errors
   - Copy error messages

2. **Check Network** (F12 → Network tab)
   - Look for failed API calls
   - Check status codes

3. **Note Details:**
   - What did you do?
   - What did you expect?
   - What actually happened?
   - Browser and version?
   - Mobile or desktop?

---

## 💡 Expected Behavior Summary

### Save Button States
| State | Color | Icon | Text | Dot |
|-------|-------|------|------|-----|
| Saved | Blue | 💾 | "Saved" | None |
| Unsaved | Orange | ⚠️ | "Save*" | Red pulsing |
| Saving | Gray | ⏳ | "Saving..." | None |

### Navigation Scenarios
| Scenario | Changes? | Expected Behavior |
|----------|----------|-------------------|
| Back button | No | Navigate immediately |
| Back button | Yes | Show modal |
| Tab close | No | Close immediately |
| Tab close | Yes | Browser warning |
| Refresh | Yes | Browser warning |

### Modal Actions
| Button | Action | Data |
|--------|--------|------|
| Save Changes | Save then navigate | Preserved ✅ |
| Discard Changes | Navigate immediately | Lost ❌ |
| Cancel | Close modal | Preserved ✅ (still in editor) |

---

## 🎯 Quick Checklist

**Basic Functionality:**
- [ ] Button changes color when editing
- [ ] Save button works
- [ ] Back button shows modal
- [ ] Modal buttons work

**Navigation:**
- [ ] Save and navigate works
- [ ] Discard and navigate works
- [ ] Cancel keeps you on page

**Edge Cases:**
- [ ] Tab close warning works
- [ ] No modal when no changes
- [ ] Multiple changes tracked

**UI/UX:**
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Visual indicators clear

---

## ⚡ One-Minute Smoke Test

**The fastest way to verify it's working:**

1. Edit name field → Button turns orange ✅
2. Click back → Modal appears ✅
3. Click Cancel → Stay on page ✅
4. Click back → Modal appears ✅
5. Click Save → Navigates away ✅

**If all 5 work → Feature is working! 🎉**

---

## 📞 Need Help?

**Feature not working?**
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear cache and reload
3. Check that you're logged in
4. Check browser console for errors

**Still broken?**
- Check UNSAVED_CHANGES_UX.md for detailed troubleshooting
- Look at Editor.jsx lines 115-188 for implementation
- Verify all useEffect hooks are running

---

**Happy Testing! 🚀**
