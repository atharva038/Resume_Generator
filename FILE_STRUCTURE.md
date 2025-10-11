# Project File Structure

```
ATS_RESUME_GENERATOR/
│
├── 📄 README.md                      # Main documentation and setup guide
├── 📄 QUICK_START.md                 # Fast setup instructions
├── 📄 API_TESTING.md                 # Complete API reference with cURL
├── 📄 PROJECT_OVERVIEW.md            # Architecture and design details
├── 📄 ROADMAP.md                     # Feature checklist and future plans
├── 📄 CONTRIBUTING.md                # Contribution guidelines
├── 📄 PROJECT_COMPLETE.md            # Project completion summary
├── 📄 package.json                   # Root scripts (dev, install-all)
├── 📄 .gitignore                     # Git ignore rules
├── 🔧 setup.sh                       # Automated setup script
│
├── 📁 server/                        # Backend API (Node.js + Express)
│   ├── 📁 config/
│   │   └── multer.config.js          # File upload configuration
│   │
│   ├── 📁 controllers/
│   │   ├── auth.controller.js        # Register, login, getCurrentUser
│   │   └── resume.controller.js      # CRUD + upload + enhance
│   │
│   ├── 📁 middleware/
│   │   └── auth.middleware.js        # JWT token verification
│   │
│   ├── 📁 models/
│   │   ├── User.model.js             # User schema (email, password, name)
│   │   └── Resume.model.js           # Resume schema (all sections)
│   │
│   ├── 📁 routes/
│   │   ├── auth.routes.js            # /api/auth/* endpoints
│   │   └── resume.routes.js          # /api/resume/* endpoints
│   │
│   ├── 📁 services/
│   │   └── gemini.service.js         # Gemini AI integration (parse, enhance)
│   │
│   ├── 📁 utils/
│   │   └── fileExtractor.js          # PDF/DOCX text extraction
│   │
│   ├── 📁 uploads/                   # Temporary file storage
│   │   └── .gitkeep                  # Keep directory in git
│   │
│   ├── 📄 server.js                  # Express app entry point
│   ├── 📄 package.json               # Server dependencies
│   ├── 📄 .env.example               # Environment variable template
│   └── 📄 .gitignore                 # Server-specific ignores
│
├── 📁 client/                        # Frontend (React + Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Layout.jsx            # App layout wrapper with footer
│   │   │   ├── Navbar.jsx            # Navigation bar with auth
│   │   │   ├── EditableSection.jsx   # TipTap editor with enhance button
│   │   │   └── ResumePreview.jsx     # ATS-friendly PDF template
│   │   │
│   │   ├── 📁 context/
│   │   │   └── AuthContext.jsx       # Auth state management
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx              # Landing page with features
│   │   │   ├── Upload.jsx            # Drag-and-drop file upload
│   │   │   ├── Editor.jsx            # Resume editor (main page)
│   │   │   ├── Dashboard.jsx         # User's saved resumes
│   │   │   ├── Login.jsx             # Login form
│   │   │   └── Register.jsx          # Registration form
│   │   │
│   │   ├── 📁 services/
│   │   │   └── api.js                # Axios client with interceptors
│   │   │
│   │   ├── 📄 App.jsx                # Router configuration
│   │   ├── 📄 main.jsx               # React entry point
│   │   └── 📄 index.css              # TailwindCSS + custom styles
│   │
│   ├── 📄 index.html                 # HTML entry point
│   ├── 📄 package.json               # Client dependencies
│   ├── 📄 vite.config.js             # Vite configuration
│   ├── 📄 tailwind.config.js         # Tailwind configuration
│   ├── 📄 postcss.config.js          # PostCSS for Tailwind
│   ├── 📄 .env.example               # Client env template
│   └── 📄 .gitignore                 # Client-specific ignores
│
└── 📁 .git/                          # Git repository (hidden)
```

## 📊 File Count Summary

| Category | Count | Details |
|----------|-------|---------|
| **Documentation** | 7 | README, guides, roadmap |
| **Server Files** | 15 | API, models, controllers, services |
| **Client Files** | 17 | Components, pages, styles |
| **Config Files** | 9 | package.json, vite, tailwind, etc. |
| **Total** | **48+** | Complete project files |

## 🎯 Key Files to Know

### Essential Files (Must Configure)
1. **server/.env** - Database URI, API keys
2. **client/.env** - API URL (optional)

### Entry Points
1. **server/server.js** - Backend starts here
2. **client/src/main.jsx** - Frontend starts here

### Core Logic
1. **server/services/gemini.service.js** - AI integration
2. **client/src/pages/Editor.jsx** - Main editing interface
3. **client/src/components/ResumePreview.jsx** - PDF template

### API Definitions
1. **server/routes/auth.routes.js** - Auth endpoints
2. **server/routes/resume.routes.js** - Resume endpoints

### Data Models
1. **server/models/User.model.js** - User schema
2. **server/models/Resume.model.js** - Resume schema

## 📖 Documentation Guide

### For Users
1. Start with **README.md**
2. Follow **QUICK_START.md**
3. Reference **API_TESTING.md** for API details

### For Developers
1. Read **PROJECT_OVERVIEW.md** for architecture
2. Check **ROADMAP.md** for future features
3. See **CONTRIBUTING.md** before contributing

### For Understanding
1. **PROJECT_COMPLETE.md** - What was built
2. **FILE_STRUCTURE.md** - This file

## 🔍 Finding Specific Features

### Authentication
- **Backend**: `server/controllers/auth.controller.js`
- **Middleware**: `server/middleware/auth.middleware.js`
- **Frontend**: `client/src/context/AuthContext.jsx`

### File Upload
- **Config**: `server/config/multer.config.js`
- **Extraction**: `server/utils/fileExtractor.js`
- **Upload UI**: `client/src/pages/Upload.jsx`

### AI Features
- **Service**: `server/services/gemini.service.js`
- **Prompts**: Inside gemini.service.js (parsing, enhancement)

### Resume Editing
- **Main Editor**: `client/src/pages/Editor.jsx`
- **Editable Section**: `client/src/components/EditableSection.jsx`
- **TipTap Integration**: Inside EditableSection.jsx

### Resume Preview & Export
- **Preview Component**: `client/src/components/ResumePreview.jsx`
- **PDF Export**: react-to-print in ResumePreview.jsx

### Styling
- **Global Styles**: `client/src/index.css`
- **Tailwind Config**: `client/tailwind.config.js`
- **Theme Colors**: In tailwind.config.js

## 🎨 Architecture Layers

```
┌─────────────────────────────────────┐
│         Client (React)              │
│  Components → Pages → Context       │
└───────────┬─────────────────────────┘
            │ HTTP/REST
            ↓
┌─────────────────────────────────────┐
│      Server (Express)               │
│  Routes → Controllers → Services    │
└───────────┬─────────────────────────┘
            │
            ├─────→ MongoDB (Database)
            │
            └─────→ Gemini AI (Google)
```

## 🚀 Development Flow

1. **Start**: `server/server.js` + `client/src/main.jsx`
2. **Request**: User action in React component
3. **API Call**: `client/src/services/api.js`
4. **Route**: Express routes in `server/routes/`
5. **Controller**: Business logic in `server/controllers/`
6. **Service**: External APIs (Gemini) in `server/services/`
7. **Model**: Database in `server/models/`
8. **Response**: Back through the chain
9. **UI Update**: React state updates component

## 💡 Quick Navigation

| Looking for... | Go to... |
|----------------|----------|
| Setup instructions | README.md |
| API endpoints | API_TESTING.md |
| Architecture details | PROJECT_OVERVIEW.md |
| Future features | ROADMAP.md |
| How to contribute | CONTRIBUTING.md |
| Project summary | PROJECT_COMPLETE.md |
| File locations | FILE_STRUCTURE.md (this file) |

---

**Updated**: January 2025
**Total Files**: 48+
**Status**: ✅ Complete
