# Voice Transcription Service

This microservice provides voice-to-text transcription using OpenAI's Whisper model for the AI Interview feature.

## Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python packages
pip install -r requirements.txt
```

### 2. Install FFmpeg (Required)

Whisper requires FFmpeg for audio processing:

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html and add to PATH
```

### 3. Run the Service

```bash
python app.py
```

The service will start on `http://localhost:5001`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WHISPER_MODEL_SIZE` | `base` | Whisper model size: `tiny`, `base`, `small`, `medium`, `large` |

**Model Size vs Performance:**
- `tiny`: Fastest, least accurate (~1GB VRAM)
- `base`: Good balance for interviews (~1GB VRAM) ⭐ Recommended
- `small`: Better accuracy (~2GB VRAM)
- `medium`: High accuracy (~5GB VRAM)
- `large`: Best accuracy (~10GB VRAM)

## API Endpoints

### Health Check
```
GET /health
```
Returns service status and Whisper availability.

### Transcription Health
```
GET /transcribe/health
```
Returns transcription capabilities and limits.

### Transcribe Audio
```
POST /transcribe
Content-Type: multipart/form-data
```

**Request:**
- `audio`: Audio file (wav, mp3, m4a, webm, ogg, flac)
- `language` (optional): Language hint (e.g., "en", "es")

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Transcribed text here...",
    "language": "en",
    "duration": 45.2,
    "wordCount": 120
  }
}
```

**Limits:**
- Max file size: 10MB
- Max duration: 90 seconds

## Integration with Main Server

The main Node.js server proxies transcription requests to this service. Make sure:

1. This service is running on port 5001
2. Set `ML_SERVICE_URL=http://localhost:5001` in the main server's `.env`

## Troubleshooting

### Whisper not loading
- Ensure you have enough RAM/VRAM for the model size
- Try a smaller model: `WHISPER_MODEL_SIZE=tiny python app.py`

### FFmpeg errors
- Verify FFmpeg is installed: `ffmpeg -version`
- Ensure it's in your system PATH

### CUDA errors (GPU)
- Whisper will fall back to CPU if CUDA is unavailable
- For GPU acceleration, install PyTorch with CUDA support
