# Visual Guide - What Changed

## 🎯 New "Target Job Role" Section

### Location in Editor
```
┌─────────────────────────────────────────┐
│  📊 ATS Score                           │
├─────────────────────────────────────────┤
│  🎯 Job-Specific Score                  │
├─────────────────────────────────────────┤
│  🎯 Target Job Role          ← NEW!     │
│  ┌───────────────────────────────────┐  │
│  │ What job role are you targeting?  │  │
│  │ [Select Job Role Dropdown ▼]      │  │
│  │ Your resume will be scored        │  │
│  │ against this job role             │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  👤 Personal Information                │
├─────────────────────────────────────────┤
│  📝 Professional Summary                │
└─────────────────────────────────────────┘
```

## 📋 Dropdown Categories (Organized)

The dropdown shows jobs organized by category:

```
┌─────────────────────────────────────┐
│ Engineering                          │
│   ├─ Software Engineer              │
│   ├─ Frontend Developer             │
│   ├─ React Developer                │
│   ├─ Angular Developer              │
│   ├─ Vue.js Developer               │
│   ├─ Backend Developer              │
│   ├─ MEAN Stack Developer           │
│   ├─ Node.js Backend Developer      │
│   ├─ Python Backend Developer       │
│   ├─ Java Backend Developer         │
│   ├─ .NET Backend Developer         │
│   ├─ PHP Backend Developer          │
│   ├─ Ruby Backend Developer         │
│   ├─ Go Backend Developer           │
│   ├─ Full Stack Developer           │
│   ├─ MERN Stack Developer     ← ONLY ONE!
│   ├─ Python Full Stack Developer    │
│   ├─ Java Full Stack Developer      │
│   ├─ LAMP Stack Developer           │
│   ├─ .NET Full Stack Developer      │
│   ├─ Mobile Developer               │
│   ├─ React Native Developer         │
│   ├─ Flutter Developer              │
│   ├─ iOS Developer                  │
│   ├─ Android Developer              │
│   ├─ DevOps Engineer                │
│   └─ Cloud Architect                │
│                                      │
│ Data & Analytics                     │
│   ├─ Data Scientist                 │
│   └─ Machine Learning Engineer      │
│                                      │
│ Product & Business                   │
│   └─ Product Manager                │
│                                      │
│ Design                               │
│   └─ UI/UX Designer                 │
│                                      │
│ Security                             │
│   └─ Security Engineer              │
└─────────────────────────────────────┘
```

## 🔄 How Auto-Scoring Works

### User Flow:
```
1. User selects "MERN Stack Developer"
   ↓
2. Editor updates resumeData.targetJobRole
   ↓
3. JobSpecificScoreCard detects change (useEffect)
   ↓
4. calculateJobSpecificScore() runs automatically
   ↓
5. Score updates in real-time
   ↓
6. Recommendations refresh
   ↓
7. Missing skills list updates
```

## 📊 Score Calculation Based on Target Role

Example for **MERN Stack Developer**:

```
Required Skills:
├─ Programming: JavaScript, TypeScript
├─ Stack: MongoDB, Express.js, React, Node.js
├─ State: Redux, Redux Toolkit
├─ Database: MongoDB, Redis
├─ Tools: Git, Docker, npm, Webpack
└─ Concepts: REST API, JWT, State Management

Scoring Weights:
├─ Technical Skills:  40%
├─ Experience:        30%
├─ Projects:          20%
└─ Education:         10%

Your Resume Match: 78/100 ⭐
├─ Technical:    85/100 (34/40 pts)
├─ Experience:   70/100 (21/30 pts)
├─ Projects:     80/100 (16/20 pts)
└─ Education:    90/100 (9/10 pts)
```

## 🎨 Dark Mode Support

Both light and dark modes are fully supported:

**Light Mode:**
```
┌────────────────────────────────┐
│ 🎯 Target Job Role            │ ← White background
│ ┌────────────────────────────┐ │
│ │ What job role are you      │ │ ← Gray text
│ │ targeting?                 │ │
│ │ [MERN Stack Developer ▼]   │ │ ← White input
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

**Dark Mode:**
```
┌────────────────────────────────┐
│ 🎯 Target Job Role            │ ← Dark gray background
│ ┌────────────────────────────┐ │
│ │ What job role are you      │ │ ← Light gray text
│ │ targeting?                 │ │
│ │ [MERN Stack Developer ▼]   │ │ ← Dark gray input
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

## ✅ Benefits

1. **Clear Intent**: Users explicitly state their target role
2. **Auto-Scoring**: No manual recalculation needed
3. **Persistent**: Saves with resume data
4. **Synchronized**: All sections use the same target role
5. **No Duplicates**: Only one MERN Stack option
6. **Easy to Change**: Single dropdown to update
7. **Organized**: Jobs grouped by category
8. **Professional**: Clean, intuitive interface
