# AI-Powered Resume Features Documentation

## Overview
This document describes the AI-powered features implemented in SmartNShine Resume Builder using Google Gemini 2.5 Flash model.

## Features

### 1. AI Skills Categorization ✅

**Purpose**: Automatically categorizes skills entered as comma-separated text into professional categories.

**User Flow**:
1. User clicks on "Skills" section in editor
2. Instead of manually adding categories, user enters all skills in a single textarea (comma-separated)
3. User clicks "Categorize Skills with AI" button (purple-blue gradient)
4. AI processes the skills and groups them into categories like:
   - Programming Languages
   - Frameworks & Libraries
   - Tools & Technologies
   - Databases
   - Cloud & DevOps
   - Soft Skills
   - etc.
5. Results appear as editable categories with items
6. User can modify categories and items as needed

**Technical Details**:
- **Endpoint**: `POST /api/resume/categorize-skills`
- **Service**: `categorizeSkillsWithAI()` in `gemini.service.js`
- **AI Model**: Google Gemini 2.5 Flash
- **Processing Time**: ~2-3 seconds
- **Input Format**: Comma-separated string (e.g., "React, Node.js, MongoDB, Python, AWS, Leadership")
- **Output Format**: Array of objects `[{category: "...", items: [...]}]`

**Example**:
```
Input: "React, Node.js, MongoDB, Python, AWS, Docker, Leadership, Problem Solving"

Output:
[
  {category: "Frontend Development", items: ["React"]},
  {category: "Backend Development", items: ["Node.js"]},
  {category: "Databases", items: ["MongoDB"]},
  {category: "Programming Languages", items: ["Python"]},
  {category: "Cloud & DevOps", items: ["AWS", "Docker"]},
  {category: "Soft Skills", items: ["Leadership", "Problem Solving"]}
]
```

---

### 2. AI Achievements Formatting ✅

**Purpose**: Converts paragraph-form achievements into ATS-optimized bullet points with action verbs.

**User Flow**:
1. User clicks on "Achievements" section in editor
2. User enters achievements in paragraph format (natural writing)
3. User clicks "Format Achievements with AI" button (green-teal gradient)
4. AI converts paragraphs into professional bullet points
5. Each bullet starts with strong action verbs
6. Results appear as editable text inputs
7. User can manually add more achievements or edit existing ones

**Technical Details**:
- **Endpoint**: `POST /api/resume/segregate-achievements`
- **Service**: `segregateAchievementsWithAI()` in `gemini.service.js`
- **AI Model**: Google Gemini 2.5 Flash
- **Processing Time**: ~2-3 seconds
- **Input Format**: Paragraph text (natural language)
- **Output Format**: Array of strings (bullet points)

**Example**:
```
Input: 
"I increased sales by 30% last quarter by implementing a new CRM system. 
Also led a team of 5 developers to launch the mobile app ahead of schedule. 
Won the Employee of the Year award for outstanding performance."

Output:
[
  "Increased sales by 30% in Q4 by implementing advanced CRM system",
  "Led cross-functional team of 5 developers to deliver mobile app 2 weeks ahead of schedule",
  "Awarded Employee of the Year for exceptional performance and leadership contributions"
]
```

**AI Prompt Engineering**:
- Starts with action verbs (Increased, Led, Developed, etc.)
- Includes quantifiable metrics when possible
- Removes fluff and focuses on impact
- Professional and ATS-optimized language

---

### 3. AI Custom Sections Processing ✅

**Purpose**: Allows users to create custom resume sections (e.g., Publications, Languages, Volunteer Work) with AI-powered formatting.

**User Flow**:
1. User clicks on "Custom Sections" in editor
2. User clicks "+ Add Custom Section"
3. User enters section title (e.g., "Publications", "Languages", "Volunteer Work")
4. User enters content in paragraph or mixed format
5. User clicks "Format with AI" button (indigo-purple gradient)
6. AI formats content into bullet points contextually based on section title
7. Results appear as editable items
8. User can add multiple custom sections

**Technical Details**:
- **Endpoint**: `POST /api/resume/process-custom-section`
- **Service**: `processCustomSectionWithAI()` in `gemini.service.js`
- **AI Model**: Google Gemini 2.5 Flash
- **Processing Time**: ~2-3 seconds
- **Input Format**: 
  - `content`: Paragraph or mixed format text
  - `sectionTitle`: Name of the custom section
- **Output Format**: Array of strings (bullet points)

**Context-Aware Formatting**:
The AI adapts formatting based on section title:

**Languages Section**:
```
Input (title: "Languages"):
"I speak English fluently and Spanish conversationally. Also learning French."

Output:
[
  "English - Fluent/Native",
  "Spanish - Conversational",
  "French - Basic/Learning"
]
```

**Publications Section**:
```
Input (title: "Publications"):
"Published 5 papers in AI journals including one in Nature. Co-authored a book on machine learning."

Output:
[
  "Published 5 research papers in top-tier AI journals including Nature",
  "Co-authored comprehensive textbook on Machine Learning fundamentals"
]
```

**Volunteer Work Section**:
```
Input (title: "Volunteer Work"):
"Volunteer at local food bank for 3 years. Also mentor students in coding."

Output:
[
  "Active volunteer at community food bank for 3+ years",
  "Mentor for aspiring developers in coding bootcamp programs"
]
```

---

## Technical Architecture

### Backend Stack

**Service Layer** (`server/services/gemini.service.js`):
```javascript
- categorizeSkillsWithAI(skillsText)
- segregateAchievementsWithAI(achievementsText)
- processCustomSectionWithAI(content, sectionTitle)
```

**Controller Layer** (`server/controllers/resume.controller.js`):
```javascript
- categorizeSkills()
- segregateAchievements()
- processCustomSection()
```

**Routes** (`server/routes/resume.routes.js`):
```javascript
POST /api/resume/categorize-skills
POST /api/resume/segregate-achievements
POST /api/resume/process-custom-section
```

### Frontend Stack

**API Service** (`client/src/services/api.js`):
```javascript
resumeAPI.categorizeSkills(skills)
resumeAPI.segregateAchievements(achievements)
resumeAPI.processCustomSection(content, title)
```

**Components** (`client/src/components/EditorSections.jsx`):
```javascript
- SkillsSection (with AI button)
- AchievementsSection (with AI button)
- CustomSectionsManager (with multiple custom sections)
- CustomSectionItem (individual section with AI button)
```

**Editor Integration** (`client/src/pages/Editor.jsx`):
- Added "customSections" to DEFAULT_SECTION_ORDER
- Integrated CustomSectionsManager component
- Collapsible sections with drag-and-drop support

**Template Rendering** (All 4 templates):
- ClassicTemplate.jsx
- ModernTemplate.jsx
- MinimalTemplate.jsx
- ProfessionalTemplate.jsx

Each template renders custom sections dynamically with proper styling.

---

## AI Prompt Engineering

### Common Patterns

All AI functions follow similar patterns:

1. **Clear Instructions**: Specific guidelines for output format
2. **JSON-Only Response**: All responses must be valid JSON
3. **No Markdown**: Explicitly no code blocks or markdown formatting
4. **Context-Aware**: Adapts based on section type and content
5. **Professional Tone**: ATS-optimized and resume-appropriate
6. **Quantifiable**: Includes metrics and numbers when available

### Example Prompt (Skills Categorization)

```javascript
const prompt = `You are a professional resume writing assistant. Your task is to categorize skills for a resume.

Given the following comma-separated list of skills, categorize them into appropriate groups:

"${skillsText}"

Rules:
1. Create professional category names (e.g., "Programming Languages", "Frameworks & Libraries", "Tools & Technologies")
2. Group related skills together logically
3. Return a JSON array in this exact format: [{"category": "Category Name", "items": ["skill1", "skill2"]}]
4. Do not include markdown code blocks or any other formatting
5. Return ONLY the JSON array, nothing else

Example output format:
[{"category":"Programming Languages","items":["JavaScript","Python"]},{"category":"Frameworks","items":["React","Node.js"]}]`;
```

### Error Handling

All AI functions include robust error handling:

1. **Input Validation**: Check for empty/invalid input
2. **JSON Cleanup**: Remove markdown code blocks, parse JSON safely
3. **Fallback**: Return empty arrays on failure
4. **User-Friendly Errors**: Display helpful error messages
5. **Logging**: Console errors for debugging

---

## UI/UX Features

### Loading States
- Animated spinner during AI processing
- Disabled buttons to prevent multiple submissions
- Clear "Formatting..." or "Processing..." text

### Error States
- Red error banners with helpful messages
- Validation errors (empty input, missing title)
- Network error messages

### Success States
- Smooth transition to formatted results
- Editable results for user customization
- Add/remove functionality for manual adjustments

### Visual Design
- **Skills AI Button**: Purple-blue gradient (`from-purple-600 to-blue-600`)
- **Achievements AI Button**: Green-teal gradient (`from-green-600 to-teal-600`)
- **Custom Section AI Button**: Indigo-purple gradient (`from-indigo-600 to-purple-600`)

### Accessibility
- Clear button labels with emojis
- Helpful tooltips and placeholders
- Keyboard navigation support
- Dark mode compatible

---

## Data Structures

### Skills
```javascript
resumeData.skills = [
  {
    category: "Programming Languages",
    items: ["JavaScript", "Python", "Java"]
  },
  {
    category: "Frameworks",
    items: ["React", "Node.js", "Express"]
  }
]
```

### Achievements
```javascript
resumeData.achievements = [
  "Increased sales by 30% through CRM implementation",
  "Led team of 5 developers to successful product launch",
  "Awarded Employee of the Year for exceptional performance"
]
```

### Custom Sections
```javascript
resumeData.customSections = [
  {
    id: "1234567890",
    title: "Publications",
    items: [
      "Published 5 papers in top AI journals",
      "Co-authored ML textbook"
    ]
  },
  {
    id: "0987654321",
    title: "Languages",
    items: [
      "English - Fluent",
      "Spanish - Conversational"
    ]
  }
]
```

---

## Performance Metrics

### AI Processing Times
- Skills Categorization: ~2-3 seconds
- Achievements Formatting: ~2-3 seconds
- Custom Section Processing: ~2-3 seconds

### Token Usage (Approximate)
- Skills: 150-300 tokens per request
- Achievements: 200-400 tokens per request
- Custom Sections: 200-400 tokens per request

### Cost Efficiency
Google Gemini 2.5 Flash is extremely cost-effective:
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- Average cost per request: < $0.001

---

## Testing Checklist

### Skills AI Feature
- [ ] Enter comma-separated skills
- [ ] Click "Categorize Skills with AI"
- [ ] Verify categories are logical
- [ ] Edit categories and items
- [ ] Test with 5+ skills
- [ ] Test with mixed technical/soft skills
- [ ] Test error handling (empty input)

### Achievements AI Feature
- [ ] Enter paragraph achievements
- [ ] Click "Format Achievements with AI"
- [ ] Verify bullet points start with action verbs
- [ ] Verify metrics are included
- [ ] Edit formatted achievements
- [ ] Add manual achievements
- [ ] Remove achievements
- [ ] Test error handling (empty input)

### Custom Sections Feature
- [ ] Add custom section
- [ ] Enter section title
- [ ] Enter paragraph content
- [ ] Click "Format with AI"
- [ ] Verify context-aware formatting
- [ ] Test multiple sections (Publications, Languages, etc.)
- [ ] Collapse/expand sections
- [ ] Remove sections
- [ ] Verify rendering in all 4 templates
- [ ] Test error handling (empty title/content)

### Template Rendering
- [ ] Classic Template: Custom sections render correctly
- [ ] Modern Template: Custom sections render correctly
- [ ] Minimal Template: Custom sections render correctly
- [ ] Professional Template: Custom sections render correctly
- [ ] Verify bullet points
- [ ] Verify section titles
- [ ] Verify styling consistency

---

## Future Enhancements

### Potential Features
1. **AI-Powered Summary Generation**: Generate professional summary from experience
2. **Job Description Matching**: AI suggests skills/achievements based on job description
3. **Grammar & Tone Check**: AI proofreads and improves writing
4. **Achievement Quantification**: AI suggests metrics and numbers
5. **Keyword Optimization**: AI optimizes for ATS keywords
6. **Language Translation**: Translate resume to multiple languages
7. **Industry-Specific Formatting**: Adapt format based on industry

### Performance Improvements
1. **Caching**: Cache common skill categories
2. **Batch Processing**: Process multiple sections at once
3. **Progressive Loading**: Show partial results as they arrive
4. **Offline Mode**: Store frequently used categories locally

---

## Troubleshooting

### Common Issues

**Issue**: AI button doesn't respond
- **Solution**: Check console for errors, verify backend is running on port 5000

**Issue**: Error "Failed to process content"
- **Solution**: Check API key in `.env`, ensure Gemini API is accessible

**Issue**: Custom sections not rendering in templates
- **Solution**: Verify `resumeData.customSections` is properly structured

**Issue**: Skills not categorizing correctly
- **Solution**: Ensure skills are comma-separated, try rephrasing skill names

**Issue**: Achievements formatting is generic
- **Solution**: Provide more detailed input with metrics and context

---

## API Reference

### Categorize Skills

**Endpoint**: `POST /api/resume/categorize-skills`

**Request Body**:
```json
{
  "skills": "React, Node.js, MongoDB, AWS, Leadership"
}
```

**Response**:
```json
{
  "categories": [
    {"category": "Frontend", "items": ["React"]},
    {"category": "Backend", "items": ["Node.js"]},
    {"category": "Databases", "items": ["MongoDB"]},
    {"category": "Cloud", "items": ["AWS"]},
    {"category": "Soft Skills", "items": ["Leadership"]}
  ]
}
```

### Segregate Achievements

**Endpoint**: `POST /api/resume/segregate-achievements`

**Request Body**:
```json
{
  "achievements": "Increased sales by 30%. Led team of 5 developers."
}
```

**Response**:
```json
{
  "achievements": [
    "Increased sales by 30% through strategic initiatives",
    "Led cross-functional team of 5 developers to successful delivery"
  ]
}
```

### Process Custom Section

**Endpoint**: `POST /api/resume/process-custom-section`

**Request Body**:
```json
{
  "content": "Fluent in English and Spanish. Learning French.",
  "sectionTitle": "Languages"
}
```

**Response**:
```json
{
  "content": [
    "English - Fluent",
    "Spanish - Fluent",
    "French - Basic/Learning"
  ]
}
```

---

## Deployment Notes

### Environment Variables Required
```
GEMINI_API_KEY=your_api_key_here
```

### Dependencies
- `@google/generative-ai`: ^0.21.0

### Database Schema Updates
No database changes required. All data stored in existing `resumeData` JSON structure.

---

## Support & Maintenance

### Monitoring
- Monitor API response times
- Track error rates
- Monitor token usage and costs

### Maintenance
- Update AI prompts based on user feedback
- Refine categorization logic
- Add new section types as needed
- Keep Gemini SDK updated

---

## License & Credits

**AI Model**: Google Gemini 2.5 Flash
**Developer**: SmartNShine Team
**Last Updated**: January 2025
**Version**: 1.0.0

---

## Contact & Feedback

For issues, suggestions, or contributions, please contact the development team or submit a GitHub issue.

---

**End of Documentation**
