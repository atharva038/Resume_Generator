# 🚀 Quick Start: Using the Modular Template System

## What We've Built So Far

### ✅ Complete Foundation (Session 1)

1. **Organized File Structure** 
   - Clean separation of components, themes, and utilities
   - Easy to navigate and extend

2. **5 Professional Themes**
   - Professional (Corporate Blue)
   - Creative (Purple/Pink)
   - Minimal (Black & White)
   - Tech (Cyan/Teal)
   - Executive (Dark Slate)

3. **Comprehensive Utilities**
   - 13 formatting helpers
   - 9 responsive hooks and helpers
   - Print-ready styles

4. **First Component: HeaderModern**
   - Gradient background
   - Contact info with icons
   - Social media links
   - Fully responsive

---

## How to Use What We've Built

### 1. Import a Theme

```jsx
import { techTheme } from './components/templates/themes';

// Use in your component
<div style={{ fontFamily: techTheme.fonts.body }}>
  <h1 style={{ color: techTheme.colors.primary }}>
    Hello World
  </h1>
</div>
```

### 2. Use HeaderModern Component

```jsx
import HeaderModern from './components/templates/components/headers/HeaderModern';
import { professionalTheme } from './components/templates/themes';

function MyResume() {
  return (
    <HeaderModern
      name="John Doe"
      title="Senior Software Engineer"
      email="john@example.com"
      phone="555-123-4567"
      location="San Francisco, CA"
      linkedin="https://linkedin.com/in/johndoe"
      github="https://github.com/johndoe"
      portfolio="https://johndoe.com"
      theme={professionalTheme}
    />
  );
}
```

### 3. Use Helper Functions

```jsx
import { formatPhone, formatDateRange, formatSkills } from './components/templates/utils/templateHelpers';

// Format phone
const phone = formatPhone("5551234567"); // "(555) 123-4567"

// Format date range
const dates = formatDateRange("2020-01-01", "2023-12-31"); // "Jan 2020 - Dec 2023"

// Format skills
const skills = formatSkills(["React", "Node.js", "MongoDB"]); // "React • Node.js • MongoDB"
```

### 4. Use Responsive Hooks

```jsx
import { useIsMobile, useIsTablet } from './components/templates/utils/responsive';

function MyComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  return (
    <div className={isMobile ? "single-column" : "two-column"}>
      {/* Your content */}
    </div>
  );
}
```

---

## What's Next?

### Phase 2: Complete Header Components (Next Session)

We'll create 4 more header variants:

#### HeaderClassic
```jsx
<HeaderClassic
  name="Jane Smith"
  title="Marketing Director"
  email="jane@example.com"
  theme={professionalTheme}
/>
```
**Features**: Centered text, traditional styling, divider lines

#### HeaderMinimal
```jsx
<HeaderMinimal
  name="Alex Johnson"
  title="UX Designer"
  contact="alex@example.com | 555-0123"
  theme={minimalTheme}
/>
```
**Features**: Single line, ultra-clean, maximum space efficiency

#### HeaderSidebar
```jsx
<HeaderSidebar
  name="Maria Garcia"
  title="Data Scientist"
  photo="/path/to/photo.jpg"
  contact={{ email, phone, location }}
  theme={techTheme}
/>
```
**Features**: Vertical layout, photo support, sidebar positioning

#### HeaderCentered
```jsx
<HeaderCentered
  name="David Lee"
  title="Product Manager"
  tagline="Building products people love"
  contact={{ email, phone }}
  theme={executiveTheme}
/>
```
**Features**: Centered alignment, optional tagline, elegant dividers

---

## Building Your First Template

Once we have more components, here's how you'll build a template:

```jsx
import React, { forwardRef } from 'react';
import HeaderModern from './components/headers/HeaderModern';
import TwoColumn from './components/layouts/TwoColumn';
import ExperienceTimeline from './components/sections/experience/ExperienceTimeline';
import SkillsBar from './components/sections/skills/SkillsBar';
import { techTheme } from './themes';

const TechInnovatorTemplate = forwardRef(({ resumeData }, ref) => {
  return (
    <div ref={ref} style={{ fontFamily: techTheme.fonts.body }}>
      {/* Header */}
      <HeaderModern
        {...resumeData.personal}
        theme={techTheme}
      />
      
      {/* Two-column layout */}
      <TwoColumn theme={techTheme}>
        {/* Main content (left) */}
        <div>
          <ExperienceTimeline
            experiences={resumeData.experience}
            theme={techTheme}
          />
        </div>
        
        {/* Sidebar (right) */}
        <div>
          <SkillsBar
            skills={resumeData.skills}
            theme={techTheme}
          />
        </div>
      </TwoColumn>
    </div>
  );
});

export default TechInnovatorTemplate;
```

---

## Theme Customization

Want to customize a theme? Easy!

```jsx
import { techTheme } from './themes';

// Create a custom variant
const myCustomTheme = {
  ...techTheme,
  colors: {
    ...techTheme.colors,
    primary: '#FF6B6B', // Change primary color
    accent: '#4ECDC4',  // Change accent
  },
  fonts: {
    ...techTheme.fonts,
    heading: 'Montserrat, sans-serif', // Change heading font
  }
};

// Use it
<HeaderModern theme={myCustomTheme} {...props} />
```

---

## Testing Your Components

```jsx
// Test with sample data
const sampleData = {
  personal: {
    name: "John Doe",
    title: "Software Engineer",
    email: "john@example.com",
    phone: "555-123-4567",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Engineer",
      startDate: "2020-01-01",
      endDate: null,
      description: "Led team of 5 developers",
      achievements: [
        "Increased performance by 40%",
        "Reduced bugs by 60%"
      ]
    }
  ],
  skills: ["React", "Node.js", "MongoDB", "AWS"]
};

// Render
<HeaderModern {...sampleData.personal} theme={techTheme} />
```

---

## Pro Tips

### 1. Always Pass Theme
```jsx
// ✅ Good
<HeaderModern theme={techTheme} {...props} />

// ❌ Bad (component won't style correctly)
<HeaderModern {...props} />
```

### 2. Use Helper Functions
```jsx
// ✅ Good
const phone = formatPhone(resumeData.personal.phone);

// ❌ Bad (inconsistent formatting)
const phone = resumeData.personal.phone;
```

### 3. Check for Data
```jsx
// ✅ Good
{resumeData.experience && resumeData.experience.length > 0 && (
  <ExperienceSection data={resumeData.experience} />
)}

// ❌ Bad (will error if data missing)
<ExperienceSection data={resumeData.experience} />
```

### 4. Use Responsive Hooks
```jsx
// ✅ Good
const isMobile = useIsMobile();
return isMobile ? <MobileLayout /> : <DesktopLayout />;

// ❌ Bad (not responsive)
return <DesktopLayout />;
```

---

## Roadmap

### ✅ Session 1 (Complete)
- Folder structure
- Theme system
- Utilities
- HeaderModern

### 🎯 Session 2 (Next)
- 4 more header components
- Experience section components
- Skills section components

### 🎯 Session 3
- Layout components
- UI components
- First complete template

### 🎯 Session 4
- Build 3 more templates
- Theme customizer UI
- Documentation

### 🎯 Session 5
- Testing
- Optimization
- Polish

---

## Questions?

Common questions and answers:

**Q: Can I use multiple themes in one template?**
A: Yes! You can override theme props on individual components.

**Q: How do I add a new helper function?**
A: Add it to `utils/templateHelpers.js` and export it.

**Q: Can I create my own components?**
A: Absolutely! Follow the same pattern and place them in the appropriate folder.

**Q: How do I test print layout?**
A: Use browser's print preview (Ctrl/Cmd + P) or `window.print()`.

**Q: Are these ATS-friendly?**
A: Yes! We use semantic HTML and avoid complex layouts that ATS can't parse.

---

## Resources

- 📖 [Full Design Guide](./RESUME_TEMPLATE_DESIGN_GUIDE.md)
- 📊 [Implementation Progress](./TEMPLATE_IMPLEMENTATION_PROGRESS.md)
- 📁 [File Structure](./TEMPLATE_FILE_STRUCTURE.md)

---

**Ready to continue?** Let's build more components! 🚀
