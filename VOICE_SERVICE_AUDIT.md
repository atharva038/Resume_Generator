# Voice Service & AI Interview - Bugs & Issues Audit

> Comprehensive audit of the voice-service, chatterbox-service, and AI interview implementation.
> Goal: Smooth, production-ready AI interview experience.

---

## CRITICAL BUGS (Must Fix)

### BUG #1: Duplicate `GET /tts/health` Route Overwrites Working Endpoint

**File**: `server/routes/voice.routes.js` (line 55 vs line 141)

**Problem**: Two routes are registered for the same path `GET /tts/health`:
- **Line 55**: Working implementation - checks Chatterbox + Browser TTS availability
- **Line 141**: Dead code - calls `elevenlabsService.getUsage()` which is **not imported** (import is commented out on line 3)

Express registers the **last** matching route, so the second definition (line 141) overwrites the first. Since `elevenlabsService` is not imported, this route will **crash with a ReferenceError** at runtime.

```javascript
// LINE 3 - import is COMMENTED OUT:
// import * as elevenlabsService from "../services/elevenlabs.service.js";

// LINE 141 - but this route USES the commented-out import:
router.get("/tts/health", authenticateToken, async (req, res) => {
  const usage = await elevenlabsService.getUsage(); // ReferenceError!
});
```

**Impact**: `GET /api/voice/tts/health` crashes the server or returns 500. Frontend cannot determine TTS availability.

**Fix**: Delete lines 132-162 entirely (the duplicate ElevenLabs `/tts/health` route).

---

### BUG #2: Dead ElevenLabs Routes Reference Undefined Service

**File**: `server/routes/voice.routes.js` (lines 169-190)

**Problem**: `GET /tts/voices` route calls `elevenlabsService.isConfigured()` and `elevenlabsService.getVoices()`, but `elevenlabsService` is not imported.

```javascript
router.get("/tts/voices", authenticateToken, async (req, res) => {
  if (!elevenlabsService.isConfigured()) { // ReferenceError!
```

**Impact**: If any client hits this endpoint, the server crashes.

**Fix**: Either delete these dead routes entirely, or wrap them in a guard:
```javascript
// Option A: Delete lines 164-190
// Option B: Return 503 like the other disabled endpoints
router.get("/tts/voices", authenticateToken, async (req, res) => {
  return res.status(503).json({ success: false, error: "ElevenLabs disabled" });
});
```

---

### BUG #3: Voice Answer Transcription Fails Silently

**File**: `server/controllers/interview.controller.js` - `submitVoiceAnswer()`

**Problem**: When the Whisper transcription service returns an empty or very short result (e.g., silence recorded), the code likely continues to evaluate an empty/meaningless string as the user's answer. The user gets scored 0 with no ability to retry.

**Expected behavior**: Return a clear error asking the user to re-record.

**Fix**:
```javascript
if (!transcribedText || transcribedText.trim().length < 10) {
  return res.status(400).json({
    success: false,
    error: "transcription_failed",
    message: "Could not understand the audio. Please speak clearly and try again.",
    canRetry: true,
  });
}
```

---

## HIGH SEVERITY ISSUES

### ISSUE #4: Interview Auto-Complete Timer Has No Grace Period

**File**: `client/src/pages/AIInterview.jsx` (~line 222-255)

**Problem**: When the interview timer hits exactly 0 seconds remaining, `handleCompleteInterview()` fires immediately. If the user is mid-recording or their answer is being processed/transcribed, the interview ends abruptly and the in-progress answer is lost.

```javascript
if (remainingTime <= 0 && conversationPhase !== CONVERSATION_PHASES.COMPLETED) {
  handleCompleteInterview(); // Fires immediately - no grace period
}
```

**Fix**:
- Add a 15-second grace period after timer hits 0
- Show a warning toast at 30 seconds remaining
- Don't auto-complete while `isRecording` or `interviewPhase === "processing"`

---

### ISSUE #5: No Upload Retry for Failed Voice Answers

**File**: `client/src/pages/AIInterview.jsx` - voice recording submission

**Problem**: If the audio upload fails (network error, timeout, server error), the user gets a toast error but no retry mechanism. They must manually re-record or skip the question.

**Fix**: Add automatic retry with exponential backoff (up to 3 attempts), and show a "Retry" button on failure.

---

### ISSUE #6: JWT Token Can Expire During Long Interviews

**File**: `client/src/api/interview.api.js`

**Problem**: JWT tokens have a 7-day expiry, but the `fetch()` calls in interview.api.js don't use the Axios interceptor that handles token refresh (they use raw `fetch` instead of the shared `api` axios instance).

**Impact**: Voice answer submissions use `fetch()` directly, bypassing the token refresh interceptor. If the token is close to expiry or the user's session state changes, requests fail with 401.

**Fix**: Either switch voice uploads to use the shared Axios instance, or add token refresh handling to the fetch calls.

---

### ISSUE #7: `playQuestionAudio` Missing Dependencies in useCallback

**File**: `client/src/pages/AIInterview.jsx` (~line 545-615)

**Problem**: The `playQuestionAudio` callback depends on `speakAndListen` and `startRecording` but they are not in the dependency array:

```javascript
const playQuestionAudio = useCallback(
  async (audioData, questionText = "") => {
    // Uses speakAndListen, startRecording, setInterviewPhase, etc.
  },
  [selectedMode, voiceAvailable] // Missing: speakAndListen, startRecording
);
```

**Impact**: Stale closures - the function may use outdated versions of `speakAndListen` and `startRecording`.

**Fix**: Add missing deps or use refs for stable function references.

---

## MEDIUM SEVERITY ISSUES

### ISSUE #8: No Voice Service Health Check at Server Startup

**File**: `server/server.js`

**Problem**: The Express server starts successfully even when both voice services (Whisper on 5001, Chatterbox on 5002) are completely down. Users only discover the issue when they try to use the interview feature.

**Fix**: Add startup health checks with console warnings:
```javascript
// In server startup
async function checkVoiceServices() {
  try {
    await fetch(`${VOICE_SERVICE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    console.log("Whisper STT service: available");
  } catch {
    console.warn("WARNING: Whisper STT service not reachable on port 5001");
  }
  // Same for Chatterbox
}
```

---

### ISSUE #9: Race Condition in Audio Playback

**File**: `client/src/pages/AIInterview.jsx` - `speakAndListen()`

**Problem**: Multiple rapid calls to `speakAndListen()` can overlap - a new audio starts playing while the previous one is still active. The `isSpeaking` state may get out of sync.

**Fix**: Cancel any in-progress audio before starting new playback:
```javascript
if (audioRef) {
  audioRef.pause();
  audioRef.currentTime = 0;
}
```

---

### ISSUE #10: Silence Detection Browser Compatibility

**File**: `client/src/pages/AIInterview.jsx` - recording logic

**Problem**: The silence detection uses `AudioContext` + `AnalyserNode` which has varying support:
- Safari may require user gesture to create AudioContext
- `webkitAudioContext` needed for older Safari
- Mobile browsers handle mic permissions differently

**Fix**: Add feature detection and graceful fallback:
```javascript
try {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  audioContextRef.current = new AudioCtx();
} catch (error) {
  console.warn("AudioContext not supported, disabling silence detection");
  // Fall back to manual stop button only
}
```

---

### ISSUE #11: Missing Environment Variables in .env.example

**File**: `server/.env.example`

**Problem**: The `.env.example` does not document voice service URLs. New developers won't know these services exist or what ports to use.

**Missing variables**:
```bash
# Voice Services (AI Interview)
VOICE_SERVICE_URL=http://localhost:5001     # Whisper STT
ML_SERVICE_URL=http://localhost:5001        # Alias for VOICE_SERVICE_URL
CHATTERBOX_SERVICE_URL=http://localhost:5002 # Chatterbox TTS
OPENAI_API_KEY=your_openai_key_here        # Required for interview questions
# ELEVENLABS_API_KEY=                      # DISABLED - not needed
```

---

### ISSUE #12: No Upload Timeout for Voice Answer Submissions

**File**: `client/src/api/interview.api.js` - `submitVoiceAnswer()`

**Problem**: The `fetch()` call for uploading audio has no timeout. On slow networks, the request hangs indefinitely.

**Fix**: Add AbortController timeout:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s
const response = await fetch(url, { ...options, signal: controller.signal });
clearTimeout(timeoutId);
```

---

### ISSUE #13: AI Response JSON Parsing is Fragile

**File**: `server/services/interview.service.js` - `parseAIResponse()`

**Problem**: The regex `/\{[\s\S]*\}/` used to extract JSON from AI responses is greedy. If the AI response contains multiple JSON objects or markdown code blocks, it may extract the wrong one or an incomplete object.

**Fix**: Use balanced-brace parsing or try multiple extraction strategies:
1. Try `JSON.parse(fullResponse)` first
2. Try extracting from markdown code blocks: `` ```json...``` ``
3. Use balanced-brace counting for extraction
4. Log failures for debugging

---

## LOW SEVERITY / CLEANUP

### ISSUE #14: Console Log Spam in Production

**Files**: Multiple (voice.routes.js, AIInterview.jsx, interview.controller.js)

**Problem**: Extensive emoji console.log statements throughout:
```javascript
console.log("🔵 Voice-answer route hit!");
console.log("📤 Submitting voice answer:", {sessionId, audioFile});
console.log("🎙️ Using Chatterbox TTS (open-source)");
```

**Fix**: Replace with a proper logger that respects log levels, or strip in production builds.

---

### ISSUE #15: Commented-Out ElevenLabs Code Throughout

**Files**: `server/routes/voice.routes.js` (lines 3, 58, 78-83, 250-251, 324-343)

**Problem**: Large blocks of commented-out ElevenLabs code clutter the file and create confusion about what's active.

**Fix**: Delete all commented-out ElevenLabs code. If needed later, it's in git history.

---

### ISSUE #16: Inconsistent Error Response Formats

**Files**: Multiple server files

**Problem**: Error responses vary between:
```javascript
{ success: false, error: "message" }
{ success: false, error: "code", message: "human readable" }
{ success: false, message: "something" }
```

**Fix**: Standardize on one format across all endpoints.

---

### ISSUE #17: InterviewHistory Pagination Next Button Missing Bounds Check

**File**: `client/src/pages/InterviewHistory.jsx`

**Problem**: `handleNextPage()` increments the skip value without checking if more data exists. Can request empty pages.

**Fix**: Check `pagination.hasMore` before allowing next page navigation.

---

## Priority Fix Order

| Priority | Bug/Issue | Effort | Impact |
|----------|-----------|--------|--------|
| 1 | BUG #1: Duplicate /tts/health route (crashes server) | 5 min | Server crash |
| 2 | BUG #2: Dead ElevenLabs routes (ReferenceError) | 10 min | Server crash |
| 3 | BUG #3: Silent transcription failures | 20 min | Bad UX |
| 4 | ISSUE #4: Timer auto-complete no grace period | 30 min | Data loss |
| 5 | ISSUE #7: Missing useCallback dependencies | 15 min | Stale closures |
| 6 | ISSUE #15: Remove dead ElevenLabs code | 15 min | Code clarity |
| 7 | ISSUE #11: Update .env.example | 10 min | Developer DX |
| 8 | ISSUE #5: Voice upload retry | 45 min | Reliability |
| 9 | ISSUE #8: Startup health checks | 20 min | Ops visibility |
| 10 | ISSUE #9: Audio race condition | 20 min | UI bugs |

**Estimated total fix time**: ~3-4 hours for all issues

---

## Services Status Summary

| Service | Port | Status | Notes |
|---------|------|--------|-------|
| Express API | 5000 | Active | Main backend |
| React Dev | 5173 | Active | Vite dev server |
| Whisper STT | 5001 | Requires manual start | `voice-service/start.sh` |
| Chatterbox TTS | 5002 | Requires manual start | `chatterbox-service/start.sh` |
| ElevenLabs | N/A | DISABLED | Payment issues, all routes return 503 |
| Browser TTS | N/A | Always available | Web Speech API fallback |
