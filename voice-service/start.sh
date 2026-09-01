#!/bin/bash

# Voice Service Startup Script
# For AI Interview voice transcription (Whisper)

echo "🎙️ Starting Voice Transcription Service..."
echo "================================================"

# Navigate to voice-service directory
cd "$(dirname "$0")"

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 is not installed or not in PATH."
    exit 1
fi

# Check if existing virtual environment is broken or missing
RECREATE_VENV=0
if [ ! -d "venv" ]; then
    RECREATE_VENV=1
elif ! venv/bin/python3 -c "import sys" &> /dev/null; then
    echo "⚠️  Existing virtual environment is broken or has moved paths."
    rm -rf venv
    RECREATE_VENV=1
fi

if [ $RECREATE_VENV -eq 1 ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip and install dependencies
echo "📥 Installing dependencies..."
venv/bin/pip install --quiet --upgrade pip setuptools wheel
venv/bin/pip install -q -r requirements.txt

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
venv/bin/python3 app.py

