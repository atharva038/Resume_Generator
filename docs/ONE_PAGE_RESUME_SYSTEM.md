# One-Page Resume Constraint System

## Overview
This system ensures all resumes stay within one page (A4/Letter size) and provides real-time feedback when content exceeds the limit.

## Features

### 1. **Page Height Validation**
- Monitors resume height in real-time
- A4 page size: 297mm (1122px at standard resolution)
- Maximum allowed height with margins: 1072px
- Visual warning when content overflows

### 2. **Character Limits per Section**
```javascript
Summary: 600 characters
Experience:
  - Description: 400 characters per entry
  - Maximum items: 3
Education:
  - Description: 200 characters per entry
  - Maximum items: 2
Projects:
  - Description: 300 characters per entry
  - Maximum items: 3
Skills:
  - Maximum categories: 6
  - Items per category: 15
Certifications: 4 items max
Achievements: 6 items max
```

### 3. **Real-Time Character Counter**
- Shows current/limit for text fields
- Color-coded progress bar:
  - Green: < 80% used
  - Yellow: 80-100% used
  - Red: > 100% (over limit)

### 4. **Page Overflow Warning**
- Floating alert appears when resume exceeds one page
- Shows overflow amount in pixels
- Automatically triggers toast notification
- Animates to grab user attention

## Components

### `PageLimitWarning.jsx`
Monitors resume height and displays warning when it exceeds one page.

**Props:**
- `resumePreviewRef`: Reference to resume preview container
- `onOverflow`: Callback function when overflow detected

### `CharacterCounter.jsx`
Displays character count and limit for input fields.

**Props:**
- `section`: Section name (summary, experience, etc.)
- `field`: Field name within section
- `value`: Current text value
- `className`: Additional CSS classes

### `resumePageValidator.js`
Utility functions for validation:
- `validateResumeLength(element)`: Check if resume fits one page
- `getCharacterLimit(section, field)`: Get limit for specific field
- `validateFieldLength(section, field, value)`: Validate field length
- `getResumeStats(resumeData)`: Get overview of resume content

## Template Optimizations

### Classic Template Improvements
**Typography:**
- Base font: 9.5pt (optimized for readability & space)
- Line height: 1.25 (tighter spacing)
- Section headings: 10pt
- Dates/metadata: 8.5pt

**Spacing:**
- Page padding: 0.4in top/bottom, 0.5in sides
- Section margins: 8px between sections
- Item margins: 6px for experience/projects
- List margins: 4px left indent

**Layout:**
- Max height: 11in (enforced)
- Overflow: hidden (prevents page break)
- Header: Compact with social links inline

## Usage

### In Editor.jsx
```jsx
import PageLimitWarning from '../components/PageLimitWarning';
import CharacterCounter from '../components/CharacterCounter';
import {validateFieldLength} from '../utils/resumePageValidator';

// In component
<PageLimitWarning 
  resumePreviewRef={resumePreviewRef}
  onOverflow={(result) => {
    toast.error(
      `Resume exceeds one page by ${Math.round(result.overflow)}px`,
      { duration: 5000 }
    );
  }}
/>
```

### In Form Fields
```jsx
<textarea
  value={summary}
  onChange={(e) => updateField('summary', e.target.value)}
  maxLength={600}
/>
<CharacterCounter 
  section="summary" 
  field="summary" 
  value={summary} 
/>
```

## Best Practices

1. **Keep Summary Concise**: 3-4 sentences (400-600 chars)
2. **Limit Experience Bullets**: 3-4 bullets per role, max 3 roles
3. **Combine Similar Skills**: Group related skills in categories
4. **Use Action Verbs**: Start bullets with strong verbs (saves space)
5. **Abbreviate Wisely**: Use common abbreviations (e.g., "Dr." not "Doctor")
6. **Remove Redundancy**: Avoid repeating information across sections

## ATS Optimization

The system maintains high ATS scores while fitting content:
- Clean, simple formatting
- Standard section headers
- No complex tables or graphics
- Consistent font sizing
- Proper hierarchy (H1 for name, H2 for sections)
- Machine-readable structure

## Testing

Check if resume fits:
```javascript
import {validateResumeLength} from './utils/resumePageValidator';

const element = document.querySelector('[data-resume-template]');
const result = validateResumeLength(element);

if (!result.isValid) {
  console.log(`Overflow: ${result.overflow}px`);
}
```

## Troubleshooting

**Issue**: Resume still overflows despite limits
**Solution**: Reduce number of items in sections, not just character count

**Issue**: Character counter not showing
**Solution**: Ensure CharacterCounter component is imported and section/field names match

**Issue**: Warning doesn't disappear after reducing content
**Solution**: Component auto-updates every 500ms; wait briefly after changes

## Future Enhancements

- [ ] Auto-adjust font size to fit content
- [ ] Smart content prioritization
- [ ] Export to multiple page formats
- [ ] Template-specific limits
- [ ] AI-powered content summarization
