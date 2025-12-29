# Chatterbox TTS Service

Open-source text-to-speech service using Chatterbox for the AI Interview feature.

## Overview

Chatterbox is a state-of-the-art open-source TTS model by Resemble AI that provides:
- ✅ **Free and Open Source** (MIT License)
- ✅ **High-Quality Voice Synthesis** (comparable to ElevenLabs)
- ✅ **Voice Cloning** from reference audio
- ✅ **Low Latency** with Turbo model (350M parameters)
- ✅ **Multilingual Support** (23+ languages)
- ✅ **Paralinguistic Tags** ([laugh], [chuckle], [cough])
- ✅ **Built-in Watermarking** for responsible AI

## Requirements

- **Python 3.11** (recommended, works on 3.8+)
- **GPU with CUDA** (recommended for best performance)
  - CPU mode works but is slower
  - Turbo model: ~2GB VRAM
  - Standard model: ~3GB VRAM
- **~500MB disk space** for model download

## Installation

### Quick Start

```bash
cd chatterbox-service
bash start.sh
```

The script will automatically:
1. Create a Python virtual environment
2. Install all dependencies (including ~350MB model)
3. Start the Flask server on port 5002

### Manual Setup

```bash
cd chatterbox-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start service
python app.py
```

## Usage

### Health Check

```bash
curl http://localhost:5002/health
```

Response:
```json
{
  "status": "healthy",
  "chatterbox_available": true,
  "model_type": "turbo",
  "device": "cuda",
  "service": "Chatterbox TTS Service"
}
```

### Synthesize Speech

```bash
curl -X POST http://localhost:5002/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hi there, Sarah here from MochaFone calling you back [chuckle], have you got one minute to chat?"
  }' \
  --output test.wav
```

### With Custom Voice (Voice Cloning)

```bash
curl -X POST http://localhost:5002/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello! This is my cloned voice.",
    "audio_prompt_path": "/path/to/reference/voice.wav"
  }' \
  --output test-cloned.wav
```

**Note**: Reference audio should be:
- 5-15 seconds long
- Clear speech (minimal background noise)
- WAV, MP3, or other common formats

### Multilingual (Optional)

To use multilingual model, set environment variable:

```bash
export CHATTERBOX_MODEL=multilingual
python app.py
```

Then specify language in request:

```bash
curl -X POST http://localhost:5002/tts/synthesize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour, comment ça va?",
    "language": "fr"
  }' \
  --output test-french.wav
```

## Configuration

### Environment Variables

- `CHATTERBOX_MODEL`: Model type (`turbo`, `standard`, `multilingual`)
  - Default: `turbo` (recommended for speed)
- `DEFAULT_VOICE_REF`: Path to default reference audio for voice cloning
  - Optional, can be provided per request

### Model Selection

| Model | Size | Languages | Features | Best For |
|-------|------|-----------|----------|----------|
| **Turbo** | 350M | English | Fast, paralinguistic tags | Voice agents, low latency |
| Standard | 500M | English | CFG tuning, exaggeration | General TTS, creative |
| Multilingual | 500M | 23+ | Zero-shot cloning | Global apps |

**Recommended**: Use `turbo` for best performance and lowest latency.

## API Endpoints

### `GET /health`
Check service status and model availability.

### `POST /tts/synthesize`
Synthesize speech from text.

**Request Body**:
```json
{
  "text": "Text to speak",
  "audio_prompt_path": "/path/to/voice.wav",  // optional
  "language": "en"  // optional, for multilingual
}
```

**Response**: Audio file (WAV format)

### `GET /tts/voices`
Get information about voice options.

## Paralinguistic Tags

Chatterbox-Turbo supports natural expressions:

```python
text = "That's hilarious [laugh]! But seriously [pause], we need to focus."
```

Available tags:
- `[laugh]`, `[chuckle]`, `[giggle]`
- `[cough]`, `[sigh]`
- `[pause]`, `[breath]`

## Performance

### Latency

- **Turbo model**: ~200-500ms (GPU) / ~2-5s (CPU)
- **Standard model**: ~500ms-1s (GPU) / ~5-10s (CPU)

### Memory Usage

- **Turbo**: ~2GB VRAM (GPU) / ~3GB RAM (CPU)
- **Standard**: ~3GB VRAM (GPU) / ~4GB RAM (CPU)

### Optimization Tips

1. **Use GPU**: 10-20x faster than CPU
2. **Use Turbo model**: Optimized for low latency
3. **Batch requests**: Process multiple texts together
4. **Cache voices**: Reuse reference audio paths

## Integration with Node.js Backend

The Node.js backend will call this service similar to how it calls the voice-service:

```javascript
// server/services/chatterbox.service.js
const CHATTERBOX_URL = process.env.CHATTERBOX_SERVICE_URL || 'http://localhost:5002';

async function textToSpeech(text, options = {}) {
  const response = await fetch(`${CHATTERBOX_URL}/tts/synthesize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      audio_prompt_path: options.voiceRef,
      language: options.language || 'en'
    })
  });
  
  return response.blob();
}
```

## Troubleshooting

### Model download fails
- Check internet connection
- Models download from Hugging Face (~350-500MB)
- Try manual download: `python -c "from chatterbox.tts_turbo import ChatterboxTurboTTS; ChatterboxTurboTTS.from_pretrained()"`

### Out of memory (GPU)
- Use Turbo model (smaller)
- Reduce batch size
- Use CPU mode: `export CUDA_VISIBLE_DEVICES=""`

### Audio quality issues
- Provide reference audio (10+ seconds recommended)
- Ensure reference audio is clear (no background noise)
- Try different reference speakers

### Slow generation
- Use GPU if available
- Use Turbo model
- Check `watch nvidia-smi` for GPU utilization

## Comparison: Chatterbox vs ElevenLabs

| Feature | Chatterbox (Turbo) | ElevenLabs |
|---------|-------------------|------------|
| **Cost** | 🆓 Free | 💰 $5-330/month |
| **Quality** | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Outstanding |
| **Latency** | 200-500ms (GPU) | 100-300ms |
| **Voice Cloning** | ✅ Yes | ✅ Yes |
| **Privacy** | ✅ Local (no data sent) | ❌ Cloud-based |
| **Languages** | 23+ (multilingual) | 29+ |
| **Setup** | 📦 Medium | 🔑 API key only |
| **Hardware** | GPU recommended | None needed |

**Verdict**: Chatterbox is an excellent free alternative with comparable quality!

## Resources

- [Chatterbox GitHub](https://github.com/resemble-ai/chatterbox)
- [Demo Page](https://resemble-ai.github.io/chatterbox_turbo_demopage/)
- [Hugging Face Demo](https://huggingface.co/spaces/ResembleAI/chatterbox-turbo-demo)
- [Discord Community](https://discord.gg/rJq9cRJBJ6)

## License

Chatterbox is released under the MIT License.
