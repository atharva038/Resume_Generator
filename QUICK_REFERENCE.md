# ⚡ One-Page Resume System - Quick Reference

## 🎯 Character Limits

| Section | Limit | Notes |
|---------|-------|-------|
| Summary | 600 | 3-4 sentences max |
| Experience | 400/entry | Max 3 entries |
| Projects | 300/entry | Max 3 entries |
| Education | 200/entry | Max 2 entries |
| Skills | 6 categories | 15 items each |
| Certifications | 4 items | |
| Achievements | 6 items | |

## 📏 Visual Indicators

### Character Counter Colors
- 🟢 **Green** (0-80%): Safe, plenty of room
- 🟡 **Yellow** (80-100%): Approaching limit
- 🔴 **Red** (>100%): Over limit, reduce text

### Page Overflow Warning
```
⚠️ Resume Exceeds One Page!
Content overflow: XXXpx
Action: Reduce content
```

## ✂️ Quick Tips to Reduce Content

### DO ✅
- Use action verbs (led, built, drove)
- Quantify results (increased by 40%)
- Combine similar roles
- Abbreviate (B.S., M.S., Dr.)
- Focus on recent/relevant items

### DON'T ❌
- Repeat skills across sections
- Include "References available"
- Add full addresses
- Use long sentences
- List all old jobs

## 🎨 Template Specs

### Classic Template Settings
```
Font Size: 9.5pt
Line Height: 1.25
Page Padding: 0.4in top/bottom, 0.5in sides
Section Spacing: 8px
Max Height: 11in (A4)
```

## 🚀 Quick Actions

### Test if Resume Fits
1. Navigate to Editor
2. Watch bottom-right corner
3. If warning appears → reduce content
4. Download PDF to verify

### Reduce Overflow
1. Check character counters (look for red)
2. Remove oldest/least relevant items
3. Shorten bullet points
4. Combine similar entries
5. Watch warning disappear

## 📱 Where to Look

### Character Counter
- **Location**: Below text inputs
- **Shows**: Current/Limit + Progress bar
- **Updates**: Real-time as you type

### Page Warning  
- **Location**: Bottom-right corner (floating)
- **Shows**: Overflow amount in pixels
- **Behavior**: Appears when >1 page, auto-hides when fixed

## 🔧 Files Reference

```
Core Logic:
└─ client/src/utils/resumePageValidator.js

Components:
├─ client/src/components/PageLimitWarning.jsx
├─ client/src/components/CharacterCounter.jsx
└─ client/src/components/EditableSection.jsx

Templates:
└─ client/src/components/templates/ClassicTemplate.jsx

Docs:
├─ README_ONE_PAGE_SYSTEM.md (start here)
├─ docs/ONE_PAGE_RESUME_SYSTEM.md (full docs)
└─ IMPLEMENTATION_SUMMARY.md (technical)
```

## ⚙️ Commands

### Setup Check
```powershell
.\setup-one-page-system.ps1
```

### Run Tests (Git Bash/WSL)
```bash
bash tests/test-one-page-resume.sh
```

### Start Dev Server
```bash
cd client
npm run dev
```

## 🎓 Content Strategy

### Priority Order
1. **Name & Contact** (required)
2. **Summary** (2-3 lines max)
3. **Top 2-3 Experiences** (most recent/relevant)
4. **Education** (degree + school)
5. **Skills** (grouped by category)
6. **Projects/Certs** (if space allows)

### Bullet Point Formula
```
[Action Verb] + [What] + [Result/Impact]

Example:
"Led team of 5 developers, reducing deployment time by 40%"
```

## 📊 Success Metrics

✅ **Resume fits on 1 page**  
✅ **No red character counters**  
✅ **No overflow warning**  
✅ **Downloaded PDF is 1 page**  
✅ **ATS score > 90**  

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Counter not showing | Clear cache, refresh browser |
| Warning won't disappear | Wait 500ms after edit, reduce more |
| PDF is 2 pages | Check browser print settings |
| Can't fit content | Remove old items, not just shorten |

## 📞 Help

1. **Quick Start**: README_ONE_PAGE_SYSTEM.md
2. **Full Docs**: docs/ONE_PAGE_RESUME_SYSTEM.md
3. **Technical**: IMPLEMENTATION_SUMMARY.md
4. **Verify Setup**: Run setup-one-page-system.ps1

---

**Pro Tip**: Start with minimum required sections, then add optional ones if space allows.

**Remember**: Quality > Quantity. A concise, impactful one-page resume beats a cluttered two-pager.
