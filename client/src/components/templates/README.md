# Resume Templates

This directory contains all resume template components for the ATS Resume Generator. Each template is a React component that renders a complete resume layout optimized for both visual appeal and ATS (Applicant Tracking System) compatibility.

## 📋 Table of Contents
- [Available Templates](#available-templates)
- [Template Architecture](#template-architecture)
- [Usage](#usage)
- [Creating New Templates](#creating-new-templates)
- [Best Practices](#best-practices)
- [ATS Optimization](#ats-optimization)

## 🎨 Available Templates

### Classic & Professional
- **ClassicTemplate** - Traditional single-column layout with multiple color themes
- **ProfessionalTemplate** - Corporate-style with icon accents
- **ProfessionalV2Template** - Enhanced professional with improved spacing
- **Professional2Template** - Premium ATS-optimized (95%+ compatibility)

### Modern & Minimal
- **ModernTemplate** - Contemporary with bold design elements
- **MinimalTemplate** - Ultra-clean with excellent whitespace
- **TechTemplate** - Technology-focused for developers and engineers

### Creative
- **Creative2Template** - Vibrant, visually appealing (94% ATS compatibility)

### Executive & Leadership
- **ExecutiveTemplate** - Premium format for C-suite positions
- **CorporateEliteTemplate** - Fortune 500-ready (99% ATS compatibility)
- **StrategicLeaderTemplate** - Leadership-focused (97% ATS compatibility)
- **ImpactProTemplate** - Results-driven with metrics focus (98% ATS compatibility)

### Specialized
- **AcademicTemplate** - Academic and research positions
- **GitHubStyleTemplate** - Developer-focused, GitHub-inspired design

## 🏗️ Template Architecture

### Common Features

All templates implement the following features:

```javascript
import {forwardRef} from "react";

const TemplateName = forwardRef(({resumeData, onPageUsageChange}, ref) => {
  // 1. Page overflow detection
  // 2. Color theme system
  // 3. Section ordering
  // 4. Responsive design
  // 5. PDF generation support
  
  return (
    <div ref={ref}>
      {/* Template JSX */}
    </div>
  );
});

export default TemplateName;
```

### Props Interface

```javascript
{
  resumeData: {
    // Required
    name: string,
    contact: {
      email: string,
      phone?: string,
      location?: string,
      linkedin?: string,
      github?: string,
      website?: string
    },
    
    // Optional sections
    summary?: string,
    experience?: Array<{
      title: string,
      company: string,
      location?: string,
      startDate: string,
      endDate?: string,
      bullets?: string[]
    }>,
    education?: Array<{
      degree: string,
      institution: string,
      graduationDate: string,
      gpa?: string
    }>,
    skills?: Array<{
      category: string,
      items: string[]
    }>,
    projects?: Array<{
      name: string,
      bullets?: string[],
      technologies?: string
    }>,
    certifications?: Array<{
      name: string,
      issuer?: string,
      date?: string
    }>,
    achievements?: string[],
    customSections?: Array<{
      title: string,
      content: string
    }>,
    
    // Template options
    selectedTheme?: string,
    sectionOrder?: string[]
  },
  
  onPageUsageChange?: (pageInfo) => void,
  ref: React.Ref // For PDF generation
}
```

### Page Overflow Detection

All templates implement page overflow detection:

```javascript
const [pageOverflowInfo, setPageOverflowInfo] = useState({
  isOverflowing: false,
  currentHeight: 0,
  maxHeight: 1056, // A4 page at 96 DPI
  overflowPercentage: 0,
  templateName: "TemplateName"
});

useEffect(() => {
  if (containerRef.current) {
    const currentHeight = containerRef.current.scrollHeight;
    const isOverflowing = currentHeight > 1056;
    
    const usageInfo = {
      isOverflowing,
      currentHeight,
      maxHeight: 1056,
      overflowPercentage: // calculated
    };
    
    if (onPageUsageChange) {
      onPageUsageChange(usageInfo);
    }
  }
}, [resumeData]);
```

### Color Theme System

Most templates support multiple color themes:

```javascript
const colorThemes = {
  navy: {
    primary: "#003d82",
    secondary: "#0066cc",
    text: "#000000",
    // ... more colors
  },
  burgundy: { /* ... */ },
  forest: { /* ... */ },
  // ... more themes
};

const theme = colorThemes[resumeData.selectedTheme || 'navy'];
```

## 💡 Usage

### Basic Usage

```javascript
import {useRef} from 'react';
import ClassicTemplate from '@/components/templates/ClassicTemplate';

function ResumeEditor() {
  const templateRef = useRef(null);
  
  const resumeData = {
    name: "John Doe",
    contact: {
      email: "john@example.com",
      phone: "+1-555-0100"
    },
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Corp",
        startDate: "01/2020",
        endDate: "Present",
        bullets: ["Led team of 5", "Increased performance by 40%"]
      }
    ]
  };
  
  return (
    <ClassicTemplate 
      ref={templateRef}
      resumeData={resumeData}
      onPageUsageChange={(info) => console.log(info)}
    />
  );
}
```

### With PDF Generation

```javascript
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

async function downloadPDF() {
  const element = templateRef.current;
  
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('resume.pdf');
}
```

### With Page Overflow Warning

```javascript
const [pageWarning, setPageWarning] = useState(null);

<ClassicTemplate
  ref={templateRef}
  resumeData={resumeData}
  onPageUsageChange={(info) => {
    if (info.isOverflowing) {
      setPageWarning(
        `Resume exceeds 1 page by ${info.overflowPercentage}%. ` +
        `Consider removing content.`
      );
    } else {
      setPageWarning(null);
    }
  }}
/>

{pageWarning && <Alert variant="warning">{pageWarning}</Alert>}
```

## 🔧 Creating New Templates

### Step 1: Create Template File

Create a new file in this directory:

```bash
touch NewTemplate.jsx
```

### Step 2: Template Boilerplate

```javascript
import {forwardRef, useRef, useEffect, useState} from "react";

/**
 * NewTemplate - Description of your template
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * 
 * @component
 * @param {Object} props.resumeData - Resume data
 * @param {Function} props.onPageUsageChange - Page overflow callback
 * @param {React.Ref} ref - Ref for PDF generation
 */
const NewTemplate = forwardRef(({resumeData, onPageUsageChange}, ref) => {
  const containerRef = useRef(null);
  const [pageOverflowInfo, setPageOverflowInfo] = useState({
    isOverflowing: false,
    currentHeight: 0,
    maxHeight: 1056,
    overflowPercentage: 0,
    templateName: "NewTemplate",
  });

  // Page overflow detection
  useEffect(() => {
    if (containerRef.current) {
      const currentHeight = containerRef.current.scrollHeight;
      const maxHeight = 1056;
      const isOverflowing = currentHeight > maxHeight;
      const overflowPercentage = isOverflowing
        ? Math.round(((currentHeight - maxHeight) / maxHeight) * 100)
        : 0;

      const usageInfo = {
        isOverflowing,
        currentHeight,
        maxHeight,
        overflowPercentage,
        percentage: Math.round((currentHeight / maxHeight) * 100),
        templateName: "NewTemplate",
      };

      setPageOverflowInfo(usageInfo);

      if (onPageUsageChange) {
        onPageUsageChange(usageInfo);
      }
    }
  }, [resumeData, onPageUsageChange]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "816px",
        minHeight: "1056px",
        backgroundColor: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header style={{textAlign: "center", marginBottom: "20px"}}>
        <h1 style={{fontSize: "32px", margin: 0}}>{resumeData.name}</h1>
        <div style={{fontSize: "12px", color: "#666"}}>
          {resumeData.contact.email}
        </div>
      </header>

      {/* Add more sections */}
    </div>
  );
});

NewTemplate.displayName = "NewTemplate";

export default NewTemplate;
```

### Step 3: Register Template

Add to `index.js`:

```javascript
export {default as NewTemplate} from "./NewTemplate";
```

Add to `Editor.jsx` template selector:

```javascript
const templates = {
  // ... existing templates
  newtemplate: NewTemplate,
};
```

### Step 4: Add Preview Image

1. Generate a preview screenshot (1920x1080)
2. Save to `/client/public/templates/newtemplate-preview.png`
3. Update template selector UI

## ✅ Best Practices

### ATS Optimization
1. **Use semantic HTML** - Headers (`<h1>`, `<h2>`, etc.)
2. **Single column preferred** - Multi-column can confuse ATS
3. **Standard fonts** - Arial, Calibri, Georgia, Times
4. **No text in images** - ATS can't read image text
5. **Simple formatting** - Avoid complex layouts
6. **Consistent spacing** - Use standard margins
7. **Clear section headers** - EXPERIENCE, EDUCATION, SKILLS

### Performance
1. **Memoize expensive calculations** - Use `useMemo`
2. **Avoid unnecessary re-renders** - Use `React.memo` if needed
3. **Optimize images** - Compress any icons/logos
4. **Lazy load if possible** - Use dynamic imports

### Accessibility
1. **Semantic HTML** - Use proper heading hierarchy
2. **Color contrast** - WCAG AA minimum (4.5:1)
3. **Font size** - Minimum 10pt for body text
4. **Alt text** - If using images

### Code Quality
1. **JSDoc comments** - Document component and props
2. **PropTypes or TypeScript** - Define prop types
3. **Consistent naming** - Follow existing patterns
4. **Error handling** - Handle missing/invalid data gracefully

## 🎯 ATS Optimization Guidelines

### ATS Compatibility Scores

- **99%+**: CorporateEliteTemplate
- **97-98%**: StrategicLeaderTemplate, ImpactProTemplate
- **95%+**: Professional2Template, ClassicTemplate
- **94%+**: Creative2Template, ModernTemplate
- **90%+**: All other templates

### What Makes a Template ATS-Friendly?

✅ **DO:**
- Single-column layout
- Standard section headers
- Simple bullet points (•, -, *)
- Plain text formatting
- Standard fonts (Arial, Calibri, etc.)
- Consistent spacing
- Clear visual hierarchy
- Left-aligned text

❌ **DON'T:**
- Text in images or graphics
- Complex multi-column layouts
- Unusual fonts
- Headers/footers with critical info
- Text boxes or shapes
- Heavy use of colors/graphics
- Tables (unless simple)
- Special characters for bullets

### Testing ATS Compatibility

1. **Copy-paste test**: Copy text from PDF - should maintain structure
2. **Text-only test**: Convert to plain text - should be readable
3. **Screen reader test**: Use screen reader - should make sense
4. **Upload to ATS**: Test with actual ATS platforms

## 📊 Template Comparison

| Template | ATS Score | Best For | Color Themes | Special Features |
|----------|-----------|----------|--------------|------------------|
| ClassicTemplate | 95% | General use | 5 themes | Two-column skills |
| Professional2Template | 95% | Corporate | 6 themes | Dynamic density |
| CorporateEliteTemplate | 99% | Executive | Navy only | Fortune 500 ready |
| ModernTemplate | 94% | Tech | 5 themes | Bold design |
| CreativeTemplate | 94% | Design/Creative | 6 themes | Vibrant colors |
| AcademicTemplate | 92% | Research/Academia | Traditional | Publications section |
| TechTemplate | 93% | Developers | 6 themes | Code-like aesthetic |

## 🚀 Future Enhancements

- [ ] Add more color theme options
- [ ] Implement dark mode templates
- [ ] Add template customization UI
- [ ] Create template preview gallery
- [ ] Add template recommendations based on job role
- [ ] Implement A/B testing for template effectiveness
- [ ] Add multilingual support
- [ ] Create industry-specific templates

## 📚 Related Documentation

- [Main README](../../../../README.md) - Project overview
- [Components README](../README.md) - General components
- [Template Design Guide](../../../../docs/RESUME_TEMPLATE_DESIGN_GUIDE.md) - Design guidelines
- [ATS Optimization](../../../../docs/README.md) - ATS best practices

## 🤝 Contributing

When adding or modifying templates:

1. Follow the template boilerplate structure
2. Add comprehensive JSDoc documentation
3. Test with sample resume data
4. Verify ATS compatibility
5. Add preview screenshot
6. Update this README
7. Update template comparison table
8. Test PDF generation
9. Submit PR with template showcase

---

**Need help?** Check the [project documentation](../../../../docs/) or open an issue on GitHub.
