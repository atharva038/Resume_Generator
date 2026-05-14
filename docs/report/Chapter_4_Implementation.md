# Chapter 4: Implementation

---

## 4.1 Introduction

This chapter documents the concrete implementation of the SmartNShine ATS Resume Generator across its full technology stack. Where Chapter 3 presented the *design* — the blueprint — this chapter presents the *build* — the actual code structures, implementation decisions, integrations, and patterns that bring the design to life. Each major subsystem is addressed in sequence: the technology stack, the frontend and UI, the document parsing pipeline, prompt engineering, LLM integration, the voice pipeline, the complete end-to-end workflow, and the edge cases handled to make the system robust in production.

---

## 4.2 Technology Stack

### 4.2.1 Complete Dependency Inventory

**Backend (`server/package.json`)**

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4 | HTTP server and routing framework |
| `mongoose` | ^8 | MongoDB ODM (Object Document Mapper) |
| `@google/generative-ai` | latest | Google Gemini API client |
| `openai` | latest | OpenAI GPT-4o API client |
| `multer` | latest | HTTP multipart file upload handling |
| `pdf.js-extract` | latest | PDF text extraction (PDF.js engine) |
| `mammoth` | latest | DOCX → plain text extraction |
| `jsonwebtoken` | latest | JWT creation and verification |
| `bcryptjs` | latest | Password hashing (10 bcrypt rounds) |
| `passport` | latest | Authentication middleware framework |
| `passport-google-oauth20` | latest | Google OAuth 2.0 strategy |
| `passport-github2` | latest | GitHub OAuth 2.0 strategy |
| `connect-mongo` | latest | MongoDB-backed session store |
| `express-session` | latest | HTTP session middleware |
| `express-rate-limit` | latest | API rate limiting |
| `helmet` | latest | HTTP security headers |
| `cors` | latest | Cross-Origin Resource Sharing |
| `express-mongo-sanitize` | latest | NoSQL injection prevention |
| `xss-clean` | latest | XSS attack prevention |
| `razorpay` | latest | Razorpay payment gateway SDK |
| `nodemailer` | latest | Transactional email via SMTP |
| `dotenv` | latest | Environment variable loading |
| `mongoose` | ^8 | MongoDB ODM |

**Frontend (`client/package.json`)**

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18 | UI component library |
| `vite` | ^6 | Build tool and dev server |
| `react-router-dom` | ^6 | Client-side routing |
| `axios` | latest | HTTP client with interceptors |
| `@tiptap/react` | latest | Headless rich text editor (React) |
| `@tiptap/starter-kit` | latest | TipTap extension bundle |
| `react-to-print` | latest | Browser print-based PDF export |
| `react-dropzone` | latest | Drag-and-drop file upload UI |
| `framer-motion` | latest | Declarative React animations |
| `tailwindcss` | ^3 | Utility-first CSS framework |
| `react-hot-toast` | latest | Accessible toast notifications |

**Voice Services (Python)**

| Package | Purpose |
|---|---|
| `flask` | HTTP microservice framework |
| `flask-cors` | CORS headers for Flask |
| `openai-whisper` | OpenAI Whisper ASR model |
| `torch` | PyTorch ML framework (Whisper dep) |
| `ffmpeg-python` | Audio format conversion |
| `chatterbox-tts` | Neural TTS synthesis |

### 4.2.2 Runtime Environment

| Service | Runtime | Port | Hosting |
|---|---|---|---|
| React Frontend | Node.js 18+ (build), CDN (production) | 5173 (dev) | Vercel |
| Express Backend | Node.js 18+ (ES modules) | 5000 | Render |
| MongoDB | MongoDB Atlas M0 (cloud) | 27017 | Atlas |
| Whisper STT | Python 3.11+ | 5001 | Self-hosted |
| Chatterbox TTS | Python 3.11+ | 5002 | Self-hosted |

The backend uses **ES module syntax** throughout (`import`/`export`, not CommonJS `require`/`module.exports`), configured via `"type": "module"` in `package.json`. This is a deliberate modernization that ensures compatibility with future Node.js ESM-native packages.

---

## 4.3 Frontend and UI Implementation

### 4.3.1 Project Initialization and Build Configuration

The frontend was bootstrapped with **Vite 6** using the React template:

```bash
npm create vite@latest client -- --template react
```

Vite was chosen over Create React App for its dramatically faster Hot Module Replacement (HMR) during development and its efficient Rollup-based production bundling. The `vite.config.js` configures a dev proxy to forward `/api/*` requests to the Express backend, eliminating CORS issues during local development:

```javascript
// client/vite.config.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

The path alias `@` → `./src` enables clean imports throughout the codebase:
```javascript
// Clean: import Navbar from '@/components/common/Navbar'
// vs messy: import Navbar from '../../../components/common/Navbar'
```

### 4.3.2 TailwindCSS Configuration

TailwindCSS 3 is configured with a custom `tailwind.config.js` that extends the default theme:

- **Dark mode**: Configured as `class`-based (controlled by `DarkModeContext`)
- **Custom color palette**: Extended with brand colors used across components
- **Content paths**: `['./index.html', './src/**/*.{js,jsx}']` — ensures Tailwind only generates classes actually used in the codebase
- **Typography plugin**: `@tailwindcss/typography` for prose content

### 4.3.3 Global Layout and Routing

The application uses React Router v6's nested route structure with an `<Outlet>` pattern:

```jsx
// App.jsx
<Routes>
  <Route element={<BaseLayout />}>     {/* Navbar + Footer wrapper */}
    <Route path="/" element={<Home />} />
    <Route path="/upload" element={<Upload />} />
    <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/ai-interview" element={<ProtectedRoute><AIInterview /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>
  <Route path="/admin/*" element={<AdminRoute><AdminPanel /></AdminRoute>} />
</Routes>
```

`BaseLayout` renders `<Navbar />`, `<Outlet />`, and `<Footer />`. This eliminates repetitive imports of Navbar and Footer in every page component. `ProtectedRoute` is a wrapper component that checks for a valid JWT token in localStorage; unauthenticated access redirects to `/login` with the intended URL preserved in router state for post-login redirect.

### 4.3.4 Authentication Context

The `AuthContext` provides global authentication state:

```jsx
// context/AuthContext.jsx
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token validity with backend
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => { localStorage.removeItem('token'); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

The `loading` state prevents flash of incorrect UI while the initial token verification request is in flight. All protected pages check `loading` first, showing a spinner until auth state is confirmed.

### 4.3.5 Axios API Client Configuration

All API communication is centralized in `src/api/api.js`:

```javascript
// src/api/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,  // 30s for AI calls
});

// Request interceptor: attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle auth errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

The 30-second timeout is essential because AI API calls (especially GPT-4o interview evaluations) can take 5–15 seconds.

### 4.3.6 Dark Mode Implementation

Dark mode is implemented via `DarkModeContext`:

```jsx
// context/DarkModeContext.jsx
export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark: () => setIsDark(d => !d) }}>
      {children}
    </DarkModeContext.Provider>
  );
}
```

The initial value respects the user's OS preference via `prefers-color-scheme` media query, and the `dark` class on `<html>` enables TailwindCSS's `dark:` variant classes throughout all components.

### 4.3.7 Framer Motion Animations

Framer Motion is used for micro-animations that make the UI feel alive:

```jsx
// Page entry animation pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  {/* Page content */}
</motion.div>

// Card hover effect
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  {/* Resume card */}
</motion.div>
```

Interview phase transitions (intro → warm-up → core → wrap-up) use `AnimatePresence` to animate between states with a smooth crossfade.

---

## 4.4 Document Parsing Pipeline Implementation

### 4.4.1 Multer File Upload Configuration

```javascript
// server/config/multer.config.js
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB
});
```

Files are stored with a timestamp-prefixed unique filename to prevent collisions. After successful parsing, the temp file is immediately deleted by `deleteFile()` to prevent disk accumulation.

### 4.4.2 Text Extraction from PDF

SmartNShine uses `pdf.js-extract` (PDF.js-based) for PDF text extraction. The extraction collects text items from every page and joins them:

```javascript
// server/utils/fileExtractor.js
export async function extractTextFromPDF(filePath) {
  const data = await pdfExtract.extract(filePath, {});
  let text = '';
  for (const page of data.pages) {
    const pageText = page.content.map(item => item.str).join(' ');
    text += pageText + '\n';
  }
  // Normalize whitespace
  text = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}
```

The text cleaning pipeline:
1. Normalizes Windows line endings (`\r\n` → `\n`)
2. Collapses excessive blank lines (3+ newlines → 2 newlines)
3. Collapses multi-space sequences to single spaces
4. Trims leading and trailing whitespace

A content length check (`extractedText.length < 50`) guards against password-protected or image-only PDFs that yield empty or near-empty text, returning a user-friendly error rather than sending garbage to Gemini.

### 4.4.3 Text Extraction from DOCX

DOCX extraction uses the `mammoth` library, which converts the DOCX XML format to plain text:

```javascript
export async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  // Log extraction warnings (e.g., unsupported DOCX features)
  if (result.messages?.length > 0) {
    console.warn('DOCX extraction warnings:', result.messages);
  }
  return text;
}
```

`mammoth.extractRawText` is preferred over `mammoth.convertToHtml` because the raw text preserves the natural reading order of a word processor document, which is what the AI parser needs. HTML conversion would introduce tags that confuse the LLM.

---

## 4.5 Prompt Engineering Implementation

### 4.5.1 Resume Parsing Prompt

The resume parsing prompt is a precisely structured instruction that doubles as an implicit few-shot example through its JSON schema specification:

```
You are an expert resume parser. Extract and structure the following resume text into a JSON format.

IMPORTANT RULES:
1. Extract ALL information accurately from the resume
2. For dates, use format "Month YYYY" (e.g., "Jan 2024")
3. Parse bullet points carefully, keeping all details
4. If information is missing, use empty strings or empty arrays
5. Preserve all contact information found

Required JSON structure:
{
  "name": "Full Name",
  "contact": {
    "email": "email@example.com",
    "phone": "+1234567890",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "website.com",
    "location": "City, State/Country"
  },
  "summary": "Professional summary or objective",
  "skills": [{ "category": "Technical Skills", "items": ["skill1","skill2"] }],
  "experience": [{
    "company": "Company Name",
    "title": "Job Title",
    "location": "City, State",
    "startDate": "Month YYYY",
    "endDate": "Month YYYY or Present",
    "current": false,
    "bullets": ["Achievement 1", "Achievement 2"]
  }],
  ...
}

Resume Text:
{resumeText}

Return ONLY valid JSON with no additional text or markdown formatting.
```

**Key engineering decisions:**
- `"Return ONLY valid JSON"` combined with the visual JSON example consistently produces clean, parseable output
- Date format standardization ("Month YYYY") is specified to normalize the wide variety of date formats used across different resumes
- `"If information is missing, use empty strings or empty arrays"` prevents `null` fields that would crash downstream code expecting array iteration
- The instruction `"Return ONLY valid JSON with no additional text or markdown formatting"` is repeated at the end because LLMs tend to give more weight to instructions near the end of the prompt

### 4.5.2 Content Enhancement Prompt

The enhancement prompt is the most complex in the system, encoding six critical rules and injecting dynamic context:

```
You are an expert resume writer specializing in ATS optimization.

TASK: Rewrite the following resume content to be more ATS-friendly and impactful.

CRITICAL RULES:
1. ANALYZE EXPERIENCE LEVEL FIRST: Based on the full resume context, determine if
   this is a fresher, junior (1-2 years), or senior (3+ years) professional
2. MAINTAIN EXPERIENCE LEVEL: DO NOT add fake experience, projects, or achievements.
   Only enhance what already exists
3. STRICT LENGTH LIMITS:
   - Summary: Maximum 50 words (3-4 lines)
   - Each bullet point: Maximum 15 words (1 line)
   - Project descriptions: Maximum 30 words (2 lines)
4. ATS OPTIMIZATION:
   - Start each bullet with strong action verbs (Led, Developed, Implemented, etc.)
   - Quantify achievements with numbers/percentages/metrics when possible
   - Use industry-standard keywords relevant to the role
   - Focus on impact and results, not just responsibilities
5. FORMATTING: Remove personal pronouns; use past tense for previous roles
6. CONTENT INTEGRITY: Don't invent metrics or achievements

Full Resume Context:
{resumeContext}

Section Type: {sectionType}
Content to enhance:
{content}

Return enhanced content in the same structure.
Return ONLY the enhanced content without explanations.
```

The `{resumeContext}` placeholder is dynamically computed before each call:

```javascript
const level = experienceCount === 0 ? 'FRESHER'
  : yearsOfExperience < 2 ? 'JUNIOR (1-2 years)'
  : 'SENIOR (3+ years)';

resumeContext = `
Experience Level: ${level}
Number of work experiences: ${experienceCount}
Total years of experience: ${Math.round(yearsOfExperience)} years
Has projects: ${hasProjects}
Education: ${resumeData.education?.map(e => e.degree).join(', ') || 'Not specified'}
Skills count: ${skillCount}

IMPORTANT: This is a ${level} resume. Do not add or invent any experience
or achievements that don't exist.
`;
```

This context injection solves a critical hallucination problem: without it, Gemini would sometimes enhance a fresh graduate's resume with senior-level fabricated metrics ("Led a team of 15 engineers") — turning enhancement into fabrication. The context anchors the model to the candidate's actual profile.

### 4.5.3 ATS Score Analysis Prompt

The ATS scoring prompt specifies a weighted scoring formula:

```
ANALYSIS REQUIREMENTS:
1. Match Score (0-100): Calculate overall compatibility based on:
   - Keyword overlap (40%)
   - Skills alignment (30%)
   - Experience relevance (20%)
   - Education match (10%)

2. Keyword Analysis:
   - Extract top 10 important keywords from job description
   - Identify MISSING keywords from the resume
   - Identify PRESENT keywords in the resume

3. Strengths: List 3-5 strong points (specific, not generic)

4. Improvement Tips: Provide 3-5 specific, actionable suggestions

5. Eligibility: ATS pass if match_score >= 60

CRITICAL RULES:
- Be honest and realistic with scoring
- Missing keywords should be relevant and important (not filler words)
```

The 40/30/20/10 weighting is grounded in how commercial ATS systems typically weight these dimensions (keyword frequency is the dominant signal). By encoding this logic in the prompt, Gemini produces scores that correlate meaningfully with real ATS system outputs.

### 4.5.4 Custom User Prompt Extension

A powerful feature of SmartNShine's enhancement system is the ability to append a user-written custom instruction to any enhancement call:

```javascript
// If user provides custom instructions, append them
if (customPrompt && customPrompt.trim()) {
  customInstructions = `
ADDITIONAL CUSTOM INSTRUCTIONS FROM USER:
${customPrompt.trim()}

YOU MUST follow these custom instructions while maintaining all the critical rules above.
`;
}

const prompt = ENHANCE_CONTENT_PROMPT
  .replace('{resumeContext}', resumeContext)
  .replace('{sectionType}', sectionType)
  .replace('{content}', contentStr) + customInstructions;
```

This allows users to guide the enhancement with natural language such as "Focus on Python and machine learning keywords" or "Make this sound more suitable for a startup culture" — without exposing prompt internals to the user.

---

## 4.6 LLM Integration Implementation

### 4.6.1 Gemini Service Implementation

The Gemini service initializes the client conditionally, making it gracefully optional:

```javascript
// server/services/gemini.service.js
const GEMINI_ENABLED = Boolean(process.env.GEMINI_API_KEY?.trim());
const genAI = GEMINI_ENABLED ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

function ensureGeminiEnabled() {
  if (!GEMINI_ENABLED) {
    throw new Error('Gemini API is not configured.');
  }
}
```

This design allows the server to start and serve non-AI endpoints even when `GEMINI_API_KEY` is absent, which is valuable during local development and testing.

Every Gemini call is wrapped in the `retryWithBackoff` utility:

```javascript
async function retryWithBackoff(fn, operation = 'API call') {
  let lastError;
  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error)) throw error;
      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const delay = Math.min(
          RETRY_CONFIG.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
          RETRY_CONFIG.maxDelay
        );
        await sleep(delay);
      }
    }
  }
  throw new Error(`${operation} failed after ${RETRY_CONFIG.maxRetries} retries`);
}
```

The jitter term (`+ Math.random() * 1000ms`) is essential in production: without it, multiple concurrent requests hitting a rate limit would all retry at exactly the same instant, creating a thundering herd that immediately re-triggers the rate limit.

### 4.6.2 JSON Response Cleaning

Both Gemini and GPT-4o models sometimes wrap JSON responses in markdown code fences (` ```json ... ``` `), especially earlier in their training. SmartNShine strips these before parsing:

```javascript
let cleanedText = text.trim();
if (cleanedText.startsWith('```json')) {
  cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
} else if (cleanedText.startsWith('```')) {
  cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
}
const parsed = JSON.parse(cleanedText);
```

### 4.6.3 OpenAI GPT-4o Integration

The OpenAI service implements the same structural patterns as the Gemini service — conditional initialization, retry with backoff, JSON cleaning — but uses the OpenAI SDK's chat completion API:

```javascript
// server/services/openai.service.js
const openai = OPENAI_ENABLED ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function chatCompletion(systemPrompt, userPrompt, options = {}) {
  const { temperature = 0.7, maxTokens = 1000 } = options;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userPrompt }
    ],
    temperature,
    max_tokens: maxTokens,
    response_format: { type: 'text' }  // JSON enforced by prompt, not API param
  });

  return {
    text: response.choices[0].message.content,
    tokenUsage: {
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens
    }
  };
}
```

Temperature is set to **0.7** for question generation (controlled creativity) and **0.3** for evaluation (deterministic consistency). This calibration prevents the evaluator from giving wildly different scores to identical answers across sessions.

### 4.6.4 AI Router / Multi-Model Strategy

The `aiRouter.service.js` module abstracts the routing logic, selecting the appropriate AI backend based on the operation type and user tier:

```javascript
// Simplified routing logic
export async function routeAIRequest(operation, payload, user) {
  switch (operation) {
    case 'parse_resume':
    case 'enhance_content':
    case 'generate_summary':
    case 'ats_score':
      return await geminiService[operation](payload);

    case 'interview_question':
    case 'interview_evaluate':
    case 'interview_report':
      return await openaiService.chatCompletion(
        payload.systemPrompt,
        payload.userPrompt,
        payload.options
      );

    default:
      throw new Error(`Unknown AI operation: ${operation}`);
  }
}
```

### 4.6.5 AI Usage Tracking

Every AI operation records usage data to the `AIUsage` collection via `trackAIUsage`:

```javascript
// server/middleware/aiUsageTracker.middleware.js
export async function trackAIUsage(userId, feature, tokensUsed,
                                    responseTime, status, errorMessage = null) {
  await AIUsage.create({
    userId,
    aiProvider: feature.includes('interview') ? 'openai' : 'gemini',
    feature,
    tokensUsed,
    cost: calculateCost(tokensUsed, feature),
    responseTime,
    status,
    errorMessage
  });
  // Also increment per-user counter
  await User.findByIdAndUpdate(userId, {
    $inc: { aiUsageCount: 1 }
  });
}
```

The `calculateCost` function uses current public pricing (per-million-token rates for Gemini Flash and GPT-4o) to produce estimated USD cost figures, providing operational insight in the admin dashboard.

---

## 4.7 Voice Pipeline Implementation

### 4.7.1 Whisper STT Microservice

The voice STT service is a standalone Python Flask application:

```python
# voice-service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile, os

app = Flask(__name__)
CORS(app)
model = whisper.load_model('base')  # Load on startup

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model': 'whisper-base'})

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
        audio_file.save(tmp.name)
        result = model.transcribe(tmp.name)
        os.unlink(tmp.name)

    return jsonify({
        'text': result['text'].strip(),
        'language': result.get('language', 'en'),
        'segments': result.get('segments', [])
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
```

The Node.js backend proxies all audio transcription requests through `/api/voice/transcribe`, preventing direct browser access to the STT microservice:

```javascript
// server/routes/voice.routes.js
router.post('/transcribe', authMiddleware, async (req, res) => {
  const formData = new FormData();
  formData.append('audio', req.body.audioBlob, 'recording.webm');

  const response = await fetch(`${VOICE_SERVICE_URL}/transcribe`, {
    method: 'POST',
    body: formData
  });
  const result = await response.json();
  res.json(result);
});
```

### 4.7.2 Chatterbox TTS Microservice

The Chatterbox TTS service synthesizes speech for interview questions:

```python
# chatterbox-service/app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

@app.route('/synthesize', methods=['POST'])
def synthesize():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Synthesize using Chatterbox model
    audio_bytes = chatterbox_model.synthesize(text)
    return send_file(
        io.BytesIO(audio_bytes),
        mimetype='audio/wav',
        as_attachment=False
    )
```

The frontend receives the audio as a blob, creates an object URL, and plays it via `HTMLAudioElement`:

```javascript
// In AIInterview.jsx
const speakQuestion = async (questionText) => {
  if (!voiceEnabled) return;
  try {
    const response = await fetch('/api/voice/tts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: questionText })
    });
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => URL.revokeObjectURL(audioUrl); // Clean up
  } catch {
    // Fallback to browser TTS
    const utterance = new SpeechSynthesisUtterance(questionText);
    window.speechSynthesis.speak(utterance);
  }
};
```

The `URL.revokeObjectURL` cleanup prevents memory leaks from dangling blob URLs.

### 4.7.3 Browser Audio Recording

Voice answers are recorded using the Web `MediaRecorder` API:

```javascript
// Recording with silence detection
let mediaRecorder;
let audioChunks = [];
let silenceTimer = null;
const SILENCE_THRESHOLD = 0.02; // RMS threshold
const SILENCE_DURATION = 2000;  // 2 seconds of silence = auto-submit

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

  // Silence detection via AudioContext analyser
  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);

  const dataArray = new Float32Array(analyser.fftSize);

  const detectSilence = setInterval(() => {
    analyser.getFloatTimeDomainData(dataArray);
    const rms = Math.sqrt(dataArray.reduce((s, v) => s + v * v, 0) / dataArray.length);

    if (rms < SILENCE_THRESHOLD) {
      if (!silenceTimer) {
        silenceTimer = setTimeout(() => stopRecordingAndSubmit(), SILENCE_DURATION);
      }
    } else {
      clearTimeout(silenceTimer);
      silenceTimer = null;
    }
  }, 100);

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
  mediaRecorder.onstop = () => {
    clearInterval(detectSilence);
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    sendToTranscription(audioBlob);
  };

  mediaRecorder.start(250); // Collect chunks every 250ms
};
```

The 250ms chunk interval balances streaming responsiveness with the overhead of frequent chunk callbacks. Silence detection using RMS (Root Mean Square) amplitude is more reliable than simple zero-crossing detection for typical laptop microphone input.

---

## 4.8 Complete End-to-End Workflow Implementation

### 4.8.1 Resume Processing Workflow (Controller Layer)

```javascript
// server/controllers/resume.controller.js — uploadResume()
export const uploadResume = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Tier-based access check
    const user = await User.findById(req.user._id);
    const canUseAI = user?.role === 'admin' ||
      ['pro', 'premium', 'lifetime'].includes(user?.subscription?.tier);

    // Daily limit check for AI-enabled users
    if (canUseAI && user.role !== 'admin') {
      const limit = user.getUsageLimit('aiResumeExtractionsPerDay');
      const used = user.usage?.aiResumeExtractionsToday || 0;
      if (used >= limit) return res.status(403).json({ error: 'AI Extraction Limit Reached' });
    }

    filePath = req.file.path;

    // Step 1: Extract raw text
    const extractedText = await extractTextFromFile(filePath);
    if (extractedText.length < 50)
      throw new Error('Insufficient text extracted. Ensure file is not password-protected.');

    // Step 2: AI parse extracted text
    const { data: parsedData, tokenUsage } = await parseResumeWithAI(extractedText);
    parsedData.rawText = extractedText;

    // Step 3: Update usage counters
    if (canUseAI && user.role !== 'admin') {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'usage.aiResumeExtractions': 1, 'usage.aiResumeExtractionsToday': 1 }
      });
    }

    // Step 4: Cleanup temp file
    await deleteFile(filePath);

    res.json({ message: 'Resume uploaded and parsed successfully', data: parsedData });
  } catch (error) {
    if (filePath) await deleteFile(filePath);  // Always clean up
    // Distinguish quota errors for user-friendly messaging
    if (isQuotaError(error)) {
      return res.status(403).json({ error: 'AI Parsing Limit Reached', upgradeRequired: true });
    }
    res.status(500).json({ error: error.message });
  }
};
```

The `finally`-equivalent cleanup (`if (filePath) await deleteFile(filePath)`) ensures temporary files are always removed, even when the AI parsing throws an exception.

### 4.8.2 Interview Session Lifecycle

The interview session management involves coordinated state across client, server, and AI:

```javascript
// Phase 1: Session creation
POST /api/interview/session
→ Creates InterviewSession in MongoDB with status: 'pending'

// Phase 2: Question generation (per question)
POST /api/interview/question
Body: { sessionId, questionNumber, previousQuestions[], previousAnswers[] }
→ GPT-4o generates next question (aware of all previous to avoid repetition)
→ Updates session: currentQuestionIndex++
→ Returns: { question, questionType, category, difficulty, expectedKeywords }

// Phase 3: Answer evaluation (per answer)
POST /api/interview/evaluate
Body: { sessionId, questionId, question, answer, questionType, role, level }
→ GPT-4o evaluates answer on 5 dimensions
→ Stores evaluation embedded in question subdocument
→ Returns: { score, relevance, clarity, confidence, technicalAccuracy, roleFit,
              strengths, weaknesses, suggestedAnswer, shouldAskFollowUp }

// Phase 4: Report generation
POST /api/interview/report
Body: { sessionId }
→ GPT-4o receives all Q&A pairs + evaluations
→ Generates comprehensive InterviewResult document
→ Updates session status: 'completed'
→ Returns: { overallScore, skillBreakdown, strengths, weaknesses,
              resumeImprovements, practiceAreas, hiringRecommendation }
```

### 4.8.3 Payment Flow Implementation

```javascript
// Step 1: Create Razorpay order
// server/services/payment.service.js
export async function createOrder(amount, currency, userId) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const order = await razorpay.orders.create({
    amount: amount * 100,  // Razorpay expects paise
    currency,
    receipt: `receipt_${userId}_${Date.now()}`,
    notes: { userId }
  });
  return order;
}

// Step 2: Verify payment signature
export function verifyPaymentSignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSig === signature;
}
```

If the HMAC signature doesn't match, the subscription is not activated — preventing any client-side forgery of successful payment.

---

## 4.9 Edge Cases and Error Handling

### 4.9.1 Password-Protected and Scanned PDFs

**Problem**: Some PDFs yield near-zero text (password-protected documents or scanned image PDFs).

**Solution**: After extraction, a minimum text length check is enforced:
```javascript
if (!extractedText || extractedText.length < 50) {
  throw new Error('Insufficient text extracted from resume. Please ensure the file contains readable text.');
}
```
The error message specifically guides the user to the root cause without exposing internal processing details.

### 4.9.2 AI Response Non-JSON Output

**Problem**: LLMs occasionally produce responses that begin with preamble text ("Sure, here is the JSON you requested...") before the actual JSON, or that embed the JSON in markdown code fences.

**Solution (dual-layer)**:
1. Markdown code fence stripping before `JSON.parse()`
2. The interview service's `parseAIResponse()` function uses regex to extract the first JSON object from any response string:
```javascript
function parseAIResponse(responseText, fallback = {}) {
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return JSON.parse(responseText);
  } catch {
    console.error('Failed to parse AI response:', responseText.substring(0, 500));
    return fallback;  // Return safe fallback, don't crash
  }
}
```
Returning a fallback structure (rather than throwing) ensures the interview continues even if a single evaluation response is malformed.

### 4.9.3 API Rate Limits and Quota Exhaustion

**Problem**: Gemini and OpenAI both impose rate limits (requests/minute) and daily quota limits. Under heavy concurrent usage, the server may receive 429 responses.

**Solution (three levels)**:
1. **Retry with exponential backoff**: 3 attempts with jitter before propagating
2. **User-facing error messages**: Distinguish between temporary throttling (retry later) and quota exhaustion (upgrade plan)
3. **AI usage tracking**: The `AIUsage` model provides operational visibility so administrators can monitor approaching limits before they impact users

```javascript
if (isQuotaError(error)) {
  return res.status(403).json({
    error: 'AI Parsing Limit Reached',
    message: 'Upgrade to Pro, Premium, or Lifetime for unlimited AI parsing.',
    upgradeRequired: true,
    quotaExceeded: true
  });
}
```

### 4.9.4 Voice Service Unavailability

**Problem**: The Whisper STT and Chatterbox TTS microservices may not be running (server restarts, resource constraints).

**Solution (cascaded fallback)**:
- TTS: If Chatterbox returns an error or times out, the client automatically switches to `window.speechSynthesis` (browser Web Speech API). The user experiences a quality degradation (browser-synthesized voice vs. Chatterbox voice) but the interview continues uninterrupted.
- STT: If the server-side Whisper transcription fails, the client displays an error and allows re-recording. The interview is not aborted.
- Both services report health via `GET /health` endpoints polled at server startup, with appropriate console warnings logged.

### 4.9.5 Navigation Blocking on Unsaved Changes

**Problem**: Users may accidentally navigate away from the Editor with unsaved resume changes.

**Solution**: A `NavigationBlockerContext` that intercepts React Router navigation and native browser tab-close events:
```javascript
// In Editor.jsx
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);
```
React Router's `useBlocker` hook handles in-app navigation, showing a confirmation modal rather than the browser's native confirm dialog.

### 4.9.6 DOCX Files with Complex Formatting

**Problem**: Some DOCX resumes include complex layouts (tables, text boxes, SmartArt) that mammoth cannot extract correctly, producing garbled text sequences.

**Solution**: Mammoth's `messages` array captures extraction warnings. These are logged server-side, and the extraction is validated by minimum length. If the extracted text appears structurally invalid (e.g., fewer than 3 newline-separated sections detectable), a warning is returned alongside the parsed data suggesting the user verify the extraction.

### 4.9.7 Subscription Plan Enforcement

**Problem**: Users must not be able to access premium features (unlimited AI, full interview module) without an active subscription.

**Solution**: Middleware-level enforcement at the route layer:
```javascript
// server/middleware/checkUsageLimit.middleware.js
export const checkUsageLimit = (feature) => async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const tier = user.subscription?.tier || 'free';
  const limit = user.getUsageLimit(feature);
  const used = user.usage?.[feature] || 0;

  if (limit !== -1 && used >= limit) {  // -1 = unlimited
    return res.status(403).json({
      error: 'Usage limit reached',
      upgradeRequired: true,
      feature,
      limit,
      used
    });
  }
  next();
};
```

This middleware is applied to all AI-powered endpoints, ensuring enforcement is consistent and cannot be bypassed by direct API calls.

---

## 4.10 Summary

This chapter presented the ground-level implementation of SmartNShine across its complete technology stack. The frontend is built with React 18, Vite, TailwindCSS, and Framer Motion — organized into a domain-driven component hierarchy with centralized auth context, Axios interceptors, and React Router v6 nested layouts. The document parsing pipeline processes PDF and DOCX inputs through dedicated extraction libraries, applies text normalization, and feeds cleaned text to Google Gemini via carefully engineered prompts. The LLM integration layer implements multi-model routing (Gemini for resume tasks, GPT-4o for interview tasks), retry with exponential backoff, JSON cleaning, and comprehensive AI usage tracking. The voice pipeline implements Whisper STT and Chatterbox TTS as independent Python Flask microservices with graceful browser-based fallbacks. The chapter concluded with a thorough treatment of edge cases — covering password-protected PDFs, malformed AI responses, API quota exhaustion, voice service unavailability, unsaved-changes navigation, and subscription enforcement — all of which were encountered and resolved during the development process.

---

*End of Chapter 4*
