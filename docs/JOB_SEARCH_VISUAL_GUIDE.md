# Job Search Feature - Visual Guide 🎨

## 📸 What It Looks Like

### Main Search Interface

```
┌─────────────────────────────────────────────────────────────┐
│                    💼 Job Search Demo                       │
│    Search thousands of job listings powered by Adzuna API  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔍 Job Title or Keywords                     📍 Country    │
│  [Software Developer____________]    [United States ▼]     │
│                                                             │
│         [🔍 Search Jobs]                                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐
│ 📈 Total Jobs Found      │  │ 💰 Average Salary        │
│    125,432               │  │    $95,000               │
└──────────────────────────┘  └──────────────────────────┘
```

### Job Listing Card

```
┌─────────────────────────────────────────────────────────────┐
│  Senior Software Engineer                    💰 $120k - $160k│
│  🏢 Tech Corp Inc.                                           │
│  📍 San Francisco, CA                         📅 2 days ago  │
│                                                              │
│  Build scalable web applications using React, Node.js...    │
│                                                              │
│  [IT Jobs] [Full-time] [Permanent]           [Apply Now →] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Frontend Developer                          💰 $80k - $110k │
│  🏢 StartupXYZ                                               │
│  📍 New York, NY                              📅 Yesterday   │
│                                                              │
│  Join our team to create amazing user experiences with...   │
│                                                              │
│  [Web Development] [Full-time] [Contract]    [Apply Now →] │
└─────────────────────────────────────────────────────────────┘
```

### API Setup Notice (When Not Configured)

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️  API Credentials Required                               │
│                                                              │
│  To use this feature, you need to:                          │
│  1. Sign up at https://developer.adzuna.com/               │
│  2. Get your App ID and App Key                            │
│  3. Add them to your .env file:                            │
│                                                              │
│     VITE_ADZUNA_APP_ID=your_app_id                         │
│     VITE_ADZUNA_APP_KEY=your_app_key                       │
│                                                              │
│  4. Restart your development server                        │
└─────────────────────────────────────────────────────────────┘
```

### Pagination Controls

```
                [← Previous]  Page 2  [Next →]
```

### Loading State

```
               ⟳ Searching for jobs...
```

### Empty State

```
                    💼
              No jobs found
     Try adjusting your search terms or location
```

## 🎨 Color Scheme

### Light Mode
- **Background**: Gradient from blue-50 → white → purple-50
- **Cards**: White with shadow
- **Primary Button**: Blue-to-purple gradient
- **Text**: Gray-900 for headings, Gray-600 for body
- **Success**: Green (#10b981)
- **Tags**: Colored backgrounds (blue, purple, green)

### Dark Mode
- **Background**: Gradient from gray-900 → gray-800 → gray-900
- **Cards**: Gray-800 with subtle shadow
- **Primary Button**: Same blue-to-purple gradient
- **Text**: White for headings, Gray-400 for body
- **Success**: Green (#10b981)
- **Tags**: Dark colored backgrounds with opacity

## 📱 Responsive Design

### Desktop (> 768px)
```
┌─────────────────────────────────────────────┐
│  Header (centered)                          │
├─────────────────────────────────────────────┤
│  [Search Input (66%)]  [Country (33%)]     │
│           [Search Button]                   │
├────────────────┬────────────────────────────┤
│  Stats Card 1  │  Stats Card 2             │
├────────────────┴────────────────────────────┤
│  Job Card (full width)                      │
│  Job Card (full width)                      │
│  Job Card (full width)                      │
└─────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│  Header          │
├──────────────────┤
│  [Search Input]  │
│  [Country]       │
│  [Search Button] │
├──────────────────┤
│  Stats Card 1    │
│  Stats Card 2    │
├──────────────────┤
│  Job Card        │
│  Job Card        │
│  Job Card        │
└──────────────────┘
```

## 🔔 Toast Notifications

### Success Toast (Green)
```
┌──────────────────────────────┐
│  ✨ Found 1,234 jobs!        │
└──────────────────────────────┘
```

### Error Toast (Red)
```
┌──────────────────────────────────────────┐
│  ❌ Failed to fetch jobs. Check API...  │
└──────────────────────────────────────────┘
```

### Info Toast (Blue)
```
┌──────────────────────────────────────────┐
│  🔍 No jobs found. Try different...     │
└──────────────────────────────────────────┘
```

### Warning Toast (Orange)
```
┌──────────────────────────────────────────┐
│  ⚠️ Please enter a job title...         │
└──────────────────────────────────────────┘
```

## 🖱️ Interactive Elements

### Buttons
- **Primary (Search)**: 
  - Gradient blue → purple
  - Hover: Darker gradient
  - Disabled: 50% opacity
  - Icon + Text

- **Secondary (Apply Now)**:
  - Gradient blue → purple
  - Hover: Darker gradient
  - Opens in new tab
  - External link icon

- **Pagination**:
  - White/Gray-800 background
  - Border on all sides
  - Hover: Light gray/Gray-700
  - Disabled: 50% opacity

### Form Inputs
- **Text Input**:
  - Border: Gray-300 / Gray-600 (dark)
  - Focus: Blue ring (2px)
  - Padding: 16px
  - Rounded corners

- **Select Dropdown**:
  - Same styling as text input
  - 17 country options
  - Chevron down indicator

### Tags/Badges
- **Category Tags**: Blue background
- **Contract Type**: Purple background
- **Contract Time**: Green background
- Rounded pill shape
- Small text (xs)
- Padding: 8px horizontal, 4px vertical

## 🎯 Icon Usage

| Element | Icon | Color |
|---------|------|-------|
| Job Search (Header) | 💼 Briefcase | Blue-600 |
| Search Input | 🔍 Search | Gray |
| Location | 📍 MapPin | Gray |
| Company | 🏢 Building2 | Gray |
| Salary | 💰 DollarSign | Green-600 |
| Date | 📅 Calendar | Gray-500 |
| External Link | → ExternalLink | White |
| Loading | ⟳ Loader2 (spinning) | Blue-600 |
| Empty State | 💼 Briefcase | Gray-400 |
| Total Jobs | 📈 TrendingUp | Blue-600 |
| Average Salary | 💰 DollarSign | Green-600 |
| Alert | ⚠️ AlertCircle | Yellow-400 |

## 📐 Spacing & Layout

### Container
- Max width: 5xl (1024px)
- Centered horizontally
- Padding: 16px (mobile), 32px (desktop)

### Cards
- Padding: 24px
- Border radius: 16px (2xl)
- Shadow: Medium (md)
- Hover: Large shadow (xl)

### Gaps
- Card grid: 16px gap
- Form fields: 16px gap
- Tags: 8px gap
- Icon-to-text: 8px margin

## 🌈 Tag Colors

### Light Mode
```
IT Jobs:       bg-blue-100    text-blue-700
Full-time:     bg-purple-100  text-purple-700
Permanent:     bg-green-100   text-green-700
Marketing:     bg-pink-100    text-pink-700
Remote:        bg-indigo-100  text-indigo-700
```

### Dark Mode
```
IT Jobs:       bg-blue-900/30    text-blue-300
Full-time:     bg-purple-900/30  text-purple-300
Permanent:     bg-green-900/30   text-green-300
Marketing:     bg-pink-900/30    text-pink-300
Remote:        bg-indigo-900/30  text-indigo-300
```

## 🎬 Animations

### Loading Spinner
- Rotation: 360deg infinite
- Duration: 1s
- Easing: Linear

### Button Hover
- Transition: all 200ms
- Scale: 1.02 (subtle)
- Shadow: Larger

### Card Hover
- Transition: shadow 200ms
- Shadow: md → xl

### Toast Entry
- Slide in from top-right
- Fade in
- Duration: 300ms

### Toast Exit
- Fade out
- Slide up
- Duration: 200ms

## 📱 Mobile Optimizations

### Touch Targets
- Minimum 44px height for all buttons
- Larger padding on mobile inputs
- Bigger hit areas for links

### Text Sizes
- Headers: Smaller on mobile (3xl → 2xl)
- Body: Remains readable (base)
- Tags: Slightly smaller (xs)

### Layout Changes
- Stack search fields vertically
- Stack stats cards vertically
- Job card content wraps
- Salary and apply button stack

## ♿ Accessibility Features

- ✅ Semantic HTML (form, button, article)
- ✅ ARIA labels on interactive elements
- ✅ Focus indicators (blue ring)
- ✅ Color contrast (WCAG AA compliant)
- ✅ Keyboard navigation support
- ✅ Screen reader friendly labels
- ✅ Loading state announcements

## 🎨 Design Principles Used

1. **Consistency**: Matches existing app design
2. **Clarity**: Clear information hierarchy
3. **Feedback**: Toast notifications for actions
4. **Responsiveness**: Works on all screen sizes
5. **Accessibility**: Inclusive design patterns
6. **Performance**: Fast loading, smooth animations
7. **Professional**: Clean, modern aesthetic

---

**Total UI Elements**: 15+  
**Color Variations**: 10+ (light/dark)  
**Responsive Breakpoint**: 768px  
**Animation Duration**: 200-300ms  
**Accessibility Score**: AA compliant
