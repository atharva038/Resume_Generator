#!/bin/bash

# Chatterbox TTS Service Startup Script
# For AI Interview text-to-speech (open-source alternative to ElevenLabs)

echo "🎙️ Starting Chatterbox TTS Service..."
echo "================================================"

# Navigate to chatterbox-service directory
cd "$(dirname "$0")"

# Check if python3 is available on the system
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

# Check Python version used by the virtual environment
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
echo "🐍 Python version: $PYTHON_VERSION"

if [[ "$PYTHON_VERSION" == "3.13" ]]; then
    echo "⚠️  WARNING: Python 3.13 detected"
    echo "   Chatterbox works best with Python 3.11 or 3.12"
    echo "   You may encounter compatibility issues"
    echo ""
fi

# Upgrade pip and install setuptools first
echo "📥 Upgrading pip and setuptools..."
venv/bin/pip install --quiet --upgrade pip setuptools wheel

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
echo "   This may take a while on first run (downloading model ~350MB-500MB)..."
venv/bin/pip install -r requirements.txt

# Check for GPU support
if venv/bin/python3 -c "import torch; print(torch.cuda.is_available())" 2>/dev/null | grep -q "True"; then
    echo ""
    echo "✅ GPU detected - will use CUDA acceleration"
    DEVICE="cuda"
else
    echo ""
    echo "⚠️  No GPU detected - will use CPU (slower)"
    echo "   For better performance, use a CUDA-capable GPU"
    DEVICE="cpu"
fi

# Set model type (turbo is fastest and most efficient)
export CHATTERBOX_MODEL=${CHATTERBOX_MODEL:-turbo}

echo ""
echo "🚀 Starting service on http://localhost:5002"
echo "   Model: $CHATTERBOX_MODEL"
echo "   Device: $DEVICE"
echo "================================================"
echo ""

# Run the Flask app
venv/bin/python3 app.py

