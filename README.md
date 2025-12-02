# SmartNShine - ATS Optimized Resume Builder

A complete MERN stack application that uses Google's Gemini AI to transform resumes into ATS-friendly, optimized documents. Upload PDF or DOCX files, get AI-powered enhancements, and download professionally formatted resumes that pass Applicant Tracking Systems.

## 🚀 Features

- **Smart Upload & Parsing**: Upload PDF/DOCX resumes and automatically extract structured data using AI
- **AI Enhancement**: Gemini-powered content optimization with action verbs, metrics, and ATS keywords
- **Rich Text Editor**: Edit resume sections with TipTap WYSIWYG editor
- **ATS-Friendly Templates**: Single-column, text-based PDF output optimized for ATS parsing
- **Drag & Reorder**: Reorganize experience, education, and project sections
- **User Authentication**: JWT-based auth to save and manage multiple resumes
- **Live Preview**: Real-time preview of resume with PDF export functionality
- **Responsive Design**: Built with TailwindCSS for mobile and desktop

## 🛠 Tech Stack

### Backend
- **Node.js + Express**: REST API server
- **MongoDB + Mongoose**: Database and ODM
- **Gemini AI API**: AI parsing and content enhancement
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction
- **JWT**: Authentication
- **bcryptjs**: Password hashing

### Frontend
- **React 18 + Vite**: Modern React with fast HMR
- **TailwindCSS**: Utility-first CSS framework
- **TipTap**: Rich text editor for resume content
- **React Router**: Client-side routing
- **React Dropzone**: Drag-and-drop file uploads
- **react-to-print**: Text-based PDF generation
- **Axios**: HTTP client

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn
- **MongoDB Atlas** account (or local MongoDB)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
cd ATS_RESUME_GENERATOR
```

### 2. Server Setup

```bash
cd server
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Configure `.env`:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ats_resume
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_ORIGIN=http://localhost:5173
```

**Start the server:**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Client Setup

```bash
cd ../client
npm install

# Start development server
npm run dev
```

Client runs on `http://localhost:5173`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

# Response includes JWT token
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

### Resume Endpoints

#### Upload & Parse Resume
```bash
POST /api/resume/upload
Content-Type: multipart/form-data

# Upload file with field name 'resume'
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@/path/to/resume.pdf"
```

**Response:**
```json
{
  "message": "Resume uploaded and parsed successfully",
  "data": {
    "name": "John Doe",
    "contact": { "email": "john@example.com", ... },
    "summary": "Experienced software engineer...",
    "skills": [...],
    "experience": [...],
    "education": [...],
    "rawText": "..."
  }
}
```

#### Enhance Content
```bash
POST /api/resume/enhance
Content-Type: application/json

{
  "content": ["Worked on backend systems", "Fixed bugs"],
  "sectionType": "experience"
}
```

**Response:**
```json
{
  "message": "Content enhanced successfully",
  "enhanced": [
    "Architected and implemented scalable backend systems serving 10K+ users",
    "Resolved critical production bugs, improving system stability by 40%"
  ]
}
```

#### Generate Summary
```bash
POST /api/resume/generate-summary
Content-Type: application/json

{
  "resumeData": { ... }
}
```

#### Save Resume (Auth Required)
```bash
POST /api/resume/save
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "contact": { ... },
  "summary": "...",
  ...
}
```

#### Update Resume (Auth Required)
```bash
PUT /api/resume/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### List User Resumes (Auth Required)
```bash
GET /api/resume/list
Authorization: Bearer <token>
```

#### Get Resume by ID (Auth Required)
```bash
GET /api/resume/:id
Authorization: Bearer <token>
```

#### Delete Resume (Auth Required)
```bash
DELETE /api/resume/:id
Authorization: Bearer <token>
```

## 🧪 Testing Checklist

### Manual Testing Flow

1. **Upload Flow**
   - [ ] Navigate to `/upload`
   - [ ] Drag and drop a PDF resume
   - [ ] Verify file upload shows loading state
   - [ ] Confirm redirect to `/editor` with parsed data
   - [ ] Check all sections populated correctly

2. **Editor Flow**
   - [ ] Edit personal information fields
   - [ ] Modify summary text
   - [ ] Add/remove skills categories
   - [ ] Edit experience bullets using TipTap
   - [ ] Click "Enhance" on experience section
   - [ ] Verify AI-enhanced content appears
   - [ ] Reorder experience items (up/down arrows)
   - [ ] Add new project/education entries

3. **Preview & Export**
   - [ ] Click "Show Preview"
   - [ ] Verify resume renders correctly
   - [ ] Check ATS-friendly formatting (single column, clear sections)
   - [ ] Click "Download PDF"
   - [ ] Open PDF and verify text is selectable (not image)
   - [ ] Copy text from PDF to confirm ATS can parse

4. **Authentication**
   - [ ] Register new account at `/register`
   - [ ] Login at `/login`
   - [ ] Click "Save Resume" in editor
   - [ ] Navigate to `/dashboard`
   - [ ] Verify saved resume appears
   - [ ] Click "Open" to load resume
   - [ ] Delete a resume and confirm removal

5. **Error Handling**
   - [ ] Upload invalid file type (e.g., .txt)
   - [ ] Upload file > 5MB
   - [ ] Try to enhance with empty content
   - [ ] Try to save without authentication
   - [ ] Verify error messages display

### cURL Test Examples

**Test Upload:**
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@sample_resume.pdf" \
  -v
```

**Test Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}' \
  -v
```

**Test Enhance:**
```bash
curl -X POST http://localhost:5000/api/resume/enhance \
  -H "Content-Type: application/json" \
  -d '{"content":["Developed features"],"sectionType":"experience"}' \
  -v
```

**Test with Auth:**
```bash
TOKEN="your_jwt_token_here"

curl -X GET http://localhost:5000/api/resume/list \
  -H "Authorization: Bearer $TOKEN" \
  -v
```

## 🌐 Deployment

### Deploy Backend (Railway/Render)

1. Create new project on [Railway](https://railway.app) or [Render](https://render.com)
2. Connect GitHub repository
3. Set environment variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `CLIENT_ORIGIN` (frontend URL)
4. Deploy from `server` directory

### Deploy Frontend (Vercel)

1. Create new project on [Vercel](https://vercel.com)
2. Set build settings:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variable:
   - `VITE_API_URL`: Your backend URL
4. Deploy

## 🎯 ATS Optimization Best Practices

The generated PDFs follow these ATS-friendly guidelines:

✅ **Single-column layout** - No tables or multi-column formatting
✅ **Standard section headings** - "Experience", "Education", "Skills"
✅ **Simple fonts** - Arial/Helvetica for maximum compatibility
✅ **Text-based PDF** - Not image/scanned document
✅ **Clear hierarchy** - Consistent heading styles (H1, H2)
✅ **No graphics/images** - Text only for ATS parsing
✅ **Standard date formats** - "Month YYYY" format
✅ **Bullet points** - Standard bullet lists, not custom symbols

## 🔐 Security Notes

- API keys stored in `.env` (never commit)
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- File upload size limited to 5MB
- CORS configured for specific origin
- Input validation on all endpoints

## 🐛 Troubleshooting

**MongoDB Connection Failed:**
```
Error: MongooseServerSelectionError
```
- Check `MONGODB_URI` in `.env`
- Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
- Ensure database user has read/write permissions

**Gemini API Error:**
```
Failed to parse resume with AI
```
- Verify `GEMINI_API_KEY` is valid
- Check API quota limits
- Ensure resume text extracted successfully

**File Upload Error:**
```
Invalid file type
```
- Only PDF and DOCX files supported
- Max file size: 5MB
- Ensure file is not password-protected

**TipTap Editor Not Loading:**
- Check browser console for errors
- Ensure `@tiptap/react` and `@tiptap/starter-kit` installed
- Clear node_modules and reinstall

## 📝 Project Structure

```
ATS_RESUME_GENERATOR/
├── server/
│   ├── config/
│   │   └── multer.config.js       # File upload configuration
│   ├── controllers/
│   │   ├── auth.controller.js     # Authentication logic
│   │   └── resume.controller.js   # Resume CRUD operations
│   ├── middleware/
│   │   └── auth.middleware.js     # JWT verification
│   ├── models/
│   │   ├── User.model.js          # User schema
│   │   └── Resume.model.js        # Resume schema
│   ├── routes/
│   │   ├── auth.routes.js         # Auth endpoints
│   │   └── resume.routes.js       # Resume endpoints
│   ├── services/
│   │   └── gemini.service.js      # Gemini AI integration
│   ├── utils/
│   │   └── fileExtractor.js       # PDF/DOCX extraction
│   ├── uploads/                   # Temporary file storage
│   ├── .env.example               # Environment template
│   ├── package.json
│   └── server.js                  # Express app entry
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx         # App layout wrapper
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── EditableSection.jsx # TipTap editor component
│   │   │   └── ResumePreview.jsx  # PDF preview template
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Upload.jsx         # File upload page
│   │   │   ├── Editor.jsx         # Resume editor
│   │   │   ├── Dashboard.jsx      # User resumes list
│   │   │   ├── Login.jsx          # Login form
│   │   │   └── Register.jsx       # Registration form
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── App.jsx                # Router configuration
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 📚 Documentation

For detailed documentation, visit the [`docs/`](docs/) directory:

- **[Quick Start Guides](docs/guides/)** - Get started quickly with various features
- **[Implementation Reports](docs/implementation/)** - Detailed implementation documentation
- **[Testing Documentation](docs/testing/)** - TestSprite and testing guides
- **[Monetization & Pricing](docs/monetization/)** - Business and pricing strategies
- **[Template Development](docs/)** - Create and customize resume templates
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[Project Roadmap](docs/ROADMAP.md)** - Future features and plans

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent parsing and enhancement
- TipTap for the excellent rich text editor
- React community for amazing tools and libraries

## 📧 Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ using MERN Stack + Gemini AI**
