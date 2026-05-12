#!/bin/bash

# Chatterbox TTS Service Startup Script
# For AI Interview text-to-speech (open-source alternative to ElevenLabs)

echo "🎙️ Starting Chatterbox TTS Service..."
echo "================================================"

# Navigate to chatterbox-service directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check Python version used by the virtual environment
PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
echo "🐍 Python version: $PYTHON_VERSION"

if [[ "$PYTHON_VERSION" == "3.13" ]]; then
    echo "⚠️  WARNING: Python 3.13 detected"
    echo "   Chatterbox works best with Python 3.11 or 3.12"
    echo "   You may encounter compatibility issues"
    echo ""
fi

# Upgrade pip and install setuptools first
echo "📥 Upgrading pip and setuptools..."
pip install --quiet --upgrade pip setuptools wheel

# Install/upgrade dependencies
echo "📥 Installing dependencies..."
echo "   This may take a while on first run (downloading model ~350MB-500MB)..."
pip install --quiet -r requirements.txt

# Check for GPU support
if python3 -c "import torch; print(torch.cuda.is_available())" 2>/dev/null | grep -q "True"; then
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
python app.py
