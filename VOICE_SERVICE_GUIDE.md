# Voice Service Guide

## Overview
The AI Interview feature uses two voice services:
1. **Speech-to-Text (STT)**: Whisper (via Python Flask service on port 5001)
2. **Text-to-Speech (TTS)**: Chatterbox → ElevenLabs → Browser TTS (priority chain)

## 🎉 Latest Updates

### ✅ Chatterbox TTS Integration (Open-Source Alternative)

**NEW**: Added Chatterbox as the primary TTS provider!
- 🆓 **Free and open-source** (MIT License)
- ⭐ **High-quality** voice synthesis
- 🎭 **Voice cloning** from reference audio
- 🌍 **23+ languages** supported
- 💻 **Runs locally** (privacy-first)
- ⚡ **Low latency** with Turbo model

**Status**: Code ready, requires Python 3.11/3.12 setup

### TTS Priority Chain

The system automatically tries services in this order:

```
1. Chatterbox (port 5002) - Free, high quality
   ↓ if unavailable
2. ElevenLabs (API) - Paid, premium quality
   ↓ if unavailable
3. Browser TTS - Free, always works
```

## Quick Status Check

```bash
# Check all TTS services status
curl http://localhost:5000/api/voice/tts/health
```

Response shows which providers are available:
```json
{
  "providers": {
    "chatterbox": { "available": false, "priority": 1, "cost": "free" },
    "elevenlabs": { "available": false, "priority": 2, "cost": "paid" },
    "browser": { "available": true, "priority": 3, "cost": "free" }
  },
  "recommended": "browser"
}
```

## Setup Instructions

### 🎙️ Setting Up Chatterbox TTS (Recommended)

Chatterbox provides free, high-quality TTS as an alternative to ElevenLabs.

**⚠️ Important**: Requires Python 3.11 or 3.12 (Python 3.13 has compatibility issues)

#### Option 1: Use Python 3.11/3.12

```bash
# Install Python 3.11 (if not installed)
brew install python@3.11

# Set up Chatterbox
cd chatterbox-service
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Start service
python app.py
```

#### Option 2: Use Conda

```bash
# Create environment with Python 3.11
conda create -n chatterbox python=3.11 -y
conda activate chatterbox

cd chatterbox-service
pip install -r requirements.txt
python app.py
```

**See `chatterbox-service/SETUP_GUIDE.md` for detailed instructions and troubleshooting**

### 🎤 Setting Up Whisper STT (For Voice Recording)

#### Using the startup script:
```bash
cd voice-service
bash start.sh
```

#### Manual setup:
```bash
cd voice-service

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the service
python app.py
```

#### Prerequisites:
1. **Python 3.8+** installed
2. **FFmpeg** installed (required by Whisper):
   ```bash
   # macOS
   brew install ffmpeg
   
   # Ubuntu/Debian
   sudo apt install ffmpeg
   ```

## Issues Resolved

### 1. ✅ Added Chatterbox Open-Source TTS
**Solution**: Integrated Chatterbox as primary TTS provider
- Free alternative to ElevenLabs
- High-quality voice synthesis
- Voice cloning support
- Runs locally for privacy

**Implementation**:
- `chatterbox-service/`: New Flask service for Chatterbox TTS
- `server/services/chatterbox.service.js`: Node.js integration
- `server/routes/voice.routes.js`: Priority chain (Chatterbox → ElevenLabs → Browser)

### 2. ✅ ElevenLabs Payment Issue - Browser TTS Fallback
**Problem**: ElevenLabs subscription has payment issues, causing 401 errors.

**Solution**: Implemented automatic fallback to browser's built-in Web Speech API
- When ElevenLabs fails, the app automatically uses browser TTS
- No user intervention required - seamless fallback
- Works in all modern browsers (Chrome, Edge, Safari, Firefox)

**Code Changes**:
- `client/src/pages/AIInterview.jsx`: Added Web Speech API fallback in `speakAndListen()`
- `server/routes/voice.routes.js`: Improved error handling with priority chain

### 3. Voice Transcription Service (Port 5001 Issue)
**Problem**: Connection refused to `http://localhost:5001`

**Causes**:
- Voice service (Flask + Whisper) is not running
- Port 5001 is blocked or used by another process

**Solution**: Start the voice service (see setup instructions above)
   sudo apt install ffmpeg
   ```

## Checking Service Status

### Check if port 5001 is in use:
```bash
lsof -i :5001
```

### Test the voice service:
```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "status": "healthy",
  "whisper_available": true,
  "whisper_model": "base",
  "service": "Voice Transcription Service"
}
```

## TTS Options (If You Want to Fix ElevenLabs)

### Option 1: Fix ElevenLabs Payment ✅
1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/)
2. Navigate to Billing section
3. Update payment method
4. Pay outstanding invoice

### Option 2: Use Browser TTS (Current Fallback) 🆓
**Pros**:
- Free and built into browsers
- No API keys needed
- Works offline
- Automatic fallback (already implemented)

**Cons**:
- Voice quality not as good as ElevenLabs
- Limited voice customization
- Sounds more robotic

### Option 3: Alternative TTS Services

#### Google Cloud Text-to-Speech
- **Cost**: Free tier (1M characters/month), then $4-16 per 1M chars
- **Quality**: Very good, natural voices
- **Setup**: Requires Google Cloud account + API key
- [Documentation](https://cloud.google.com/text-to-speech)

#### Azure Cognitive Services (Speech)
- **Cost**: Free tier (0.5M chars/month), then $4-16 per 1M chars
- **Quality**: Excellent, neural voices
- **Setup**: Requires Azure account + API key
- [Documentation](https://azure.microsoft.com/en-us/products/ai-services/text-to-speech)

#### OpenAI TTS API
- **Cost**: $15 per 1M characters (tts-1), $30 per 1M (tts-1-hd)
- **Quality**: Very good
- **Setup**: Requires OpenAI API key (you may already have this!)
- [Documentation](https://platform.openai.com/docs/guides/text-to-speech)

## Current Architecture

```
┌──────────────────────────────────────────────────┐
│            Frontend (React)                      │
│   - AI Interview Component                       │
│   - Voice Recording (WebRTC)                     │
│   - Audio Playback                               │
│   - Browser TTS Fallback (Web Speech API)        │
└────────────┬─────────────────────────────────────┘
             │
             │  HTTP/REST
             ▼
┌──────────────────────────────────────────────────┐
│         Node.js Backend (port 5000)              │
│                                                  │
│  Priority Chain:                                 │
│  1. Try Chatterbox TTS (port 5002)              │
│  2. Try ElevenLabs API (cloud)                  │
│  3. Return 503 → Frontend uses Browser TTS      │
│                                                  │
│  Services:                                       │
│  - chatterbox.service.js                        │
│  - elevenlabs.service.js                        │
│  - voice.routes.js                              │
└────┬─────────────────┬──────────────────────────┘
     │                 │
     │                 │
     ▼                 ▼
┌─────────────────┐  ┌──────────────────────────┐
│ Chatterbox TTS  │  │ Whisper STT              │
│ (port 5002)     │  │ (port 5001)              │
│                 │  │                          │
│ - Flask API     │  │ - Flask API              │
│ - Chatterbox    │  │ - OpenAI Whisper         │
│ - Voice Cloning │  │ - Audio Processing       │
│ - 23+ Languages │  │                          │
│ Status: ⏳ Setup│  │ Status: ⏳ Optional      │
└─────────────────┘  └──────────────────────────┘

┌─────────────────┐  ┌──────────────────────────┐
│ ElevenLabs API  │  │ Browser TTS              │
│ (Cloud)         │  │ (Frontend)               │
│                 │  │                          │
│ Status:         │  │ - Web Speech API         │
│ 💰 Payment Issue│  │ - Always Available       │
└─────────────────┘  │ Status: ✅ Working      │
                     └──────────────────────────┘
```

## TTS Service Comparison

| Service | Status | Cost | Quality | Setup | Best For |
|---------|--------|------|---------|-------|----------|
| **Chatterbox** | ⏳ Ready to deploy | 🆓 Free | ⭐⭐⭐⭐ | Medium | Production (free) |
| **ElevenLabs** | ❌ Payment issue | 💰 $5-330/mo | ⭐⭐⭐⭐⭐ | Easy | Production (paid) |
| **Browser TTS** | ✅ Working now | 🆓 Free | ⭐⭐⭐ | None | Fallback/Testing |

## Recommended TTS Options

### Option 1: Deploy Chatterbox (Best Free Option) 🏆

**Pros**:
- Completely free and open-source
- High quality (comparable to ElevenLabs)
- Privacy-first (runs locally)
- Voice cloning support
- No API limits or costs

**Cons**:
- Requires Python 3.11/3.12 setup
- Needs ~2GB RAM/VRAM
- Initial model download (~350MB)

**Setup Time**: 10-15 minutes

**See**: `chatterbox-service/SETUP_GUIDE.md`

### Option 2: Keep Browser TTS (Simplest)

**Pros**:
- Already working!
- No setup required
- No costs
- No dependencies

**Cons**:
- Lower quality than Chatterbox/ElevenLabs
- More robotic voice
- Limited customization

**Setup Time**: 0 minutes (already done!)

### Option 3: Fix ElevenLabs (Premium Quality)

**Pros**:
- Best voice quality
- Lowest latency
- Most natural-sounding
- Professional features

**Cons**:
- Costs $5-330/month
- Requires payment fix
- Cloud dependency

**Setup Time**: 5 minutes (fix payment)

### Option 4: Alternative TTS Services

#### OpenAI TTS API
- **Cost**: $15 per 1M characters (tts-1), $30 per 1M (tts-1-hd)
- **Quality**: Very good
- **Setup**: Requires OpenAI API key (you may already have this!)
- [Documentation](https://platform.openai.com/docs/guides/text-to-speech)
              ▼
┌─────────────────────────┐
│   ElevenLabs API        │
│   (elevenlabs.io)       │
│                         │
│  Status: 💰 Payment Issue│
│  Fallback: ✅ Active    │
└─────────────────────────┘
```

## Testing the Interview Feature

### 1. Test Text Mode (No Voice Services Required)
- Select "Text Mode" in interview setup
- Type your answers
- No TTS or STT needed

### 2. Test Live Mode with Browser TTS
- Start voice service: `cd voice-service && bash start.sh`
- Select "Live Mode" in interview setup
- Browser TTS will be used automatically (since ElevenLabs is down)
- Voice recording will use Whisper

### 3. Test Voice Transcription
```bash
# In voice-service terminal, you should see logs like:
🎙️ Voice Transcription Service for AI Interview
Whisper model: ✅ base
📡 Starting Flask server on http://localhost:5001
```

## Troubleshooting

### Voice service won't start
1. Check if port 5001 is in use: `lsof -i :5001`
2. Kill the process: `kill -9 <PID>`
3. Try again: `bash start.sh`

### Whisper not working
1. Check FFmpeg: `ffmpeg -version`
2. Reinstall Whisper: `pip install --upgrade openai-whisper`

### Browser TTS not working
- Try a different browser (Chrome recommended)
- Check browser console for errors
- Some browsers need user interaction first

### TTS still using ElevenLabs (not falling back)
- Clear browser cache
- Check server logs for TTS errors
- Verify changes are deployed

## Next Steps

1. ✅ **Current**: Browser TTS fallback is working
2. ⏳ **Short-term**: Start voice service for STT (if needed)
3. 🎯 **Long-term**: Choose permanent TTS solution:
   - Fix ElevenLabs payment OR
   - Switch to alternative service OR
   - Use browser TTS permanently (free!)

## Environment Variables

```bash
# .env in server/
ELEVENLABS_API_KEY=your_key_here  # Optional if using fallback
VOICE_SERVICE_URL=http://localhost:5001
```

## Contact & Support
- ElevenLabs Support: https://help.elevenlabs.io/
- Whisper GitHub: https://github.com/openai/whisper
