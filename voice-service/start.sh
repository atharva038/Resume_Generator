#!/bin/bash

# Voice Service Startup Script
# For AI Interview voice transcription (Whisper)

echo "🎙️ Starting Voice Transcription Service..."
echo "================================================"

# Navigate to voice-service directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Check for FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo ""
    echo "⚠️  WARNING: FFmpeg not found!"
    echo "   Whisper requires FFmpeg for audio processing."
    echo ""
    echo "   Install with:"
    echo "   - macOS: brew install ffmpeg"
    echo "   - Ubuntu: sudo apt install ffmpeg"
    echo ""
fi

# Set model size (default: base)
export WHISPER_MODEL_SIZE=${WHISPER_MODEL_SIZE:-base}

echo ""
echo "🚀 Starting service on http://localhost:5001"
echo "   Whisper model: $WHISPER_MODEL_SIZE"
echo "================================================"
echo ""

# Run the Flask app
python app.py
