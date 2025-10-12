# Quick Start Guide: AI Skills Categorization

## How to Use

### Step 1: Navigate to Skills Section
Open your resume editor and scroll to the **Skills** section (or click on it from the section list).

### Step 2: Enter Your Skills
Type or paste all your skills into the large text area. You can format them as:

**Option A - Comma Separated:**
```
JavaScript, React, Node.js, Python, Django, MongoDB, Docker, AWS
```

**Option B - Line Separated:**
```
JavaScript
React
Node.js
Python
Django
```

**Option C - Mixed:**
```
JavaScript, React, Node.js
Python, Django
MongoDB, Docker
```

### Step 3: Click the AI Button
Click the **"🤖 Categorize Skills with AI"** button.

The button will show a loading spinner: ⏳ **"Categorizing with AI..."**

### Step 4: Review Results
After 1-3 seconds, your skills will appear organized in categories:

```
📊 Categorized Skills (4 categories)

┌─────────────────────────────────────┐
│ Programming Languages                │
│ JavaScript, Python                   │
│ [Edit]                        [✕]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Frameworks & Libraries               │
│ React, Node.js, Django               │
│ [Edit]                        [✕]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Databases                            │
│ MongoDB                              │
│ [Edit]                        [✕]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Cloud & DevOps                       │
│ Docker, AWS                          │
│ [Edit]                        [✕]    │
└─────────────────────────────────────┘
```

### Step 5: Fine-tune (Optional)
- Click on any category name to edit it
- Click on skills to add/remove items
- Click **✕** to delete a category
- Your changes are saved automatically

---

## Tips & Tricks

### 💡 Best Practices
1. **List Everything**: Don't worry about categories - just list all skills
2. **Use Common Names**: Write "React" not "React.js" (AI will normalize anyway)
3. **Include Soft Skills**: AI recognizes soft skills like "Leadership", "Communication"
4. **Be Specific**: "Python Django" is better than just "Web Development"

### 🚀 Pro Tips
- **Copy from LinkedIn**: Paste your LinkedIn skills directly
- **No Duplicates Needed**: AI automatically removes duplicates
- **Mixed Formats OK**: Commas, newlines, or both work fine
- **Case Doesn't Matter**: "javascript", "JavaScript", "JAVASCRIPT" all work

### ⚠️ Common Issues

**Button is Disabled?**
- Make sure you've entered some skills
- Check that the text field is not empty

**Error Message Appears?**
- Check your internet connection
- Try refreshing the page
- Ensure you have a valid Gemini API key (backend)

**Categories Don't Make Sense?**
- Click to edit category names manually
- Drag skills between categories
- Remove and re-categorize if needed

---

## Example Skill Lists

### Software Developer
```
JavaScript, TypeScript, React, Vue.js, Node.js, Express, Python, 
Django, Flask, Java, Spring Boot, SQL, PostgreSQL, MongoDB, Redis, 
Docker, Kubernetes, AWS, Git, CI/CD, Agile, Problem Solving, 
Team Collaboration
```

**Result:** ~7-8 categories including Programming Languages, Frameworks, Databases, DevOps, etc.

### Data Scientist
```
Python, R, SQL, Pandas, NumPy, Scikit-learn, TensorFlow, PyTorch, 
Tableau, Power BI, Excel, Statistics, Machine Learning, Deep Learning, 
Data Visualization, Communication, Critical Thinking
```

**Result:** ~5-6 categories including Programming, Libraries, Tools, Techniques, Soft Skills

### Full Stack Developer
```
HTML, CSS, JavaScript, React, Angular, Node.js, Express, MongoDB, 
MySQL, REST APIs, GraphQL, Git, GitHub, Docker, AWS, Responsive Design, 
Testing, Jest, Cypress, Agile, Scrum
```

**Result:** ~8-9 categories including Frontend, Backend, Databases, Testing, DevOps, etc.

### DevOps Engineer
```
Linux, Bash, Python, Docker, Kubernetes, Jenkins, GitLab CI, 
Terraform, Ansible, AWS, Azure, Monitoring, Prometheus, Grafana, 
ELK Stack, Networking, Security, Automation, Shell Scripting
```

**Result:** ~6-7 categories including Languages, Containerization, CI/CD, Cloud, Monitoring, etc.

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Focus text area | Click or Tab |
| Categorize | Enter (when button focused) |
| Edit category | Click + Type |
| Remove category | Click ✕ |

---

## Before vs After

### Before (Old System):
1. Click "+ Add Category"
2. Type "Programming Languages"
3. Type each skill: "JavaScript, Python"
4. Click "+ Add Category"
5. Type "Frameworks"
6. Type skills again...
7. Repeat 10+ times ⏰ **5-10 minutes**

### After (New AI System):
1. Paste all skills in one box
2. Click AI button
3. Done! ⏱️ **10 seconds**

---

## FAQ

**Q: Can I use this without an API key?**
A: No, the backend needs a Gemini API key. Ask your admin to set it up.

**Q: How much does it cost?**
A: Very little! Gemini Flash model costs ~$0.0001 per categorization.

**Q: Can I categorize skills multiple times?**
A: Yes! Feel free to add more skills and re-categorize anytime.

**Q: Will it overwrite my existing categories?**
A: Yes, clicking the AI button replaces all categories. Copy your data first if needed.

**Q: What if AI creates wrong categories?**
A: You can manually edit any category name or move skills around.

**Q: Does it work offline?**
A: No, it requires an internet connection to call the AI API.

**Q: Can I undo categorization?**
A: Not yet, but you can manually edit or re-categorize with different input.

**Q: Is my data private?**
A: Skills are sent to Google's Gemini API for processing. Check Google's privacy policy.

---

## Mobile Usage

The feature works on mobile devices:
- Textarea is touch-friendly
- Button is large and easy to tap
- Results scroll smoothly
- Edit mode works with touch
- Responsive design adapts to screen size

---

## Troubleshooting

### Button Stuck on "Loading"?
1. Check browser console for errors
2. Verify backend server is running
3. Check network tab for failed requests
4. Ensure Gemini API key is set

### Skills Not Saving?
1. Make sure to click outside the input after editing
2. Check if resume auto-save is working
3. Try manually saving the resume
4. Refresh and check if data persists

### Categories Look Weird?
1. AI sometimes creates unexpected categories
2. Manually rename categories as needed
3. Merge similar categories by editing
4. Try re-categorizing with clearer skill names

---

## Need Help?

Contact your system administrator or check:
- Backend logs for API errors
- Browser console for frontend errors
- Network tab for failed requests
- Gemini API status page

---

## Feature Demo

**Live Demo Video:** Coming soon!

**Screenshots:** See `.azure/screenshots/` folder

**Tutorial:** Check documentation at `.azure/AI_SKILLS_CATEGORIZATION.md`
