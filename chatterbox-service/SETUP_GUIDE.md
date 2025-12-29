# Chatterbox TTS Setup Guide

## ⚠️ Python Version Compatibility Issue

**Current Issue**: Python 3.13 has compatibility issues with some dependencies (setuptools, pkg_resources).

**Solutions** (choose one):

### Option 1: Use Python 3.11 or 3.12 (Recommended)

```bash
# Install Python 3.11 or 3.12 using Homebrew
brew install python@3.11

# Create virtual environment with specific Python version
cd chatterbox-service
rm -rf venv
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Start service
python app.py
```

### Option 2: Use Conda (Also Recommended)

```bash
# Create conda environment with Python 3.11
conda create -n chatterbox python=3.11 -y
conda activate chatterbox

# Navigate to service directory
cd chatterbox-service

# Install dependencies
pip install -r requirements.txt

# Start service
python app.py
```

### Option 3: Use Docker (Easiest - Coming Soon)

```bash
cd chatterbox-service
docker build -t chatterbox-tts .
docker run -p 5002:5002 chatterbox-tts
```

## Quick Start (After Python Version Fixed)

```bash
cd chatterbox-service
bash start.sh
```

The service will start on `http://localhost:5002`

## Testing the Service

### 1. Health Check

```bash
curl http://localhost:5002/health
```

Expected response:
```json
{
  "status": "healthy",
  "chatterbox_available": true,
  "model_type": "turbo",
  "device": "cuda",
  "service": "Chatterbox TTS Service"
}
```

### 2. Test TTS Synthesis

```bash
curl -X POST http://localhost:5002/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello! This is a test of the Chatterbox text-to-speech system."
  }' \
  --output test-speech.wav

# Play the audio
afplay test-speech.wav  # macOS
# or
aplay test-speech.wav   # Linux
```

## Integration Status

✅ **Completed**:
- Created Chatterbox Flask service (`chatterbox-service/app.py`)
- Created Node.js service wrapper (`server/services/chatterbox.service.js`)
- Updated voice routes to use Chatterbox → ElevenLabs → Browser TTS priority
- Added TTS health check endpoint (`/api/voice/tts/health`)
- Browser TTS fallback already working

⏳ **Pending**:
- Install service with compatible Python version
- Test end-to-end TTS generation
- (Optional) Create voice reference audio for cloning

## Current TTS Priority Chain

The system automatically tries services in this order:

1. **Chatterbox** (Port 5002)
   - Free, open-source
   - High quality
   - Requires: Python service running

2. **ElevenLabs** (Cloud API)
   - Paid service (currently has payment issue)
   - Excellent quality
   - Requires: API key

3. **Browser TTS** (Frontend fallback)
   - Free, no setup needed
   - Good quality
   - Always available

## How It Works Now

### Without Chatterbox Running:

```
User → Frontend → Backend API → ❌ Chatterbox (offline)
                              → ❌ ElevenLabs (payment issue)
                              → ✅ Browser TTS (works!)
```

### With Chatterbox Running:

```
User → Frontend → Backend API → ✅ Chatterbox (free, high quality!)
```

## Advantages of Chatterbox

| Feature | Chatterbox | ElevenLabs | Browser TTS |
|---------|-----------|-----------|-------------|
| **Cost** | 🆓 Free | 💰 $5-330/mo | 🆓 Free |
| **Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Privacy** | ✅ Local | ❌ Cloud | ✅ Local |
| **Voice Cloning** | ✅ Yes | ✅ Yes | ❌ No |
| **Languages** | 23+ | 29+ | 50+ |
| **Latency** | 200-500ms | 100-300ms | 50-200ms |
| **Setup** | Medium | Easy | None |

## Troubleshooting

### Python 3.13 Issues

If you see:
```
AttributeError: module 'pkgutil' has no attribute 'ImpImporter'
```

**Solution**: Use Python 3.11 or 3.12 (see Option 1 or 2 above)

### Module Not Found Errors

```bash
cd chatterbox-service
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### Out of Memory (GPU)

- Use Turbo model (default, smaller)
- Use CPU mode: `export CUDA_VISIBLE_DEVICES=""`
- Close other GPU applications

### Slow Generation

- Use GPU if available
- Turbo model is optimized for speed
- First generation is slower (model loading)

## Alternative: Use Existing Browser TTS

Your AI Interview feature **already works** with browser TTS as a fallback! 

If you don't want to set up Chatterbox right now:
- ✅ Browser TTS is already enabled and working
- ✅ No setup required
- ✅ Works on all modern browsers
- ✅ Quality is good (not as premium as Chatterbox/ElevenLabs but acceptable)

## Next Steps

Choose one:

1. **Quick Solution**: Keep using browser TTS (already working!)
   - No additional setup needed
   - Good enough for most use cases

2. **Best Quality (Free)**: Set up Chatterbox
   - Install Python 3.11/3.12
   - Run `chatterbox-service/start.sh`
   - Get high-quality TTS for free

3. **Premium Quality (Paid)**: Fix ElevenLabs
   - Update payment method
   - Pay outstanding invoice
   - Best voice quality

## Testing Current Setup

Test what's currently working:

```bash
# 1. Check TTS services status
curl http://localhost:5000/api/voice/tts/health

# 2. Test in the browser
# - Go to AI Interview
# - Start a Live Mode interview
# - Should use browser TTS (listen for voice)
```

## Environment Variables

Add to `.env` in `server/`:

```bash
# Chatterbox service URL (optional, defaults to localhost:5002)
CHATTERBOX_SERVICE_URL=http://localhost:5002

# Default voice reference for cloning (optional)
DEFAULT_VOICE_REF=/path/to/reference/voice.wav

# ElevenLabs (optional, for fallback)
ELEVENLABS_API_KEY=your_key_here
```

## Resources

- [Chatterbox GitHub](https://github.com/resemble-ai/chatterbox)
- [Python Version Manager (pyenv)](https://github.com/pyenv/pyenv)
- [Conda Installation](https://docs.conda.io/en/latest/miniconda.html)
